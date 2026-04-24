---
layout: post
title: "CSRF 공격"
categories: [네트워크 및 웹보안]
tags: [보안, 웹보안, CSRF]
date: 2025-03-22 17:30:00 +0900
last_modified_at: 2025-03-22
---

## CSRF란?

> CSRF(Cross Site Request Forgery, 사이트 간 요청 위조)란 사용자가 특정 웹사이트에 로그인한 상태에서, 악성 웹사이트를 방문하면 사용자의 의도와 관계없이 요청이 전송되는 공격 기법이다.


## CSRF 공격 원리
1. 사용자가 A 사이트(예: 인터넷 뱅킹)에 로그인하고 세션을 유지
2. 공격자가 A 사이트를 모방하여 악성코드를 추가한 B 사이트를 생성
3. 사용자가 링크를 통해 B 사이트를 방문하면 자동으로 A 사이트로 요청이 전송됨
4. A 사이트는 이를 정상적인 요청으로 오인하고 처리함.


## CSRF 공격 예시

> HTTP는 GET 요청과 POST 요청으로 서버에 요청을 보낸다.

### 1️⃣ GET 요청을 이용한 공격
`Samy`가 `Alice`를 친구 추가를 하고 싶다고 생각해보자

`Samy`로 접속하여 `Alice`에게 친구 추가 요청을 보내보면 `http://www.seed-server.com/action/friends/add?friend=56 &~~` 와 같이 URL뒤에 `friend=56`과 같이 변수 값이 붙어서 가는 것을 확인할 수 있다. 

![GET요청 사진](/assets/img/post_image/2025-03-22/sc1.png)

그렇기 때문에 공격자는 “http://www.seed-server.com/action/friends/add?friend=5

### 2️⃣ POST 요청을 이용한 공격


🔒 CSRF 방어 방법

✅ 1. CSRF 토큰 사용

서버가 요청을 받을 때, 세션과 연결된 CSRF 토큰이 함께 전송되었는지 검증한다.

<input type="hidden" name="csrf_token" value="abcd1234">

서버는 요청에서 받은 csrf_token과 저장된 토큰을 비교하여 일치하지 않으면 요청을 차단한다.

✅ 2. SameSite 쿠키 설정

SameSite 속성을 활용하여 외부 사이트에서 쿠키를 전송하지 않도록 설정할 수 있다.

Set-Cookie: sessionid=abcd1234; HttpOnly; Secure; SameSite=Strict

Strict: 완전히 외부 요청 차단 (보안 강력)

Lax: GET 요청은 허용하지만, 중요한 변경 요청(POST 등)은 차단

✅ 3. Referer / Origin 검증

서버에서 요청의 Referer 또는 Origin을 확인하여 신뢰할 수 있는 출처에서 온 요청인지 검사할 수 있다.

if request.headers["Origin"] != "https://bank.com":
    reject_request()

✅ 4. CORS 정책 강화

CORS(Cross-Origin Resource Sharing) 정책을 엄격하게 설정하여, 외부 사이트에서 중요 요청을 보낼 수 없도록 제한할 수 있다.

Access-Control-Allow-Origin: https://trusted-site.com





