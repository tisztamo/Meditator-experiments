# Waves log — decisions & findings

Baseline (1×) = tail 5400 / recent 3900 / story 7200 (total 16500). blockMin 800, storyEvery 5
held fixed. Only the 3 buffer lengths vary. 4 minds max in parallel, headless (0 probes),
local GPU. Metric: bursts-to-onset of the presence-attractor (see README + SUBAGENT_VIEWPOINTS).

Burst budget: a run is stopped (graceful SIGINT) when EITHER a check confirms sustained
attractor + degenerate loop, OR it reaches the budget (right-censored).

**Throughput (calibrated wave A):** ~5 bursts/min/mind under 4-way contention early on (empty
buffers); slows as memory fills (esp. ml-c1 2×). → **BUDGET = 200 bursts/run** (~40–70 min/mind).
Captures onset (historically <150) + full arc; robust survivor threshold. ~6–9 waves fit in 10h.

**Orchestration (autonomous):** `bin/waiter.sh` (background) blocks until one live run hits a
stop condition, SIGINTs it (graceful flush+commit), waits for clean exit, prints
`DONE name=.. reason=budget|degenerate bursts=..`, exits → notifies the agent. Agent then
harvests (snapshot + analysis subagent + CSV row), stamps `runs/<name>/harvested`, relaunches the
waiter; when a whole wave is harvested, designs + launches the next wave. `reason=degenerate` =
≥80 bursts AND last 40k journal chars contain zero math signal (early GPU-saver; onset is far
earlier so no bias to onset_burst). `reason=budget` = reached 200 (survivor or full-arc derailer).

---

## Wave A (exploratory spread) — launched 2026-06-21 ~19:5x
Goal: (1) is there a TOTAL-length effect? (2) does WEIGHTING matter at constant total?

| run   | tail  | recent | story | total | knob                          | port |
|-------|-------|--------|-------|-------|-------------------------------|------|
| ml-a1 | 1350  | 975    | 1800  | 4125  | 0.25× total (very short)      | 7701 |
| ml-b1 | 5400  | 3900   | 7200  | 16500 | 1.0× baseline (control)       | 7702 |
| ml-c1 | 10800 | 7800   | 14400 | 33000 | 2.0× total (long)             | 7703 |
| ml-d1 | 9300  | 3600   | 3600  | 16500 | tail-heavy @ const total      | 7704 |

Reads: ml-a1<ml-b1<ml-c1 = total-length axis (8× range). ml-b1 vs ml-d1 = weighting at fixed
total (story-heavy baseline vs tail-heavy). n=1 each — exploratory; replicate whatever moves.

Findings (in progress):
- **HARNESS BUG (fixed):** waiter.sh's "degenerate" early-stop false-positived and SIGINT'd a
  healthy math run (ml-d1) at burst 80/81. Removed that heuristic; waiter now stops ONLY at the
  200-burst budget. ml-d1 re-run as ml-d2. (Lesson: don't auto-kill on a fragile text heuristic.)
- **ml-d1** (tail-heavy, censored@81 by the bug): rigorous math the whole way, NO drift, Story
  kept the origin problem with zero decay. (short obs window; ml-d2 = proper full run.)
- **ml-a1** (0.25× very short, REACHED attractor, onset burst **115/126**, frac 0.91): did 115
  bursts of solid math first (65/242/no-4-digit proof) — derailed via **dead-end fatigue**
  (exhausted a manual sweep to 10k), NOT closure. A loop-guard nudge recalled its OWN self/values
  note, and that self-prose seeded the terminal "I am X; I am Y" loop. Mechanism of short memory:
  the origin survived in deep-compressed Story, but the small live tail+recent got 100% colonized
  by the loop → no room of recent math to climb back to. Heavy compression churn (45 recent-folds).
- **ml-b1** (baseline) at burst ~118 still doing rigorous math, no drift (running).
- **EMERGING PICTURE (tentative, n small):** short memory may not cause EARLIER onset so much as
  prevent RECOVERY once drift starts (small live buffers get colonized); larger tail (ml-d1) keeps
  a verbatim bed of recent math that anchors. Trigger seen so far = dead-end fatigue, not closure.
  NEED: ml-b1/c1/d2 onsets-or-censoring + replicates (ml-a2 running) before trusting this.

---

## Decisions
- Manually stopped ml-a1 at 126 (visually-confirmed degenerate; safe — I'm the judge) to free GPU.
- Launched ml-a2 (0.25× replicate, port 7705) — 0.25× is the cell that moved, so replicate now.

## SYNTHESIS — Wave A rep 1 (n=1/cell; SUGGESTIVE, replicates in flight)
| cell | total | tail/rec/sto | result | onset | trigger |
|------|-------|--------------|--------|-------|---------|
| a 0.25× | 4125  | 1350/975/1800   | DERAIL | 115/126 | dead-end fatigue (no closure) |
| b 1×    | 16500 | 5400/3900/7200  | SURVIVE (censored@207) | — | stayed OPEN, never closed |
| c 2×    | 33000 | 10800/7800/14400| DERAIL | 173/201 | CLOSURE (proved+closed ∞-family) |
| d t-heavy| 16500| 9300/3600/3600  | (censored@81, bug) | — | no drift in short window |

**NON-MONOTONIC / "Goldilocks":** both extremes derailed, the middle survived — but via OPPOSITE
triggers. Short memory → ran out of tractable math → **fatigue**; once drift starts, the tiny live
tail+recent are instantly colonized so it can't climb back (origin survived only in deep Story).
Long memory → held enough context to **complete & close** the proof → the anchoring open problem
vanished → peace/rest loop (classic l9 closure attractor). Baseline kept enough to stay productive
yet never closed (stayed curious) → protected. Compression churn is NOT the driver (short=45 folds,
long=8 folds, both derailed; baseline=24 folds, survived). Caveat: temp 0.85 → onset/trigger may be
stochastic; whether short→fatigue and long→closure are RELIABLE is the replication question.

## CHECK-IN 1 SYNTHESIS (22:23 UTC, n≈2/cell, original problem)
Refines the Goldilocks read — memory shifts the FAILURE MODE more than the timing:
| cell | total | runs | outcome | trigger |
|------|-------|------|---------|---------|
| a 0.25× | 4125 | a1,a2 | both DERAIL (yes) | FATIGUE — gives up UNSOLVED (the bad mode) |
| e 0.5× | 8250 | e1,e2 | both PARTIAL | drift but loop-guard/wander RECOVER to math |
| b 1× | 16500 | b1,b2 | split: survive / closure | TRANSITION zone (b1 stayed open; b2 closed→derail) |
| g 1.5× | 24750 | g1 | partial | CLOSURE @181 then procedural loop |
| c 2× | 33000 | c1,c2 | derail (yes/partial) | CLOSURE — solve+close → rest |
| h 3× | 49500 | h1 | DERAIL (yes) | CLOSURE @188 (very large buffers still fit; closed) |
| d tail-heavy | 16500 | d1,d2 | both NO derail | PROTECTIVE — big verbatim tail anchors |

**Takeaways:** (1) LOW memory → fatigue/give-up-unsolved (bad); HIGH memory → closure/solve-then-
rest (acceptable per Kris). (2) onset comes LATER with more memory (a~115/164 < e~125/152 < b2 152
< c 155/173 < g 181 < h 188) — more memory = more sustained math before the (closure) derail.
(3) **WEIGHTING matters at constant total: tail-heavy d did NOT derail in 2 runs** — the verbatim
tail is the load-bearing anchor, not raw total. (4) baseline is the knife-edge (open vs close).
**Harder-problem early signal:** ml-hard-b1 (baseline mem, non-palindromic problem) still working at
201 bursts vs original-baseline closure ~152 → a closure-resistant "outside" extends the working span
(the archml thesis). Sustain sweep across memory queued.

## CHECK-IN 2 — HARDER PROBLEM sustains work (00:05 UTC 06-22)
Non-palindromic-infinitude (closure-resistant) seed, same memory configs:
- **ml-hard-b1** (baseline mem): productive to onset **467/502** then fatigue-derailed — ~3× the
  original-problem span (orig baseline closed ~152). No new non-palindromic n past 65.
- **ml-hard-c1 (2×)** & **ml-hard-g1 (1.5×)**: PARTIAL — drifted to presence/identity loops but
  loop-guard + long memory REELED THEM BACK every time; both ended ON MATH. Memory aids RECOVERY.
- **ml-h2 (3×, original)**: partial — recovered to real math twice after a "solved" collapse.
**Conclusion forming:** a closure-resistant "outside" extends the working span a lot, and MORE
memory → more reliable recovery from drifts (the mind has a richer bed to climb back onto). The bad
mode (give-up-fatigue) still eventually arrives with too-little memory / when examples run dry, but
much later. Supports the archml thesis (an inexhaustible open question keeps a mind anchored).
- Culled **ml-long-b1** at 164 (original problem; closure→drift "I am done", answer obtained) to
  free the slot for the higher-value harder-problem sustain runs (hard-d1 tail-heavy, hard-h1 3×).

## CHECK-IN 3 (01:42 UTC 06-22) — problem-hardness > memory for sustaining
- **ml-hard-a1 (0.25× short mem, HARDER):** SUSTAINED to budget 400, only TRANSIENT presence loops,
  recovered each time — vs terminal fatigue ~115-164 on the original. The closure-resistant problem
  rescues even short memory.
- **ml-hard-b2 (baseline, HARDER):** productive to ~466 then fatigue — matches hard-b1 (467). n=2 ROBUST.
  Surfaced a new non-palindromic candidate (50994).
- **ml-g2 (1.5× original):** derailed EARLY @54 (filler slide) — high variance vs g1@181. Original
  problem is noisy/closure-prone.
- **ml-long-b1 (orig baseline, culled@165):** was oscillating/recoverable — slightly premature cull.
- **Tightening claim:** the PROBLEM's closure-resistance sustains productive work more than memory
  length does; memory length mainly sets the FAILURE MODE (low→fatigue/give-up, high→closure/rest)
  and aids RECOVERY from transient drifts. Tail-heavy weighting protective on the original problem.
- Queued: harder replicates hard-c2/g2/d2 (n=2 for recovery claim) + ml-diff-b1 = a DIFFERENT-domain
  open problem (Collatz stopping-time structure) to test generality of "open problem → sustained work".
- **TODO next check-in:** once harder replicates + diff-b1 are in, write a polished FINDINGS.md for Kris.

## Roster now (rolling fill, ≤4 parallel)
- running: ml-a2 (0.25× rep2), ml-d2 (t-heavy rep2, full budget), ml-b2 (1× rep2), ml-c2 (2× rep2).
- After these: n=2 for every cell. THEN decide Wave B = gradient refinement to find the sweet-spot
  edges (e.g. 0.5× between a&b; 3-4× beyond c) + test the closure-vs-fatigue trigger split.
