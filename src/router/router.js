import { createRouter, createWebHistory } from "vue-router";
import BlogPage from "@/pages/BlogPage.vue";
import Post from "@/components/Post.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "home", component: BlogPage },
    {
      path: "/posts/:slug",
      name: "post",
      component: Post,
      props: true,
    },
  ],
});

export default router;
