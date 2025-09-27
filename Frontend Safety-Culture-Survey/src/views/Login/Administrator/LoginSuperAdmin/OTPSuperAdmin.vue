<!-- OTPSuperAdmin.vue - สำหรับ Super Administrator -->
<template>
  <div class="space-y-6">
    <form @submit.prevent="handleOtpVerification">
      <!-- OTP Input -->
      <div class="space-y-2">
        <label class="block text-sm font-semibold text-gray-700 text-center">
          รหัส OTP พิเศษถูกส่งไปที่เบอร์ {{ maskedPhoneNumber }}
        </label>
        
        <!-- OTP Input Fields -->
        <div class="flex justify-center gap-3 my-6">
          <input
            v-for="(digit, index) in otpDigits"
            :key="index"
            :ref="el => otpInputs[index] = el"
            v-model="otpDigits[index]"
            @input="handleOtpInput(index, $event)"
            @keydown="handleOtpKeydown(index, $event)"
            @paste="handleOtpPaste"
            type="text"
            maxlength="1"
            class="w-14 h-14 text-center text-2xl font-bold border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 shadow-sm"
            :class="otpError ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:border-purple-500 hover:border-purple-300'"
          />
        </div>

        <p v-if="otpError" class="text-red-500 text-sm flex items-center justify-center gap-1">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          {{ otpError }}
        </p>
      </div>

      <!-- Countdown Timer with Enhanced Style -->
      <div class="text-center">
        <p v-if="otpCountdown > 0" class="text-sm text-purple-600 font-medium">
          <span class="inline-flex items-center gap-2">
            <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            รหัสหมดอายุในอีก {{ formatTime(otpCountdown) }}
          </span>
        </p>
        <button
          v-else
          @click="handleResendOtp"
          type="button"
          class="text-sm text-purple-600 hover:text-purple-700 hover:underline font-medium transition-all duration-300 transform hover:scale-105"
        >
          <span class="flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            ขอรหัส OTP ใหม่
          </span>
        </button>
      </div>

      <!-- Submit Button with Enhanced Design -->
      <button
        type="submit"
        :disabled="otpCode.length !== 6 || isLoading"
        :class="[
          'w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-purple-100 relative overflow-hidden',
          otpCode.length === 6 && !isLoading
            ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white hover:scale-[1.02] hover:shadow-xl shadow-lg' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed hover:scale-100'
        ]"
      >
        <span v-if="isLoading" class="flex items-center justify-center gap-2">
          <svg class="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m0 12v4m8-8h-4M4 12H0m15.314-7.314l-2.828 2.828M9.172 16.828l-2.828 2.828M20.485 20.485l-2.828-2.828M6.343 6.343L3.515 3.515"></path>
          </svg>
          กำลังยืนยันสิทธิ์...
        </span>
        <span v-else class="flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
          เข้าสู่ระบบ Super Admin
        </span>
        
        <!-- Animated background for enabled state -->
        <div v-if="otpCode.length === 6 && !isLoading" 
             class="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
      </button>
    </form>
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
const otpInputs = ref([])
const otpError = ref('')
const otpCountdown = ref(180) // Super Admin มีเวลา 3 นาที
const otpTimer = ref(null)

// Computed properties
const otpCode = computed(() => {
  return otpDigits.value.join('')
})

const maskedPhoneNumber = computed(() => {
  if (!props.phoneNumber) return ''
  const cleaned = props.phoneNumber.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-XXXX-${cleaned.slice(7)}`
  }
  return props.phoneNumber
})

// Methods
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const startOtpCountdown = () => {
  otpCountdown.value = 180
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

const handleResendOtp = () => {
  // Clear OTP inputs
  otpDigits.value = ['', '', '', '', '', '']
  otpError.value = ''
  
  // Start new countdown
  startOtpCountdown()
  
  // Focus first input
  setTimeout(() => {
    if (otpInputs.value[0]) {
      otpInputs.value[0].focus()
    }
  }, 100)
  
  // Emit resend event with super admin flag
  emit('resend', { isSuperAdmin: true })
}

const handleOtpInput = (index, event) => {
  const value = event.target.value.replace(/\D/g, '')
  
  if (value) {
    otpDigits.value[index] = value
    
    // Auto focus next input
    if (index < 5 && otpInputs.value[index + 1]) {
      otpInputs.value[index + 1].focus()
    }
  }
  
  otpError.value = ''
}

const handleOtpKeydown = (index, event) => {
  if (event.key === 'Backspace') {
    if (!otpDigits.value[index] && index > 0) {
      otpInputs.value[index - 1].focus()
    } else {
      otpDigits.value[index] = ''
    }
  } else if (event.key === 'ArrowLeft' && index > 0) {
    otpInputs.value[index - 1].focus()
  } else if (event.key === 'ArrowRight' && index < 5) {
    otpInputs.value[index + 1].focus()
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
  if (otpInputs.value[targetIndex]) {
    otpInputs.value[targetIndex].focus()
  }
  
  otpError.value = ''
}

const handleOtpVerification = async () => {
  if (otpCode.value.length !== 6) {
    otpError.value = 'กรุณากรอกรหัส OTP ให้ครบ 6 หลัก'
    return
  }
  
  if (otpCode.value !== props.generatedOtp) {
    otpError.value = 'รหัส OTP ไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง'
    otpDigits.value = ['', '', '', '', '', '']
    if (otpInputs.value[0]) {
      otpInputs.value[0].focus()
    }
    return
  }
  
  if (otpTimer.value) {
    clearInterval(otpTimer.value)
  }
  
  emit('verified', { code: otpCode.value, role: 'superadmin' })
}

// Methods to expose to parent
const focusFirstInput = () => {
  setTimeout(() => {
    if (otpInputs.value[0]) {
      otpInputs.value[0].focus()
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
  otpInputs.value = []
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
  box-shadow: 0 0 0 4px rgba(147, 51, 234, 0.1);
}

.countdown-text {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Super Admin specific animations */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.shimmer::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  animation: shimmer 2s infinite;
}
</style>