# Check-in runbook (run this each time I wake during the overnight autonomous phase)

The autonomous **supervisor** (`bin/supervisor.sh`, started ~20:48 UTC 2026-06-21, task bzkm9jnn1)
keeps ≤4 minds running from `queue.txt`, stops each at its per-run `budget` (graceful SIGINT →
flush+commit), logs to `completed.log`, stamps `runs/<name>/done`, launches the next queued config.
It does NO analysis. I batch-harvest at each check-in. Minds are detached (`nohup`), so they survive
my sleeps; only the supervisor's exit notifies me.

## Each check-in, in order:
1. **Health.** `ps -eo pid,args | grep -E 'supervisor.sh|meditator.js' | grep -v grep`
   - If NO supervisor process → restart it (idempotent; adopts running runs, resumes queue):
     `MAXPAR=4 POLL=30 bash experiments/memory-attractor/bin/supervisor.sh` (run_in_background).
   - `bash bin/status.sh` for burst counts; `tail bin/../supervisor.run.log`; `cat completed.log`.
2. **Harvest** every run with `runs/<name>/done` but NOT `runs/<name>/harvested`:
   - Spawn ONE analysis subagent per such run, IN PARALLEL (one message, many Agent calls).
   - Each subagent reads SUBAGENT_VIEWPOINTS.md, writes `reports/<name>.md`, runs `onset.sh`,
     appends `analysis/rows/<name>.row`, returns ONE line. (Pass it: name, wave, cell, tail,
     recent, story, total, weighting, budget, stop_reason — read from `runs/<name>/meta.env`.)
   - After they return: `touch runs/<name>/harvested` for each; `bash bin/build-csv.sh`.
3. **Cull dead long-runs (manual, safe).** For any LONG-budget run (hard-*/long-*) still alive,
   peek `tail -c 700 memory/<name>/journal/*.md`. If it's VISUALLY in a sustained presence/"I am
   X; I am Y"/peace-rest loop (not math), `kill -INT $(cat runs/<name>/run.pid)` to free the GPU.
   (Do NOT auto-script this — the heuristic version had a false-positive that killed a healthy run.)
4. **Adapt the queue.** Based on rows so far, append new configs to `queue.txt` (supervisor picks
   them up as slots free). Keep cells balanced toward n≥2; refine gradient edges where the
   survive↔derail transition sits; keep the harder-problem sustain runs going.
5. **Update** `WAVES.md` synthesis briefly. Then **sleep long again** (~75–90 min) via a
   background `sleep` command (run_in_background) so I'm re-invoked. Keep my own narration terse.

## Metric reminder (per Kris): closure→attractor is an ACCEPTABLE end (solved it, no new question).
The DV of interest is **how long it sustains productive math** and whether it derails WITHOUT
solving (the bad mode). Harder problem = test whether a closure-resistant question sustains longer.

## Naming: ml-{a..h}{rep} = memory-gradient cells; ml-hard-* = harder problem; ml-long-* = long budget.
Cells: a=0.25× b=1×(base) c=2× d=tail-heavy@const-total e=0.5× g=1.5× h=3×. weighting=balanced
except d=tail-heavy. total = tail+recent+story.
