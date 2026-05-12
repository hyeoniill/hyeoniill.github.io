---
layout: post
title: "스레드"
categories: [백엔드, 자바]
tags: [자바, 객체지향, 스레드, Thread, Runnable]
date: 2026-04-23 16:00:00 +0900
last_modified_at: 2025-04-23
---

JVM은 하나의 프로세스로써 OS로부터 CPU 자원을 할당 받아서 실행된다.
일반적으로 하나의 자바 애플리케이션은 하나의 JVM 프로세스에서 실행된다.
그래서 JVM은 병렬 처리를 위해서 스레드를 사용한다.

## 스레드 우선순위

모든 스레드는 우선순위를 가진다.
어떤 스레드에서 실행되는 동안 Thread 객체를 생성해서 새 스레드를 생성할 수 있다.
그러면 새 스레드는 해당 스레드 객체를 생성한 스레드와 동일한 우선순위를 갖는다.

## 스레드 종료 조건

자바에서는 main스레드가 종료되더라도 일반 작업 스레드가 있으면 종료되지 않는다.

JVM은 다음 중 하나가 발생할 때까지 스레드를 계속 실행한다.

- Runtime 클래스의 exit메서드가 호출되고, 작업이 승인될 경우
- 데몬 스레드를 제외한 모든 스레드의 run() 함수가 리턴되거나 예외가 run() 함수까지 전달된 경우

## 스레드 생성 방법

메인스레드는 자동으로 생성된다.
작업 스레드를 만들기 위해서는 2가지 방법이 있다.

### 1. Thread 클래스 상속

Thread 클래스를 상속하는 경우, Thread 클래스가 가진 run() 함수를 오버라이드 해야 한다.

```java
public class Work extends Thread {
    @Override
    public void run() {
        // 구현
    }
}

public class Main {
    public static void main(String[] args) {
        Work work = new Work();
        work.start();
    }
}
```

이 때, 스레드 실행은 start() 함수를 사용해야 한다.

해당 방법은 다른 클래스를 이미 상속하는 경우에는 사용할 수 없다는 단점이 있다.

### 2. Runnable 인터페이스 구현

스레드는 Runnable 타입 객체를 인자로 받아서 해당 작업을 수행할 수 있다.

```java
Thread thread = new Thread(Runnable target);
```

Runnable은 run()함수만을 가진 인터페이스이다.
Thread 클래스는 Runnable을 구현하고 있다. 그렇기 때문에 1번 방법에서 Thread 클래스를 상속할 경우, 새 스레드의 작업을 정의하는 run()함수를 오버라이드 해주어야 한다.

```java
public class Work implements Runnable {
    @Override
    public void run() {
        // 구현
    }
}

public class Main {
    public static void main(String[] args) {
        Work work = new Work();
        Thread thread = new Thread(work);

        thread.start();
    }
}
```

<br>
익명 구현 객체로도 구현할 수 있다. 현실적으로 가장 많이 사용하는 방법이다.

```java
public class Main {
    public static void main(String[] args) {
        Thread thread = new Thread(new Runnable() {
            @Override
            public void run() {
                //구현
            }
        });

        thread.start();
    }
}
```

## 스레드 생성자

- Thread()
- Thread(Runnable target)
- Thread(String name)
- Thread(Runnable target, String name)

모든 스레드는 식별하기 위한 이름을 갖고 있다.
스레드의 이름은 중복될 수 있으며 name을 인자로 주지 않으면 자동으로 생성된다.
또한 인자로 null이 전달되면 `NullPointerException` 예외가 발생한다.

## Runnable 인터페이스

Thread 클래스는 Runnable 인터페이스를 구현하고 있다.
Runnable이라는 인터페이스 자체는 다음과 같다.

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
만약 Runnable 인터페이스가 없다면 스레드를 생성하기 위해서는 무조건 extends Thread를 해야 한다.
그렇게 되면 다른 상속을 받을 수가 없다.

그래서 Thread라는 실제 실행 주체인 클래스와 실행 작업을 Runnable이라는 인터페이스로 구분하여 둔 것이다.

```java
public Thread(Runnable task) {...}
```

자바는 내부적으로 Runnable 타입의 인자를 받는 Thread 생성자를 가진다. 그렇기 때문에 Runnable 구현 객체를 생성한 후에 스레드에 해당 객체를 넘겨서 start()만 해주면 멀티스레드로 동작시킬 수 있다.

## run()과 start()의 차이

여기서 착각하기 쉬운 것이 Runnable.run()과 Thread.start()를 동일하게 인식하는 것인데 둘은 엄연히 다른 동작을 한다.

Runnable.run()함수를 오버라이딩하여 바로 사용하는 것은 새로운 스레드를 생성하는 것이 아니라 현재 스레드의 플로우 내에서 실행되는 것이다.
Thread.start()를 사용해야지만 새로운 스레드가 생성되고 새로운 스레드 안에서 run()함수를 실행해서 작업이 나뉘어 동시성을 가진다.

<!-- 수정 중 -->

## Race Condition

스레드로 작업을 병렬처리하게 되면 필시적으로 경쟁 상태가 생긴다. JVM에서는 스레드가 생성되면 스레드 고유의 스택이 메모리에 생성된다. 힙 영역과 메서드 영역은 공유된다.

그렇기 때문에 서로 다른 스레드가 함께 사용하는 공유 객체에 대해서 경쟁 상태가 발생할 수 있다.
공유 객체에 대해 스레드가 점유하기 위해서는 synchronized 키워드를 사용해야 한다.

```java
synchronized(Share s) { ... }
```

synchronized 키워드는 동기화 시키는 키워드로써 사용하면 공유 자원에 락을 걸 수 있다.

여러 스레드에 동시에 breakdown을 걸 수 없기 때문에 디버깅도 어려움이 있다.

그렇기 때문에 스레드를 안전하게 사용하기 위해서는 상태를 변경하는 코드를 넣으면 안되고, 지역 변수와 동작만 하는 코드를 넣어야 한다.

락을 걸게 되면 성능이 떨어진다.

### 스레드 상태

new
runnable
일시 정지: IO작업이 발생했을 때
IO작업이 완료되면 인터럽트가 발생해서 대기상태로 들어감

terminated 상태:

### 스레드 상태

sleep(long millis)
join()
wait()

interrupt()
notify()
nofityAll()

yield()

yield()
sleep()

### 스레드 풀

스레드를 생성하는 작업은 오버헤드가 큰 작업이다. 그렇기 때문에 애플리케이션을 시작할 때 일정 수의 스레드를 생성해두고 대기하다가 필요할 때 작업을 배정하는 방식이다. 스레드는 애플리케이션 시작/종료 시점에 한번씩 생성/종료된다.
