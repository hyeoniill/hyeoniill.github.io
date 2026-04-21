<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  metaLine: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <header class="post-header">
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
</style>
