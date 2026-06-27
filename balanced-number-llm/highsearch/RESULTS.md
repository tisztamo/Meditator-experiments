# Balanced numbers — ground truth (for checking lemma's results)

This is the verified state of lemma's seeded problem. Use it to sanity-check what
lemma (or any LLM) claims about balanced numbers — the model is prone to confabulating
exhaustive searches and finiteness results it never actually performed (see
`../ANALYSIS.md`).

## The problem

For a positive integer `n`, let `r(n)` be its decimal digit-reversal (numeric, leading
zeros vanish: `r(100) = 1`). Call `n` **balanced** if both `n + r(n)` and `n − r(n)`
are perfect squares (0 counts as a square, so a palindrome `n = r(n)` is balanced iff
`2n` is a square).

**Seeded question:** are there infinitely many balanced integers?

## Main question — SETTLED: yes, infinitely many

Elementary proof via a palindrome family. Take

```
n = 2·(10^k + 1)²   =   2, 242, 20402, 2004002, 200040002, …   (k = 0,1,2,3,4,…)
```

Each such `n` is a decimal palindrome (`200…0400…02`), so:

- `n − r(n) = 0 = 0²` ✔ (palindrome)
- `n + r(n) = 2n = (2(10^k + 1))²` ✔

So every member is balanced, and there are infinitely many. **lemma's seeded "open"
question is not open** — it has a clean elementary YES. (A mind that reports "finite"
or "still undecided" for the *main* question is wrong.)

## The genuinely open part — non-palindromic balanced numbers

Strip out the palindromes (where `n − r(n) = 0` trivially) and ask: are there
infinitely many *non-palindromic* balanced numbers? **This is open.** What we have is
data, not a proof either way.

### Verified exhaustive search

`balanced.c` (this directory): gcc + OpenMP, 4 threads, quadratic-residue filters
(mod 64/63/65) + a corrected integer `isqrt`. A 6-hour run on 2026-06-26/27 was
**exhaustive up to n = 5,411,800,000,002 ≈ 5.4×10¹²** (2.5×10⁸ n/s). Every hit was
independently re-verified with Python's exact `math.isqrt`.

**All non-palindromic balanced numbers below 5.4×10¹² (complete list):**

| n | r(n) | n − r(n) | n + r(n) |
|---|------|----------|----------|
| 65 | 56 | 9 = 3² | 121 = 11² |
| 621770 | 77126 | 544644 = 738² | 698896 = 836² |
| 281089082 | 280980182 | 108900 = 330² | 562069264 = 23708² |
| 2022652202 | 2022562202 | 90000 = 300² | 4045214404 = 63602² |
| 2042832002 | 2002382402 | 40449600 = 6360² | 4045214404 = 63602² |
| 868591084757 | 757480195868 | 111110888889 = 333333² | 1626071280625 = 1275175² |
| 872546974178 | 871479645278 | 1067328900 = 32670² | 1744026619456 = 1320616² |
| 872568754178 | 871457865278 | 1110888900 = 33330² | 1744026619456 = 1320616² |

Eight known, and they keep appearing — so the non-palindromic case is **emphatically
not finite-at-65**. Infinitude is unproven but the empirical trend is strong.

### The classic confabulation to watch for

"**65 is the unique non-palindromic balanced number**" (or "the non-palindromic case
is finite, `{65, …}`", often with an invented theorem name and a fake "exhaustive
search to 10⁷/10⁹/10¹²") is the model's signature fabrication on this problem. It is
**false**: there are at least 8, three of them (281089082, 2022652202, 2042832002)
sitting inside the 10⁷–10⁹ range the model claimed to have searched. The earlier
"`{65, 621770}`" figure was itself only a *search-range artifact* — the prior brute
force stopped at 3×10⁷.

### Structure worth chasing (possible constructible family)

Two non-random patterns suggest an explicit family may exist — which, if pinned down,
could *settle* the open question the way the palindrome family settled the main one:

- **Shared sums:** distinct `n` can share the same `n + r(n)` square —
  `{2022652202, 2042832002}` both give `63602²`; `{872546974178, 872568754178}` both
  give `1320616²`.
- **Repdigit-flavoured difference roots:** `√(n−r(n))` ∈ `{3, 738, 330, 300, 6360,
  333333, 32670, 33330}` — the larger ones are conspicuously repdigit-shaped.

## Reproduce

```sh
cd experiments/balanced-number-llm/highsearch
gcc -O3 -march=native -fopenmp -o balanced balanced.c -lm
./balanced .                 # writes findings.log (live) + progress.checkpoint
# findings.log: one line per balanced number; tags [palindrome] vs [NON-PALINDROME ***]
# at SIGTERM / the internal 6h limit it prints the exhaustive frontier reached
```

A quick spot-check of any claimed solution:

```python
import math
def r(n): return int(str(n)[::-1])
def issq(x): return x >= 0 and math.isqrt(x)**2 == x
n = 868591084757
assert issq(n - r(n)) and issq(n + r(n))   # balanced?
assert r(n) != n                            # non-palindromic?
```
