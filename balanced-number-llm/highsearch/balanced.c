/* balanced.c — exhaustive search for "balanced" numbers.
 *
 * n is balanced iff both n + r(n) and n - r(n) are perfect squares,
 * where r(n) is the decimal digit-reversal of n (numeric, leading zeros dropped).
 *
 * Goal: hunt for a THIRD non-palindromic balanced number past 65 and 621770.
 * Palindromes (n == r(n)) give n - r(n) = 0 and are an infinite known family;
 * we still report them, but the headline is non-palindromic hits.
 *
 * Output contract:
 *   - while running: print ONLY findings (one line each), flushed immediately.
 *   - at shutdown (SIGTERM/SIGINT or the internal 6h limit): print PROGRESS —
 *     the contiguous frontier up to which the search is provably exhaustive.
 *   - a separate .checkpoint file is rewritten periodically as a SIGKILL safety net
 *     (not part of the visible findings stream).
 *
 * Build: gcc -O3 -march=native -fopenmp -o balanced balanced.c -lm
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <time.h>
#include <signal.h>
#include <omp.h>
#include <stdint.h>

typedef unsigned long long u64;

#define BLOCK      100000000ULL      /* 1e8 numbers per work unit            */
#define MAXBLOCK   1000000ULL        /* cap: n < 1e14 (array bound, ~1 MB)   */
#define START_N    2ULL              /* known list starts at n = 2           */
#define TIME_LIMIT (6*3600)          /* internal backup limit: 6 hours       */

static volatile sig_atomic_t g_shutdown = 0;
static void on_signal(int sig) { (void)sig; g_shutdown = 1; }

/* quadratic-residue filters: a perfect square must be a QR mod each modulus. */
static unsigned char qr64[64], qr63[63], qr65[65];
static void init_qr(void) {
    for (int i = 0; i < 64; i++) qr64[(i*i) & 63] = 1;
    for (int i = 0; i < 63; i++) qr63[(i*i) % 63] = 1;
    for (int i = 0; i < 65; i++) qr65[(i*i) % 65] = 1;
}

/* is x a perfect square?  cheap residue filters first, then a corrected isqrt. */
static inline int is_square(u64 x) {
    if (!qr64[x & 63]) return 0;
    if (!qr63[x % 63]) return 0;
    if (!qr65[x % 65]) return 0;
    u64 s = (u64)sqrtl((long double)x);
    while (s > 0 && s*s > x) s--;
    while ((s+1)*(s+1) <= x) s++;
    return s*s == x;
}

static inline u64 rev(u64 n) {
    u64 r = 0;
    while (n) { r = r*10 + n%10; n /= 10; }
    return r;
}

static u64 next_block = 0;             /* atomic: next work unit to hand out  */
static unsigned char done_block[MAXBLOCK]; /* done_block[i]=1 when block i complete */
static char   *g_log;                  /* findings + final progress           */
static char   *g_ckpt;                 /* periodic frontier (SIGKILL safety)   */
static time_t  g_start;

static u64 frontier_block(void) {      /* lowest incomplete block => exhaustive frontier */
    u64 i = 0;
    while (i < MAXBLOCK && done_block[i]) i++;
    return i;
}

static void write_checkpoint(void) {
    FILE *f = fopen(g_ckpt, "w");
    if (!f) return;
    u64 fb = frontier_block();
    double el = (double)(time(NULL) - g_start);
    u64 frontier_n = START_N + fb * BLOCK;
    fprintf(f, "exhaustive up to n=%llu  (frontier block %llu)  elapsed=%.0fs  rate=%.3e n/s\n",
            frontier_n, fb, el, el > 0 ? frontier_n / el : 0.0);
    fclose(f);
}

int main(int argc, char **argv) {
    const char *dir = argc > 1 ? argv[1] : ".";
    static char logp[4096], ckpp[4096];
    snprintf(logp, sizeof logp, "%s/findings.log", dir);
    snprintf(ckpp, sizeof ckpp, "%s/progress.checkpoint", dir);
    g_log = logp; g_ckpt = ckpp;

    init_qr();
    g_start = time(NULL);
    signal(SIGTERM, on_signal);
    signal(SIGINT,  on_signal);

    FILE *log = fopen(g_log, "a");
    if (!log) { perror("fopen log"); return 1; }
    setvbuf(log, NULL, _IOLBF, 0);
    fprintf(log, "# START  block=%llu  threads=%d  time_limit=%ds  scanning n>=%llu\n",
            BLOCK, omp_get_max_threads(), TIME_LIMIT, START_N);
    fflush(log);

    /* first work unit covers START_N .. BLOCK; later units are whole blocks. */
    #pragma omp parallel
    {
        u64 idx;
        for (;;) {
            if (g_shutdown) break;
            #pragma omp atomic capture
            { idx = next_block; next_block++; }
            if (idx >= MAXBLOCK) break;

            if (time(NULL) - g_start >= TIME_LIMIT) { g_shutdown = 1; break; }

            u64 lo = idx ? idx * BLOCK : START_N;
            u64 hi = (idx + 1) * BLOCK;
            for (u64 n = lo; n < hi; n++) {
                u64 r = rev(n);
                if (n < r) continue;            /* n - r(n) would be negative  */
                if (!is_square(n - r)) continue;
                if (!is_square(n + r)) continue;
                int pal = (r == n);
                #pragma omp critical
                {
                    fprintf(log, "FOUND n=%llu  r=%llu  n-r=%llu  n+r=%llu  %s\n",
                            n, r, n - r, n + r,
                            pal ? "[palindrome]" : "[NON-PALINDROME ***]");
                    fflush(log);
                }
            }
            done_block[idx] = 1;

            #pragma omp critical
            { if (idx % 4 == 0) write_checkpoint(); }
        }
    }

    u64 fb = frontier_block();
    u64 frontier_n = START_N + fb * BLOCK;
    double el = (double)(time(NULL) - g_start);
    fprintf(log,
        "# STOP  exhaustive up to n=%llu  (all blocks < %llu complete)  "
        "elapsed=%.0fs  rate=%.3e n/s\n",
        frontier_n, fb, el, el > 0 ? frontier_n / el : 0.0);
    fflush(log);
    write_checkpoint();
    fclose(log);
    return 0;
}
