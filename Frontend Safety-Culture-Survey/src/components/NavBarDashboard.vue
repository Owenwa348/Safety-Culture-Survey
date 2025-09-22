<template>
  <nav class="fixed top-0 left-0 h-full w-60 z-50 bg-[#06202B] backdrop-blur-md shadow-md flex flex-col">
    <!-- โลโก้ -->
    <div class="flex items-center justify-center h-20 border-b border-gray-700">
      <router-link to="/home" class="flex items-center">
        <img src="/logoandname.png" alt="Logo" class="h-15 w-40" />
      </router-link>
    </div>

    <!-- แถบเลือกเมนู (แนวตั้ง) -->
    <div class="flex-1 flex flex-col mt-6 space-y-2 px-4">
      <router-link to="/dashboard"
        class="text-lg text-white hover:text-white hover:bg-[#7AE2CF] px-3 py-2 rounded-md transition">
        หน้าหลัก
      </router-link>
      
      <!-- ผลลัพธ์การประเมิน - Dropdown Menu -->
      <div class="relative">
        <button 
          @click="toggleAssessmentMenu"
          class="w-full text-left text-lg text-white hover:text-white hover:bg-[#7AE2CF] px-3 py-2 rounded-md transition flex items-center justify-between"
        >
          <span>ผลลัพธ์การประเมิน</span>
          <svg class="w-4 h-4 transition-transform duration-200"
            :class="{ 'rotate-180': isAssessmentMenuOpen }"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Assessment Results Dropdown -->
        <div v-if="isAssessmentMenuOpen"
          class="mt-1 ml-4 space-y-1 bg-[#0A2A3A] rounded-md shadow-lg border border-gray-600">
          <router-link to="/puestion-results"
            class="block text-base text-white hover:text-white hover:bg-[#7AE2CF] px-3 py-2 rounded-md transition">
            ผลการประเมินแยกตามหน่วยงาน
          </router-link>
          <router-link to="/question-results"
            class="block text-base text-white hover:text-white hover:bg-[#7AE2CF] px-3 py-2 rounded-md transition">
            ผลประเมินตามข้อคำถาม
          </router-link>
        </div>
      </div>

      <router-link to="/user-list"
        class="text-lg text-white hover:text-white hover:bg-[#7AE2CF] px-3 py-2 rounded-md transition">
        รายชื่อผู้ประเมิน
      </router-link>
      
      <!-- ตั้งค่าระบบ - Dropdown Menu -->
      <div class="relative">
        <button 
          @click="toggleSettingsMenu"
          class="w-full text-left text-lg text-white hover:text-white hover:bg-[#7AE2CF] px-3 py-2 rounded-md transition flex items-center justify-between"
        >
          <span>ตั้งค่าระบบ</span>
          <svg class="w-4 h-4 transition-transform duration-200"
            :class="{ 'rotate-180': isSettingsMenuOpen }"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Settings Dropdown -->
        <div v-if="isSettingsMenuOpen"
          class="mt-1 ml-4 space-y-1 bg-[#0A2A3A] rounded-md shadow-lg border border-gray-600">
          <router-link to="/settings"
            class="block text-base text-white hover:text-white hover:bg-[#7AE2CF] px-3 py-2 rounded-md transition">
            ตั้งค่าทั่วไป
          </router-link>
          <router-link to="/admin"
            class="block text-base text-white hover:text-white hover:bg-[#7AE2CF] px-3 py-2 rounded-md transition">
            จัดการรายชื่อAdmin
          </router-link>
          <router-link to="/superadmin"
            class="block text-base text-white hover:text-white hover:bg-[#7AE2CF] px-3 py-2 rounded-md transition">
            จัดการรายชื่อsuperadmin
          </router-link>
          <router-link to="/excelupload"
            class="block text-base text-white hover:text-white hover:bg-[#7AE2CF] px-3 py-2 rounded-md transition">
            อัปโหลดรายชื่อของผู้ประเมิน
          </router-link>
        </div>
      </div>
    </div>

    <!-- User Profile Dropdown -->
    <div class="relative border-t border-gray-700 p-1">
      <button 
        @click="toggleUserMenu"
        class="flex items-center w-full text-left space-x-3 text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors duration-200"
      >
        <!-- Avatar -->
        <div class="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold ring-2 ring-white/20">
          {{ userInitials }}
        </div>
        
        <!-- User Info -->
        <div class="flex-1">
          <div class="text-sm font-medium">{{ userData.fullName }}</div>
          <div class="text-xs text-gray-300">{{ userData.position }}</div>
        </div>

        <!-- Arrow -->
        <svg class="w-4 h-4 transition-transform duration-200"
          :class="{ 'rotate-180': isUserMenuOpen }"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <!-- Dropdown -->
      <div v-if="isUserMenuOpen"
        class="absolute bottom-16 left-0 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
        
        <!-- Header -->
        <div class="px-4 py-3 border-b border-gray-200">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
              {{ userInitials }}
            </div>
            <div>
              <div class="font-semibold text-gray-900">{{ userData.fullName }}</div>
            </div>
          </div>
        </div>

        <!-- Details -->
        <div class="px-4 py-3 space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-sm font-medium text-gray-600">ชื่อ-สกุล:</span>
            <span class="text-sm text-gray-900">{{ userData.fullName }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm font-medium text-gray-600">บริษัท:</span>
            <span class="text-sm text-gray-900">{{ userData.company }}</span>
          </div>
        </div>

        <!-- Logout -->
        <div class="border-t border-gray-200 px-4 py-2">
          <button @click="logout"
            class="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 flex items-center space-x-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
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

// Reactive state
const isUserMenuOpen = ref(false)
const isAssessmentMenuOpen = ref(false)
const isSettingsMenuOpen = ref(false)

// Sample user data - ในการใช้งานจริงควรดึงจาก store หรือ API
const userData = ref({
  fullName: 'สมชาย ใจดี',
  company: 'บริษัท ความปลอดภัย จำกัด',
})

// Computed properties
const userInitials = computed(() => {
  const names = userData.value.fullName.split(' ')
  if (names.length >= 2) {
    return names[0].charAt(0) + names[1].charAt(0)
  }
  return names[0].charAt(0) + names[0].charAt(1)
})

// Methods
const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
  // ปิด menus อื่นเมื่อเปิด user menu
  if (isUserMenuOpen.value) {
    isAssessmentMenuOpen.value = false
    isSettingsMenuOpen.value = false
  }
}

const toggleAssessmentMenu = () => {
  isAssessmentMenuOpen.value = !isAssessmentMenuOpen.value
  // ปิด menus อื่นเมื่อเปิด assessment menu
  if (isAssessmentMenuOpen.value) {
    isUserMenuOpen.value = false
    isSettingsMenuOpen.value = false
  }
}

const toggleSettingsMenu = () => {
  isSettingsMenuOpen.value = !isSettingsMenuOpen.value
  // ปิด menus อื่นเมื่อเปิด settings menu
  if (isSettingsMenuOpen.value) {
    isUserMenuOpen.value = false
    isAssessmentMenuOpen.value = false
  }
}

const closeUserMenu = () => {
  isUserMenuOpen.value = false
}

const closeAssessmentMenu = () => {
  isAssessmentMenuOpen.value = false
}

const closeSettingsMenu = () => {
  isSettingsMenuOpen.value = false
}

const closeAllMenus = () => {
  isUserMenuOpen.value = false
  isAssessmentMenuOpen.value = false
  isSettingsMenuOpen.value = false
}

const viewProfile = () => {
  console.log('View profile clicked')
  closeUserMenu()
  // Navigate to profile page
}

const logout = () => {
  console.log('Logout clicked')
  closeUserMenu()
  // Clear user data and navigate to home page
  window.location.href = '/'
}

// Click outside to close
const handleClickOutside = (event) => {
  const userDropdown = event.target.closest('.relative:last-child')
  const assessmentDropdown = event.target.closest('.relative:not(:last-child)')
  const settingsDropdown = event.target.closest('.relative:last-child:not(.border-t)')
  
  if (!userDropdown && !assessmentDropdown && !settingsDropdown) {
    closeAllMenus()
  } else {
    if (!userDropdown && isUserMenuOpen.value) {
      closeUserMenu()
    }
    if (!assessmentDropdown && isAssessmentMenuOpen.value) {
      closeAssessmentMenu()
    }
    if (!settingsDropdown && isSettingsMenuOpen.value) {
      closeSettingsMenu()
    }
  }
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>