<template>
  <nav class="fixed top-0 left-0 w-full z-50 bg-[#06202B] backdrop-blur-md shadow-md">
    <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
       <!-- ล็อกอิน -->
        <div class="flex items-center">
          <router-link to="/home" class="flex items-center">
            <img src="/logoandname.png" alt="Logo" class="h-15 w-40 mr-2" />
          </router-link>
        </div>

        <!-- แถบเลือก -->
        <div class="hidden md:flex absolute left-1/2 -translate-x-1/2 space-x-15 text-base font-medium">
          <router-link to="/home" style="color: white;"
            class="text-lg text-white hover:text-white hover:bg-[#7AE2CF] px-3 py-2 rounded-md transition">หน้าแรก</router-link>
          <router-link to="/assessment" style="color: white;"
            class="text-lg text-white hover:text-white hover:bg-[#7AE2CF] px-3 py-2 rounded-md transition">แบบประเมิน</router-link>
          <router-link to="/about" style="color: white;"
            class="text-lg text-white hover:text-white hover:bg-[#7AE2CF] px-3 py-2 rounded-md transition">เกี่ยวกับเรา</router-link>
          <router-link to="/contact" style="color: white;"
            class="text-lg text-white hover:text-white hover:bg-[#7AE2CF] px-3 py-2 rounded-md transition">ติดต่อสอบถาม</router-link>
          <!-- <router-link to="/dashboard" style="color: white;"
            class="text-lg text-white hover:text-white hover:bg-[#7AE2CF] px-3 py-2 rounded-md transition">หลังบ้าน</router-link> -->
        </div>

        <!-- User Profile Dropdown -->
        <div class="relative">
          <button 
            @click="toggleUserMenu"
            class="flex items-center space-x-3 text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#7AE2CF]"
          >
            <!-- User Avatar -->
            <div class="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold ring-2 ring-white/20">
              {{ userInitials }}
            </div>
            
            <!-- User Name and Role -->
            <div class="text-left hidden lg:block">
              <div class="text-sm font-medium">{{ userData.fullName }}</div>
              <div class="text-xs text-gray-300">{{ userData.position }}</div>
            </div>
            
            <!-- Dropdown Arrow -->
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

          <!-- Dropdown Menu -->
          <div 
            v-if="isUserMenuOpen"
            class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
          >
            <!-- User Info Header -->
            <div class="px-4 py-3 border-b border-gray-200">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  {{ userInitials }}
                </div>
                <div>
                  <div class="font-semibold text-gray-900">{{ userData.fullName }}</div>
                  <div class="text-sm text-gray-500">ผู้เข้าประเมิน</div>
                </div>
              </div>
            </div>

            <!-- User Details -->
            <div class="px-4 py-3 space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-600">ชื่อ-สกุล:</span>
                <span class="text-sm text-gray-900">{{ userData.fullName }}</span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-600">บริษัท:</span>
                <span class="text-sm text-gray-900">{{ userData.company }}</span>
              </div>
              
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-600">ตำแหน่งงาน:</span>
                <span class="text-sm text-gray-900">{{ userData.position }}</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="border-t border-gray-200 px-4 py-2">
              
              <button 
                @click="logout"
                class="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 flex items-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>ออกจากระบบ</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <div 
      v-if="isUserMenuOpen" 
      @click="isUserMenuOpen = false"
      class="fixed inset-0 z-40 md:hidden"
    ></div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Reactive state
const isUserMenuOpen = ref(false)

// Sample user data - ในการใช้งานจริงควรดึงจาก store หรือ API
const userData = ref({
  fullName: 'ธันวา ชัยรัตนานนท์',
  company: 'บริษัท ABC จำกัด',
  position: 'ผู้จัดการแผนก / ผู้จัดการ / พนักงานอาวุโส'
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
}

const closeUserMenu = () => {
  isUserMenuOpen.value = false
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
  const dropdown = event.target.closest('.relative')
  if (!dropdown) {
    closeUserMenu()
  }
}

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Position options for reference
const positionOptions = [
  'ผู้บริหารระดับสูง / ผู้จัดการส่วน',
  'ผู้จัดการแผนก / ผู้จัดการ / พนักงานอาวุโส',
  'พนักงาน',
  'ผู้รับเหมาประจำ'
]
</script>