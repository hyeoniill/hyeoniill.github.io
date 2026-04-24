<script setup>
import { computed } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  metaLine: {
    type: String,
    default: "",
  },
  /** 카테고리별 배경(`resolveCategoryHeroBgUrl`) — 없으면 기본 헤더 */
  heroBgUrl: {
    type: String,
    default: "",
  },
});

const headerStyle = computed(() => {
  if (!props.heroBgUrl) return undefined;
  return {
    backgroundImage: `linear-gradient(
      180deg,
      color-mix(in srgb, var(--bg) 40%, transparent) 0%,
      color-mix(in srgb, var(--bg) 72%, transparent) 42%,
      color-mix(in srgb, var(--bg) 88%, transparent) 100%
    ), url(${props.heroBgUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
});
</script>

<template>
  <header
    class="post-header"
    :class="{ 'post-header--hero': !!heroBgUrl }"
    :style="headerStyle"
  >
    <h1 class="post-title">{{ title }}</h1>
    <p v-if="metaLine" class="post-meta">{{ metaLine }}</p>
  </header>
</template>

<style scoped>
.post-header {
  min-height: clamp(160px, 28vw, 240px);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 0.35rem;
  margin-bottom: 2rem;
  padding: clamp(1rem, 2.5vw, 1.5rem) 0 1.25rem;
  border-bottom: 1px solid var(--border);
}

/* 사이트 헤더 아래 ~ 본문 기둥 전폭(content-column)까지 배경이 이어지도록 */
.post-header.post-header--hero {
  width: 100cqi;
  max-width: none;
  margin-left: calc(50% - 50cqi);
  margin-right: calc(50% - 50cqi);
  margin-top: calc(-1 * var(--main-inner-pad-top));
  margin-bottom: 2rem;
  padding-top: calc(var(--main-inner-pad-top) + clamp(0.75rem, 2vw, 1.25rem));
  padding-bottom: clamp(1.25rem, 3vw, 1.75rem);
  padding-inline: var(--gutter);
  min-height: clamp(240px, 42vh, 520px);
  box-sizing: border-box;
}

.post-title {
  margin: 0;
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.25;
  color: var(--text);
}

.post-meta {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.post-header--hero .post-title {
  text-shadow:
    0 1px 2px color-mix(in srgb, var(--bg) 85%, #000),
    0 0 1.25rem color-mix(in srgb, var(--bg) 55%, transparent);
}

.post-header--hero .post-meta {
  color: color-mix(in srgb, var(--text-muted) 92%, var(--text));
  text-shadow: 0 1px 2px color-mix(in srgb, var(--bg) 80%, #000);
}
</style>
