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

| 메서드               | 설명        |
| -------------------- | ----------- |
| distinct()           | 중복 제거   |
| filter(Predicate<T>) | 조건 필터링 |

takeWhile()은 조건이 참인 동안만 요소를 유지하고, 조건이 꺠지면 그 이후 연산을 진행하지 않고 즉시 중단한다.

### 매핑

스트림 요소를 다른 요소로 변환

<매핑 사진>

| 메서드                     | 변환    |
| -------------------------- | ------- |
| map(Function<T, R>)        | T → R   |
| mapToInt(ToIntFunction<T>) | T → int |

| 반환 타입     | 메서드           | 변환               |
| ------------- | ---------------- | ------------------ |
| LongStream    | asLongStream()   | int → long         |
| DoubleStream  | asDoubleStream() | int, long → double |
| Stream (래퍼) | boxed()          | int → Integer 등   |

### 매핑(복수)

하나의 요소를 복수 개의 요소로 변환한 스트림을 리턴
2차원 스트림을 1차원으로 만들어준다.

| 반환 타입 | 메서드                          | 변환          |
| --------- | ------------------------------- | ------------- |
| Stream<R> | flatMap(Function<T, Stream<R>>) | T → Stream<R> |

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

| 반환 타입 | 메서드                | 설명                          |
| --------- | --------------------- | ----------------------------- |
| Stream<T> | sorted()              | 요소의 기본(자연) 순서로 정렬 |
| Stream<T> | sorted(Comparator<T>) | Comparator 기준에 따라 정렬   |

primitive타입이거나 Comparable한 요소만 가능하다.
비교 기준이 없다면, 기준인 Comparator를 정의해야한다.

## 매칭

요소들이 특정 조건을 만족하는지 여부를 조사하는 최종 처리 기능

## 루핑

## Optional 클래스

null값이 반환되서 NullPointerException이 발생하지 않도록 처리해주는 클래스

| 반환 타입 | 메서드              | 설명                            |
| --------- | ------------------- | ------------------------------- |
| boolean   | isPresent()         | 값 존재 여부                    |
| T         | orElse(T)           | 집계 값이 없을 경우 기본값 반환 |
| void      | ifPresent(Consumer) | 값이 있을 때 Consumer에서 처리  |

## 요소 그룹핑
