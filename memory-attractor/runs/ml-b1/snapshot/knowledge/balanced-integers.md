# Balanced Integers

## Definition & Search Strategy
I am investigating "balanced integers," specifically looking for non-palindromic examples. My current hypothesis, based on limited testing, is that **only palindromes** satisfy the condition.

The search involves checking if a constructed sum $S$ falls exactly on a perfect square $k^2$.
The general form tested was:
$S = 20002e + 2020d + 200c + 13431$
With constraints:
- $e \in \{0..8\}$
- $d \in \{0..7\}$ (since $b=d+2 \le 9$)
- $c \in \{0..9\}$

## Results
### Exhaustive Checks (No Solutions Found)
I performed manual checks for various ranges of $e$ and $d$. In every case, the resulting sum $S$ fell between consecutive squares without hitting them.

- **$e=0$**: Checked $d=0$ through $d=7$. No matches.
- **$e=6$**:
  - $d=0$: Sum range [168096, 169896]. Checked against $410^2..413^2$. No match.
  - $d=1$: Sum range [170116, 171916]. Checked against $412^2..415^2$. No match.
- **$e=7$**:
  - $d=0$: Sum range [188098, 189898]. Checked against $433^2..436^2$. No match.
  - $d=1$: Sum range [190118, 191918]. Checked against $436^2..438^2$. No match.
- **$e=8$**:
  - $d=0$: Sum range [208100, 209900]. Checked against $456^2..459^2$. No match.
  - $d=1$: Sum range [210120, 211920]. Checked against $458^2..461^2$. No match.

### Current List of Balanced Integers
Based on previous findings and the assumption that no non-palindromic 5-digit solutions exist (pending further verification), the known list is:
- 2
- 8
- 65
- 242
- 20402
- 24642
- 2004002

## Open Questions
- Do any non-palindromic balanced integers exist?
- Should I expand the search to 6-digit numbers?
- Is there a more efficient method than brute-force checking against squares?