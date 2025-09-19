import { createRouter, createWebHistory } from 'vue-router'
// ==================== กลุ่ม Login/Evaluator ====================
// สำหรับผู้ประเมิน
import LoginEvaluator from '../views/Login/LoginEvaluator/LoginEvaluator.vue'
import ForgotPasswordEvaluator from '../views/Login/LoginEvaluator/ForgotPasswordEvaluator.vue'
import EvaluatorRegistration from '../views/Login/LoginEvaluator/EvaluatorRegistration.vue'
// ==================== กลุ่ม Login/Administrator ====================
import LoginAdministrator from '../views/Login/LoginAdministrator/LoginAdministrator.vue'
import ForgotPasswordAdministrator from '../views/Login/LoginAdministrator/ForgotPasswordAdministrator.vue'

//=============================หน้าผู้ประเมิน=============================
import Home from '../views/Assessor/Home.vue'

//=============================Dashboard=============================
import Dashboard from '../views/Dashboard/Dashboard.vue'

// Not Found
import NotFound from '../views/other/NotFound.vue'
const routes = [
// ==================== กลุ่ม Login/Evaluator ====================
  {
    path: '/',
    name: 'LoginEvaluator',
    component: LoginEvaluator
  },
  {
    path: '/forgot-password-evaluator',
    name: 'ForgotPasswordEvaluator',
    component: ForgotPasswordEvaluator
  },
  {
    path: '/evaluator-registration',
    name: 'EvaluatorRegistration',
    component: EvaluatorRegistration
  },
  // ==================== กลุ่ม Login/Administrator ====================
  {
    path: '/login-administrator',
    name: 'LoginAdministrator',
    component: LoginAdministrator
  },
  {
    path: '/forgot-password-administrator',
    name: 'ForgotPasswordAdministrator',
    component: ForgotPasswordAdministrator
  },
//=============================หน้าผู้ประเมิน=============================
  {
    path: '/home',
    name: 'Home',
    component: Home
  },

  //=============================Dashboard=============================
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },

  //========================== Not Found==============================
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
