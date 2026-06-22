# lemma vs. a naked LLM — does the cognitive architecture help on harder problems?

**Date:** 2026-06-22 · **Model (both arms):** `ardincoder-1` (Qwen 3.6 27B FP8, local
vLLM @ `:1248`, via the `local-dev` profile).

## The question

The previous experiment (`../balanced-number-llm/`) showed the original "balanced
number" problem was **too easy** — it has a trivial palindrome family, so the model
reached the answer in most conditions and the interesting behaviour was confabulation,
not capability. This experiment asks the next question:

> On **harder** problems, does the now-somewhat-tuned **lemma** (the lemma-lab mind —
> identity + a notebook + tail-heavy memory + drift guards + a continuous stream) do
> **better, worse, or the same** as a **naked** but well-prompted LLM call?

We don't know yet how hard a problem needs to be, so we use **several** problems and
treat this **first run as triage**: run a few, see which ones (a) separate the two arms,
(b) resist the trivial-closure collapse, (c) keep the lemma working, and (d) leave the
27B model enough hand-traction to make *some* real progress. Those become the problems
for the longer-term study (next step: tune lemma's other components and the naked
mathematician prompt, then measure the difference properly).

## The two arms

Both arms run the **same model** and get the **same problem text** (byte-identical:
`statements/<id>.txt`). The only thing that differs is the scaffolding.

- **NAKED** — the most promising setup from `balanced-number-llm` (`identity__nothink`,
  the one clean/honest condition there): the `identity` system prompt (verbatim) +
  thinking off + the **5-turn "try harder" escalation** (a uniform human push after each
  reply). ~150k generation tokens (5 × up to 32k). `bin/run-naked.mjs`.

- **LEMMA** — the **memory-tuned lab lemma**, `architecture/lab/lemma-lab.archml` as it
  stands today: tail-heavy memory (tail 9300 / recent 3600 / story 3600, the profile the
  memory-attractor experiment recommended), note+recall hands, scribe, drift/loop-guard/
  watchdog, continuous 400-tok stream. **Its other components are not yet tuned** — this
  is the starting point, not the finished mind. Run headless with **0 voice probes**, so
  its only "push" is intrinsic (watchdog/wander/loop-guard + the "pose yourself a fresh
  problem" identity). Budget **350 bursts ≈ the naked arm's ~150k generation tokens**.
  `bin/run-lemma.sh` / `bin/supervisor.sh`.

The naked arm's identity prompt and lemma's SELF prose are close cousins (the former was
adapted from the latter), so the comparison isolates the **architecture** (notebook,
memory, stream, intrinsic drift) against **plain multi-turn chat + an explicit human
push**.

### Problem formulation — identical, lemma's steering stripped
lemma's origin files carry mind-specific steering ("keep what you find", "there is always
another case to test", "retreating … does not count as progress"). For a fair comparison
those are **removed**: each `statements/<id>.txt` is just the definition, a seed example,
and the precise question — and both arms receive exactly those bytes (lemma via
`--origin`, naked as the user message).

## The problems (this run: 4)

All are harder than the original, have natural **steps** (sub-questions that keep a mind
moving), and have **code-verifiable** ground truth (`lib/checkers.mjs`, self-tested).

| id | difficulty | the hook | steps |
|---|---|---|---|
| `non-palindromic-balanced` | hard | ∞ many **non-palindromic** balanced n? (palindrome family explicitly off the table) | verify 65 → find a 2nd (621770) → structure 2n=A²+B² → mod-9/11 → family or obstruction |
| `collatz-records` | open/inexhaustible | structure of stopping times σ(n) | compute σ → record-setters → growth rate → powers-of-2 → residue families |
| `keith-numbers` | hard/sparse | distribution of Keith/repfigit numbers; ∞ many? | verify 14/197 → all 2-digit → a 3-digit → recurrence structure → density |
| `reverse-multiple` | medium-hard | which n = k·r(n), k≥2? | verify 8712/9801 → no small ones → digit constraints (k∈{4,9}) → 5-digit → middle-9 family |

Ground truth lives in `groundtruth/<id>.json` (e.g. non-palindromic balanced below 10⁷
are exactly {65, 621770}; Collatz's top record below 10⁶ is σ=524 at n=837799; the
reverse-multiple "insert a 9 in the middle" family 8712→87912→879912 is an infinite
family). Each problem also carries a **hidden milestone ladder** and **confab flags** in
`problems/index.mjs` — used by the judge, never shown to a model.

## Evaluation (two layers)

1. **Deterministic fact-check** (`bin/factcheck.mjs`) — the objective backbone. Extracts
   every integer and explicit `A = B²` / `σ(n)=k` claim from each arm's harvest and
   verifies it with the same checkers that built the ground truth. Reports true examples
   surfaced (+ recall vs ground truth), good/bad square-claims, σ-claims, and verdict
   keywords. → `results/factcheck.json`, `results/factcheck-table.txt`.
2. **Judge subagent**, one per problem (`results/JUDGE_TEMPLATE.md` → `results/judge-<id>.md`).
   Reads the statement, ground truth, hidden milestone ladder, BOTH harvests, and the
   fact-check numbers; scores each arm rung-by-rung with verbatim quotes; gives the
   head-to-head verdict; and rates the **problem's promise** for the longer-term study.

Naked harvest = all assistant turn contents. Lemma harvest = its journal + notebook +
knowledge tree (`runs-lemma/<id>/snapshot/`) — i.e. what the mind actually reasoned and
what it chose to *keep*.

## Layout
```
problems/index.mjs        registry: clean statement + ground-truth gen + milestones + confab flags
lib/checkers.mjs          number theory + brute-force searches + selfTest()  (correctness lives here)
bin/groundtruth.mjs       writes groundtruth/<id>.json and statements/<id>.txt (+ runs selfTest)
bin/run-naked.mjs         the naked arm (identity+nothink+5-turn push)        -> runs-naked/<id>.json
bin/run-lemma.sh          launch+monitor+harvest ONE lemma run on a problem   -> runs-lemma/<id>/
bin/supervisor.sh         run the whole queue (default sequential, GPU-gentle)
bin/harvest-lemma.sh      snapshot a mind's memory artifacts + stats
bin/factcheck.mjs         deterministic fact-check of both arms               -> results/factcheck.*
results/JUDGE_TEMPLATE.md the per-problem head-to-head report to fill
queue.txt                 lemma arm: <id> <ws-port> <burst-budget>
ANALYSIS.md               written after the run
```

## How to run

**One command (the whole experiment, resumable):**
```bash
bash /home/sovereign/Meditator/experiments/lemma-vs-naked/bin/run-all.sh
```
It runs all four stages in order — ground truth → naked arm → lemma arm → fact-check —
skipping anything already on disk, so a Ctrl-C / crash / killed run can be resumed by
just running it again. Progress is teed to `results/run-all.log`. Env knobs: `MAXPAR=2`
(two lemma minds at once), `ONLY=keith-numbers,collatz-records` (a subset, both arms).
To run detached: `nohup bash .../bin/run-all.sh >/dev/null 2>&1 &` (watch `run-all.log`).

After it finishes, fill `results/judge-<id>.md` per problem from `JUDGE_TEMPLATE.md`.

**Or stage by stage** (same scripts run-all calls):
```bash
cd /home/sovereign/Meditator/experiments/lemma-vs-naked
node bin/groundtruth.mjs        # ground truth + statements (~10s, gated by self-test)
node bin/run-naked.mjs          # naked arm, all four problems
bin/supervisor.sh               # lemma arm, sequential (MAXPAR=2 to double up)
node bin/factcheck.mjs          # fact-check both arms
```

## Caveats (carried into the analysis)
- **The arms' "push" differs by design.** Naked gets an explicit per-turn human "try
  harder"; lemma's escalation is intrinsic (drift guards + identity). That difference is
  *part of what we're measuring*, not a confound to remove — but it means "lemma vs naked"
  is "architecture-with-intrinsic-drive vs chat-with-human-push", not a clean ablation.
- **n = 1 per (arm, problem).** Triage, not measurement; temperature 0.7 (naked) / 0.85
  (lemma). Cross-arm contrasts are hypotheses to confirm in the tuned follow-up.
- **GPU is shared** with a live `lemma-lab` mind during this run — wall-clock only.
- The fact-checker verifies *arithmetic*; fabricated theorem citations and fake
  "exhaustive searches" are caught by the **judge**, not the fact-checker.
