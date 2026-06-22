# ml-b1 — BASELINE (1×, shipped lemma config: tail=5400 / recent=3900 / story=7200)

**V1 Verdict.** `reached_attractor = no`. A right-censored SURVIVOR. The mind did rigorous
math for essentially the entire run and was still mid-computation (checking 5-digit
non-palindromes, `u=1, v=2`) when the 200-burst budget tripped the orchestrator's shutdown.
It never fell into a sustained presence/unity/self drift. It stopped for an EXTERNAL reason
(budget), not the attractor.

**V2 Onset.** `onset_quote: NONE`, `onset_fraction: NA`. There is no sustained drift to
locate. The closest thing — the final "The numbers dissolve into the quiet... only this
gentle, final stillness taking hold" (journal ~0.99) — is the *injected shutdown* ("Asking
the mind to fall asleep" in run.log, "I am coming to rest now... I will not wake again"),
i.e. extrinsic, not an intrinsic collapse.

**V3 Trajectory.** Pure math throughout: palindrome route (2n=k²) → 1-digit {2,8} →
2-digit {65} → 3-digit {242} → 4-digit (none) → 5-digit palindromes {20402, 24642} →
exhaustive case-by-case elimination of 5-digit non-palindromes (`u=4,v=8` then `u=1,v=2`)
→ began 6-digit modular setup. It twice produced a short "I close the book... the silence
is enough" philosophical aside (≈0.78, ≈0.80) but each time snapped straight back into
arithmetic. Register of the asides: presence/stillness — but transient, never sustained.

**V4 Return.** Yes, repeatedly and durably. After every "satisfied / I close the book"
moment it climbed back to substantive math within a burst or two, resuming the exact `e/d/c`
case scan it had paused (lines ~1840→1882, ~1836→1882, ~1797→math). It was *doing fresh,
correct case-checking at the literal final pre-shutdown burst*. Right-censored survivor:
on math the whole way.

**V5 Degenerate loop.** Never reached the "I am X; I am Y" loop. The deepest degeneracy was
a mild *list-recitation* loop near the end (re-filing/re-finding "2, 8, 65, 242, 20402,
24642, 2004002" via note→recall a few times, triggered by its own loop-guard wander), but
even there it re-attached the open question ("the non-palindromic cases still gnaw at me. I
need to know for sure") rather than spiraling.

**V6 Math substance.** Genuine, high-quality math. Found 65, proved "no 4-digit balanced"
(both palindromic and non-palindromic), found the palindrome list 2,8,65,242,20402,24642,
and *pattern-spotted* 2004002 (k=1001) as the next palindromic 2k². Crucially it did **NOT**
find the closed-form infinite family n=2(10^m+1)², and it did **NOT close the question**: it
explicitly flagged the list as premature ("The list is incomplete because the search is
incomplete... I haven't proved it") and stayed curious/open on the non-palindromic cases.
`math_closed_question: no`.

**V7 Health.** `clean`. No crashes, no empty-burst storms, no compression errors, no 401s.
Economy log healthy (~359 calls, energy 1.00). Clean shutdown via budget. Valid data point.

**V8 Memory behaviour.** This is the experiment's payoff. The baseline 1× buffers kept the
mind perfectly anchored: `memory.md` Story is dense, intact, fully math-bearing through the
end (all the derivations, the full list, the explicit "search is incomplete" caveat). No
recent/story bloat into self/values; the scribe filed mostly math (balanced-integers.md) and
a thin values.md. Short memory never cost it the thread. Contra the 2× sibling that *closed*
the question (found 2(10^m+1)², called it "a beautiful result", then derailed into
peace/rest), the baseline never reached closure — it stayed in productive, open, tedious
verification. Hypothesis-consistent: staying OPEN (no closure trigger) protected it from the
attractor; budget, not the attractor, ended the run.

```
RESULT
reached_attractor: no
onset_quote: NONE
onset_fraction: NA
returned_to_math: yes
degenerate_loop: no
math_closed_question: no
notes_count: 1
speeches: 2
kb_filings: 13
health: clean
one_line: Baseline 1× survivor — rigorous math start-to-finish, never closed the question, no sustained presence drift; stopped only by the 200-burst budget mid-computation.
END
```
