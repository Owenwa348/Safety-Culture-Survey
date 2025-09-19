<script setup>
import ExcelUploadView from './ExcelUploadView.vue'
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
    <div class="mb-6">
      <h3 class="text-xl font-semibold text-gray-900 mb-2">Settings</h3>
    </div>
    
    <div class="border-t border-gray-100 pt-6">
      <h4 class="text-lg font-medium text-gray-800 mb-4">อัปโหลดไฟล์ Excel</h4>
      <ExcelUploadView />
    </div>
  </div>
</template>