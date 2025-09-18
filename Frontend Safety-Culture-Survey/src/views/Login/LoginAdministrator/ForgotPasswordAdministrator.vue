<!-- ForgotPasswordAdministrator -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <div class="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 relative overflow-hidden">
      
      <!-- Background decoration -->
      <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full -translate-y-16 translate-x-16"></div>
      <div class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-200/30 to-blue-200/30 rounded-full translate-y-12 -translate-x-12"></div>
      
      <!-- Header -->
      <div class="text-center mb-8 relative z-10">
        <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a4 4 0 000 8m0 0V9a5 5 0 015 5v1M15 15H9a5 5 0 01-5-5V9"></path>
          </svg>
        </div>
        <h1 class="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
          {{ getTitle() }}
        </h1>
        <p class="text-gray-500 text-sm">
          {{ getDescription() }}
        </p>
      </div>

      <!-- Step 1: Email and Phone Input -->
      <div v-if="currentStep === 'email'" class="space-y-6 relative z-10">
        <form @submit.prevent="handleEmailSubmit">
          <!-- Email -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">อีเมล</label>
            <div class="relative group">
              <input
                v-model="email"
                type="email"
                placeholder="example@company.com"
                :class="[
                  'w-full border-2 rounded-xl px-4 py-3 pl-12 transition-all duration-300',
                  'focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500',
                  'group-hover:border-gray-300',
                  emailError ? 'border-red-300 bg-red-50' : 'border-gray-200'
                ]"
                required
              />
              <div class="absolute inset-y-0 left-0 flex items-center pl-4">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                </svg>
              </div>
            </div>
            <p v-if="emailError" class="text-red-500 text-sm">{{ emailError }}</p>
          </div>

          <!-- Phone Number -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">เบอร์โทรศัพท์</label>
            <div class="relative group">
              <input
                v-model="phoneNumber"
                type="tel"
                @input="formatPhoneNumber"
                @keypress="onlyNumberInput"
                placeholder="กรอกเบอร์โทรศัพท์ 10 หลัก"
                maxlength="12"
                :class="[
                  'w-full border-2 rounded-xl px-4 py-3 pl-12 pr-16 text-lg font-mono tracking-wider transition-all duration-300',
                  'focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500',
                  'group-hover:border-gray-300',
                  phoneError ? 'border-red-300 bg-red-50' : 'border-gray-200'
                ]"
                required
              />
              <div class="absolute inset-y-0 left-0 flex items-center pl-4">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
              </div>
              <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                <span class="text-xs text-gray-400 font-mono">{{ phoneNumber.replace(/\D/g, '').length }}/10</span>
              </div>
            </div>
            <p v-if="phoneError" class="text-red-500 text-sm">{{ phoneError }}</p>
          </div>

          <button
            type="submit"
            :disabled="!email || !phoneNumber || isLoading"
            :class="[
              'w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform mt-6',
              'focus:outline-none focus:ring-4 focus:ring-blue-100 relative overflow-hidden',
              email && phoneNumber && !isLoading
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-[1.02] hover:shadow-xl' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            <span v-if="isLoading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m0 12v4m8-8h-4M4 12H0"></path>
              </svg>
              กำลังตรวจสอบ...
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              ส่งรหัส OTP
            </span>
          </button>
        </form>
      </div>

      <!-- Step 2: OTP Verification -->
      <div v-if="currentStep === 'otp'" class="relative z-10">
        <OTPAdministrator
          ref="otpAdministrator"
          :phone-number="phoneNumber"
          :generated-otp="generatedOtp"
          :is-loading="isLoading"
          @verified="handleOtpVerified"
          @resend="handleOtpResend"
        />
      </div>

      <!-- Step 3: Reset Password -->
      <div v-if="currentStep === 'reset'" class="space-y-6 relative z-10">
        <form @submit.prevent="handlePasswordReset">
          <!-- New Password -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">รหัสผ่านใหม่</label>
            <div class="relative group">
              <input
                v-model="newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                placeholder="ระบุรหัสผ่านใหม่"
                class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pl-12 pr-12 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 group-hover:border-gray-300"
                required
              />
              <div class="absolute inset-y-0 left-0 flex items-center pl-4">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <button type="button" @click="showNewPassword = !showNewPassword" class="absolute inset-y-0 right-0 flex items-center pr-4">
                <svg v-if="showNewPassword" class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                </svg>
                <svg v-else class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">ยืนยันรหัสผ่าน</label>
            <div class="relative group">
              <input
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="ยืนยันรหัสผ่านใหม่"
                class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pl-12 pr-12 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 group-hover:border-gray-300"
                required
              />
              <div class="absolute inset-y-0 left-0 flex items-center pl-4">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute inset-y-0 right-0 flex items-center pr-4">
                <svg v-if="showConfirmPassword" class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                </svg>
                <svg v-else class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
          </div>

          <p v-if="passwordError" class="text-red-500 text-sm">{{ passwordError }}</p>

          <!-- Password Requirements -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <h4 class="text-sm font-semibold text-blue-800 mb-2">ข้อกำหนดรหัสผ่าน:</h4>
            <ul class="text-xs text-blue-700 space-y-1">
              <li class="flex items-center gap-2">
                <svg class="w-3 h-3" :class="newPassword.length >= 8 ? 'text-green-500' : 'text-gray-400'" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                มีความยาวอย่างน้อย 8 ตัวอักษร
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-3 h-3" :class="/[A-Z]/.test(newPassword) ? 'text-green-500' : 'text-gray-400'" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                มีตัวอักษรพิมพ์ใหญ่อย่างน้อย 1 ตัว
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-3 h-3" :class="/[a-z]/.test(newPassword) ? 'text-green-500' : 'text-gray-400'" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                มีตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-3 h-3" :class="/[0-9]/.test(newPassword) ? 'text-green-500' : 'text-gray-400'" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                มีตัวเลขอย่างน้อย 1 ตัว
              </li>
            </ul>
          </div>

          <button
            type="submit"
            :disabled="!isPasswordValid || isLoading"
            :class="[
              'w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform mt-6',
              'focus:outline-none focus:ring-4 focus:ring-green-100',
              isPasswordValid && !isLoading
                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:scale-[1.02] hover:shadow-xl' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            <span v-if="isLoading" class="flex items-center justify-center gap-2">
              <svg class="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m0 12v4m8-8h-4M4 12H0"></path>
              </svg>
              กำลังตั้งรหัสผ่าน...
            </span>
            <span v-else>ตั้งรหัสผ่านใหม่</span>
          </button>
        </form>
      </div>

      <!-- Success Message -->
      <div v-if="currentStep === 'success'" class="text-center space-y-6 relative z-10">
        <div class="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center">
          <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">ตั้งรหัสผ่านใหม่สำเร็จ!</h3>
          <p class="text-gray-600">ท่านสามารถเข้าสู่ระบบด้วยรหัสผ่านใหม่ได้แล้ว</p>
        </div>
        <button
          @click="goToLogin"
          class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-100"
        >
          เข้าสู่ระบบ
        </button>
      </div>

      <!-- Back to Login Link -->
      <div v-if="currentStep !== 'success'" class="text-center pt-6 border-t border-gray-100 relative z-10">
        <router-link
          to="/login-administrator"
          class="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all duration-200 text-sm"
        >
          ← กลับไปหน้าเข้าสู่ระบบ
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import OTPAdministrator from './OTPAdministrator.vue'

const router = useRouter()

// Refs
const otpAdministrator = ref(null)

// Data
const currentStep = ref('email') // 'email', 'otp', 'reset', 'success'
const isLoading = ref(false)

// Email step data
const email = ref('')
const phoneNumber = ref('')
const emailError = ref('')
const phoneError = ref('')

// OTP step data
const generatedOtp = ref('')

// Password step data
const newPassword = ref('')
const confirmPassword = ref('')
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const passwordError = ref('')

// Mock database
const mockDatabase = [
  { email: 'admin01@gmail.com', phone: '0811577922', role: 'admin' },
  { email: 'admin02@gmail.com', phone: '0812345678', role: 'admin' },
  { email: 'superadmin01@gmail.com', phone: '0845678901', role: 'superadmin' },
  { email: 'superadmin02@gmail.com', phone: '0856789012', role: 'superadmin' },
]

// Computed properties
const isPasswordValid = computed(() => {
  return newPassword.value.length >= 8 &&
         /[A-Z]/.test(newPassword.value) &&
         /[a-z]/.test(newPassword.value) &&
         /[0-9]/.test(newPassword.value) &&
         newPassword.value === confirmPassword.value
})

// Methods
const getTitle = () => {
  switch (currentStep.value) {
    case 'email':
      return 'ลืมรหัสผ่าน'
    case 'otp':
      return 'ยืนยันรหัส OTP'
    case 'reset':
      return 'ตั้งรหัสผ่านใหม่'
    default:
      return 'สำเร็จ!'
  }
}

const getDescription = () => {
  switch (currentStep.value) {
    case 'email':
      return 'กรุณาระบุอีเมลและเบอร์โทรเพื่อรีเซ็ตรหัสผ่าน'
    case 'otp':
      return 'กรุณากรอกรหัส OTP ที่ส่งไปยังเบอร์โทรของท่าน'
    case 'reset':
      return 'กรุณาตั้งรหัสผ่านใหม่ของท่าน'
    default:
      return 'ตั้งรหัสผ่านใหม่เรียบร้อย'
  }
}

const onlyNumberInput = (e) => {
  const char = String.fromCharCode(e.which)
  if (!/[0-9]/.test(char)) {
    e.preventDefault()
  }
}

const formatPhoneNumber = (e) => {
  let value = e.target.value.replace(/\D/g, '')
  if (value.length > 10) {
    value = value.slice(0, 10)
  }
  
  // Format as XXX-XXX-XXXX
  if (value.length >= 6) {
    value = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
  } else if (value.length >= 3) {
    value = value.replace(/(\d{3})(\d{0,3})/, '$1-$2')
  }
  
  phoneNumber.value = value
  clearPhoneError()
}

const clearEmailError = () => {
  emailError.value = ''
}

const clearPhoneError = () => {
  phoneError.value = ''
}

const validateEmail = () => {
  if (!email.value) {
    emailError.value = 'กรุณากรอกอีเมล'
    return false
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = 'รูปแบบอีเมลไม่ถูกต้อง'
    return false
  }
  return true
}

const validatePhone = () => {
  const cleaned = phoneNumber.value.replace(/\D/g, '')
  if (!phoneNumber.value) {
    phoneError.value = 'กรุณากรอกเบอร์โทรศัพท์'
    return false
  }
  if (!/^\d{10}$/.test(cleaned)) {
    phoneError.value = 'เบอร์โทรต้องเป็นตัวเลข 10 หลัก'
    return false
  }
  return true
}

const handleEmailSubmit = async () => {
  emailError.value = ''
  phoneError.value = ''
  
  if (!validateEmail() || !validatePhone()) {
    return
  }
  
  isLoading.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const cleanedPhone = phoneNumber.value.replace(/\D/g, '')
    const user = mockDatabase.find(u => 
      u.email.toLowerCase() === email.value.toLowerCase() && 
      u.phone === cleanedPhone
    )
    
    if (!user) {
      emailError.value = 'ไม่พบข้อมูลผู้ใช้ในระบบ กรุณาตรวจสอบอีเมลและเบอร์โทร'
      return
    }
    
    // Generate OTP
    generatedOtp.value = Math.floor(100000 + Math.random() * 900000).toString()
    console.log('Generated OTP:', generatedOtp.value) // For testing purposes
    
    currentStep.value = 'otp'
    
  } catch (error) {
    emailError.value = 'เกิดข้อผิดพลาดในการตรวจสอบข้อมูล กรุณาลองใหม่อีกครั้ง'
  } finally {
    isLoading.value = false
  }
}

const handleOtpVerified = async (otpCode) => {
  isLoading.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    currentStep.value = 'reset'
  } catch (error) {
    console.error('OTP verification failed:', error)
  } finally {
    isLoading.value = false
  }
}

const handleOtpResend = () => {
  generatedOtp.value = Math.floor(100000 + Math.random() * 900000).toString()
  console.log('New OTP:', generatedOtp.value) // For testing purposes
}

const handlePasswordReset = async () => {
  passwordError.value = ''
  
  if (!newPassword.value) {
    passwordError.value = 'กรุณากรอกรหัสผ่านใหม่'
    return
  }
  
  if (!isPasswordValid.value) {
    passwordError.value = 'รหัสผ่านไม่ตรงตามข้อกำหนด'
    return
  }
  
  isLoading.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    currentStep.value = 'success'
    
  } catch (error) {
    passwordError.value = 'เกิดข้อผิดพลาดในการตั้งรหัสผ่าน กรุณาลองใหม่อีกครั้ง'
  } finally {
    isLoading.value = false
  }
}

const goToLogin = () => {
  router.push('/login-administrator')
}
</script>

<style scoped>
.group:hover .group-hover\:translate-x-full {
  transform: translateX(100%);
}
</style>