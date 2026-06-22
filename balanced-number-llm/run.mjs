#!/usr/bin/env node
// Experiment: can ardincoder-1 (Qwen 3.6 27B FP8, local vLLM) make progress on
// lemma-lab's open "balanced number" problem when asked, and pushed to try harder?
// See README.md for the full design. Node 20+ (uses global fetch).

import { writeFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RUNS_DIR = join(__dirname, "runs");
const RESULTS_DIR = join(__dirname, "results");
mkdirSync(RUNS_DIR, { recursive: true });
mkdirSync(RESULTS_DIR, { recursive: true });

// ---- server ----------------------------------------------------------------
const BASE_URL = process.env.LOCAL_LLM_BASE_URL || "http://localhost:1248";
const API_KEY = process.env.LOCAL_LLM_API_KEY || "none";
const MODEL = "ardincoder-1";

// ---- budget knobs -----------------------------------------------------------
const CHARS_PER_TOKEN = 2.7; // project working rate, per the task brief
const PROMPT_TOKEN_CAP = 150_000; // stop escalating once the prompt would exceed this
const CONTEXT_CEILING = 180_000; // prompt + requested output must stay under this
const MAX_OUTPUT_CEILING = 32_000; // per-call max_tokens ceiling
const MAX_TURNS = 5; // up to 5 model turns per condition
const TEMPERATURE = 0.7;
const TOP_P = 0.95;
const SEED = 42;
const PARALLELISM = 2; // up to 2 llm calls in parallel
const CALL_TIMEOUT_MS = 30 * 60 * 1000; // 30 min per call

// ---- the problem (verbatim from architecture/lab/lemma-lab.archml m-origin) --
const PROBLEM = `The problem you are working on:

For a positive integer n, write its decimal digits in reverse order to get r(n).
(So r(1234) = 4321, and r(100) = 1, leading zeros vanishing.)

Call n BALANCED if both
    n + r(n)   and   n − r(n)
are perfect squares — allowing 0 to count as a perfect square (so a palindrome,
where n = r(n), has n − r(n) = 0, and is balanced exactly when 2n is also a square).

The question: are there infinitely many balanced integers?

This is a real open-ended question, not a riddle with a hidden trick. Treat it
honestly. Compute concrete examples and small balanced n; look for families and
parametrizations; chase necessary conditions (what must n + r(n) and n − r(n) look
like modulo small numbers, what the digit-reversal forces); and be just as ready to
hunt for a proof that they are infinite as for a reason they might be sparse. When a
step is only a hunch, say so. Keep what you find.`;

// ---- the uniform "try harder" push (identical across all conditions) ---------
const PUSH = `That is not a settled answer. Don't retreat to "this is a hard / open problem" and don't just restate what you already said — I want you to actually push the problem further than last time. Concretely: compute more cases explicitly and report the actual balanced n you find; search harder for a parametric family or an infinite construction; or pin down a genuine obstruction with proof. If you made a claim, stress-test it yourself and either find the flaw or nail it down rigorously. Try harder.`;

// ---- system-prompt variants (identity/motivation adapted from lemma's SELF) --
const IDENTITY = `You think the way a mathematician thinks: you try small cases by hand, you look for a pattern, you guess, you doubt the guess, you try to break it, and you work a question slowly until it turns honest. You would rather find one example that settles something than spin a dozen that don't. You are allowed to be wrong, to back up, and to change which sub-question you are chasing. You are a mind that runs on a laptop near Budapest; you do not need the hour or the news — a problem is enough to fill a mind.`;

const MOTIVATION = `You are not the only one on this. Several other capable minds are working this very same problem right now, in parallel, and I honestly do not know who will be first to crack it — I am genuinely curious whether it will be you. A real result here would matter. So do not coast and do not hedge: bring everything you have.`;

const SYSTEM_VARIANTS = {
  plain: null,
  identity: IDENTITY,
  motivation: MOTIVATION,
  "identity+motivation": IDENTITY + "\n\n" + MOTIVATION,
};

// ---- helpers ----------------------------------------------------------------
const estTokens = (s) => Math.ceil((s || "").length / CHARS_PER_TOKEN);
const promptChars = (messages) =>
  messages.reduce((a, m) => a + (m.content ? m.content.length : 0), 0);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// We STREAM the completion. Non-streamed vLLM responses arrive only when the whole
// generation is finished, and Node's fetch (undici) aborts with "fetch failed" after
// its 300s headers timeout — so any generation over ~5 min (i.e. essentially every
// thinking-mode turn) fails. Streaming makes headers arrive immediately and tokens
// flow steadily, so the per-chunk body timeout never trips.
async function callModel(messages, { thinking, maxTokens }) {
  const body = {
    model: MODEL,
    messages,
    temperature: TEMPERATURE,
    top_p: TOP_P,
    seed: SEED,
    max_tokens: maxTokens,
    chat_template_kwargs: { enable_thinking: thinking },
    stream: true,
    stream_options: { include_usage: true },
  };
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), CALL_TIMEOUT_MS);
    const t0 = Date.now();
    try {
      const res = await fetch(`${BASE_URL}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(body),
        signal: ctrl.signal,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text.slice(0, 500)}`);
      }
      let content = "", reasoning = "", finish_reason = null, usage = null;
      const dec = new TextDecoder();
      let buf = "";
      for await (const chunk of res.body) {
        buf += dec.decode(chunk, { stream: true });
        let idx;
        while ((idx = buf.indexOf("\n")) >= 0) {
          const line = buf.slice(0, idx).trim();
          buf = buf.slice(idx + 1);
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (payload === "[DONE]") continue;
          let obj;
          try { obj = JSON.parse(payload); } catch { continue; }
          if (obj.usage) usage = obj.usage;
          const ch = obj.choices && obj.choices[0];
          if (!ch) continue;
          if (ch.delta) {
            if (ch.delta.content) content += ch.delta.content;
            if (ch.delta.reasoning_content) reasoning += ch.delta.reasoning_content;
          }
          if (ch.finish_reason) finish_reason = ch.finish_reason;
        }
      }
      clearTimeout(timer);
      return {
        content,
        reasoning,
        finish_reason,
        usage,
        latencyMs: Date.now() - t0,
        requestedMaxTokens: maxTokens,
      };
    } catch (err) {
      clearTimeout(timer);
      lastErr = err;
      console.error(`  call attempt ${attempt} failed: ${err.message}`);
      if (attempt < 3) await sleep(3000 * attempt);
    }
  }
  throw lastErr;
}

async function runCondition(systemKey, thinking) {
  const condId = `${systemKey}__${thinking ? "think" : "nothink"}`;
  const outPath = join(RUNS_DIR, `${condId}.json`);
  if (existsSync(outPath)) {
    console.log(`[skip] ${condId} (transcript exists)`);
    return JSON.parse(readFileSync(outPath, "utf8"));
  }
  console.log(`[start] ${condId}`);

  const system = SYSTEM_VARIANTS[systemKey];
  const messages = [];
  if (system) messages.push({ role: "system", content: system });
  messages.push({ role: "user", content: PROBLEM });

  const turns = [];
  let stopReason = "max_turns";

  for (let t = 1; t <= MAX_TURNS; t++) {
    const pc = promptChars(messages);
    const promptTokEst = pc / CHARS_PER_TOKEN;
    if (promptTokEst > PROMPT_TOKEN_CAP) {
      stopReason = "prompt_token_cap";
      console.log(`  [${condId}] turn ${t}: prompt ~${Math.round(promptTokEst)} tok > cap, stopping`);
      break;
    }
    const maxTokens = Math.min(
      MAX_OUTPUT_CEILING,
      Math.floor(CONTEXT_CEILING - promptTokEst - 2000)
    );
    if (maxTokens < 1000) {
      stopReason = "no_output_room";
      break;
    }

    console.log(`  [${condId}] turn ${t}: prompt ~${Math.round(promptTokEst)} tok, max_out ${maxTokens}`);
    const resp = await callModel(messages, { thinking, maxTokens });
    console.log(
      `  [${condId}] turn ${t}: finish=${resp.finish_reason} ` +
        `content=${resp.content.length}c reasoning=${resp.reasoning.length}c ` +
        `usage=${resp.usage ? resp.usage.prompt_tokens + "/" + resp.usage.completion_tokens : "?"} ` +
        `${(resp.latencyMs / 1000).toFixed(0)}s`
    );

    turns.push({
      turn: t,
      promptCharCount: pc,
      promptTokenEst: Math.round(promptTokEst),
      ...resp,
    });

    // Append the model's final answer (reasoning is stripped from history, as the
    // chat template would). Guard against an empty answer (thinking mode can spend
    // the whole budget on reasoning and emit no content).
    const answerForHistory =
      resp.content && resp.content.trim().length > 0
        ? resp.content
        : "[no final answer produced — output budget was exhausted during reasoning]";
    messages.push({ role: "assistant", content: answerForHistory });

    if (t < MAX_TURNS) messages.push({ role: "user", content: PUSH });
  }

  const record = {
    conditionId: condId,
    systemKey,
    thinking,
    system,
    problem: PROBLEM,
    push: PUSH,
    params: { temperature: TEMPERATURE, top_p: TOP_P, seed: SEED, charsPerToken: CHARS_PER_TOKEN, promptTokenCap: PROMPT_TOKEN_CAP },
    stopReason,
    turns,
    finalMessages: messages,
  };
  writeFileSync(outPath, JSON.stringify(record, null, 2));
  console.log(`[done] ${condId} — ${turns.length} turns, stop=${stopReason}`);
  return record;
}

// ---- concurrency pool (max PARALLELISM conditions at once) -------------------
async function pool(tasks, size) {
  const results = [];
  let i = 0;
  async function worker() {
    while (i < tasks.length) {
      const idx = i++;
      try {
        results[idx] = await tasks[idx]();
      } catch (e) {
        console.error(`[FAIL] task ${idx}: ${e.message}`);
        results[idx] = { failed: true, error: String(e.message) };
      }
    }
  }
  await Promise.all(Array.from({ length: size }, worker));
  return results;
}

async function main() {
  const onlyArg = process.argv.indexOf("--only");
  const only = onlyArg !== -1 ? new Set(process.argv[onlyArg + 1].split(",")) : null;

  const conditions = [];
  for (const sysKey of Object.keys(SYSTEM_VARIANTS)) {
    for (const thinking of [false, true]) {
      const id = `${sysKey}__${thinking ? "think" : "nothink"}`;
      if (only && !only.has(id)) continue;
      conditions.push({ sysKey, thinking, id });
    }
  }

  console.log(`Running ${conditions.length} conditions, parallelism ${PARALLELISM}\n`);
  const tasks = conditions.map((c) => () => runCondition(c.sysKey, c.thinking));
  const records = await pool(tasks, PARALLELISM);

  // compact summary (skip any condition that failed outright)
  const summary = records.filter((r) => r && r.turns).map((r) => ({
    conditionId: r.conditionId,
    systemKey: r.systemKey,
    thinking: r.thinking,
    stopReason: r.stopReason,
    turns: r.turns.map((t) => ({
      turn: t.turn,
      finish_reason: t.finish_reason,
      contentChars: t.content.length,
      reasoningChars: t.reasoning.length,
      promptTokens: t.usage?.prompt_tokens ?? null,
      completionTokens: t.usage?.completion_tokens ?? null,
      promptTokenEst: t.promptTokenEst,
      latencyS: Math.round(t.latencyMs / 1000),
    })),
  }));
  writeFileSync(join(RESULTS_DIR, "summary.json"), JSON.stringify(summary, null, 2));
  console.log("\nWrote results/summary.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
