<template>
  <nav class="nav-block social-nav" aria-label="소셜 메뉴">
    <router-link
      class="social-nav__link"
      to="/portfolio"
      aria-label="포트폴리오 페이지"
      title="포트폴리오"
    >
      <svg
        class="social-nav__icon"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="currentColor"
          d="M9 4.5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2V6h3a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h3V4.5zm2-.5v2h2V4h-2zm-5 4a1 1 0 0 0-1 1v1.25c2.02.86 4.35 1.31 7 1.31s4.98-.45 7-1.31V9a1 1 0 0 0-1-1H6zm13 4.35a22.7 22.7 0 0 1-7 1.06 22.7 22.7 0 0 1-7-1.06V17.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5.15z"
        />
      </svg>
    </router-link>

    <a
      class="social-nav__link"
      href="https://github.com/Hyeoniill"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="GitHub 프로필 (Hyeoniill)"
    >
      <svg
        class="social-nav__icon"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="currentColor"
          d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
        />
      </svg>
    </a>
  </nav>
</template>

<style scoped>
.social-nav {
  flex-direction: row;
  gap: 0.5rem;
}

.social-nav__link {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  min-width: 2.35rem;
}

.social-nav__icon {
  width: 1.35rem;
  height: 1.35rem;
  flex-shrink: 0;
}
</style>
