import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

/**
 * GitHub Pages 프로젝트 사이트: `https://<user>.github.io/<repo>/`
 * 사용자 사이트(repo 이름이 `*.github.io`): 루트 `/`
 * 로컬 개발: `VITE_BASE_PATH` 미설정 시 `/`
 */
function appBase() {
  const raw = process.env.VITE_BASE_PATH;
  if (raw == null || raw === "" || raw === "/") return "/";
  const withLeading = raw.startsWith("/") ? raw : `/${raw}`;
  return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
}

// https://vite.dev/config/
export default defineConfig({
  base: appBase(),
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
