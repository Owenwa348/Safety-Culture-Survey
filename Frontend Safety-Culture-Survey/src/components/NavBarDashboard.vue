<template>
  <nav class="fixed top-0 left-0 h-full w-60 bg-[#06202B] shadow-lg flex flex-col">
    <!-- โลโก้ -->
    <div class="flex items-center justify-center h-20 border-b border-gray-700/50">
      <router-link to="/home" class="flex items-center">
        <img src="/logoandname.png" alt="Logo" class="h-15 w-40" />
      </router-link>
    </div>

    <!-- เมนู -->
    <div class="flex-1 overflow-y-auto py-6 px-4">
      <div class="space-y-1">
        <!-- หน้าหลัก -->
        <router-link 
          to="/dashboard"
          class="block text-white hover:bg-[#7AE2CF] px-4 py-2.5 rounded-lg transition-colors"
        >
          หน้าหลัก
        </router-link>
        
        <!-- ผลลัพธ์การประเมิน -->
        <div>
          <button 
            @click="toggleAssessmentMenu"
            class="w-full flex items-center justify-between text-white hover:bg-[#7AE2CF] px-4 py-2.5 rounded-lg transition-colors"
          >
            <span>ผลลัพธ์การประเมิน</span>
            <svg 
              class="w-4 h-4 transition-transform"
              :class="{ 'rotate-180': isAssessmentMenuOpen }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div v-show="isAssessmentMenuOpen" class="mt-1 ml-4 space-y-1">
            <router-link 
              to="/puestion-results"
              class="block text-sm text-gray-300 hover:text-white hover:bg-[#7AE2CF] px-4 py-2 rounded-lg transition-colors"
            >
              ผลประเมินแยกตามสายงาน
            </router-link>
            <router-link 
              to="/workgroup-evaluation-results"
              class="block text-sm text-gray-300 hover:text-white hover:bg-[#7AE2CF] px-4 py-2 rounded-lg transition-colors"
            >
              ผลประเมินตามกลุ่มงาน
            </router-link>
            <router-link 
              to="/question-results"
              class="block text-sm text-gray-300 hover:text-white hover:bg-[#7AE2CF] px-4 py-2 rounded-lg transition-colors"
            >
              ผลประเมินตามข้อคำถาม
            </router-link>
            <router-link 
              to="/opinion-results"
              class="block text-sm text-gray-300 hover:text-white hover:bg-[#7AE2CF] px-4 py-2 rounded-lg transition-colors"
            >
              ความคิดเห็นในแต่ละข้อคำถาม
            </router-link>
          </div>
        </div>

        <!-- รายชื่อผู้ประเมิน -->
        <router-link 
          to="/user-list"
          class="block text-white hover:bg-[#7AE2CF] px-4 py-2.5 rounded-lg transition-colors"
        >
          รายชื่อผู้ประเมิน
        </router-link>
        
        <!-- ตั้งค่าระบบ -->
        <div>
          <button 
            @click="toggleSettingsMenu"
            class="w-full flex items-center justify-between text-white hover:bg-[#7AE2CF] px-4 py-2.5 rounded-lg transition-colors"
          >
            <span>ตั้งค่าระบบ</span>
            <svg 
              class="w-4 h-4 transition-transform"
              :class="{ 'rotate-180': isSettingsMenuOpen }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div v-show="isSettingsMenuOpen" class="mt-1 ml-4 space-y-1">
            <router-link 
              to="/settings"
              class="block text-sm text-gray-300 hover:text-white hover:bg-[#7AE2CF] px-4 py-2 rounded-lg transition-colors"
            >
              ตั้งค่าทั่วไป
            </router-link>
            <router-link 
              to="/admin"
              class="block text-sm text-gray-300 hover:text-white hover:bg-[#7AE2CF] px-4 py-2 rounded-lg transition-colors"
            >
              จัดการรายชื่อ Admin
            </router-link>
            <router-link 
              to="/superadmin"
              class="block text-sm text-gray-300 hover:text-white hover:bg-[#7AE2CF] px-4 py-2 rounded-lg transition-colors"
            >
              จัดการรายชื่อ SuperAdmin
            </router-link>
            <router-link 
              to="/excelupload"
              class="block text-sm text-gray-300 hover:text-white hover:bg-[#7AE2CF] px-4 py-2 rounded-lg transition-colors"
            >
              อัปโหลดรายชื่อผู้ประเมิน
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- โปรไฟล์ผู้ใช้ -->
    <div class="border-t border-gray-700/50 p-4">
      <button 
        @click="toggleUserMenu"
        class="w-full flex items-center space-x-3 text-white hover:bg-white/5 px-3 py-2 rounded-lg transition-colors"
      >
        <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">
          {{ userInitials }}
        </div>
        
        <div class="flex-1 text-left">
          <div class="text-sm font-medium">{{ userData.fullName }}</div>
          <div class="text-xs text-gray-400">{{ displayPosition }}</div>
        </div>

        <svg 
          class="w-4 h-4 transition-transform"
          :class="{ 'rotate-180': isUserMenuOpen }"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <!-- เมนูโปรไฟล์ -->
      <div 
        v-show="isUserMenuOpen"
        class="absolute bottom-20 left-4 right-4 bg-white rounded-lg shadow-xl py-2"
      >
        <div class="px-4 py-3 border-b border-gray-200">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              {{ userInitials }}
            </div>
            <div>
              <div class="font-medium text-gray-900">{{ userData.fullName }}</div>
              <div class="text-sm text-gray-600">{{ displayPosition }}</div>
            </div>
          </div>
        </div>

        <div class="px-4 py-3 space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">อีเมล:</span>
            <span class="text-gray-900">{{ userData.email }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">บทบาท:</span>
            <span class="px-2 py-0.5 rounded text-xs" :class="roleStyleClass">
              {{ userData.role }}
            </span>
          </div>
          <div v-if="userData.role === 'Admin'" class="flex justify-between">
            <span class="text-gray-600">บริษัท:</span>
            <span class="text-gray-900">{{ userData.company }}</span>
          </div>
        </div>

        <div class="border-t border-gray-200 px-2 py-2">
          <button 
            @click="logout"
            class="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const isUserMenuOpen = ref(false)
const isAssessmentMenuOpen = ref(false)
const isSettingsMenuOpen = ref(false)

const userData = ref({
  fullName: 'ธันวา ชัยรัตนานนท์',
  email: 'superadmin01@gmail.com',
  company: 'บริษัท ความปลอดภัย จำกัด',
  role: 'SuperAdmin',
  position: 'ผู้จัดการระบบ'
})

const userInitials = computed(() => {
  const names = userData.value.fullName.split(' ')
  if (names.length >= 2) {
    return names[0].charAt(0) + names[1].charAt(0)
  }
  return names[0].charAt(0) + names[0].charAt(1)
})

const displayPosition = computed(() => {
  switch (userData.value.role) {
    case 'Admin':
      return userData.value.company || 'Admin'
    case 'SuperAdmin':
      return 'ผู้ดูแลระบบ'
    default:
      return userData.value.position || 'ผู้ใช้งาน'
  }
})

const roleStyleClass = computed(() => {
  switch (userData.value.role) {
    case 'SuperAdmin':
      return 'bg-red-100 text-red-800'
    case 'Admin':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
})

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
  if (isUserMenuOpen.value) {
    isAssessmentMenuOpen.value = false
    isSettingsMenuOpen.value = false
  }
}

const toggleAssessmentMenu = () => {
  isAssessmentMenuOpen.value = !isAssessmentMenuOpen.value
  if (isAssessmentMenuOpen.value) {
    isUserMenuOpen.value = false
    isSettingsMenuOpen.value = false
  }
}

const toggleSettingsMenu = () => {
  isSettingsMenuOpen.value = !isSettingsMenuOpen.value
  if (isSettingsMenuOpen.value) {
    isUserMenuOpen.value = false
    isAssessmentMenuOpen.value = false
  }
}

const closeAllMenus = () => {
  isUserMenuOpen.value = false
  isAssessmentMenuOpen.value = false
  isSettingsMenuOpen.value = false
}

const logout = () => {
  console.log('Logout clicked')
  closeAllMenus()
  window.location.href = '/'
}

const handleClickOutside = (event) => {
  const nav = event.target.closest('nav')
  if (!nav) {
    closeAllMenus()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Optional: เพิ่ม smooth scrolling ให้กับ dropdown */
</style>