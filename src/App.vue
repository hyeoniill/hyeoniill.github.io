<script setup>
// 최상위 레이아웃.
// - 모바일: 헤더 좌측 햄버거 버튼이 `MobileNav`(상단 드롭다운)를 여닫습니다.
// - 태블릿/데스크톱: `Sidebar`(고정 레일)가 상시 노출되고, MobileNav/햄버거는 CSS로 숨겨집니다.
import { computed } from "vue";
import { useRoute } from "vue-router";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import Sidebar from "./components/Sidebar.vue";
import MobileNav from "./components/MobileNav.vue";

const route = useRoute();
const isHomePage = computed(() => route.name === "home");
</script>

<template>
  <div class="app-shell">
    <!-- 데스크톱 전용 사이드바 레일. 모바일에서는 CSS로 display:none -->
    <Sidebar />

    <div class="content-column">
      <Header />

      <!-- 모바일 전용 상단 드롭다운. 헤더 바로 아래에 붙어 동작합니다. -->
      <MobileNav />

      <main class="main-content" :class="{ 'main-content--flush-top': isHomePage }">
        <div class="main-content-inner">
          <router-view />
        </div>
      </main>
      <Footer />
    </div>
  </div>
</template>
