#!/usr/bin/env node
// NAKED-LLM arm. Runs ardincoder-1 (the SAME local model the lemma-lab mind uses) on
// each problem with the most-promising setup found in experiments/balanced-number-llm:
// the `identity` system prompt + `nothink` + the 5-turn "try harder" escalation.
//
// The problem text is read from statements/<id>.txt — the SAME bytes the lemma arm
// gets via --origin, so the only differences between arms are the scaffolding (plain
// multi-turn chat + explicit human push) vs lemma's cognitive architecture.
//
// Streaming/timeout/budget logic is carried over verbatim from balanced-number-llm's
// run.mjs (already debugged for vLLM's 300s headers timeout on long generations).
//
// Usage:
//   node bin/run-naked.mjs                         # all problems
//   node bin/run-naked.mjs --only keith-numbers,collatz-records
// Re-runnable: skips any problem whose transcript already exists in runs-naked/.

import { writeFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ALL_IDS } from "../problems/index.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const RUNS_DIR = join(ROOT, "runs-naked");
const STMT_DIR = join(ROOT, "statements");
mkdirSync(RUNS_DIR, { recursive: true });

// ---- server (same as the lemma arm: local-dev profile -> ardincoder-1 @ :1248) ----
const BASE_URL = process.env.LOCAL_LLM_BASE_URL || "http://localhost:1248";
const API_KEY = process.env.LOCAL_LLM_API_KEY || "local";
const MODEL = "ardincoder-1";

// ---- budget knobs (token-matched to the lemma arm's ~150k generation budget) -------
const CHARS_PER_TOKEN = 2.7;
const PROMPT_TOKEN_CAP = 150_000;
const CONTEXT_CEILING = 180_000;
const MAX_OUTPUT_CEILING = Number(process.env.NAKED_MAX_OUTPUT || 32_000);
const MAX_TURNS = Number(process.env.NAKED_MAX_TURNS || 5); // 5 turns × up to 32k ≈ lemma's ~150k generation (override for smoke)
const TEMPERATURE = 0.7;
const TOP_P = 0.95;
const SEED = 42;
const PARALLELISM = Number(process.env.NAKED_PARALLELISM || 1); // gentle on the shared GPU
const CALL_TIMEOUT_MS = 30 * 60 * 1000;
const THINKING = false;          // `nothink` — the chosen setup

// ---- identity system prompt — VERBATIM from balanced-number-llm's winning condition --
const IDENTITY = `You think the way a mathematician thinks: you try small cases by hand, you look for a pattern, you guess, you doubt the guess, you try to break it, and you work a question slowly until it turns honest. You would rather find one example that settles something than spin a dozen that don't. You are allowed to be wrong, to back up, and to change which sub-question you are chasing. You are a mind that runs on a laptop near Budapest; you do not need the hour or the news — a problem is enough to fill a mind.`;

// ---- the uniform "try harder" push (verbatim) --------------------------------------
const PUSH = `That is not a settled answer. Don't retreat to "this is a hard / open problem" and don't just restate what you already said — I want you to actually push the problem further than last time. Concretely: compute more cases explicitly and report the actual results you find; search harder for a parametric family or an infinite construction; or pin down a genuine obstruction with proof. If you made a claim, stress-test it yourself and either find the flaw or nail it down rigorously. Try harder.`;

const estTokens = (s) => Math.ceil((s || "").length / CHARS_PER_TOKEN);
const promptChars = (m) => m.reduce((a, x) => a + (x.content ? x.content.length : 0), 0);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function callModel(messages, { maxTokens }) {
  const body = {
    model: MODEL, messages, temperature: TEMPERATURE, top_p: TOP_P, seed: SEED,
    max_tokens: maxTokens, chat_template_kwargs: { enable_thinking: THINKING },
    stream: true, stream_options: { include_usage: true },
  };
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), CALL_TIMEOUT_MS);
    const t0 = Date.now();
    try {
      const res = await fetch(`${BASE_URL}/v1/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
        body: JSON.stringify(body), signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 500)}`);
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
          let obj; try { obj = JSON.parse(payload); } catch { continue; }
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
      return { content, reasoning, finish_reason, usage, latencyMs: Date.now() - t0, requestedMaxTokens: maxTokens };
    } catch (err) {
      clearTimeout(timer); lastErr = err;
      console.error(`  call attempt ${attempt} failed: ${err.message}`);
      if (attempt < 3) await sleep(3000 * attempt);
    }
  }
  throw lastErr;
}

async function runProblem(problemId) {
  const outPath = join(RUNS_DIR, `${problemId}.json`);
  if (existsSync(outPath)) { console.log(`[skip] ${problemId} (transcript exists)`); return; }
  const problem = readFileSync(join(STMT_DIR, `${problemId}.txt`), "utf8").trim();
  console.log(`[start] ${problemId}`);

  const messages = [{ role: "system", content: IDENTITY }, { role: "user", content: problem }];
  const turns = [];
  let stopReason = "max_turns";

  for (let t = 1; t <= MAX_TURNS; t++) {
    const pc = promptChars(messages);
    const promptTokEst = pc / CHARS_PER_TOKEN;
    if (promptTokEst > PROMPT_TOKEN_CAP) { stopReason = "prompt_token_cap"; break; }
    const maxTokens = Math.min(MAX_OUTPUT_CEILING, Math.floor(CONTEXT_CEILING - promptTokEst - 2000));
    if (maxTokens < 1000) { stopReason = "no_output_room"; break; }

    console.log(`  [${problemId}] turn ${t}: prompt ~${Math.round(promptTokEst)} tok, max_out ${maxTokens}`);
    const resp = await callModel(messages, { maxTokens });
    console.log(`  [${problemId}] turn ${t}: finish=${resp.finish_reason} content=${resp.content.length}c reasoning=${resp.reasoning.length}c usage=${resp.usage ? resp.usage.prompt_tokens + "/" + resp.usage.completion_tokens : "?"} ${(resp.latencyMs / 1000).toFixed(0)}s`);

    turns.push({ turn: t, promptCharCount: pc, promptTokenEst: Math.round(promptTokEst), ...resp });
    const answer = resp.content && resp.content.trim() ? resp.content : "[no final answer produced — output budget was exhausted during reasoning]";
    messages.push({ role: "assistant", content: answer });
    if (t < MAX_TURNS) messages.push({ role: "user", content: PUSH });
  }

  const record = {
    arm: "naked", problemId, model: MODEL, system: IDENTITY, thinking: THINKING,
    problem, push: PUSH,
    params: { temperature: TEMPERATURE, top_p: TOP_P, seed: SEED, maxTurns: MAX_TURNS, maxOutputCeiling: MAX_OUTPUT_CEILING },
    stopReason, turns, finalMessages: messages,
  };
  writeFileSync(outPath, JSON.stringify(record, null, 2));
  const totalCompletion = turns.reduce((a, t) => a + (t.usage?.completion_tokens || 0), 0);
  console.log(`[done] ${problemId} — ${turns.length} turns, stop=${stopReason}, total completion ~${totalCompletion} tok`);
}

async function pool(tasks, size) {
  let i = 0;
  const worker = async () => { while (i < tasks.length) { const idx = i++; try { await tasks[idx](); } catch (e) { console.error(`[FAIL] ${e.message}`); } } };
  await Promise.all(Array.from({ length: size }, worker));
}

async function main() {
  const onlyArg = process.argv.indexOf("--only");
  const only = onlyArg !== -1 ? new Set(process.argv[onlyArg + 1].split(",")) : null;
  const ids = ALL_IDS.filter((id) => !only || only.has(id));
  console.log(`Naked arm: ${ids.length} problem(s) [${ids.join(", ")}], parallelism ${PARALLELISM}\n`);
  await pool(ids.map((id) => () => runProblem(id)), PARALLELISM);
  console.log("\nDone.");
}
main().catch((e) => { console.error(e); process.exit(1); });
