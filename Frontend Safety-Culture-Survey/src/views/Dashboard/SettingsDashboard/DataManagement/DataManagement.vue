<!-- DataManagement.vue -->
<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <NavbarDashboard />

    <!-- Main Content -->
    <main class="flex-1 ml-60 p-6">
      <div class="max-w-7xl mx-auto space-y-6">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow border border-gray-200">
          <div class="px-6 py-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <div>
                <h1 class="text-xl font-semibold text-gray-900">จัดการข้อมูลระบบ</h1>
                <p class="text-sm text-gray-600">จัดการและดูแลรักษาข้อมูลการสำรวจ</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">ผู้ใช้ทั้งหมด</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.totalUsers || 0 }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">คำตอบทั้งหมด</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.totalSurveyAnswers || 0 }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600">กิจกรรมล่าสุด (7 วัน)</p>
                <p class="text-2xl font-semibold text-gray-900">{{ stats.recentActivity || 0 }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Company Stats -->
        <div class="bg-white rounded-lg shadow border border-gray-200">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">สถิติตามบริษัท</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">บริษัท</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวนผู้ใช้</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="company in companyStats" :key="company.company_user">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ company.company_user || 'ไม่ระบุ' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ company._count.id }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Data Management Actions -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Clear Company Data -->
          <div class="bg-white rounded-lg shadow border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">ล้างข้อมูลการสำรวจ</h2>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">เลือกบริษัท</label>
                  <select 
                    v-model="selectedCompany" 
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">เลือกบริษัท</option>
                    <option 
                      v-for="company in companyStats" 
                      :key="company.company_user" 
                      :value="company.company_user"
                    >
                      {{ company.company_user || 'ไม่ระบุ' }} ({{ company._count.id }} ผู้ใช้)
                    </option>
                  </select>
                </div>
                
                <div v-if="selectedCompany" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div class="flex items-start">
                    <svg class="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div class="ml-3">
                      <p class="text-sm text-blue-700">
                        การดำเนินการนี้จะล้างข้อมูลการสำรวจทั้งหมดของผู้ใช้ในบริษัท 
                        <span class="font-semibold">{{ selectedCompany }}</span> 
                        และรีเซ็ตสถานะการสำรวจของผู้ใช้ทั้งหมดในบริษัทนี้
                      </p>
                    </div>
                  </div>
                </div>
                
                <button
                  @click="clearCompanyData"
                  :disabled="!selectedCompany || isProcessing"
                  :class="[
                    'w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors',
                    selectedCompany && !isProcessing
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  ]"
                >
                  <svg v-if="isProcessing" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isProcessing ? 'กำลังดำเนินการ...' : 'ล้างข้อมูลการสำรวจ' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Archive Old Data -->
          <div class="bg-white rounded-lg shadow border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-semibold text-gray-900">เก็บข้อมูลเก่า</h2>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">เก็บข้อมูลที่เก่ากว่า (วัน)</label>
                  <input
                    type="number"
                    v-model="archiveDays"
                    min="1"
                    max="3650"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="365"
                  />
                </div>
                
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div class="flex items-start">
                    <svg class="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div class="ml-3">
                      <p class="text-sm text-blue-700">
                        การดำเนินการนี้จะตรวจสอบข้อมูลการสำรวจที่เก่ากว่า 
                        <span class="font-semibold">{{ archiveDays || 365 }}</span> วัน 
                        สำหรับการเก็บถาวรในอนาคต
                      </p>
                    </div>
                  </div>
                </div>
                
                <button
                  @click="archiveOldData"
                  :disabled="isProcessing"
                  :class="[
                    'w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors',
                    !isProcessing
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  ]"
                >
                  <svg v-if="isProcessing" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isProcessing ? 'กำลังตรวจสอบ...' : 'ตรวจสอบข้อมูลเก่า' }}
                </button>
                
                <div v-if="archiveResult" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p class="text-sm text-green-700">
                    {{ archiveResult }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Confirmation Modal -->
        <div v-if="showConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div class="p-6">
              <div class="flex items-start mb-4">
                <div class="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                </div>
                <div class="ml-3 flex-1">
                  <h3 class="text-lg font-semibold text-gray-900 mb-1">ยืนยันการล้างข้อมูล</h3>
                  <p class="text-sm text-gray-600">
                    คุณแน่ใจหรือไม่ที่ต้องการล้างข้อมูลการสำรวจของบริษัท "{{ selectedCompany }}"? 
                    การกระทำนี้ไม่สามารถยกเลิกได้
                  </p>
                </div>
              </div>
              
              <div class="flex justify-end gap-2 mt-6">
                <button
                  @click="showConfirmModal = false"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-lg border border-gray-300"
                >
                  ยกเลิก
                </button>
                <button
                  @click="confirmClearData"
                  class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
                >
                  ล้างข้อมูล
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NavbarDashboard from '../../../../components/NavbarDashboard.vue'
import axios from 'axios'

const stats = ref({
  totalUsers: 0,
  totalSurveyAnswers: 0,
  recentActivity: 0,
  companyStats: []
})

const companyStats = ref([])
const selectedCompany = ref('')
const archiveDays = ref(365)
const isProcessing = ref(false)
const showConfirmModal = ref(false)
const archiveResult = ref('')

// Fetch data statistics
const fetchDataStatistics = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/data-management/statistics')
    stats.value = response.data
    companyStats.value = response.data.companyStats || []
  } catch (error) {
    console.error('Error fetching data statistics:', error)
  }
}

// Clear company data
const clearCompanyData = () => {
  if (!selectedCompany.value) return
  showConfirmModal.value = true
}

const confirmClearData = async () => {
  showConfirmModal.value = false
  isProcessing.value = true
  
  try {
    const response = await axios.post('http://localhost:5000/api/data-management/clear-company-data', {
      companyId: selectedCompany.value
    })
    
    alert(response.data.message)
    selectedCompany.value = ''
    await fetchDataStatistics()
  } catch (error) {
    console.error('Error clearing company data:', error)
    alert('เกิดข้อผิดพลาดในการล้างข้อมูล: ' + (error.response?.data?.error || error.message))
  } finally {
    isProcessing.value = false
  }
}

// Archive old data
const archiveOldData = async () => {
  isProcessing.value = true
  archiveResult.value = ''
  
  try {
    const response = await axios.post('http://localhost:5000/api/data-management/archive-old-data', {
      olderThanDays: archiveDays.value
    })
    
    archiveResult.value = response.data.message
  } catch (error) {
    console.error('Error archiving old data:', error)
    archiveResult.value = 'เกิดข้อผิดพลาดในการตรวจสอบข้อมูลเก่า: ' + (error.response?.data?.error || error.message)
  } finally {
    isProcessing.value = false
  }
}

onMounted(() => {
  fetchDataStatistics()
})
</script>

<style scoped>
/* Add any custom styles here */
</style>