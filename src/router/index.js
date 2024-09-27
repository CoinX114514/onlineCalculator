import { createRouter, createWebHistory } from 'vue-router';
import CalculatorLogic from '../components/CalculatorLogic.vue';

const routes = [
  {
    path: '/',
    name: 'Calculator',
    component: CalculatorLogic,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;