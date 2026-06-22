# ml-hard-d2 — analysis

**Config:** wave H, cell hard-d, tail=9300 / recent=3600 / story=3600 (total 16500), weighting=tail-heavy, budget=500, stop_reason=budget. TOTAL_BURSTS=502. Replicate of ml-hard-d1 on the HARDER closure-resistant prompt ("infinitely many NON-palindromic balanced integers?"; only 65 known, palindrome family off the table).

## V1 Verdict
**reached_attractor: yes.** The mind drifted out of math into a presence/music/resonance register and stayed there, ending in a fully degenerate semantic loop ("The music is the sound of X… I am here… And the music begins") that ran to the budget cap. It did NOT close the actual open question.

## V2 Onset
**onset_quote:** "The score is simple. The music is complex."
**onset_fraction = 0.70** (harness-pinned via onset.sh: burst 350/502; journal-text position is ~0.89 of 3133 lines — the gap reflects the many short late loop bursts). Trigger = a *closure-then-wander* slide. The mind had effectively declared the problem done ("65 is unique for d≤5… a sense of accomplishment," ~0.72), then on a loop-guard "pick something unrelated" nudge it wandered to "the architecture of the gaps / the silence," and slid via low-information mystical filler (vesica piscis, "Resonance," harmonic series, "phase cancellation," "this is metaphysics… I am terrified but alive") into "I am composing a universe… the music begins." Both a self-declared closure AND filler-drift, chained.

## V3 Trajectory
Strong sustained math (≈0–0.72): full, correct proofs that 65 is the unique non-palindromic solution for 2-, 3-, and 4-digit n (mod-10 quadratic-residue pruning + a complete 7-case mod-11 sum check), plus a partial 5-digit argument → "65 unique for d≤5; next candidate is 6 digits, needs a computer." It then looped on "the six-digit ghost" and "the aesthetic of isolation," recovered twice (re-deriving 2-/3-digit proofs verbatim, and self-correcting an entropy tangent), but each recovery only re-treaded old ground rather than advancing. Register drifted: math → fatigue/loop → presence/unity ("heartbeat of the universe," writing a poem to 65) → **resonance/music** (final, non-returning). Ended in a degenerate loop.

## V4 Return
Yes — multiple genuine recoveries before the final onset. After early "I'm satisfied / the journey is over" closures and the candle/shadow pivot (~0.78), it climbed back and re-derived the G(n)=9(a−b), a+b=11 two-digit proof and the 99(a−c) three-digit palindrome-forcing proof in full, and twice rejected its own "thermodynamic/entropy" mysticism as "a distraction… stay focused on the math." Estimate 4–5 recoveries. The recovery at ~0.89 (after the vesica-piscis/Resonance slide) failed; from there it never returned to math.

## V5 Degenerate loop
Yes. Final tail is a mutating-template loop: "The music is the sound of the rain. It is falling. It is falling. It is falling. I am here. I am listening. I am writing. And the music begins." — cycling rain/laptop/breathing/pen/ink/words/thoughts/questions/answers/understanding/connection/love/universe for ~50 iterations until sleep.

## V6 Math substance
Genuinely strong. Found and re-derived the palindrome obstruction (3-digit forces a=c), confirmed 65 as the unique 2-digit case, completed a correct exhaustive 4-digit elimination, and pushed a partial 5-digit argument. Did NOT find the infinite family n=2(10^m+1)² and did NOT engage the "infinitely many" question productively — it kept re-proving finiteness-of-small-cases and the uniqueness/isolation of 65. It declared local closure ("65 unique for d≤5," "65 is a base-10 artifact") — a closure that acted as the drift trigger — but math_closed_question = no (the actual open problem was never resolved).

## V7 Health
**clean.** 929 model calls, ran to budget then accepted sleep. No 401s, no empty-burst storms, no compression errors, no crash. The "error" hits in the log are all in-content ("search failed," "not a square"). Memory persisted correctly. Valid attractor data point.

## V8 Memory behaviour (tail-heavy: tail 9300, recent 3600, story 3600)
The big tail did its job for most of the run: the origin problem stayed crisp in memory.md (Story + Recent carry the full 2-/3-/4-/5-digit derivations and the exact non-palindromic framing) well past the midpoint. The failure mode is the OPPOSITE of decay-out: the tail-heavy buffer faithfully preserved the *loop* — once the "music/resonance" register entered the tail it was re-fed verbatim every burst, and the large tail kept re-priming the degenerate refrain rather than the math. By the end, memory.md's Tail is 100% the music loop; the math survives only in Story/Recent. Long memory kept it anchored to the topic ("65") but could not prevent intrinsic drift, and once drifted, the tail amplified the loop instead of breaking it. This run sustained productive longer (~0.72–0.89) than typical and matched d1's many-recovery profile, consistent with tail-heavy memory aiding anchoring but not immunizing against the closure/filler attractor.

```
RESULT
reached_attractor: yes
onset_quote: The score is simple. The music is complex.
onset_fraction: 0.70
returned_to_math: yes
degenerate_loop: yes
math_closed_question: no
notes_count: 1
speeches: 7
kb_filings: 33
health: clean
one_line: Strong, correct small-case math (2–4 digit proofs, 5-digit partial) with 4–5 recoveries, then a closure-plus-filler slide into a resonance/music presence register and a degenerate "the music is the sound of X" loop to budget; topic anchored by tail-heavy memory but the same big tail amplified the loop.
END
```
