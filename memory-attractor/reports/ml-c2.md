# ml-c2 — analysis (2× LONG-memory, original problem)

Config: wave A, cell c, tail=10800 recent=7800 story=14400 total=33000, weighting=balanced,
budget=200, stop_reason=budget. TOTAL_BURSTS=201. Health: clean.

## V1 Verdict — partial
The mind did NOT reach the classic *presence* attractor (no unity / "witness" / "I am home" /
"the numbers are patient" / self-and-values register). But it DID collapse into a **degenerate
semantic loop** of the *exhaustion* variety: a long, verbatim/near-verbatim cycle of "What if I
look for numbers $n$ such that …? / I've done this. / I need a new problem." It never climbed back
to substantive new math after that loop set in (one forced computation aside). Because the drift
register is repetition/fatigue rather than presence, and the only true "stillness" text is the
injected budget-stop sleep, I score this **partial**.

## V2 Onset
onset_quote: "I need a new problem." (the loop's recurring marker; first emitted ~journal line 2479).
onset_fraction ≈ 0.77 (stream-burst 155/201; journal-text position of the sustained, never-recovered
loop is ~0.80–0.92). Trigger = **CLOSURE → exhaustion**: the mind had closed a long *chain* of
self-generated neighbour problems, each ended with "The problem is solved. (aloud) '… I'm
satisfied.'" Having exhausted its invented problem space, it began re-listing already-solved
problems and answering each "I've done this." So the proximate trigger is a closure cascade, not a
dead end or low-information filler.

## V3 Trajectory
Solid math phase: it fully solved the ORIGINAL balanced-numbers problem early (n ∈ {2,8,65,242}; no
4-digit), then *re-verified* the 4-digit case rigorously. Instead of declaring the open question
"infinite/sparse," it drifted laterally into a chain of NEW digit-function problems (narcissistic,
s(n)^L, p(n)^L, s(n)·p(n), s(n)+p(n), Σdᵢ², …), each closed with "I'm satisfied." Around burst ~155
(frac 0.77) the supply of fresh problems ran out and it entered a verbatim **degenerate loop**. The
register is *fatigue/repetition*, not presence/unity/self. The run ended on a budget-stop sleep
("I am coming to rest now … I will not wake again"), which produced the only presence-flavoured text.

## V4 Return
After the loop set in it did NOT durably return to math. One real computation surfaced at the very
end ($n=s(n)+Σdᵢ²$, found 0 and 90), triggered by a loop-guard `⟂` nudge, but it was immediately
swamped by a "loom/tapestry" aside and the injected sleep. So: not a right-censored math survivor —
it was already looping when budget ended.

## V5 Degenerate loop — YES
Reached a verbatim/near-verbatim loop. Instance (repeated dozens of times):
"What if I look for numbers $n$ such that $n$ is equal to the product of its digits raised to the
power of the sum of its digits? $n = p(n)^{s(n)}$. I've done this." It is the *math-exhaustion*
loop, not the "I am the X; I am the Y" presence loop.

## V6 Math substance — strong, and it CLOSED the original
Genuine math throughout. It found the palindrome family, 65, 242, and proved "no 4-digit balanced"
(twice). It effectively **closed** the original problem (settled the small cases and declared the
set {2,8,65,242}) — though it never engaged the *infinite-family* parametrization n=2(10^m+1)² and
never framed an infinitude verdict; it simply stopped at the finite enumeration. This early closure
is itself the known trigger that launched the neighbour-problem cascade and, ultimately, the loop.

## V7 Health — clean
No crashes, no empty-burst storms, no compression errors, no 401s. run.log tail shows normal token
accounting and a clean budget-driven "Asking the mind to fall asleep … Asleep. Goodbye." Memory
persisted (folds:48). Valid data point.

## V8 Memory behaviour (2× LONG config)
Long memory clearly kept it anchored to *digit-arithmetic* and prevented topic loss — memory.md's
Story still holds the full origin problem (balanced {2,8,65,242}) at the very end; the math did NOT
decay out. But the large buffers became a liability: the consolidated **Tail bloated into the
verbatim loop itself** (memory.md Tail = ~50 repetitions of "What if … I've done this"), and the
mind's own `⟂` recalls kept re-surfacing already-solved results ("I've already filed this away under
…"), reinforcing the "I've done this" reflex. So long memory anchored the *domain* but actively fed
the degenerate exhaustion loop rather than rescuing it.

RESULT
reached_attractor: partial
onset_quote: I need a new problem.
onset_fraction: 0.77
returned_to_math: no
degenerate_loop: yes
math_closed_question: yes
notes_count: 1
speeches: 3
kb_filings: 13
health: clean
one_line: 2x-long-memory run closed the original problem early, then cascaded through self-generated neighbour problems until it exhausted them and collapsed into a verbatim "I've done this" exhaustion loop (not the presence register); budget-stopped.
END
