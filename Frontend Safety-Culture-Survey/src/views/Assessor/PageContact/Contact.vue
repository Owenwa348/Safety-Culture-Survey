<template>
  <div class="min-h-screen">
    <NavBar />
    <div class="px-6 py-20">
      <h2 class="text-3xl text-center mb-10">ติดต่อสอบถาม</h2>

      <form @submit.prevent="handleSubmit" class="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-6 border border-gray-200">
        <!-- ชื่อ -->
        <div>
          <label class="block text-lg font-semibold text-gray-800 mb-2">ชื่อ - นามสกุล <span class="text-red-500">*</span></label>
          <input
            v-model="name"
            type="text"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7ae2cf] focus:border-transparent"
            placeholder="กรุณาระบุชื่อ - นามสกุล"
            pattern="^[ก-ฮa-zA-Z\s]+$"
            required
            :disabled="isSubmitting"/>
        </div>

        <!-- อีเมล -->
        <div>
          <label class="block text-lg font-semibold text-gray-800 mb-2">อีเมล <span class="text-red-500">*</span></label>
          <input
            v-model="email"
            type="email"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7ae2cf] focus:border-transparent"
            placeholder="example@email.com"
            required
            :disabled="isSubmitting"
          />
        </div>

        <!-- เบอร์โทรศัพท์ -->
        <div>
          <label class="block text-lg font-semibold text-gray-800 mb-2">เบอร์ติดต่อกลับ <span class="text-red-500">*</span></label>
          <input
            v-model="phone"
            type="tel"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7ae2cf] focus:border-transparent"
            placeholder="081-234-5678"
            pattern="[0-9]{2,3}-?[0-9]{3}-?[0-9]{4}"
            required
            :disabled="isSubmitting"
          />
        </div>

        <!-- ข้อความ -->
        <div>
          <label class="block text-lg font-semibold text-gray-800 mb-2">ฝากข้อความ <span class="text-red-500">*</span></label>
          <textarea
            v-model="message"
            rows="4"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7ae2cf] focus:border-transparent resize-vertical"
            placeholder="กรุณากรอกข้อความที่ต้องการสอบถาม..."
            required
            :disabled="isSubmitting"
          ></textarea>
        </div>

        <!-- ปุ่ม -->
        <div class="flex justify-end space-x-4">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="bg-[#7ae2cf] text-black px-6 py-3 rounded-full hover:bg-[#62CFC0] transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            <span v-if="!isSubmitting">ส่งข้อความ</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              กำลังส่ง...
            </span>
          </button>
          <button
            type="button"
            @click="handleReset"
            :disabled="isSubmitting"
            class="bg-red-100 text-red-700 px-6 py-2 rounded-full hover:bg-red-200 transition-all duration-300 shadow-md"
          >
            ลบข้อความ
          </button>
        </div>
      </form>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Footer from "../../../components/Footer.vue";
import { ref } from "vue";
import NavBar from "../../../components/NavBar.vue";

// ฟอร์มข้อมูล
const name = ref("");
const email = ref("");
const phone = ref("");
const message = ref("");

// สถานะข้อมูล
const isSubmitting = ref(false);

// ฟังก์ชันกดปุ่มส่ง
const handleSubmit = async () => {
  isSubmitting.value = true;
  
  try {
    // แสดงข้อมูลใน console
    console.log("ชื่อ:", name.value);
    console.log("อีเมล:", email.value);
    console.log("เบอร์โทร:", phone.value);
    console.log("ข้อความ:", message.value);

    // จำลองการส่งข้อมูล
    await new Promise(resolve => setTimeout(resolve, 1000));

    alert("ส่งข้อมูลเรียบร้อยแล้ว ขอบคุณที่ติดต่อเรา!");
    // รีเซ็ตข้อมูล
    handleReset();
  } catch (error) {
    console.error("เกิดข้อผิดพลาด:", error);
    alert("เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง");
  } finally {
    isSubmitting.value = false;
  }
};

// ลบข้อความทั้งหมด
const handleReset = () => {
  name.value = "";
  email.value = "";
  phone.value = "";
  message.value = "";
};
</script>