---
layout: post
title: "스레드"
categories: [자바]
tags: [자바, 객체지향, SOLID, OOP, 스레드]
date: 2025-04-23 16:00:00 +0900
last_modified_at: 2025-04-23
---

c++은 메인 스레드가 종료되면 작업이 종료된다.
반면 자바에서는 main스레드가 종료되더라도 작업 스레드가 있으면 종료되지 않는다.

## 스레드 만드는 방법

메인스레드는 자동으로 생성된다.

작업 스레드를 만들기 위해서는 2가지 방법이 있다.

### Thread 클래스로 직접 생성

Thread thread = new Thread(Runnable target);

스레드는 Runnable 인터페이스를 포함하는 클래스에서만 생성해서 실행이 가능하다.
Runnable 인터페이스는 run()함수만 갖고 있다. thread.start()를 하게 되면 실제 스레드가 실행된다.

다만 스레드의 우선순위는 스케줄링에 따라서 다르게 실행될 수 있다.

```java
Thread thread = new Thread(new Runnable() {
    @Override
    public void run() {
        ...구현
    }
});
```

익명 함수로도 구현할 수 있다. 현실적으로 가장 많이 사용하는 방법이다.

### 상속으로 하는 경우

```java
public class work extends Thread {
    @Override
    public void run() {
        ... 구현
    }
}
```

다른 클래스를 이미 상속하는 경우에는 사용할 수 없다.

## Runnable 인터페이스

Thread 클래스는 Runnable 인터페이스를 구현하고 있다. Runnable이라는 인터페이스 자체는 다음과 같다.

```java
@FunctionalInterface
public interface Runnable {
    /**
     * Runs this operation.
     */
    void run();
}
```

Thread 클래스가 있음에도 Runnable 인터페이스를 따로 구현한 이유는 자바가 단일 상속을 지원하기 떄문이다.
만약 Runnable 인터페이스가 없다면 클래스는 무조건 extends Thread를 해야 한다.
그렇게 되면 다른 상속을 받을 수가 없다.
그래서 Thread라는 실제 실행 주체인 클래스와 실행 작업을 Runnable이라는 인터페이스로 구분하여 둔 것이다.

```java
public Thread(Runnable task) {...}
```

자바는 내부적으로 Runnable 타입의 인자를 받는 Thread 생성자를 가진다. 그렇기 때문에 Runnable 객체를 생성한 후에 스레드에 해당 객체를 넘겨서 start()만 해주면 멀티스레드로 동작시킬 수 있다.

## Race Condition

synchronized 키워드

락을 걸게 되면 성능이 떨어진다.