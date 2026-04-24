---
layout: post
title: "연산자 & ECMAScript"
categories: [프론트엔드, 자바스크립트]
tags: [KB, IT's Your Life, 부트캠프, JS, JavaScript, ECMAScript, 연산자]
date: 2026-03-10 17:00:00 +0900
last_modified_at: 2026-03-10
---


오늘은 JavaScript의 **데이터 타입과 연산자**, 그리고  
**ECMAScript에서 정의된 타입 변환 규칙**을 중심으로 학습했다.

JavaScript는 **동적 타입 언어(Dynamic Typing)** 이기 때문에  
변수 선언 시 타입을 명시하지 않아도 실행 시점에 타입이 결정된다.

<br>

## JavaScript 데이터 타입
--- 

| 타입 | 설명 |
|---|---|
| undefined | 값이 할당되지 않은 상태 |
| number | 숫자 |
| string | 문자열 |
| boolean | true / false |
| function | 함수 |
| object | 객체 |

변수를 선언만 하고 값은 선언하지 않으면 undifined가 할당 된다.

<br>

## JavaScript 연산자
---

| 종류 | 기호 |
| --- | --- |
| 산술 연산자 | `+` `-` `*` `/` `%`  |
| 대입 연산자 | `=` `+=` `-=` `*=` `/=` `%=`  |
| 비교 연산자 | `==` `===` `!=` `!==` `>` `>=` `<` `<=` |
| 논리 연산자 | `&&` `\|\|` `!` |
| 단항 연산자 | `++` `--` |
| 삼항 연산자 | `? :`  |

추가적으로 JavaScript는 다음과 같은 특징을 가진다.

- `0`으로 나누기 → `Infinity`
- `undefined`와 연산 → `NaN`

<br>

## 오늘의 배운 점

JavaScript는 **가능한 한 에러를 발생시키지 않고 연산을 수행하려는 특징**이 있다.  
따라서 서로 다른 타입이라도 **자동 형변환(Type Coercion)** 을 통해 연산을 시도한다.

```javascript
let a, b;

a = 2;    //number type
b = '2';  //string type

//case 1
console.log(a + b)

//case 2
console.log(a == b)
```

<br>

### case 1
---

**\+ 연산자동작**  
ECMA Script 스펙에 따르면 둘 중 하나라도 문자열일 경우 `문자열 연결 연산자`로 인식 ***숫자 → 문자열***로 형변환하여 결합 연산한다.  

**다른 산술 연산자**  
***문자 → 숫자***로 형변환 하여 산술 연산을 시도한다.

[ECMAScript 문서](https://tc39.es/ecma262/)

<br>

### case 2
---

**== 연산자**  
==연산자는 Abstract Equality Comparison 알고리즘을 사용한다.  
즉 타입을 자동 변환한 뒤 비교한다.  

**Abstract Equality Comparison 규칙**
- 타입이 같으면 Strict Equality 방식(===)으로 비교
- null == undefined → true
- null == undefined == 0 == false
- 문자열 vs 숫자: 문자열 → 숫자
- 숫자 vs 불리언: 불리언 → 숫자
- 객체 vs 기본형: 객체 → 기본형

<br>

**=== 연산자**  
Strict Equality Comparison → 타입 변환 없이 값과 타입을 모두 비교한다.




