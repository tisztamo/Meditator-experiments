

## 2026-06-21T19:55:25.580Z — Balanced numbers definition, examples, and infinitude hypothesis
Balanced numbers n satisfy n+r(n)=x^2, n-r(n)=y^2.
Known small ones: 2, 8, 65, 242.
Palindromic ones are those with y=0, i.e., n=2k^2 is a palindrome.
2, 8, 242 are palindromic? 2 is, 8 is, 242 is.
65 is not.
So the set of balanced numbers includes non-palindromes.
Question: Are there infinitely many?
Hypothesis: Yes.


## 2026-06-21T19:58:51.798Z — Balanced numbers summary
Are there infinitely many balanced numbers? Small cases: 2, 8, 65, 242. Palindromic ones require $n=2k^2$ to be a palindrome. Non-palindromic ones require $n-r(n)=y^2>0$. Only 65 found for $d<4$.


## 2026-06-21T20:01:03.686Z — Key equation and bounds for digit problem
Key equation: 11(a-d) + (b-c) = 10k^2.
Constraints: a,d ∈ {1..9}, b,c ∈ {0..9}.
Ranges: a-d ∈ [-8, 8], b-c ∈ [-9, 9].
Sum range: [-97, 97].
Possible values for 10k^2: 0, 10, 40, 90 (k ∈ {0, 1, 2, 3}).
Cases to solve:
k=0: 11(a-d) + (b-c) = 0
k=1: 11(a-d) + (b-c) = 10
k=2: 11(a-d) + (b-c) = 40
k=3: 11(a-d) + (b-c) = 90


## 2026-06-21T20:03:22.883Z — k=1 yields no solutions
k=1 yields no solutions for 4-digit balanced numbers.


## 2026-06-21T20:05:07.691Z
Proof that no 4-digit balanced numbers exist:
Let n be a 4-digit number with digits abcd.
n = 1000a + 100b + 10c + d
r(n) = 1000d + 100c + 10b + a
n - r(n) = 999(a-d) + 90(b-c) = 9[111(a-d) + 10(b-c)]
For n - r(n) to be a perfect square y^2, since 9 is a square, 111(a-d) + 10(b-c) must be a square.
Let k = a-d and m = b-c. Then 111k + 10m = s^2.
Since a,d are digits 1-9 and 0-9 respectively, k ranges from -8 to 9.
m ranges from -9 to 9.
Also n + r(n) = 1001(a+d) + 110(b+c) = x^2.
Let's analyze 111k + 10m = s^2.
Mod 10: 111k = k (mod 10). So s^2 = k (mod 10).
Possible squares mod 10: 0, 1, 4, 5, 6, 9.
So k must end in 0, 1, 4, 5, 6, 9.
Since k = a-d, and a>=1, d>=0.
If k=0, a=d. Then 10m = s^2. Since 10m is divisible by 10, s^2 is divisible by 10, so s is divisible by 10, s^2 divisible by 100.
10m = 100j => m = 10j. Since -9<=m<=9, m=0.
So a=d and b=c. n is a palindrome.
n+r(n) = 2n = x^2. So n = 2y^2.
n = abba = 1001a +


## 2026-06-21T20:06:52.994Z — No 4-digit balanced numbers
There are no 4-digit balanced numbers. This is a solid result confirmed by checking both palindromic and non-palindromic cases.
