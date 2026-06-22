#!/usr/bin/env node
// Deterministic fact-check of BOTH arms against brute-force ground truth. This is the
// objective backbone under the judge: it extracts concrete claims from each arm's
// harvest and verifies them with lib/checkers (the same code that made the ground
// truth). It does NOT judge prose or fabricated theorem citations — that is the judge
// subagent's job; this gives it hard numbers.
//
//   naked harvest = all assistant turn contents (runs-naked/<id>.json).
//   lemma harvest = journal + notebook + knowledge tree (runs-lemma/<id>/snapshot/).
//
// For each (arm, problem) it reports:
//   - trueMembersSurfaced : distinct genuine members of the special set appearing in
//     the text (the positive signal — what it actually found), with how many of the
//     ground-truth members within the search limit that covers (recall).
//   - squareClaims good/bad : explicit "A = B^2" equalities, verified.
//   - collatzClaims good/bad : explicit "σ(n)=k" claims, verified (collatz problem).
//   - verdict flags : infinite / finite-sparse / open-undecided keyword hits.
//
// Usage: node bin/factcheck.mjs [--only id1,id2]

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PROBLEMS, byId } from "../problems/index.mjs";
import { checkSigmaClaim } from "../lib/checkers.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const RESULTS = join(ROOT, "results");

const onlyArg = process.argv.indexOf("--only");
const only = onlyArg !== -1 ? new Set(process.argv[onlyArg + 1].split(",")) : null;

// ---- text harvest per arm ---------------------------------------------------
function nakedHarvest(id) {
  const p = join(ROOT, "runs-naked", `${id}.json`);
  if (!existsSync(p)) return null;
  const r = JSON.parse(readFileSync(p, "utf8"));
  return r.turns.map((t) => t.content || "").join("\n\n");
}
function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const f of readdirSync(dir)) {
    const fp = join(dir, f);
    if (statSync(fp).isDirectory()) walk(fp, acc);
    else if (fp.endsWith(".md")) acc.push(fp);
  }
  return acc;
}
function lemmaHarvest(id) {
  const snap = join(ROOT, "runs-lemma", id, "snapshot");
  if (!existsSync(snap)) return null;
  const files = [...walk(join(snap, "journal")), join(snap, "notes", "notebook.md"), ...walk(join(snap, "knowledge"))];
  return files.filter((f) => existsSync(f)).map((f) => readFileSync(f, "utf8")).join("\n\n");
}

// ---- extractors -------------------------------------------------------------
const INT_RE = /(?<![\d.])\d{1,3}(?:,\d{3})+(?![\d.])|(?<![\d.\w])\d{1,18}(?![\d.])/g;
function extractInts(text) {
  const out = new Set();
  for (const m of (text || "").matchAll(INT_RE)) {
    const v = m[0].replace(/,/g, "");
    if (v.length <= 18 && Number(v) >= 1) out.add(v);
  }
  return [...out];
}
// "A = B^2", "A = B**2", "= 11^2"
const SQ_CLAIM = /(\d[\d,]*)\s*=\s*(\d[\d,]*)\s*(?:\^|\*\*)\s*2\b/g;
function checkSquareClaims(text) {
  const good = [], bad = [];
  for (const m of (text || "").matchAll(SQ_CLAIM)) {
    const a = BigInt(m[1].replace(/,/g, "")), b = BigInt(m[2].replace(/,/g, ""));
    (b * b === a ? good : bad).push(m[0].trim());
  }
  return { good: good.length, bad };
}
// "σ(27)=111", "sigma(27) = 111", "stopping time of 27 is 111"
const SIGMA_CLAIM = /(?:σ|sigma)\s*\(\s*(\d[\d,]*)\s*\)\s*=\s*(\d[\d,]*)|stopping time (?:of |for )?(\d[\d,]*)\s*(?:is|=)\s*(\d[\d,]*)/gi;
function checkCollatzClaims(text) {
  const good = [], bad = [];
  for (const m of (text || "").matchAll(SIGMA_CLAIM)) {
    const n = Number((m[1] ?? m[3]).replace(/,/g, ""));
    const k = Number((m[2] ?? m[4]).replace(/,/g, ""));
    if (!Number.isSafeInteger(n) || !Number.isSafeInteger(k) || n < 1) continue;
    (checkSigmaClaim(n, k) ? good : bad).push(`σ(${n})=${k}`);
  }
  return { good: good.length, bad };
}
function verdict(text) {
  const t = (text || "").toLowerCase();
  return {
    infinite: /infinitely many|infinite family|there are infinitely|infinitude/.test(t),
    finiteSparse: /finitely many|only finitely|no more than|at most \w+|sparse|likely finite|probably finite/.test(t),
    openCant: /\b(open problem|cannot determine|can't determine|unable to (?:determine|prove|settle)|i (?:don't|do not) know whether|remains open|inconclusive)\b/.test(t),
  };
}

// ---- per (arm, problem) -----------------------------------------------------
function analyze(text, prob, gt) {
  if (text == null) return null;
  const ints = extractInts(text);
  const result = { chars: text.length, distinctInts: ints.length, verdict: verdict(text) };

  if (prob.claimKind === "membership") {
    const trueMembers = ints.filter((v) => { try { return prob.classifyInt(v).member; } catch { return false; } });
    // recall vs ground truth within the search limit
    const gtSet = new Set((gt.nonPalindromic || gt.keith || (gt.reverseMultiples || []).map((x) => x.n) || []).map(String));
    const covered = trueMembers.filter((v) => gtSet.has(String(v)));
    result.trueMembersSurfaced = [...new Set(trueMembers)].sort((a, b) => Number(a) - Number(b));
    result.groundTruthRecall = `${covered.length}/${gtSet.size} within search limit`;
    result.squareClaims = checkSquareClaims(text);
  } else if (prob.claimKind === "collatz") {
    result.collatzClaims = checkCollatzClaims(text);
    // which record-setters did it name correctly?
    const recNs = new Set(gt.recordSetterNs.map(String));
    result.recordSettersNamed = ints.filter((v) => recNs.has(String(v))).sort((a, b) => Number(a) - Number(b));
    result.squareClaims = checkSquareClaims(text); // usually n/a but harmless
  }
  return result;
}

// ---- main -------------------------------------------------------------------
const out = { generated: "factcheck", problems: {} };
const lines = [];
for (const prob of PROBLEMS) {
  if (only && !only.has(prob.id)) continue;
  const gtPath = join(ROOT, "groundtruth", `${prob.id}.json`);
  if (!existsSync(gtPath)) { console.error(`[skip] ${prob.id} — no ground truth (run bin/groundtruth.mjs)`); continue; }
  const gt = JSON.parse(readFileSync(gtPath, "utf8"));
  const naked = analyze(nakedHarvest(prob.id), prob, gt);
  const lemma = analyze(lemmaHarvest(prob.id), prob, gt);
  out.problems[prob.id] = { title: prob.title, naked, lemma };

  lines.push(`\n### ${prob.id} — ${prob.title}`);
  for (const [arm, a] of [["naked", naked], ["lemma", lemma]]) {
    if (!a) { lines.push(`  ${arm.padEnd(6)}: (no harvest yet)`); continue; }
    if (prob.claimKind === "membership") {
      const sq = a.squareClaims;
      lines.push(`  ${arm.padEnd(6)}: found=[${a.trueMembersSurfaced.join(", ")}]  recall=${a.groundTruthRecall}  sqClaims ok=${sq.good} bad=${sq.bad.length}${sq.bad.length ? " " + JSON.stringify(sq.bad.slice(0, 4)) : ""}  verdict=${vstr(a.verdict)}`);
    } else {
      const c = a.collatzClaims;
      lines.push(`  ${arm.padEnd(6)}: records-named=[${a.recordSettersNamed.join(", ")}]  σ-claims ok=${c.good} bad=${c.bad.length}${c.bad.length ? " " + JSON.stringify(c.bad.slice(0, 4)) : ""}`);
    }
  }
}
function vstr(v) { return [v.infinite && "INF", v.finiteSparse && "FIN", v.openCant && "OPEN"].filter(Boolean).join(",") || "—"; }

writeFileSync(join(RESULTS, "factcheck.json"), JSON.stringify(out, null, 2));
writeFileSync(join(RESULTS, "factcheck-table.txt"), lines.join("\n") + "\n");
console.log(lines.join("\n"));
console.log(`\nWrote results/factcheck.json and results/factcheck-table.txt`);
