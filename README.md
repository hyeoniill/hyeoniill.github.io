# Hyeoniill 블로그

Vue 3 + Vite 정적 빌드입니다. [GitHub Pages](https://pages.github.com/)에 GitHub Actions로 배포할 수 있습니다.

## GitHub Pages 배포

1. GitHub 저장소 **Settings → Pages**에서 **Build and deployment**의 **Source**를 **GitHub Actions**로 선택합니다.
2. `main`(또는 `master`) 브랜치에 푸시하면 `.github/workflows/deploy-github-pages.yml`이 빌드 후 Pages에 올립니다.
3. 배포 URL
   - 일반 저장소(예: `github-blog`): `https://<사용자명>.github.io/github-blog/`
   - 사용자 사이트 저장소(이름이 `<사용자명>.github.io`인 경우): `https://<사용자명>.github.io/` (루트 경로)

워크플로가 저장소 이름에 맞춰 `VITE_BASE_PATH`를 넣어 주므로, **저장소 이름을 바꾼 뒤에는 다시 푸시**해 빌드하면 됩니다.

### 로컬에서 Pages용 빌드 미리보기

```bash
VITE_BASE_PATH=/저장소이름/ npm run build
npm run preview -- --base /저장소이름/
```

`preview`의 `--base`는 빌드에 쓴 값과 같게 맞춰야 합니다.