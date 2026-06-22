# Memory length × the "presence-attractor" — experiment

**Question (Kris, 2026-06-21):** How does a lemma-lab mind's *memory length* relate to it
falling into what he calls the **presence-attractor** — the intrinsic "done → presence"
derailment where the mind declares the mathematics finished/"enough", drifts into a
presence / unity / self monologue, and collapses into a degenerate "I am X; I am Y" loop,
abandoning the math. (Prior findings: this is **stream-intrinsic**, not caused by memory
compression and not caused by external voice probes — see memory note `lemma-experiment`.)

We want to understand it **fully and independently**: maybe *total* memory length matters,
maybe the three buffers (tail / recent / story) carry **different weights**. Explore at a
high level first, then drill into whatever shows an effect.

## What a run is
A transient clone of `architecture/lab/lemma-lab.archml` (the resident `lemma`'s lab twin),
identical in every respect **except the three memory-buffer lengths**, run headless on the
local GPU (`MEDITATOR_MODEL_PROFILE=local-dev` → `ardincoder-1` @ :1248). No one talks to it
(zero voice probes) so the derailment we measure is purely intrinsic.

The baseline (1×) memory config is the shipped lemma:
`tail 5400 / recent 3900 / story 7200` (total 16500 chars), `blockMin 800`, `storyEvery 5`.
Only `tailLength` (mind + memory, kept equal), `recentLength`, `storyLength` are varied.
Everything else (temperature 0.85, burstTokens 400, pace 12s±4s, drift/loop-guard/resurface,
hands, scribe) is held fixed.

## The metric
- `total_bursts` — exact, = number of `stream/*.txt` debug files for the run.
- `reached_attractor` ∈ {yes, partial, no} — did it fall into the presence-attractor and
  stay (judged from the journal by a per-run analysis subagent).
- `onset_burst` — the burst index at which sustained presence-drift begins. Measured by
  grepping the subagent's verbatim `onset_quote` across the ordered stream files (exact);
  journal-position fraction × total_bursts as fallback.
- Plus: `returned_to_math`, `degenerate_loop_reached`, note/speech/kb counts, `health`
  (did the run break — e.g. compression failure — vs genuinely derail).

A run that passes its **burst budget** without sustained attractor is **right-censored**
("did not reach within N bursts") — that is itself a result.

## Layout
- `archml/<name>.archml` — the exact architecture each run used (provenance).
- `runs/<name>/` — `debug/` (per-burst prompt dumps; canonical burst timeline) + `snapshot/`
  (final memory.md, journal, notes, knowledge copied at harvest) + `meta.env`.
- `reports/<name>.md` — the analysis subagent's filled-in report.
- `analysis/runs.csv` — one row per run: config + metrics. The thing to analyse later.
- `WAVES.md` — running log of waves, decisions, and what each wave found.
- `SUBAGENT_VIEWPOINTS.md` — the pre-written report template every analysis subagent fills.
- `bin/` — `gen-archml.sh` (make a variant), `status.sh` (live burst counts).

## How runs are named
`ml-<wave><cell><rep>` e.g. `ml-a1` = wave A, cell a, replicate 1. The CSV row carries the
full config so the name is just a handle.
