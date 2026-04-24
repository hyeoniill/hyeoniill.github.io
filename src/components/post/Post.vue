<script setup>
import { useHead } from "@unhead/vue";
import { computed } from "vue";
import { marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js/lib/core";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import json from "highlight.js/lib/languages/json";
import bash from "highlight.js/lib/languages/bash";
import sql from "highlight.js/lib/languages/sql";
import { getPostBySlug, toPlainPreview } from "@/lib/posts";
import { resolveCategoryHeroBgUrl } from "@/lib/categoryHeroBg";
import { absoluteAssetUrl, absolutePageUrl } from "@/lib/site";
import PostHeader from "./PostHeader.vue";
import GiscusComments from "./GiscusComments.vue";
import PostAdjacentNav from "./PostAdjacentNav.vue";

const MARKED_CONFIG_KEY = "__hyeoniill_marked_highlight_configured__";

if (!globalThis[MARKED_CONFIG_KEY]) {
  hljs.registerLanguage("java", java);
  hljs.registerLanguage("javascript", javascript);
  hljs.registerLanguage("js", javascript);
  hljs.registerLanguage("typescript", typescript);
  hljs.registerLanguage("ts", typescript);
  hljs.registerLanguage("html", xml);
  hljs.registerLanguage("xml", xml);
  hljs.registerLanguage("css", css);
  hljs.registerLanguage("json", json);
  hljs.registerLanguage("bash", bash);
  hljs.registerLanguage("sh", bash);
  hljs.registerLanguage("shell", bash);
  hljs.registerLanguage("sql", sql);

  marked.use(
    markedHighlight({
      langPrefix: "hljs language-",
      emptyLangClass: "hljs",
      highlight(code, lang) {
        const normalized = String(lang || "").toLowerCase();
        if (normalized && hljs.getLanguage(normalized)) {
          return hljs.highlight(code, { language: normalized }).value;
        }
        return hljs.highlightAuto(code).value;
      },
    }),
  );

  globalThis[MARKED_CONFIG_KEY] = true;
}

const props = defineProps({
  slug: {
    type: String,
    required: true,
  },
});

const post = computed(() => getPostBySlug(props.slug));

const html = computed(() => {
  if (!post.value) return "";
  return marked.parse(post.value.content, { async: false });
});

function parsePostDate(value) {
  if (value == null || value === "") return null;
  const raw = String(value).trim();
  if (!raw) return null;

  // iOS Safari는 `YYYY-MM-DD HH:mm:ss +0900` 포맷 파싱을 실패할 수 있어
  // ISO 형태(`T`, `+09:00`)로 정규화한 뒤 다시 시도합니다.
  const normalized = raw
    .replace(/^(\d{4}-\d{2}-\d{2})\s+/, "$1T")
    .replace(/([+-]\d{2})(\d{2})$/, "$1:$2");

  const d = new Date(normalized);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

const metaLine = computed(() => {
  const p = post.value;
  if (!p) return "";
  const d = p.data.date ?? p.data.last_modified_at;
  const parsedDate = parsePostDate(d);
  const dateStr = parsedDate
    ? parsedDate.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";
  const cats = Array.isArray(p.data.categories)
    ? p.data.categories.join(" · ")
    : "";
  return [dateStr, cats].filter(Boolean).join(" · ");
});

const postHeroBgUrl = computed(() =>
  resolveCategoryHeroBgUrl(post.value?.data?.categories),
);

useHead(() => {
  const p = post.value;
  const titleStr = p ? p.title : "글을 찾을 수 없습니다";
  const docTitle = `${titleStr} · Hyeoniill 블로그`;
  const desc = p
    ? toPlainPreview(p.content, 155).trim() || p.title
    : "요청한 글을 찾을 수 없습니다.";
  const canonical = absolutePageUrl(`/posts/${props.slug}`);
  const hero = postHeroBgUrl.value;
  const ogImage = hero ? absoluteAssetUrl(hero) : "";

  const meta = [
    { name: "description", content: desc },
    { property: "og:title", content: titleStr },
    { property: "og:description", content: desc },
    { property: "og:url", content: canonical },
    { property: "og:type", content: p ? "article" : "website" },
    {
      name: "twitter:card",
      content: ogImage ? "summary_large_image" : "summary",
    },
    { name: "twitter:title", content: titleStr },
    { name: "twitter:description", content: desc },
  ];
  if (ogImage) {
    meta.push(
      { property: "og:image", content: ogImage },
      { name: "twitter:image", content: ogImage },
    );
  }

  return {
    title: docTitle,
    meta,
    link: [{ rel: "canonical", href: canonical }],
  };
});
</script>

<template>
  <article v-if="post" class="post-article prose">
    <PostHeader :title="post.title" :meta-line="metaLine" :hero-bg-url="postHeroBgUrl ?? ''" />
    <div class="post-body" v-html="html" />
    <footer class="post-footer">
      <ul v-if="Array.isArray(post.data.tags) && post.data.tags.length" class="post-tags">
        <li v-for="tag in post.data.tags" :key="tag">{{ tag }}</li>
      </ul>
      <PostAdjacentNav :slug="post.slug" />
      <GiscusComments :term="post.slug" />
    </footer>
  </article>
  <p v-else class="post-missing">이 글을 찾을 수 없습니다.</p>
</template>

<style scoped>
/* 포스트 하단 태그 영역 마진 조정 */
.post-footer {
  margin-top: clamp(10em, 3vw, 1.9rem);
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.post-tags li {
  font-size: 0.78rem;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--accent) 14%, transparent);
  color: color-mix(in srgb, var(--text) 88%, var(--accent));
  border: 1px solid color-mix(in srgb, var(--accent) 28%, transparent);
}

.post-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius);
}

.post-body :deep(table) {
  display: block;
  max-width: 100%;
  overflow-x: auto;
}

.post-missing {
  margin: 0;
  color: var(--text-muted);
}
</style>
