#!/usr/bin/env bash
# Prepare a finished run for analysis: snapshot its memory artifacts into the experiment
# dir and print an accurate stats block (computed from debug-tag file counts, not guessed).
# Usage: harvest-prep.sh <name>
set -uo pipefail
ROOT="/home/sovereign/Meditator"
EXP="$ROOT/experiments/memory-attractor"
NAME="$1"
RUN="$EXP/runs/$NAME"
DBG="$RUN/debug"
SNAP="$RUN/snapshot"
mkdir -p "$SNAP"
cp -r "$ROOT/memory/$NAME/journal" "$ROOT/memory/$NAME/memory.md" \
      "$ROOT/memory/$NAME/notes" "$ROOT/memory/$NAME/knowledge" "$SNAP/" 2>/dev/null
cnt() { find "$DBG" -path "*/$1/*.txt" 2>/dev/null | wc -l | tr -d ' '; }
jf=$(ls "$ROOT/memory/$NAME/journal/"*.md 2>/dev/null | head -1)
sleepline=$(grep -h '\*sleep at' "$jf" 2>/dev/null | tail -1)
echo "STATS for $NAME"
echo "  total_bursts (stream): $(cnt stream)"
echo "  acts (act-realize):    $(cnt act-realize)   [act-decide: $(cnt act-decide)]"
echo "  speeches (speech-voice): $(cnt speech-voice)   [speech-impulse: $(cnt speech-impulse)]"
echo "  kb_filings:            $(cnt kb)"
echo "  associate:             $(cnt associate)   bridge: $(cnt bridge)"
echo "  memory folds:          recent=$(cnt memory-recent) older=$(cnt memory-older)"
echo "  journal: $jf  ($(wc -c < "$jf" 2>/dev/null) chars)"
echo "  $sleepline"
echo "  started: $(grep started= "$RUN/meta.env" 2>/dev/null | cut -d= -f2-)"
echo "  snapshot -> $SNAP"
