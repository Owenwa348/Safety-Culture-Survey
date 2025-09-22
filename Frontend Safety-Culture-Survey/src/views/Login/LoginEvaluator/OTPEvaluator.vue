<!-- OTPEvaluator -->
<template>
  <div class="space-y-6">
    <form @submit.prevent="handleOtpVerification">
      <!-- OTP Input -->
      <div class="space-y-2">
        <label class="block text-sm font-semibold text-gray-700 text-center">
          รหัส OTP ถูกส่งไปที่เบอร์ {{ maskedPhoneNumber }}
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
            class="w-12 h-12 text-center text-2xl font-bold border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
            :class="otpError ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:border-blue-500'"
          />
        </div>

        <p v-if="otpError" class="text-red-500 text-sm flex items-center justify-center gap-1">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          {{ otpError }}
        </p>
      </div>

      <!-- Countdown Timer -->
      <div class="text-center">
        <p v-if="otpCountdown > 0" class="text-sm text-gray-500">
          ส่งรหัสใหม่ได้ใน {{ otpCountdown }} วินาที
        </p>
        <button
          v-else
          @click="handleResendOtp"
          type="button"
          class="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors duration-200"
        >
          ส่งรหัส OTP ใหม่
        </button>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="otpCode.length !== 6 || isLoading"
        class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <span v-if="isLoading" class="flex items-center justify-center gap-2">
          <svg class="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v4m0 12v4m8-8h-4M4 12H0m15.314-7.314l-2.828 2.828M9.172 16.828l-2.828 2.828M20.485 20.485l-2.828-2.828M6.343 6.343L3.515 3.515"></path>
          </svg>
          กำลังตรวจสอบ...
        </span>
        <span v-else class="flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          ยืนยันรหัส OTP
        </span>
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
const otpCountdown = ref(60)
const otpTimer = ref(null)

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
const startOtpCountdown = () => {
  otpCountdown.value = 60
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
  if (otpInputs.value[0]) {
    otpInputs.value[0].focus()
  }
  
  // Emit resend event
  emit('resend')
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
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    // Focus previous input on backspace
    otpInputs.value[index - 1].focus()
  } else if (event.key === 'ArrowLeft' && index > 0) {
    otpInputs.value[index - 1].focus()
  } else if (event.key === 'ArrowRight' && index < 5) {
    otpInputs.value[index + 1].focus()
  }
}

const handleOtpPaste = (event) => {
  event.preventDefault()
  const paste = (event.clipboardData || window.clipboardData).getData('text')
  const digits = paste.replace(/\D/g, '').slice(0, 6).split('')
  
  for (let i = 0; i < 6; i++) {
    otpDigits.value[i] = digits[i] || ''
  }
  
  // Focus last filled input or first empty input
  const lastFilledIndex = digits.length - 1
  const targetIndex = Math.min(lastFilledIndex + 1, 5)
  if (otpInputs.value[targetIndex]) {
    otpInputs.value[targetIndex].focus()
  }
}

const handleOtpVerification = async () => {
  if (otpCode.value.length !== 6) {
    otpError.value = 'กรุณากรอกรหัส OTP ให้ครบ 6 หลัก'
    return
  }
  
  if (otpCode.value !== props.generatedOtp) {
    otpError.value = 'รหัส OTP ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง'
    return
  }
  
  // Clear OTP timer
  if (otpTimer.value) {
    clearInterval(otpTimer.value)
  }
  
  // Emit verified event
  emit('verified', otpCode.value)
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
  // Initialize OTP inputs array
  otpInputs.value = []
  
  // Start countdown when component mounts
  startOtpCountdown()
  
  // Focus first input
  focusFirstInput()
})

onUnmounted(() => {
  // Clear OTP timer on component unmount
  if (otpTimer.value) {
    clearInterval(otpTimer.value)
  }
})
</script>