---
layout: post
title: "비동기 처리 방법"
categories: [프론트엔드, 자바스크립트]
tags:
  - JavaScript
  - 자바스크립트
  - 비동기
  - 비동기 처리
  - 이벤트 루프
  - 콜 스택
  - 콜백
  - 콜백 지옥
  - 프라미스
  - Promise
  - async
  - await
  - async/await
  - V8
  - Node.js
date: 2026-03-12 21:00 +0900
last_modified_at: 2026-03-12
---


## 동기 처리와 비동기 처리의 차이점

> 스레드 : 프로세스를 실행하기 위한 최소 단위

비동기 처리의 핵심은 작업을 요청한 뒤, 해당 작업이 완료되기를 기다리지 않고 다음 코드를 실행하는 것이다.  
즉 실행 흐름의 제어권이 해당 작업을 다른 자원에게 요청하고 계속 제어권을 가져가는 것이다. 

### 비동기 처리 구현 방식

비동기 처리를 구현하는 대표적인 방법은 다음과 같다.
1. 멀티스레드 방식
2. 이벤트 루프 방식

<br><br><br>

## 멀티스레드 방식
자바와 같은 언어는 **멀티스레드 실행 환경**을 지원한다.  
여러 스레드를 동시에 실행할 수 있기 때문에 비동기 작업을 병렬로 처리할 수 있다. 

![multi_thread](/assets/img/post_image/2026-03-12/multi_thread.png)

여러 스레드가 동시에 실행되기 때문에 실행 순서는 항상 동일하게 보장되지 않는다.

따라서 여러 작업의 실행 순서를 제어하기 위해 **동기화(synchronization)** 또는 **비동기 제어 로직**이 필요하다.
```java
Thread t1 = new Thread(() -> {
            System.out.println("첫 번째 작업");
        });

        Thread t2 = new Thread(() -> {
            System.out.println("두 번째 작업");
        });

        Thread t3 = new Thread(() -> {
            System.out.println("세 번째 작업");
        });

        t1.start();
        t2.start();
        t3.start();
```

### 실행 결과
```console
case1                   case2
첫 번째 작업               첫 번째 작업
두 번째 작업               세 번째 작업
세 번째 작업               두 번째 작업
```

<br><br><br>

## 이벤트 루프 방식
이벤트 루프 방식은 하나의 스레드가 작업을 관리하면서 비동기 작업은 외부에 넘기고, 결과를 받아 처리하는 구조이다.  
Node.js, 자바스크립트, Redis와 같은 싱글 스레드 기반의 시스템에서 사용된다.  

자바스크립트는 **싱글스레드** 언어이다.   
따라서 자바스크립트의 엔진 내부에서는 한 번에 하나의 작업만 실행된다.

<br>

```javascript
console.log('첫 번째 작업');
setTimeout(() => {
  console.log("두 번째 작업");
}, 1000);
console.log('세 번째 작업');
```

### 실행 결과
```console
첫 번째 작업
세 번째 작업
두 번째 작업
```

<br>


### I/O 작업과 비동기 처리

작업의 성능은 `작업의 성격`에 따라서 상이하다. 

사용자의 요청을 받아 처리하고 응답을 돌려주는 작업은 대부분 I/O 작업이다.  
I/O 작업은 CPU 연산에 비해 매우 느리기 때문에 CPU가 직접 처리하지 않는다.  
대신 디스크 컨트롤러나 네트워크 컨트롤러와 같은 장치가 실제 작업을 수행한다. 

CPU는 I/O작업이 들어오면
1. 컨트롤러에 `작업을 지시`하고 다른 작업을 수행한다.
2. 컨트롤러는 작업을 마무리하면 `인터럽트를 발생`시켜서 CPU에게 알린다.
3. 인터럽트는 하드웨어적으로 CPU에게 알려주고 CPU가 해당 작업을 다시 실행할 수 있도록 한다. 

이는 OS 레벨에서 이루어지는 비동기 처리 방식이다.

<br>

동기 방식으로 I/O를 호출하면 작업이 끝날 때까지 프로그램의 실행이 멈추게 된다.
이러한 방식은 블로킹(blocking) I/O라고도 한다.

```jsx
const fs = require('fs');

const data = fs.readFileSync('example.txt');
console.log(data);
```

위 코드에서는 data 변수를 다음 줄에 바로 사용하고 있기 때문에 data를 모두 읽을 때까지 블로킹되어야 한다. 이는 비동기 작업이 동기화되어 처리되는 일이 발생한다.

그래서 실제로는 data를 입력 받도록 실행시킨 후, 사용자의 입력이 끝난 후에 `console.log(data);`가 실행된다.

자바, 파이썬, C와 같은 많은 언어는 동기 언어이지만 성능 향상을 위해 비동기화 작업을 지원한다.

서버 환경에서는 오래 걸리는 I/O 작업이 실행되는 동안 스레드가 블로킹되면 다른 클라이언트의 요청을 처리하지 못하는 문제가 발생한다.
이를 해결하기 위해 멀티스레딩이나 비동기 처리를 활용한다.

반면 자바스크립트 엔진 자체는 싱글 스레드이기 때문에
멀티스레드 방식으로 이러한 문제를 직접 해결할 수 없다.

이러한 문제를 해결하기 위해서 자바스크립트는 브라우저나 Node.js 런타임 환경에 있는
Web API나 libuv와 같은 별도의 시스템을 활용한다.

이러한 시스템은 멀티 스레드를 기반으로 동작하며,
비동기 작업을 별도의 영역에서 처리한다.

그리고 Event Loop는 Call Stack이 비어있는지 확인한 뒤
Task Queue에 있는 작업을 Call Stack으로 이동시킨다.

이를 통해 자바스크립트는 비동기 처리를 수행할 수 있다.

즉, 자바스크립트는 싱글 스레드 기반으로 동작하지만
Event Loop와 런타임 환경의 비동기 API를 통해
**동시성(Concurrency)**을 구현한다.



<br><br><br>

## 싱글스레드 기반 시스템에서 비동기 처리를 하는 방법

V8 엔진은 자바스크립트를 실행하는 대표적인 자바스크립트 엔진이다.
Google Chrome 브라우저와 Node.js에서 이 V8 엔진을 사용한다.

V8 엔진에는 `콜 스택`이 존재하며,
함수 호출은 스택 구조를 기반으로 순차적으로 실행된다.
따라서 자바스크립트 엔진 내부에서는 한 번에 하나의 작업만 처리할 수 있다.

V8 엔진 자체는 비동기 작업을 직접 처리하지 않는다.

브라우저 환경에서는 Web API가 비동기 작업을 처리하고,
Node.js 환경에서는 libuv 라이브러리가 비동기 I/O 작업을 처리한다.
libuv에는 Node API와 콜백 큐라는 요소가 있다. 콜백 함수가 큐의 형태로 저장되는 공간이다.

V8 엔진은 자바스크립트 코드를 실행하는 역할을 담당하고,
비동기 작업 처리는 런타임 환경에서 제공하는 시스템이 담당한다.

```jsx
console.log("first");
setTimeout(() => {
	console.log("second");
	}, 2000);
	console.log("third");
```

setTimeout()는 비동기 함수이다. 자바스크립트 엔진(V8)은 `setTimeout()`을 만나면 타이머 설정 작업을 **런타임 환경**으로 넘기고, 다음 코드를 계속 실행한다.

브라우저 환경에서는 브라우저의 Web API(타이머)가 타이머를 관리하고,
Node.js 환경에서는 libuv가 타이머와 스레드 풀을 이용해 비동기 작업을 관리한다.

지정한 시간이 지나면 런타임 환경에서 준비된 콜백이 **태스크 큐(콜백 큐)** 에 들어가고,
이벤트 루프가 콜 스택이 비었는지 확인한 뒤, 콜백을 콜 스택으로 올려 실행한다.

위 코드의 동작 방식은 다음과 같다.

<div style="display: flex; gap: 24px; align-items: flex-start; flex-wrap: wrap;">
  <div style="flex: 1 1 260px; min-width: 240px;">
    <ol>
      <li><code>console.log("first")</code> 실행</li>
      <li><code>setTimeout()</code> 등록 → 런타임 환경(Web API / libuv)으로 넘어감</li>
      <li><code>console.log("third")</code> 실행</li>
      <li>콜 스택이 비면 이벤트 루프가 태스크 큐를 확인</li>
      <li>2초 뒤, 콜백(두 번째 로그)이 태스크 큐에 들어감</li>
      <li>태스크 큐 → 콜 스택으로 이동</li>
      <li><code>console.log("second")</code> 실행</li>
    </ol>
  </div>
  <div style="flex: 0 0 320px; max-width: 100%; text-align: center;">
    <img src="/assets/img/post_image/2026-03-12/v8_engine.png" alt="자바스크립트 비동기 처리 흐름" style="max-width: 100%; height: auto;" />
  </div>
</div>


<br><br><br>

## 자바스크립트 비동기 처리

### 콜백

콜백 함수란 **다른 함수에 인자로 전달되었다가, 나중에 특정 시점에 호출되는 함수**를 말한다. 콜백이 중첩될수록 코드가 피라미드처럼 깊어져 가독성이 떨어지는데, 이를 "콜백 지옥(Callback Hell)"이라고 한다.

```jsx
function order(coffee, callback) {
  console.log(`${coffee} 주문 접수`);

  setTimeout(() => {
    const result = `${coffee} 준비 완료`;
    callback(result);
  }, 3000);
}

function display(result) {
  console.log(result);
}

order("아메리카노", display);
```

> 콜백의 내부 동작은 어떻게 되는가?

<br><br> 

### 프라미스 [Promise]  

식당의 진동벨처럼, 비동기 작업이 끝났다는 신호를 나중에 알려주는 역할을 한다. 콜백 지옥보다 읽기 쉬운 코드 구조를 만들 수 있으며, ES6에서 도입되었다.

비동기 작업의 결과를 미래에 받을 것을 약속한다는 의미에서 Promise(약속)이라고 한다.

Promise는 비동기 작업의 상태(대기 → 성공/실패)를 표현하는 객체로써 동작한다.
`new Promise(executor)` 형태로 만들며, `executor` 함수는 두 개의 인자를 받는다.

- `resolve(value)`: 작업 성공 시 호출 → `then(result)`에서 `value`를 받는다.
- `reject(reason)`: 작업 실패 시 호출 → `catch(err)`에서 `reason`을 받는다.

Promise 객체는 `then`, `catch`, `finally` 메서드를 통해 결과를 다룰 수 있다.

```jsx
let likePizza = true;
const pizza = new Promise((resolve, reject) => {
    if(likePizza)
        resolve('피자를 주문합니다');
    else
        reject('피자를 주문하지 않습니다');
});

pizza
    .then(result => console.log(result))
    .catch(err => console.log(err));
```

<br><br>

### async/await

프라미스를 기반으로 동작하며, 비동기 처리 흐름을 동기 코드처럼 읽기 쉽게 표현할 수 있는 기법이다.

```jsx
async function init() {
    try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const users = await response.json();
    console.log(users);
    } catch (err) {
    console.error(err);
    }
}

init();
```
    
async 함수는 항상 Promise를 반환한다.

기존에는 함수 내부를 직접 열어봐야 비동기 함수인지 알 수 있었지만,
`async` 키워드를 사용하면 시그니처만 보고도 비동기 함수임을 알 수 있다.

`await` 키워드는 원칙적으로 `async` 함수 내부에서만 사용할 수 있다.
다만 ES 모듈 환경(브라우저의 `<script type="module">`, Node.js ESM)에서는
함수 밖에서도 **top-level await**를 사용할 수 있다.

`async` 함수 안에서 `await`를 반드시 사용할 필요는 없다.
한 번도 사용하지 않아도 문법 오류나 경고는 발생하지 않으므로,
의도치 않게 `async`만 붙어 있는 함수가 없는지 코드 리뷰 시 주의해서 봐야 한다.

`await`는 Promise가 완료될 때까지 해당 `async` 함수의 나머지 부분 실행을
일시적으로 멈추고, 완료된 Promise의 결과값을 반환받는다.
이때 자바스크립트 엔진의 스레드가 막히는 것이 아니라,
이벤트 루프가 다른 작업을 계속 처리하다가, Promise가 완료되면
이어서 코드를 실행한다.