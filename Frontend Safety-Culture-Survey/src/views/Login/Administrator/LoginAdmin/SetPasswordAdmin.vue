<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
    <div class="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-10 border border-gray-100">
      <!-- Header -->
      <div class="text-center mb-10">
        <div class="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">ตั้งค่าบัญชีผู้ดูแลระบบ</h1>
        <p class="text-gray-500">กรุณากรอกข้อมูลเพื่อเริ่มใช้งาน</p>
      </div>

      <!-- Error/Success Messages -->
      <div 
        v-if="message" 
        :class="[
          isError ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200',
          'mb-6 p-4 rounded-xl border flex items-start gap-3'
        ]"
      >
        <svg v-if="!isError" class="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        <svg v-else class="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
        </svg>
        <span>{{ message }}</span>
      </div>

      <form @submit.prevent="handleSetPassword" class="space-y-6">
        <!-- Email (Disabled) -->
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">
            อีเมล <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <input
              v-model="email"
              type="email"
              class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pl-12 bg-gray-50 cursor-not-allowed text-gray-600"
              disabled
            />
          </div>
        </div>

        <!-- Company Name (Disabled) -->
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">
            ชื่อบริษัท/องค์กร <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <input
              v-model="companyName"
              type="text"
              class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pl-12 bg-gray-50 cursor-not-allowed text-gray-600"
              disabled
            />
          </div>
        </div>

        <!-- First Name and Last Name in Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- First Name -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">
              ชื่อ <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <input
                v-model="firstName"
                type="text"
                placeholder="ชื่อ"
                @input="validateFirstName"
                class="w-full border-2 rounded-xl px-4 py-3 pl-12 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
                :class="firstNameError ? 'border-red-300' : 'border-gray-200'"
                required
              />
            </div>
            <p v-if="firstNameError" class="text-red-600 text-xs mt-1 ml-1">{{ firstNameError }}</p>
          </div>

          <!-- Last Name -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">
              นามสกุล <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <input
                v-model="lastName"
                type="text"
                placeholder="นามสกุล"
                @input="validateLastName"
                class="w-full border-2 rounded-xl px-4 py-3 pl-12 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
                :class="lastNameError ? 'border-red-300' : 'border-gray-200'"
                required
              />
            </div>
            <p v-if="lastNameError" class="text-red-600 text-xs mt-1 ml-1">{{ lastNameError }}</p>
          </div>
        </div>

        <!-- Phone Number -->
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">
            เบอร์โทรศัพท์ <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
            </div>
            <input
              v-model="phone"
              type="tel"
              placeholder="0812345678"
              @input="validatePhone"
              maxlength="10"
              class="w-full border-2 rounded-xl px-4 py-3 pl-12 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
              :class="phoneError ? 'border-red-300' : 'border-gray-200'"
              required
            />
          </div>
          <p v-if="phoneError" class="text-red-600 text-xs mt-1 ml-1">{{ phoneError }}</p>
          <p v-else class="text-gray-500 text-xs mt-1 ml-1">กรอกเบอร์โทรศัพท์ 10 หลัก</p>
        </div>

        <!-- Password -->
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">
            รหัสผ่าน <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="อย่างน้อย 8 ตัวอักษร"
              @input="validatePassword"
              class="w-full border-2 rounded-xl px-4 py-3 pl-12 pr-12 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
              :class="passwordError ? 'border-red-300' : 'border-gray-200'"
              required
              minlength="8"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
              </svg>
            </button>
          </div>
          <p v-if="passwordError" class="text-red-600 text-xs mt-1 ml-1">{{ passwordError }}</p>
          <p v-else class="text-gray-500 text-xs mt-1 ml-1">ต้องมีความยาวอย่างน้อย 8 ตัวอักษร</p>
        </div>

        <!-- Confirm Password -->
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">
            ยืนยันรหัสผ่าน <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="กรอกรหัสผ่านอีกครั้ง"
              @input="validateConfirmPassword"
              class="w-full border-2 rounded-xl px-4 py-3 pl-12 pr-12 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
              :class="confirmPasswordError ? 'border-red-300' : 'border-gray-200'"
              required
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg v-if="!showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
              </svg>
            </button>
          </div>
          <p v-if="confirmPasswordError" class="text-red-600 text-xs mt-1 ml-1">{{ confirmPasswordError }}</p>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="!canSubmit || isLoading"
          class="w-full py-3.5 px-6 rounded-xl font-semibold text-base transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-blue-200 mt-8"
          :class="canSubmit && !isLoading 
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0' 
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
        >
          <span v-if="isLoading" class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            กำลังบันทึก...
          </span>
          <span v-else>ตั้งค่าบัญชีและเข้าสู่ระบบ</span>
        </button>
        
        <!-- Back to Login -->
        <div class="text-center pt-4">
          <router-link 
            to="/Login-all" 
            class="text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200 inline-flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            กลับไปหน้าเข้าสู่ระบบ
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
const companyName = ref('');
const firstName = ref('');
const lastName = ref('');
const phone = ref('');
const password = ref('');
const confirmPassword = ref('');

// UI state
const isLoading = ref(false);
const message = ref('');
const isError = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Validation errors
const firstNameError = ref('');
const lastNameError = ref('');
const phoneError = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');

// Extract data from URL on component mount
onMounted(() => {
  email.value = route.query.email || '';
  companyName.value = route.query.company || '';
  if (!email.value) {
    message.value = 'ไม่พบข้อมูลอีเมลที่ส่งมา กรุณากลับไปหน้าตรวจสอบอีเมล';
    isError.value = true;
  }
});

// Validation functions
const validateFirstName = (e) => {
  const value = e.target.value;
  // Allow only Thai and English letters and spaces
  const cleanedValue = value.replace(/[^ก-๙a-zA-Z\s]/g, '');
  
  if (value !== cleanedValue) {
    firstName.value = cleanedValue;
    firstNameError.value = 'กรุณากรอกเฉพาะตัวอักษรเท่านั้น';
  } else if (cleanedValue.trim() === '') {
    firstNameError.value = 'กรุณากรอกชื่อ';
  } else {
    firstNameError.value = '';
  }
};

const validateLastName = (e) => {
  const value = e.target.value;
  // Allow only Thai and English letters and spaces
  const cleanedValue = value.replace(/[^ก-๙a-zA-Z\s]/g, '');
  
  if (value !== cleanedValue) {
    lastName.value = cleanedValue;
    lastNameError.value = 'กรุณากรอกเฉพาะตัวอักษรเท่านั้น';
  } else if (cleanedValue.trim() === '') {
    lastNameError.value = 'กรุณากรอกนามสกุล';
  } else {
    lastNameError.value = '';
  }
};

const validatePhone = (e) => {
  const value = e.target.value;
  // Allow only numbers
  const cleanedValue = value.replace(/[^0-9]/g, '');
  phone.value = cleanedValue;
  
  if (cleanedValue.length > 0 && cleanedValue.length < 10) {
    phoneError.value = 'เบอร์โทรศัพท์ต้องมี 10 หลัก';
  } else if (cleanedValue.length === 10 && !cleanedValue.startsWith('0')) {
    phoneError.value = 'เบอร์โทรศัพท์ต้องขึ้นต้นด้วย 0';
  } else {
    phoneError.value = '';
  }
};

const validatePassword = () => {
  if (password.value.length > 0 && password.value.length < 8) {
    passwordError.value = 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร';
  } else {
    passwordError.value = '';
  }
  
  // Revalidate confirm password when password changes
  if (confirmPassword.value) {
    validateConfirmPassword();
  }
};

const validateConfirmPassword = () => {
  if (confirmPassword.value && password.value !== confirmPassword.value) {
    confirmPasswordError.value = 'รหัสผ่านไม่ตรงกัน';
  } else {
    confirmPasswordError.value = '';
  }
};

const canSubmit = computed(() => {
  return email.value &&
         firstName.value.trim() &&
         lastName.value.trim() &&
         phone.value.trim().length === 10 &&
         phone.value.startsWith('0') &&
         companyName.value &&
         password.value.length >= 8 &&
         password.value === confirmPassword.value &&
         !firstNameError.value &&
         !lastNameError.value &&
         !phoneError.value &&
         !passwordError.value &&
         !confirmPasswordError.value &&
         !isLoading.value;
});

const handleSetPassword = async () => {
  // Final validation before submit
  if (!canSubmit.value) {
    message.value = 'กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง';
    isError.value = true;
    return;
  }

  isLoading.value = true;
  message.value = '';
  isError.value = false;

  try {
    await axios.put('http://localhost:5000/api/admin/setup-account', {
      email: email.value,
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      phone: phone.value,
      password: password.value,
    });

    message.value = 'ตั้งค่าบัญชีสำเร็จ! กำลังนำท่านไปยังหน้าเข้าสู่ระบบ...';
    isError.value = false;

    setTimeout(() => {
      router.push({ name: 'LoginAll' });
    }, 2000);

  } catch (error) {
    isError.value = true;
    if (error.response && error.response.data) {
      message.value = error.response.data.message || 'เกิดข้อผิดพลาดในการตั้งค่าบัญชี';
    } else {
      message.value = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

.shake {
  animation: shake 0.5s;
}
</style>