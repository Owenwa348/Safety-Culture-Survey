
<template>
  <div class="min-h-screen bg-gray-50 flex">
    <NavWithSidebar :active-tab="activeTab" @update:activeTab="activeTab = $event" />
    <main class="flex-1 p-6">
      <component :is="getCurrentView()" />
    </main>
  </div>
</template>
<script setup>
import { ref, defineAsyncComponent } from 'vue';
import NavWithSidebar from '../../components/NavBarDashboard.vue';

const activeTab = ref('Dashboard');

const getCurrentView = () => {
  switch (activeTab.value) {
    // ==================================Dashboard=================================
    case 'Dashboard':
      return defineAsyncComponent(() => import('./DashboardView/DashboardView.vue'));
    // ==================================Analytics=================================
    case 'PositionResults':
      return defineAsyncComponent(() => import('./Analytics/PositionResults.vue'));
    case 'Analytics-by-unit':
      return defineAsyncComponent(() => import('./Analytics/QuestionResults.vue'));
    // ==================================User Management=================================
    case 'Users':
      return defineAsyncComponent(() => import('./Users/UserList.vue'));
    // ==================================Settings=================================
    case 'UploadContacts':
      return defineAsyncComponent(() => import('./SettingsDashboard/SettingsView.vue'));
    case 'Admin':
      return defineAsyncComponent(() => import('./Users/Admin.vue'));
    default:
      return null;
  }
};
</script>
