<template>
  <nav class="fixed top-0 left-0 w-full z-50 bg-[#06202B] backdrop-blur-md shadow-md">
    <div class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
       <!-- ล็อกอิน -->
        <div class="flex items-center">
          <router-link to="/home" class="flex items-center">
            <img src="/logoandname.png" alt="Logo" class="h-15 w-40 mr-2" />
          </router-link>
        </div>

        <!-- แถบเลือก -->
        <div class="hidden md:flex absolute left-1/2 -translate-x-1/2 space-x-15 text-base font-medium">
          <router-link to="/home" style="color: white;"
            class="text-lg text-white hover:text-white hover:bg-[#7AE2CF] px-3 py-2 rounded-md transition">หน้าแรก</router-link>
          <router-link to="/assessment" style="color: white;"
            class="text-lg text-white hover:text-white hover:bg-[#7AE2CF] px-3 py-2 rounded-md transition">แบบประเมิน</router-link>
          <router-link to="/about" style="color: white;"
            class="text-lg text-white hover:text-white hover:bg-[#7AE2CF] px-3 py-2 rounded-md transition">เกี่ยวกับเรา</router-link>
          <router-link to="/contact" style="color: white;"
            class="text-lg text-white hover:text-white hover:bg-[#7AE2CF] px-3 py-2 rounded-md transition">ติดต่อสอบถาม</router-link>
          <router-link to="/dashboard" style="color: white;"
            class="text-lg text-white hover:text-white hover:bg-[#7AE2CF] px-3 py-2 rounded-md transition">หลังบ้าน</router-link>
        </div>
      </div>
    </div>

  </nav>
</template>

<script setup>
import { ref } from 'vue'
const isOpen = ref(false)
</script>
