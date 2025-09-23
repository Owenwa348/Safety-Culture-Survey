<!-- OTPAdmin.vue - สำหรับ Administrator -->
<template>
  <div class="space-y-6">
    <form @submit.prevent="handleOtpVerification">
      <!-- OTP Input -->
      <div class="space-y-4">
        <label class="block text-sm font-semibold text-gray-700 text-center">
          รหัส OTP ถูกส่งไปที่เบอร์ {{ maskedPhoneNumber }}
        </label>
        
        <!-- OTP Input Fields -->
        <div class="flex justify-center gap-3 my-6">
          <input
            v-for="(digit, index) in otpDigits"
            :key="index"
            :ref="el => setOtpInputRef(el, index)"
            v-model="otpDigits[index]"
            @input="handleOtpInput(index, $event)"
            @keydown="handleOtpKeydown(index, $event)"
            @paste="handleOtpPaste"
            type="text"
            inputmode="numeric"
            maxlength="1"
            class="w-12 h-12 text-center text-2xl font-bold border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 shadow-sm hover:border-gray-400"
            :class="otpError ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:border-blue-500'"
          />
        </div>

        <p v-if="otpError" class="text-red-500 text-sm flex items-center justify-center gap-2">
          <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          {{ otpError }}
        </p>
      </div>

      <!-- Countdown Timer / Resend -->
      <div class="text-center mb-6">
        <div v-if="otpCountdown > 0" class="space-y-2">
          <p class="text-sm text-gray-500">
            ส่งรหัสใหม่ได้ในอีก <span class="font-mono font-bold text-blue-600">{{ formatCountdown(otpCountdown) }}</span>
          </p>
          <div class="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              class="bg-gradient-to-r from-blue-500 to-indigo-600 h-1.5 rounded-full transition-all duration-1000"
              :style="{ width: `${(otpCountdown / 120) * 100}%` }"
            ></div>
          </div>
        </div>
        <button
          v-else
          @click="handleResendOtp"
          type="button"
          :disabled="isResending"
          class="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
        >
          <span class="flex items-center justify-center gap-2">
            <svg v-if="!isResending" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isResending ? 'กำลังส่ง...' : 'ส่งรหัส OTP ใหม่' }}
          </span>
        </button>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="otpCode.length !== 6 || isLoading"
        :class="[
          'w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-blue-100 relative overflow-hidden',
          otpCode.length === 6 && !isLoading
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-[1.02] hover:shadow-xl hover:from-blue-700 hover:to-indigo-700' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed hover:scale-100'
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
          เข้าสู่ระบบ Admin
        </span>

        <!-- Button shine effect -->
        <div v-if="otpCode.length === 6 && !isLoading" class="absolute inset-0 -top-1 -bottom-1 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
      </button>
    </form>

    <!-- Help Text -->
    <div class="text-center pt-4 border-t border-gray-100">
      <p class="text-xs text-gray-500">
        หากไม่ได้รับรหัส OTP กรุณาตรวจสอบเบอร์โทรศัพท์หรือติดต่อ Super Admin
      </p>
      <p class="text-xs text-gray-400 mt-1">
        รหัส OTP มีอายุ 2 นาที
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
  phoneNumber: {
    type: String,
    required: true
  },
  generatedOtp: {
    type: String,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['verified', 'resend'])

// Data
const otpDigits = ref(['', '', '', '', '', ''])
const otpInputRefs = ref([])
const otpError = ref('')
const otpCountdown = ref(120) // Admin มีเวลา 2 นาที
const otpTimer = ref(null)
const isResending = ref(false)

// Computed properties
const otpCode = computed(() => {
  return otpDigits.value.join('')
})

const maskedPhoneNumber = computed(() => {
  if (!props.phoneNumber) return ''
  const cleaned = props.phoneNumber.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-XXX-${cleaned.slice(6)}`
  }
  return props.phoneNumber
})

// Methods
const setOtpInputRef = (el, index) => {
  if (el) {
    otpInputRefs.value[index] = el
  }
}

const formatCountdown = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const startOtpCountdown = () => {
  otpCountdown.value = 120
  if (otpTimer.value) {
    clearInterval(otpTimer.value)
  }
  otpTimer.value = setInterval(() => {
    otpCountdown.value--
    if (otpCountdown.value <= 0) {
      clearInterval(otpTimer.value)
    }
  }, 1000)
}

const handleResendOtp = async () => {
  isResending.value = true
  
  try {
    // จำลอง API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Clear OTP inputs
    otpDigits.value = ['', '', '', '', '', '']
    otpError.value = ''
    
    // Start new countdown
    startOtpCountdown()
    
    // Focus first input
    setTimeout(() => {
      if (otpInputRefs.value[0]) {
        otpInputRefs.value[0].focus()
      }
    }, 100)
    
    // Emit resend event
    emit('resend')
  } catch (error) {
    otpError.value = 'เกิดข้อผิดพลาดในการส่งรหัส OTP ใหม่'
  } finally {
    isResending.value = false
  }
}

const handleOtpInput = (index, event) => {
  const value = event.target.value.replace(/\D/g, '')
  
  if (value) {
    otpDigits.value[index] = value
    
    // Auto focus next input
    if (index < 5 && otpInputRefs.value[index + 1]) {
      otpInputRefs.value[index + 1].focus()
    }
  }
  
  otpError.value = ''
}

const handleOtpKeydown = (index, event) => {
  if (event.key === 'Backspace') {
    if (!otpDigits.value[index] && index > 0) {
      otpInputRefs.value[index - 1].focus()
    } else {
      otpDigits.value[index] = ''
    }
  } else if (event.key === 'ArrowLeft' && index > 0) {
    otpInputRefs.value[index - 1].focus()
  } else if (event.key === 'ArrowRight' && index < 5) {
    otpInputRefs.value[index + 1].focus()
  } else if (!/^[0-9]$/.test(event.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
    event.preventDefault()
  }
}

const handleOtpPaste = (event) => {
  event.preventDefault()
  const paste = (event.clipboardData || window.clipboardData).getData('text')
  const digits = paste.replace(/\D/g, '').slice(0, 6).split('')
  
  for (let i = 0; i < 6; i++) {
    otpDigits.value[i] = digits[i] || ''
  }
  
  const lastFilledIndex = digits.length - 1
  const targetIndex = Math.min(lastFilledIndex + 1, 5)
  if (otpInputRefs.value[targetIndex]) {
    otpInputRefs.value[targetIndex].focus()
  }
  
  otpError.value = ''
}

const handleOtpVerification = async () => {
  if (otpCode.value.length !== 6) {
    otpError.value = 'กรุณากรอกรหัส OTP ให้ครบ 6 หลัก'
    return
  }
  
  if (otpCountdown.value <= 0) {
    otpError.value = 'รหัส OTP หมดอายุแล้ว กรุณาขอรหัสใหม่'
    return
  }
  
  if (otpCode.value !== props.generatedOtp) {
    otpError.value = 'รหัส OTP ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง'
    otpDigits.value = ['', '', '', '', '', '']
    if (otpInputRefs.value[0]) {
      otpInputRefs.value[0].focus()
    }
    return
  }
  
  if (otpTimer.value) {
    clearInterval(otpTimer.value)
  }
  
  emit('verified', otpCode.value)
}

// Methods to expose to parent
const focusFirstInput = () => {
  setTimeout(() => {
    if (otpInputRefs.value[0]) {
      otpInputRefs.value[0].focus()
    }
  }, 100)
}

const clearOtp = () => {
  otpDigits.value = ['', '', '', '', '', '']
  otpError.value = ''
}

// Expose methods to parent
defineExpose({
  startOtpCountdown,
  focusFirstInput,
  clearOtp
})

// Lifecycle hooks
onMounted(() => {
  startOtpCountdown()
  focusFirstInput()
})

onUnmounted(() => {
  if (otpTimer.value) {
    clearInterval(otpTimer.value)
  }
})
</script>

<style scoped>
.otp-input {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.otp-input:focus {
  transform: scale(1.05);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>