<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-md">

      <div class="bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.10),_0_2px_8px_rgba(0,0,0,0.06)] p-10 relative overflow-hidden">

        <!-- Deco circles -->
        <div :class="[
          'absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-60 transition-colors duration-300',
          loginType === 'admin' ? 'bg-emerald-100' : 'bg-violet-100'
        ]"></div>
        <div :class="[
          'absolute -bottom-8 -left-8 w-24 h-24 rounded-full opacity-50 transition-colors duration-300',
          loginType === 'admin' ? 'bg-emerald-100' : 'bg-violet-100'
        ]"></div>

        <!-- Icon -->
        <div class="flex justify-center mb-6 relative z-10">
          <div :class="[
            'w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300',
            loginType === 'admin'
              ? 'bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg shadow-emerald-200'
              : 'bg-gradient-to-br from-violet-400 to-purple-600 shadow-lg shadow-violet-200'
          ]">
            <svg v-if="loginType === 'admin'" class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <svg v-else class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
        </div>

        <!-- Tab Toggle -->
        <div class="flex bg-gray-100 rounded-xl p-1 mb-6 relative z-10">
          <button
            type="button"
            @click="loginType = 'admin'"
            :class="[
              'flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200',
              loginType === 'admin'
                ? 'bg-white text-emerald-700 shadow-sm border border-gray-200'
                : 'text-gray-500 hover:text-gray-700'
            ]"
          >Admin</button>
          <button
            type="button"
            @click="loginType = 'superadmin'"
            :class="[
              'flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200',
              loginType === 'superadmin'
                ? 'bg-white text-violet-700 shadow-sm border border-gray-200'
                : 'text-gray-500 hover:text-gray-700'
            ]"
          >SuperAdmin</button>
        </div>

        <!-- Heading -->
        <h1 class="text-2xl font-bold text-gray-900 text-center mb-1 relative z-10">
          เข้าสู่ระบบ {{ loginType === 'admin' ? 'Admin' : 'SuperAdmin' }}
        </h1>
        <p class="text-sm text-gray-400 text-center mb-6 relative z-10">
          {{ loginType === 'admin' ? 'สำหรับผู้ดูแลระบบ' : 'สำหรับผู้ดูแลระบบระดับสูง' }}
        </p>

        <!-- Error Alert -->
        <div v-if="errorMessage"
          class="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5 relative z-10">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
          </svg>
          <span>{{ errorMessage }}</span>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4 relative z-10">

          <!-- Email -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">อีเมล</label>
            <div class="relative">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
              </svg>
              <input
                v-model="email"
                type="email"
                :placeholder="loginType === 'admin' ? 'admin@company.com' : 'superadmin@company.com'"
                :class="[
                  'w-full h-12 pl-10 pr-10 rounded-xl border text-sm bg-white outline-none transition-all duration-150 focus:ring-2 focus:ring-offset-0',
                  emailStatus === 'invalid'
                    ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                    : emailStatus === 'valid'
                      ? loginType === 'admin'
                        ? 'border-emerald-300 focus:border-emerald-400 focus:ring-emerald-100'
                        : 'border-violet-300 focus:border-violet-400 focus:ring-violet-100'
                      : loginType === 'admin'
                        ? 'border-gray-200 hover:border-gray-300 focus:border-emerald-400 focus:ring-emerald-100'
                        : 'border-gray-200 hover:border-gray-300 focus:border-violet-400 focus:ring-violet-100'
                ]"
                @input="resetEmailStatus"
                required
              />
              <div v-if="emailStatus" class="absolute right-3.5 top-1/2 -translate-y-1/2">
                <svg v-if="emailStatus === 'valid'"
                  :class="['w-4 h-4', loginType === 'admin' ? 'text-emerald-500' : 'text-violet-500']"
                  fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clip-rule="evenodd"/>
                </svg>
                <svg v-else-if="emailStatus === 'invalid'"
                  class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    clip-rule="evenodd"/>
                </svg>
              </div>
            </div>
            <p v-if="emailStatus === 'invalid' && emailMessage" class="text-xs text-red-600 mt-1.5">
              {{ emailMessage }}
            </p>
          </div>

          <!-- Password -->
          <div v-show="showPasswordField">
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">รหัสผ่าน</label>
            <div class="relative">
              <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
              </svg>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="ระบุรหัสผ่าน"
                :disabled="emailStatus !== 'valid'"
                :class="[
                  'w-full h-12 pl-10 pr-10 rounded-xl border text-sm bg-white outline-none transition-all duration-150 focus:ring-2 focus:ring-offset-0 disabled:opacity-40 disabled:cursor-not-allowed',
                  loginType === 'admin'
                    ? 'border-gray-200 hover:border-gray-300 focus:border-emerald-400 focus:ring-emerald-100'
                    : 'border-gray-200 hover:border-gray-300 focus:border-violet-400 focus:ring-violet-100'
                ]"
                required
              />
              <button type="button" @click="showPassword = !showPassword"
                :disabled="emailStatus !== 'valid'"
                class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-40">
                <svg v-if="showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Next Button -->
          <button
            v-if="!showPasswordField"
            type="button"
            @click="checkEmail"
            :disabled="!email || isLoading"
            :class="[
              'w-full h-12 rounded-xl text-sm font-semibold transition-all duration-200 mt-2 disabled:opacity-40 disabled:cursor-not-allowed',
              loginType === 'admin'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md shadow-emerald-200'
                : 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-md shadow-violet-200'
            ]"
          >
            {{ isLoading ? 'กำลังตรวจสอบ...' : 'ถัดไป' }}
          </button>

          <!-- Login Button -->
          <button
            v-else
            type="submit"
            :disabled="!canSubmit || isLoading"
            :class="[
              'w-full h-12 rounded-xl text-sm font-semibold transition-all duration-200 mt-2 disabled:opacity-40 disabled:cursor-not-allowed',
              loginType === 'admin'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md shadow-emerald-200'
                : 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-md shadow-violet-200'
            ]"
          >
            {{ isLoading ? 'กำลังเข้าสู่ระบบ...' : `เข้าสู่ระบบ ${loginType === 'admin' ? 'Admin' : 'SuperAdmin'}` }}
          </button>

          <!-- Forgot Password -->
          <div v-if="showPasswordField" class="text-right">
            <router-link
              :to="`/forgot-password-${loginType}`"
              :class="[
                'text-sm font-medium hover:underline',
                loginType === 'admin' ? 'text-emerald-600' : 'text-violet-600'
              ]"
            >ลืมรหัสผ่าน?</router-link>
          </div>

        </form>

        <!-- Footer -->
        <div class="mt-6 pt-5 border-t border-gray-100 text-center relative z-10">
          <router-link to="/" class="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            กลับไปหน้าเข้าผู้ประเมิน
          </router-link>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const loginType = ref('admin')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const emailStatus = ref(null)
const emailMessage = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const showPasswordField = computed(() => emailStatus.value === 'valid')
const canSubmit = computed(() => emailStatus.value === 'valid' && email.value && password.value && !isLoading.value)

watch(loginType, () => {
  resetEmailStatus()
})

const checkEmail = async () => {
  if (!email.value) return
  isLoading.value = true
  errorMessage.value = ''
  emailMessage.value = ''
  const userEmail = email.value.trim()

  if (loginType.value === 'admin') {
    try {
      const response = await axios.post('/api/admin/check-email', { email: userEmail })
      router.push({
        name: 'SetPasswordAdmin',
        query: { email: response.data.email, company: response.data.companyName }
      })
    } catch (error) {
      if (error.response?.status === 403) {
        emailStatus.value = 'valid'
      } else if (error.response?.status === 404) {
        emailStatus.value = 'invalid'
        emailMessage.value = 'อีเมลของท่านไม่มีในระบบ Admin'
      } else {
        errorMessage.value = error.response?.data?.message || 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์'
      }
    } finally {
      isLoading.value = false
    }
  } else {
    try {
      const response = await axios.post('/api/super-admins/check-email', { email: userEmail })
      router.push({ name: 'SetPasswordSuperAdmin', query: { email: response.data.email } })
    } catch (error) {
      if (error.response?.status === 409) {
        emailStatus.value = 'valid'
      } else if (error.response?.status === 404) {
        emailStatus.value = 'invalid'
        emailMessage.value = 'อีเมลของท่านไม่มีสิทธิ์ SuperAdmin'
      } else {
        errorMessage.value = error.response?.data?.message || 'เกิดข้อผิดพลาดบนเซิร์ฟเวอร์'
      }
    } finally {
      isLoading.value = false
    }
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
  const userEmail = email.value.trim()
  const userPassword = password.value

  try {
    if (loginType.value === 'admin') {
      const response = await axios.post('/api/admin/login', { email: userEmail, password: userPassword })
      localStorage.setItem('user', JSON.stringify({
        email: response.data.email,
        role: response.data.role,
        companyName: response.data.companyName,
        firstName: response.data.firstName,
        lastName: response.data.lastName
      }))
      router.push('/dashboard')
    } else {
      const response = await axios.post('/api/super-admins/login', { email: userEmail, password: userPassword })
      localStorage.setItem('user', JSON.stringify({ email: userEmail, role: response.data.role }))
      router.push('/settings')
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
    password.value = ''
  } finally {
    isLoading.value = false
  }
}
</script>