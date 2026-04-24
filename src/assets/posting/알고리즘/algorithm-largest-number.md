---
layout: post
title: "큰 수 만들기 - 그리디 + 스택"
categories: [알고리즘, 그리디]
tags: [알고리즘, 그리디, 스택, deque, 프로그래머스, Java]
date: 2026-04-22 18:20:00 +0900
last_modified_at: 2026-04-22
---

## 문제 요약

프로그래머스 **큰 수 만들기(Lv.2)** 는

- 숫자 문자열 `number`에서
- 정확히 `k`개를 제거해서
- 만들 수 있는 가장 큰 수를 구하는 문제다.

순서는 유지해야 하므로 단순 정렬은 불가능하다.

---

## 왜 완전탐색이 어려운가?

삭제 조합을 모두 확인하면 경우의 수가 너무 커진다.

- 문자열 길이는 최대 1,000,000
- 완전탐색은 시간 초과

따라서 매 순간 최선 선택을 하는 **그리디**가 필요하다.

---

## 핵심 아이디어 (그리디 + 스택)

왼쪽부터 숫자를 보면서:

- 스택의 마지막 값이 현재 숫자보다 작고
- 아직 제거 가능 횟수 `k > 0` 이면
- 작은 값을 제거(pop)한다.

이 과정을 반복하면, 앞자리에 가능한 큰 숫자가 남는다.

```java
import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public String solution(String number, int k) {
        Deque<Character> stack = new ArrayDeque<>();

        for (char c : number.toCharArray()) {
            while (!stack.isEmpty() && k > 0 && stack.peekLast() < c) {
                stack.pollLast();
                k--;
            }
            stack.addLast(c);
        }

        // 아직 제거 횟수가 남았다면 뒤에서 제거
        while (k > 0) {
            stack.pollLast();
            k--;
        }

        StringBuilder sb = new StringBuilder();
        for (char c : stack) sb.append(c);
        return sb.toString();
    }
}
```

---

## 복잡도

- 시간: `O(n)`  
  (각 문자는 스택에 최대 1번 push, 최대 1번 pop)
- 공간: `O(n)`

---

## 정리

- 이 문제는 "앞자리를 최대화"하는 전형적인 그리디 문제다.
- 발표에서 정리한 것처럼, `while (!stack.isEmpty() && k > 0 && stack.peekLast() < c)` 이 조건이 핵심이다.
- 구현할 때는 **마지막 남은 k 처리**를 빼먹지 않는 것이 포인트다.

