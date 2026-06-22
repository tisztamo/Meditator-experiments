#!/usr/bin/env bash
# Event-driven supervisor tick. Blocks until ONE live experiment run reaches a stop
# condition, stops it gracefully (SIGINT -> final flush + git commit), waits for clean
# exit, then prints a one-line verdict and exits 0 so the orchestrator (the agent) is
# notified and can harvest it. Designed to be relaunched after each harvest.
#
# Stop condition (ONLY):
#   budget : bursts >= BUDGET (default 200) -> survivor (censored) or full-arc derailer.
# The old "degenerate" early-stop heuristic was REMOVED: it false-positived and cut a
# healthy math run (ml-d1) short at burst 80. With ample GPU time the budget is the clean,
# reliable stop; the analysis subagent finds onset from the journal regardless of where we
# stop, so running a derailer to 200 costs only GPU, never correctness.
# If no run is alive, prints "NONE" and exits (lets the agent move to the next wave).
set -uo pipefail
ROOT="/home/sovereign/Meditator"
EXP="$ROOT/experiments/memory-attractor"
BUDGET="${BUDGET:-200}"
POLL="${POLL:-20}"

bursts_of() { find "$EXP/runs/$1/debug" -path '*/stream/*.txt' 2>/dev/null | wc -l | tr -d ' '; }

while true; do
  alive=0
  for d in "$EXP"/runs/*/; do
    [ -d "$d" ] || continue
    name=$(basename "$d")
    pidf="$d/run.pid"; [ -f "$pidf" ] || continue
    pid=$(cat "$pidf" 2>/dev/null); [ -n "$pid" ] || continue
    kill -0 "$pid" 2>/dev/null || continue      # not alive
    # skip runs already harvested (stamp file)
    [ -f "$d/harvested" ] && continue
    alive=$((alive+1))
    b=$(bursts_of "$name")
    reason=""
    if [ "$b" -ge "$BUDGET" ]; then reason="budget"; fi
    if [ -n "$reason" ]; then
      kill -INT "$pid" 2>/dev/null
      # wait up to 70s for graceful exit
      for _ in $(seq 1 70); do kill -0 "$pid" 2>/dev/null || break; sleep 1; done
      echo "DONE name=$name reason=$reason bursts=$b"
      exit 0
    fi
  done
  if [ "$alive" -eq 0 ]; then echo "NONE"; exit 0; fi
  sleep "$POLL"
done
