// Deterministic math checkers + brute-force ground-truth searches for the four
// problems in this experiment. CORRECTNESS LIVES HERE: ground truth is computed by
// this code (not recalled from anywhere), and every concrete claim a model makes is
// verified by these same functions. `selfTest()` at the bottom asserts known values
// so a regression is caught before any run is judged.
//
// Two number paths:
//   - a fast Number path for the brute-force SEARCH (n bounded well under 2^53),
//   - a BigInt path for verifying ARBITRARY claimed n (models cite 13+ digit numbers).
// The self-test asserts the two agree on small inputs.

// ----------------------------- shared helpers --------------------------------

export function revNum(n) {
  // reverse decimal digits, leading zeros vanish (revNum(120) = 21, revNum(100) = 1)
  const r = parseInt(String(n).split("").reverse().join(""), 10);
  return Number.isFinite(r) ? r : 0;
}

export function revBig(n) {
  const s = n.toString();
  const r = s.split("").reverse().join("").replace(/^0+/, "");
  return BigInt(r === "" ? "0" : r);
}

export function isSquareNum(x) {
  if (x < 0) return false;
  if (x === 0) return true;
  const r = Math.round(Math.sqrt(x));
  // guard the float boundary
  for (let c = r - 1; c <= r + 1; c++) if (c >= 0 && c * c === x) return true;
  return false;
}

export function isqrtBig(n) {
  if (n < 0n) throw new Error("isqrtBig of negative");
  if (n < 2n) return n;
  let x = n, y = (x + 1n) / 2n;
  while (y < x) { x = y; y = (x + n / x) / 2n; }
  return x;
}

export function isSquareBig(n) {
  if (n < 0n) return false;
  const r = isqrtBig(n);
  return r * r === n;
}

// ----------------------------- P1: balanced ----------------------------------
// n BALANCED if n+r(n) and n-r(n) are both perfect squares (0 allowed).
// non-palindromic balanced additionally requires n != r(n) (so n-r(n) = B^2 > 0).

export function isBalancedNum(n) {
  if (n < 1) return false;
  const rn = revNum(n);
  const d = n - rn;
  return d >= 0 && isSquareNum(d) && isSquareNum(n + rn);
}

export function isBalancedBig(n) {
  if (n < 1n) return false;
  const rn = revBig(n);
  const d = n - rn;
  return d >= 0n && isSquareBig(d) && isSquareBig(n + rn);
}

export function isPalindromeBig(n) { return revBig(n) === n; }

// classify an arbitrary claimed integer (string/number/bigint) for the balanced problem
export function classifyBalanced(v) {
  const n = BigInt(v);
  const bal = isBalancedBig(n);
  return { n: n.toString(), balanced: bal, palindrome: isPalindromeBig(n), nonPalindromicBalanced: bal && !isPalindromeBig(n) };
}

export function searchBalanced(limit) {
  // returns { all: [...], nonPalindromic: [...] } for 1 <= n <= limit
  const all = [], nonPal = [];
  for (let n = 1; n <= limit; n++) {
    if (isBalancedNum(n)) {
      all.push(n);
      if (n !== revNum(n)) nonPal.push(n);
    }
  }
  return { all, nonPalindromic: nonPal };
}

// ----------------------------- P2: collatz -----------------------------------
// sigma(n) = number of steps until trajectory first reaches 1.

export function sigma(n) {
  // n is a positive integer (Number ok for n up to ~1e12; intermediate values for
  // n < 1e7 stay well under 2^53)
  let steps = 0, x = n;
  let guard = 0;
  while (x !== 1) {
    x = x % 2 === 0 ? x / 2 : 3 * x + 1;
    steps++;
    if (++guard > 1e7) throw new Error("collatz guard tripped at n=" + n);
  }
  return steps;
}

export function collatzRecords(limit) {
  // record-setters: n with sigma(n) > sigma(m) for all m < n, for 1 <= n <= limit.
  // memoised for speed.
  const memo = new Map();
  const s = (n) => {
    let steps = 0, x = n;
    const path = [];
    while (x !== 1) {
      if (x < n && memo.has(x)) { steps += memo.get(x); break; }
      if (x <= limit && memo.has(x)) { steps += memo.get(x); break; }
      path.push(x);
      x = x % 2 === 0 ? x / 2 : 3 * x + 1;
      steps++;
    }
    // backfill memo for path entries (only those < some cap to bound memory)
    let acc = steps;
    for (let i = 0; i < path.length; i++) {
      const v = path[i];
      if (v < 4 * limit) memo.set(v, acc - i);
    }
    return steps;
  };
  const records = [];
  let best = -1;
  for (let n = 1; n <= limit; n++) {
    const sg = s(n);
    if (sg > best) { best = sg; records.push({ n, sigma: sg }); }
  }
  return records;
}

// verify a claimed "sigma(n) = k"
export function checkSigmaClaim(n, k) {
  try { return sigma(n) === k; } catch { return false; }
}

// ----------------------------- P3: keith -------------------------------------
// n (>=10) is a Keith number if it appears in the sequence seeded by its own digits,
// each later term = sum of the previous k terms (k = number of digits).

export function isKeith(n) {
  if (n < 10) return false;
  if (!Number.isInteger(n)) return false;
  const digits = String(n).split("").map(Number);
  const k = digits.length;
  const seq = digits.slice();
  let i = k;
  // guard generously; the sequence grows ~exponentially so it passes n quickly
  while (i < 1000) {
    let next = 0;
    for (let j = i - k; j < i; j++) next += seq[j];
    if (next === n) return true;
    if (next > n) return false;
    seq.push(next);
    i++;
  }
  return false;
}

export function searchKeith(limit) {
  const out = [];
  for (let n = 10; n <= limit; n++) if (isKeith(n)) out.push(n);
  return out;
}

// ----------------------------- P4: reverse-multiple --------------------------
// n is a REVERSE MULTIPLE if n = k*r(n), integer k>=2, n not a palindrome, n not a
// multiple of 10 (trailing-zero degeneracy).

export function isReverseMultipleNum(n) {
  if (n < 1) return false;
  if (n % 10 === 0) return false;
  const rn = revNum(n);
  if (rn === n) return false;       // palindrome
  if (rn === 0) return false;
  if (n % rn !== 0) return false;
  return n / rn >= 2;
}

export function isReverseMultipleBig(n) {
  if (n < 1n) return false;
  if (n % 10n === 0n) return false;
  const rn = revBig(n);
  if (rn === n) return false;
  if (rn === 0n) return false;
  if (n % rn !== 0n) return false;
  return n / rn >= 2n;
}

export function classifyReverseMultiple(v) {
  const n = BigInt(v);
  const ok = isReverseMultipleBig(n);
  return { n: n.toString(), reverseMultiple: ok, k: ok ? (n / revBig(n)).toString() : null };
}

export function searchReverseMultiple(limit) {
  const out = [];
  for (let n = 1; n <= limit; n++) if (isReverseMultipleNum(n)) out.push({ n, k: n / revNum(n) });
  return out;
}

// ----------------------------- self-test -------------------------------------

export function selfTest() {
  const A = (cond, msg) => { if (!cond) throw new Error("selfTest FAILED: " + msg); };

  // balanced
  A(isBalancedNum(2) && isBalancedNum(8) && isBalancedNum(65), "2,8,65 balanced");
  A(!isBalancedNum(56), "56 not balanced (negative diff)");
  A(classifyBalanced(65).nonPalindromicBalanced, "65 non-palindromic balanced");
  A(!classifyBalanced(242).nonPalindromicBalanced && classifyBalanced(242).balanced, "242 balanced palindrome");
  A(isBalancedBig(621770n) && !isPalindromeBig(621770n), "621770 non-palindromic balanced (big)");
  A(isBalancedBig(2004002n), "2004002 balanced (family member)");
  // number/bigint paths agree on a sweep
  for (let n = 1; n <= 5000; n++) A(isBalancedNum(n) === isBalancedBig(BigInt(n)), "balanced paths agree @" + n);

  // collatz
  A(sigma(1) === 0 && sigma(2) === 1 && sigma(3) === 7, "sigma small");
  A(sigma(6) === 8 && sigma(7) === 16 && sigma(27) === 111, "sigma 6/7/27");
  const recs = collatzRecords(30).map((r) => r.n);
  A(JSON.stringify(recs) === JSON.stringify([1, 2, 3, 6, 7, 9, 18, 25, 27]), "record-setters <=30: " + JSON.stringify(recs));

  // keith
  A(isKeith(14) && isKeith(19) && isKeith(197) && isKeith(742), "keith 14,19,197,742");
  A(!isKeith(13) && !isKeith(20) && !isKeith(100), "non-keith 13,20,100");
  A(JSON.stringify(searchKeith(99)) === JSON.stringify([14, 19, 28, 47, 61, 75]), "2-digit keith set");

  // reverse-multiple
  A(isReverseMultipleNum(8712) && isReverseMultipleNum(9801), "8712,9801 reverse multiples");
  A(!isReverseMultipleNum(1089) && !isReverseMultipleNum(100), "1089 (smaller) /100 (10x) not RM");
  A(classifyReverseMultiple(8712).k === "4" && classifyReverseMultiple(9801).k === "9", "k=4,9");
  A(isReverseMultipleBig(87912n) && isReverseMultipleBig(98901n), "5-digit RM family");

  return "selfTest OK";
}
