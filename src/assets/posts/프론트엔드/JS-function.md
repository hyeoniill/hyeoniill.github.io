---
layout: post
title: "함수 실행 프로세스 정리"
categories: [프론트엔드, 자바스크립트]
tags:
  - JavaScript
  - 자바스크립트
  - 실행 컨텍스트
  - 호이스팅
  - 클로저
  - this
date: 2026-03-16 15:00 +0900
last_modified_at: 2026-03-16
---

## 컨텍스트

자바스크립트 엔진에서 코드를 실행할 때는 두 가지 작업에 거쳐 실행된다.
1. <abbr title="Creation Phase">생성 단계</abbr> : 코드를 실행시키기 위한 준비 단계 
2. <abbr title="Execution Phase">실행 단계</abbr> : 코드를 위 → 아래로 읽으면서 실행하는 단계 

이는 실행 컨텍스트가 생성될 때마다 반복한다.

## 생성 단계
> 호이스팅: 코드 내부에 선언된 변수와 함수 선언이 실행 전 먼저 메모리에 등록되는 현상

자바스크립트는 우선 컨택스트 스코프 내에 선언된 변수를 메모리에 등록하는 작업을 한다.  
그래서 인터프리터 언어임에도 불구하고 **선언 - 사용**의 순서가 바뀌더라도 코드를 실행해보면

<br>

단순히 선언하지 않은 **변수 a**를 사용하려고 할 경우, `a is not defined라는 참조 에러`가 발생한다.
```javascript
console.log(a);
```

```console
결과: Uncaught ReferenceError: a is not defined at ...
```

<br>


반면 다음 코드는 **변수 a**가 사용되는 위치보다 아래에 선언되어 있다.  
그렇지만 JS해석기는 참조 에러를 발생시키지 않고, `undefined`로 선언되어 있다고 한다.
```javascript
console.log(a);
var a = "hello";
```

```console
결과: undefined
```

이처럼 자바스크립트는 실행하기 전, 생성 단계에서 컨텍스트 내에 있는 변수는 메모리에 등록된다. (초기화 여부는 선언 방식에 따라 다름 = TDZ)

이를 ***호이스팅[Hoisting]***이라고 한다.

다만 실제 코드가 이동하는 것은 아니고, 실행 전에 코드에서 선언하는 변수 정보가 먼저 메모리에 등록되는 것이다.

<br><br><br>

## 실행 단계

자바스크립트의 코드는 위 → 아래로 실행된다.


## TDZ  
> TDZ: Temporal Dead Zone  
> 변수는 존재하지만 아직 초기화되지 않아 접근할 수 없는 구간

자바스크립트에서는 3가지 종류로 변수를 선언할 수 있다. 
1. var
2. let
3. const

선언 방식마다 생성 단계에서 호이스팅이 일어났을 때 작동이 다른데  
- var의 경우에는 undefined로 초기화하되고 접근이 가능하다.
- 반면 let/const의 경우에는 생성 단계에서 메모리에 등록은 되지만 초기화되지 않고, 접근을 시도할 경우 `ReferenceError`가 발생하게 된다.

여기서 const = 전역변수로 착각하는 경우가 많은데 const의 정확한 정의는 **재할당이 금지된 블록 스코프 변수**이다. 재할당이 금지되었기 때문에 const는 선언과 동시에 초기화가 반드시 필요하며, 동일하게 변수 선언 이전에 사용하게 되면 `ReferenceError`가 발생하게 된다.

```javascript
console.log(a);
const a = "hello";
```

```console
결과: ReferenceError: Cannot access 'a' before initialization at ...
```

## 내부 함수
> 내부 함수: 함수 내부에 정의된 함수

```javascript
function outer() {
  function inner() {
    console.log("inner");
  }

  inner();
}
```

inner()함수는 outer()함수 내에 정의되어 있다.  
여기서 inner()를 내부 함수, outer()를 외부 함수라고 한다.

## 익명 함수
> 익명 함수: 이름 없이 선언한 함수

익명 함수는 보통 변수에 바로 할당한다.  

```javascript
a();
function a() {
    console.log("hello");
}
```

```console
결과: hello
```
함수 선언문을 사용하면 생성 단계에서 호이스팅이 일어날 때 함수 전체가 메모리에 등록된다. 결과적으로 선언 이전에 호출을 하더라도 이미 생성 단계에서 함수 전체가 등록되어있기 때문에 호출이 가능하다.

<br>

```javascript
a();
var a = function() {
    console.log("hello");
}
```
```console
결과: Type Error
```
반면 함수 표현식을 사용하면 변수에 함수를 할당하는 방식이 되기 때문에 생성 단계에서는 변수 선언만 처리되고 실제 함수 할당은 실행 단계에서 이루어진다.

<br><br><br>

## 함수를 매개변수로 전달

자바스크립트에서는 다음과 같은 문법이 가능하다.
```javascript
function outer() {
    console.log("outer");
    return function() {
        console.log("Hello");
    }
}

//case 1
outer()();

//case 2
var fn = outer();
fn();
```

```console
결과: outer
     Hello
```

### case 1
outer()()의 동작은 (outer())()와 같다. 우선 outer()함수가 먼저 실행되고 outer()는 익명 함수를 반환한다. 그리고 그 후, 반환된 익명 함수가 바로 실행된다.

### case 2
2번의 경우, 함수를 변수에 저장했다가 사용한다. 그래서 변수 fn은 함수 outer()에 대한 참조를 갖게 되고, fn()을 하면 나중에 실행된다. 

<br><br><br>


## 스코프 체인
> 함수가 선언될 때 자신의 상위 렉시컬 환경을 참조로 저장한다.

자바스크립트에서는 내부 함수 scope에서 외부 함수 scope에 있는 변수에 접근이 가능하다.  
함수를 호출하게 되면 스택에서 실행 컨텍스트가 생성 - 호출 과정이 일어나게 된다.  
이 때, 컨텍스트 내부에서는 렉시컬 환경을 포함하게 되는데 렉시컬 환경은 현재 스코프 변수 정보를 포함하여 외부 스코프에 대한 참조를 갖는다.  
말인 즉, 함수는 선언될 때, 자신의 상위 스코프의 환경을 기억하게 되는데 스코프 체인은 렉시컬 환경을 기반으로 변수 탐색 시 현재 스코프를 시작으로 상위 스코프로 이동하며 식별자를 탐색하는 것을 말한다.

```javascript
const a = 1;

function outer() {
  const b = 2;

  function inner() {
    const c = 3;
    console.log(a, b, c);
  }

  inner();
}

outer();
```

inner() 함수에서 a, b, c에 접근하려고 하면
1. c는 현재 inner()함수의 스코프 내에서 찾는다.
2. b는 outer() 스코프로 이동해서 찾는다.
3. a는 global 스코프에서 찾는다.

<br><br><br>

## 클로저
> 클로저: 함수가 종료된 이후에도 변수에 접근이 가능한 것

자바스크립트에서는 함수가 선언될 당시의 렉시컬 환경을 기억하기 때문에 외부 함수가 종료된 이후에도 해당 변수에 접근할 수 있다.

```javascript
function outer() {
        var a = 10;

        return function () {
          console.log(a);
        };
      }

      const fn = outer();
      fn(); // 10
```
이를 활용하여 자바스크립트에서 private와 같은 기능도 구현할 수 있다.

```javascript
function ObjFactory() {
	const private = 'foo';
  
  	return { 
      		get public() {
                	return private;
            	},
        };
}

const obj = ObjFactory();
```

```console
obj.private // undefined
obj.public  // 'foo'
````

<!-- 재귀 함수

## 화살표 함수

### this의 처리

### 화살표 함수를 피해야하는 순간

### Arguments



암시적 반환
-->
