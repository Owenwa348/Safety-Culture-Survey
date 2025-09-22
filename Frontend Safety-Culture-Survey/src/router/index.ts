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
import AboutUs from '../views/Assessor/PageAboutUs/AboutUs.vue'
import Contact from '../views/Assessor/PageContact/Contact.vue'
import Assessment from '../views/Assessor/PageAssessment/Assessment.vue'

//=============================Dashboard Admin =============================
import Dashboard from '../views/Dashboard/Dashboard.vue'
import UserList from '../views/Dashboard/Users/UserList.vue'
import PositionResults from '../views/Dashboard/Analytics/PositionResults.vue'
import QuestionResults from '../views/Dashboard/Analytics/QuestionResults.vue'

//=============================Dashboard Superadmin =============================
import ExcelUploadView from '../views/Dashboard/SettingsDashboard/ExcelUploadView.vue'
import SettingsView from '../views/Dashboard/SettingsDashboard/SettingsView.vue'
import Admin from '../views/Dashboard/Users/Admin/AdminList.vue'
import SuperAdmin from '../views/Dashboard/Users/SuperAdmin/SuperAdminList.vue'

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
  {
    path: '/about',
    name: 'AboutUs',
    component: AboutUs
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  },
  {
    path: '/assessment',
    name: 'Assessment',
    component: Assessment
  },
  {
  path: '/team/:id',
  name: 'TeamMemberProfile',
  component: () => import('../views/Assessor/PageAboutUs/TeamMemberProfile.vue'),
  props: true
  },

  //=============================Dashboard Adnim=============================
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/puestion-results',
    name: 'PositionResults',
    component: PositionResults
  },
  {
    path: '/question-results',
    name: 'QuestionResults',
    component: QuestionResults
  },
  {
    path: '/user-list',
    name: 'UserList',
    component: UserList
  },
  //========================== Dashboard Superadmin =============================
  {
    path: '/settings',
    name: 'SettingsView',
    component: SettingsView
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin
  },
  {
    path: '/superadmin',
    name: 'SuperAdmin',
    component: SuperAdmin
  },
  {
    path: '/excelupload',
    name: 'ExcelUploadView',
    component: ExcelUploadView
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
