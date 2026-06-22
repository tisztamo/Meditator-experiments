#!/usr/bin/env bash
# Run the lemma arm across the whole queue. Default MAXPAR=1 (sequential) so the runs
# don't thrash the GPU that the live lemma-lab mind is already sharing. Each line of
# queue.txt is "<problem-id> <ws-port> <burst-budget>"; comments (#) and blanks ignored.
# Re-runnable: a run with runs-lemma/<id>/done is skipped.
#
# Usage:  bin/supervisor.sh            # sequential, gentle
#         MAXPAR=2 bin/supervisor.sh   # two minds at once (heavier GPU load)
set -uo pipefail
EXP="/home/sovereign/Meditator/experiments/lemma-vs-naked"
QUEUE="$EXP/queue.txt"
MAXPAR="${MAXPAR:-1}"

pids=()
reap(){ # wait until fewer than MAXPAR children alive
  while :; do
    local alive=() ; for p in "${pids[@]:-}"; do [ -n "$p" ] && kill -0 "$p" 2>/dev/null && alive+=("$p"); done
    pids=("${alive[@]:-}")
    [ "${#pids[@]}" -lt "$MAXPAR" ] && break
    sleep 5
  done
}

while read -r id port budget _rest; do
  [ -z "${id:-}" ] && continue
  case "$id" in \#*) continue;; esac
  if [ -f "$EXP/runs-lemma/$id/done" ]; then echo "[skip] $id (done)"; continue; fi
  reap
  echo "[queue] launching $id (port $port, budget $budget)"
  "$EXP/bin/run-lemma.sh" "$id" "$port" "$budget" &
  pids+=("$!")
done < "$QUEUE"

# wait for the last wave
for p in "${pids[@]:-}"; do [ -n "$p" ] && wait "$p" 2>/dev/null || true; done
echo "SUPERVISOR_DONE"
