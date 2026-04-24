# Hyeoniill 블로그

## 프로젝트 구조

| 경로 | 역할 |
| ------ | ------ |
| **`.github/workflows/`** | GitHub Actions 워크플로(빌드·Pages 배포 등 CI/CD) |
| **`public/`** | 빌드 시 그대로 `dist/` 루트로 복사되는 정적 파일 |
| **`scripts/`** | npm 스크립트에서 쓰는 Node 유틸. 예: `spa-github-pages.mjs`는 빌드 후 `404.html`을 만들어 SPA 라우팅 폴백 제공 |

<br>

### `src/` — 애플리케이션 소스

| 경로 | 역할 |
| ------ | ------ |
| **`src/router/`** | `vue-router` 라우트 정의 |
| **`src/pages/`** | 라우트 단위 페이지 컴포넌트 |
| **`src/components/`** | 재사용 UI 컴포넌트 |
| **`src/lib/`** | 포스트 로딩·파싱, 카테고리·내비 설정 등 비즈니스 로직 |

<br>

### `src/assets/` — 에셋·콘텐츠

| 경로 | 역할 |
| ------ | ------ |
| **`src/assets/posts/`** | **실제 블로그 글** 마크다운 |
| **`src/assets/posting/`** | **현재 빌드 파이프라인에는 연결되지 않은** 마크다운 보관용 폴더 |
| **`src/assets/style/`** | 전역 CSS |
| **`src/assets/img/bg_image/`** | 카테고리 히어로 등 UI용 배경 이미지 |
| **`src/assets/img/post_image/`** | 글 본문에서 참조하는 이미지용 경로 |