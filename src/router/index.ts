import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import RepoView from '@/views/RepoView.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomeView, props: route => ({ username: route.query.user ?? '' }) },
  { path: '/repo/:name', name: 'repo', component: RepoView, props: true }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});
