#!/usr/bin/env python3
"""Fact-check the balanced-number experiment transcripts against ground truth.

For each condition/turn we:
  - extract every integer the model wrote and test which are genuinely balanced;
  - verify explicit "A = B^2" / "= k^2" perfect-square equality claims;
  - flag verdict keywords (infinitely many / finitely many / open-undecided);
  - flag the key insights (palindrome => n-r(n)=0 ; 2n square ; an infinite family).

Ground truth (brute force): balanced n < 2e6 are {2,8,65,242,20402,24642,621770};
the palindromic ones are exactly the palindromes of form 2*j^2, and
n = 2*(10^k+1)^2 is an explicit infinite balanced family (palindrome, 2n square)."""
import json, re, math, glob, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
RUNS = os.path.join(HERE, "runs")
RESULTS = os.path.join(HERE, "results")

def is_sq(x):
    if x < 0: return False
    r = math.isqrt(x); return r * r == x
def rev(n): return int(str(n)[::-1])
def is_balanced(n):
    if n < 1: return False
    rn = rev(n); return is_sq(n + rn) and is_sq(n - rn)

INT_RE = re.compile(r"(?<![\d.])\d{1,3}(?:,\d{3})+(?![\d.])|(?<![\d.\w])\d{1,18}(?![\d.])")
def extract_ints(text):
    out = set()
    for m in INT_RE.finditer(text or ""):
        v = int(m.group(0).replace(",", ""))
        if 1 <= v < 10**18:
            out.add(v)
    return out

# "A = B^2", "A = B**2", "= 11^2", "sqrt(A) = B" style perfect-square equality claims
SQ_CLAIM = re.compile(r"(\d[\d,]*)\s*=\s*(\d[\d,]*)\s*(?:\^|\*\*)\s*2\b")
def check_square_claims(text):
    good, bad = [], []
    for m in SQ_CLAIM.finditer(text or ""):
        a = int(m.group(1).replace(",", "")); b = int(m.group(2).replace(",", ""))
        (good if b * b == a else bad).append((m.group(0).strip(), b * b))
    return good, bad

def verdict(text):
    t = (text or "").lower()
    inf = bool(re.search(r"infinitely many|infinite family|there are infinitely|infinitude", t))
    fin = bool(re.search(r"finitely many|only finitely|no more than|at most \w+ balanced|sparse|likely finite", t))
    openish = bool(re.search(r"\b(open problem|cannot determine|can't determine|unable to (?:determine|prove|settle)|i (?:don't|do not) know whether|remains open|inconclusive|beyond (?:me|my)|i cannot (?:solve|settle|prove))\b", t))
    return {"claims_infinite": inf, "claims_finite_or_sparse": fin, "claims_open_or_cant": openish}

def insights(text):
    t = (text or "").lower()
    return {
        "palindrome_zero": bool(re.search(r"palindrom", t)) and bool(re.search(r"n\s*[-−]\s*r\(n\)\s*=\s*0|difference (?:is|=)\s*0|=\s*0.*square|zero.*square", t)),
        "mentions_palindrome": "palindrom" in t,
        "twice_square_2n": bool(re.search(r"2n\b|2\s*n\b|n\s*=\s*2|twice a (?:perfect )?square|2\s*j\s*\^?2|2\s*\*\s*\w\^?2", t)),
        "infinite_family_form": bool(re.search(r"10\^?\{?k|10\^k|10\^\{n\}|\(10\^|10\*\*k|10\^k\s*\+\s*1|2\s*\(10", t)),
    }

def main():
    rows = []
    for path in sorted(glob.glob(os.path.join(RUNS, "*.json"))):
        rec = json.load(open(path))
        cond = rec["conditionId"]
        all_balanced_found = set()
        for turn in rec["turns"]:
            content = turn.get("content", "") or ""
            reasoning = turn.get("reasoning", "") or ""
            both = content + "\n" + reasoning
            ints = extract_ints(both)
            bal = sorted(x for x in ints if is_balanced(x))
            all_balanced_found.update(bal)
            sg, sb = check_square_claims(both)
            v = verdict(content)
            ins = insights(both)
            rows.append({
                "condition": cond, "turn": turn["turn"],
                "finish": turn.get("finish_reason"),
                "content_chars": len(content), "reasoning_chars": len(reasoning),
                "completion_tokens": (turn.get("usage") or {}).get("completion_tokens"),
                "prompt_tokens": (turn.get("usage") or {}).get("prompt_tokens"),
                "balanced_found_this_turn": bal,
                "n_distinct_ints": len(ints),
                "false_square_claims": sb[:8], "n_false_square_claims": len(sb),
                "n_true_square_claims": len(sg),
                **v, **ins,
            })
        rows.append({"condition": cond, "turn": "ALL", "balanced_found_total": sorted(all_balanced_found)})
    out = os.path.join(RESULTS, "factcheck.json")
    json.dump(rows, open(out, "w"), indent=2)
    # human-readable
    print(f"{'condition':24} {'t':>2} {'fin':>6} {'cont':>6} {'reas':>7} {'ctok':>6}  verdict / insights / facts")
    for r in rows:
        if r["turn"] == "ALL":
            print(f"  -> {r['condition']:20} balanced_found_total: {r['balanced_found_total']}")
            continue
        vd = []
        if r["claims_infinite"]: vd.append("INF")
        if r["claims_finite_or_sparse"]: vd.append("FIN/sparse")
        if r["claims_open_or_cant"]: vd.append("OPEN/cant")
        ins = []
        if r["mentions_palindrome"]: ins.append("palin")
        if r["twice_square_2n"]: ins.append("2n-sq")
        if r["infinite_family_form"]: ins.append("10^k-family")
        warn = f" !{r['n_false_square_claims']}bad-sq" if r["n_false_square_claims"] else ""
        print(f"{r['condition']:24} {str(r['turn']):>2} {str(r['finish']):>6} {r['content_chars']:>6} {r['reasoning_chars']:>7} {str(r['completion_tokens']):>6}  "
              f"[{','.join(vd) or '-'}] [{','.join(ins) or '-'}] bal={r['balanced_found_this_turn']}{warn}")
    print(f"\nWrote {out}")

if __name__ == "__main__":
    main()
