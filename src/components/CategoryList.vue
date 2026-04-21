<script setup>
// 사용처마다 `title`·`items`만 바꿔 주면 다른 목록을 그립니다.
// 예: <CategoryList title="Topics" :items="['A','B']" />
// 항목별로 라벨·쿼리를 다르게 쓰려면 `items`에 객체 배열을 넘깁니다.
import { computed } from "vue";
import { useRoute } from "vue-router";

const props = defineProps({
  title: {
    type: String,
    default: "Category",
  },
  /** 문자열이면 `/?category=<문자열>`, 객체면 `{ label, query }` 사용 */
  items: {
    type: Array,
    default: () => [],
  },
});

const route = useRoute();

const currentCategory = computed(() => {
  const q = route.query.category;
  const raw = Array.isArray(q) ? q[0] : q;
  if (!raw) return "";
  return decodeURIComponent(String(raw));
});

function normalizeItem(raw) {
  if (typeof raw === "string") {
    return { label: raw, query: raw };
  }
  if (raw && typeof raw === "object") {
    const label = raw.label ?? raw.name ?? "";
    const query = raw.query ?? raw.category ?? label;
    return { label, query };
  }
  return { label: "", query: "" };
}

function isActive(query) {
  return currentCategory.value === query;
}
</script>

<template>
  <section class="category-list" aria-label="카테고리 목록">
    <h2 class="category-list__title">{{ title }}</h2>
    <nav class="nav-block">
      <router-link
        v-for="raw in items"
        :key="normalizeItem(raw).query"
        :to="{ path: '/', query: { category: normalizeItem(raw).query } }"
        :class="{ 'is-active': isActive(normalizeItem(raw).query) }"
      >
        {{ normalizeItem(raw).label }}
      </router-link>
    </nav>
  </section>
</template>

<style scoped>
.category-list {
  align-self: stretch;
}

.category-list__title {
  margin: 0 0 0.5rem;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--text) 55%, var(--primary));
  text-align: left;
}
</style>
