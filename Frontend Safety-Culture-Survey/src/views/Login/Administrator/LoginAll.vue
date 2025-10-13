<!-- LoginAll.vue - Combined Admin & SuperAdmin Login -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
    <div class="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 relative overflow-hidden">
      
      <!-- Background decoration -->
      <div :class="[
        'absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-16 translate-x-16 transition-all duration-500',
        loginType === 'admin' 
          ? 'bg-gradient-to-br from-green-200/30 to-emerald-200/30' 
          : 'bg-gradient-to-br from-purple-200/30 to-blue-200/30'
      ]"></div>
      <div :class="[
        'absolute bottom-0 left-0 w-24 h-24 rounded-full translate-y-12 -translate-x-12 transition-all duration-500',
        loginType === 'admin' 
          ? 'bg-gradient-to-tr from-teal-200/30 to-green-200/30' 
          : 'bg-gradient-to-tr from-indigo-200/30 to-purple-200/30'
      ]"></div>
      
      <!-- Header -->
      <div class="text-center mb-8 relative z-10">
        <div :class="[
          'w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg transition-all duration-500',
          loginType === 'admin' 
            ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
            : 'bg-gradient-to-r from-purple-500 to-indigo-600'
        ]">
          <svg v-if="loginType === 'admin'" class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          <svg v-else class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.818-4.954A9.953 9.953 0 0112 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10c0-1.466-.316-2.855-.882-4.104m-6.925.956c1.676-.73 3.31-1.852 4.805-3.351M7.5 14.5l2 2L14 12"></path>
          </svg>
        </div>

        <!-- Login Type Toggle -->
        <div class="flex bg-gray-100 rounded-xl p-1 mb-4 max-w-xs mx-auto">
          <button
            @click="loginType = 'admin'"
            :class="[
              'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300',
              loginType === 'admin' 
                ? 'bg-white text-green-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            Admin
          </button>
          <button
            @click="loginType = 'superadmin'"
            :class="[
              'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300',
              loginType === 'superadmin' 
                ? 'bg-white text-purple-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            ]"
          >
            SuperAdmin
          </button>
        </div>

        <h1 class="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
          เข้าสู่ระบบ {{ loginType === 'admin' ? 'Admin' : 'SuperAdmin' }}
        </h1>
        <p class="text-gray-500 text-sm">
          {{ loginType === 'admin' ? 'สำหรับผู้ดูแลระบบ' : 'สำหรับผู้ดูแลระบบระดับสูง' }}
        </p>
      </div>

      <!-- Error Alert -->
      <div v-if="errorMessage" class="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
        <div class="flex items-center space-x-2 text-red-800">
          <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
          <span class="text-sm font-medium">{{ errorMessage }}</span>
        </div>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6 relative z-10">
        
        <!-- Email Field -->
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">อีเมล</label>
          <div class="relative group">
            <input
              v-model="email"
              type="email"
              :placeholder="loginType === 'admin' ? 'admin@company.com' : 'superadmin@company.com'"
              :class="[
                'w-full border-2 rounded-xl px-4 py-3 pl-12 transition-all duration-300',
                'focus:outline-none focus:ring-4 group-hover:border-gray-300',
                loginType === 'admin' 
                  ? 'focus:ring-green-100 focus:border-green-500'
                  : 'focus:ring-purple-100 focus:border-purple-500',
                emailStatus === 'invalid' ? 'border-red-300 bg-red-50' : 
                emailStatus === 'no-password' ? 'border-amber-300 bg-amber-50' : 
                emailStatus === 'valid' ? (loginType === 'admin' ? 'border-green-300 bg-green-50' : 'border-purple-300 bg-purple-50') : 'border-gray-200'
              ]"
              @input="resetEmailStatus"
              required
            />
            <div class="absolute inset-y-0 left-0 flex items-center pl-4">
              <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-500 transition-colors duration-200" 
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
              </svg>
            </div>
            
            <!-- Status icon -->
            <div v-if="emailStatus" class="absolute inset-y-0 right-0 flex items-center pr-4">
              <svg v-if="emailStatus === 'valid'" :class="[
                'w-5 h-5',
                loginType === 'admin' ? 'text-green-500' : 'text-purple-500'
              ]" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <svg v-else-if="emailStatus === 'no-password'" class="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
              <svg v-else-if="emailStatus === 'invalid'" class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          
          <!-- Email Status Messages -->
          <div v-if="emailMessage" class="mt-2">
            <div v-if="emailStatus === 'invalid'" 
                 class="flex items-center space-x-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
              <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-sm font-medium">{{ emailMessage }}</span>
            </div>
          </div>
        </div>

        <!-- Password Field -->
        <div class="space-y-2" v-show="showPasswordField">
          <label class="block text-sm font-semibold text-gray-700">รหัสผ่าน</label>
          <div class="relative group">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="ระบุรหัสผ่าน"
              :disabled="emailStatus !== 'valid'"
              :class="[
                'w-full border-2 border-gray-200 rounded-xl px-4 py-3 pl-12 pr-12 transition-all duration-300',
                'focus:outline-none focus:ring-4 group-hover:border-gray-300',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                loginType === 'admin' 
                  ? 'focus:ring-green-100 focus:border-green-500'
                  : 'focus:ring-purple-100 focus:border-purple-500'
              ]"
              required
            />
            <div class="absolute inset-y-0 left-0 flex items-center pl-4">
              <svg class="w-5 h-5 text-gray-400 group-hover:text-gray-500 transition-colors duration-200" 
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            
            <!-- Toggle Password Visibility -->
            <button
              type="button"
              @click="showPassword = !showPassword"
              :disabled="emailStatus !== 'valid'"
              class="absolute inset-y-0 right-0 flex items-center pr-4 disabled:opacity-50"
            >
              <svg v-if="showPassword" class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
              </svg>
              <svg v-else class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Check Email Button / Or main action button -->
        <button
          v-if="!showPasswordField"
          type="button"
          @click="checkEmail"
          :disabled="!email || isLoading"
          :class="[
            'w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform',
            'focus:outline-none',
            loginType === 'admin' ? 'focus:ring-4 focus:ring-green-100' : 'focus:ring-4 focus:ring-purple-100',
            (email && !isLoading) ? (loginType === 'admin' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:scale-[1.02] hover:shadow-xl' : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-[1.02] hover:shadow-xl') : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          ]"
        >
          {{ isLoading ? 'กำลังตรวจสอบ...' : 'ถัดไป' }}
        </button>

        <!-- Submit Button -->
        <button
          type="submit"
          v-else
          :disabled="!canSubmit || isLoading"
          :class="[
            'w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform',
            'focus:outline-none',
            loginType === 'admin' ? 'focus:ring-4 focus:ring-green-100' : 'focus:ring-4 focus:ring-purple-100',
            (canSubmit && !isLoading) ? (loginType === 'admin' ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:scale-[1.02] hover:shadow-xl' : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-[1.02] hover:shadow-xl') : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          ]"
        >
          {{ isLoading ? 'กำลังเข้าสู่ระบบ...' : `เข้าสู่ระบบ ${loginType === 'admin' ? 'Admin' : 'SuperAdmin'}` }}
        </button>

        <!-- Forgot Password Link -->
        <div v-if="showPasswordField" class="text-center pt-4 border-t border-gray-100 mt-4">
          <router-link
            :to="`/forgot-password-${loginType}`"
            :class="[
              'font-medium hover:underline transition-all duration-200 text-sm',
              loginType === 'admin' ? 'text-green-600 hover:text-green-700' : 'text-purple-600 hover:text-purple-700'
            ]"
          >
            ลืมรหัสผ่าน?
          </router-link>
        </div>
        
        <!-- Navigation Links -->
        <div class="text-center space-y-2 pt-4">
          <div>
            <router-link
              to="/"
              class="text-gray-600 hover:text-gray-700 font-medium hover:underline transition-all duration-200 text-sm"
            >
              กลับไปหน้าเข้าผู้ประเมิน
            </router-link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const loginType = ref('admin') // 'admin' or 'superadmin'
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const emailStatus = ref(null) // null, 'valid', 'no-password', 'invalid'
const emailMessage = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

// Mock database for SuperAdmin (Admin is now handled by API)
const mockSuperAdminDatabase = [
  { email: 'superadmin01@gmail.com', hasPassword: true, password: '123456', role: 'superadmin' },
  { email: 'superadmin02@gmail.com', hasPassword: false, role: 'superadmin' },
]

const showPasswordField = computed(() => emailStatus.value === 'valid')
const canSubmit = computed(() => emailStatus.value === 'valid' && email.value && password.value && !isLoading.value)

watch(loginType, () => {
  resetEmailStatus()
})

const checkEmail = async () => {
  if (!email.value) {
    resetEmailStatus()
    return
  }
  
  isLoading.value = true
  errorMessage.value = ''
  emailMessage.value = ''

  if (loginType.value === 'admin') {
    try {
      const response = await axios.post('http://localhost:5000/api/admin/check-email', { email: email.value });
      // Success case (200 OK): User is PENDING, redirect to set password
      router.push({ 
        name: 'SetPasswordAdmin', 
        query: { 
          email: response.data.email, 
          company: response.data.companyName 
        }
      });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          // User is already ACTIVE, show password field
          emailStatus.value = 'valid';
        } else if (error.response.status === 404) {
          // User not found
          emailStatus.value = 'invalid';
          emailMessage.value = 'อีเมลของท่านไม่มีในระบบ Admin';
        } else {
          // Other server errors
          errorMessage.value = error.response.data.message || 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์';
        }
      } else {
        errorMessage.value = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้';
      }
    } finally {
      isLoading.value = false;
    }
  } else {
    // Keep mock logic for SuperAdmin
    await new Promise(resolve => setTimeout(resolve, 800))
    const user = mockSuperAdminDatabase.find(u => u.email.toLowerCase() === email.value.toLowerCase())
    if (!user) {
      emailStatus.value = 'invalid'
      emailMessage.value = 'อีเมลของท่านไม่มีสิทธิ์ SuperAdmin'
    } else if (!user.hasPassword) {
      emailStatus.value = 'no-password'
      emailMessage.value = 'กรุณาตั้งรหัสผ่านของท่าน'
       router.push({ name: 'SetPasswordSuperAdmin', query: { email: email.value } });
    } else {
      emailStatus.value = 'valid'
    }
    isLoading.value = false
  }
}

const resetEmailStatus = () => {
  emailStatus.value = null
  emailMessage.value = ''
  password.value = ''
  errorMessage.value = ''
}

const handleLogin = async () => {
  if (!canSubmit.value) return
  
  isLoading.value = true
  errorMessage.value = ''
  
  // NOTE: The login API endpoint is not implemented yet.
  // This part still uses mock logic.
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (loginType.value === 'admin') {
        // TODO: Replace with actual API call to POST /api/admin/login
        alert('Login successful (DEMO)! Redirecting to dashboard.');
        router.push('/dashboard');
    } else {
        const user = mockSuperAdminDatabase.find(u => u.email.toLowerCase() === email.value.toLowerCase())
        if (user && user.hasPassword && user.password === password.value) {
            localStorage.setItem('user', JSON.stringify({ email: email.value, role: user.role }))
            router.push('/settings')
        } else {
            errorMessage.value = 'รหัสผ่านไม่ถูกต้อง'
            password.value = ''
        }
    }
  } catch (error) {
    errorMessage.value = 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
  } finally {
    isLoading.value = false
  }
}

</script>

<style scoped>
/* Styles remain unchanged */
</style>
