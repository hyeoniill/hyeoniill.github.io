---
layout: post
title: "JVM 어셈블리어"
categories: [백엔드, 자바]
tags:
  [
    JAVA,
    다형성,
    Polymorphism,
    OOP,
    객체지향,
    오버로딩,
    오버라이딩,
    동적 바인딩,
    정적 바인딩,
  ]
date: 2025-07-18 16:00:00 +0900
last_modified_at: 2025-07-18
---

자바 동작을 더 알기 위해서 바이트 코드를 변환해서 보려다가 JVM 어셈블리어를 간단히 공부하기로 했다.

먼저 javac 명령어로 바이트 코드로 변환시킨 파일을 javap -c 명령어로 복구하면 어셈블리어를 확인할 수 있다.

## 기본 메서드

```java
public int add(int a, int b) {
    return a + b;
}
// ------------------------------------------------------------------------------

public int add(int, int);
  descriptor: (II)I         //디스크립터 int, int -> int
  Code:
   0: iload_1               //1번 로컬 변수를 스택에 로드
   1: iload_2               //2번 ..
   2: iadd                  //두 값을 더함
   3: ireturn               //결과를 반환
```

자바의 어셈블리어는 opcode + operand로 구성되어 있다. 기존 OS들과 다르게 JVM은 1byte 단위의 opcode로 instruction을 해석한다. (그래서 바이트코드라고 불리는 것 같다.)

그리고 인터프리터 방식으로 읽기 때문에 스택 구조로 명령어들을 관리한다.

opcode랑 다르게 operand는 명령어에 따라서 1~4 바이트까지 가능하다고 한다

주소 표현이나 다른 여러가지 문제는 잘 모르겠지만 자바가 알아서 다른 명령어로 잘 처리했다고 한다.

## new 연산자

```java
Person p = new Person();
// ------------------------------------------------------------------------------
0: new           #2  // class Person
3: dup
4: invokespecial #4  // Method Person.<init>:()V
7: astore_1
```

- 자바는 opcode에 `new`라는 연산자를 별도로 두었다.
  클래스 파일은 상수 풀을 가지고 어셈블리어에서는 인덱스를 통해서 (#2, #4) 접근한다.
  그래서 new #2를 하게 되면 Person 클래스 객체를 생성하기 위한 메모리를 힙에 할당한다. (아직 초기화는 안됨)
- `invokespecial`이 Person()의 생성자를 호출하고, 객체를 초기화 한다.
- `dup`은 new로 생성한 참조를 복제하는데 이는 invokespecial에서 생성자를 호출하면서 참조 포인터를 하나 소비하기 때문이다.
- `astore_1`은 생성된 객체를 1번 로컬 변수에 저장한다.

## 정적 바인딩(오버로딩)

```java
class Printer {
    void print(int i) {
        System.out.println("int: " + i);
    }

    void print(String s) {
        System.out.println("String: " + s);
    }

    public static void main(String[] args) {
        Printer p = new Printer();
        p.print(123);          // int 버전 호출
        p.print("hello");      // String 버전 호출
    }
}

// ------------------------------------------------------------------------------

public class Printer {
  public Printer();
    Code:
       0: aload_0
       1: invokespecial #1        // Method java/lang/Object."<init>":()V
       4: return

  public static void main(java.lang.String[]);
    Code:
       0: new           #2        // class Printer
       3: dup
       4: invokespecial #3        // Method Printer."<init>":()V
       7: astore_1

      // p.print(123);
       8: aload_1
       9: bipush        123
      11: invokevirtual #4        // Method Printer.print(I)V

      // p.print("hello");
      14: aload_1
      15: ldc           #5        // String "hello"
      17: invokevirtual #6        // Method Printer.print(Ljava/lang/String;)V
      20: return

  void print(int);
    Code:
       0: getstatic     #7        // Field java/lang/System.out:Ljava/io/PrintStream;
       3: new           #8        // class java/lang/StringBuilder
       6: dup
       7: invokespecial #9        // Method java/lang/StringBuilder."<init>":()V
      10: ldc           #10       // String "int: "
      12: invokevirtual #11       // Method java/lang/StringBuilder.append(Ljava/lang/String;)Ljava/lang/StringBuilder;
      15: iload_1
      16: invokevirtual #12       // Method java/lang/StringBuilder.append(I)Ljava/lang/StringBuilder;
      19: invokevirtual #13       // Method java/io/PrintStream.println(Ljava/lang/String;)V
      22: return

  void print(java.lang.String);
    Code:
       0: getstatic     #7        // Field java/lang/System.out:Ljava/io/PrintStream;
       3: new           #8        // class java/lang/StringBuilder
       6: dup
       7: invokespecial #9        // Method java/lang/StringBuilder."<init>":()V
      10: ldc           #14       // String "String: "
      12: invokevirtual #11       // Method java/lang/StringBuilder.append(Ljava/lang/String;)Ljava/lang/StringBuilder;
      15: aload_1
      16: invokevirtual #15       // Method java/lang/StringBuilder.append(Ljava/lang/String;)Ljava/lang/StringBuilder;
      19: invokevirtual #13       // Method java/io/PrintStream.println(Ljava/lang/String;)V
      22: return
}
```

- **main**에서 메서드 호출 어셈블리어를 보면 line11, 17에 각각 상수 풀 인덱스 `print(I)V → #4` / `print(Ljava/lang/String;)V → #6` 으로 구분한 것을 확인할 수 있다.
- **print 메서드** 어셈블리어를 보면 우선 `getstatic`명령어로 상수풀 인덱스 #7에 저장되어 있는 System.out 객체를 스택에 push한다.
  System.out 객체는 System클래스에 static으로 정의되어 있는 필드 이다.
  getstatic명령어는 static 필드 값을 스택에 푸시한다.
- 그 다음, `new` 명령어로 #8번에 저장된 StringBuilder 객체를 힙에 생성한다.
  이후에 *line16*까지 StringBuilder객체에 String을 만들어 저장한다.
  이 때, “int: “ or “String: “같은 리터럴은 상수풀 인덱스에서 가져오는 것으로 보아 상수 풀에 저장되는 것을 확인할 수 있다.
- *line19*에서 String을 출력하고 리턴한다.
- `invokespecial`은 컴파일 타임에 호출이 고정되는 정적 바인딩이고,
  `invokevirtual`은 런타임에 실제 객체 비교를 하고 VMT를 통해 메서드를 호출하는 동적 바인딩이다.

## 동적 바인딩(오버라이딩)

```java
class Animal {
    void speak() {
        System.out.println("동물이 소리를 낸다");
    }
}

class Dog extends Animal {
    @Override
    void speak() {
        System.out.println("멍멍");
    }
}

public class Test {
    public static void main(String[] args) {
        Animal a1 = new Animal();
        Animal a2 = new Dog();   // ← 다형성

        a1.speak();   // 동물이 소리를 낸다 (Animal)
        a2.speak();   // 멍멍 (Dog) ← 동적 바인딩
    }
}

// ------------------------------------------------------------------------------

public static void main(java.lang.String[]);
  Code:
   0: new           #2       // class Animal
   3: dup
   4: invokespecial #3       // Method Animal.<init>()V
   7: astore_1

   8: new           #4       // class Dog
  11: dup
  12: invokespecial #5       // Method Dog.<init>()V
  15: astore_2

  16: aload_1
  17: invokevirtual #6       // Method Animal.speak()V

  20: aload_2
  21: invokevirtual #6       // Method Animal.speak()V

  24: return
```

- *line 17, 21*을 보면 a1.speak와 a2.speak지만 컴파일 타임에는 a1, a2 모두 Animal 타입을 가지므로 동일한 메서드 #6를 참고하는 것을 확인할 수 있다.
- 실제 런타임에 코드가 돌아가면 `invokevirtual` 명령어는 객체 참조를 pop해서 실제 객체인지 확인 → 해당 클래스의 VMT를 참조해서 오버라이딩된 speak()를 확인하고 해당 메서드를 사용한다.
