<script setup>
// 사이드바/모바일 드롭다운에서 공통으로 쓰는 메뉴 리스트.
// - 항목 정의(홈 + 고정 카테고리)는 이 한 곳에만 두어 변경 지점을 최소화합니다.
// - 렌더링은 전역 `.nav-block` 스타일을 재사용하므로 별도 스타일은 거의 없습니다.
import { computed } from "vue";
import { useRoute } from "vue-router";
import CategoryList from "@/components/CategoryList.vue";
import { SIDEBAR_CATEGORIES } from "@/lib/navCategories";

// 활성 상태 판별은 수동으로 계산합니다.
// router-link의 기본 `active-class`는 "경로(path)"만 비교하기 때문에,
// 카테고리 링크(`/?category=…`)와 홈(`/`)이 동시에 활성화되는 문제가 있습니다.
// → 홈/카테고리 모두 쿼리까지 확인해 배타적으로 하이라이트되도록 합니다.
const route = useRoute();

// 쿼리의 category를 안전하게 문자열로 변환. 없으면 빈 문자열.
const currentCategory = computed(() => {
  const q = route.query.category;
  const raw = Array.isArray(q) ? q[0] : q;
  if (!raw) return "";
  return decodeURIComponent(String(raw));
});

// 홈은 "/ 경로 + ?category= 없음"일 때만 활성.
const isHomeActive = computed(
  () => route.path === "/" && currentCategory.value === "",
);

</script>

<template>
  <div class="nav-menu">
    <!--
      주요 메뉴: 홈 단일 항목.
      `active-class` 대신 수동 `is-active` 바인딩을 사용합니다.
      (router-link 기본 active 매칭은 path만 비교해, 카테고리 링크와 동시 활성화되는 문제를 피하기 위함)
    -->
    <nav class="nav-block" aria-label="주요 메뉴">
      <router-link to="/" :class="{ 'is-active': isHomeActive }">홈</router-link>
    </nav>

    <!-- 다른 곳에서 쓸 때는 title·items만 바꿔 `<CategoryList />`에 넘기면 됩니다. -->
    <CategoryList title="카테고리" :items="SIDEBAR_CATEGORIES" />
  </div>
</template>

<style scoped>
/* 메뉴 전체 래퍼: 섹션 간 간격만 제공하고, 실제 링크 스타일은 전역 .nav-block이 담당 */
.nav-menu {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
</style>
