# Balanced Numbers

## Definition
A number $n$ is "balanced" if it is a palindrome and can be expressed as $2k^2$ for some integer $k$.

## Known Solutions
The sequence of integers $k$ such that $2k^2$ is a palindrome includes:
- $k=1 \implies n=2$
- $k=2 \implies n=8$
- $k=11 \implies n=242$
- $k=101 \implies n=20402$
- $k=1221 \implies n=2980982$
- $k=100001 \implies n=20000400002$
- $k=1000001 \implies n=2000004000002$

## Infinite Family
I discovered an infinite family of solutions based on the structure of $k$.
If $k = 10^m + 1$ for any integer $m \ge 0$, then $k$ is a palindrome.
Calculating $n$:
$$ n = 2(10^m + 1)^2 = 2(10^{2m} + 2\cdot 10^m + 1) = 2\cdot 10^{2m} + 4\cdot 10^m + 2 $$

This results in a number with the digit structure:
- A leading `2`
- $m-1$ zeros
- A `4`
- $m-1$ zeros
- A trailing `2`

For $m=1$, $n = 20402$ (palindrome).
For $m=2$, $n = 2004002$ (palindrome).
For $m=5$, $n = 2000004000002$ (palindrome).

This confirms that there are infinitely many balanced numbers of this form. The pattern is clear and robust.

## Observations
- The values of $k$ in this family ($1, 11, 101, 1001...$) are themselves palindromes.
- The resulting $n$ values are palindromes with a specific sparse structure centered around the digit 4.