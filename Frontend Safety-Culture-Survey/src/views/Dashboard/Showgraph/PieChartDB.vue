<template>
  <div class="w-full max-w-full overflow-x-hidden">
    <h2 class="text-xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center px-4">
      เปอร์เซ็นต์การทำแบบประเมิน
    </h2>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-sm text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="px-4 sm:px-6 py-8">
      <div class="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
          <div class="flex-1">
            <h3 class="text-sm font-medium text-red-800">เกิดข้อผิดพลาด</h3>
            <p class="mt-1 text-sm text-red-700">{{ error }}</p>
            <button 
              @click="loadData" 
              class="mt-3 text-sm text-red-600 hover:text-red-800 underline focus:outline-none"
            >
              ลองใหม่อีกครั้ง
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Dynamic Charts based on available areas -->
    <div v-if="!loading && !error" class="w-full px-4 sm:px-6 lg:px-8">
      <div class="grid gap-4 sm:gap-6 w-full max-w-7xl mx-auto"
           :class="{
             'grid-cols-1': availableAreas.length === 1,
             'grid-cols-2': availableAreas.length === 2,
             'grid-cols-2 md:grid-cols-3': availableAreas.length === 3,
             'grid-cols-2 lg:grid-cols-4': availableAreas.length === 4,
             'grid-cols-2 md:grid-cols-3 xl:grid-cols-5': availableAreas.length === 5,
             'grid-cols-2 md:grid-cols-3 lg:grid-cols-4': availableAreas.length >= 6
           }">
        <div v-for="area in availableAreas" :key="area" 
             class="text-center flex flex-col items-center min-w-0 p-2">
          <h3 class="text-sm sm:text-base font-medium text-gray-700 mb-1 truncate w-full" :title="area">
            {{ area }}
          </h3>
          <p class="text-xs text-gray-500 mb-3">{{ getAreaStats(area).total }} คน</p>
          
          <div class="relative inline-block w-full max-w-[140px] sm:max-w-[160px] mx-auto transition-transform hover:scale-105 duration-200">
            <!-- Dynamic Pie Chart -->
            <div class="relative w-full aspect-square">
              <svg viewBox="0 0 120 120" class="w-full h-full">
                <!-- Background Circle -->
                <circle 
                  cx="60" 
                  cy="60" 
                  r="50" 
                  fill="none" 
                  stroke="#f3f4f6" 
                  stroke-width="12"
                />
                
                <!-- Progress Circle for Completed -->
                <circle 
                  v-if="getAreaStats(area).percentDone > 0"
                  cx="60" 
                  cy="60" 
                  r="50" 
                  fill="none" 
                  :stroke="getAreaColor(area, 100)" 
                  stroke-width="12"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="circumference - (getAreaStats(area).percentDone / 100) * circumference"
                  stroke-linecap="round"
                  transform="rotate(-90 60 60)"
                />
                
                <!-- Progress Circle for Not Completed -->
                <circle 
                  v-if="getAreaStats(area).percentDone < 100"
                  cx="60" 
                  cy="60" 
                  r="50" 
                  fill="none" 
                  :stroke="getAreaColor(area, 0)" 
                  stroke-width="12"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="getAreaStats(area).percentDone > 0 ? 
                    circumference - ((100 - getAreaStats(area).percentDone) / 100) * circumference : 0"
                  stroke-linecap="round"
                  transform="rotate(-90 60 60)"
                  :style="{ 
                    transform: `rotate(${getAreaStats(area).percentDone * 3.6 - 90}deg)`, 
                    transformOrigin: '60px 60px' 
                  }"
                />
              </svg>
              
              <!-- Center Text -->
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <div class="text-xl sm:text-2xl font-bold text-gray-800">
                  {{ getAreaStats(area).percentDone }}%
                </div>
                <div class="text-xs text-gray-500">COMPLETE</div>
              </div>
            </div>
          </div>
          
          <!-- Legend -->
          <div class="flex justify-center items-center mt-3 gap-3 flex-wrap">
            <div class="flex items-center whitespace-nowrap">
              <div class="w-2.5 h-2.5 rounded-full mr-1.5 flex-shrink-0" 
                   :style="{ backgroundColor: getAreaColor(area, 100) }"></div>
              <span class="text-xs text-gray-600">ทำแล้ว</span>
            </div>
            <div class="flex items-center whitespace-nowrap">
              <div class="w-2.5 h-2.5 rounded-full mr-1.5 flex-shrink-0" 
                   :style="{ backgroundColor: getAreaColor(area, 0) }"></div>
              <span class="text-xs text-gray-600">ยังไม่ได้ทำ</span>
            </div>
          </div>
          
          <!-- Stats -->
          <div class="mt-2 text-xs text-gray-500">
            <div>{{ getAreaStats(area).done }}/{{ getAreaStats(area).total }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Debug Info -->
    <div v-if="showDebug" class="mt-8 mx-4 sm:mx-6 lg:mx-8 p-4 bg-gray-100 rounded-lg max-w-7xl mx-auto">
      <h4 class="font-semibold mb-2 text-sm sm:text-base">ข้อมูลทั้งหมด:</h4>
      <div class="text-xs sm:text-sm">
        <p class="mb-2">ผู้ทำแบบสอบถามทั้งหมด: {{ allUsers.length }}</p>
        <p class="break-words">บริษัท: {{ availableAreas.join(', ') }}</p>
        <div v-for="area in availableAreas" :key="area" class="mt-2 break-words">
          <strong>{{ area }}:</strong> {{ getAreaStats(area).done }}/{{ getAreaStats(area).total }} 
          ({{ getAreaStats(area).percentDone }}%)
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios';

// Props (if needed from parent)
const props = defineProps({
  company1Data: Object,
  company2Data: Object
})

const allUsers = ref([])
const loading = ref(true)
const error = ref(null)
// Show debug info
const showDebug = ref(true)

// Circle circumference for SVG (updated for radius 50)
const circumference = 2 * Math.PI * 50

// Color palette for different areas
const colorPalette = [
  { done: '#10b981', notDone: '#ef4444' }, // Green/Red
  { done: '#3b82f6', notDone: '#f59e0b' }, // Blue/Orange
  { done: '#8b5cf6', notDone: '#f97316' }, // Purple/Orange
  { done: '#06b6d4', notDone: '#ec4899' }, // Cyan/Pink
]

// Load data function (can be reused for retry)
const loadData = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await axios.get('/api/analytics/completion-status');
    allUsers.value = response.data;
  } catch (err) {
    error.value = 'ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง';
    console.error('เกิดข้อผิดพลาดในการโหลดข้อมูล:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});

// Get unique areas from data
const availableAreas = computed(() => {
  if (!allUsers.value) return [];
  const areas = [...new Set(allUsers.value.map(u => u.area).filter(Boolean))]
  // Sort areas alphabetically
  return areas.sort()
})

// Get users by area
function getUsersByArea(area) {
  if (!allUsers.value) return [];
  return allUsers.value.filter(u => u.area === area)
}

// Get stats for specific area
function getAreaStats(area) {
  const users = getUsersByArea(area)
  if (!users) return { done: 0, total: 0, percentDone: 0 };
  const done = users.filter(u => u.status === 'done').length
  const total = users.length
  const percentDone = total > 0 ? Math.round((done / total) * 100) : 0
  
  return { done, total, percentDone }
}

// Get color for area based on completion percentage
function getAreaColor(area, percentDone) {
  const areaIndex = availableAreas.value.indexOf(area)
  const colors = colorPalette[areaIndex % colorPalette.length]
  
  return percentDone > 0 ? colors.done : colors.notDone
}

// Legacy computed properties for backward compatibility
const company1Data = computed(() => {
  if (props.company1Data) return props.company1Data
  
  const stats = getAreaStats('Verte Smart Solution')
  return {
    labels: ['ทำแล้ว', 'ยังไม่ได้ทำ'],
    datasets: [{
      data: [stats.percentDone, 100 - stats.percentDone],
      backgroundColor: ['#10b981', '#ef4444'],
    }]
  }
})

const company2Data = computed(() => {
  if (props.company2Data) return props.company2Data
  
  const stats = getAreaStats('Verte Security')
  return {
    labels: ['ทำแล้ว', 'ยังไม่ได้ทำ'],
    datasets: [{
      data: [stats.percentDone, 100 - stats.percentDone],
      backgroundColor: ['#3b82f6', '#f59e0b'],
    }]
  }
})
</script>

<style scoped>
/* Additional styles if needed */
</style>