import yaml from "js-yaml";

/** Rolldown/Vite 8에서는 `as: "raw"` 대신 `?raw`가 안전합니다. */
const rawModules = import.meta.glob("../assets/posts/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

/**
 * 포스트용 이미지는 `src/assets/img/post_image/**`에 두고,
 * 마크다운에서는 Jekyll 방식의 절대 경로(`/assets/img/post_image/...`)로 참조합니다.
 * 번들러가 해시가 포함된 URL로 바꿀 수 있도록 매핑을 만들어 둡니다.
 */
const imageModules = import.meta.glob(
  "../assets/img/post_image/**/*.{png,jpg,jpeg,gif,webp,svg,avif}",
  {
    eager: true,
    query: "?url",
    import: "default",
  },
);

const imageUrlMap = new Map();
for (const [filePath, url] of Object.entries(imageModules)) {
  // '../assets/img/post_image/2025-03-11/foo.png' -> '/assets/img/post_image/2025-03-11/foo.png'
  const key = filePath.replace(/^\.\.\/assets/, "/assets");
  imageUrlMap.set(key, url);
}

function postImageKeyFromSrc(src) {
  if (src.startsWith("/assets/")) return src;
  if (src.startsWith("../assets/")) return `/${src.replace(/^\.\.\//, "")}`;
  return null;
}

/**
 * HTML `<img src="/assets/...">` / `../assets/...` 를 번들 URL로 치환합니다.
 * (마크다운 이미지와 달리 raw HTML 은 기본 치환 대상이 아님)
 */
function rewriteHtmlImgSrcs(html) {
  return html.replace(/<img\b[^>]*>/gi, (tag) =>
    tag.replace(
      /\bsrc\s*=\s*(["'])([^"']+)\1/i,
      (m, quote, src) => {
        const key = postImageKeyFromSrc(src);
        if (!key) return m;
        const resolved = imageUrlMap.get(key);
        if (!resolved) return m;
        return `src=${quote}${resolved}${quote}`;
      },
    ),
  );
}

/**
 * 본문에서 `![alt](/assets/...)` 형태의 절대 경로를 Vite가 만든
 * 실제 에셋 URL로 바꾸고, kramdown 전용 속성 블록(`{: ... }`)은 제거합니다.
 */
function rewritePostContent(content) {
  const withResolvedImages = content.replace(
    /!\[([^\]]*)\]\(([^)\s]+)(\s+"[^"]*")?\)/g,
    (match, alt, href, title) => {
      const resolved = imageUrlMap.get(href);
      if (!resolved) return match;
      return `![${alt}](${resolved}${title ?? ""})`;
    },
  );
  const withHtmlImgs = rewriteHtmlImgSrcs(withResolvedImages);
  return withHtmlImgs.replace(/\s*\{:[^}]*\}/g, "");
}

function moduleString(mod) {
  if (typeof mod === "string") return mod;
  return mod?.default ?? "";
}

/**
 * Jekyll 스타일 YAML 프론트매터만 파싱합니다. (gray-matter 대체)
 */
function splitFrontmatter(raw) {
  const trimmed = raw.replace(/^\uFEFF/, "");
  if (!trimmed.startsWith("---")) {
    return { data: {}, content: trimmed };
  }
  const afterOpen = trimmed.slice(3).replace(/^\r?\n/, "");
  const close = afterOpen.search(/\r?\n---(\r?\n|$)/);
  if (close === -1) {
    return { data: {}, content: trimmed };
  }
  const fmBlock = afterOpen.slice(0, close);
  const body = afterOpen.slice(close).replace(/^\r?\n---\r?\n?/, "");
  let data = {};
  try {
    data = yaml.load(fmBlock, { schema: yaml.DEFAULT_SCHEMA }) || {};
  } catch {
    data = {};
  }
  return { data, content: body };
}

function pathToSlug(filePath) {
  const name = filePath.split("/").pop() || "";
  return name.replace(/\.md$/i, "");
}

function parseSortDate(data, slug) {
  const raw = data.date ?? data.last_modified_at ?? "";
  const fromMeta = new Date(raw).getTime();
  if (!Number.isNaN(fromMeta)) return fromMeta;
  const m = /^(\d{4}-\d{2}-\d{2})/.exec(slug);
  if (m) return new Date(m[1]).getTime();
  return 0;
}

function normalizePost(filePath, raw) {
  const slug = pathToSlug(filePath);
  const { data, content } = splitFrontmatter(raw);
  const title =
    typeof data.title === "string" && data.title.trim()
      ? data.title.trim()
      : slug;
  return {
    slug,
    title,
    data,
    content: rewritePostContent(content),
    sortTime: parseSortDate(data, slug),
  };
}

const allPosts = Object.entries(rawModules).map(([path, mod]) =>
  normalizePost(path, moduleString(mod)),
);

allPosts.sort((a, b) => b.sortTime - a.sortTime);

const bySlug = new Map(allPosts.map((p) => [p.slug, p]));

export function getAllPosts() {
  return allPosts;
}

export function getPostBySlug(slug) {
  if (!slug) return null;
  return bySlug.get(slug) ?? null;
}

/**
 * 마크다운/HTML 이 섞인 본문에서 카드 미리보기용 "평문"을 뽑아냅니다.
 * 코드 블록, HTML 태그, 이미지 마크다운, 링크 마크다운, kramdown 속성({: ...}) 등을
 * 순차적으로 제거·치환해 읽기 좋은 한 줄 텍스트를 만듭니다.
 */
export function toPlainPreview(content, maxLen = 160) {
  if (typeof content !== "string" || !content) return "";

  const plain = content
    // 펜스드 코드 블록 ```...``` 과 들여쓰기 코드 블록은 전부 제거
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/~~~[\s\S]*?~~~/g, " ")
    // HTML 주석, 스크립트/스타일 등 블록 제거
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    // 이미지 마크다운 `![alt](url)` 은 통째로 제거
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    // 링크 마크다운 `[text](url)` → `text` 만 남김
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    // 남은 HTML 태그는 제거
    .replace(/<[^>]+>/g, " ")
    // kramdown 속성 블록 `{: ... }` 제거
    .replace(/\{:[^}]*\}/g, " ")
    // 인라인 코드 `…` 는 백틱만 제거하고 내용 유지
    .replace(/`([^`]*)`/g, "$1")
    // 헤딩/블록 인용/리스트 기호, 강조 기호 등을 공백으로
    .replace(/^[ \t]*[#>*+-]+\s*/gm, " ")
    .replace(/[*_~]+/g, " ")
    // 연속 공백/개행 하나로
    .replace(/\s+/g, " ")
    .trim();

  if (plain.length <= maxLen) return plain;
  return `${plain.slice(0, maxLen)}…`;
}
