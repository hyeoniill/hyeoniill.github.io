<script setup>
// 포스트 카드 "그리드"만 담당하는 리스트 컴포넌트.
// - 카드 한 장의 내부 구조/스타일은 Preview.vue 가 소유합니다.
// - `?q=` 검색: 제목/태그/본문
// - `?category=` 내비와 동일 값 → frontmatter `categories` 와 `@/lib/navCategories` 매핑으로 필터
// - `?page=` 페이지네이션 (1-based). 한 페이지 = 그리드 **4줄** 분량(열 수는 컨테이너 폭에 따라 자동).
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { CATEGORY_QUERY_TO_LABELS } from "@/lib/navCategories";
import { getAllPosts, toPlainPreview } from "@/lib/posts";
import Preview from "@/components/Preview.vue";

/** `.post-cards` 의 `minmax(…rem, 1fr)` / `gap` 과 반드시 동일해야 열 수가 맞습니다. */
const GRID_MIN_COL_REM = 12;
const GRID_GAP_REM = 0.85;
const PAGE_ROWS = 4;

function remToPx(rem) {
  const rootFs = parseFloat(getComputedStyle(document.documentElement).fontSize);
  return rem * (Number.isFinite(rootFs) ? rootFs : 16);
}

/** `repeat(auto-fill, minmax(12rem, 1fr))` 에 대응하는 열 개수 */
function autoFillColumnCount(containerWidthPx) {
  const minTrack = remToPx(GRID_MIN_COL_REM);
  const gap = remToPx(GRID_GAP_REM);
  if (!Number.isFinite(containerWidthPx) || containerWidthPx <= 0) return 1;
  const n = Math.floor((containerWidthPx + gap) / (minTrack + gap));
  return Math.max(1, n);
}

const route = useRoute();
const router = useRouter();

const postListSectionEl = ref(null);
const gridColumnCount = ref(1);

function measureGridColumns() {
  const el = postListSectionEl.value;
  if (!el?.isConnected) return;
  gridColumnCount.value = autoFillColumnCount(el.clientWidth);
}

let resizeObserver = null;

onMounted(async () => {
  await nextTick();
  measureGridColumns();
  if (typeof ResizeObserver === "undefined") return;
  resizeObserver = new ResizeObserver(() => {
    requestAnimationFrame(() => measureGridColumns());
  });
  if (postListSectionEl.value) resizeObserver.observe(postListSectionEl.value);
});

onUnmounted(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
});

const searchQuery = computed(() => {
  const raw = route.query.q;
  const v = Array.isArray(raw) ? raw[0] : raw;
  return v ? String(v).trim().toLowerCase() : "";
});

const categoryQuery = computed(() => {
  const raw = route.query.category;
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (v == null || String(v).trim() === "") return "";
  return decodeURIComponent(String(v)).trim();
});

function postMatchesCategory(post, queryKey) {
  if (!queryKey) return true;
  const cats = Array.isArray(post.data?.categories)
    ? post.data.categories.map((c) => String(c).trim()).filter(Boolean)
    : [];
  if (!cats.length) return false;
  const labels = CATEGORY_QUERY_TO_LABELS[queryKey] ?? [queryKey];
  const lower = (s) => s.toLowerCase();
  return cats.some((c) =>
    labels.some((l) => lower(c) === lower(String(l).trim())),
  );
}

function postMatchesSearch(post, needle) {
  if (!needle) return true;
  const title = (post.title || "").toLowerCase();
  const tags = Array.isArray(post.data?.tags)
    ? post.data.tags.join(" ").toLowerCase()
    : "";
  const body = toPlainPreview(post.content, 2000).toLowerCase();
  return (
    title.includes(needle) || tags.includes(needle) || body.includes(needle)
  );
}

const posts = computed(() => {
  const all = getAllPosts();
  const cat = categoryQuery.value;
  const needle = searchQuery.value;
  return all.filter(
    (p) => postMatchesCategory(p, cat) && postMatchesSearch(p, needle),
  );
});

watch(
  () => posts.value.length,
  async () => {
    await nextTick();
    measureGridColumns();
  },
  { flush: "post" },
);

const pageSize = computed(() =>
  Math.max(1, gridColumnCount.value * PAGE_ROWS),
);

const totalPages = computed(() => {
  const n = posts.value.length;
  if (n === 0) return 0;
  return Math.ceil(n / pageSize.value);
});

const pageFromQuery = computed(() => {
  const raw = route.query.page;
  const v = Array.isArray(raw) ? raw[0] : raw;
  const n = parseInt(String(v ?? ""), 10);
  if (!Number.isFinite(n) || n < 1) return 1;
  return n;
});

const currentPage = computed(() => {
  const tp = totalPages.value;
  if (tp === 0) return 1;
  return Math.min(pageFromQuery.value, tp);
});

const pagedPosts = computed(() => {
  const list = posts.value;
  if (!list.length) return [];
  const ps = pageSize.value;
  const start = (currentPage.value - 1) * ps;
  return list.slice(start, start + ps);
});

const showPagination = computed(() => totalPages.value > 1);

function pageLink(targetPage) {
  const query = { ...route.query };
  if (targetPage <= 1) delete query.page;
  else query.page = String(targetPage);
  return { path: "/", query };
}

function queryRecordEqual(a, b) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of keys) {
    const va = a[k];
    const vb = b[k];
    const sa = va == null ? "" : String(Array.isArray(va) ? va[0] : va);
    const sb = vb == null ? "" : String(Array.isArray(vb) ? vb[0] : vb);
    if (sa !== sb) return false;
  }
  return true;
}

watch(
  () => [
    posts.value.length,
    pageSize.value,
    route.query.page,
    route.query.q,
    route.query.category,
  ],
  () => {
    const list = posts.value;
    const ps = pageSize.value;
    const tp = list.length ? Math.ceil(list.length / ps) : 0;
    const raw = route.query.page;
    if (raw == null || raw === "") return;
    const n = parseInt(String(Array.isArray(raw) ? raw[0] : raw), 10);
    const q = { ...route.query };
    let replace = false;
    if (!Number.isFinite(n) || n < 1) {
      delete q.page;
      replace = true;
    } else if (tp === 0) {
      delete q.page;
      replace = true;
    } else if (n > tp) {
      if (tp <= 1) delete q.page;
      else q.page = String(tp);
      replace = true;
    } else if (tp === 1) {
      delete q.page;
      replace = true;
    }
    if (!replace || route.path !== "/") return;
    if (queryRecordEqual(route.query, q)) return;
    nextTick(() => {
      if (route.path !== "/") return;
      router.replace({ path: "/", query: q }).catch(() => {});
    });
  },
  { flush: "post" },
);

const showEmptyMessage = computed(
  () => posts.value.length === 0 && (Boolean(searchQuery.value) || Boolean(categoryQuery.value)),
);
</script>

<template>
  <section ref="postListSectionEl" class="post-list" aria-label="게시글 목록">
    <p v-if="showEmptyMessage" class="post-list-empty">
      <template v-if="searchQuery">
        "<strong>{{ searchQuery }}</strong>"에 해당하는 글이 없습니다.
      </template>
      <template v-else>
        "<strong>{{ categoryQuery }}</strong>" 카테고리에 해당하는 글이 없습니다.
      </template>
    </p>
    <template v-else>
      <ul class="post-cards">
        <li v-for="p in pagedPosts" :key="p.slug">
          <Preview :post="p" />
        </li>
      </ul>
      <nav
        v-if="showPagination"
        class="post-list-pagination"
        aria-label="게시글 페이지"
      >
        <router-link
          v-if="currentPage > 1"
          class="pagination-link"
          rel="prev"
          :to="pageLink(currentPage - 1)"
        >
          이전
        </router-link>
        <span v-else class="pagination-link is-disabled" aria-disabled="true">이전</span>
        <span class="pagination-status">{{ currentPage }} / {{ totalPages }}</span>
        <router-link
          v-if="currentPage < totalPages"
          class="pagination-link"
          rel="next"
          :to="pageLink(currentPage + 1)"
        >
          다음
        </router-link>
        <span v-else class="pagination-link is-disabled" aria-disabled="true">다음</span>
      </nav>
    </template>
  </section>
</template>

<style scoped>
.post-list {
  /* 인트로 하단과 동일 톤으로 맞춰 틈·비침 제거 */
  background-color: var(--bg);
  /* 인트로와 카드 사이 여백 (예전 BlogIntro margin-bottom 역할) */
  padding-top: clamp(1.25rem, 4vw, 2rem);
}

/* 포스트 카드 그리드
 * - auto-fill + minmax 로 컨테이너 폭에 따라 1~N 열이 자동 결정.
 * - 카드 내부 레이아웃은 Preview.vue 에서 정의합니다.
 * - 같은 행의 카드 높이를 맞추기 위해 `<li>`를 100% 높이로 늘리고,
 *   Preview 루트가 그 높이를 이어받습니다. */
.post-cards {
  list-style: none;
  margin: clamp(1rem, 3vw, 1.75rem) 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(12rem, 1fr));
  gap: 0.85rem;
}

.post-cards > li {
  height: 100%;
}

.post-list-empty {
  margin: 1rem 0 0;
  padding: 1.25rem 0;
  color: var(--text-muted);
  font-size: 0.95rem;
  text-align: center;
}

.post-list-pagination {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.75rem 1rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
}

.pagination-link {
  font-size: 0.9rem;
  color: var(--accent);
  text-decoration: none;
}

.pagination-link:hover {
  text-decoration: underline;
}

.pagination-link.is-disabled {
  color: var(--text-muted);
  pointer-events: none;
  text-decoration: none;
}

.pagination-status {
  font-size: 0.85rem;
  color: var(--text-muted);
  min-width: 4.5rem;
  text-align: center;
}
</style>
