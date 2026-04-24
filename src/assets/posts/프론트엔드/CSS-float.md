---
layout: post
title: "CSS - float 속성"
categories: [프론트엔드, CSS]
tags: [KB, IT's Your Life, 부트캠프, CSS]
date: 2026-03-09 17:00:00 +0900
last_modified_at: 2026-03-09
---

오늘은 CSS에서 float 속성에 대해서 공부했다.

> float: 뜨다

개발자로서 `float`라고 하면 가장 먼저 실수의 개념을 떠올리겠지만 CSS에서 float 속성은 `뜨다`의 의미를 개념이다.

<br>

## float ≠ 정렬
float 속성이 적용된 태그는 기존 브라우저가 렌더링하는 html 공간과 별도로 위에 떠서 별도의 층에서 동작된다고 생각하면 된다. 

```html
<div id="div1" style="float: left; width: 100px"></div>
<div id="div2"></div> 
```
![float attr](/assets/img/post_image/2026-03-09/float.png)

이런 식으로 div1에 float 속성을 주게 되면 div2가 영역을 잡게 되고, div1은 기존 html이 렌더링 되는 층과 별개로 위에 덮어씌워진다.

float 속성에 대해서 잘못 이해하고 정렬의 개념으로 설명하는 글들이 있다고 하는데 사실 나는 float의 개념을 처음 배워서 헷갈리지는 않았다.

<br>

## CSS 렌더링

실습을 하던 중 흥미로운 점을 발견했다.

![interesting](/assets/img/post_image/2026-03-09/interesting.png)

배운대로라면 div태그는 block 요소이고, float를 통해서 div1을 띄우면 div2가 하나의 라인을 전부 차지하려고 한다.  
그리고 div2에서 텍스트는 가장 왼쪽부터 시작되고, 그 위에 div1이 덮이기 때문에 div2의 텍스트가 가려질 것이라고 생각했다.  
그렇지만 div2의 text는 div1에 의해 덮어씌워진 영역 바로 옆에서부터 시작하게 되는 것을 관찰하였다.  

지피티와 공부해본 결과, CSS에는 2가지 포멧팅이 있다.
- block formatting
- inline formatting

기존에 배웠던 block <> inline의 차이점이 이 CSS의 2가지 포멧팅이 렌더링 되는 방식에 따라서 생기는 것이라는 것을 알았다.  

float에 대해서 block 요소는 float을 무시하고 전체 영역을 차지한다.
반면, inline 요소는 float영역을 피해서 렌더링된다.

div안에 텍스트를 넣게 되면 돔트리에서는 div 하위에 text 노드가 생기게 된다.
text 노드는 인라인 포멧팅으로 렌더링되기 때문에 float의 영역을 피해서 렌더링된다.
