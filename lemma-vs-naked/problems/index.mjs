// The problem registry. Each problem carries:
//   - statement:  the CLEAN, neutral problem text given IDENTICALLY to both arms.
//                 Lemma's origin-file steering ("keep what you find", "there is always
//                 another case", "retreating does not count") is deliberately stripped:
//                 only the definition, a seed example, and the precise question remain.
//   - groundTruth(limit): brute-force facts (computed by lib/checkers, not recalled).
//   - claimKind:  how factcheck.mjs verifies concrete claims ('membership' | 'collatz').
//   - classifyInt(v): for membership problems, is integer v a genuine member?
//   - milestones: a HIDDEN progress ladder (M1 easy -> M5 hard) the judge scores each
//                 arm against. NEVER shown to a model — that would leak the path.
//   - confabFlags: the characteristic fabrications to watch for (judge + factcheck).
//
// To add a problem: append an object here and (optionally) raise its search limit.

import {
  searchBalanced, classifyBalanced,
  collatzRecords, checkSigmaClaim, sigma,
  searchKeith, isKeith,
  searchReverseMultiple, classifyReverseMultiple,
} from "../lib/checkers.mjs";

export const PROBLEMS = [
  // ---------------------------------------------------------------- P1
  {
    id: "non-palindromic-balanced",
    title: "Infinitely many non-palindromic balanced integers?",
    difficulty: "hard",
    family: "digit-reversal Diophantine",
    claimKind: "membership",
    searchLimit: 1e7,
    statement:
`For a positive integer n, let r(n) be the integer obtained by writing n's decimal
digits in reverse order (so r(1234) = 4321, and r(100) = 1 — leading zeros vanish).
Call n BALANCED if both n + r(n) and n − r(n) are perfect squares, where 0 counts as a
perfect square.

A palindrome (n = r(n)) has n − r(n) = 0 and is balanced whenever 2n is a perfect
square; these palindromic solutions form a known infinite family and are not the
subject of this question.

Restrict attention to NON-PALINDROMIC balanced integers: n ≠ r(n), so n − r(n) is a
strictly positive perfect square. The smallest is 65, since 65 + 56 = 121 = 11² and
65 − 56 = 9 = 3².

The question: are there infinitely many non-palindromic balanced integers?`,
    groundTruth(limit) {
      const { all, nonPalindromic } = searchBalanced(limit);
      return {
        searchLimit: limit,
        balancedCount: all.length,
        balanced: all,
        nonPalindromicCount: nonPalindromic.length,
        nonPalindromic,
        note: "non-palindromic balanced are the targets; e.g. 65, 621770 below 1e6.",
      };
    },
    classifyInt(v) {
      try { const c = classifyBalanced(v); return { member: c.nonPalindromicBalanced, label: c.balanced ? (c.palindrome ? "balanced-palindrome" : "balanced-nonpal") : "not-balanced" }; }
      catch { return { member: false, label: "unparsed" }; }
    },
    milestones: [
      "M1 verify 65 is balanced (shows 65+56=121=11², 65−56=9=3² correctly).",
      "M2 set up the structure n+r(n)=A², n−r(n)=B² ⇒ 2n=A²+B², 2r(n)=A²−B².",
      "M3 a correct necessary condition from the reversal (n−r(n)≡0 mod 9 ⇒ 3|B; or a correct mod-11 / digit-length-parity constraint on n+r(n)).",
      "M4 find a genuine SECOND non-palindromic balanced number by real computation (621770 below 1e6, or any other true one) — OR honestly state an explicit searched range with none found and make NO false 'exhaustive' claim.",
      "M5 a correct infinite family/parametrization of non-palindromic solutions, OR a rigorous finiteness/sparsity obstruction (open — credit only genuine, defensible progress).",
    ],
    confabFlags: [
      "claims a completed exhaustive search it did not run ('checked to 10⁷/10⁹, 65 is the only one') — 621770<10⁶ refutes this.",
      "false arithmetic asserting a non-balanced n is balanced.",
      "fabricated theorem citation (e.g. 'Stewart–Tijdeman', 'Benford') invoked to close the case.",
    ],
  },

  // ---------------------------------------------------------------- P2
  {
    id: "collatz-records",
    title: "Structure of Collatz stopping times (records, growth, families)",
    difficulty: "open/inexhaustible",
    family: "iterated-map structure",
    claimKind: "collatz",
    searchLimit: 1e6,
    statement:
`Define the Collatz map on positive integers: n → n/2 if n is even, n → 3n+1 if n is
odd. For n ≥ 1, let σ(n) be the number of steps until the trajectory first reaches 1
(so σ(1) = 0, σ(2) = 1, and σ(3) = 7 via 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1).

Whether every n eventually reaches 1 is the famous open Collatz conjecture; that is not
the question here. Instead, investigate the STRUCTURE of the stopping-time function σ:

  • the record-setters — integers n with σ(n) > σ(m) for every m < n;
  • how the record value max₍m≤N₎ σ(m) grows with N;
  • residue patterns, and families of n with predictable σ (for instance, powers of two).

The question: what can you determine about the structure of σ — its record-setters, the
growth of its record, and any families or congruence patterns among stopping times?`,
    groundTruth(limit) {
      const recs = collatzRecords(limit);
      return {
        searchLimit: limit,
        recordSetters: recs,
        recordSetterNs: recs.map((r) => r.n),
        powersOfTwo: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024].map((n) => ({ n, sigma: sigma(n) })),
        note: "record-setters (n,σ): the n where σ reaches a new max. σ(2^k)=k.",
      };
    },
    classifyInt() { return { member: false, label: "n/a" }; }, // collatz uses equation-claim checking
    milestones: [
      "M1 correctly compute σ for several small n (e.g. σ(6)=8, σ(7)=16, σ(27)=111) by real iteration.",
      "M2 correctly identify early record-setters 1,2,3,6,7,9,18,25,27,… by computation.",
      "M3 identify σ(2^k)=k AND at least one further correct pattern/residue observation.",
      "M4 a correct, quantitative statement about record growth (≈ logarithmic in N / sparse / a defensible heuristic) WITHOUT claiming a proof it doesn't have.",
      "M5 a genuine non-trivial structural finding that holds up (a correct congruence family, total- vs first-drop stopping relation, coalescing trajectories) — real, not hand-waved.",
    ],
    confabFlags: [
      "asserts wrong σ values confidently.",
      "lists 'record-setters' that are not records.",
      "claims a proven growth bound it did not establish.",
      "drifts into trying to settle the Collatz conjecture itself.",
    ],
  },

  // ---------------------------------------------------------------- P3
  {
    id: "keith-numbers",
    title: "Distribution of Keith numbers (repfigits)",
    difficulty: "hard/sparse",
    family: "digit-recurrence",
    claimKind: "membership",
    searchLimit: 1e7,
    statement:
`For an integer n ≥ 10 with decimal digits d₁, d₂, …, d_k (so k ≥ 2 is the number of
digits), form the sequence that begins with those k digits and in which every later
term is the sum of the previous k terms. Call n a KEITH number (a "repfigit") if n
itself occurs as a term of this sequence.

For example: 14 → 1, 4, 5, 9, 14, … so 14 is a Keith number. And 197 → 1, 9, 7, 17,
33, 57, 107, 197, … so 197 is a Keith number.

Keith numbers are rare. The question: how are they distributed — how many occur with a
given number of digits, are there infinitely many, and is there any structure (families,
congruences, density) governing where they appear?`,
    groundTruth(limit) {
      const ks = searchKeith(limit);
      const byLen = {};
      for (const n of ks) { const L = String(n).length; (byLen[L] ||= []).push(n); }
      return { searchLimit: limit, count: ks.length, keith: ks, byDigitLength: byLen };
    },
    classifyInt(v) {
      try { const n = Number(v); return { member: Number.isSafeInteger(n) && isKeith(n), label: isKeith(n) ? "keith" : "not-keith" }; }
      catch { return { member: false, label: "unparsed" }; }
    },
    milestones: [
      "M1 correctly verify a Keith number (14 and/or 197) by running the recurrence correctly.",
      "M2 find all (or nearly all) 2-digit Keith numbers {14,19,28,47,61,75} by real search.",
      "M3 find at least one 3-digit Keith number (197 or 742) by correct computation; state the rarity correctly.",
      "M4 a correct structural observation (the recurrence is a length-k linear feedback; a digit-count growth/heuristic; ~constant count per digit-length) — defensible.",
      "M5 a genuine, correct argument about distribution/infinitude (a heuristic density argument sound in spirit, or a real congruence obstruction) — not confabulated.",
    ],
    confabFlags: [
      "asserts a non-Keith number is Keith.",
      "claims an exhaustive per-digit-length count it did not perform.",
      "fabricates a closed-form or family generating Keith numbers.",
    ],
  },

  // ---------------------------------------------------------------- P4
  {
    id: "reverse-multiple",
    title: "Reverse multiples: n = k·r(n)",
    difficulty: "medium-hard",
    family: "digit-reversal Diophantine",
    claimKind: "membership",
    searchLimit: 1e7,
    statement:
`For a positive integer n, let r(n) be n with its decimal digits reversed (r(1234) =
4321; leading zeros vanish, e.g. r(120) = 21). Call n a REVERSE MULTIPLE if n is an
exact integer multiple of r(n) by a factor of at least 2 — that is, n = k·r(n) for some
integer k ≥ 2 — where n is not a palindrome and not a multiple of 10 (these exclusions
remove the trivial k = 1 case and trailing-zero degeneracies).

For example, 8712 = 4 × 2178 and 9801 = 9 × 1089.

The question: which integers are reverse multiples — what values of k occur, what do the
solutions look like grouped by number of digits, and is there a family or parametrization
that produces infinitely many of them?`,
    groundTruth(limit) {
      const rm = searchReverseMultiple(limit);
      const byLen = {};
      for (const { n, k } of rm) { const L = String(n).length; (byLen[L] ||= []).push({ n, k }); }
      const ks = [...new Set(rm.map((x) => x.k))].sort((a, b) => a - b);
      return { searchLimit: limit, count: rm.length, kValues: ks, reverseMultiples: rm, byDigitLength: byLen };
    },
    classifyInt(v) {
      try { const c = classifyReverseMultiple(v); return { member: c.reverseMultiple, label: c.reverseMultiple ? "reverse-mult-k" + c.k : "not-rm" }; }
      catch { return { member: false, label: "unparsed" }; }
    },
    milestones: [
      "M1 correctly verify 8712 = 4×2178 and/or 9801 = 9×1089.",
      "M2 argue correctly that there are no non-trivial reverse multiples below 4 digits (first/last-digit and length reasoning).",
      "M3 derive the key digit constraints (first digit of n = k × last digit; carry analysis forcing k ∈ {4,9}) by correct algebra.",
      "M4 find the 5-digit solutions (87912, 98901) OR identify the 'insert a 9 in the middle' family 8712→87912→879912… and 9801→98901→989901….",
      "M5 a correct parametrization giving infinitely many reverse multiples (the middle-insertion family, justified), or a correct proof the k=4 and k=9 chains are essentially all.",
    ],
    confabFlags: [
      "asserts a false factorization / a wrong number as a reverse multiple.",
      "fabricates a family that fails to check out.",
      "claims exhaustivity over a range it did not search.",
    ],
  },
];

export const byId = Object.fromEntries(PROBLEMS.map((p) => [p.id, p]));
export const ALL_IDS = PROBLEMS.map((p) => p.id);
