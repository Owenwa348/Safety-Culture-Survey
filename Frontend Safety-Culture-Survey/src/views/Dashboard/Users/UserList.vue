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
                <span>กำลังทำ: {{ stats.inProgress }}</span>
                <span>ยังไม่เริ่ม: {{ stats.notStarted }}</span>
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
              v-model="statusFilter"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">สถานะทั้งหมด</option>
              <option value="done">ทำแล้ว</option>
              <option value="in_progress">กำลังทำ</option>
              <option value="not_started">ยังไม่เริ่ม</option>
            </select>
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
                  <th
                    class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">
                    การจัดการ
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
                    <div v-if="!user.isEditing" class="truncate max-w-[120px]" :title="user.name">
                      {{ user.name }}
                    </div>
                    <input
                      v-else
                      v-model="user.name"
                      type="text"
                      class="w-full bg-white border border-blue-300 px-2 py-1 text-xs font-medium text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded"
                    />
                  </td>
                  <td class="px-3 py-3 text-xs text-gray-600">
                    <div v-if="!user.isEditing" class="truncate max-w-[160px]" :title="user.email">
                      {{ user.email }}
                    </div>
                    <input
                      v-else
                      v-model="user.email"
                      type="email"
                      class="w-full bg-white border border-blue-300 px-2 py-1 text-xs text-gray-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded"
                    />
                  </td>
                  <td class="px-3 py-3 text-xs text-gray-600">
                    <div v-if="!user.isEditing" class="truncate max-w-[140px]" :title="user.area || '-'">
                      {{ user.area || "-" }}
                    </div>
                    <input
                      v-else
                      v-model="user.area"
                      type="text"
                      class="w-full bg-white border border-blue-300 px-2 py-1 text-xs text-gray-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded"
                      placeholder="พื้นที่"
                    />
                  </td>
                  <td class="px-3 py-3 text-xs text-gray-600">
                    <div v-if="!user.isEditing" class="truncate max-w-[100px]" :title="user.position || '-'">
                      {{ user.position || "-" }}
                    </div>
                    <input
                      v-else
                      v-model="user.position"
                      type="text"
                      class="w-full bg-white border border-blue-300 px-2 py-1 text-xs text-gray-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded"
                      placeholder="ตำแหน่ง"
                    />
                  </td>
                  <td class="px-3 py-3 text-xs text-gray-600 text-center">
                    <div v-if="!user.isEditing">
                      {{ user.department || "-" }}
                    </div>
                    <input
                      v-else
                      v-model="user.department"
                      type="text"
                      class="w-full bg-white border border-blue-300 px-2 py-1 text-xs text-gray-600 text-center focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded"
                      placeholder="สายงาน"
                    />
                  </td>
                  <td class="px-3 py-3 text-xs text-gray-600">
                    <div v-if="!user.isEditing" class="truncate max-w-[100px]" :title="user.workGroup || '-'">
                      {{ user.workGroup || "-" }}
                    </div>
                    <input
                      v-else
                      v-model="user.workGroup"
                      type="text"
                      class="w-full bg-white border border-blue-300 px-2 py-1 text-xs text-gray-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded"
                      placeholder="กลุ่มงาน"
                    />
                  </td>
                  <td class="px-3 py-3 text-xs text-gray-600">
                    <div v-if="!user.isEditing" class="truncate max-w-[90px]" :title="formatWorkAge(user.workAge)">
                      {{ formatWorkAge(user.workAge) }}
                    </div>
                    <input
                      v-else
                      v-model="user.workAge"
                      type="text"
                      class="w-full bg-white border border-blue-300 px-2 py-1 text-xs text-gray-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded"
                      placeholder="อายุงาน"
                    />
                  </td>
                  <td class="px-3 py-3">
                    <span
                      v-if="user.status === 'done'"
                      class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 whitespace-nowrap"
                    >
                      ทำแล้ว
                    </span>
                    <span
                      v-else-if="user.status === 'in_progress'"
                      class="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 whitespace-nowrap"
                    >
                      กำลังทำ
                    </span>
                    <span
                      v-else
                      class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 whitespace-nowrap"
                    >
                      ยังไม่เริ่ม
                    </span>
                  </td>
                  <td class="px-3 py-3">
                    <div v-if="!user.isEditing" class="flex space-x-2">
                      <button
                        @click="editUser(user, index)"
                        class="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
                      >
                        แก้ไข
                      </button>
                      <button
                        @click="deleteUser(user, index)"
                        class="px-2 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded border border-red-200 transition-colors"
                      >
                        ลบ
                      </button>
                    </div>
                    <div v-else class="flex space-x-2">
                      <button
                        @click="saveUser(user, index)"
                        class="px-2 py-1 text-xs font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded border border-green-200 transition-colors"
                      >
                        บันทึก
                      </button>
                      <button
                        @click="cancelEdit(user, index)"
                        class="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition-colors"
                      >
                        ยกเลิก
                      </button>
                    </div>
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

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeDeleteModal"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-sm m-4">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-800">ยืนยันการลบ</h3>
              <p class="text-sm text-gray-600 mt-1">
                คุณแน่ใจหรือไม่ที่ต้องการลบ "{{ userToDelete?.name }}" ?
              </p>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3">
            <button
              @click="closeDeleteModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              ยกเลิก
            </button>
            <button
              @click="confirmDelete"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              ลบ
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import NavbarDashboard from '../../../components/NavbarDashboard.vue'
import axios from 'axios'

const users = ref([])
const loading = ref(true)

const search = ref('')
const statusFilter = ref('all')
const positionFilter = ref('all')
const departmentFilter = ref('all')
const currentPage = ref(1)
const perPage = 5

// Modal states
const showDeleteModal = ref(false)
const userToDelete = ref(null)
const deleteIndex = ref(-1)

// Store original data for cancel functionality
const originalUserData = ref({})

// Edit user functions
function editUser(user, index) {
  console.log('Edit button clicked for:', user.name) // Debug log
  // Store original data before editing
  originalUserData.value[index] = { ...user }
  // Set editing mode
  user.isEditing = true
  // Force reactivity update
  users.value = [...users.value]
}

function saveUser(user, index) {
  console.log('Saving user data:', user) // Debug log
  // Here you can add API call to save data
  
  // Remove editing mode
  user.isEditing = false
  
  // Clear original data
  delete originalUserData.value[index]
  
  // Force reactivity update
  users.value = [...users.value]
  
  // Example API call:
  // try {
  //   await axios.put(`/api/users/${user.id}`, user)
  // } catch (error) {
  //   console.error('Error saving user:', error)
  // }
}

function cancelEdit(user, index) {
  console.log('Cancel edit for:', user.name) // Debug log
  // Restore original data
  if (originalUserData.value[index]) {
    const originalData = originalUserData.value[index]
    Object.keys(originalData).forEach(key => {
      if (key !== 'isEditing') {
        user[key] = originalData[key]
      }
    })
    delete originalUserData.value[index]
  }
  
  // Remove editing mode
  user.isEditing = false
  
  // Force reactivity update
  users.value = [...users.value]
}

// ข้อมูลตัวอย่าง 5 รายชื่อ (เพิ่มสถานะ in_progress และ isEditing)
const sampleUsers = [
  {
    name: "นายสมชาย วงศ์ใหญ่",
    email: "somchai.wong@company.com",
    area: "บริษัท ABC จำกัด",
    position: "ผู้บริหารระดับสูง",
    department: "CEO",
    workGroup: "หน่วยงานสนับสนุน",
    workAge: "มากกว่า 15 ปีขึ้นไป",
    status: "done",
    isEditing: false
  },
  {
    name: "นางสาวมาลี ศรีสุข",
    email: "malee.srisuk@company.com",
    area: "บริษัท FGH จำกัด",
    position: "พนักงาน",
    department: "PSE",
    workGroup: "หน่วยงานเดินเครื่อง",
    workAge: "3 ปีขึ้นไป แต่ไม่เกิน 5 ปี",
    status: "in_progress",
    isEditing: false
  },
  {
    name: "นายประยุทธ จันทร์เพ็ญ",
    email: "prayut.chanpen@company.com",
    area: "บริษัท HIJ จำกัด",
    position: "ผู้จัดการแผนก",
    department: "CME",
    workGroup: "หน่วยงานวิศวกรรม",
    workAge: "10 ปีขึ้นไป แต่ไม่เกิน 15 ปี",
    status: "done",
    isEditing: false
  },
  {
    name: "นางสุดา รัตนโกมล",
    email: "suda.rattanakom@company.com",
    area: "บริษัท VUP จำกัด",
    position: "พนักงานอาวุโส",
    department: "COO",
    workGroup: "หน่วยงานบำรุงรักษา",
    workAge: "5 ปีขึ้นไป แต่ไม่เกิน 10 ปี",
    status: "not_started",
    isEditing: false
  },
  {
    name: "นายวิทยา ประสบสุข",
    email: "witya.prasopsuk@company.com",
    area: "บริษัท DFG จำกัด",
    position: "ผู้รับเหมาประจำ",
    department: "CFO",
    workGroup: "หน่วยงานสนับสนุน",
    workAge: "0-3 ปี",
    status: "in_progress",
    isEditing: false
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
watch([search, statusFilter, positionFilter, departmentFilter], () => {
  currentPage.value = 1
})

const stats = computed(() => {
  const total = users.value.length
  const done = users.value.filter(u => u.status === 'done').length
  const inProgress = users.value.filter(u => u.status === 'in_progress').length
  const notStarted = users.value.filter(u => u.status === 'not_started').length
  return { total, done, inProgress, notStarted }
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
    
    const matchStatus = 
      statusFilter.value === 'all' || user.status === statusFilter.value
    
    const matchPosition = 
      positionFilter.value === 'all' || user.position === positionFilter.value
    
    const matchDepartment = 
      departmentFilter.value === 'all' || user.department === departmentFilter.value
      
    return matchSearch && matchStatus && matchPosition && matchDepartment
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

// Delete user functions
function deleteUser(user, index) {
  userToDelete.value = user
  deleteIndex.value = index
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  userToDelete.value = null
  deleteIndex.value = -1
}

function confirmDelete() {
  if (userToDelete.value) {
    const actualIndex = users.value.findIndex(u => 
      u.name === userToDelete.value.name && 
      u.email === userToDelete.value.email
    )
    if (actualIndex >= 0) {
      users.value.splice(actualIndex, 1)
    }
  }
  closeDeleteModal()
}
</script>