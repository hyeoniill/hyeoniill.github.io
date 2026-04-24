---
layout: post
title: "노드 연결 - Sepolia 테스트넷"
categories: [블록체인]
tags: [블록체인, blockchain, Sepolia, 이더리움, testnet]
date: 2025-05-27 17:30:00 +0900
last_modified_at: 2025-07-23
---

## 실행 환경

- 가상머신: Oracle VirtualBox
- OS: ubuntu
- setting: 8192 RAM, 4CPU, 1TB SSD

> Infura API나 Etherscan을 사용하지 않고 자체 노드로 블록 데이터를 관리하고 싶어서 진행하게 되었다.
블록체인의 전체 데이터를 저장해야하기 때문에 충분한 저장공간을 제공해야한다.
> 

이더리움은 지분증명[PoS] 방식으로 변경하면서 두 개의 클라이언트 계층을 사용한다. 이더리움 네트워크와 상호작용을 할 수 있는 Execution Layer(실행 계층) 클라이언트 하나와 Consensus Layer(합의 계층) 클라이언트가 필요하다.

이번 실습에서는 `Geth` + `Prysm`을 사용하였다. 

| Layer | 역할 | 클라이언트 |
| --- | --- | --- |
| Execution Layer | 트랜잭션 처리, EVM 실행 | Geth, Nethermind, Besu |
| Consensus Layer | 블록 제안/투표, PoS 합의 | Prysm, Lighthouse, Teku |

## 서버 환경 구축

### 1. 필수 패키지 설치
    
```bash
    sudo apt update && sudo apt upgrade -y
    sudo apt install -y git curl wget build-essential unzip
    sudo apt install tmux -y    // 터미널 세션 관리 도구(터미널 분할 목적)
    sudo apt install golang -y  // golang설치
```
    
### 2. Geth 설치
    
```bash
    git clone https://github.com/ethereum/go-ethereum.git
    cd go-ethereum
    make geth      // geth 빌드
    sudo cp build/bin/geth /usr/local/bin/      // geth 실행 파일을 시스템 경로로 복사
    geth version      // 설치 확인
```
    
> git clone시 ssh 인증을 해야할 때
> 
    
### 3. JWT 파일 생성 (Geth ↔ Prysm 통신용)
    
```bash
    openssl rand -hex 32 | tr -d "\n" > ~/jwt.hex
```
    
이더리움에서는 PoS체제로 바뀌면서 두 개의 클라이언트 계층을 사용한다고 했다. 이 때 Execution Layer와 Consensus Layer가 서로 통신을 하기 위해서 인증 토큰으로 JWT를 사용한다.

**JWT**: Json Web Token, 암호화된 인증 토큰, 통신의 무결성과 보안성을 보장

**JSON-RPC**: Execution Layer가 제공하는 표준 HTTP API, 이더리움 노드와 외부 애플리케이션(지갑, DApp, FE)과 
    
### 4. Prysm 설치
    
```bash
    git clone https://github.com/prysmaticlabs/prysm.git
    cd prysm
    chmod +x prysm.sh
```
    
### 5. 터미널 분할
    
```bash
    tmux
    Ctrl + B 입력 -> %(가로 분할) or "(세로 분할)
```
    
Geth와 Prysm을 같이 실행하기 위해서 tmux로 터미널을 분할해준다.
    
![image.png](/assets/img/post_image/2025-05-27/image1.png)

### 6. Geth 실행 (Sepolia + AutoRPC 설정)
    
```bash
    geth --sepolia \
      --syncmode "snap" \
      --http \
      --ws \
      --http.api "eth,net,web3" \
      --ws.api "eth,net,web3" \
      --authrpc.jwtsecret=$HOME/jwt.hex \
      --authrpc.addr=localhost \
      --authrpc.port=8551
```
    
### 7. Prysm beacon-chain 실행 (Geth 연결)
    
```bash
    cd ~/prysm
    ./prysm.sh beacon-chain \
      --sepolia \
      --jwt-secret=$HOME/jwt.hex \
      --execution-endpoint=http://localhost:8551 \
      --checkpoint-sync-url=https://sepolia.checkpoint-sync.ethpandaops.io
```
    

우분투에서 두 노드를 동시에 실행시켜야 한다.

![image.png](/assets/img/post_image/2025-05-27/image2.png)

이제 Sepolia 테스트넷에 동기화가 되었고, 블록체인 데이터가 다운로드 될 때까지 기다리면 된다.

`geth`의 sync가 100% 되면 데이터가 동기화된 것이다. 

그리고 블록체인의 데이터는 `~/.ethereum/sepolia/geth/chaindata` 에 저장되고 있다. 그렇기 때문에 한번 동기화를 한 후에는 다시 해당 작업을 반복할 필요가 없다.

<br><br><br>

### 데이터 다운로드 진행상황 확인법

진행 상황은 Geth에 Synced로 확인할 수 있다. 다운로드가 얼마나 되었는지 확인하기 위해서는 다음을 입력하면 된다.

```bash
du -h ~/.ethereum/sepolia/geth/chaindata | tail -n 1
```

![image.png](/assets/img/post_image/2025-05-27/image3.png)

```bash
curl -s -X POST http://localhost:8545 -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_syncing","params":[],"id":1}' | jq
```

`currentBlock`은 현재까지 다운로드 된 체인의 마지막 블록이고, 

`highestBlock`은 네트워크의 마지막 블록이다. 

![image.png](/assets/img/post_image/2025-05-27/image4.png)
