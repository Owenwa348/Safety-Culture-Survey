<!-- LoginEvaluator - Assessment Platform Theme -->
<template>
  <div class="min-h-screen flex bg-gray-50">
    <!-- Left Panel - Image/Branding -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-500 relative overflow-hidden">
      <!-- Geometric Pattern Background -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0" style="background-image: linear-gradient(30deg, #0d9488 12%, transparent 12.5%, transparent 87%, #0d9488 87.5%, #0d9488), linear-gradient(150deg, #0d9488 12%, transparent 12.5%, transparent 87%, #0d9488 87.5%, #0d9488), linear-gradient(30deg, #0d9488 12%, transparent 12.5%, transparent 87%, #0d9488 87.5%, #0d9488), linear-gradient(150deg, #0d9488 12%, transparent 12.5%, transparent 87%, #0d9488 87.5%, #0d9488); background-size: 80px 140px; background-position: 0 0, 0 0, 40px 70px, 40px 70px;"></div>
      </div>
      
      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-between p-12 text-white w-full">
        <!-- Logo/Brand -->
        <div>
          <div class="flex items-center gap-3 mb-8">
            <div class="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <svg class="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold">แพลตฟอร์มแบบประเมิน</h2>
              <h2 class="text-xl font-bold">วัฒนธรรมความปลอดภัยภายในองค์กร</h2>
              <p class="text-sm text-teal-100 mt-1">Safety Culture Maturity Survey Platform</p>
            </div>
          </div>
        </div>

        <!-- Center Content -->
        <div class="space-y-8 max-w-md">
          <div>
            <h1 class="text-5xl font-bold leading-tight mb-6">
              ยินดีต้อนรับสู่<br/>
              ระบบประเมินผล
            </h1>
            <p class="text-lg text-teal-50 leading-relaxed">
              แพลตฟอร์มการประเมินวัฒนธรรมความปลอดภัยที่ทันสมัย ปลอดภัย และมีประสิทธิภาพสูง เพื่อพัฒนาองค์กรอย่างยั่งยืน
            </p>
          </div>

          <!-- Features -->
          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <div class="w-7 h-7 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-white">ระบบรักษาความปลอดภัยระดับสูง</h3>
                <p class="text-sm text-teal-100">การเข้ารหัสข้อมูลแบบ End-to-End encryption</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-7 h-7 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-white">เข้าถึงได้จากทุกที่ทุกเวลา</h3>
                <p class="text-sm text-teal-100">รองรับการทำงานบนทุกอุปกรณ์ อย่างเต็มประสิทธิภาพ</p>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-7 h-7 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-white">รายงานแบบเรียลไทม์</h3>
                <p class="text-sm text-teal-100">ติดตามผลการประเมินและวิเคราะห์ข้อมูลได้ทันที</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Panel - Login Form -->
    <div class="flex-1 flex items-center justify-center p-8 lg:p-12">
      <div class="w-full max-w-md">
        <!-- Mobile Logo -->
        <div class="lg:hidden mb-8 text-center">
          <div class="inline-flex flex-col items-center mb-4">
            <div class="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center mb-3 shadow-lg">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
            </div>
            <span class="text-lg font-bold text-slate-900">ระบบประเมินวัฒนธรรมความปลอดภัย</span>
          </div>
        </div>

        <!-- Form Header -->
        <div class="mb-10">
          <h2 class="text-3xl font-bold text-slate-900 mb-2">เข้าสู่ระบบ</h2>
          <p class="text-slate-600">กรุณากรอกข้อมูลเพื่อเข้าใช้งานระบบประเมินผล</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Email Field -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">
              อีเมล
            </label>
            <div class="relative">
              <input
                type="email"
                v-model="email"
                @input="clearError('email')"
                placeholder="name@company.com"
                :disabled="showPasswordField"
                class="w-full px-4 py-3.5 bg-white border-2 rounded-lg transition-all duration-200 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                :class="[
                  errors.email 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' 
                    : 'border-slate-300 hover:border-slate-400',
                  showPasswordField ? 'bg-slate-50 cursor-not-allowed text-slate-500' : ''
                ]"
              />
              <div v-if="showPasswordField" class="absolute right-3 top-1/2 -translate-y-1/2">
                <div class="bg-slate-200 rounded px-2.5 py-1.5 flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                  <span class="text-xs font-semibold text-slate-600">ล็อค</span>
                </div>
              </div>
            </div>
            <p v-if="errors.email" class="mt-2 text-sm text-red-600 font-medium flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
              {{ errors.email }}
            </p>
          </div>

          <!-- Password Field -->
          <div v-if="showPasswordField" class="animate-slide-down">
            <label class="block text-sm font-semibold text-slate-700 mb-2">
              รหัสผ่าน
            </label>
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                @input="clearError('password')"
                placeholder="กรอกรหัสผ่านของคุณ"
                class="w-full px-4 py-3.5 bg-white border-2 rounded-lg transition-all duration-200 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 pr-12"
                :class="errors.password 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' 
                  : 'border-slate-300 hover:border-slate-400'"
              />
              <button
                type="button"
                @click="togglePassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-teal-600 transition-colors rounded-lg hover:bg-teal-50"
              >
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.941-4.243m3.12-2.12A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.243 4.243m-3.12 2.12L4.22 4.22"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.88 9.88A3 3 0 0014.12 14.12"/>
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="mt-2 text-sm text-red-600 font-medium flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
              {{ errors.password }}
            </p>
          </div>

          <!-- Error Alert -->
          <div v-if="errorMessage" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg animate-fade-in">
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
              </svg>
              <p class="text-sm font-medium text-red-800">{{ errorMessage }}</p>
            </div>
          </div>

          <!-- Success Alert -->
          <div v-if="successMessage" class="bg-teal-50 border-l-4 border-teal-500 p-4 rounded-r-lg animate-fade-in">
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <p class="text-sm font-medium text-teal-800">{{ successMessage }}</p>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="!email || (showPasswordField && !password)"
            class="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg shadow-teal-600/30 hover:shadow-xl hover:shadow-teal-600/40 disabled:shadow-none"
          >
            <span class="flex items-center justify-center gap-2">
              {{ showPasswordField ? 'เข้าสู่ระบบ' : 'ดำเนินการต่อ' }}
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </span>
          </button>

          <!-- Back Button -->
          <button
            v-if="showPasswordField"
            type="button"
            @click="resetForm"
            class="w-full bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-slate-400 text-slate-700 font-semibold py-3.5 px-6 rounded-lg transition-all duration-200 animate-slide-down"
          >
            <span class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              แก้ไขอีเมล
            </span>
          </button>

          <!-- Links Section -->
          <div class="pt-6 space-y-4 border-t-2 border-slate-200">
            <router-link
              v-if="showPasswordField"
              to="/forgot-password-evaluator"
              class="block text-center text-slate-600 hover:text-teal-600 font-medium transition-colors duration-200"
            >
              <span class="inline-flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                </svg>
                ลืมรหัสผ่าน?
              </span>
            </router-link>

            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-slate-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-4 bg-gray-50 text-slate-500 font-medium">หรือ</span>
              </div>
            </div>

            <router-link
              to="/Login-all"
              class="block w-full border-2 border-slate-300 hover:border-teal-600 hover:bg-teal-50 text-slate-700 hover:text-teal-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200 text-center"
            >
              <span class="inline-flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                สำหรับบุคลากรภายใน
              </span>
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const email = ref("");
const password = ref("");
const errors = ref({});
const errorMessage = ref("");
const successMessage = ref("");
const showPassword = ref(false);
const showPasswordField = ref(false);

const userData = ref({
  email: "",
  company: "",
  division: ""
});

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const clearError = (field) => {
  if (errors.value[field]) {
    delete errors.value[field];
  }
  clearMessages();
};

const clearMessages = () => {
  errorMessage.value = "";
  successMessage.value = "";
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = () => {
  if (!password.value) {
    errors.value.password = "กรุณากรอกรหัสผ่าน";
    return false;
  }
  
  if (password.value.length < 6) {
    errors.value.password = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
    return false;
  }

  return true;
};

const checkEmailInSystem = async (emailToCheck) => {
  try {
    const response = await axios.post('/api/users/check-email', { email: emailToCheck });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("Email not found in system");
    }
    throw error;
  }
};

const resetForm = () => {
  showPasswordField.value = false;
  password.value = "";
  errors.value = {};
  clearMessages();
};

const handleSubmit = async () => {
  if (!showPasswordField.value) {
    await handleEmailCheck();
  } else {
    await handleLogin();
  }
};

const handleEmailCheck = async () => {
  errors.value = {};
  clearMessages();

  if (!email.value) {
    errors.value.email = "กรุณากรอกอีเมล";
    return;
  }
  
  if (!isValidEmail(email.value)) {
    errors.value.email = "รูปแบบอีเมลไม่ถูกต้อง";
    return;
  }

  try {
    const result = await checkEmailInSystem(email.value);
    
    userData.value = {
      email: result.email,
      company: result.company,
      division: result.division
    };

    if (result.isRegistered) {
      successMessage.value = "พบอีเมลในระบบ กรุณากรอกรหัสผ่าน";
      showPasswordField.value = true;
      
      setTimeout(() => {
        successMessage.value = "";
      }, 2000);
    } else {
      successMessage.value = "พบอีเมลในระบบแต่ยังไม่ได้ลงทะเบียน กำลังนำท่านไปยังหน้าลงทะเบียน...";
      
      setTimeout(() => {
        router.push({
          path: "/evaluator-registration",
          query: { 
            email: email.value,
            company: result.company,
            division: result.division
          }
        });
      }, 2000);
    }
  } catch (error) {
    if (error.message === "Email not found in system") {
      errorMessage.value = "ไม่พบอีเมลนี้ในระบบ กรุณาตรวจสอบอีเมลหรือลงทะเบียนใหม่";
    } else {
      errorMessage.value = "เกิดข้อผิดพลาดในการตรวจสอบอีเมล กรุณาลองใหม่อีกครั้ง";
    }
  }
};

const handleLogin = async () => {
  clearMessages();
  
  if (!validatePassword()) return;

  try {
    const response = await axios.post('/api/users/login', {
      email: email.value,
      password: password.value
    });
    
    if (response.data && response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      successMessage.value = "เข้าสู่ระบบสำเร็จ กำลังนำท่านเข้าสู่ระบบ...";
      
      setTimeout(() => {
        router.push("/home");
      }, 1500);
    } else {
      errorMessage.value = "ไม่พบบัญชีผู้ใช้ กรุณาลงทะเบียนก่อน";
    }
  } catch (error) {
    console.error('Login error:', error);
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = "เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง";
    }
  }
};
</script>

<style scoped>
@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-slide-down {
  animation: slide-down 0.4s ease-out;
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>