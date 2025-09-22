<script setup>
import { ref } from "vue";
</script>

<template>
  <div class="min-h-screen">
    <NavBar />
    <div class="min-h-screen bg-gray-100 flex flex-col justify-center">
      <div class="text-center p-10">
        <h1 class="text-4xl font-bold text-red-500">404 - ไม่พบหน้านี้</h1>
        <router-link to="/" class="text-blue-500 underline">กลับหน้าหลัก</router-link>
      </div>
    </div>
  </div>
</template>