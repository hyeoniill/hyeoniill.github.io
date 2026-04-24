---
layout: post
title: "[Vue] Vue 정리"
categories: [프론트엔드, Vue]
tags:
  - Vue
date: 2026-03-19 09:00 +0900
last_modified_at: 2026-03-20
---

### vue의 특징
- SPA 지원
- 가상돔 지원

> react보다 뛰어난 성능

<br><br><br>

# MVVM 패턴
- Model: 데이터  
- View: UI
- View Model: 연산 

View는 HTML 문서와 같은 브라우저에서 렌더링할 UI를 다룬다. 사용자에게 보여줄 내용을 View Model과 상호작용을 통해서 동적으로 결정한다.  
Model은 동적인 데이터를 관리하는 영역이라고 생각하면 된다.  
View Model에서는 View의 요청을 Model에 업데이트하고 Model의 내용을 View에 알려주는 중간 컨트롤러의 역할이라고 생각하면 된다.


```html
<body>
  <div id="app">
    <h2>{{message}}</h2>
  </div>

  <script type="text/javascript">
  var model = {message: "Hyeoninii"}
  var vm = Vue.createApp({
    name: "App"
    data() {
      return model;
    }
  }).mount('#app')
  </script>
</body>
```

view는 사용자에게 랜더링될 영역인
```html
  <div id="app">
    <h2>{{message}}</h2>
  </div>
```
가 해당된다.

Model은 동적 데이터인 var model = {message: "Hyeoninii"} 가 된다.

View Model은
```javascript
var vm = Vue.createApp({
    name: "App"
    data() {
      return model;
    }
  })
```
이다.

## 가상 돔
> 브라우저의 돔 내용을 복사해서 가상돔으로 관리한다.

브라우저에서 HTML을 랜더링 할 때, 가장 비싼 작업은 돔을 조작하는 작업이다.  
이벤트를 감지할 때마다 동적으로 랜더링을 하게 된다면 돔을 계속 조작해야 하기 때문에 비효율 적이다.

그렇기 때문에 원본 브라우저의 돔을 직접 건드리지 않고, 가상 돔을 만들어 관리하도록 하는 개념이 가상돔이다.

Old, New 두 개의 가상 돔을 만들고, 둘을 diffing 알고리즘으로 비교하여 차이가 있는지 확인한다.

> ***Diffing 알고리즘***  
두 돔트리에서 변경된 점을 비교해서 바뀐 부분만 실제 돔에 반영한다.

가상돔의 장점은 돔을 비교하여 차이가 없으면 업데이트를 하지 않는다는 것이다.
이는 어떤 이벤트가 발생했을 때, 돔의 변화가 없더라도 jQuery는 다시 랜더링을 하지만 가상돔을 활용하는 vue, react에서는 랜더링을 하지 않는다.




## 모델에 접근하는 2가지 방법
-	전역 변수 사용 => 값만 바뀜 
-	view모델에서 data()의 return => 렌더링까지 됨

자바스크립트에서 쓰기 읽기는 set(), get()함수로 사용
Property: setter()/getter() 함수로 접근
Attribute: 값 자체

## Proxy
객체 레벨(Property)에서 동작
Set()을 사용하면 Proxy가 View에게 돔을 비교하라고 요청을 보냄 → 가상 DOM 비교 후 업데이트

배열이 변경되었을 때, React, Angular는 감지를 하지 못하기 때문에 배열 자체를 새로 만들어서 조작을 감지한다. 배열의 갱신 여부를 배열의 참조변수의 변경 여부로 판단하기 때문에. 
반면 Vue에서는 프록시를 사용하여 프록시가 감지할 수 있게 함 → 렌더링 가능

컴포넌트가 생성될 때 Vue는 먼저 data()를 실행해 내부 상태 객체를 만든 다음, 이 객체를 Proxy로 감싼다. 이렇게 만들어진 Proxy는 단순한 데이터 객체가 아니라, 데이터의 접근과 변경을 감지할 수 있는 반응형 객체다. 그 이후에 computed와 methods 등이 연결되고, 이 모든 준비가 끝난 뒤에 created() 훅이 실행된다. 따라서 created() 시점에서의 this는 이미 Proxy로 감싸진 컴포넌트 인스턴스를 가리키며, 내부 데이터에 자유롭게 접근할 수 있다. 이후 데이터가 변경되면 Proxy가 그 변화를 감지하고, Vue의 렌더링 시스템이 이를 기반으로 Virtual DOM을 다시 계산한 뒤 실제 DOM을 업데이트하며, 그 결과로 updated() 라이프사이클 훅이 호출된다.

view모델의 내부 매커니즘이 프록시다. ES6에서 채택한 모델을 Vue에서 구현한 것이므로 다른 언어에서도 동일하게 ES6모델을 채택할 경우, 동일하게 프록시 객체를 갖게 될 것임.

#### 단방향 <> 양방향  
- 단방향: 모델 → HTML문서에 반영되는 것  
- 양방향: 모델 ↔ HTML문서의 데이터가 서로 반영 되는 것


# Vue 디렉티브
 > v – 로 시작하는 속성: v-text, v-html

html태그에서 JS를 작성하면 문자열로 인식하고 처리하지만 v- 속성은 JS로 해석된다.

<br><br><br>

## v-bind 디렉티브
단방향 디렉티브로써 스크립트 → 모델은 값이 바뀜 <> Html → 모델은 값이 안바뀜  
v-bind:src → :src처럼 :로 축약이 가능하다.

```html
<html>
  <body>
    <div id='app'>
      <img :src="imagePath">
      <p>{{message}}</p>
    </div> 
  </body>

  <script>
  let vm = Vue.createApp({
          name: "App",
          data() {
            return {
              message: "v-bind 디렉티브",
              imagePath: "https://contactsvc.bmaster.kro.kr/photos/18.jpg",
            };
          },
        }).mount("#app");
  </script>
</html>
```

<br><br><br>

## v-text
보간법과 동일하게 작동하지만 자칫 보간법은 텍스트 전체가 노출될 수 있기 때문에 v-text를 사용하는 것을 권장


<br><br><br>

## v-model
양방향 데이터 바인딩
Vue의 강점

v-model에서 checkbox 선택 시, true-value/false-value 속성 정의 가능, 정의하지 않으면 true/false로 반환

<br><br><br>

## v-show <> v-if
v-show
css: display와 유사하게 동작, 특정 조건에서 보여주고, 가리는 옵션 가능
돔에서는 계속 유지하면서 스타일로만 조작
v-if
돔 자체를 조작 → 돔에서 추가/제거가 가능
v-else, v-else-if 사용 가능

성능 측면에서는 v-show가 더 좋다. v-show는 돔 트리를 미리 구성해두고 렌더링 여부만 결정하면 되지만 v-if의 경우에는 조건에 따라서 돔을 조작하기 때문에 오버헤드가 더 크다.

v-for 디렉티브
<태그명 v-for:”변수 in 배열” v-bind:key=”id값”>
반복적인 데이터 → 주로 배열, 객체를 렌더링 할 때 사용
주로 목록을 만들 때 사용

key값이 중요!! 

```html
<template v-for=”…”> 요소를 사용해서 여러 요소를 묶어서 반복 렌더링도 가능
```



# Vue 생명 주기
  
beforeCreate()

create() 단계에서는 초기화를 진행한다.
이 단계에서는 아직 돔이 생성되지 않았기 때문에 돔에 접근하는 것도, this를 사용하는 것도 불가능하다.

created()가 완료된 시점에 프록시 객체가 생성되고 내부 값은 기본 값으로 설정


setup()  
compositionAPI에서 추가된 사이클로 beforeCreate()와 create()의 단계가 합쳐져서 setup()에서 처리된다.

mount()
Vue가 템플릿을 DOM에 붙이는 것



# Computed
> as 계산된 속성

속성 값이 변할 때에만 함수가 실행되도록 하고 싶을 때 사용  
값을 캐싱해두었다가 값이 변하지 않는 것에 대해서는 다시 계산하지 않고 캐싱된 값을 반환한다.  
반드시 리턴이 필요하다.

Computed 속성의 작동 방식
계산한 속성 값을 캐시에 저장한다. 그렇기 때문에 실제 렌더링 될 때는 캐시 내부에서 값을 가져와 사용하게 되고 여러 번 렌더링하기 위해서 함수를 여러 번 호출하지 않는다.
```javascript
let vm = Vue.createApp({
        name: "App",
        data() {
          return { num: 0 };
        },
        computed: {
          sum() {
            console.log("## num: " + this.num);
            let n = parseInt(this.num);
            if (Number.isNaN(n)) return 0;
            return (n * (n + 1)) / 2;
          },
        },
      }).mount("#app");
```
반면
```javascript
<div id="app">
      1보다 큰 수: <input type="text" v-model.number="num" />
      <br />
      1부터 입력한 값까지의 합: <span>{{sum()}}</span><br />
      1부터 입력한 값까지의 합: <span>{{sum()}}</span><br />
      1부터 입력한 값까지의 합: <span>{{sum()}}</span><br />
    </div>

let vm = Vue.createApp({
        name: "App",
        data() {
          return { num: 0 };
        },
        methods: {
          sum() {
            console.log("## num: " + this.num);
            let n = parseInt(this.num);
            if (Number.isNaN(n)) return 0;
            return (n * (n + 1)) / 2;
          },
        },
      }).mount("#app");
```
computed속성 안에 있는 sum()에는 매개변수를 넣을 수 없다. 캐싱된 데이터이기 때문에 return을 반드시 있어야 한다.

Methods
methods는 기본적으로 함수이다. computed는 값이기 때문에 캐싱되어 사용되는 것과 달리 methods는 함수이기 때문에 매번 실행되어야 한다.
또한 호출할 때마다 동작한다.

computed <> methods 차이점
computed는 의존성을 기반으로 한다. 그렇기 때문에 프록시 객체 this가 캐싱한 값을 감시 하고 값이 바뀔 때마다 다시 계산하도록 동작한다.
반면 methods는 함수이기 때문에 내부적으로 아무것도 저장하지 않으며 단순히 호출될 때마다 실행된다.

반복 사용되는 값의 경우, computed
이벤트 처리의 경우, methods 사용을 권장

<br><br><br>

# Method

객체의 메서드와 동일한 동작을 한다.  
값의 변경 여부와 관계 없이 함수를 동작한다.

<br><br><br>

# Watch

> 비동기 처리에 적합한 데이터 처리

백엔드 URL 요청/응답에서 딜레이가 오래 걸리는 작업일 수록 Watch를 사용하는 것이 좋다.

<br><br><br>

# 이벤트처리
v-on 디렉티브를 사용한다. @로 치환해서 @click = "EventHandler"처럼 처리가 가능하다.

vue에서 이벤트를 가로채서 핸들링해야하기 때문에 기존의 js의 이벤트를 막아야 한다.  
가령 a태그의 경우, href의 링크 URL로 요청을 전송하는 이벤트가 발생한다.  
이를 vue에서 가로채서 이벤트 핸들링을 하기 위해서는 js의 이벤트 처리를 막아야하기 때문에 event.preventDefault()를 해주어야 한다.

### target vs currentTarget

```html
<div>
  <a href="https://hyeoniill.github.io">블로그
    </a>
  </div>
```

에서 a를 클릭하게 되면 이벤트가 발생한다.

target은 이벤트가 발생한 a태그가 되고,
currentTarget은 a태그에서 전파되어 div태그가 된다.




