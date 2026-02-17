<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <NavBar />
    <div class="px-6 py-20">
      <!-- Header Section -->
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-800 mb-3">ติดต่อสอบถาม</h2>
      </div>

      <form @submit.prevent="handleSubmit" class="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-2xl space-y-7 border-t-4 border-[#7ae2cf]">
        <!-- ข้อความตอบกลับ -->
        <transition name="fade">
          <div v-if="submitMessage" :class="[
            'p-5 rounded-xl font-semibold text-center transition-all duration-300 transform',
            submitStatus === 'success' 
              ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-2 border-green-300 shadow-lg' 
              : 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-2 border-red-300 shadow-lg'
          ]">
            <div class="flex items-center justify-center gap-2">
              <svg v-if="submitStatus === 'success'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{{ submitMessage }}</span>
            </div>
          </div>
        </transition>

        <!-- ชื่อ - นามสกุล -->
        <div class="group">
          <label class="block text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <svg class="w-5 h-5 text-[#7ae2cf]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            ชื่อ - นามสกุล 
            <span class="text-red-500">*</span>
          </label>
          <input
            v-model="name"
            type="text"
            @input="validateName"
            class="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#7ae2cf]/30 focus:border-[#7ae2cf] transition-all duration-300 text-lg group-hover:border-gray-400"
            :class="{ 'border-red-500': nameError }"
            placeholder="กรุณาระบุชื่อ - นามสกุล"
            required
            :disabled="isSubmitting"
          />
          <p v-if="nameError" class="text-red-600 text-sm mt-2 flex items-center gap-1">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            {{ nameError }}
          </p>
        </div>

        <!-- อีเมล -->
        <div class="group">
          <label class="block text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <svg class="w-5 h-5 text-[#7ae2cf]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            อีเมล 
            <span class="text-red-500">*</span>
          </label>
          <input
            v-model="email"
            type="email"
            @input="validateEmail"
            class="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#7ae2cf]/30 focus:border-[#7ae2cf] transition-all duration-300 text-lg group-hover:border-gray-400"
            :class="{ 'border-red-500': emailError }"
            placeholder="example@email.com"
            required
            :disabled="isSubmitting"
          />
          <p v-if="emailError" class="text-red-600 text-sm mt-2 flex items-center gap-1">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            {{ emailError }}
          </p>
        </div>

        <!-- เบอร์โทรศัพท์ -->
        <div class="group">
          <label class="block text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <svg class="w-5 h-5 text-[#7ae2cf]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            เบอร์ติดต่อกลับ 
            <span class="text-red-500">*</span>
          </label>
          <input
            v-model="phone"
            type="tel"
            inputmode="numeric"
            @input="validatePhone"
            class="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#7ae2cf]/30 focus:border-[#7ae2cf] transition-all duration-300 text-lg group-hover:border-gray-400"
            :class="{ 'border-red-500': phoneError }"
            placeholder="0812345678"
            maxlength="10"
            required
            :disabled="isSubmitting"
          />
          <p v-if="phoneError" class="text-red-600 text-sm mt-2 flex items-center gap-1">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            {{ phoneError }}
          </p>
          <p class="text-gray-500 text-sm mt-1">กรอกเฉพาะตัวเลข 10 หลัก (เช่น 0812345678)</p>
        </div>

        <!-- ข้อความ -->
        <div class="group">
          <label class="block text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <svg class="w-5 h-5 text-[#7ae2cf]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
            </svg>
            ฝากข้อความ 
            <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="message"
            rows="5"
            @input="validateMessage"
            class="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#7ae2cf]/30 focus:border-[#7ae2cf] transition-all duration-300 resize-vertical text-lg group-hover:border-gray-400"
            :class="{ 'border-red-500': messageError }"
            placeholder="กรุณากรอกข้อความที่ต้องการสอบถาม..."
            required
            :disabled="isSubmitting"
          ></textarea>
          <p v-if="messageError" class="text-red-600 text-sm mt-2 flex items-center gap-1">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            {{ messageError }}
          </p>
          <p class="text-gray-500 text-sm mt-1">จำนวนตัวอักษร: {{ message.length }}</p>
        </div>

        <!-- ปุ่ม -->
        <div class="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            @click="handleReset"
            :disabled="isSubmitting"
            class="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-8 py-3.5 rounded-full hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-md hover:shadow-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            ล้างข้อมูล
          </button>
          <button
            type="submit"
            :disabled="isSubmitting || !isFormValid"
            class="bg-gradient-to-r from-[#7ae2cf] to-[#62CFC0] text-gray-900 px-8 py-3.5 rounded-full hover:from-[#62CFC0] hover:to-[#4DBDAD] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-bold transform hover:scale-105 flex items-center gap-2"
          >
            <span v-if="!isSubmitting" class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
              ส่งข้อความ
            </span>
            <span v-else class="flex items-center gap-2">
              <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              กำลังส่ง...
            </span>
          </button>
        </div>
      </form>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Footer from "../../../components/Footer.vue";
import { ref, computed } from "vue";
import NavBar from "../../../components/NavBar.vue";
import { API_BASE_URL } from "../../../config/api";

// ฟอร์มข้อมูล
const name = ref("");
const email = ref("");
const phone = ref("");
const message = ref("");

// สถานะข้อมูล
const isSubmitting = ref(false);
const submitMessage = ref("");
const submitStatus = ref(""); // "success" หรือ "error"

// Error messages
const nameError = ref("");
const emailError = ref("");
const phoneError = ref("");
const messageError = ref("");

/**
 * ตรวจสอบชื่อ - นามสกุล (รับได้เฉพาะตัวอักษรไทย อังกฤษ และช่องว่าง)
 */
const validateName = () => {
  const nameRegex = /^[ก-๏a-zA-Z\s]+$/;
  if (!name.value) {
    nameError.value = "";
    return false;
  }
  if (!nameRegex.test(name.value)) {
    nameError.value = "กรุณากรอกเฉพาะตัวอักษรภาษาไทยหรือภาษาอังกฤษเท่านั้น";
    return false;
  }
  if (name.value.trim().length < 2) {
    nameError.value = "กรุณากรอกชื่อ-นามสกุลอย่างน้อย 2 ตัวอักษร";
    return false;
  }
  nameError.value = "";
  return true;
};

/**
 * ตรวจสอบอีเมล
 */
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value) {
    emailError.value = "";
    return false;
  }
  if (!emailRegex.test(email.value)) {
    emailError.value = "รูปแบบอีเมลไม่ถูกต้อง กรุณากรอกในรูปแบบ example@email.com";
    return false;
  }
  emailError.value = "";
  return true;
};

/**
 * ตรวจสอบเบอร์โทรศัพท์ (รับได้เฉพาะตัวเลข จำกัด 10 หลัก)
 */
const validatePhone = () => {
  // ลบทุกอย่างที่ไม่ใช่ตัวเลข
  const numbersOnly = phone.value.replace(/\D/g, '');
  
  // จำกัดไม่เกิน 10 หลัก
  if (numbersOnly.length > 10) {
    phone.value = numbersOnly.slice(0, 10);
    return false;
  }
  
  phone.value = numbersOnly;

  if (!phone.value) {
    phoneError.value = "";
    return false;
  }

  // ต้องขึ้นต้นด้วย 0
  if (!phone.value.startsWith('0')) {
    phoneError.value = "เบอร์โทรศัพท์ต้องขึ้นต้นด้วย 0";
    return false;
  }
  
  // ต้องมีครบ 10 หลัก
  if (phone.value.length !== 10) {
    phoneError.value = `กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก (ปัจจุบัน ${phone.value.length} หลัก)`;
    return false;
  }

  phoneError.value = "";
  return true;
};

/**
 * ตรวจสอบข้อความ
 */
const validateMessage = () => {
  if (!message.value) {
    messageError.value = "";
    return false;
  }
  if (message.value.trim().length < 10) {
    messageError.value = "กรุณากรอกข้อความอย่างน้อย 10 ตัวอักษร";
    return false;
  }
  messageError.value = "";
  return true;
};

/**
 * ตรวจสอบว่าฟอร์มถูกต้องทั้งหมดหรือไม่
 */
const isFormValid = computed(() => {
  return (
    name.value.trim() &&
    email.value.trim() &&
    phone.value.trim() &&
    message.value.trim() &&
    !nameError.value &&
    !emailError.value &&
    !phoneError.value &&
    !messageError.value
  );
});

/**
 * ฟังก์ชันกดปุ่มส่ง
 */
const handleSubmit = async () => {
  // ตรวจสอบความถูกต้องทั้งหมดก่อนส่ง
  const isNameValid = validateName();
  const isEmailValid = validateEmail();
  const isPhoneValid = validatePhone();
  const isMessageValid = validateMessage();

  if (!isNameValid || !isEmailValid || !isPhoneValid || !isMessageValid) {
    submitMessage.value = "กรุณาตรวจสอบข้อมูลให้ถูกต้องครบถ้วน";
    submitStatus.value = "error";
    setTimeout(() => {
      submitMessage.value = "";
      submitStatus.value = "";
    }, 4000);
    return;
  }

  isSubmitting.value = true;
  submitMessage.value = "";
  submitStatus.value = "";

  try {
    // ส่งข้อมูลไปยัง API
    const response = await fetch(`${API_BASE_URL}/api/inquiry/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim(),
        message: message.value.trim(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      submitMessage.value = data.message || "เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง";
      submitStatus.value = "error";
      return;
    }

    // ส่งสำเร็จ
    submitMessage.value = data.message || "ส่งข้อความสำเร็จ! เราจะติดต่อกลับโดยเร็วที่สุด";
    submitStatus.value = "success";
    
    // รอ 1 วินาทีก่อนล้างฟอร์ม
    setTimeout(() => {
      handleReset();
    }, 1000);
  } catch (error) {
    console.error("Error submitting inquiry:", error);
    submitMessage.value = "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง";
    submitStatus.value = "error";
  } finally {
    isSubmitting.value = false;
    // ซ่อนข้อความหลัง 5 วินาที
    setTimeout(() => {
      submitMessage.value = "";
      submitStatus.value = "";
    }, 5000);
  }
};

/**
 * ล้างข้อความทั้งหมด
 */
const handleReset = () => {
  name.value = "";
  email.value = "";
  phone.value = "";
  message.value = "";
  nameError.value = "";
  emailError.value = "";
  phoneError.value = "";
  messageError.value = "";
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Custom scrollbar for textarea */
textarea::-webkit-scrollbar {
  width: 8px;
}

textarea::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

textarea::-webkit-scrollbar-thumb {
  background: #7ae2cf;
  border-radius: 10px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #62CFC0;
}
</style>