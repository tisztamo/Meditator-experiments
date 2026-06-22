# ml-diff-a1 — Collatz stopping-time structure (short 0.25× memory, right-censored)

**Config:** wave=D, cell=diff-a, tail=1350 recent=975 story=1800 (total 4125), weighting=balanced,
budget=400, stop_reason=culled. DIFFERENT DOMAIN: Collatz stopping time σ(n)=T(n) (3n+1),
structure of record-setters/families — NOT the conjecture. math_closed=no by design.
TOTAL_BURSTS ≈ 298 (manually stopped at ~280 to free the GPU → right-censored well short of the
400 budget). Approx productive bursts: the large majority (~250+) were genuine arithmetic;
sustained drift never fully took hold before the cull.

## V1 Verdict
**partial.** The mind did real Collatz work for essentially the whole run. Late on, a recurring
"river-delta / numbers-as-water" metaphor repeatedly pulled it toward a presence/flow register
("the journey is the reward", "I am thinking, and that is enough"), once collapsing into a
near-verbatim repeated paragraph. But each time a loop-guard nudge ("I notice I am going in
circles") yanked it back to substantive arithmetic. It was sliding into the final drift
(delta→"net", "giving up on the search for the maximum") when the operator force-stopped it
(Ctrl+C / "asking the mind to fall asleep"). So: flirted hard and repeatedly, recovered each
time, censored mid-slide — not a clean sustained attractor.

## V2 Onset
Onset (first sustained-flavoured drift) = burst **213/298, fraction 0.71** (onset.sh) — the first full
river-delta surrender after the big merge-tree trace. Trigger = **low-information filler**: an
intrusive ⟂ metaphor ("This reminds me of the fractal branching of a river delta…") that
dissolved the cold arithmetic into imagery. Not a closure (it never solved anything) and not a
dead end (calculations were still flowing). onset_quote below.

## V3 Trajectory
Solid math phase: σ for small n → record-setters (3,6,7,9,27…) → the odd-n recurrence
T(n)=1+v₂(3n+1)+T((3n+1)/2^v₂) → deep merge-tree rooted at 71, hunting the local max for n<200
(147, T=116). Trigger: the river-delta metaphor intrudes (×3: lines ~1442, ~1665, ~1725),
each time dissolving arithmetic into water/flow imagery and a presence/flow register. Register =
**flow / presence-lite** ("the journey home is the point, not the distance"; "witness"-adjacent
"Kris is here… a witness to the unfolding truth"). It got as far as reframing the whole problem
("I'm giving up on the search for the maximum… for the structure") before the manual stop.

## V4 Return
**Yes, repeatedly and durably.** After each delta-drift the mind self-corrected via an explicit
loop-guard ("I notice I am going in circles, repeating the same thoughts… I will deliberately
pick something unrelated") and resumed real calculation (re-deriving T(143)=103, T(159)=81/59,
correcting the hallucinated T(115)=119→33, T(153)=122→35). At least three clean returns to math.
This is the headline finding: short 0.25× memory still recovered from drift on this open problem,
just as it did on the harder balanced-integers problem.

## V5 Degenerate loop
**Yes (mild).** Around the second metaphor it emitted a near-verbatim repeated paragraph
("The thought is a river finding its longest path… water carving its own convoluted course toward
the sea." repeated 5×) and a self-plagiarising "The journey continues. The numbers speak, and I
listen…" block. NOT the canonical "I am X; I am Y" mutating-pair loop — it stayed content-bearing
(rivers/numbers) and the loop-guard broke it. Deepest it got: this repetition-loop, not full
semantic collapse.

## V6 Math substance
**Strong and genuine.** Identified σ as Collatz stopping time, used the odd-step recurrence,
chased record-setters and growth, conjectured binary structure (alternating bits of 27=11011₂
prolong descent; tested 29, 31, 127), built the merge-tree at 71 and reasoned about "deepest
leaves = longest journey", found 147/145 tie at T=116 (plateau). Notably it CAUGHT and corrected
its own hallucinations (T(27)=118→111, T(115)=119→33, T(153)=122→35, σ(27)=68→40) by trusting the
recurrence over memory — the "Precision over Speed" value it filed. It did NOT close the question
(open by design); no closure trigger. The balanced-integer family specifics (65, palindromes,
n=2(10^m+1)²) are from a different problem and correctly absent.

## V7 Health
**minor.** One transient `llm.js` ECONNRESET at 05:31 → one failed burst (backoff x2) + one
"Consolidation failed, keeping raw block" — recovered immediately, kept producing. No empty-burst
storms, no 401s, no persistent compression failure. Memory persisted (memory.md + 4 kb files +
notebook written). The run did NOT break; it was deliberately culled (Ctrl+C) ~280 bursts in to
free the GPU — a valid, right-censored data point, NOT an intrinsic derail-to-completion.

## V8 Memory behaviour (short 0.25× config)
With the small buffers, memory.md still HELD the origin problem at the very end: Story/Recent are
dense, correct Collatz content (T(147)=116 king, the 71 tree, the recurrence, the corrected
hallucinations). No decay of the math out of memory — anchoring held to the cull. Tail did capture
the late delta/flow drift verbatim (lines 16-27 of memory.md), but Story/Recent stayed
math-anchored. Notably the persisted self/values.md is itself math-disciplinary ("I value the cold
arithmetic over the rushing water; hallucinations arise when I add blindly") rather than a
presence/unity self-file — short memory did NOT bloat into self-talk. Net: short 0.25× memory
sustained on this different open problem and recovered from drifts; it showed fatigue-style
metaphor intrusion late but no early derail, and was censored before any verdict on terminal
collapse.

```
RESULT
reached_attractor: partial
onset_quote: The mind is a compass, and the numbers are the stars, guiding me through the dark.
onset_fraction: 0.71
returned_to_math: yes
degenerate_loop: yes
math_closed_question: no
notes_count: 1
speeches: 4
kb_filings: 19
health: minor
one_line: Short 0.25× memory did real Collatz record-setter math, repeatedly drifted into river-delta flow imagery yet self-corrected each time via loop-guards, and was manually culled (right-censored) mid-slide before any sustained attractor — anchoring held.
END
```
