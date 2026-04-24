---
layout: post
title: "사진 경로 설정하는 법"
categories: [Github 블로그]
tags: [GitHub, Blog, 오류 해결]
date: 2025-03-19 21:00:00 +0900
last_modified_at: 2025-03-19
---

Actions 오류를 해결한 후에 새로운 문제가 생겼다.

**블로그에 사진이 표시되지 않는다!!**
 
![오류난 사진](/assets/img/post_image/2025-03-19/sc1.png)

사진을 `_post` 하위 폴더에 저장해서 발생한 문제였다. 

<br>

## 1. 사진 경로 설정
사진이 정상적으로 표시되려면 사진을 `assets/img` 하위에 저장해야한다. 그래서 `assets/img` 폴더 안에 `post_imgae` 폴더를 추가하고, 날짜별로 정리했다. 

> **📌reference**  
> Markdown에서는 **`![사진 설명](사진 경로)`** 형식으로 이미지를 업로드한다.  
예를 들어, `![오류 사진](/assets/img/post_image/2025-03-19/sc1.png)`처럼 작성하면 된다.
만약 사진 크기를 조절하려면 `img 태그`를 사용하거나 링크 옆에 중괄호로 묶어서 {: width="300"}과 같이 해야 한다.  
**예시:** `<img src="주소" width="300", height="300">`

✅ **수정된 사진**
![수정된 사진](/assets/img/post_image/2025-03-19/sc2.png)

---

## 2. `_config.yml` 파일 수정
`_config.yml` 파일에서 `cdn`관련 설정을 주석 처리했다.
![_config.yml 파일 수정](/assets/img/post_image/2025-03-19/sc3.png)

---

## 3. 프로필 사진 수정
프로필 사진도 마찬가지로 `/assets/img` 폴더 하위에 저장해야 한다.  
또한 `config.yml` 파일에서 `avatar`속성을 해당 이미지 링크로 수정해야 한다.

✅ **프로필 사진**
<br>
<img src="../assets/img/post_image/2025-03-19/sc4.png" style="width: 300px; height: 300px"/>  

<br><br><br><br><br><br><br><br><br>

**사진 관련 오류도 처리 완료~!**

<br><br><br>

## +추가
사이드바에서 프로필 사진 밑에 글자 폰트가 너무 커서 `css`파일을 수정해주었다. 
`.site-title`의 `font-size`값을 `1.75 → 1.5`로 변경해주었다.  

<br>

<div style="display: flex; align-items: center;">
  <img src="../assets/img/post_image/2025-03-19/sc6.png" width="400" height="500" style="margin-left: 20px" />
  <img src="../assets/img/post_image/2025-03-19/sc5.png" width="400" height="500" style="margin-right: 20px;" />
</div>