<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <NavbarDashboard />

    <!-- Content with proper spacing for sidebar -->
    <div class="ml-0 lg:ml-64 transition-all duration-200 ease-in-out">
      <div class="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <!-- Header -->
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-6 border-b border-gray-200">
            <div class="flex items-center space-x-3">
              <div class="bg-blue-600 rounded-lg p-2">
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                </svg>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-gray-900">อัปโหลดไฟล์ Excel</h1>
                <p class="text-sm text-gray-600 mt-1">อัปโหลดไฟล์ Excel เพื่อนำเข้าข้อมูลสู่ระบบ</p>
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="p-8">
            <form @submit.prevent="handleUpload" class="max-w-2xl mx-auto space-y-8">
              <!-- File Upload Area -->
              <div class="space-y-4">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  เลือกไฟล์ Excel
                </label>
                
                <!-- Drag & Drop Area -->
                <div class="relative">
                  <input
                    type="file"
                    accept=".xlsx"
                    @change="onFileChange"
                    class="block w-full text-sm text-gray-600
                           file:mr-4 file:py-3 file:px-6
                           file:rounded-full file:border-0
                           file:text-sm file:font-semibold
                           file:bg-blue-600 file:text-white
                           hover:file:bg-blue-700
                           file:transition-colors file:duration-200
                           border-2 border-dashed border-gray-300 rounded-xl p-8
                           bg-gray-50 hover:bg-gray-100 transition-colors
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  <!-- Upload Icon Overlay -->
                  <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" v-if="!file">
                    <svg class="h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p class="text-gray-500 text-center">
                      <span class="font-medium">คลิกเพื่อเลือกไฟล์</span> หรือลากไฟล์มาวางที่นี่
                    </p>
                  </div>
                </div>

                <!-- File Info -->
                <div v-if="file" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div class="flex items-center">
                    <svg class="h-8 w-8 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-blue-900 truncate">{{ file.name }}</p>
                      <p class="text-xs text-blue-700">{{ (file.size / 1024 / 1024).toFixed(2) }} MB</p>
                    </div>
                    <button
                      type="button"
                      @click="removeFile"
                      class="ml-3 text-blue-400 hover:text-blue-600 transition-colors"
                    >
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Upload Button -->
              <div class="flex justify-center">
                <button
                  type="submit"
                  class="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 
                         hover:from-blue-700 hover:to-indigo-700 
                         disabled:from-blue-400 disabled:to-indigo-400
                         text-white font-semibold rounded-xl shadow-lg
                         transform transition-all duration-200 ease-in-out
                         hover:scale-105 hover:shadow-xl
                         focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50
                         disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg
                         min-w-[200px]"
                  :disabled="loading || !file"
                >
                  <span v-if="loading" class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    กำลังอัปโหลด...
                  </span>
                  <span v-else class="flex items-center">
                    <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    อัปโหลดไฟล์
                  </span>
                </button>
              </div>

              <!-- Progress Bar -->
              <div v-if="loading" class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div class="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full animate-pulse"></div>
              </div>

              <!-- Messages -->
              <div v-if="message || error" class="space-y-4">
                <!-- Success Message -->
                <div v-if="message" class="bg-green-50 border border-green-200 rounded-xl p-6 shadow-sm">
                  <div class="flex items-center">
                    <div class="bg-green-100 rounded-full p-2 mr-4">
                      <svg class="h-6 w-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <p class="font-semibold text-green-800">สำเร็จ!</p>
                      <p class="text-sm text-green-700">{{ message }}</p>
                    </div>
                  </div>
                </div>

                <!-- Error Message -->
                <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
                  <div class="flex items-center">
                    <div class="bg-red-100 rounded-full p-2 mr-4">
                      <svg class="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <p class="font-semibold text-red-800">เกิดข้อผิดพลาด</p>
                      <p class="text-sm text-red-700">{{ error }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import NavbarDashboard from '../../../../components/NavbarDashboard.vue';
import axios from 'axios'

const file = ref(null)
const loading = ref(false)
const message = ref('')
const error = ref('')

const onFileChange = (e) => {
  const selectedFile = e.target.files[0]
  
  // Validate file type
  if (selectedFile && !selectedFile.name.toLowerCase().endsWith('.xlsx')) {
    error.value = 'รองรับเฉพาะไฟล์ .xlsx เท่านั้น'
    e.target.value = ''
    return
  }
  
  // Validate file size (10MB limit)
  if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
    error.value = 'ขนาดไฟล์ไม่ควรเกิน 10 MB'
    e.target.value = ''
    return
  }
  
  file.value = selectedFile
  message.value = ''
  error.value = ''
}

const removeFile = () => {
  file.value = null
  message.value = ''
  error.value = ''
  // Clear the input
  const fileInput = document.querySelector('input[type="file"]')
  if (fileInput) fileInput.value = ''
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
    const response = await axios.post('http://localhost:3000/excel-upload/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 30 seconds timeout
    })
    
    message.value = response.data.message || 'อัปโหลดไฟล์สำเร็จ!'
    
    // Reset form after successful upload
    setTimeout(() => {
      file.value = null
      message.value = ''
      const fileInput = document.querySelector('input[type="file"]')
      if (fileInput) fileInput.value = ''
    }, 3000)
    
  } catch (err) {
    console.error('Upload error:', err)
    error.value = err?.response?.data?.message || err.message || 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์'
  } finally {
    loading.value = false
  }
}
</script>