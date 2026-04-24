<script setup>
import { useHead } from "@unhead/vue";
import { absolutePageUrl } from "@/lib/site";
import byeol23ShopImage from "@/assets/img/portfolio/byeol23_shop.png";
import kbGeojiEscapeImage from "@/assets/img/portfolio/kb-geoji-escape.png";

const PAGE_TITLE = "포트폴리오 · Hyeoniill 블로그";
const PAGE_DESC =
  "지금까지 진행한 프로젝트와 기술 스택, 주요 기여 내용을 한눈에 볼 수 있는 포트폴리오 페이지입니다.";
// 이미지 파일은 `src/assets/img/portfolio/`에 두고 import해서 imageSrc에 넣으세요.
const projects = [
  {
    name: "kb-geoji-escape",
    period: "팀 프로젝트 · 5일",
    summary:
      "스프린트 프로젝트, Vue.js 기반 가계부/지출 관리 서비스 기획·구현",
    highlights: [
      "날짜별 수입/지출 기록 및 상세 입력",
      "주간/월간/연간 요약 리포트",
      "지출 목표(챌린지) 관리",
    ],
    stack: ["Vue", "JavaScript", "HTML", "CSS"],
    href: "https://github.com/hyeoniill/kb-geoji-escape",
    imageSrc: kbGeojiEscapeImage,
    imageAlt: "kb-geoji-escape 프로젝트 대표 이미지",
  },
  {
    name: "Byeol23.shop",
    period: "팀 프로젝트 · 약 8주 (2025.10 - 2025.12)",
    summary:
      "Spring 기반 도서 쇼핑몰 프로젝트, MSA 구조, (리팩토링 예정)",
    highlights: [
      "Spring Cloud Gateway/Eureka 기반 아키텍처",
      "Elasticsearch, Redis, MySQL 활용",
      "GitHub Actions + SonarQube 기반 CI/CD 및 품질 관리",
    ],
    stack: [
      "Java",
      "Spring Boot",
      "Spring Cloud",
      "JPA",
      "MySQL",
      "Redis",
      "Elasticsearch",
    ],
    href: "https://github.com/nhnacademy-be11-Byeol23",
    imageSrc: byeol23ShopImage,
    imageAlt: "Byeol23.shop 프로젝트 대표 이미지",
  },
];

useHead({
  title: PAGE_TITLE,
  meta: [
    { name: "description", content: PAGE_DESC },
    { property: "og:title", content: PAGE_TITLE },
    { property: "og:description", content: PAGE_DESC },
    { property: "og:url", content: absolutePageUrl("/portfolio") },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: PAGE_TITLE },
    { name: "twitter:description", content: PAGE_DESC },
  ],
  link: [{ rel: "canonical", href: absolutePageUrl("/portfolio") }],
});
</script>

<template>
  <section class="portfolio-page" aria-label="포트폴리오">
    <header class="portfolio-header">
      <h1>포트폴리오</h1>
    </header>

    <ul class="project-list" aria-label="프로젝트 목록">
      <li v-for="project in projects" :key="project.name" class="project-card">
        <div class="project-card__image-wrap">
          <img
            v-if="project.imageSrc"
            class="project-card__image"
            :src="project.imageSrc"
            :alt="project.imageAlt"
          />
          <div v-else class="project-card__image-placeholder" aria-hidden="true">
            이미지 자리 (`src/assets/img/portfolio`)
          </div>
        </div>

        <div class="project-card__head">
          <h2>{{ project.name }}</h2>
          <span class="project-card__period">{{ project.period }}</span>
        </div>

        <p class="project-card__summary">{{ project.summary }}</p>

        <ul class="project-card__bullets">
          <li v-for="item in project.highlights" :key="item">{{ item }}</li>
        </ul>

        <div class="project-card__stack">
          <span v-for="tech in project.stack" :key="tech">{{ tech }}</span>
        </div>

        <a
          class="project-card__link"
          :href="project.href"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub 보기
        </a>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.portfolio-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.portfolio-header h1 {
  margin: 0;
  font-size: clamp(1.5rem, 3.5vw, 2rem);
  letter-spacing: -0.02em;
}

.portfolio-header p {
  margin: 0.6rem 0 0;
  color: var(--text-muted);
  line-height: 1.65;
}

.project-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.95rem;
}

.project-card {
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.1rem 1rem;
  background: color-mix(in srgb, var(--surface-elevated) 32%, transparent);
}

.project-card__image-wrap {
  margin: -0.35rem -0.25rem 0.8rem;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--surface-elevated) 35%, transparent);
}

.project-card__image {
  display: block;
  width: 100%;
  max-height: clamp(180px, 36vw, 280px);
  object-fit: contain;
  object-position: center;
}

.project-card__image-placeholder {
  width: 100%;
  aspect-ratio: 16 / 9;
  display: grid;
  place-items: center;
  border-radius: 10px;
  border: 1px dashed color-mix(in srgb, var(--border) 80%, var(--accent));
  color: var(--text-muted);
  font-size: 0.82rem;
  background: color-mix(in srgb, var(--surface-elevated) 22%, transparent);
}

.project-card__head {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem 0.75rem;
  align-items: baseline;
  justify-content: space-between;
}

.project-card h2 {
  margin: 0;
  font-size: 1.05rem;
}

.project-card__period {
  font-size: 0.82rem;
  color: var(--text-muted);
}

.project-card__summary {
  margin: 0.65rem 0 0;
  color: var(--text-muted);
  line-height: 1.6;
}

.project-card__bullets {
  margin: 0.7rem 0 0;
  padding-left: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.project-card__stack {
  margin-top: 0.85rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.project-card__stack span {
  font-size: 0.78rem;
  line-height: 1;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--accent) 30%, var(--border));
  background: color-mix(in srgb, var(--accent) 10%, transparent);
}

.project-card__link {
  display: inline-block;
  margin-top: 0.9rem;
  font-size: 0.88rem;
}
</style>
