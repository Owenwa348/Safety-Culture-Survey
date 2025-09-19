<template>
  <div class="bg-gray-50 rounded-lg border border-gray-200 p-6">
    <form @submit.prevent="handleUpload" class="space-y-6">
      <!-- File Upload Area -->
      <div class="space-y-2">
        <div class="relative">
          <input
            type="file"
            accept=".xlsx"
            @change="onFileChange"
            class="block w-full text-sm text-gray-500 
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-md file:border-0
                   file:text-sm file:font-medium
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100
                   focus:file:outline-none focus:file:ring-2 focus:file:ring-blue-500
                   border border-gray-300 rounded-lg p-3
                   bg-white hover:bg-gray-50 transition-colors"
          />
        </div>
        <p class="text-xs text-gray-500">รองรับเฉพาะไฟล์ .xlsx เท่านั้น</p>
      </div>

      <!-- Upload Button -->
      <button
        type="submit"
        class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 
               text-white font-medium px-6 py-3 rounded-lg
               transition-colors duration-200 ease-in-out
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
               disabled:cursor-not-allowed"
        :disabled="loading || !file"
      >
        <span v-if="loading" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          กำลังอัปโหลด...
        </span>
        <span v-else>
          อัปโหลดไฟล์
        </span>
      </button>

      <!-- Messages -->
      <div v-if="message || error" class="space-y-2">
        <div v-if="message" class="bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex items-center">
            <svg class="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <p class="text-sm font-medium text-green-800">{{ message }}</p>
          </div>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex items-center">
            <svg class="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
            <p class="text-sm font-medium text-red-800">{{ error }}</p>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const file = ref(null)
const loading = ref(false)
const message = ref('')
const error = ref('')

const onFileChange = (e) => {
  file.value = e.target.files[0]
  message.value = ''
  error.value = ''
}

const handleUpload = async () => {
  if (!file.value) {
    error.value = 'กรุณาเลือกไฟล์ Excel ก่อน'
    return
  }

  const formData = new FormData()
  formData.append('file', file.value)

  loading.value = true
  message.value = ''
  error.value = ''

  try {
    await axios.post('http://localhost:3000/excel-upload/upload', formData)
    message.value = 'อัปโหลดสำเร็จ!'
  } catch (err) {
    error.value = err?.response?.data?.message || 'เกิดข้อผิดพลาด'
  } finally {
    loading.value = false
  }
}
</script>