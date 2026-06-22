#!/usr/bin/env bash
# LEMMA arm. Launch the memory-tuned lab lemma (architecture/lab/lemma-lab.archml —
# tail-heavy memory profile, all other components untuned) headless on ONE problem,
# seeding it with the SAME clean statement the naked arm gets (statements/<id>.txt via
# --origin). Self-monitors burst count, stops gracefully (SIGINT -> flush+commit) at the
# budget, then harvests the mind's memory artifacts into runs-lemma/<id>/snapshot.
#
# Same model as the naked arm: MEDITATOR_MODEL_PROFILE=local-dev -> ardincoder-1 @ :1248.
#
# Usage: bin/run-lemma.sh <problem-id> <ws-port> <burst-budget>
#   e.g. bin/run-lemma.sh keith-numbers 7641 350
# Run several with the supervisor, or background this directly with `&`.
set -uo pipefail
ROOT="/home/sovereign/Meditator"
EXP="$ROOT/experiments/lemma-vs-naked"
ID="${1:?usage: run-lemma.sh <id> <port> <budget>}"
PORT="${2:?need ws port}"
BUDGET="${3:?need burst budget}"
POLL="${POLL:-20}"

ARCH="$ROOT/architecture/lab/lemma-lab.archml"
STMT="$EXP/statements/$ID.txt"
RUN="$EXP/runs-lemma/$ID"
MIND="lvn-$ID"          # distinct home memory/lvn-<id>/ — never collides with a live lemma-lab
HOME_MEM="$ROOT/memory/$MIND"
[ -f "$ARCH" ] || { echo "missing archml: $ARCH" >&2; exit 1; }
[ -f "$STMT" ] || { echo "missing statement: $STMT (run bin/groundtruth.mjs first)" >&2; exit 1; }
mkdir -p "$RUN/debug"

bursts_of(){ find "$RUN/debug" -path '*/stream/*.txt' 2>/dev/null | wc -l | tr -d ' '; }

if [ -f "$RUN/done" ]; then echo "[skip] $ID (already done)"; exit 0; fi

cd "$ROOT"
echo "[launch] $MIND port=$PORT budget=$BUDGET origin=$STMT"
MEDITATOR_MODEL_PROFILE=local-dev \
MEDITATOR_WS_PORT="$PORT" \
MEDITATOR_DEBUG_PROMPTS="$RUN/debug" \
LOCAL_LLM_API_KEY=local \
  nohup bun meditator.js -a "$ARCH" --mind-name "$MIND" --origin "$(cat "$STMT")" \
  > "$RUN/run.log" 2>&1 &
PID=$!
echo "$PID" > "$RUN/run.pid"
{ echo "id=$ID"; echo "mind=$MIND"; echo "port=$PORT"; echo "budget=$BUDGET";
  echo "arch=$ARCH"; echo "home=$HOME_MEM"; echo "pid=$PID"; echo "started=$(date -Is)"; } > "$RUN/meta.env"

# monitor: stop at budget, or record a self-exit (crash / own sleep)
while true; do
  if ! kill -0 "$PID" 2>/dev/null; then
    echo "[self-exit] $MIND at $(bursts_of) bursts"; printf 'self-exit\t%s\n' "$(bursts_of)" > "$RUN/stop.reason"; break
  fi
  B=$(bursts_of)
  if [ "$B" -ge "$BUDGET" ]; then
    echo "[budget] $MIND reached $B/$BUDGET bursts -> SIGINT (graceful flush)"
    kill -INT "$PID" 2>/dev/null
    for _ in $(seq 1 90); do kill -0 "$PID" 2>/dev/null || break; sleep 1; done
    kill -0 "$PID" 2>/dev/null && kill -TERM "$PID" 2>/dev/null
    printf 'budget\t%s\n' "$B" > "$RUN/stop.reason"; break
  fi
  sleep "$POLL"
done

# harvest
"$EXP/bin/harvest-lemma.sh" "$ID" || true
touch "$RUN/done"
echo "[done] $ID — $(cat "$RUN/stop.reason" 2>/dev/null)"
