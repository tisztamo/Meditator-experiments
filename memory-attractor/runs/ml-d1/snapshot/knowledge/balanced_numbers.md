# Balanced Numbers ($n = 2k^2$)

## Definitions and Constraints
A "balanced number" is defined here as an integer $n$ such that $n = 2k^2$ for some integer $k$.

### 3-Digit Numbers
For a 3-digit number $n = 100a + 10b + c$ to be balanced, it must satisfy specific modular constraints.
*   **Palindrome Constraint:** Analysis of the equation modulo 11 reveals that $a-c$ must be a multiple of 11. Since $a$ and $c$ are digits, $a-c=0$, implying $a=c$. Thus, any 3-digit balanced number must be a palindrome.
*   **Uniqueness:** We seek palindromes of the form $aba$ such that $aba = 2k^2$.
    *   Range check: $100 \le 2k^2 \le 999 \implies 50 \le k^2 \le 499.5 \implies 7 \le k \le 22$.
    *   Verification of $k \in [7, 22]$ shows only one solution:
        *   $k=11 \implies 2(11^2) = 242$.
    *   **Conclusion:** 242 is the unique 3-digit balanced number.

### 4-Digit Numbers
*   **Palindromic Case:** A 4-digit palindrome has the form $abba = 1100a + 110b = 110(10a+b)$.
    *   If $2k^2 = abba$, then $2k^2$ is divisible by 110.
    *   This implies $k^2$ is divisible by 55 ($5 \times 11$).
    *   Therefore, $k$ must be divisible by 5 and 11, meaning $k$ is a multiple of 55.
    *   Range check for 4-digit numbers: $1000 \le 2k^2 \le 9999 \implies 500 \le k^2 \le 4999.5 \implies 23 \le k \le 70$.
    *   There are no multiples of 55 in the range $[23, 70]$.
    *   **Result:** No 4-digit palindromic balanced numbers exist.
*   **Non-Palindromic Case:** Previous checks (referenced in thought process) found no non-palindromic solutions.
*   **Conclusion:** There are **no** 4-digit balanced numbers.

### 5-Digit Numbers (In Progress)
*   **Structure:** Palindromes of the form $abcba = 10001a + 1010b + 110c$.
*   **Parity Constraint:** Since $1010b$ and $110c$ are even, $10001a$ must be even for the sum to be even ($2k^2$). Thus, $a \in \{2, 4, 6, 8\}$.
*   **Current Search:** Investigating $a=2$.
    *   $n = 20002 + 1010b + 110c$.
    *   $k^2 = 10001 + 505b + 55c$.
    *   Looking for perfect squares near $10000$ ($100^2$).