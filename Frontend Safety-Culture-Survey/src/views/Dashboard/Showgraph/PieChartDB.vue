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
          <!-- Dynamic Pie Chart - แสดงทันทีไม่มี loading -->
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
              
              <!-- Progress Circle for Not Completed (always show when there's incomplete work) -->
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

// Props (if needed from parent)
const props = defineProps({
  v1Data: Object,
  v2Data: Object
})

// Local data - ไม่มี loading state แล้ว
const allUsers = ref([])
const showDebug = ref(true) // Set to true for debugging

// Circle circumference for SVG
const circumference = 2 * Math.PI * 80

// Color palette for different areas
const colorPalette = [
  { done: '#10b981', notDone: '#ef4444' }, // Green/Red - Verte Smart Solution
  { done: '#3b82f6', notDone: '#f59e0b' }, // Blue/Orange - Verte Security
  { done: '#8b5cf6', notDone: '#f97316' }, // Purple/Orange - V3
  { done: '#06b6d4', notDone: '#ec4899' }, // Cyan/Pink - V4
]

// Mock data for demo - ย้ายมาด้านนอก function เพื่อให้เข้าถึงได้ทันที
const mockUsers = [
  // Verte Smart Solution
  { id: 1, name: 'สมชาย ใจดี', area: 'Verte Smart Solution', status: 'done' },
  { id: 2, name: 'สมหญิง รักงาน', area: 'Verte Smart Solution', status: 'done' },
  { id: 3, name: 'วิชัย เก่งมาก', area: 'Verte Smart Solution', status: 'done' },
  { id: 4, name: 'นิรมล สวยงาม', area: 'Verte Smart Solution', status: 'pending' },
  { id: 5, name: 'ประยุทธ์ มั่นใจ', area: 'Verte Smart Solution', status: 'done' },
  { id: 6, name: 'สุดา น่ารัก', area: 'Verte Smart Solution', status: 'pending' },
  { id: 7, name: 'กิตติ ขยัน', area: 'Verte Smart Solution', status: 'done' },
  { id: 8, name: 'มณี เฉลียว', area: 'Verte Smart Solution', status: 'done' },
  { id: 9, name: 'ชัยรัตน์ ดีใจ', area: 'Verte Smart Solution', status: 'pending' },
  { id: 10, name: 'อารีย์ มีสุข', area: 'Verte Smart Solution', status: 'done' },
  
  // Verte Security
  { id: 11, name: 'สมศักดิ์ ปลอดภัย', area: 'Verte Security', status: 'done' },
  { id: 12, name: 'วันเพ็ญ ระวัง', area: 'Verte Security', status: 'done' },
  { id: 13, name: 'ธีรพงศ์ เข้มแข็ง', area: 'Verte Security', status: 'done' },
  { id: 14, name: 'ภัทรา ใส่ใจ', area: 'Verte Security', status: 'done' },
  { id: 15, name: 'จักรพงษ์ ตั้งใจ', area: 'Verte Security', status: 'pending' },
  { id: 16, name: 'กนกวรรณ เอาใจใส่', area: 'Verte Security', status: 'done' },
  { id: 17, name: 'อนุชา รอบคอบ', area: 'Verte Security', status: 'pending' },
  { id: 18, name: 'สมพร ดูแล', area: 'Verte Security', status: 'done' },
  { id: 19, name: 'วิทยา เฝ้าระวัง', area: 'Verte Security', status: 'done' },
  { id: 20, name: 'นันทนา ปกป้อง', area: 'Verte Security', status: 'pending' },
  { id: 21, name: 'รัชต์ มั่นคง', area: 'Verte Security', status: 'done' },
  { id: 22, name: 'สิริวรรณ แน่นอน', area: 'Verte Security', status: 'done' },
  { id: 23, name: 'ธนวัฒน์ เชื่อถือ', area: 'Verte Security', status: 'pending' },
  { id: 24, name: 'อรุณี แกร่ง', area: 'Verte Security', status: 'done' },
  { id: 25, name: 'เสกสรร พิทักษ์', area: 'Verte Security', status: 'done' }
]

// โหลดข้อมูลทันทีตอนสร้าง component
allUsers.value = mockUsers
console.log('Data loaded immediately:', allUsers.value)

onMounted(() => {
  // หากต้องการโหลดข้อมูลจริงจาก API สามารถทำได้ที่นี่
  console.log('Component mounted, data already available')
})

// Get unique areas from data
const availableAreas = computed(() => {
  const areas = [...new Set(allUsers.value.map(u => u.area).filter(Boolean))]
  // Sort areas alphabetically
  return areas.sort()
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