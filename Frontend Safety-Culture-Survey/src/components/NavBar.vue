<template>
  <div>
    <nav class="fixed top-0 left-0 w-full z-50 bg-[#06202B] backdrop-blur-md shadow-md">
      <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">

          <!-- โลโก้ -->
          <div class="flex items-center flex-shrink-0">
            <router-link to="/home" class="flex items-center">
              <img src="/logoandname.png" alt="Logo" class="h-15 w-40 mr-2" />
            </router-link>
          </div>

          <!-- แถบเมนูกลาง (desktop) -->
          <div class="hidden md:flex absolute left-1/2 -translate-x-1/2 space-x-4 lg:space-x-8 text-base font-medium">
            <router-link to="/home"
              class="text-white hover:text-white hover:bg-[#7AE2CF] px-3 py-2 rounded-md transition text-sm lg:text-lg">
              หน้าแรก
            </router-link>
            <router-link to="/assessment"
              class="text-white hover:text-white hover:bg-[#7AE2CF] px-3 py-2 rounded-md transition text-sm lg:text-lg">
              แบบประเมิน
            </router-link>
            <router-link to="/about"
              class="text-white hover:text-white hover:bg-[#7AE2CF] px-3 py-2 rounded-md transition text-sm lg:text-lg">
              เกี่ยวกับเรา
            </router-link>
            <router-link to="/contact"
              class="text-white hover:text-white hover:bg-[#7AE2CF] px-3 py-2 rounded-md transition text-sm lg:text-lg">
              ติดต่อสอบถาม
            </router-link>
          </div>

          <!-- ขวา: User + Hamburger -->
          <div class="flex items-center gap-2">

            <!-- User Profile Dropdown -->
            <div class="relative" ref="dropdownRef">
              <button
                @click.stop="toggleUserMenu"
                class="flex items-center space-x-2 text-white hover:bg-white/10 px-2 py-1.5 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#7AE2CF]"
              >
                <div class="w-8 h-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white/20">
                  {{ userInitials }}
                </div>
                <div class="text-left hidden lg:block">
                  <div class="text-sm font-medium">{{ userData.fullName }}</div>
                  <div class="text-xs text-gray-300">{{ userData.position }}</div>
                </div>
                <svg
                  class="w-3.5 h-3.5 transition-transform duration-200"
                  :class="{ 'rotate-180': isUserMenuOpen }"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Dropdown -->
              <div
                v-if="isUserMenuOpen"
                class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[60]"
              >
                <div class="px-3 py-2.5 border-b border-gray-200">
                  <div class="flex items-center space-x-2">
                    <div class="w-9 h-9 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {{ userInitials }}
                    </div>
                    <div class="min-w-0">
                      <div class="font-semibold text-gray-900 text-sm truncate">{{ userData.fullName }}</div>
                      <div class="text-xs text-gray-500">ผู้เข้าประเมิน</div>
                    </div>
                  </div>
                </div>

                <div class="px-3 py-2 space-y-1.5">
                  <div class="flex justify-between items-center gap-2">
                    <span class="text-xs font-medium text-gray-500 flex-shrink-0">ชื่อ-สกุล:</span>
                    <span class="text-xs text-gray-900 text-right truncate">{{ userData.fullName }}</span>
                  </div>
                  <div class="flex justify-between items-center gap-2">
                    <span class="text-xs font-medium text-gray-500 flex-shrink-0">บริษัท:</span>
                    <span class="text-xs text-gray-900 text-right truncate">{{ userData.company }}</span>
                  </div>
                  <div class="flex justify-between items-center gap-2">
                    <span class="text-xs font-medium text-gray-500 flex-shrink-0">ตำแหน่งงาน:</span>
                    <span class="text-xs text-gray-900 text-right truncate">{{ userData.position }}</span>
                  </div>
                </div>

                <div class="border-t border-gray-200 px-3 py-1.5">
                  <button
                    @click="logout"
                    class="w-full text-left px-2 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 flex items-center space-x-2"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>ออกจากระบบ</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Hamburger -->
            <button
              @click.stop="toggleMobileMenu"
              class="md:hidden flex items-center justify-center w-9 h-9 text-white hover:bg-white/10 rounded-lg transition"
              aria-label="เปิดเมนู"
            >
              <svg v-if="!isMobileMenuOpen" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="isMobileMenuOpen" class="md:hidden bg-[#06202B] border-t border-white/10 px-4 py-3 space-y-1 relative z-50">
          <router-link to="/home" @click="isMobileMenuOpen = false"
            class="block text-white hover:bg-[#7AE2CF] hover:text-[#06202B] px-4 py-2.5 rounded-md transition text-base font-medium">
            หน้าแรก
          </router-link>
          <router-link to="/assessment" @click="isMobileMenuOpen = false"
            class="block text-white hover:bg-[#7AE2CF] hover:text-[#06202B] px-4 py-2.5 rounded-md transition text-base font-medium">
            แบบประเมิน
          </router-link>
          <router-link to="/about" @click="isMobileMenuOpen = false"
            class="block text-white hover:bg-[#7AE2CF] hover:text-[#06202B] px-4 py-2.5 rounded-md transition text-base font-medium">
            เกี่ยวกับเรา
          </router-link>
          <router-link to="/contact" @click="isMobileMenuOpen = false"
            class="block text-white hover:bg-[#7AE2CF] hover:text-[#06202B] px-4 py-2.5 rounded-md transition text-base font-medium">
            ติดต่อสอบถาม
          </router-link>
        </div>
      </transition>

    </nav>
    <!-- ไม่มี overlay แล้ว ใช้ document click listener แทน -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isUserMenuOpen = ref(false)
const isMobileMenuOpen = ref(false)
const dropdownRef = ref(null)

const userData = ref({
  fullName: '',
  company: '',
  position: ''
})

const userInitials = computed(() => {
  if (!userData.value.fullName) return ''
  const names = userData.value.fullName.split(' ')
  if (names.length >= 2) {
    return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase()
  }
  return (names[0].charAt(0) + (names[0].length > 1 ? names[0].charAt(1) : '')).toUpperCase()
})

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
  if (isUserMenuOpen.value) isMobileMenuOpen.value = false
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (isMobileMenuOpen.value) isUserMenuOpen.value = false
}

const logout = () => {
  localStorage.removeItem('user')
  isUserMenuOpen.value = false
  router.push('/')
}

// ปิด dropdown เมื่อคลิกนอก — ไม่ใช้ overlay แล้ว
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isUserMenuOpen.value = false
  }
}

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    const user = JSON.parse(storedUser)
    userData.value = {
      fullName: user.name_user || 'ผู้ใช้',
      company: user.company_user || 'ไม่มีข้อมูล',
      position: user.position_user || 'ไม่มีข้อมูล'
    }
  }
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>