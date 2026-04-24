---
layout: post
title: "다형성[Polymorphism]"
categories: [백엔드, 자바]
tags: [JAVA, 다형성, Polymorphism, OOP, 객체지향, 공변 반환, 오버로딩, 오버라이딩]
date: 2025-07-18 10:00:00 +0900
last_modified_at: 2025-07-18
---

OOP에서 다형성이란 같은 메서드를 객체마다 각각 다르게 동작하도록 하는 것이다.
상속과 인터페이스와 같이 메서드를 재정의해야 하는 상황에 기반해서 사용된다.

다형성은 컴파일 타임에 이루어지는 컴파일 다형성(오버로딩)과 런타임 다형성(오버라이딩)이 있다.

## 오버로딩[Overloading]

같은 이름의 메서드의 매개변수를 다르게 해서 **여러번 정의**하는 것이다.
오버로딩은 컴파일러가 컴파일 시점에 사용될 메서드를 정의할 수 있기 때문에 컴파일 타임 다형성, 정적 바인딩이다.
오버로딩을 통해서 메서드를 정의하게 되면 메서드 영역에는 별도의 서로 다른 메서드가 정의되고 각각의 주소를 할당 받는다.

자바에서는 JVM이 코드 해석을 할 때 메서드 타입과 인자 타입을 바이트코드로 치환하는데 이를 메서드 디스크립터라고 한다. JVM은 인터프리팅을 할 때 디스크립터에 따라서 메서드를 링킹하게 된다.

| 타입 | 디스크립터 | 예시 |
|------|------------|------|
| int | I | `int add(int a, int b)` → `(II)I` |
| boolean | Z | `boolean isValid()` → `()Z` |
| char | C | `char getChar()` → `()C` |
| void | V | `void print()` → `()V` |
| 객체 | Lfully/qualified/ClassName; | `String getName()` → `()Ljava/lang/String;` |
| 배열 | [ | `int[] getArray()` → `()[I` |

## 오버라이딩[Overriding]

**상속받은** 메서드의 기능을 변경하는 것이다. `@Override` 어노테이션으로 명시하는 것이 좋다. (사실 붙히지 않아도 컴파일러가 내부적으로 다 처리한다.)

- 공변 반환 타입[Covariant Return Type]: **오버라이딩 시**, 리턴 타입을 부모보다 하위 타입으로 바꿀 수 있는 것이다.

```java
// Builder 디자인 패턴 예시
class Animal {
	Animal build() { return new Animal(); }
}

class Dog extends Animal {
	Dog build() { return new Dog(); }
}

class Cat extends Animal {
	Cat build() { return new Cat(); }
}
```

### 런타임 다형성

```java
class Parent {
	void printInfo() { System.out.println("Parent"); }
}

class Child extends Parent {
	void printInfo() { System.out.println("Child"); }
}

Parent a = new Child();
Parent b = new Parent();

//컴파일 시점에는 어떤 printInfo()를 사용해야할지 알 수 없다.
//이는 런타임에 알 수 있기 때문에 런타임 다형성이라고 한다.
a.printInfo();
b.printInfo();
```

런타임에 정해지는 것은 항상 컴파일 시점에 정해지는 것보다 느린데 자바에서도 마찬가지이다. 자바에서도 JVM이 바이트 코드로 컴파일하고, 인터프리터 방식으로 해석한다지만 동일하게 차이가 난다.

컴파일 다형성 같은 경우에는 컴파일 시점에 사용될 메서드를 알기 때문에 해당 메서드 주소로 바로 링킹해서 액세스가 가능하지만 런타임의 경우에는 컴파일 시점에 정확하게 어떤 메서드가 사용되는지 모르기 때문에 런타임에 정확한 타입을 정하고 해당 클래스의 메서드 테이블(VMT)을 참조해서 메서드에 접근해야 한다.
<br><br><br>


### 요약

다형성: 하위 클래스 객체가 상위 클래스 or 인터페이스 기능을 본인 스타일로 재정의하는 것

오버로딩: 이름이 같은 새로운 함수를 만드는 것, 컴파일 다형성

오버라이딩: 메서드 재정의, 런타임 다형성

VMT: Virtual Method Table