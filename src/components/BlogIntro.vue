<template>
  <section class="blog-intro" :style="{ backgroundImage: `url(${introBackground})` }">
    <div class="blog-intro__overlay"></div>
    <div class="blog-intro__content">
      <p class="blog-intro__label"></p>
      <h1 class="blog-intro__title"></h1>
      <p class="blog-intro__description">
      </p>
    </div>
  </section>
</template>

<script setup>
import introBackground from "@/assets/img/blog-intro.png";
</script>

<style scoped>
.blog-intro {
  position: relative;
  /* Header 와 동일: content-column 전폭 (Header.vue 에서 렌더) */
  width: 100%;
  margin: 0;
  min-height: clamp(320px, 48vh, 560px);
  border-radius: 0;
  overflow: hidden;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  /* margin 은 배경이 없어서 그 사이로 content-column 그라데이션이 비침 → 구분선처럼 보임 */
  margin-bottom: 0;
}

/* 하단 그라데이션 처리*/
.blog-intro::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  height: clamp(72px, 18vh, 160px);
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    color-mix(in srgb, var(--bg) 0%, transparent) 0%,
    color-mix(in srgb, var(--bg) 55%, transparent) 45%,
    var(--bg) 100%
  );
}

.blog-intro__overlay {
  position: absolute;
  inset: 0;
  z-index: 0; /* 하단 그라데이션 처리*/
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.65) 0%,
    rgba(0, 0, 0, 0.4) 45%,
    rgba(0, 0, 0, 0.2) 100%
  );
}

.blog-intro__content {
  position: relative;
  z-index: 2; /* 하단 그라데이션 처리*/
  width: 100%;
  max-width: var(--content-max);
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 8px;
  padding: 28px var(--gutter);
  color: #ffffff;
}

.blog-intro__label {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  opacity: 0.9;
}

.blog-intro__title {
  margin: 0;
  font-size: 32px;
  line-height: 1.2;
}

.blog-intro__description {
  margin: 0;
  max-width: 640px;
  opacity: 0.95;
}

@media (max-width: 768px) {
  .blog-intro {
    min-height: clamp(280px, 42vh, 440px);
  }

  .blog-intro__content {
    padding: 20px var(--gutter);
  }

  .blog-intro__title {
    font-size: 24px;
  }
}

</style>