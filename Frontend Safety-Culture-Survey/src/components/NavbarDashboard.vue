<template>
  <nav class="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-[#06202B] to-[#041419] shadow-2xl flex flex-col">
    <!-- โลโก้ -->
    <div class="flex items-center justify-center h-20 border-b border-gray-700/30 bg-black/20">
      <router-link to="/home" class="flex items-center transition-transform hover:scale-105">
        <img src="/logoandname.png" alt="Logo" class="h-15 w-40" />
      </router-link>
    </div>

    <!-- เมนู -->
    <div class="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
      <div class="space-y-2">
        <!-- หน้าหลัก -->
        <router-link 
          to="/dashboard"
          class="relative flex items-center px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group"
          :class="isActivePath('/dashboard') 
            ? 'bg-[#7AE2CF] text-[#06202B] font-semibold shadow-lg' 
            : 'text-gray-300 hover:text-white hover:bg-white/10 hover:translate-x-1'"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span class="font-medium">สรุปผลการประเมิน</span>
          </div>
        </router-link>
        
        <!-- ผลลัพธ์การประเมิน -->
        <div>
          <button 
            @click="toggleAssessmentMenu"
            class="relative flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group"
            :class="isAssessmentActive 
              ? 'bg-[#7AE2CF] text-[#06202B] font-semibold shadow-lg' 
              : 'text-gray-300 hover:text-white hover:bg-white/10'"
          >
            <div class="flex items-center justify-between w-full">
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span class="font-medium">วิเคราะห์ผลการประเมิน</span>
              </div>
              <svg 
                class="w-4 h-4 transition-transform duration-200"
                :class="{ 'rotate-180': isAssessmentMenuOpen }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          <div 
            v-show="isAssessmentMenuOpen" 
            class="mt-1 ml-8 space-y-1 border-l-2 border-[#7AE2CF]/30 pl-3"
          >
            <router-link 
              to="/workgroup-evaluation-results"
              class="block text-sm px-4 py-2.5 rounded-lg transition-all duration-200"
              :class="isActivePath('/workgroup-evaluation-results')
                ? 'bg-[#7AE2CF]/20 text-[#7AE2CF] font-semibold border-l-2 border-[#7AE2CF] pl-3'
                : 'text-gray-400 hover:text-white hover:bg-white/10'"
            >
              <span>ผลประเมินตามกลุ่มงาน</span>
            </router-link>
            <router-link 
              to="/question-results"
              class="block text-sm px-4 py-2.5 rounded-lg transition-all duration-200"
              :class="isActivePath('/question-results')
                ? 'bg-[#7AE2CF]/20 text-[#7AE2CF] font-semibold border-l-2 border-[#7AE2CF] pl-3'
                : 'text-gray-400 hover:text-white hover:bg-white/10'"
            >
              <span>ผลประเมินตามข้อคำถาม</span>
            </router-link>
            <router-link 
              to="/opinion-results"
              class="block text-sm px-4 py-2.5 rounded-lg transition-all duration-200"
              :class="isActivePath('/opinion-results')
                ? 'bg-[#7AE2CF]/20 text-[#7AE2CF] font-semibold border-l-2 border-[#7AE2CF] pl-3'
                : 'text-gray-400 hover:text-white hover:bg-white/10'"
            >
              <span>สรุปข้อคิดเห็น</span>
            </router-link>
          </div>
        </div>

        <!-- รายชื่อผู้ประเมิน -->
        <router-link 
          to="/user-list"
          class="relative flex items-center px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group"
          :class="isActivePath('/user-list') 
            ? 'bg-[#7AE2CF] text-[#06202B] font-semibold shadow-lg' 
            : 'text-gray-300 hover:text-white hover:bg-white/10 hover:translate-x-1'"
        >
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span class="font-medium">รายชื่อผู้ประเมิน</span>
          </div>
        </router-link>
        
        <!-- ตั้งค่าระบบ (SuperAdmin only) -->
        <div v-if="isSuperAdmin">
          <button 
            @click="toggleSettingsMenu"
            class="relative flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group"
            :class="isSettingsActive 
              ? 'bg-[#7AE2CF] text-[#06202B] font-semibold shadow-lg' 
              : 'text-gray-300 hover:text-white hover:bg-white/10'"
          >
            <div class="flex items-center justify-between w-full">
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span class="font-medium">ตั้งค่าระบบ</span>
              </div>
              <svg 
                class="w-4 h-4 transition-transform duration-200"
                :class="{ 'rotate-180': isSettingsMenuOpen }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          <div 
            v-show="isSettingsMenuOpen" 
            class="mt-1 ml-8 space-y-1 border-l-2 border-[#7AE2CF]/30 pl-3">
            <router-link 
              to="/settings"
              class="block text-sm px-4 py-2.5 rounded-lg transition-all duration-200"
              :class="isActivePath('/settings')
                ? 'bg-[#7AE2CF]/20 text-[#7AE2CF] font-semibold border-l-2 border-[#7AE2CF] pl-3'
                : 'text-gray-400 hover:text-white hover:bg-white/10'">
              <span>ตั้งค่าทั่วไป</span>
            </router-link>
            <router-link 
              to="/admin"
              class="block text-sm px-4 py-2.5 rounded-lg transition-all duration-200"
              :class="isActivePath('/admin')
                ? 'bg-[#7AE2CF]/20 text-[#7AE2CF] font-semibold border-l-2 border-[#7AE2CF] pl-3'
                : 'text-gray-400 hover:text-white hover:bg-white/10'">
              <span>จัดการรายชื่อ Admin</span>
            </router-link>
            <router-link 
              to="/superadmin"
              class="block text-sm px-4 py-2.5 rounded-lg transition-all duration-200"
              :class="isActivePath('/superadmin')
                ? 'bg-[#7AE2CF]/20 text-[#7AE2CF] font-semibold border-l-2 border-[#7AE2CF] pl-3'
                : 'text-gray-400 hover:text-white hover:bg-white/10'">
              <span>จัดการรายชื่อ SuperAdmin</span>
            </router-link>
            <router-link 
              to="/excelupload"
              class="block text-sm px-4 py-2.5 rounded-lg transition-all duration-200"
              :class="isActivePath('/excelupload')
                ? 'bg-[#7AE2CF]/20 text-[#7AE2CF] font-semibold border-l-2 border-[#7AE2CF] pl-3'
                : 'text-gray-400 hover:text-white hover:bg-white/10'">
              <span>อัปโหลดรายชื่อผู้ประเมิน</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- โปรไฟล์ผู้ใช้ -->
    <div class="border-t border-gray-700/30 p-4 bg-black/20">
      <button 
        @click="toggleUserMenu"
        class="w-full flex items-center space-x-3 text-white hover:bg-white/10 px-3 py-3 rounded-xl transition-all duration-200"
      >
        <div class="w-10 h-10 bg-gradient-to-br from-[#7AE2CF] to-[#4ECDC4] rounded-full flex items-center justify-center text-sm font-bold text-[#06202B] shadow-lg">
          {{ userInitials }}
        </div>
        
        <div class="flex-1 text-left">
          <div class="text-sm font-semibold">{{ userData.fullName }}</div>
          <div class="text-xs text-gray-400">{{ displayPosition }}</div>
        </div>

        <svg 
          class="w-4 h-4 transition-transform duration-200"
          :class="{ 'rotate-180': isUserMenuOpen }"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <!-- เมนูโปรไฟล์ -->
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-2"
      >
        <div 
          v-show="isUserMenuOpen"
          class="absolute bottom-24 left-4 right-4 bg-white rounded-xl shadow-2xl overflow-hidden"
        >
          <div class="px-5 py-4 bg-gradient-to-r from-[#06202B] to-[#0a3d52] border-b border-gray-200">
            <div class="flex items-center space-x-3">
              <div class="w-12 h-12 bg-gradient-to-br from-[#7AE2CF] to-[#4ECDC4] rounded-full flex items-center justify-center text-[#06202B] font-bold shadow-lg">
                {{ userInitials }}
              </div>
              <div>
                <div class="font-semibold text-white">{{ userData.fullName }}</div>
                <div class="text-sm text-gray-300">{{ displayPosition }}</div>
              </div>
            </div>
          </div>

          <div class="px-5 py-4 space-y-3 text-sm bg-gray-50">
            <div class="flex justify-between items-center">
              <span class="text-gray-600 font-medium">อีเมล:</span>
              <span class="text-gray-900">{{ userData.email }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600 font-medium">บทบาท:</span>
              <span class="px-3 py-1 rounded-full text-xs font-semibold" :class="roleStyleClass">
                {{ userData.role }}
              </span>
            </div>
            <div v-if="userData.role === 'Admin'" class="flex justify-between items-center">
              <span class="text-gray-600 font-medium">บริษัท:</span>
              <span class="text-gray-900">{{ userData.company }}</span>
            </div>
          </div>

          <div class="border-t border-gray-200 px-3 py-2 bg-white">
            <button 
              @click="logout"
              class="w-full text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-2 font-medium"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const isUserMenuOpen = ref(false)
const isAssessmentMenuOpen = ref(false)
const isSettingsMenuOpen = ref(false)

const userData = ref({
  fullName: 'ผู้ใช้งาน',
  email: '',
  company: '',
  role: 'Admin',
  position: 'ผู้ดูแลระบบ'
})

// Load user data from localStorage
const loadUserData = () => {
  const storedUser = localStorage.getItem('user')
  console.log('📦 Loading user from localStorage:', storedUser)
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser)
      console.log('✅ Parsed user:', user)
      
      // Normalize role: 'Super Admin' -> 'SuperAdmin'
      const normalizedRole = user.role?.replace(/\s+/g, '') || 'Admin'
      console.log('✅ Normalized role:', normalizedRole)
      
      userData.value = {
        fullName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email,
        email: user.email || '',
        company: user.companyName || '',
        role: normalizedRole,
        position: normalizedRole === 'SuperAdmin' ? 'ผู้ดูแลระบบ' : 'ผู้ดูแลระบบ'
      }
      console.log('✅ Updated userData:', userData.value)
    } catch (error) {
      console.error('❌ Failed to parse user data:', error)
    }
  } else {
    console.warn('⚠️ No user data in localStorage')
  }
}

const isActivePath = (path) => {
  return route.path === path
}

const isAssessmentActive = computed(() => {
  return ['/workgroup-evaluation-results', '/question-results', '/opinion-results'].includes(route.path)
})

const isSettingsActive = computed(() => {
  return ['/settings', '/admin', '/superadmin', '/excelupload',].includes(route.path)
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
      return 'bg-red-100 text-red-700 border border-red-200'
    case 'Admin':
      return 'bg-blue-100 text-blue-700 border border-blue-200'
    default:
      return 'bg-gray-100 text-gray-700 border border-gray-200'
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

// Check if user has SuperAdmin role
const isSuperAdmin = computed(() => {
  return userData.value.role === 'SuperAdmin'
})

const closeAllMenus = () => {
  isUserMenuOpen.value = false
  isAssessmentMenuOpen.value = false
  isSettingsMenuOpen.value = false
}

const logout = () => {
  console.log('Logout clicked')
  // Clear localStorage
  localStorage.removeItem('user')
  closeAllMenus()
  // Redirect to login page
  window.location.href = '/Login-all'
}

const handleClickOutside = (event) => {
  const nav = event.target.closest('nav')
  if (!nav) {
    closeAllMenus()
  }
}

onMounted(() => {
  loadUserData()
  document.addEventListener('click', handleClickOutside)
  
  // เปิด dropdown menu ถ้าอยู่ในหน้าย่อย
  if (isAssessmentActive.value) {
    isAssessmentMenuOpen.value = true
  }
  if (isSettingsActive.value) {
    isSettingsMenuOpen.value = true
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(122, 226, 207, 0.3);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(122, 226, 207, 0.5);
}
</style>