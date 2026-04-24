---
layout: post
title: "구글 애널리틱스 등록하기"
categories: [Github 블로그]
tags: [Google Analytics, 방문자 분석, 블로그 통계, 설정 방법]
date: 2025-04-06 21:00:00 +0900
last_modified_at: 2025-04-06
---

방문자 수를 확인하고 싶어서 여러가지 툴을 알아보다가 구글 애널리틱스를 활용하기로 했다.

## 1. 구글 애널리틱스 등록

먼저 https://analytics.google.com 으로 접속 후 **측정 시작**을 클릭한다.

![image.png](/assets/img/post_image/2025-04-06/image1.png)

---
<br>

계정 이름 입력 후 **다음**을 클릭한다.

![image.png](/assets/img/post_image/2025-04-06/image2.png)

---
<br>

속성 이름도 마찬가지로 원하는 이름을 넣고 다음을 누른다.  
시간대랑 통화는 한국으로 바꿔주었다.

![image.png](/assets/img/post_image/2025-04-06/image3.png)

---
<br>

업종 카테고리도 작성했다.

![image.png](/assets/img/post_image/2025-04-06/image4.png)

---
<br>

비즈니스 목표는 블로그의 방문자를 알기 위한 것이기 때문에 **“웹 또는 앱 트래픽 파악”** 이랑 **“사용자 참여 발생 시간 및 유지율 보기”** 정도를 체크해주었다.

![image.png](/assets/img/post_image/2025-04-06/image5.png)

---
<br>

웹 사이트를 확인할거니까 **웹**을 선택해주었다.

![image.png](/assets/img/post_image/2025-04-06/image6.png)

---

<br><br>

## 2. `_config.yml`에 설정 추가

이제 내 블로그 페이지에 대한 데이터를 수집할 수 있도록 애널리틱스 계정과 연결 시켜주어야 한다.

다음과 같은 필드를 찾아서 `google id` 밑에 `컨테이너 ID`를 복사해서 넣어주어야 한다.

```yaml
analytics:
  google:
    id: G-XXXXXXXXXX
```

<br>

> 컨테이너 ID는 `G-`로 시작하는 애널리틱스 속성 페이지 또는 태그 관리자에서 확인 가능

![image.png](/assets/img/post_image/2025-04-06/image7.png)

---
<br>

이제 Github에 올리고 잠시 기다리면 다음과 같은 화면이 나온다.

![image.png](/assets/img/post_image/2025-04-06/image8.png)

<br><br><br><br>

### **끝!**