<script setup>
import { useHead } from "@unhead/vue";
import { computed } from "vue";
import { useRoute } from "vue-router";
import PostList from "@/components/home/PostList.vue";
import { formatCategoryQueryLabel } from "@/lib/posts";
import { absolutePageUrl, absoluteRouteUrl } from "@/lib/site";

const route = useRoute();

const DEFAULT_HOME_DESC =
  "백엔드, 프론트엔드, 알고리즘, 블록체인 등 기술 학습과 정리를 기록하는 Hyeoniill 블로그입니다.";

const pageTitle = computed(() => {
  const raw = route.query.category;
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (v != null && String(v).trim() !== "") {
    const label = formatCategoryQueryLabel(v) || String(v).trim();
    return `${label} · Hyeoniill 블로그`;
  }
  return "Hyeoniill 블로그";
});

useHead(() => ({
  title: pageTitle.value,
  meta: [
    { name: "description", content: DEFAULT_HOME_DESC },
    { property: "og:title", content: pageTitle.value },
    { property: "og:description", content: DEFAULT_HOME_DESC },
    { property: "og:url", content: absoluteRouteUrl(route.fullPath) },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: pageTitle.value },
    { name: "twitter:description", content: DEFAULT_HOME_DESC },
  ],
  link: [{ rel: "canonical", href: absolutePageUrl("/") }],
}));
</script>

<template>
  <div class="blog-page">
    <PostList />
  </div>
</template>
