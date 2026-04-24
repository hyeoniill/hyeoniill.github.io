---
layout: post
title: " 예외처리"
categories: [백엔드, 자바]
tags: [예외처리, 에러, Exceiption, Error]
date: 2026-04-22 09:00:00 +0900
last_modified_at: 2026-04-22
---

## 예외와 에러

- 예외: 복구가 가능한 에러, 주로 소프트웨어적 에러
  - Exception: 컴파일러가 예외 처리 코드 여부를 검사하는 예외
  - Runtime Exception: 컴파일러에서 검사하지 않는 예외
- 에러: 복구가 불가능한 에러, 주로 하드웨어적 에러

## 예외 처리

예외가 발생했을 경우, 비정상 종료를 막고 정상 실행을 유지할 수 있도록 처리해야 한다.  
try-catch-finally 블록으로 구성한다.  

```java
try {
    int result = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("처리할 예외: " + e.getMessage());
} finally {
    System.out.println("성공·실패와 관계없이 항상 실행되는 finally");
}
```

자바에서는 예외가 발생하면 Call Stack이 차례대로 출력된다.

try-with-resources
try()문 괄호 안에 파일은 선언하면 리소스를 자동으로 닫을 수 있다.
파일을 읽고, 쓰고, 닫을 때 각각 예외가 발생할 수 있다. 그럴 때마다 try-catch로만 사용하면 코드가 복잡해진다. 그렇기 때문에 try-with-resources 문법을 사용한다.

```java
try (BufferedReader reader = Files.newBufferedReader(Paths.get("input.txt"))) {
    String line = reader.readLine();
    System.out.println(line);
} catch (IOException e) {
    System.err.println("파일 읽기 실패: " + e.getMessage());
}
// try 블록을 벗어날 때 reader.close()가 자동 호출됨
```

자동으로 닫을 수 있는 리소스는 AutoCloseable 인터페이스를 가진 객체만 가능하다.

### 예외 던지기 [throw]

메서드에서 throws를 통해서 예외 처리의 책임을 상위 메서드에 전가할 수 있다.

```java
// 호출한 쪽에서 IOException을 처리하거나 다시 throws 해야 함
public void ensurePath(String path) throws IOException {
    if (path == null || path.isBlank()) {
        throw new IOException("유효한 경로가 아닙니다");
    }
}

public void caller() {
    try {
        ensurePath("");
    } catch (IOException e) {
        System.out.println("상위에서 처리: " + e.getMessage());
    }
}
```

런타임 예외의 경우에는 컴파일 타임에 예외 처리 여부를 체크하지 않기 때문에 실행 과정에서 예외 발생 시, 호출 스택을 따라서 위로 전파된다. 이 때, 최상위 메서드까지 해당 에러를 처리하지 않을 경우, 프로그램이 비정상 종료된다.

```java
public class RuntimePropagation {
    static void methodC() {
        throw new RuntimeException("런타임 예외 발생");
    }

    static void methodB() {
        methodC(); // 여기서도 try-catch 없이 전파
    }

    static void methodA() {
        methodB();
    }

    public static void main(String[] args) {
        methodA(); // 최종까지 미처리 시 스택 트레이스 출력 후 비정상 종료
    }
}
```
