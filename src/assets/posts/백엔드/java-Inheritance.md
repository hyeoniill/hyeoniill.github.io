---
layout: post
title: "상속[Inheritance]"
categories: [백엔드, 자바]
tags: [JAVA, 상속, Inheritance, OOP, 객체지향]
date: 2025-07-15 19:00:00 +0900
last_modified_at: 2025-07-15
---


`상속`이란 상위 클래스가 가진 속성과 동작을 하위 클래스에게 물려주는 것이다.
OOP에서 상속을 사용하면 하위 객체들이 가진 공통 속성이나 동작을 묶어서 상위 객체에 정의하여 `확장성`, `재사용성`, `유지보수성`을 높일 수 있다.

기능의 관점에서 보면 하위 클래스에서 상위 클래스의 기능 + 추가적 기능을 가지기 때문에 하위 클래스를 더 확장된 개념으로 볼 수 있다.

![기능 관점](/assets/img/post_image/2025-07-15/image1.png){: width="70%" height="auto"}

반대로, Set의 관점으로 보면 상위 클래스가 더 많은 종류를 포함하고 있고 하위 클래스는 더 세분화된 종류로 생각할 수 있기 때문에 상위 클래스를 더 확장된 개념으로 볼 수 있다.

![set 관점](/assets/img/post_image/2025-07-15/image2.png){: width="70%" height="auto"}

## 메모리 관점

```java
class Parent {
	void print() {}
}

class Child extends Parent {
	@Override
	void print() {}
	
	void speak() {}
}

public class Main {
	public static void main(String[] args) {
		Parent parent = new Child();
	}
}
```

이런 코드가 있다고 하자.

Parent parent = new Child()를 하게 되면, Child 객체가 `힙 영역`에 생성된다. 

그리고 main함수의 스택에 parent라는 변수는 힙 영역에 생성된 ***Child 객체의 참조값***을 갖는다.

![image.png](/assets/img/post_image/2025-07-15/image3.png)

`Parent` 클래스로 parent를 생성했지만 실제로 참조하는 인스턴스는 `Child`이다. 이를 **업캐스팅**이라고 한다.

힙 메모리에서 Child 객체는 Child 클래스의 포인터와 자신의 필드 값을 갖는다. Child의 메서드가 실행되면 객체는 Child 클래스의 포인터를 통해서 해당 클래스의 **메서드 테이블**에 접근해 메서드를 실행한다.

parent.print()를 하게 되면 parent 변수의 타입은 실제 타입인 Child로 **동적 바인딩** 되어 Child.print()가 실행된다.

```java
 // 두 경우 모두 Child.print()가 실행된다. 
 Parent parent = new Child();
 parent.print();
 
 Child child = new Child();
 Parent parent = (Parent) child;
 parent.print();
```

Parent.print()를 사용하기 위해서는 Child 클래스 내부에서 `super`키워드를 사용하여 **정적 바인딩**을 하거나 *오버라이딩을 하지 않는* 방법이 있다.