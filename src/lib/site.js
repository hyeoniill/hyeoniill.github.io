/**
 * canonical / Open Graph 절대 URL 계산.
 * - 프로덕션: `VITE_SITE_ORIGIN`(선택) + Vite `BASE_URL`
 * - 로컬 개발: `window.location.origin` + `BASE_URL`
 */
const DEFAULT_SITE_ORIGIN = "https://hyeoniill.github.io";

export function getSiteOrigin() {
  const raw = import.meta.env.VITE_SITE_ORIGIN?.trim();
  if (raw) return raw.replace(/\/$/, "");
  if (import.meta.env.DEV && typeof window !== "undefined") {
    return window.location.origin;
  }
  return DEFAULT_SITE_ORIGIN;
}

/**
 * @param {string} pathname 앱 라우트 경로 (예: `/`, `/posts/java-thread`)
 */
export function absolutePageUrl(pathname) {
  const origin = getSiteOrigin();
  let base = import.meta.env.BASE_URL || "/";
  if (!base.startsWith("/")) base = `/${base}`;
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const baseTrim = base.replace(/\/$/, "");
  if (!baseTrim || baseTrim === "") {
    return `${origin}${path}`;
  }
  return `${origin}${baseTrim}${path}`;
}

/**
 * 이미 번들된 에셋 경로(`/assets/...`) 또는 절대 URL을 OG용 절대 URL로 만듭니다.
 * @param {string} href
 */
export function absoluteAssetUrl(href) {
  if (!href) return "";
  if (/^https?:\/\//i.test(href)) return href;
  const origin = getSiteOrigin();
  let base = import.meta.env.BASE_URL || "/";
  if (!base.startsWith("/")) base = `/${base}`;
  const baseTrim = base.replace(/\/$/, "");
  const path = href.startsWith("/") ? href : `/${href}`;
  if (!baseTrim || baseTrim === "") {
    return `${origin}${path}`;
  }
  return `${origin}${baseTrim}${path}`;
}

/**
 * `vue-router`의 `fullPath`(pathname + query + hash) 기준 절대 URL.
 * @param {string} fullPath
 */
export function absoluteRouteUrl(fullPath) {
  const origin = getSiteOrigin();
  let rawBase = import.meta.env.BASE_URL || "/";
  if (!rawBase.startsWith("/")) rawBase = `/${rawBase}`;
  const baseNorm = rawBase === "/" ? "" : rawBase.replace(/\/$/, "");
  const fp = fullPath.startsWith("/") ? fullPath : `/${fullPath}`;
  return `${origin}${baseNorm}${fp}`;
}
