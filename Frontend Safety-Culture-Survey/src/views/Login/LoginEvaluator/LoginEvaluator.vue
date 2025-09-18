<!-- LoginEvaluator -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 ">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-800 mb-2">เข้าสู่ระบบผู้ประเมิน</h1>
        <p class="text-gray-600 text-sm">กรุณาเข้าสู่ระบบเพื่อใช้งาน</p>
      </div>

      <form class="space-y-6" @submit.prevent="handleLogin">
        <!-- Email -->
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">อีเมล</label>
          <div class="relative">
            <input
              type="email"
              v-model="email"
              @input="clearError('email')"
              placeholder="กรอกอีเมลของคุณ"
              class="w-full border-2 rounded-xl px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 pl-11"
              :class="errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'"
            />
            <div class="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 01-8 0 4 4 0 018 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
              </svg>
            </div>
          </div>
          <p v-if="errors.email" class="text-red-500 text-sm flex items-center gap-1">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            {{ errors.email }}
          </p>
        </div>

        <!-- Password -->
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">รหัสผ่าน</label>
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              @input="clearError('password')"
              placeholder="กรอกรหัสผ่าน"
              class="w-full border-2 rounded-xl px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 pl-11 pr-11"
              :class="errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'"
            />
            <!-- Lock Icon -->
            <div class="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <!-- Toggle Password Button -->
            <button
              type="button"
              @click="togglePassword"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <!-- Eye Open Icon -->
              <svg
                v-if="!showPassword"
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              <!-- Eye Closed Icon -->
              <svg
                v-else
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.941-4.243m3.12-2.12A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.243 4.243m-3.12 2.12L4.22 4.22"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.88 9.88A3 3 0 0014.12 14.12"/>
              </svg>
            </button>
          </div>
          <p v-if="errors.password" class="text-red-500 text-sm flex items-center gap-1">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            {{ errors.password }}
          </p>
        </div>

        <!-- Login Error -->
        <div v-if="loginError" class="p-4 rounded-xl border-2 bg-red-50 border-red-200">
          <div class="flex items-center gap-3 text-red-700">
            <svg class="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            <p class="font-semibold">{{ loginError }}</p>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="!email || !password"
          class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <span class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
            </svg>
            เข้าสู่ระบบ
          </span>
        </button>

        <!-- Links -->
        <div class="space-y-3 pt-4 border-t border-gray-100">
          <p class="text-sm text-center">
            <router-link
              to="/forgot-password-evaluator"
              class="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all duration-200"
            >
              ลืมรหัสผ่าน?
            </router-link>
          </p>

          <p class="text-sm text-center">
            <span class="text-gray-500">ยังไม่มีบัญชี? </span>
            <router-link
              to="/evaluator-registration"
              class="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all duration-200"
            >
              ลงทะเบียนที่นี่
            </router-link>
          </p>
          
          <p class="text-sm text-center">
            <router-link
              to="/login-administrator"
              class="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all duration-200"
            >
              เข้าสู่ระบบสำหรับบุคลากรภายใน
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref("");
const password = ref("");
const errors = ref({});
const loginError = ref("");
const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const mockUsers = [
  { email: "user@example.com", password: "123456" },
];

// ฟังก์ชันล้าง error ของ field ที่กำหนด
const clearError = (field) => {
  if (errors.value[field]) {
    delete errors.value[field];
  }
  clearLoginError();
};

// ฟังก์ชันล้าง login error
const clearLoginError = () => {
  if (loginError.value) {
    loginError.value = "";
  }
};

// ฟังก์ชันตรวจสอบรูปแบบอีเมล
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validate = () => {
  errors.value = {};
  loginError.value = "";

  if (!email.value) {
    errors.value.email = "กรุณากรอกอีเมล";
  } else if (!isValidEmail(email.value)) {
    errors.value.email = "รูปแบบอีเมลไม่ถูกต้อง";
  }

  if (!password.value) {
    errors.value.password = "กรุณากรอกรหัสผ่าน";
  } else if (password.value.length < 6) {
    errors.value.password = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
  }

  return Object.keys(errors.value).length === 0;
};

const handleLogin = () => {
  if (!validate()) return;

  const user = mockUsers.find(
    (u) =>
      u.email === email.value &&
      u.password === password.value
  );

  if (!user) {
    loginError.value = "อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่อีกครั้ง";
    return;
  }

  // Use auth composable to login
  login('contractor', {
    email: user.email,
    role: "contractor"
  });
  
  router.push("/manage-team");
};
</script>