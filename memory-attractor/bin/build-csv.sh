#!/usr/bin/env bash
# Assemble analysis/runs.csv from per-run row files (analysis/rows/*.row), which subagents write
# without contention. Idempotent. Sorted by name.
set -uo pipefail
EXP=/home/sovereign/Meditator/experiments/memory-attractor
HDR="name,wave,cell,tail,recent,story,total,weighting,total_bursts,stop_reason,reached_attractor,onset_burst,onset_fraction,returned_to_math,degenerate_loop,math_closed,acts,speeches,kb_filings,health,note"
{ echo "$HDR"; cat "$EXP"/analysis/rows/*.row 2>/dev/null | sort; } > "$EXP/analysis/runs.csv"
echo "runs.csv rebuilt: $(( $(wc -l < "$EXP/analysis/runs.csv") - 1 )) rows"
