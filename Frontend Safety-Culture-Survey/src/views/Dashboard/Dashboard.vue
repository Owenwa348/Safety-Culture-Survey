<template>
  <div class="flex">
    <!-- Sidebar -->
    <NavbarDashboard />

    <!-- Main content -->
    <div class="flex-1 space-y-8 p-6 pl-64">
      <!-- Pie Charts -->
      <div class="bg-white rounded-xl shadow-sm border p-6">
        <PieChart :v1Data="v1ChartData" :v2Data="v2ChartData" />
      </div>

      <!-- Sales Bar Chart -->
      <div class="bg-white rounded-xl shadow-sm border p-6">
        <SalesBarChart />
      </div>

      <!-- Stacked Bar Chart -->
      <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
        <StackedBarChart />
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue'
import PieChart from './Showgraph/PieChartDB.vue'
import SalesBarChart from './Showgraph/SalesBarChartDB.vue'
import StackedBarChart from './Showgraph/StackedBarChartDB.vue'
import NavbarDashboard from '../../components/NavbarDashboard.vue';

// เก็บข้อมูลผู้ใช้ทั้งหมด
const allUsers = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await axios.get('/user_excel/with-status')
    allUsers.value = res.data
    console.log('Dashboard loaded users:', allUsers.value.length)
  } catch (err) {
    console.error('โหลดข้อมูลล้มเหลว:', err)
  } finally {
    loading.value = false
  }
})

// แยกข้อมูลตาม V1/V2 (ใช้ area แทน version)
const v1Users = computed(() =>
  allUsers.value.filter(u => u.area?.toLowerCase().includes('v1'))
)

const v2Users = computed(() =>
  allUsers.value.filter(u => u.area?.toLowerCase().includes('v2'))
)

// แปลงเป็น chart data ที่ใช้กับ PieChart component
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
      borderWidth: 2,
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