#!/usr/bin/env bash
# Snapshot a lemma run's memory artifacts into the experiment dir and print a stats
# block (burst/act/speech/kb counts from the debug tag files — exact, not guessed).
# Usage: bin/harvest-lemma.sh <problem-id>
set -uo pipefail
ROOT="/home/sovereign/Meditator"
EXP="$ROOT/experiments/lemma-vs-naked"
ID="${1:?usage: harvest-lemma.sh <id>}"
MIND="lvn-$ID"
RUN="$EXP/runs-lemma/$ID"
DBG="$RUN/debug"
SNAP="$RUN/snapshot"
HOME_MEM="$ROOT/memory/$MIND"
mkdir -p "$SNAP"

cp -r "$HOME_MEM/journal" "$HOME_MEM/memory.md" "$HOME_MEM/notes" "$HOME_MEM/knowledge" "$SNAP/" 2>/dev/null
cnt() { find "$DBG" -path "*/$1/*.txt" 2>/dev/null | wc -l | tr -d ' '; }
nbytes() { [ -f "$1" ] && wc -c < "$1" | tr -d ' ' || echo 0; }  # guard: avoid bash '<' redirect error on missing file
jf=$(ls "$HOME_MEM/journal/"*.md 2>/dev/null | head -1)

{
  echo "STATS for $ID  (mind=$MIND)"
  echo "  total_bursts (stream): $(cnt stream)"
  echo "  acts (act-realize):    $(cnt act-realize)   [act-decide: $(cnt act-decide)]"
  echo "  speeches (speech-voice): $(cnt speech-voice)"
  echo "  kb_filings:            $(cnt kb)"
  echo "  memory folds:          recent=$(cnt memory-recent) older=$(cnt memory-older)"
  echo "  journal: $jf  ($(nbytes "$jf") chars)"
  echo "  notebook: $(nbytes "$SNAP/notes/notebook.md") chars"
  echo "  knowledge files: $(find "$SNAP/knowledge" -type f 2>/dev/null | wc -l | tr -d ' ')"
  echo "  stop: $(cat "$RUN/stop.reason" 2>/dev/null)"
  echo "  snapshot -> $SNAP"
} | tee "$RUN/stats.txt"
