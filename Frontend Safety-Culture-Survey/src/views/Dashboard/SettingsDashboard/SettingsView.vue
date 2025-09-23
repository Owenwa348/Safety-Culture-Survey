<script setup>
import NavbarDashboard from '../../../components/NavbarDashboard.vue'
import EditPosition from './Editlogin/EditPosition.vue'
import EditDepartment from './Editlogin/EditDepartment.vue'
import EditWorkGroup from './Editlogin/EditWorkGroup.vue'
import EditExperience from './Editlogin/EditExperience.vue'
import EditQuestions from './EditQuestions/EditQuestions.vue'
import { ref } from 'vue'

const activeTab = ref('position')

const tabs = [
  { id: 'position', name: 'ตำแหน่งงาน', icon: '👔' },
  { id: 'department', name: 'สายงาน', icon: '🏢' },
  { id: 'workgroup', name: 'กลุ่มงาน', icon: '👥' },
  { id: 'experience', name: 'ประสบการณ์', icon: '⏰' },
  { id: 'questions', name: 'คำถาม', icon: '❓' }
]
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <NavbarDashboard />

    <!-- Content Container -->
    <div class="ml-64 mr-6 mt-8">
      <!-- Main Content Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div class="mb-8">
          <h3 class="text-2xl font-semibold text-gray-900 mb-2">Settings</h3>
          <p class="text-gray-600">จัดการการตั้งค่าระบบและข้อมูลพื้นฐาน</p>
        </div>

        <!-- Tab Navigation -->
        <div class="border-b border-gray-200 mb-8">
          <nav class="-mb-px flex space-x-8">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-3 px-4 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center gap-2',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <span>{{ tab.icon }}</span>
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- Position Tab -->
          <div v-show="activeTab === 'position'" class="animate-fadeIn">
            <EditPosition />
          </div>

          <!-- Department Tab -->
          <div v-show="activeTab === 'department'" class="animate-fadeIn">
            <EditDepartment />
          </div>

          <!-- Work Group Tab -->
          <div v-show="activeTab === 'workgroup'" class="animate-fadeIn">
            <EditWorkGroup />
          </div>

          <!-- Experience Tab -->
          <div v-show="activeTab === 'experience'" class="animate-fadeIn">
            <EditExperience />
          </div>

          <!-- Questions Tab -->
          <div v-show="activeTab === 'questions'" class="animate-fadeIn">
            <EditQuestions />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tab-content > div {
  min-height: 400px;
}
</style>