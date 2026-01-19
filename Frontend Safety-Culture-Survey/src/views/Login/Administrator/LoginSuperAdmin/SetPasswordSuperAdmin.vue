<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-red-100">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="mx-auto w-16 h-16 bg-gradient-to-r from-purple-100 to-red-100 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-800 mb-2">ระบุข้อมูลผู้ดูแลระบบสูงสุด</h1>
        <p class="text-gray-600 text-sm">สำหรับผู้ดูแลระดับสูงสุด (Super Administrator)</p>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm text-red-700 text-center">{{ errorMessage }}</p>
      </div>
      <!-- Success Message -->
      <div v-if="successMessage" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <p class="text-sm text-green-700 text-center">{{ successMessage }}</p>
      </div>

      <form @submit.prevent="handleSetPassword" class="space-y-6">
        <!-- Email -->
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">อีเมล</label>
          <div class="relative">
            <input
              v-model="email"
              type="email"
              placeholder="superadmin@company.com"
              disabled
              class="w-full border-2 rounded-xl px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 pl-11 bg-gray-100 cursor-not-allowed"
              required
            />
            <div class="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Phone Number -->
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">เบอร์โทรศัพท์</label>
          <div class="relative">
            <input
              v-model="phone"
              type="tel"
              placeholder="0812345678"
              class="w-full border-2 rounded-xl px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 pl-11"
              required
              minlength="10"
              maxlength="10"
              pattern="[0-9]{10}"
            />
            <div class="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- PIN Code -->
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">รหัส PIN (6 หลัก)</label>
          <div class="relative">
            <input
              v-model="pin"
              type="password"
              placeholder="••••••"
              class="w-full border-2 rounded-xl px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 pl-11 text-center text-2xl tracking-widest"
              required
              minlength="6"
              maxlength="6"
              pattern="[0-9]{6}"
              autocomplete="off"
            />
            <div class="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- New Password -->
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">รหัสผ่านใหม่</label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="ระบุรหัสผ่านที่มีความปลอดภัยสูง"
              class="w-full border-2 rounded-xl px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 pl-11 pr-11"
              required
              minlength="10"
            />
            <div class="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <button type="button" @click="showPassword = !showPassword" class="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg v-if="showPassword" class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path></svg>
              <svg v-else class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            </button>
          </div>
        </div>

        <!-- Confirm Password -->
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">ยืนยันรหัสผ่าน</label>
          <div class="relative">
            <input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="ระบุรหัสผ่านอีกครั้ง"
              class="w-full border-2 rounded-xl px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 pl-11 pr-11"
              required
              minlength="10"
            />
             <div class="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg v-if="showConfirmPassword" class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path></svg>
                <svg v-else class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            </button>
          </div>
        </div>

        <!-- Password mismatch warning -->
        <div v-if="password && confirmPassword && password !== confirmPassword" class="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>
            รหัสผ่านไม่ตรงกัน
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="!canSubmit || isLoading"
          :class="[
            'w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform focus:outline-none focus:ring-4 focus:ring-purple-100',
            canSubmit
              ? 'bg-gradient-to-r from-purple-600 to-red-600 text-white hover:scale-[1.02] hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          ]"
        >
          <span v-if="isLoading">กำลังบันทึก...</span>
          <span v-else class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            ตั้งรหัสผ่านผู้ดูแลสูงสุด
          </span>
        </button>
        
        <!-- Back to Login -->
        <div class="text-center pt-4">
          <router-link
            :to="{ name: 'LoginAll' }"
            class="text-sm text-gray-600 hover:text-purple-600 transition-colors duration-200"
          >
            กลับไปหน้าล็อกอิน
          </router-link>
        </div> 
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

// Form state
const email = ref('');
const phone = ref('');
const pin = ref('');
const password = ref('');
const confirmPassword = ref('');

// UI state
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// API URL
const API_URL = '/api/super-admins/setup';

// Extract email from URL on component mount
onMounted(() => {
  const emailParam = route.query.email;
  if (emailParam) {
    email.value = emailParam;
  } else {
    errorMessage.value = "ไม่พบอีเมลใน URL สำหรับการตั้งรหัสผ่าน";
  }
});

// Validation and submission logic
const canSubmit = computed(() => {
  return email.value &&
         phone.value &&
         phone.value.length === 10 &&
         /^[0-9]{10}$/.test(phone.value) &&
         pin.value &&
         pin.value.length === 6 &&
         /^[0-9]{6}$/.test(pin.value) &&
         password.value &&
         password.value.length >= 10 &&
         password.value === confirmPassword.value &&
         !isLoading.value;
});

async function handleSetPassword() {
  if (!canSubmit.value) {
    errorMessage.value = 'กรุณากรอกข้อมูลให้ถูกต้องและครบถ้วนตามรูปแบบที่กำหนด';
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    await axios.post(API_URL, {
      email: email.value,
      phone: phone.value,
      pin: pin.value,
      password: password.value,
    });

    successMessage.value = 'ตั้งรหัสผ่านสำเร็จ! กำลังนำท่านกลับไปหน้าล็อกอิน...';
    
    setTimeout(() => {
      router.push({ name: 'LoginAll' });
    }, 2500);

  } catch (error) {
    if (error.response) {
      errorMessage.value = error.response.data.message || 'เกิดข้อผิดพลาดในการตั้งรหัสผ่าน';
    } else {
      errorMessage.value = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้';
    }
  } finally {
    isLoading.value = false;
  }
}
</script>
