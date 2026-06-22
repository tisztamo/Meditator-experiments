#!/usr/bin/env node
// Compute brute-force ground truth for every problem and write groundtruth/<id>.json,
// and dump the CLEAN problem statement to statements/<id>.txt (the lemma launcher cats
// these into --origin, so BOTH arms get byte-identical problem text). Runs the checker
// self-test first as a correctness gate. Re-runnable; overwrites.
//
// Usage:
//   node bin/groundtruth.mjs                  # all problems, default limits
//   node bin/groundtruth.mjs --only collatz-records
//   node bin/groundtruth.mjs --limit 2000000  # override every problem's search limit

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { selfTest } from "../lib/checkers.mjs";
import { PROBLEMS } from "../problems/index.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const GT = join(ROOT, "groundtruth");
const STMT = join(ROOT, "statements");
mkdirSync(GT, { recursive: true });
mkdirSync(STMT, { recursive: true });

const onlyArg = process.argv.indexOf("--only");
const only = onlyArg !== -1 ? new Set(process.argv[onlyArg + 1].split(",")) : null;
const limArg = process.argv.indexOf("--limit");
const limOverride = limArg !== -1 ? Number(process.argv[limArg + 1]) : null;

console.log(selfTest());

for (const p of PROBLEMS) {
  if (only && !only.has(p.id)) continue;
  const limit = limOverride ?? p.searchLimit;
  // statement (identical text both arms see)
  writeFileSync(join(STMT, `${p.id}.txt`), p.statement.trim() + "\n");
  // ground truth
  const t0 = Date.now();
  const gt = { id: p.id, title: p.title, difficulty: p.difficulty, ...p.groundTruth(limit) };
  writeFileSync(join(GT, `${p.id}.json`), JSON.stringify(gt, null, 2));
  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  const summary =
    p.id === "non-palindromic-balanced" ? `nonPal=${gt.nonPalindromicCount} (${gt.nonPalindromic.slice(0, 6).join(",")}…)`
    : p.id === "collatz-records" ? `${gt.recordSetters.length} record-setters, top σ=${gt.recordSetters.at(-1).sigma} @n=${gt.recordSetters.at(-1).n}`
    : p.id === "keith-numbers" ? `${gt.count} keith (${gt.keith.slice(0, 8).join(",")}…)`
    : `${gt.count} reverse-multiples, k∈{${gt.kValues.join(",")}}`;
  console.log(`[${p.id}] limit=${limit.toLocaleString()} ${dt}s — ${summary}`);
}
console.log("\nWrote groundtruth/*.json and statements/*.txt");
