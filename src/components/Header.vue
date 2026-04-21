<script setup>
// 헤더는 스티키로 상단에 붙어 있고, 모바일에서는 좌측 햄버거 버튼으로 드로어를 여닫습니다.
// 우측에는 게시글 검색창을 두고, 검색어는 `?q=` 쿼리로 동기화합니다.
// - 태블릿 이상: 검색창이 항상 노출됩니다.
// - 모바일: 기본은 돋보기 아이콘만 보이고, 아이콘을 누르면 헤더가 검색 모드로 바뀌어 입력창이 펼쳐집니다.
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import BlogIntro from "@/components/BlogIntro.vue";
import { getPostBySlug } from "@/lib/posts";
import { useDrawer } from "@/lib/drawer";

const { isOpen, toggle } = useDrawer();

const route = useRoute();
const router = useRouter();

const showBlogIntro = computed(() => route.name === "home");

/** 모바일 햄버거 옆: 홈 / 카테고리명 / 글 제목(짧게) */
const mobileContextLabel = computed(() => {
  if (route.name === "home") {
    const raw = route.query.category;
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (v == null || String(v).trim() === "") return "홈";
    try {
      return decodeURIComponent(String(v)).trim();
    } catch {
      return String(v).trim();
    }
  }
  if (route.name === "post") {
    const slug = route.params.slug;
    const key = Array.isArray(slug) ? slug[0] : slug;
    const post = typeof key === "string" ? getPostBySlug(key) : null;
    if (post?.title) {
      const t = post.title.trim();
      return t.length > 20 ? `${t.slice(0, 20)}…` : t;
    }
    return "글";
  }
  return "홈";
});

function readQuery(raw) {
  const v = Array.isArray(raw) ? raw[0] : raw;
  return v ? String(v) : "";
}

const q = ref(readQuery(route.query.q));
watch(
  () => route.query.q,
  (val) => {
    q.value = readQuery(val);
  },
);

// 모바일에서 검색창의 확장 여부. 기본은 닫힘(아이콘만 노출).
const isSearchOpen = ref(false);
const searchInputEl = ref(null);

async function openSearch() {
  isSearchOpen.value = true;
  // DOM 이 그려진 뒤 포커스. 모바일 키보드가 자연스럽게 올라옵니다.
  await nextTick();
  searchInputEl.value?.focus();
}

function closeSearch() {
  isSearchOpen.value = false;
}

// Esc 로 닫기
function onKeydown(event) {
  if (event.key === "Escape" && isSearchOpen.value) {
    closeSearch();
  }
}
onMounted(() => window.addEventListener("keydown", onKeydown));
onUnmounted(() => window.removeEventListener("keydown", onKeydown));

function onSubmit() {
  const trimmed = q.value.trim();
  const nextQuery = { ...route.query };
  if (trimmed) nextQuery.q = trimmed;
  else delete nextQuery.q;
  delete nextQuery.page;
  router.push({ path: "/", query: nextQuery });
  // 제출 후 모바일에서는 검색 오버레이를 닫아 줍니다.
  closeSearch();
}
</script>

<template>
  <header class="header" :class="{ 'is-search-open': isSearchOpen }">
    <div class="header-inner">
      <div class="header-left-cluster">
        <!-- 모바일 전용 햄버거 버튼. 태블릿 이상에서는 CSS(@media)에서 display:none -->
        <button
          type="button"
          class="menu-toggle"
          :aria-expanded="isOpen ? 'true' : 'false'"
          aria-controls="site-sidebar"
          aria-label="메뉴 열기"
          @click="toggle"
        >
          <!-- 상태에 따라 아이콘 전환 (열림: X, 닫힘: ≡) -->
          <svg v-if="!isOpen" viewBox="0 0 20 20" aria-hidden="true">
            <path
              d="M3 6h14M3 10h14M3 14h14"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            />
          </svg>
          <svg v-else viewBox="0 0 20 20" aria-hidden="true">
            <path
              d="M5 5l10 10M15 5L5 15"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            />
          </svg>
        </button>
        <span class="mobile-nav-context" aria-live="polite">{{
          mobileContextLabel
        }}</span>
      </div>

      <h1 class="site-title">
        <router-link to="/" class="site-title-link">@Hyeon<span>iill</span></router-link>
      </h1>

      <!-- 모바일 전용: 헤더에 돋보기 아이콘만 띄우고, 누르면 검색창을 펼칩니다.
           태블릿 이상에서는 CSS(@media)로 숨겨집니다. -->
      <button
        type="button"
        class="search-toggle"
        aria-label="검색창 열기"
        :aria-expanded="isSearchOpen ? 'true' : 'false'"
        aria-controls="header-search-form"
        @click="openSearch"
      >
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <circle
            cx="9"
            cy="9"
            r="5.25"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
          />
          <path
            d="M13 13l4 4"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
          />
        </svg>
      </button>

      <!-- 검색창 본체: 제출 시 `/?q=…` 로 이동해 PostList 가 필터링합니다.
           모바일에서는 `.header.is-search-open` 상태일 때만 노출됩니다. -->
      <form
        id="header-search-form"
        class="header-search"
        role="search"
        @submit.prevent="onSubmit"
      >
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <circle
            cx="9"
            cy="9"
            r="5.25"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
          />
          <path
            d="M13 13l4 4"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
          />
        </svg>
        <input
          ref="searchInputEl"
          v-model="q"
          type="search"
          placeholder="검색"
          aria-label="게시글 검색"
          enterkeyhint="search"
        />
        <!-- 모바일 검색 확장 상태에서만 노출되는 닫기 버튼 -->
        <button
          type="button"
          class="search-close"
          aria-label="검색창 닫기"
          @click="closeSearch"
        >
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path
              d="M5 5l10 10M15 5L5 15"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </form>
    </div>
  </header>
  <!-- 홈만: 본문 기둥(inner) 밖이라 헤더 바와 동일한 content-column 전폭 -->
  <BlogIntro v-if="showBlogIntro" />
</template>

<style scoped>
.header-left-cluster {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  min-width: 0;
  flex-shrink: 0;
}

.mobile-nav-context {
  display: none;
  font-size: 0.88rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: min(11rem, 38vw);
}

@media (max-width: 767.98px) {
  .mobile-nav-context {
    display: block;
  }

  .header.is-search-open .header-left-cluster {
    display: none;
  }
}

@media (min-width: 768px) {
  .header-left-cluster {
    display: contents;
  }

  .mobile-nav-context {
    display: none !important;
  }
}
</style>
