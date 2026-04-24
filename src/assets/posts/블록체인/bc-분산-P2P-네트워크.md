---
layout: post
title: "분산 P2P 네트워크"
categories: [블록체인]
tags: [블록체인, blockchain, 네트워크, P2P, 분산 P2P 네트워크]
date: 2025-03-31 21:00:00 +0900
last_modified_at: 2025-03-31
---

블록체인은 불변원장의 특성 덕분에 신뢰성을 얻을 수 있다.

그러나 블록의 해시 값을 전부 바꿔서 공격하는 것이 이론적으로 가능하며, 만약 충분한 가치가 있다면 블록과 그 이후의 모든 블록을 변경하는 수고를 들여서라도 공격할 수 있다.

혹은 시스템의 오류가 발생해서 체인의 중간에서 블록의 해시 값이 바뀌어 데이터 손실이 되는 경우도 있다.

이것을 해결하기 위해서 블록체인은 분산 P2P 네트워크를 통해서 신뢰성을 확보한다.

<br><br>

## 분산 P2P 네트워크란?

분산 P2P 네트워크에서는 모든 컴퓨터를 상호 연결 시킨다.

![image.png](/assets/img/post_image/2025-03-31/distributed_P2P_network/sc1.png)

---
<br>

네트워크 안에 있는 모든 컴퓨터는 블록체인을 복사하여 갖게 된다.  

블록체인의 모든 트랜잭션 정보는 네트워크에 연결된 모든 컴퓨터에 저장되며, 각 컴퓨터는 독립적으로 해당 정보에 접근할 수 있다.

![image.png](/assets/img/post_image/2025-03-31/distributed_P2P_network/sc3.png)

---
<br>

분산 P2P 네트워크에서는 모든 컴퓨터가 계속해서 동기화된다.

![image.png](/assets/img/post_image/2025-03-31/distributed_P2P_network/sc4.png)

---
<br>

블록체인에 새로운 트랜잭션이 추가 되면 서로 데이터를 주고 받으며 블록체인을 업데이트한다.

![image.png](/assets/img/post_image/2025-03-31/distributed_P2P_network/sc5.png)

---
<br>

만약 블록체인에 접근하여 데이터를 변경하게 되면 다른 피어들의 블록체인과 일치하지 않게 된다.

네트워크는 각 피어의 블록체인을 지속적으로 비교하며, 정보가 일치하지 않는 경우 해당 피어에 동기화 요청 또는 블록체인 교체 신호를 보낸다.

![image.png](/assets/img/post_image/2025-03-31/distributed_P2P_network/sc6.png)

---
<br>

 해킹 당한 블록체인은 다른 피어들이 동일한 정보의 블록체인을 보내게 되면 기존 값으로 복사하여 복구하게 된다.


![image.png](/assets/img/post_image/2025-03-31/distributed_P2P_network/sc7.png)

---
<br>


해킹이 가능하기 위해서는 네트워크에 있는 피어들의 모든 블록체인을 동시에 공격해서 값을 변경해야 한다. 이는 사실상 불가능하다.

블록 체인은 이렇게 신뢰할 수 없는 환경에서 신뢰를 쌓는다. 

각 피어는 다른 피어를 믿지 않지만 다수의 피어가 동의한 정보를 신뢰한다.

블록체인은 해시 암호화를 통해 1차적인 보안을 제공하고,
분산 P2P 네트워크와 합의 프로토콜을 통해 보다 강력한 보안과 신뢰 구조를 갖춘다.

<br>

 
> 탈중앙화 vs 분산 기사 [논리적, 정책적, 구조적 탈중앙화의 의미](https://medium.com/@VitalikButerin/the-meaning-of-decentralization-a0c92b76a274)