# 4-Digit Balanced Numbers: Algebraic Framework

## Definitions
Let $n = 1000x + 100y + 10z + w$.
Let $r(n)$ be the reverse of $n$.

## Derived Conditions
For $n$ to be balanced, both $n - r(n)$ and $n + r(n)$ must be perfect squares.

1.  **Difference**:
    $$n - r(n) = 9[111(x-w) + 10(y-z)] = B^2$$
    This implies:
    $$111(x-w) + 10(y-z) = \frac{B^2}{9}$$
    Let $K = B/3$ (assuming $B$ is divisible by 3, which is required for the term to be an integer square in this context, or rather, the term in brackets must be a square times a factor). More precisely, the term in brackets must be a square if we absorb the 9. Let's stick to the derived form:
    $$111(x-w) + 10(y-z) = \text{Square}$$

2.  **Sum**:
    $$n + r(n) = 11[91(x+w) + 10(y+z)] = \text{Square}$$
    This implies:
    $$91(x+w) + 10(y+z) = 11C^2$$

## Variable Substitution
Let $S_1 = x + w$ and $S_2 = y + z$.
*   Bounds: $S_1 \in [1, 18]$ (since $x,w \in [0,9]$ and $x \neq 0$), $S_2 \in [0, 18]$.

## Modular Constraint
From the sum equation modulo 11:
$$91S_1 + 10S_2 \equiv 3S_1 - S_2 \equiv 0 \pmod{11}$$
$$S_2 \equiv 3S_1 \pmod{11}$$

## Search Strategy
1.  Iterate $S_1 \in [1, 18]$.
2.  Determine valid $S_2$ values using $S_2 \equiv 3S_1 \pmod{11}$ and $0 \le S_2 \le 18$.
3.  Check if $91S_1 + 10S_2 = 11C^2$ for some integer $C$.
4.  If valid $(S_1, S_2)$ pair found, check if digits $x,w,y,z$ exist such that:
    *   $x+w = S_1$
    *   $y+z = S_2$
    *   $1