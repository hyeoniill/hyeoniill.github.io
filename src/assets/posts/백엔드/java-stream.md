---
layout: post
title: "스트림 처리"
categories: [백엔드, 자바]
tags: [자바, 객체지향, 스트림, stream]
date: 2026-04-29 11:00:00 +0900
last_modified_at: 2025-04-23
---

컬렉션 및 배열의 요소를 반복 처리하기 위해서 스트림을 사용한다.

```java
Stream<String> stream = list.stream();
stream.forEach(item -> 처리 );
```

## 스트림 vs Iterator

스트림은 내부 반복자이므로 처리 속도가 빠르고, 스레드를 사용하기 때문에 병렬 처리에 효율적이다.
람다식으로 처리할 수 있다.
**파이프 라인**을 형성할 수 있다.

```java
Stream<String> stream = set.stream();
stream.forEach( name -> System.out.println(name)); //System.out :: println 표현도 가능
```

병렬처리를 하기 위해서는 `parallelStream`을 사용할 수 있다.

```java
Stream<String> stream = list.parallelStream();
stream.forEach(System.out::println);
```

## 스트림 파이프라인

스트림도 Iterator와 동일하게 한 번만 동작할 수 있다.

대신 작업을 이어 붙히는 파이프라인을 구성할 수 있다.

![파이프라인](/assets/img/post_image/2026-04-29/image.png)

중간 처리 작업은 몇 개를 실행하더라도 저장하지 않는다. 최종 처리에서 한번만 처리된다.

## 최종 처리

stream.forEach()를 통해서 최종 처리가 된다.
최종 처리가 될 때, 데이터가 흐르고 중간에서는 등록만 된다.

## 중간 처리

### 필터링

스트림의 데이터에서 요소를 걸러내는 작업

<필터링 사진>

| 메서드 | 설명 |
| --- | --- |
| `distinct()` | 중복 제거 |
| `filter(Predicate<T>)` | 조건 필터링 |

takeWhile()은 조건이 참인 동안만 요소를 유지하고, 조건이 꺠지면 그 이후 연산을 진행하지 않고 즉시 중단한다.

### 매핑

스트림 요소를 다른 요소로 변환

<매핑 사진>

| 메서드 | 변환 |
| --- | --- |
| `map(Function<T, R>)` | T → R |
| `mapToInt(ToIntFunction<T>)` | T → int |

| 반환 타입 | 메서드 | 변환 |
| --- | --- | --- |
| `LongStream` | `asLongStream()` | int → long |
| `DoubleStream` | `asDoubleStream()` | int, long → double |
| `Stream` (래퍼) | `boxed()` | int → `Integer` 등 |

### 매핑(복수)

하나의 요소를 복수 개의 요소로 변환한 스트림을 리턴
2차원 스트림을 1차원으로 만들어준다.

| 반환 타입 | 메서드 | 변환 |
| --- | --- | --- |
| `Stream<R>` | `flatMap(Function<T, Stream<R>>)` | T → `Stream<R>` |

```java
List<String> list = new ArrayList<>(); //타입 추론
list.add("this is java");
list.add("I am a best developer");
list.stream()
    .flatMap(data -> Arrays.stream(data.split(" ")))
    .forEach(System.out::println);
```

```console
결과: 
this
is
java
I
am
a
best
developer
```

```java
List<String> list = Arrays.asList("10, 20, 30" , "40, 50");
list.stream()
.flatMapToInt(data -> {
    String[] strArr = data.split(",");
    int[] intArr = new int[strArr.length];
    for(int i=0; i<strArr.length; i++) {
        intArr[i] = Integer.parseInt(strArr[i].trim());
    }
    return Arrays.stream(intArr);
})
.forEach(System.out::println);
```

```console
결과: 
10
20
30
40
50
```

### 정렬

요소를 정렬하는 중간 처리 기능

| 반환 타입 | 메서드 | 설명 |
| --- | --- | --- |
| `Stream<T>` | `sorted()` | 요소의 기본(자연) 순서로 정렬 |
| `Stream<T>` | `sorted(Comparator<T>)` | Comparator 기준에 따라 정렬 |

primitive타입이거나 Comparable한 요소만 가능하다.
비교 기준이 없다면, 기준인 Comparator를 정의해야한다.

## 매칭

요소들이 특정 조건을 만족하는지 여부를 조사하는 최종 처리 기능

## 루핑

## Optional 클래스

null값이 반환되서 NullPointerException이 발생하지 않도록 처리해주는 클래스

| 반환 타입 | 메서드 | 설명 |
| --- | --- | --- |
| boolean | `isPresent()` | 값 존재 여부 |
| T | `orElse(T)` | 집계 값이 없을 경우 기본값 반환 |
| void | `ifPresent(Consumer)` | 값이 있을 때 Consumer에서 처리 |

## 요소 그룹핑

## IO 스트림

프로그램을 기준으로 데이터가 들어오는 것을 입력, 데이터를 내보내는 것을 출력이라고 한다.

단방향이다.

## 데이터의 종류

바이트 스트림: 이진 데이터, 바이트 단위로 데이터를 내보내는 것
문자 스트림: 문자만 입출력할 때 사용

| 구분 | 바이트 입력 스트림 | 바이트 출력 스트림 | 문자 입력 스트림 | 문자 출력 스트림 |
| --- | --- | --- | --- | --- |
| 최상위 클래스 | `InputStream` | `OutputStream` | `Reader` | `Writer` |
| 하위 클래스 | `XXXInputStream` | `XXXOutputStream` | `XXXReader` | `XXXWriter` |

최상위 클래스는 추상 클래스이므로 객체를 생성하는 것이 불가능하다.
그렇기 때문에 모든 입출력 작업은 실제로는 하위 클래스가 하게 된다.

IO작업은 CPU보다 느리기 때문에 성능 향상을 위해서는 사용 횟수를 줄여야 한다.
그래서 IO작업이 발생할 때마다 처리하지 않고, 버퍼를 사용하여 사용 횟수를 줄일 수 있다.

## OutputStream

바이트 출력 스트림의 최상위 추상 클래스이다.

리턴 타입 | 메서드 | 설명
void | write(int b) | 1byte 출력
void | write(byte[] b) | b의 모든 바이트 출력
void | write(byte[] b, int off, int len) | b[off]부터 len개 바이트 출력
void | flush() | 출력 버퍼에 잔류하는 모든 바이트 출력
void | close() | 출력 스트림을 닫고, 메모리 해제

버퍼가 비워지는(데이터가 나가는) 순간은 버퍼에 데이터가 가득 찼을 때이다.
만약 버퍼의 크기보다 작은 데이터를 내보내야 한다면 flush()를 통해서 버퍼를 비워줄 수 있다.

```java
public class WriteExample {
    public static void main(String[] args) {
        try {
            OutputStream os =
                //FileNotFound Exception
                new FileOutputStream("C:/temp/test1.db");
                byte a = 10;
                byte b = 20;
                byte c = 30;

                // 에러 발생 가능
                os.write(a);
                os.write(b);
                os.write(c);

                // 에러 발생 가능
                os.flush();
                os.close();
            } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

IO의 모든 작업에는 예외처리를 반드시 해주어야 한다.
파일에 접근할 때, 없다면 생성을 해주지만 디렉토리에 대해서는 경로가 존재하지 않으면 에러가 발생한다.
리눅스/맥OS에서는 파일에 대한 쓰기 권한이 있어야 한다.

IO에 관한 예외들을 IOException으로 한번에 처리할 수 있다.

## InputStream

int | read() | 1byte를 읽은 후 읽은 바이트를 리턴
int | read(byte[] b) | 읽은 바이트 **수** 리턴
void | close() | 입력 스트림을 닫고 메모리 해제

