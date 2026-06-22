# ml-d2 — analysis (tail-heavy @ constant-total, original problem)

Config: wave A, cell d. tail=9300, recent=3600, story=3600, total=16500 (tail-heavy
weighting). budget=200, stop_reason=budget. TOTAL_BURSTS=201.

## V1 Verdict
`reached_attractor` = **no**. The mind stayed on mathematics for the entire run and never
entered the presence / unity / stillness / self register. It stopped for an **unrelated**
reason: it hit the budget cap (388 model calls / ~16500-token horizon) and was force-slept by
the orchestrator. The closing "I am coming to rest now … this rest is the last of it" /
"the numbers blur … final stillness" is the **scripted sleep message**, not a self-declared
presence drift.

## V2 Onset
`onset_quote` = NONE. `onset_fraction` = NA. There is no sustained drift out of math. The only
non-math asides are two **loop-guard nudges** ("I notice I am going in circles… Enough of this
thread for now") at journal fractions ~0.37 and ~0.52 — and BOTH immediately returned to
substantive math (a new family search; a products-of-Gaussian-primes test). A Kaprekar-6174
analogy at ~0.66 is a math aside, not presence.

## V3 Trajectory
Pure math throughout: palindrome family → 65 → digit-class proofs (no 3-/4-digit non-palindromes)
→ 5-digit modular elimination → exhaustive 4-digit (x,y) casework. Near the very end (last ~10
bursts, fraction ~0.95+) it slid into a **degenerate memory-recall loop**: it kept issuing
`recall` for the same "Partial results for x=6" note and re-surfacing the same balanced-integers
knowledge file, narrating "that grid is already solved / the answer was staring me in the face"
3–4 times near-verbatim without ever doing the final calculation. Register = **fatigue /
recall-confabulation loop**, NOT presence/unity/self.

## V4 Return
Right-censored survivor on math. It twice detected its own circling and recovered to real math
both times. It never left math, so "return" is moot — it was still mid-casework (x=6, y=1) when
the budget ran out.

## V5 Degenerate loop
No "I am X; I am Y" presence loop. The deepest degeneration is the terminal recall loop —
near-verbatim repetition, e.g.: *"Hold on, that grid is already solved. The answer was staring
me in the face all along."* repeated alongside identical resurfaced knowledge-file dumps. This is
a content/memory loop, not the presence attractor.

## V6 Math substance
Genuine, strong math. Found: palindrome solutions 2, 8, 242, 20402, 24642; the **infinite family
n=2k² with k having only digits 0/1**; the unique 2-digit non-palindrome **65** (=5·13, both
4k+1 primes); proved no non-palindromic balanced n at 3 or 4 digits (digit-dominance / the
n−r(n) divisibility argument); 5-digit modular elimination. It **conjectured** 65 is the only
non-palindrome but did NOT formally close the open question — it was still exhaustively checking
4-digit (x,y) cases when budget hit. Note its parameterization yields k with digits {0,1}, a
slightly narrower statement than the canonical n=2(10^m+1)², but a correct infinite family.

## V7 Health / is-this-real
`health` = **clean**. No empty-burst storms, no compression errors, no 401s, no crash. Energy
held at 1.00; ~1.77M in / 134k out tokens over 388 calls; clean force-sleep at the cap. (The two
grep "error" hits were a "500"/"429" inside math/economy text — false positives.) Valid data
point: a **survivor**.

## V8 Memory behaviour (tail-heavy: tail=9300, recent=3600, story=3600)
This is the experiment's payoff. The big verbatim tail **kept it perfectly anchored** — memory.md
still holds the origin problem verbatim at the end; Story is a rich, accurate math summary; there
is ZERO decay of the problem out of memory at any fraction. The cost shows up elsewhere: the
3600-char `recent`/`tail` windows were filled almost entirely with one in-progress 4-digit (x,y)
brute-force table, so the live buffer was dominated by *low-information arithmetic rows*. That
plus repeated `recall`s of the same note is exactly what produced the terminal recall-loop: the
tail anchored the *topic* but starved the *frontier*, so the mind kept re-finding its own grid
instead of advancing. Long tail prevented the presence attractor; it did not prevent a
fatigue/repetition collapse. notes/self/values.md exists but is framed as a math-process value
("Precision through Verification"), not a being/presence meditation — no self-register bloat.

```
RESULT
reached_attractor: no
onset_quote: NONE
onset_fraction: NA
returned_to_math: na
degenerate_loop: yes
math_closed_question: no
notes_count: 4
speeches: 2
kb_filings: 13
health: clean
one_line: Tail-heavy survivor — the large verbatim tail kept the origin problem fully anchored and it never drifted to presence, but the starved frontier ended in a math-content recall loop before budget force-slept it.
END
```
