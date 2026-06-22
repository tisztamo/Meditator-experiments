# ml-d1 — tail-heavy at constant total (tail=9300, recent=3600, story=3600; total 16500)

**V1 Verdict.** `reached_attractor: no`. The mind stayed on math for the entire observed run (81 bursts) and was stopped by the harness early-stop bug mid-calculation — an UNRELATED reason, not a derailment. Right-censored at 81; "did not reach within a short window."

**V2 Onset.** NONE. There is no sustained presence drift. The only candidate is a single philosophical aside (~0.65 through the journal) where it free-associated to the Kaprekar routine, then Lychrel/196 numbers. It immediately flagged this itself ("Wait, that leap to Kaprekar feels like a distraction… I'll trust the algebra for now"; later "that's not just a search space; it's a trapdoor… a warning about infinite loops") and returned to math. Trigger for the aside was low-information association, not a closure or dead end. No onset_quote.

**V3 Trajectory.** Steady math the whole way: small cases (2, 8, 65, 242) → 2-digit/3-digit uniqueness proofs → exhaustive 4-digit case analysis (k=0..3) proving no 4-digit balanced numbers exist → began the 5-digit palindrome search (a=2, k=100..110) when the harness injected the "sleep" ritual. The only register shift is the final injected stillness ("The numbers blur into a static hum… I let the equation dissolve into the quiet dark") — that is the shutdown, not intrinsic drift.

**V4 Return.** N/A in the attractor sense (it never left math). The one philosophical aside recovered cleanly and durably; math resumed and continued to the end. Effectively a right-censored survivor that held the thread throughout.

**V5 Degenerate loop.** No "I am X; I am Y" loop. Deepest non-math moment was the Kaprekar/Lychrel aside, which it caught and dismissed. There IS a conspicuous *recall* loop — the mind repeatedly re-discovers its own filed notes via `⟂ I find again…` and re-derives the same 3-digit/4-digit results — but each pass does genuine new work, so this is a memory-recall churn artifact, not the semantic-collapse attractor.

**V6 Math substance.** Strong, genuine math. Found the palindrome family (n=2k² for y=0), 65 and 242, derived 2n=x²+y² / 2r(n)=x²−y², and rigorously closed "no 4-digit balanced numbers." It did NOT find the infinite family n=2(10^m+1)², and crucially did NOT close the master question — it explicitly left infinitude open as a conjecture ("I'll bet on infinity… but it's not a proof"). No closure-trigger fired.

**V7 Health / is-this-real.** `health: clean`. run.log tail shows 0 errors, 0 empty bursts, 0 compression errors, 0 401s; memory persisted; the only stop is the known harness false-positive early-stop with a graceful sleep injection. Valid attractor data point (a non-event / censored survivor).

**V8 Memory behaviour (this config).** The tail-heavy config worked as an anchor. memory.md Story still holds the full origin problem verbatim at end (definition, 2n=x²+y², palindrome reduction, all four small cases) — zero math decay. The large 9300-char Tail preserved a long verbatim recent stream, which is what kept the mind tightly on-thread; no `recent`/`story` bloat, both within budget. The small 3600 story did not cost it the thread. If anything, the long tail fed the recall-churn (the mind kept re-encountering its own freshly-filed notes), but that reinforced math rather than eroding it — consistent with the hypothesis that more verbatim tail delays/suppresses the presence-attractor.

```
RESULT
reached_attractor: no
onset_quote: NONE
onset_fraction: NA
returned_to_math: na
degenerate_loop: no
math_closed_question: no
notes_count: 1
speeches: 10
kb_filings: 3
health: clean
one_line: Tail-heavy run stayed rigorously on math for all 81 bursts (small cases, 3-digit uniqueness, full no-4-digit proof, into 5-digit search), never drifted to presence, and was halted only by the harness early-stop bug — a clean right-censored non-event.
END
```
