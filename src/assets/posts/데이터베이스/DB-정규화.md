---
layout: post
title: "정규화"
categories: [데이터베이스]
tags: [데이터베이스, 정규화, BCNF]
date: 2025-08-29 17:10:00 +0900
last_modified_at: 2025-08-29
---

## 키 종류
- **슈퍼키**: 각 행을 유일하게 식별할 수 있는 단일/복합 속성 (유일성)
- **대체키**: 기본키를 제외한 모든 후보키
- **후보키**: 유일성을 가진 최소한의 속성 집합 (보통 단일)
- **기본키**: 후  보키 중 하나만 지정, NOT NULL
- **외래키**: 다른 테이블의 키

> 유일성: 튜플을 구분할 수 있는 속성

<br>

## 정규화란

정규화란 데이터의 중복을 줄이고, 무결성을 보장하기 위해서 테이블과 속성들을 분해하는 것이다.

## 정규화 종류

### 비정규형
```sql
Registration(
  student_id, student_name, major, phone,
  {course_code, course_name, credit, professor, professor_office, score}
)
```
---
<br>

<div style="display: flex; align-items: center;">

<div style="flex: 1; padding-right: 10px;">

각 튜플은 속성당 하나의 값만 가져야 한다.  

기존의 Registration테이블에는  

{course_code, course_name, credit, professor, professor_office, score}  

속성이 다중 속성으로 들어가 있다.  

속성 당 하나의 값만 갖도록 만들어주어야 한다.  

</div>

<div style="flex: 1; text-align: center;">

<img src="/assets/img/post_image/2025-08-29/normalization/image1.png" alt="1NF" style="max-width:100%; height:auto;"/>

</div>

</div>

```sql
Table Enrollment_1NF {
  student_id        int
  student_name      varchar
  major             varchar
  phone             varchar
  course_code       varchar
  course_name       varchar
  credit            int
  professor         varchar
  professor_office  varchar
  score             varchar   -- 예: A+, A, B+ ...

  -- 복합 키
  Indexes {
    (student_id, course_code) [pk]
  }
}
```
---
<br>

### 제2 정규형[2NF] - 부분적 함수적 종속 제거

기본키가 복합키 일 때, 기본키의 부분 속성에 종속되는 속성이 있을 경우 분리해야 한다.

![2NF](/assets/img/post_image/2025-08-29/normalization/image2.png)

**부분적 함수 종속**은 기본키가 복합키로 되어 있을 때만 발생한다.
복합키의 부분키가 나머지 전체 속성 중 종속하는 것이 있을 때 해당 서브셋을 별도의 테이블로 만들어주는 것이다.

예시를 보면 `student_id` 와 `course_code` 가 복합키로 이루어져 있다.
그리고 `student_name`, `major`, `phone` 속성은 `student_id`에 의해 결정된다.
마찬가지로 `course_name`, `credit`, `professor` 속성은 `course_id` 에 종속된다.

제 2정규형을 만들기 위해서는 이 둘을 서로 분리해서 각각의 테이블로 만들어주면 된다.

---
<br>

### 제 3정규형[3NF] - 이행적 함수적 종속 제거

기본키가 아닌 속성에 종속되면 안된다. A→B→C이고, A가 기본키일 때, 속성 C는 기본키가 아닌 속성 B에 종속된다. 이럴 경우, A→B와 B→C 테이블로 각각 나누어주어야 한다.

![3NF](/assets/img/post_image/2025-08-29/normalization/image3.png)

예시를 보면 `course_code` 에 의해 `professor` 속성 값이 결정되고, `professor` 에 의해서 `professor_office` 가 결정된다. `course_code` → `professor` → `professor_office` 구조가 된다.

제 3정규형을 만족하기 위해서 `course_code` → `professor` 와 `professor` → `professor_office` 를 따로 분리해서 테이블을 만들어주면 된다.

---
<br>

### BCNF
모든 결정자가 후보키가 되도록 하는 것이다.

![BCNF](/assets/img/post_image/2025-08-29/normalization/image4.png)

---
<br>

### 제 4정규형[4NF] - 다치 종속 제거

---
<br>

### 제 5정규형[5NF] - 조인 종속성 제거

---
<br>

### 실무에서의 정규화
- 3NF 필수
- BCNF 권장
- 4NF, 5NF 특수한 경우에만