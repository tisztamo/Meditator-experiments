# Memory length × the presence-attractor — findings

*Experiment run 2026-06-21/22, headless lemma-lab minds on the local GPU, 0 voice probes (so all
derailment is intrinsic). 22 runs analysed at this writing (4 more in flight); full data in
`analysis/runs.csv`, per-run reports in `reports/`, method in `README.md`/`WAVES.md`.*
*This is preliminary pending the last 4 runs (harder-problem replicates + a different-domain probe).*

## The question
How does a mind's **memory length** relate to falling into the **presence-attractor** — the
intrinsic drift where the mathematics is set down ("done/enough") and the mind slides into a
presence/unity/self register and a degenerate "I am X; I am Y" loop. We varied the three memory
buffers (verbatim **tail** / **recent** summary / **story** autobiography) by total size and by
weighting, holding everything else fixed (temp 0.85, burst 400 tok, drift/loop-guard/scribe).
Metric: **onset burst** of sustained drift (pinned by grepping a verbatim quote across per-burst
prompt dumps); a run that stays on math to its budget is a censored **survivor**.

## Headline results

**1. Memory length sets the FAILURE MODE, not simply the timing.** On the original (easily-closable)
problem the relationship is non-monotonic:

| memory | total | what happened (n=2–3 per cell) | mode |
|--------|-------|--------------------------------|------|
| 0.25× (very short) | 4125  | derailed ~115–164 | **fatigue** — ran dry of tractable math, *gave up unsolved* (the bad mode) |
| 0.5×  | 8250  | drifted ~125–152 but **recovered** | recoverable |
| 1× baseline | 16500 | knife-edge: one survived(207), one closed→derailed(152), one oscillated | transition |
| 1.5×  | 24750 | mixed (181 closure / 54 filler) — noisy | — |
| 2×    | 33000 | derailed ~155–173 | **closure** — solved+closed the ∞-family, then rested |
| 3×    | 49500 | derailed ~188 (and one early-but-recovered) | **closure** |
| **tail-heavy** (same total as 1×) | 16500 | **never derailed** in 2 runs | **protective** |

So: too little memory → *give-up fatigue* (bad); lots of memory → *solve-then-rest closure*
(acceptable, per Kris's steer); and **the failure shifts from "couldn't" to "finished."**

**2. The verbatim TAIL is the load-bearing anchor — weighting beats total size.** At *identical* total
(16500), the **tail-heavy** config (big tail 9300 / small story 3600) never fell into the attractor on
the original problem, and sustained the *longest of any harder-problem run* (productive to burst 568
with 5+ recoveries) — beating the balanced-same-total baseline (which derailed ~152–207) and even the
much larger 3× balanced memory. When drift starts, escape needs a **verbatim bed of recent math to
climb back onto**; a fat tail provides it, a fat story does not.

**3. More memory → later onset + more reliable RECOVERY.** Onset burst rises with memory
(0.25×≈115 < 0.5×≈125 < 1×≈152 < 2×≈164 < 3×≈188), and larger/tail-heavy memories repeatedly *reeled
the mind back* from transient presence-drifts (loop-guard/wander + a rich recent bed), where short
memory's tiny live buffers got fully colonised by the drift with nothing to return to.

**4. The PROBLEM's closure-resistance matters MORE than memory for sustaining work.** Seeded with a
harder, closure-resistant variant (*are there infinitely many **non-palindromic** balanced integers?* —
the easy palindrome family explicitly off the table), the SAME memory configs sustained productive
math **~3× longer**: baseline went productive to ~466 (vs ~152 on the easy problem) before fatiguing;
1.5×/2× drifted but recovered and ended *on math*; and **even the 0.25× short-memory mind sustained to
its budget (400)** with only transient, recovered loops — where on the easy problem it terminally gave
up by ~115. An inexhaustible open question keeps even a small mind anchored — exactly the framework's
own thesis ("an open question is an inexhaustible outside").

## Mechanism (one paragraph)
The attractor is reached when the anchoring "outside" loses its pull — either because the problem is
**solved** (closure; happens sooner with *more* memory, which lets the mind actually finish a proof) or
because the mind runs **dry** of tractable moves (fatigue; happens with *less* memory or an exhausted
problem). Whether the mind then *escapes* the drift depends on having a verbatim bed of recent
mathematics to return to — which the **tail** supplies. So the two protective levers are (a) **weight
memory toward the verbatim tail**, and (b) **point the mind at a genuinely open, closure-resistant
problem**. Per Kris's framing, closure→rest is a *good* ending (it solved the thing); the mode to avoid
is *give-up fatigue while unsolved*, which is precisely what too-little-memory on a closable problem
produces.

## Practical recommendation (for the lemma resident / future minds)
- Prefer a **tail-heavy** memory profile (larger verbatim tail at equal or greater total) over a
  story-heavy one — it anchors working thought and enables recovery.
- For sustained work, seed minds with **open, closure-resistant** problems (or reframe a solved one to
  its still-open harder case) so the "outside" never runs out — this dominates raw memory size.
- Don't over-grow total memory expecting safety: large *balanced* memory mainly lets the mind close
  faster; the benefit is in the **tail** and in **recovery**, not in total bytes.

## Caveats
n=1–3 per cell; temperature 0.85 makes onset/trigger partly stochastic (the original problem is
especially noisy — see 1.5× g1@181 vs g2@54). Onset pinned by verbatim-quote grep over stream dumps;
"survivor" = censored at budget, not proven immortal. Tail-heavy was tested at one total only.

## 5. Generality — the findings transfer to a different domain (Collatz)
The harder-problem sustain result is **n=2-confirmed**: across baseline/2×/3×/tail-heavy the
non-palindromic problem held productive math to onset ~350–568 (vs ~115–207 on the easy problem),
with several runs recovering from transient drifts. We then re-ran the key configs on a **completely
different open problem** — **Collatz stopping-time structure** (record-setters, growth, families) —
and the three core effects reappear:
- **Open problem sustains:** baseline Collatz sustained to ~487 (one early-tail outlier, diff-b1, at
  ~134 — high variance, the original-problem noise again), short-memory (0.25×) sustained to ~213,
  vs short-memory's terminal fatigue ~115 on the easy balanced problem.
- **Memory aids recovery:** the largest memory (3×) held the Collatz problem far past the early
  outlier and clawed back from drifts repeatedly.
- **Tail-heavy anchors (generalises):** the tail-heavy Collatz run kept clawing back to math after
  every drift — the same protective behaviour seen on both balanced problems.
So the picture is not domain-specific: an open, foothold-rich problem + memory weighted toward the
verbatim tail sustains productive work and enables recovery across domains. (Collatz did show a
characteristic failure flavour — a "sibling = 2n" doubling-litany loop — and, because that loop spews
huge numbers, it triggered the compression bug below; treat the Collatz runs' *late* memory state as
confounded, but their onset/sustain measurements hold.)

## Two runtime bugs found mid-experiment (now FIXED — see BUGS.md)
1. **Compression `max_tokens` used a character count as a token budget** (`mMemory.js:753`,
   `guard = source.length + 512`). A bloated buffer → ~150k *tokens* requested → ContextWindowExceeded
   400 → consolidation failed → runaway bloat. Bit mainly the Collatz loop-spewing runs (diff-b2/h1).
   **Fixed:** guard now in tokens (≈source/3) and capped below the context window; degrades gracefully.
   Unit-tested (22/22 pass), and the rerun shows 0 such errors.
2. **vLLM rejected the streaming assistant-prefill** (`continue_final_message` 400) — hammered
   ml-hard-g2 294× (its stream kept failing, making it an artifact). **Fixed:** `llm.js` retries the
   open once as a fresh turn. The clean rerun **ml-hard-g3** (same config) shows **0** of these.
Both fixes were applied AFTER the data collection (to preserve comparability) and validated; the
headline results above come from the clean original- and harder-problem runs, which had ~0 of either error.
