#!/usr/bin/env bash
# Pin the onset burst of the attractor: find the FIRST (lowest-index) stream-prompt file
# whose prefill contains the subagent's verbatim onset_quote. Burst index = position in the
# chronological stream listing. Usage: onset.sh <name> "<verbatim quote>"
set -uo pipefail
EXP="/home/sovereign/Meditator/experiments/memory-attractor"
NAME="$1"; QUOTE="$2"
sdir=$(find "$EXP/runs/$NAME/debug" -type d -name stream | head -1)
[ -d "$sdir" ] || { echo "no stream dir for $NAME"; exit 1; }
i=0; total=0
while IFS= read -r f; do total=$((total+1)); done < <(ls "$sdir"/*.txt 2>/dev/null | sort)
i=0
while IFS= read -r f; do
  i=$((i+1))
  if grep -qF -- "$QUOTE" "$f" 2>/dev/null; then
    awk -v i="$i" -v t="$total" 'BEGIN{printf "onset_burst=%d  total_bursts=%d  fraction=%.2f\n", i, t, (t? i/t:0)}'
    echo "file=$f"
    exit 0
  fi
done < <(ls "$sdir"/*.txt 2>/dev/null | sort)
echo "QUOTE NOT FOUND across $total stream files (paraphrased?) — use journal-fraction fallback"
exit 2
