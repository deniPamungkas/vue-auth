import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "./login.vue";
import RegisterPage from "./register.vue";
import HomePage from "./home.vue";

const routes = [
  { path: "/login", component: LoginPage },
  { path: "/register", component: RegisterPage },
  { path: "/", component: HomePage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
