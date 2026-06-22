

## 2026-06-21T19:55:33.887Z — 4-digit case system of equations
System of equations for 4-digit number n = 1000w + 100z + 10y + x:
1. n - r(n) = 9 [ 111(x-w) + 10(y-z) ] = A^2  =>  111 D1 + 10 D2 = B^2
2. n + r(n) = 11 [ 91(x+w) + 10(y+z) ] = (11C)^2  =>  91 S1 + 10 S2 = 11 C^2

Where:
S1 = x+w, D1 = x-w
S2 = y+z, D2 = y-z
Constraints:
0 <= S1 <= 18, -9 <= D1 <= 9
0 <= S2 <= 18, -9 <= D2 <= 9
S1, D1 have same parity
S2, D2 have same parity
