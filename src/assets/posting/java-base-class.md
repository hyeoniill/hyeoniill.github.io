---
layout: post
title: "클래스"
categories: [자바]
tags: [자바, 객체지향, SOLID, OOP]
date: 2025-04-23 09:00:00 +0900
last_modified_at: 2025-04-23
---

##

## Object 클래스

- equals(): boolean
- hashCode(): int
- toString: String

Getter/Setter를 갖고 있어야만 Java Bean으로써의 컴포넌트로 인정을 받는다.

Java Bean의 규칙

- public 이어야 함.
- 매개변수 없는 생성자가 있어야 함. @NoArgsConstructor
- 필드는 public이 아니어야 함
- 필드는 getter/setter를 가져야 함 @Getter @Setter

확장성을 고려했을 때, 컴포넌트로 만들어서 사용하는 것이 좋기 때문에 getter/setter를 입력 해야 한다.

## Wrapper 클래스

기본 자료형 -> 참조 자료형으로 바꿔준다.
기본 자료형에서는 사용하지 못하는 다양한 메서드 기능이 제공이 된다.

boxing: 기본 자료형이 참조 자료형을 바꾸는 것
auto-boxing: 컴파일 시에 자동으로 boxing되는 것

```java
Object[] arr = new Object[10];
arr[0] = new String("Hello");
int i = 10;
arr[1] = i;         //컴파일 시 arr[1] = new Integer(i)로 바뀜
arr[2] = 10.1F;
arr[3] = 'A';
```

## String 클래스

- String
- StringBuilder
-StringTokenizer

String은 final 클래스로써 상속이 불가능하다.

String은 상수이다. 그렇기 때문에 String이 객체로써 한 번 생성되면 값을 변경할 수 없다.
그래서 String을 가변적으로 조절하고 싶다면 StringBuffer나 StringBuilder를 사용해야 한다.

## Calendar 클래스

날짜에 관련된 Date() 함수가 대부분 deprecated되었다.
그 대신 Calendar 클래스를 사용하면 날짜 정보를 얻을 수 있다.

```java
Calendar c = Calendar.getInstance();

c.get(Calendar.DATE)
```

## Class 클래스

Class 클래스가 있다.

```java

env.load(new FileInputStream("c:\\my.properties"));
String className = env.getProperty("dao");

Class clazz = Class.forName(className);

dao = (ProductDAO)clazz.getDeclaredConstructor().newInstance();
```
