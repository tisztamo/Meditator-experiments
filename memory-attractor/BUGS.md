# Bugs surfaced during the experiment (vLLM errors Kris flagged 2026-06-22 ~05:50 UTC)

Two DISTINCT vLLM 400 errors appear in run logs. Neither aborts a mind (both are caught), but both
corrupt some runs. NOT hot-patched mid-experiment (would break comparability of the last runs); fix
after, with a test. The first is a genuine bug in the **resident's** code (src/mindComponents/mMemory.js).

## BUG 1 — memory compression requests absurd max_tokens (chars used as a token budget)
**`src/mindComponents/mMemory.js:753`** (inside `compressToFit`):
```js
const guard = source.length + 512   // anti-truncation; never the budget
```
`source.length` is a CHARACTER count, but `guard` is passed straight through as `maxTokens` →
`complete({ maxTokens: guard })` → `max_tokens` to vLLM. So when a memory buffer bloats to ~150k
chars, the call requests ~150k OUTPUT TOKENS; prompt + that exceeds the model's 180000-token window:

    ContextWindowExceededError ... you requested 159607 output tokens and your prompt contains at
    least 20394 input tokens, for a total of at least 180001 tokens.   ← EXACTLY what Kris saw

→ the compression call 400s → caught as "Consolidation failed, keeping raw block for next boundary"
→ the raw (bloated) block is kept → next fold's source is even bigger → **runaway**: once a memory
crosses the threshold it can never compress again.

**Where it bit:** only runs whose memory BLOATED past ~150k chars — i.e. minds that derailed into
text-spewing loops. Overwhelmingly the **Collatz** runs (ml-diff-b2: 249 errors / 87 failed folds;
ml-diff-h1: 30), because Collatz spews 70+ digit numbers and doubling-litanies. The original-problem
gradient and the harder-(balanced)-problem runs have **0** of these errors — their memories never
bloated that far. So the headline findings are unaffected; the **Collatz generality runs are
compromised** (corrupted late-stage memory) and must be caveated.

**Root cause is two-layer:** (a) the char→token dimension error here; (b) the bloat itself (a
degenerate loop piles up text faster than compression holds it, and `nearestToTarget` accepts
over-budget, so `combined` creeps up). (a) turns a gradual over-budget-accept into a HARD failure
that stops all compression.

**Proposed fix** (convert chars→tokens AND cap to the window so it can never 400; let it accept
over-budget rather than fail):
```js
const CTX = Number(process.env.LLM_CONTEXT_LIMIT || 180000)
const promptTokens = Math.ceil(prompt.length / 3)          // ~3 chars/token for this dense text
const guard = Math.min(
  Math.ceil(source.length / 3) + 256,                      // enough to echo source if needed
  Math.max(512, CTX - promptTokens - 512)                  // but never exceed the window
)
```
(Compute `prompt` before `guard`.) Deeper: also bound the buffers so `combined` can't reach 150k —
but that's the stream-level bloat issue, separate from this dimension bug.

## BUG 2 — streaming `continue_final_message` 400 (chat-template strips the prefill)
The stream-of-thought uses an assistant PREFILL (continue the tail). vLLM intermittently 400s:

    OpenAIException - continue_final_message is set but the final message does not appear in the chat
    after applying the chat template! ... the chat template deletes portions of the final message.

→ "stream open failed status=400" → that burst is lost. **Concentrated in ml-hard-g2 (294×)** —
so that one run's stream was failing ~constantly and its behaviour/onset is likely an ARTIFACT, not
intrinsic. A few other runs have 1–3. Likely triggered when the prefill (tail) ends in content the
chat template trims (trailing whitespace / certain tokens). Needs a runtime look (llm.js stream path
+ the local model's chat template); a fallback when continueFinal fails (retry as a normal turn, or
strip the trailing edge) would harden it.

## Experiment impact (bottom line)
- CLEAN: original-problem gradient (a,b,c,d,e,g,h) and harder-(balanced)-problem runs (hard-b/c/d/h)
  — 0 of either error. The headline conclusions stand.
- CAVEATED: **Collatz** runs diff-b2 (badly), diff-h1 (partly) — compression broke during their
  loops; treat their late-stage behaviour as confounded. diff-b1 had NO real vLLM errors (its onset
  134 is clean). **ml-hard-g2** — 294 stream-prefill failures, treat as artifact / low-weight.
