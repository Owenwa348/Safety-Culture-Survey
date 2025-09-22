<template>
  <div>
    <h2 class="text-xl font-semibold text-gray-800 mb-6 text-center">
      เปอร์เซ็นต์การทำแบบประเมิน
    </h2>
    
    <!-- Dynamic Charts based on available areas -->
    <div class="flex flex-wrap justify-center gap-8" 
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
          <!-- Loading State -->
          <div v-if="loading" class="flex items-center justify-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
          
          <!-- Dynamic Pie Chart -->
          <div v-else class="relative">
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
              
              <!-- Progress Circle -->
              <circle 
                cx="100" 
                cy="100" 
                r="80" 
                fill="none" 
                :stroke="getAreaColor(area, getAreaStats(area).percentDone)" 
                stroke-width="20"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="getAreaStats(area).percentDone > 0 ? 
                  circumference - (getAreaStats(area).percentDone / 100) * circumference : 0"
                stroke-linecap="round"
                transform="rotate(-90 100 100)"
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

    <!-- Debug Info (remove in production) -->
    <div v-if="showDebug" class="mt-8 p-4 bg-gray-100 rounded-lg">
      <h4 class="font-semibold mb-2">Debug Info:</h4>
      <div class="text-sm">
        <p>Total Users: {{ allUsers.length }}</p>
        <p>Available Areas: {{ availableAreas.join(', ') }}</p>
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
import axios from 'axios'

// Props (if needed from parent)
const props = defineProps({
  v1Data: Object,
  v2Data: Object
})

// Local data
const allUsers = ref([])
const loading = ref(true)
const showDebug = ref(false) // Set to true for debugging

// Circle circumference for SVG
const circumference = 2 * Math.PI * 80

// Color palette for different areas
const colorPalette = [
  { done: '#10b981', notDone: '#ef4444' }, // Green/Red - V1
  { done: '#3b82f6', notDone: '#f59e0b' }, // Blue/Orange - V2
  { done: '#8b5cf6', notDone: '#f97316' }, // Purple/Orange - V3
  { done: '#06b6d4', notDone: '#ec4899' }, // Cyan/Pink - V4
  { done: '#84cc16', notDone: '#6366f1' }, // Lime/Indigo - V5
  { done: '#f59e0b', notDone: '#14b8a6' }, // Amber/Teal - V6
  { done: '#ef4444', notDone: '#8b5cf6' }, // Red/Purple - V7
  { done: '#64748b', notDone: '#f97316' }, // Slate/Orange - V8
]

onMounted(async () => {
  try {
    console.log('Loading user data...')
    const res = await axios.get('/user_excel/with-status')
    console.log('API Response:', res.data)
    
    allUsers.value = res.data || []
    
    if (allUsers.value.length === 0) {
      console.warn('No users data received')
    }
  } catch (err) {
    console.error('Failed to load data:', err)
    console.error('Error details:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    })
  } finally {
    loading.value = false
  }
})

// Get unique areas from data
const availableAreas = computed(() => {
  const areas = [...new Set(allUsers.value.map(u => u.area).filter(Boolean))]
  // Sort areas naturally (V1, V2, V3, etc.)
  return areas.sort((a, b) => {
    const aNum = parseInt(a.replace(/\D/g, '')) || 0
    const bNum = parseInt(b.replace(/\D/g, '')) || 0
    return aNum - bNum
  })
})

// Get users by area
function getUsersByArea(area) {
  return allUsers.value.filter(u => u.area === area)
}

// Get stats for specific area
function getAreaStats(area) {
  const users = getUsersByArea(area)
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
  
  const stats = getAreaStats('V1')
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
  
  const stats = getAreaStats('V2')
  return {
    labels: ['ทำแล้ว', 'ยังไม่ได้ทำ'],
    datasets: [{
      data: [stats.percentDone, 100 - stats.percentDone],
      backgroundColor: ['#3b82f6', '#f59e0b'],
    }]
  }
})
</script>