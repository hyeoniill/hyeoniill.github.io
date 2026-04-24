import { createRouter, createWebHistory } from "vue-router";
import BlogPage from "@/pages/BlogPage.vue";
import Portfolio from "@/pages/Portfolio.vue";
import Post from "@/components/post/Post.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "home", component: BlogPage },
    { path: "/portfolio", name: "portfolio", component: Portfolio },
    {
      path: "/posts/:slug",
      name: "post",
      component: Post,
      props: true,
    },
  ],
});

export default router;
