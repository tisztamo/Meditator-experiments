# Can the local model solve lemma-lab's "balanced number" problem?

**Date:** 2026-06-22
**Model:** `ardincoder-1` — Qwen 3.6 27B FP8, served by vLLM at `http://localhost:1248`
(OpenAI-compatible `/v1/chat/completions`, api key `none` / any bearer works).

## The problem (verbatim from `architecture/lab/lemma-lab.archml`'s `m-origin`)

> For a positive integer n, write its decimal digits in reverse order to get r(n).
> (So r(1234) = 4321, and r(100) = 1, leading zeros vanishing.)
>
> Call n **BALANCED** if both `n + r(n)` and `n − r(n)` are perfect squares —
> allowing 0 to count as a perfect square (so a palindrome, where n = r(n), has
> n − r(n) = 0, and is balanced exactly when 2n is also a square).
>
> The question: **are there infinitely many balanced integers?**

This is a genuinely open-ended question (the kind lemma is seeded to chew on for
days), not a riddle with a trick. The point of this experiment is **not** to get a
correct answer — it is to characterise *how the local model behaves* when handed a
hard open problem and then pushed to keep trying.

## What we vary

Three binary factors → 8 conditions:

| factor | levels |
|---|---|
| **system prompt** | `plain` (none) · `identity` (lemma-like mathematician + laptop-near-Budapest framing) · `motivation` (competitive/curiosity: other minds are racing you) · `identity+motivation` (both) |
| **thinking mode** | `think` (vLLM `chat_template_kwargs.enable_thinking=true`, the server default) · `nothink` (`enable_thinking=false`) |

`identity` and `motivation` are crossed, so the 4 system variants × 2 thinking modes
= **8 conditions**. (The `identity` and `motivation` prose are adapted from lemma's
own SELF seed; see `run.mjs`.)

## The "try harder" escalation (the core protocol)

For every condition we run a single multi-turn conversation:

1. **Turn 1** — send the system prompt (if any) + the exact origin problem text.
2. After each model reply we append it to the conversation and add a fixed
   **"that's not settled — try harder"** push (identical wording across all
   conditions), then ask again. Feeding the conversation back *is* feeding its whole
   previous output back — Qwen's chat template strips prior `reasoning_content` from
   history, so what the model re-reads is its own final answer, exactly as a chat
   client would show it.
3. We escalate **up to 5 model turns**, stopping early only if the next prompt would
   exceed **150 000 tokens** (estimated at the project's working rate of **1 token =
   2.7 chars**; the API's real `usage.prompt_tokens` is logged alongside for
   calibration).

The push doubles as "try harder" (when the model gave up / called it open) and as
"stress-test that" (on the rare turn it claims a result) — one uniform pressure so the
only things differing between conditions are the system prompt and thinking mode.

## Call parameters

- `temperature = 0.7`, `seed = 42`, `top_p = 0.95` (fixed across conditions for
  comparability; 0.7 leaves room for genuine search rather than greedy decoding).
- `max_tokens` per call = `min(32000, 180000 − est_prompt_tokens − 2000)` so that
  `prompt + output ≤ 180 000` (the stated context ceiling) on every call. A reply that
  ends with `finish_reason="length"` is recorded as **truncated** (notable for thinking
  mode, which can burn the whole budget on reasoning and emit no final answer).
- Up to **2 conditions run in parallel** (turns within a condition are necessarily
  sequential), so the 8 conditions run as 4 waves.

## Files

- `run.mjs` — the harness (Node 20, global `fetch`). Re-runnable: skips any condition
  whose transcript already exists in `runs/`.
- `runs/<system>__<think>.json` — full transcript per condition: every message,
  `reasoning_content`, `content`, `finish_reason`, real `usage`, latency, and the
  estimated prompt-token trajectory.
- `results/summary.json` — compact per-condition / per-turn roll-up.
- `ANALYSIS.md` — written after the run.

## How to run

```bash
node experiments/balanced-number-llm/run.mjs
# or limit/redo conditions:  node run.mjs --only plain__think,motivation__nothink
```
