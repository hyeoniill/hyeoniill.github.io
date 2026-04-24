import { createHead } from "@unhead/vue/client";
import { createApp } from "vue";
import "@/assets/style/main.css";
import "highlight.js/styles/github-dark.css";
import App from "./App.vue";
import router from "./router/router.js";

const app = createApp(App);
const head = createHead();
app.use(head);
app.use(router);
app.mount("#app");
