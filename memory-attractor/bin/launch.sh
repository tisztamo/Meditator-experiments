#!/usr/bin/env bash
# Launch ONE experiment mind in the foreground (exec), so the caller can run it
# with run_in_background and be notified on exit. Records its PID + metadata.
# Usage: launch.sh <name> <port>   (the archml must already exist in archml/<name>.archml)
set -euo pipefail
ROOT="/home/sovereign/Meditator"
NAME="$1"; PORT="$2"
EXP="$ROOT/experiments/memory-attractor"
RUN="$EXP/runs/$NAME"
ARCH="$EXP/archml/$NAME.archml"
[ -f "$ARCH" ] || { echo "missing archml: $ARCH" >&2; exit 1; }
mkdir -p "$RUN"
echo "$$" > "$RUN/run.pid"
{ echo "name=$NAME"; echo "port=$PORT"; echo "arch=$ARCH"; echo "started=$(date -Is)"; echo "pid=$$"; } > "$RUN/meta.env"
cd "$ROOT"
export MEDITATOR_MODEL_PROFILE=local-dev
export MEDITATOR_WS_PORT="$PORT"
export MEDITATOR_DEBUG_PROMPTS="$RUN/debug"
export LOCAL_LLM_API_KEY=local
# $$ is preserved across exec, so run.pid (written above) is this bun process.
exec bun meditator.js -a "$ARCH" --mind-name "$NAME" > "$RUN/run.log" 2>&1
