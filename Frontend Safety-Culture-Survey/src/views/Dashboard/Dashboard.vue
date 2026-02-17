<template>
  <div class="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-x-hidden">
    <!-- Sidebar -->
    <NavbarDashboard />
    
    <!-- Main Content -->
    <div class="flex-1 pl-64 max-w-full overflow-x-hidden">
      <!-- Header Section -->
      <!-- <div class="bg-white border-b shadow-sm sticky top-0 z-50">
        <div class="px-8 py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 tracking-tight">สรุปผลการประเมิน</h1>
              <p class="text-sm text-gray-600 mt-2">ภาพรวมข้อมูลและสถิติการทำงานของระบบ</p>
            </div>
            <div class="flex items-center space-x-3 text-sm text-gray-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="font-medium">{{ currentDate }}</span>
            </div>
          </div>
        </div>
      </div> -->

      <!-- Content Area -->
      <div class="p-8 space-y-8">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-20">
          <div class="text-center">
            <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <p class="mt-6 text-gray-600 font-medium">กำลังโหลดข้อมูล...</p>
          </div>
        </div>

        <!-- Dashboard Content -->
        <div v-else class="space-y-8">

          <!-- Pie Charts Section -->
          <div class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div class="p-8 bg-gray-50">
              <PieChart :v1Data="v1ChartData" :v2Data="v2ChartData" />
            </div>
          </div>

          <!-- Sales Bar Chart Section -->
          <div class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div class="p-8 bg-gray-50">
              <SalesBarChart />
            </div>
          </div>

          <!-- Horizontal Bar Chart Section -->
          <div class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div class="p-8 bg-gray-50">
              <HorizontalBarChart />
            </div>
          </div>

          <!-- Stacked Bar Chart Section -->
          <div class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div class="p-8 bg-gray-50">
              <StackedBarChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import NavbarDashboard from '../../components/NavbarDashboard.vue'
import PieChart from './Showgraph/PieChartDB.vue'
import SalesBarChart from './Showgraph/SalesBarChartDB.vue'
import StackedBarChart from './Showgraph/StackedBarChartDB.vue'
import HorizontalBarChart from './Showgraph/HorizontalBarChart.vue'

// เก็บข้อมูลผู้ใช้ทั้งหมด
const allUsers = ref([])
const loading = ref(true)

// วันที่ปัจจุบัน
const currentDate = computed(() => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date().toLocaleDateString('th-TH', options)
})

onMounted(async () => {
  try {
    const res = await axios.get('/user_excel/with-status')
    console.log('API Response:', res.data)
    
    // Ensure allUsers is always an array
    if (Array.isArray(res.data)) {
      allUsers.value = res.data
    } else if (res.data && typeof res.data === 'object') {
      // If response is an object, try to extract array from it
      const dataArray = res.data.data || res.data.users || []
      allUsers.value = Array.isArray(dataArray) ? dataArray : []
    } else {
      allUsers.value = []
    }
    
    console.log('Dashboard loaded users:', allUsers.value.length)
  } catch (err) {
    console.error('โหลดข้อมูลล้มเหลว:', err)
    allUsers.value = [] // Set to empty array on error
  } finally {
    loading.value = false
  }
})

// แยกข้อมูลตาม V1/V2
const v1Users = computed(() =>
  allUsers.value.filter(u => u.area?.toLowerCase().includes('v1'))
)

const v2Users = computed(() =>
  allUsers.value.filter(u => u.area?.toLowerCase().includes('v2'))
)

// นับจำนวนที่ทำเสร็จแล้ว
const completedCount = computed(() =>
  allUsers.value.filter(u => u.status === 'done').length
)

// คำนวณเปอร์เซ็นต์การทำเสร็จ
const completionRate = computed(() => {
  if (allUsers.value.length === 0) return 0
  return Math.round((completedCount.value / allUsers.value.length) * 100)
})

// แปลงเป็น chart data
function getChartData(users, colors) {
  const done = users.filter(u => u.status === 'done').length
  const total = users.length
  const percentDone = total > 0 ? Math.round((done / total) * 100) : 0
  const percentNotDone = 100 - percentDone
  
  return {
    labels: ['ทำแล้ว', 'ยังไม่ได้ทำ'],
    datasets: [{
      data: [percentDone, percentNotDone],
      backgroundColor: colors,
      borderWidth: 3,
      borderColor: '#ffffff',
    }]
  }
}

const v1ChartData = computed(() =>
  getChartData(v1Users.value, ['#10b981', '#ef4444'])
)

const v2ChartData = computed(() =>
  getChartData(v2Users.value, ['#3b82f6', '#f59e0b'])
)
</script>

<style scoped>
/* เพิ่มความนุ่มนวลให้กับ transitions */
* {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>