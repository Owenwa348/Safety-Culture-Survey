<script setup>
import NavbarDashboard from '../../../components/NavbarDashboard.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <NavbarDashboard />

    <!-- Content Container - เพิ่ม margin-left เพื่อหลีกเลี่ยง sidebar และ padding ด้านขวา -->
    <div class="ml-64 mr-6 mt-8">
      <!-- Main Content Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div class="mb-6">
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Settings</h3>
        </div>
        <!-- เนื้อหาของ Settings -->
        <div class="text-gray-600">
          ตั้งค่าต่าง ๆ ของคุณจะอยู่ตรงนี้
        </div>

      </div>
    </div>
  </div>
</template>