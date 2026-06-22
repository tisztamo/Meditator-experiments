#!/usr/bin/env bash
# Generate a lemma-lab variant archml that differs ONLY in the three memory-buffer
# lengths. Usage: gen-archml.sh <name> <tail> <recent> <story>
# The mind-level tailLength and memory tailLength are both set to <tail> (kept equal,
# as the baseline has them). blockMin=800 and storyEvery=5 are left untouched.
set -euo pipefail
ROOT="/home/sovereign/Meditator"
TEMPLATE="$ROOT/architecture/lab/lemma-lab.archml"
OUT_DIR="$ROOT/experiments/memory-attractor/archml"
NAME="$1"; T="$2"; R="$3"; S="$4"
OUT="$OUT_DIR/$NAME.archml"
# Template values are fixed: tailLength="5400" (x2), recentLength="3900", storyLength="7200".
sed -e "s/tailLength=\"5400\"/tailLength=\"$T\"/g" \
    -e "s/recentLength=\"3900\"/recentLength=\"$R\"/" \
    -e "s/storyLength=\"7200\"/storyLength=\"$S\"/" \
    "$TEMPLATE" > "$OUT"
# Verify the three params landed exactly as intended.
got_t=$(grep -c "tailLength=\"$T\"" "$OUT" || true)
got_r=$(grep -c "recentLength=\"$R\"" "$OUT" || true)
got_s=$(grep -c "storyLength=\"$S\"" "$OUT" || true)
echo "$NAME: tail=$T(x$got_t) recent=$R(x$got_r) story=$S(x$got_s) -> $OUT"
if [ "$got_t" -ne 2 ] || [ "$got_r" -ne 1 ] || [ "$got_s" -ne 1 ]; then
  echo "  !! PARAM COUNT MISMATCH (expected tail x2, recent x1, story x1)" >&2
  exit 1
fi
