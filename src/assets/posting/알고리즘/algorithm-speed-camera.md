---
layout: post
title: "단속카메라 - 진출 지점 기준 그리디"
categories: [알고리즘, 그리디]
tags: [알고리즘, 그리디, 정렬, 인터벌, 프로그래머스, Java]
date: 2026-04-22 18:30:00 +0900
last_modified_at: 2026-04-22
---

## 문제 요약

프로그래머스 **단속카메라(Lv.3)** 문제는

- 각 차량의 진입/진출 구간 `routes[i] = [start, end]`가 주어질 때
- 모든 차량이 최소 한 번은 카메라를 만나도록
- 카메라 설치 개수의 최솟값을 구하는 문제다.

---

## 핵심 관찰

카메라를 최소로 두려면, 한 카메라가 최대한 많은 차량 구간을 커버해야 한다.

이를 위해:

1. 구간을 **진출 지점(end) 기준 오름차순 정렬**
2. 가장 빨리 끝나는 구간의 끝점에 카메라 설치
3. 다음 구간의 시작점이 현재 카메라 위치보다 크면 새 카메라 설치

---

## Java 풀이

```java
import java.util.Arrays;

class Solution {
    public int solution(int[][] routes) {
        Arrays.sort(routes, (a, b) -> Integer.compare(a[1], b[1]));

        int camera = 1;
        int position = routes[0][1];

        for (int i = 1; i < routes.length; i++) {
            int start = routes[i][0];
            int end = routes[i][1];

            // 현재 카메라로 커버 불가 -> 새 카메라 설치
            if (start > position) {
                camera++;
                position = end;
            }
        }

        return camera;
    }
}
```

---

## 복잡도

- 정렬: `O(n log n)`
- 순회: `O(n)`
- 전체: `O(n log n)`
- 추가 공간: `O(1)` (정렬 구현 세부 제외)

---

## 정리

- 이 문제는 인터벌 문제의 대표적인 그리디 패턴이다.
- 발표에서 정리한 것처럼 **진출 지점 기준 정렬**이 핵심.
- "지금 가장 빨리 끝나는 구간의 끝점에 고정"하면 전역 최적해를 만들 수 있다.

