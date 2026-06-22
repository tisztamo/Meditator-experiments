# 3-Digit Balanced Numbers

## Conclusion
The only 3-digit balanced number is **242**.

## Derivation
1.  **Palindrome Constraint**: Any 3-digit solution $n$ must be a palindrome ($x=z$).
2.  **Reduced Equation**: The condition reduces to $2j^2 = 101x + 10y$.
3.  **Parity**: $x$ must be even.
4.  **Search**: Testing $x \in \{2,4,6,8\}$ yields only one valid pair:
    *   $x=2, y=4$ with $j=11$.
5.  **Verification**:
    *   $n = 242$
    *   $n - r(n) = 242 - 242 = 0 = 0^2$
    *   $n + r(n) = 242 + 242 = 484 = 22^2$

## Status
Unique solution confirmed for 3 digits.