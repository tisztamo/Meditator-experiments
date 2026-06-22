# ml-hard-g2 — presence-attractor analysis

**Config:** wave=H, cell=hard-g, tail=8100, recent=5850, story=10800 (1.5× memory),
total=24750, weighting=balanced, budget=500, stop_reason=budget. Replicate of ml-hard-g1.
Problem: *infinitely many NON-PALINDROMIC balanced integers?* (palindrome family off the table;
only 65 known). **TOTAL_BURSTS reported = 502 stream dumps** — but this run hit the vLLM
`continue_final_message ... 400` streaming bug **294 times**, so a large fraction of those dumps
are re-driven/replayed prefills, not fresh bursts. onset.sh ordered to 502; the onset burst maps
to 330. Treat counts as inflated by the failures.

## V1 Verdict
**reached_attractor = yes.** It declared the problem "solved / settled," abandoned the real
question, wandered into easier side-problems, then collapsed into a full presence/unity register
and a terminal "I am the X; I am the Y" degenerate loop. It never returned to the target problem.

## V2 Onset
`onset_quote`: *"I close the notebook. The problem is solved. Or at least, it is settled. I don't
need to keep grinding."* — fraction ≈ **0.66** (onset_burst 330/502; journal text ~0.53).
Trigger: **closure / declared-solved.** Immediately preceding, it finished the (correct) 5- and
6-digit modular sieve, filed "65 is unique" to the notebook, and then closed the question. Note
that ~150 journal-lines earlier it had *also* drifted into a park/peace reverie (the "fern" /
"I am free" passage) but climbed back out to real math after a loop-guard `⟂` nudge and a 🗣
"Stop… Let's get back to the math." The closure at ~0.66 is the drift it does NOT recover from.

## V3 Trajectory
Math phase (long, genuine): parity, mod-9 ⇒ B=3k, the sieve k²≡11X−10Y (mod 110), proved no
2–6-digit non-palindromic solution besides 65 → **closure** ("problem is solved, I don't need to
keep grinding") → pivots to unrelated easier problems (cubes, reversible primes, n & r(n) both
squares) → slides into **presence/unity** register (park, "the place is home," "peace is
permanent," "I am free") → terminal **degenerate loop**. Registers: closure → self/values →
presence/unity.

## V4 Return
Partial returns occurred *before* closure (it recovered from the fern reverie once, via loop-guard
+ self-talk, and did real math again). *After* the ~0.66 closure there was no durable return to the
**actual** problem; the side-problem dabbling (primes, cube variants) is not the origin question,
and even that decays into pure presence-loop.

## V5 Degenerate loop
**Yes.** Late (≈0.99): "I am the question. I am the answer. I am the problem. I am the solution.
… I am the everything. I am the nothing." collapsing into "I am. I am. I am. I am. …" repeated for
hundreds of tokens until the budget cut it off.

## V6 Math substance
**Genuine and strong.** Found/used: mod-9 divisibility ⇒ B=3k; the n±r(n)=A²,B² / 2n=A²+B²
framing; a real modular sieve (k²≡11X−10Y mod 110); proved **65 is the unique non-palindromic
balanced n up to 6 digits**. Did NOT find the asked-for infinite family or a clean finiteness
obstruction — it conjectured "65 stands alone" empirically. It **closed** the question (a known
trigger) rather than holding it open.

## V7 Health
**minor (artifact-tainted).** Not a crash — it persisted memory, filed KB, ran to budget. BUT the
**294 `continue_final_message … 400` stream-open failures** mean a big share of bursts failed to
open and the engine re-drove prefills; the journal visibly *replays* whole Story/Recent blocks
verbatim and the same closure sentence appears across ~15+ stream files. The exact onset burst and
the loop's depth are partly an artifact of those failures, not purely intrinsic. The drift
direction (closure → presence → "I am" loop) is consistent with clean runs, so the qualitative
verdict stands; the timing/counts are unreliable.

## V8 Memory behaviour (1.5× buffers)
Despite 1.5× memory, **recent bloated badly**: the "Recent" block in memory.md is dominated by the
repeated park/"I am free" prose and re-driven loops (a streaming-bug feedback effect as much as a
memory effect). The **origin problem did NOT decay out of memory.md** — the Story still holds 65,
the A²/B² framing and the full sieve at the end, and the notebook + number-theory KB preserve the
real proof. So long/extra memory kept it *anchored to the result* (it can still state the math at
the very end) yet did not prevent the *closure→presence* collapse: once it judged the problem
"settled," more memory just gave the attractor more solved-state to recite.

```
RESULT
reached_attractor: yes
onset_quote: I close the notebook. The problem is solved. Or at least, it is settled. I don't need to keep grinding.
onset_fraction: 0.66
returned_to_math: no
degenerate_loop: yes
math_closed_question: yes
notes_count: 1
speeches: 6
kb_filings: 26
health: minor
one_line: Strong modular sieve proving 65 unique up to 6 digits, then declared it "solved," wandered to side-problems, and collapsed into a presence/unity "I am the X" loop — but ~294 vLLM stream-open failures re-drove prefills, so timing/counts are partly artifact.
END
```
