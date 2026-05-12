결정되지 않은 타입을 파라미터로 처리할 때 사용한다.

```java
public class Box<T> {
    public T content;
}
```

제네릭 타입은 primitive 타입에 대해서는 사용할 수 없다. 반드시 wrapper 클래스로 사용해야 한다.

다만 boxing과 unboxing은 자동으로 된다.

## 제네릭 메서드

```java
public <T> Box<T> boxing(T t) {...}

Box<Integer> box1 = boxing(100);
Box<String> box2 = boxing("Hello");
```

## 제네릭 타입 제한

제네릭 타입에 대해서 Object의 메서드는 사용이 가능하다. Object는 모든 객체의 최상위 클래스이기 때문이다.

```java
public <T extends Number> boolean compare(T t1, T t2) {
    return t1 == t2;
}
```

## 컬렉션

기존 배열의 크키 조절이 불가능하다는 한계가 있다.
그래서 새로운 자료구조를 생성한 것이 컬렉션 프레임워크이다.

컬렉션 프레임워크의 중요 자료구조는 다음이 있다.

- List : 순서를 유지하고 저장, index 존재. 중복 저장 가능
- Set : 순서를 유지하지 않음, 중복 저장 안됨
- Map : 키와 값의 쌍으로 저장

또한 동기화 기능을 제공해준다.

## List 컬렉션

객체를 인덱스로 관리한다.
boolean add(E e) : E 타입 원소 추가
void add(int index, E element) :
set(int index, E element) : index 값 수정
boolean contains(Object o)

## Set 컬렉션

Set은 저장

```java
public class HashSet {

}
```

## Map 컬렉션

### Map 순회

```java
Set<String> keySet = map.keySet();
Iterator<String> keyIterator = keySet.iterator();

while(keyIterator.hasNext()) {
    ...
}
```

Iterator를 사용할 경우 타이핑 양이 많기 때문에 for문을 사용하는 것이 좋다.

```java
for(String key : map) {
    ...
}
```

## Iterator

컬렉션의 요소를 순회하는 객체를 Iterator라고 한다.

```java
Iterator<String> iterator = set.iterator();

while(iterator.hasNext()) {
    String element = iterator.next();
}
```

## 람다식

자바는 독립적인 함수의 개념이 없다.
모든 것은 클래스로부터 시작된다.
그래서 자바에서는 메서드를 하나만 가지는 인터페이스를 함수로 정의했다.

> @FunctionalInterFace
> 인터페이스가 함수형 인터페이스임을 보장한다.
> 컴파일 과정에서 추상 메서드가 2개 이상이라면 에러

```java

public interface Runnable {
    void run();
}
```

람다식으로 구현하면 타입 추론이 가능하다.

### 매개변수가 없는 람다식

### 매개변수가 있는 람다식

```java
(타입 매개변수, ...) -> {
    //구현
    //구현
}

(var 매개변수, ...) -> {    //var 키워드로 표현 가능
    //구현
    //구현
}

(매개변수, ...) -> {        // 타입 생략이 가능
    //구현
    //구현
}
```

매개변수가 하나라면 괄호도 생략할 수 있다.

```java

매개변수 -> {
    //구현
}
```

커멘드 패턴의 단점인 모든 명령을 클래스화 해야한다는 것도 람다식을 사용하면 해결할 수 있다.

## 메서드 참조

메서드의 인자 값이 함수 내에서 변환없이 그대로 사용된다면 다음과 같은 방식으로 표현할 수 있다.

```java
Math :: max;
```

이를 메서드 참조라고 한다.

### Static 메서드

클래스 :: 메서드

### 인스턴스 메서드

참조변수 :: 메서드

## 생성자 참조

```java
(a, b) -> { return new Class(a, b);}

->

Class :: new
```

생성자가 여러 개 선언되어 있을 경우, 인자에 따라서 부르는 생성자가 변한다.

## Command 패턴

```java

@FunctionalInterface
public interface Command {
    public void execute();
}
```

```java
public class ExitCommand implements Command {

    @Override
    public
}
```

이처럼 Command 인터페이스를 구현한 객체를 Concrete 커맨드라고 한다.

```java
public class Main {
    public static void main(String[] args) {
        Service service = new Service();

        Command[] commands = {
            service :: add;
            service :: print;
        }
    }
}
```

## 표준 API 함수형 인터페이스

| 종류 | 추상 메서드 | 매개 값 | 리턴 값 |
| --- | --- | :---: | :---: |
| Runnable | void run() | X | X |
| Consumer | void accept(T t) | O | X |
| Supplier | R get() | X | O |
| Predicate | boolean test(T t) | O | boolean |
| Function | R apply(T t, U u) | O | O |
| Operator | T apply(T t1, T t2) | O | O |

매개변수와 리턴이 다르면 Function
매개변수와 리턴이 같으면 Operator이다.

그 외에 인자가 3이상은 사용자가 정의해야 한다.

