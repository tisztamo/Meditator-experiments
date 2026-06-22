#!/usr/bin/env bash
# Autonomous overnight supervisor. Keeps <=MAXPAR minds running from queue.txt, stops each at
# its per-run budget (graceful SIGINT -> flush+commit), logs completion, launches the next queued
# config. Adopts already-running runs (reads their budget from meta.env, default 200). Does NOT
# analyse (the agent batch-harvests runs stamped runs/<name>/done but not /harvested). Exits when
# the queue has no unstarted lines AND nothing is alive.
#
# Robust by design: the ONLY automatic stop is budget (no fragile text heuristic — that bug already
# cost a healthy run). Degenerate long-runs are culled MANUALLY by the agent at check-ins.
set -uo pipefail
ROOT=/home/sovereign/Meditator
EXP=$ROOT/experiments/memory-attractor
MAXPAR=${MAXPAR:-4}
POLL=${POLL:-30}
QUEUE=$EXP/queue.txt
COMPLETED=$EXP/completed.log
RUNLOG=$EXP/supervisor.run.log

log(){ echo "[$(date -Is)] $*" >> "$RUNLOG"; }
bursts_of(){ find "$EXP/runs/$1/debug" -path '*/stream/*.txt' 2>/dev/null | wc -l | tr -d ' '; }
alive_of(){ local p; p=$(cat "$EXP/runs/$1/run.pid" 2>/dev/null); [ -n "$p" ] && kill -0 "$p" 2>/dev/null; }
budget_of(){ local b; b=$(grep '^budget=' "$EXP/runs/$1/meta.env" 2>/dev/null | cut -d= -f2); echo "${b:-200}"; }

launch_run(){ # name tail recent story budget port originf
  local name=$1 t=$2 r=$3 s=$4 budget=$5 port=$6 originf=$7
  "$EXP/bin/gen-archml.sh" "$name" "$t" "$r" "$s" >/dev/null 2>&1 || { log "GENFAIL $name"; return 1; }
  local run="$EXP/runs/$name"; mkdir -p "$run"
  { echo "name=$name"; echo "port=$port"; echo "budget=$budget"; echo "tail=$t"; echo "recent=$r"; echo "story=$s";
    echo "arch=$EXP/archml/$name.archml"; echo "started=$(date -Is)"; echo "origin=$originf"; } > "$run/meta.env"
  cd "$ROOT"
  if [ "$originf" != "-" ] && [ -f "$originf" ]; then
    MEDITATOR_MODEL_PROFILE=local-dev MEDITATOR_WS_PORT="$port" MEDITATOR_DEBUG_PROMPTS="$run/debug" LOCAL_LLM_API_KEY=local \
      nohup bun meditator.js -a "$EXP/archml/$name.archml" --mind-name "$name" --origin "$(cat "$originf")" > "$run/run.log" 2>&1 &
  else
    MEDITATOR_MODEL_PROFILE=local-dev MEDITATOR_WS_PORT="$port" MEDITATOR_DEBUG_PROMPTS="$run/debug" LOCAL_LLM_API_KEY=local \
      nohup bun meditator.js -a "$EXP/archml/$name.archml" --mind-name "$name" > "$run/run.log" 2>&1 &
  fi
  echo $! > "$run/run.pid"
  log "LAUNCH $name t=$t r=$r s=$s budget=$budget port=$port origin=$originf pid=$(cat "$run/run.pid")"
}

stop_run(){ # name reason bursts
  local name=$1 reason=$2 b=$3 pid; pid=$(cat "$EXP/runs/$name/run.pid" 2>/dev/null)
  kill -INT "$pid" 2>/dev/null
  for _ in $(seq 1 80); do kill -0 "$pid" 2>/dev/null || break; sleep 1; done
  printf '%s\t%s\t%s\t%s\n' "$(date -Is)" "$name" "$reason" "$b" >> "$COMPLETED"
  touch "$EXP/runs/$name/done"
  log "STOP $name reason=$reason bursts=$b"
}

log "supervisor up (MAXPAR=$MAXPAR POLL=$POLL)"
while true; do
  # 1. stop runs that reached budget; record self-exits (crash/own sleep)
  for run in "$EXP"/runs/*/; do
    name=$(basename "$run")
    if [ -f "$run/done" ] || [ -f "$run/harvested" ]; then continue; fi
    [ -f "$run/meta.env" ] || continue
    if alive_of "$name"; then
      b=$(bursts_of "$name"); bud=$(budget_of "$name")
      if [ "$b" -ge "$bud" ]; then stop_run "$name" budget "$b"; fi
    else
      # not alive and not stamped done -> it exited on its own
      if [ -f "$run/run.pid" ]; then
        b=$(bursts_of "$name")
        printf '%s\t%s\t%s\t%s\n' "$(date -Is)" "$name" "self-exit" "$b" >> "$COMPLETED"
        touch "$run/done"; log "SELF-EXIT $name bursts=$b"
      fi
    fi
  done
  # 2. count alive
  alive=0
  for run in "$EXP"/runs/*/; do n=$(basename "$run"); [ -f "$run/meta.env" ] || continue; alive_of "$n" && alive=$((alive+1)); done
  # 3. fill free slots from the queue (first lines whose runs/<name>/meta.env does not yet exist)
  unstarted_remain=0
  while [ "$alive" -lt "$MAXPAR" ]; do
    launched=0
    while read -r name t r s budget port originf; do
      [ -z "${name:-}" ] && continue
      case "$name" in \#*) continue;; esac
      [ -f "$EXP/runs/$name/meta.env" ] && continue   # already started
      launch_run "$name" "$t" "$r" "$s" "$budget" "$port" "$originf" && { alive=$((alive+1)); launched=1; }
      break
    done < "$QUEUE"
    [ "$launched" -eq 0 ] && break
  done
  # 4. are there still unstarted queue lines?
  while read -r name t r s budget port originf; do
    [ -z "${name:-}" ] && continue
    case "$name" in \#*) continue;; esac
    [ -f "$EXP/runs/$name/meta.env" ] || { unstarted_remain=1; break; }
  done < "$QUEUE"
  # 5. exit when fully drained
  if [ "$alive" -eq 0 ] && [ "$unstarted_remain" -eq 0 ]; then log "DRAINED - exiting"; echo "SUPERVISOR_DONE"; exit 0; fi
  sleep "$POLL"
done
