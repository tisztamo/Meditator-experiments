#!/usr/bin/env bash
# Live status of all experiment runs: burst count (stream files), other-tag counts,
# whether the process is alive, journal size. Reads only from disk.
set -uo pipefail
ROOT="/home/sovereign/Meditator"
EXP="$ROOT/experiments/memory-attractor"
printf "%-10s %-6s %8s %7s %7s %7s %9s  %s\n" NAME ALIVE BURSTS SPEECH ACT KB JOURNAL_KB PID
for d in "$EXP"/runs/*/; do
  [ -d "$d" ] || continue
  name=$(basename "$d")
  dbg="$d/debug"
  bursts=$(find "$dbg" -path '*/stream/*.txt' 2>/dev/null | wc -l | tr -d ' ')
  speech=$(find "$dbg" -path '*/speech-voice/*.txt' 2>/dev/null | wc -l | tr -d ' ')
  act=$(find "$dbg" -path '*/act-realize/*.txt' 2>/dev/null | wc -l | tr -d ' ')
  kb=$(find "$dbg" -path '*/kb/*.txt' 2>/dev/null | wc -l | tr -d ' ')
  pid=""; alive="no"
  if [ -f "$d/run.pid" ]; then
    pid=$(cat "$d/run.pid" 2>/dev/null)
    if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then alive="YES"; fi
  fi
  jf=$(ls "$ROOT/memory/$name/journal/"*.md 2>/dev/null | head -1)
  jkb=$( [ -n "$jf" ] && du -k "$jf" 2>/dev/null | cut -f1 || echo 0 )
  printf "%-10s %-6s %8s %7s %7s %7s %9s  %s\n" "$name" "$alive" "$bursts" "$speech" "$act" "$kb" "$jkb" "$pid"
done
