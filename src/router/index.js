import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/main',
    name: 'main',
    component: () => import('../views/main.vue'),
  },
  {
    path: '/mobile',
    name: 'mobile',
    component: () => import('../views/mobile.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
