---
layout: post
title: "Chirpy 테마 Actions 빌드 오류: Can't find stylesheet to import 해결"
categories: [Github 블로그]
tags: [GitHub, Blog, Jekyll, Chirpy, 오류 해결]
date: 2025-03-11 22:30:00 +0900
last_modified_at: 2025-03-19
---

> 아래 방법은 actions에서 빌드 오류에 대한 해결책이지 근본적인 오류 해결 방법은 아니다.
> 근본적인 해결 방법은 추후에 포스팅할 예정

Chirpy 테마를 적용하는 과정에서 GitHub Actions에서 오류가 발생했다.

오류 메시지:
> Error: Can't find stylesheet to import  
> @use `vendors/bootstrap`

Jekyll 빌드 과정에서 부트스트랩 파일을 참조하지 못하는 상황이다.

**오류 스크린샷**
![오류 사진](/assets/img/post_image/2025-03-11/sc1.png)

---

부트스트랩(Bootstrap)은 웹사이트 디자인을 쉽게 구현하는 CSS 프레임워크이다. 하지만 **GitHub Actions의 빌드 환경에서는 자동으로 포함되지 않는 것 같다.**

처음에는 `@use 'vendors/bootstrap';` 부분을 삭제해보았는데 Actions는 성공적으로 빌드되었지만 부트스트랩을 참조하지 않아서 레이아웃이 깨지는 상황이었다.

그렇기 때문에 빌드 과정에서 부트스트랩을 설치하는 방법을 선택했다. 

---
## 1. `.github/workflows/jekyll.yml` 수정
jekyll.yml 파일에서 **부트스트랩을 설치**하는 과정을 추가해야한다. 

```yaml
- name: Install Bootstrap #빌드 단계 이름
  run: npm install bootstrap #커맨드
```

**수정 후 `jekyll.yml` 예시**  
![jekyll.yml 파일](/assets/img/post_image/2025-03-11/sc2.png)

---

## 2. `_sass/main.bundle.scss` 수정
기존 `@use 'vendors/bootstrap';` 경로를 수정했다.
```scss
@use 'bootstrap';
```

**수정 후 `main.bundle.scss` 예시**  
![main.bundle.scss 파일](/assets/img/post_image/2025-03-11/sc3.png)

---

## 3. `_config.yml` 수정
부트스트랩이 설치된 디렉토리를 Jekyll이 인식할 수 있도록 `_config.yml` 파일에서 `main.bundle.scss`의 경로를 변경한다.

**수정 후 `_config.yml` 예시**  
![_config.yml 파일 경로 변경](/assets/img/post_image/2025-03-11/sc4.png)

---

## 결과 확인
모든 설정을 완료한 후 GitHub Actions를 실행하니 **빌드가 정상적으로 완료되었다.**

✅ **Actions 실행**
![actions 성공 사진](/assets/img/post_image/2025-03-11/sc6.png)

✅ **블로그 사진**
![블로그 사진](/assets/img/post_image/2025-03-11/sc5.png)

---

## 정리
### 핵심 해결 방법
1️⃣ `jekyll.yml`에서 `npm install bootstrap` 추가<br>
2️⃣ `_sass/main.bundle.scss`에서 `@use 'bootstrap';`로 수정<br>
3️⃣ `_config.yml`에서 부트스트랩 경로를 인식하도록 변경<br>


