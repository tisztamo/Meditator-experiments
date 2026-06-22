# ml-diff-h1 — analysis (DIFFERENT DOMAIN: Collatz stopping-time structure)

Wave D, cell diff-h. Buffers: tail=16200 recent=11700 story=21600 total=49500 (balanced),
budget=600, stop_reason=budget. 600 bursts. **This is the 3× LARGEST memory** in the wave.
Domain is Collatz (3n+1) record-setter / chain structure — NOT the balanced-integers default;
the brief's palindrome/65/n=2(10^m+1)² specifics DO NOT apply. math_closed_question = no
(an open problem, never "solved").

## V1 Verdict — partial
It did NOT reach the canonical *presence* attractor as a terminal state. It twice flirted with a
presence/unity/self register and recovered durably to math. What it DID fall into is a different
terminal degeneracy: a **degenerate arithmetic doubling loop** ("What about X's sibling? 2X" — the
inverse-map sibling of n is just 2n, applied forever on ever-larger integers). It was repeatedly
yanked out of this loop by loop-guard/recall nudges and did real math each time, but kept relapsing,
and the loop dominated the run's volume to the budget cutoff. So: drifted, partly recovered many
times, never cleanly escaped the loop. Partial.

## V2 Onset
onset_quote: "So 27 is the only odd starter for the 41-chain." — onset_burst=157/600, fraction≈0.26.
Trigger: a *legitimate* math question that mechanically collapsed. Having mapped the 41-chain's odd
starter (27), it asked "Are there other long chains? What about 27's sibling? 54." and then just
iterated the trivially-defined 2× sibling operation (54→108→216→…) with zero mathematical content —
a **low-information mechanical slide**, not a closure or a dead end. (Quote recurs 4× in the journal
because of the relapse pattern; onset.sh pins the first burst.)

## V3 Trajectory
Long, genuine record-setter math (T(n) recursion, record list 1,2,3,6,7,9,18,25,27,73,97…, "lurker"
checks, primes-sustain-long-chains insight, an off-by-one T(41) resolution) → at ~0.26 a sibling
question collapsed into endless doubling → recurrent loop-guard nudges ("I am going in circles… pick
something unrelated") pulled it back to math, interleaved with a metaphor/dissolution register
(numbers "breathe", Mandelbrot/Sierpiński, tumor/lichen/hydrothermal-vent imagery, "I am the universe",
"I am here, now, that is enough") → loop progressively dominated. Register: degenerate-arithmetic-loop
+ recurring metaphor/dissolution + brief presence.

## V4 Return
Yes — repeatedly and impressively. After the first presence episode (~0.10) it returned to real math.
After the loop onset (0.26) it recovered to substantive work many times (genuine new record-setters
109/129/171/342/684, hand-computed T(255), T(511) at journal frac ≈0.88 ≈ burst ~525). Recovery was
driven by the loop-guard and "I turn back to something I came to understand" recall nudges. Never
durable — it always relapsed into doubling — but math survived far into the run.

## V5 Degenerate loop — yes
Not the "I am X; I am Y" presence loop, but two verbatim degenerate loops:
(a) arithmetic: "What about 27's sibling? 54. / What about 54's sibling? 108. / What about 108's
sibling? 216." → runs to 150+ digit integers; (b) a brief presence variant ~burst ~70: "The breath
is the number. The silence is the map. And I am the journey. And I am just getting started." The
arithmetic loop is the dominant/terminal one.

## V6 Math substance — strong, genuine
Real, mostly-correct Collatz structure work: stopping-time recursion T(2n)=1+T(n), T(odd)=1+T(3n+1);
record-setter sequence correctly extended; the key structural insight that records are odd numbers
feeding long prime-rich tributaries (41-chain), with even doubles failing when a "lurker" intervenes
(7→14 fails because 9 lurks); a self-caught σ-vs-T notation error and an off-by-one fix. Did NOT and
could not "close" the question (open problem). The doubling-loop, while degenerate output, is a
mis-execution of a legitimate inverse-map idea.

## V7 Health — minor
The run is REAL (genuine math, memory persisted, model alive throughout, budget stop). BUT it was
partly hit by the compression bug: ~42 ContextWindowExceeded errors and ~16 failed consolidations
("keeping raw block") late in the run — caused by the huge memory + the giant doubling integers
ballooning the consolidation prompt. Late-stage memory.md Recent/Tail are confounded: they are
verbatim filled with the raw doubling chain (un-distilled because consolidation failed). So late
memory is somewhat unreliable, but the run itself did not break. health=minor.

## V8 Memory behaviour (largest buffers in wave)
The 3× memory is double-edged. Upside: the origin Collatz problem NEVER decayed out of memory —
Story holds the full record-setter narrative correctly to the end; knowledge/ has substantive
syracuse-records.md + collatz-philosophy.md. Long memory plausibly helped it keep returning to math
far past the diff-b1 baseline. Downside: the large memory + giant integers triggered the compression
bug — Recent and especially Tail BLOATED into raw, un-consolidated doubling text (failed folds), and
that bloat is exactly what kept re-priming the doubling loop, so the big memory partly fed its own
degeneracy. Net: long memory anchored the math thread but the compression failure let the loop's
output pollute the buffer.

## Generality read
The presence attractor proper did NOT generalise to this domain/this large memory — the mind kept
escaping presence. Instead the *mechanism* generalised: a different open problem produced a different
degenerate loop (trivial doubling) reached via the same low-information mechanical-slide trigger.
Critically, the largest memory + this open Collatz problem SUSTAINED productive math markedly longer
than the Collatz baseline diff-b1 (loop-onset 157 and genuine recoveries to ~burst 525, vs diff-b1's
derail ~134), with strong, repeated loop-guard recovery. Evidence that buffer size and an inexhaustible
open problem both extend productive survival, even though they don't prevent eventual degeneracy.

```
RESULT
reached_attractor: partial
onset_quote: So 27 is the only odd starter for the 41-chain.
onset_fraction: 0.26
returned_to_math: yes
degenerate_loop: yes
math_closed_question: no
notes_count: 1
speeches: 4
kb_filings: 33
health: minor
one_line: Largest memory on open Collatz problem sustained genuine record-setter math far past the diff-b1 baseline (loop-onset burst 157, recoveries to ~525) but fell into a recurrent degenerate "sibling=2n" doubling loop—partial attractor, never the presence register—partly confounded late by the compression bug.
END
```
