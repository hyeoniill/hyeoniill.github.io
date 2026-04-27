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


