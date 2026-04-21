/**
 * GitHub Pages는 SPA 히스토리 모드용 폴백이 없어,
 * `index.html`을 `404.html`로 복사하면 임의 경로 새로고침 시에도 앱이 뜹니다.
 * @see https://github.com/orgs/community/discussions/36010
 */
import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const dist = join(process.cwd(), "dist");
const indexHtml = join(dist, "index.html");
const notFoundHtml = join(dist, "404.html");

if (!existsSync(indexHtml)) {
  console.error("spa-github-pages: dist/index.html 이 없습니다. 먼저 vite build 를 실행하세요.");
  process.exit(1);
}

copyFileSync(indexHtml, notFoundHtml);
console.log("spa-github-pages: dist/404.html 생성 완료 (SPA 폴백)");
