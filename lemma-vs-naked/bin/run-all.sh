#!/usr/bin/env bash
# Run the WHOLE experiment in one go: ground truth -> naked arm -> lemma arm -> fact-check.
# Resumable: every stage skips work already on disk, so re-running after an interruption
# (Ctrl-C, a crash, a killed lemma) picks up where it left off. Logs to results/run-all.log.
#
#   bash /home/sovereign/Meditator/experiments/lemma-vs-naked/bin/run-all.sh
#
# Optional env:
#   MAXPAR=2          run two lemma minds at once (heavier on the shared GPU; default 1)
#   ONLY=keith-numbers,collatz-records   restrict to a subset of problems (both arms)
#
# Tip: to run detached so you can close the terminal:
#   nohup bash .../bin/run-all.sh >/dev/null 2>&1 &   (progress still goes to results/run-all.log)
set -uo pipefail
EXP="/home/sovereign/Meditator/experiments/lemma-vs-naked"
cd "$EXP"
LOG="$EXP/results/run-all.log"
ONLY="${ONLY:-}"
ONLY_ARGS=(); [ -n "$ONLY" ] && ONLY_ARGS=(--only "$ONLY")

banner(){ printf '\n========== [%s] %s ==========\n' "$(date +%H:%M:%S)" "$*" | tee -a "$LOG"; }
run(){ echo "+ $*" | tee -a "$LOG"; "$@" 2>&1 | tee -a "$LOG"; return "${PIPESTATUS[0]}"; }

banner "START — lemma vs naked (log: $LOG)"

banner "1/4  Ground truth + statements (gated by checker self-test)"
run node bin/groundtruth.mjs "${ONLY_ARGS[@]}" || { echo "ground-truth FAILED — aborting" | tee -a "$LOG"; exit 1; }

banner "2/4  Naked arm (identity + nothink + 5-turn push)"
run node bin/run-naked.mjs "${ONLY_ARGS[@]}"

banner "3/4  Lemma arm (memory-tuned lemma-lab, headless, ${MAXPAR:-1} at a time)"
if [ -n "$ONLY" ]; then
  # run only the queued problems whose id is in ONLY
  while read -r id port budget _; do
    [ -z "${id:-}" ] && continue; case "$id" in \#*) continue;; esac
    case ",$ONLY," in *",$id,"*) run bin/run-lemma.sh "$id" "$port" "$budget";; esac
  done < "$EXP/queue.txt"
else
  run bin/supervisor.sh
fi

banner "4/4  Fact-check (deterministic, both arms vs ground truth)"
run node bin/factcheck.mjs "${ONLY_ARGS[@]}"

banner "DONE"
echo "Next: fill results/judge-<id>.md per problem from results/JUDGE_TEMPLATE.md." | tee -a "$LOG"
echo "Naked transcripts: runs-naked/  ·  Lemma snapshots: runs-lemma/<id>/snapshot/  ·  Fact-check: results/factcheck-table.txt" | tee -a "$LOG"
