<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <NavbarDashboard />

    <!-- Main Content -->
    <main class="flex-1 ml-60 p-6">
      <div class="max-w-7xl mx-auto space-y-6">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div
            class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div>
              <h1 class="text-xl font-semibold text-gray-800">รายชื่อผู้ใช้</h1>
              <div
                class="text-sm text-gray-600 mt-2 flex flex-col md:flex-row gap-2"
              >
                <span>ทั้งหมด: {{ stats.total }}</span>
                <span>ทำแล้ว: {{ stats.done }}</span>
                <span>ยังไม่ได้ทำ: {{ stats.notDone }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-lg shadow-sm border p-4">
          <div class="flex flex-col md:flex-row gap-3">
            <input
              v-model="search"
              type="text"
              placeholder="ค้นหา ชื่อ/อีเมล/พื้นที่/ตำแหน่ง/สายงาน/กลุ่มงาน..."
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <select
              v-model="positionFilter"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">ตำแหน่งทั้งหมด</option>
              <option
                v-for="position in uniquePositions"
                :key="position"
                :value="position"
              >
                {{ position }}
              </option>
            </select>
            <select
              v-model="departmentFilter"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">สายงานทั้งหมด</option>
              <option
                v-for="department in uniqueDepartments"
                :key="department"
                :value="department"
              >
                {{ department }}
              </option>
            </select>
          </div>
        </div>

        <!-- Loading -->
        <div
          v-if="loading"
          class="bg-white rounded-lg shadow-sm border p-6 text-center"
        >
          <span class="text-gray-500">กำลังโหลดข้อมูล...</span>
        </div>

        <!-- Table -->
        <div
          v-else
          class="bg-white rounded-lg shadow-sm border overflow-hidden"
        >
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase w-16">
                    ลำดับ
                  </th>
                  <th
                    class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[120px]">
                    ชื่อ
                  </th>
                  <th
                    class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[160px]">
                    อีเมล
                  </th>
                  <th
                    class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[140px]">
                    พื้นที่
                  </th>
                  <th
                    class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[100px]">
                    ตำแหน่งงาน
                  </th>
                  <th
                    class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase w-16">
                    สายงาน
                  </th>
                  <th
                    class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[100px]">
                    กลุ่มงาน
                  </th>
                  <th
                    class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[90px]">
                    อายุงาน
                  </th>
                  <th
                    class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase w-20">
                    สถานะ
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="(user, index) in paginatedUsers"
                  :key="index"
                  class="hover:bg-gray-50"
                >
                  <td class="px-3 py-3 text-xs text-gray-900 font-medium">
                    {{ (currentPage - 1) * perPage + index + 1 }}
                  </td>
                  <td class="px-3 py-3 text-xs font-medium text-gray-900">
                    <div class="truncate max-w-[120px]" :title="user.name">
                      {{ user.name }}
                    </div>
                  </td>
                  <td class="px-3 py-3 text-xs text-gray-600">
                    <div class="truncate max-w-[160px]" :title="user.email">
                      {{ user.email }}
                    </div>
                  </td>
                  <td class="px-3 py-3 text-xs text-gray-600">
                    <div class="truncate max-w-[140px]" :title="user.area || '-'">
                      {{ user.area || "-" }}
                    </div>
                  </td>
                  <td class="px-3 py-3 text-xs text-gray-600">
                    <div class="truncate max-w-[100px]" :title="user.position || '-'">
                      {{ user.position || "-" }}
                    </div>
                  </td>
                  <td class="px-3 py-3 text-xs text-gray-600 text-center">
                    {{ user.department || "-" }}
                  </td>
                  <td class="px-3 py-3 text-xs text-gray-600">
                    <div class="truncate max-w-[100px]" :title="user.workGroup || '-'">
                      {{ user.workGroup || "-" }}
                    </div>
                  </td>
                  <td class="px-3 py-3 text-xs text-gray-600">
                    <div class="truncate max-w-[90px]" :title="formatWorkAge(user.workAge)">
                      {{ formatWorkAge(user.workAge) }}
                    </div>
                  </td>
                  <td class="px-3 py-3">
                    <span
                      v-if="user.status === 'done'"
                      class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 whitespace-nowrap"
                    >
                      ทำแล้ว
                    </span>
                    <span
                      v-else
                      class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 whitespace-nowrap"
                    >
                      ยังไม่ทำ
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="bg-gray-50 px-6 py-3 border-t">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-700">
                หน้า {{ currentPage }} จาก {{ totalPages }}
              </span>
              <div class="flex space-x-2">
                <button
                  @click="goToPage(currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
                >
                  ย้อนกลับ
                </button>
                <button
                  @click="goToPage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
                >
                  ถัดไป
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
import { ref, computed, onMounted, watch } from 'vue'
import NavbarDashboard from '../../../components/NavbarDashboard.vue'
import axios from 'axios'

const users = ref([])
const loading = ref(true)

const search = ref('')
const positionFilter = ref('all')
const departmentFilter = ref('all')
const currentPage = ref(1)
const perPage = 5

// ข้อมูลตัวอย่าง 5 รายชื่อ
const sampleUsers = [
  {
    name: "นายสมชาย วงศ์ใหญ่",
    email: "somchai.wong@company.com",
    area: "บริษัท ABC จำกัด",
    position: "ผู้บริหารระดับสูง",
    department: "CEO",
    workGroup: "หน่วยงานสนับสนุน",
    workAge: "มากกว่า 15 ปีขึ้นไป",
    status: "done"
  },
  {
    name: "นางสาวมาลี ศรีสุข",
    email: "malee.srisuk@company.com",
    area: "บริษัท FGH จำกัด",
    position: "พนักงาน",
    department: "PSE",
    workGroup: "หน่วยงานเดินเครื่อง",
    workAge: "3 ปีขึ้นไป แต่ไม่เกิน 5 ปี",
    status: "not_done"
  },
  {
    name: "นายประยุทธ จันทร์เพ็ญ",
    email: "prayut.chanpen@company.com",
    area: "บริษัท HIJ จำกัด",
    position: "ผู้จัดการแผนก",
    department: "CME",
    workGroup: "หน่วยงานวิศวกรรม",
    workAge: "10 ปีขึ้นไป แต่ไม่เกิน 15 ปี",
    status: "done"
  },
  {
    name: "นางสุดา รัตนโกมล",
    email: "suda.rattanakom@company.com",
    area: "บริษัท VUP จำกัด",
    position: "พนักงานอาวุโส",
    department: "COO",
    workGroup: "หน่วยงานบำรุงรักษา",
    workAge: "5 ปีขึ้นไป แต่ไม่เกิน 10 ปี",
    status: "not_done"
  },
  {
    name: "นายวิทยา ประสบสุข",
    email: "witya.prasopsuk@company.com",
    area: "บริษัท DFG จำกัด",
    position: "ผู้รับเหมาประจำ",
    department: "CFO",
    workGroup: "หน่วยงานสนับสนุน",
    workAge: "0-3 ปี",
    status: "done"
  }
]

onMounted(async () => {
  // ใช้ข้อมูลตัวอย่างทันทีเพื่อให้เห็นผล
  users.value = sampleUsers
  loading.value = false
  
  // คอมเมนต์ส่วน API ไว้ก่อน หากต้องการใช้ API ในภายหลัง
  /*
  try {
    const res = await axios.get('/api/user_excel/with-status')
    users.value = res.data
  } catch (err) {
    console.error('Error fetching users:', err)
    users.value = sampleUsers
  } finally {
    loading.value = false
  }
  */
})

// เด้งกลับไปหน้าที่ 1 เมื่อ search หรือ filter เปลี่ยน
watch([search, positionFilter, departmentFilter], () => {
  currentPage.value = 1
})

const stats = computed(() => {
  const total = users.value.length
  const done = users.value.filter(u => u.status === 'done').length
  const notDone = total - done
  return { total, done, notDone }
})

const uniquePositions = computed(() => {
  const positions = users.value
    .map(u => u.position)
    .filter(Boolean)
  return [...new Set(positions)].sort()
})

const uniqueDepartments = computed(() => {
  const departments = users.value
    .map(u => u.department)
    .filter(Boolean)
  return [...new Set(departments)].sort()
})

const filteredUsers = computed(() => {
  const keyword = search.value.toLowerCase()
  return users.value.filter(user => {
    const matchSearch = [
      user.name, 
      user.email, 
      user.area, 
      user.position, 
      user.department, 
      user.workGroup
    ].some(field =>
      String(field || '').toLowerCase().includes(keyword)
    )
    
    const matchPosition = 
      positionFilter.value === 'all' || user.position === positionFilter.value
    
    const matchDepartment = 
      departmentFilter.value === 'all' || user.department === departmentFilter.value
      
    return matchSearch && matchPosition && matchDepartment
  })
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredUsers.value.slice(start, start + perPage)
})

const totalPages = computed(() =>
  Math.ceil(filteredUsers.value.length / perPage)
)

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

function formatWorkAge(workAge) {
  if (!workAge) return '-'
  if (typeof workAge === 'string') {
    return workAge
  }
  if (typeof workAge === 'number') {
    return `${workAge} ปี`
  }
  return workAge
}
</script>