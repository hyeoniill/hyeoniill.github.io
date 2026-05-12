---
layout: post
title: "입출력 스트림"
categories: [백엔드, 자바]
tags: [자바, 객체지향, 스트림, stream, IOStream, 입출력]
date: 2026-04-29 11:00:00 +0900
last_modified_at: 2025-04-23
---

프로그램을 기준으로 데이터가 들어오는 것을 `입력`, 데이터를 내보내는 것을 `출력`이라고 한다.
스트림의 의미에 맞게 FIFO방식으로 순차적으로 처리되며 단방향이다.

## 데이터의 종류

바이트 스트림: 이진 데이터, 바이트 단위로 데이터를 내보내는 것
문자 스트림: 문자만 입출력할 때 사용

| 구분          | 바이트 입력 스트림 | 바이트 출력 스트림 | 문자 입력 스트림 | 문자 출력 스트림 |
| ------------- | ------------------ | ------------------ | ---------------- | ---------------- |
| 최상위 클래스 | InputStream        | OutputStream       | Reader           | Writer           |
| 하위 클래스   | XXXInputStream     | XXXOutputStream    | XXXReader        | XXXWriter        |

최상위 클래스는 추상 클래스이므로 객체를 생성하는 것이 불가능하다.
그렇기 때문에 모든 입출력 작업은 실제로는 하위 클래스가 하게 된다.

IO작업은 CPU보다 느리기 때문에 성능 향상을 위해서는 사용 횟수를 줄여야 한다.
그래서 IO작업이 발생할 때마다 처리하지 않고, 버퍼를 사용하여 사용 횟수를 줄일 수 있다.

InputStream.read()·Reader.read()는 각각 **바이트·문자 단위로 읽되**, 스트림 끝(EOF)을 나타내기 위해 반환 타입은 둘 다 **int**이다. (0~255 또는 유니코드 코드 유닛, EOF일 때 -1)

## OutputStream

바이트 출력 스트림의 최상위 추상 클래스이다.

| 리턴 타입 | 메서드                            | 설명                                  |
| --------- | --------------------------------- | ------------------------------------- |
| void      | write(int b)                      | 1byte 출력                            |
| void      | write(byte[] b)                   | b의 모든 바이트 출력                  |
| void      | write(byte[] b, int off, int len) | b[off]부터 len개 바이트 출력          |
| void      | flush()                           | 출력 버퍼에 잔류하는 모든 바이트 출력 |
| void      | close()                           | 출력 스트림을 닫고, 메모리 해제       |

버퍼가 비워지는(데이터가 나가는) 순간은 버퍼에 데이터가 가득 찼을 때이다.
만약 버퍼의 크기보다 작은 데이터를 내보내야 한다면 flush()를 통해서 버퍼를 비워줄 수 있다.

```java
public class WriteExample {
    public static void main(String[] args) {
        try (OutputStream os = new FileOutputStream("C:/temp/test1.db")) {
            byte a = 10;
            byte b = 20;
            byte c = 30;
            os.write(a);
            os.write(b);
            os.write(c);
            os.flush();
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

## 입력 스트림 [InputStream]

입력 스트림으로 사용되는 리소스는 대표적으로 다음과 같은 것들이 있다.

| 리소스   | 입력 스트림     |
| -------- | --------------- |
| 키보드   | InputStream     |
| 파일     | FileInputStream |
| 소켓     | InputStream     |
| 프로세스 | InputStream     |

InputStream 클래스 자체는 추상 클래스이기 때문에 new 키워드를 사용하여 객체를 생성할 수는 없다.

| 리턴 타입 | 메서드         | 설명                               |
| --------- | -------------- | ---------------------------------- |
| int       | read()         | 1byte를 읽은 후 읽은 바이트를 리턴 |
| int       | read(byte[] b) | 읽은 바이트 **수** 리턴            |
| void      | close()        | 입력 스트림을 닫고 메모리 해제     |

read()는 기본적으로 무한 루프를 돌면서 데이터를 읽는다.
리턴 값이 -1일 경우, 데이터가 없는 것으로 판단하고 종료한다.

```java
InputStream is = System.in;
try {
    int readValue;
    while ((readValue = is.read()) != -1) {
        System.out.println(readValue);
        System.out.println((char) readValue);
    }
} catch (IOException e) {
    throw new RuntimeException(e);
}
```

read()를 통해서 1 바이트씩 읽게 될 경우, 오버헤드가 굉장히 크다. IO작업에서 리소스와 접촉하는 작업이 가장 오래 걸리기 때문이다.

이 때, read(byte[] b), read(byte[] b, int off, int len)를 사용하면 배열로 리소스를 읽을 수 있다.

read(byte[] b)는 바이트를 배열로 계속해서 읽다가 읽은 바이트의 수가 짧아지면 끝난 것으로 판단한다.

```java
String fileName = "./test.txt";
try (FileInputStream fis = new FileInputStream(fileName)) {
    int readCnt;
    byte[] arr = new byte[10];
    while ((readCnt = fis.read(arr, 0, arr.length)) != -1) {
        for (int i = 0; i < readCnt; i++) {
            System.out.print(arr[i]);
        }
    }
} catch (IOException e) {
    throw new RuntimeException(e);
}
```

파일의 경우 바이트 단위로 읽게 되면 한글이 깨지는 등의 여러 문제가 발생할 수 있다.
그렇기 때문에 InputStream 대신 Reader를 사용해야 한다.

```java
String fileName = "./test.txt";
    int readCnt;
    try(FileReader fr = new FileReader(fileName)) {         //try-with-resource로 변환
        char[] arr = new char[10];
        while((readCnt = fr.read(arr, 0, arr.length)) != -1) {
            for (int i=0; i<readCnt; i++) {     // 읽어온 문자열의 갯수 만큼만 출력하기 위해
                System.out.print(arr[i]);
            }
        }
    } catch(FileNotFoundException e) {
        throw new RuntimeException(e);
    } catch(IOException e) {
        throw new RuntimeException(e);
    }
```

바이트 단위의 InputStream이 문자열 단위의 Reader보다 성능은 훨씬 빠르다.
그러나 문자열로 저장된 데이터의 경우에는 문자열 스트림인 Reader를 사용하는 것이 더 좋다.

어플리케이션이 종료될 때, close()를 호출해서 자원을 해제해준다.

그 전에는 자원에 lock이 걸려있어서 다른 스레드에서 접근이 불가능하기 때문에 열려있는 시간을 최대한 짧게 가져가기 위해서 close()를 해주는 것이 좋다.

## 문자 입출력 스트림

## Writer

![writer클래스](/assets/img/post_image/2026-05-06/writer.png)

writer클래스는 다음의 메서드를 포함한다.

| 리턴 타입 | 메서드       | 설명 |
| --------- | ------------ | ---- |
| void      | write(int c) |

처리한 데이터 사이즈만큼 포인터가 자동으로 이동한다.

Random Access도 가능하다.

## Reader

![Reader클래스](/assets/img/post_image/2026-05-06/reader.png)

| 리턴 타입 | 메서드                              | 설명                            |
| --------- | ----------------------------------- | ------------------------------- |
| int       | read()                              | 한 문자(코드 유닛) 또는 EOF(-1) |
| int       | read(char[] cbuf, int off, int len) | 버퍼에 읽은 문자 수 또는 EOF    |

읽는 작업을 할 때는 라인 별로 한 줄씩 읽는 것이 좋다.
그러나 Reader클래스 자체에는 라인을 읽는 메서드가 없다.
그래서 보조 스트림으로 확장하여 사용한다.

## 보조 스트림

보조 스트림은 단독으로 생성할 수 없다.
반드시 기존의 스트림이 존재해야 한다.
기존 스트림이 보조 스트림의 생성자 매개변수로 전달 되고, Wrapping되어 사용할 수 있다.

Decorator 패턴으로 전/후처리나 추가적인 작업이 수행 가능하다.

![스트림 체인 구성](/assets/img/post_image/2026-05-06/stream_chain.png)

```java
// 입력 스트림
InputStream is = new FileInputStream("...");
// 보조 스트림: 입력 스트림을 매개변수로 전달
InputStreamReader reader = new InputStreamReader(is);
BufferedReader br = new BufferedReader(reader);
```

### 문자 변환 스트림

네트워크 프로그래밍에서 소켓으로 통신할 때, 주로 사용한다.
소켓으로 데이터를 주고 받을 때는 byte단위로 주고 받기 때문이다.
HTTP 프로토콜을 사용하는 경우에는 주로 문자열로 데이터를 주고 받아도 무방한 편이다.

![문자 변환 스트림](/assets/img/post_image/2026-05-06/byte_to_string.png)

### 성능 향상 스트림

메모리 버퍼를 사용하여 성능을 향상 시키는 보조 스트림이다.

![버퍼 스트림](/assets/img/post_image/2026-05-06/buffered_stream.png)

다음은 버퍼 스트림을 사용하여 1 바이트를 읽고, 출력하는 예시이다.

```java
public static long copy(InputStream is, OutputStream os) throws Exception {
//시작 시간 저장
long start = System.nanoTime();
//1 바이트를 읽고 1 바이트를 출력
while(true) {
int data = is.read();
if(data == -1) break;
os.write(data);
}
os.flush();
//끝 시간 저장
long end = System.nanoTime();
//복사 시간 리턴
return (end-start);
}
```

```java
try (BufferedReader br = new BufferedReader(new FileReader("..."))) {
    String str;
    while ((str = br.readLine()) != null) {
        // 처리
    }
} catch (IOException e) {
    throw new RuntimeException(e);
}
```

```java
InputStream is = System.in;
    OutputStream os = System.out;
    try(BufferedReader br = new BufferedReader(new InputStreamReader(is));
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(os))) {
        String line;
        while(!(line = br.readLine()).equals("quit")) {
            bw.write(line);
            bw.newLine();
            bw.flush();
        }
    } catch (IOException e) {
        throw new RuntimeException(e);
    }
```

## 기본 타입 스트림

모든 데이터는 바이트 단위로 처리가 가능하지만 primitive 타입에 대해서는 데이터 크기가 고정되어 있기 때문에 바로 사용할 수 있도록 할 수 있다.

byte타입으로 읽지 않고 primitive 타입을 사용하는 이유는 구조를 아는 사람만 데이터를 읽을 수 있도록 하기 위함이다.
구조를 아는 사람이 순서대로 입력해야지만 올바르게 읽을 수 있다.

![기본 타입 스트림](/assets/img/post_image/2026-05-06/primitive_stream.png)

| 타입    | DataInputStream | 읽기 메서드   | DataOutputStream | 쓰기 메서드             |
| ------- | --------------- | ------------- | ---------------- | ----------------------- |
| boolean | boolean         | readBoolean() | void             | writeBoolean(boolean v) |
| byte    | byte            | readByte()    | void             | writeByte(int v)        |
| char    | char            | readChar()    | void             | writeChar(int v)        |
| double  | double          | readDouble()  | void             | writeDouble(double v)   |
| float   | float           | readFloat()   | void             | writeFloat(float v)     |
| int     | int             | readInt()     | void             | writeInt(int v)         |
| long    | long            | readLong()    | void             | writeLong(long v)       |
| short   | short           | readShort()   | void             | writeShort(int v)       |
| String  | String          | readUTF()     | void             | writeUTF(String str)    |

```java
public class DataInputOutputStreamExample {
    public static void main(String[] args) throws Exception {
    //DataOutputStream 생성
    FileOutputStream fos = new FileOutputStream("C:/Temp/primitive.db");
    DataOutputStream dos = new DataOutputStream(fos);
    //기본 타입 출력
    dos.writeUTF("홍길동");
    dos.writeDouble(95.5);
    dos.writeInt(1);

    dos.writeUTF("감자바");
    dos.writeDouble(90.3);
    dos.writeInt(2);

    dos.flush(); dos.close(); fos.close();
    }
}
```

## 객체 스트림 - 직렬화

각 언어마다 복합 데이터를 처리하는 방법이 있다. 파이썬은 피클, 자바 스크립트는 json, 자바는 객체 스트림을 사용한다.

직렬화: 메모리에 생성된 객체를 파일/네트워크로 출력하기 위해 필드 값을 일렬로 늘어선 바이트로 변경하는 것
역직렬화: 직렬화된 바이트를 객체의 필드 값으로 복원하는 것

요즘에는 json이 직렬화의 표준이 되어 있기 때문에 중요도는 떨어졌지만 내부적으로는 여전히 중요하게 쓰이고 있다.

![객체 스트림](/assets/img/post_image/2026-05-06/serialization.png)

```java
// 직렬화
oos.writeObject(m);

// 역직렬화
Member m = (Member) ois.readObject();
```

wirteObject()를 사용하게 되면 객체 데이터를 직렬화하여 저장한다.
처음에는 객체에 대한 메타 데이터 정보가 저장된다.
그리고 그 이후에 순차적으로 필드 값이 저장된다.

직렬화를 하기 위해서는 Serializable 인터페이스를 구현해야 한다.
writeObject()를 사용하는 객체는 java.io.Serializable 인터페이스를 구현하지 않으면 NotSerializableException이 발생한다.

```java
try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("./a.ser"))){
        oos.writeObject(new Date());
    } catch (Exception e) {
        throw new RuntimeException(e);
    }
```

```console
�� sr java.util.Datehj�KYt  xpw  �����x
```

readObject()에서는 역직렬화를 거치게 되는데 데이터의 메타데이터를 읽고, 필드 값을 순차적으로 복원하여 저장한다.

```java
try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("./a.ser"))){
        Object obj = ois.readObject();
        System.out.println(obj);
    } catch (Exception e) {
        throw new RuntimeException(e);
    }
```

```console
Wed May 06 15:30:44 KST 2026
```

### Serializable 인터페이스

구현할 메서드는 존재하지 않지만, 객체를 직렬화할 수 있다고 표시하는 역할이다.

이러한 인터페이스를 `marker`라고 한다.

```java
public class Member implements Serializable {
    private String name;
    private int price;

    ...
}
```

### serialVersionUID 필드

객체의 필드가 업데이트 될 경우, 옛날 버전의 객체와 구분해서 읽어야 할 수도, 구분하지 않고 oldVersion을 newVersion으로 읽을 수 있도록 허락할건지 정해야 한다.

그럴 때 static final long serialVersionUID 필드를 사용하여 구분하게 된다.

클래스 자체는 동일한 클래스이어야 하며, 클래스의 내용이 다르더라도 두 클래스가 동일한 serialVersionUID를 갖는다면 역직렬화가 가능하다.

## FILE

```java
File file1 = new File("경로");

// dir 경로에 fileName이 있으면 그 파일을 가리키는 File (경로 조합)
File file2 = new File(dir, fileName);
```

## Files 클래스

파일의 입출력과 메타 데이터를 핸들링하기 위한 클래스이다.
동기 방식으로 처리된다.

비동기 방식은 nio 라이브러리에서 지원한다.
