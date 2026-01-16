<template>
  <div>
    <h2 class="text-xl font-semibold text-gray-800 mb-6 text-center">
      เปอร์เซ็นต์การทำแบบประเมิน
    </h2>

    <div v-if="loading" class="text-center">
      <p>Loading...</p>
    </div>

    <div v-if="error" class="text-center text-red-500">
      <p>{{ error }}</p>
    </div>

    <!-- Dynamic Charts based on available areas -->
    <div v-if="!loading && !error" class="flex flex-wrap justify-center gap-8" 
         :class="{
           'max-w-2xl mx-auto': availableAreas.length <= 2,
           'max-w-4xl mx-auto': availableAreas.length <= 3,
           'max-w-6xl mx-auto': availableAreas.length <= 4
         }">
      <div v-for="area in availableAreas" :key="area" 
           class="flex-shrink-0 text-center"
           :class="{
             'w-full sm:w-80': availableAreas.length === 1,
             'w-full sm:w-72': availableAreas.length === 2,
             'w-full sm:w-64': availableAreas.length === 3,
             'w-full sm:w-56': availableAreas.length >= 4
           }">
        <h3 class="text-lg font-medium text-gray-700 mb-2">{{ area }}</h3>
        <p class="text-sm text-gray-500 mb-4">{{ getAreaStats(area).total }} คน</p>
        
        <div class="relative inline-block">
          <!-- Dynamic Pie Chart -->
          <div class="relative">
            <svg width="200" height="200" class="mx-auto">
              <!-- Background Circle -->
              <circle 
                cx="100" 
                cy="100" 
                r="80" 
                fill="none" 
                stroke="#f3f4f6" 
                stroke-width="20"
              />
              
              <!-- Progress Circle for Completed -->
              <circle 
                v-if="getAreaStats(area).percentDone > 0"
                cx="100" 
                cy="100" 
                r="80" 
                fill="none" 
                :stroke="getAreaColor(area, 100)" 
                stroke-width="20"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="circumference - (getAreaStats(area).percentDone / 100) * circumference"
                stroke-linecap="round"
                transform="rotate(-90 100 100)"
              />
              
              <!-- Progress Circle for Not Completed -->
              <circle 
                v-if="getAreaStats(area).percentDone < 100"
                cx="100" 
                cy="100" 
                r="80" 
                fill="none" 
                :stroke="getAreaColor(area, 0)" 
                stroke-width="20"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="getAreaStats(area).percentDone > 0 ? 
                  circumference - ((100 - getAreaStats(area).percentDone) / 100) * circumference : 0"
                stroke-linecap="round"
                transform="rotate(-90 100 100)"
                :style="{ 
                  transform: `rotate(${getAreaStats(area).percentDone * 3.6 - 90}deg)`, 
                  transformOrigin: '100px 100px' 
                }"
              />
            </svg>
            
            <!-- Center Text -->
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <div class="text-3xl font-bold text-gray-800">
                {{ getAreaStats(area).percentDone }}%
              </div>
              <div class="text-sm text-gray-500 mt-1">COMPLETE</div>
            </div>
          </div>
        </div>
        
        <!-- Legend -->
        <div class="flex justify-center items-center mt-4 space-x-4">
          <div class="flex items-center">
            <div class="w-3 h-3 rounded-full mr-2" 
                 :style="{ backgroundColor: getAreaColor(area, 100) }"></div>
            <span class="text-sm text-gray-600">ทำแล้ว</span>
          </div>
          <div class="flex items-center">
            <div class="w-3 h-3 rounded-full mr-2" 
                 :style="{ backgroundColor: getAreaColor(area, 0) }"></div>
            <span class="text-sm text-gray-600">ยังไม่ได้ทำ</span>
          </div>
        </div>
        
        <!-- Stats -->
        <div class="mt-4 text-sm text-gray-500">
          <div>{{ getAreaStats(area).done }}/{{ getAreaStats(area).total }}</div>
        </div>
      </div>
    </div>
    
    <!-- Debug Info -->
    <div v-if="showDebug" class="mt-8 p-4 bg-gray-100 rounded-lg">
      <h4 class="font-semibold mb-2">ข้อมูลทั้งหมด:</h4>
      <div class="text-sm ">
        <p class="mb-2">ผู้ทำแบบสอบถามทั้งหมด: {{ allUsers.length }}</p>
        <p>พื้นที่: {{ availableAreas.join(', ') }}</p>
        <div v-for="area in availableAreas" :key="area" class="mt-2">
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
  v1Data: Object,
  v2Data: Object
})

const allUsers = ref([])
const loading = ref(true)
const error = ref(null)
const showDebug = ref(true)

// Circle circumference for SVG
const circumference = 2 * Math.PI * 80

// Color palette for different areas
const colorPalette = [
  { done: '#10b981', notDone: '#ef4444' }, // Green/Red
  { done: '#3b82f6', notDone: '#f59e0b' }, // Blue/Orange
  { done: '#8b5cf6', notDone: '#f97316' }, // Purple/Orange
  { done: '#06b6d4', notDone: '#ec4899' }, // Cyan/Pink
]

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/analytics/completion-status');
    allUsers.value = response.data;
  } catch (err) {
    error.value = 'Failed to fetch data.';
    console.error(err);
  } finally {
    loading.value = false;
  }
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
const v1Data = computed(() => {
  if (props.v1Data) return props.v1Data
  
  const stats = getAreaStats('Verte Smart Solution')
  return {
    labels: ['ทำแล้ว', 'ยังไม่ได้ทำ'],
    datasets: [{
      data: [stats.percentDone, 100 - stats.percentDone],
      backgroundColor: ['#10b981', '#ef4444'],
    }]
  }
})

const v2Data = computed(() => {
  if (props.v2Data) return props.v2Data
  
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