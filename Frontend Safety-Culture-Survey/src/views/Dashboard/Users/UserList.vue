<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <NavbarDashboard />

    <!-- Main Content -->
    <main class="flex-1 ml-60 p-6">
      <div class="max-w-7xl mx-auto space-y-4">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow border border-gray-200">
          <div class="px-6 py-4">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <h1 class="text-xl font-semibold flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  รายชื่อผู้ใช้งาน
                </h1>
                <div class="text-xs mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  <span>ทั้งหมด: <span class="font-medium ">{{ stats.total }}</span></span>
                  <span>ทำแล้ว: <span class="font-medium ">{{ stats.done }}</span></span>
                  <span>กำลังทำ: <span class="font-medium ">{{ stats.inProgress }}</span></span>
                  <span>ยังไม่เริ่ม: <span class="font-medium ">{{ stats.notStarted }}</span></span>
                  <span>ยังไม่ได้ลงทะเบียน: <span class="font-medium ">{{ stats.notRegistered }}</span></span>
                </div>
              </div>
              <button
                @click="exportToExcel"
                class="px-4 py-2 bg-white hover:bg-gray-50 text-blue-600 text-sm font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                ดาวน์โหลด Excel
              </button>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-lg shadow border border-gray-200 p-4">
          <div class="flex flex-col md:flex-row gap-3">
            <div class="flex-1 relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                v-model="search"
                type="text"
                placeholder="ค้นหา ชื่อ/อีเมล/พื้นที่/ตำแหน่ง/สายงาน/กลุ่มงาน..."
                class="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              v-model="statusFilter"
              class="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="all">สถานะทั้งหมด</option>
              <option value="done">ทำแล้ว</option>
              <option value="in_progress">กำลังทำ</option>
              <option value="not_started">ยังไม่เริ่ม</option>
              <option value="not_registered">ยังไม่ได้ลงทะเบียน</option>
            </select>
            <select
              v-model="positionFilter"
              class="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
              class="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
          class="bg-white rounded-lg shadow border border-gray-200 p-12 text-center"
        >
          <div class="inline-block animate-spin rounded-full h-10 w-10 border-3 border-gray-200 border-t-blue-600"></div>
          <p class="mt-4 text-sm text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>

        <!-- Table -->
        <div v-else class="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-12">
                    ลำดับ
                  </th>
                  <th class="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[80px]">
                    คำนำหน้า
                  </th>
                  <th class="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[100px]">
                    ชื่อ - สกุล
                  </th>
                  <th class="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[130px]">
                    อีเมล
                  </th>
                  <th class="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[110px]">
                    บริษัทฯ/พื้นที่
                  </th>
                  <th class="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[90px]">
                    ตำแหน่งงาน
                  </th>
                  <th class="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase w-16">
                    สายงาน
                  </th>
                  <th class="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[90px]">
                    กลุ่มงาน
                  </th>
                  <th class="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[90px]">
                    ส่วนงาน
                  </th>
                  <th class="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase min-w-[80px]">
                    อายุงาน
                  </th>
                  <th class="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase w-20">
                    สถานะ
                  </th>
                  <th class="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase w-28">
                    การจัดการ
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr
                  v-for="(user, index) in paginatedUsers"
                  :key="index"
                  class="hover:bg-gray-50"
                >
                  <td class="px-3 py-3 text-xs text-gray-900 font-medium">
                    {{ (currentPage - 1) * perPage + index + 1 }}
                  </td>
                  <td class="px-3 py-3 text-xs text-gray-600">
                    <div v-if="!user.isEditing" class="truncate max-w-[80px]" :title="displayValue(user.title_user)">
                      {{ displayValue(user.title_user) }}
                    </div>
                    <input
                      v-else
                      v-model="user.title_user"
                      type="text"
                      class="w-full bg-blue-50 border border-blue-300 px-2 py-1 text-xs text-gray-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded"
                      placeholder="คำนำหน้า"
                    />
                  </td>
                  <td class="px-3 py-3 text-xs font-medium text-gray-900">
                    <div v-if="!user.isEditing" class="truncate max-w-[100px]" :title="displayValue(user.name_user)">
                      {{ displayValue(user.name_user) }}
                    </div>
                    <input
                      v-else
                      v-model="user.name_user"
                      type="text"
                      class="w-full bg-blue-50 border border-blue-300 px-2 py-1 text-xs font-medium text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded"
                    />
                  </td>
                  <td class="px-3 py-3 text-xs text-gray-600">
                    <div v-if="!user.isEditing" class="truncate max-w-[130px]" :title="user.email_user">
                      {{ user.email_user }}
                    </div>
                    <input
                      v-else
                      v-model="user.email_user"
                      type="email"
                      class="w-full bg-blue-50 border border-blue-300 px-2 py-1 text-xs text-gray-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded"
                    />
                  </td>
                  <td class="px-3 py-3 text-xs text-gray-600">
                    <div v-if="!user.isEditing" class="truncate max-w-[110px]" :title="displayValue(user.company_user)">
                      {{ displayValue(user.company_user) }}
                    </div>
                    <input
                      v-else
                      v-model="user.company_user"
                      type="text"
                      class="w-full bg-blue-50 border border-blue-300 px-2 py-1 text-xs text-gray-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded"
                      placeholder="พื้นที่"
                    />
                  </td>
                  <td class="px-3 py-3 text-xs text-gray-600">
                    <div v-if="!user.isEditing" class="truncate max-w-[90px]" :title="displayValue(user.position_user)">
                      {{ displayValue(user.position_user) }}
                    </div>
                    <input
                      v-else
                      v-model="user.position_user"
                      type="text"
                      class="w-full bg-blue-50 border border-blue-300 px-2 py-1 text-xs text-gray-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded"
                      placeholder="ตำแหน่ง"
                    />
                  </td>
                  <td class="px-3 py-3 text-xs text-gray-600 text-center">
                    <div v-if="!user.isEditing">
                      {{ displayValue(user.job_field_user) }}
                    </div>
                    <input
                      v-else
                      v-model="user.job_field_user"
                      type="text"
                      class="w-full bg-blue-50 border border-blue-300 px-2 py-1 text-xs text-gray-600 text-center focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded"
                      placeholder="สายงาน"
                    />
                  </td>
                  <td class="px-3 py-3 text-xs text-gray-600">
                    <div v-if="!user.isEditing" class="truncate max-w-[90px]" :title="displayValue(user.work_group_user)">
                      {{ displayValue(user.work_group_user) }}
                    </div>
                    <input
                      v-else
                      v-model="user.work_group_user"
                      type="text"
                      class="w-full bg-blue-50 border border-blue-300 px-2 py-1 text-xs text-gray-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded"
                      placeholder="กลุ่มงาน"
                    />
                  </td>
                  <td class="px-3 py-3 text-xs text-gray-600">
                    <div v-if="!user.isEditing" class="truncate max-w-[90px]" :title="displayValue(user.section_user)">
                      {{ displayValue(user.section_user) }}
                    </div>
                    <input
                      v-else
                      v-model="user.section_user"
                      type="text"
                      class="w-full bg-blue-50 border border-blue-300 px-2 py-1 text-xs text-gray-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded"
                      placeholder="ส่วนงาน"
                    />
                  </td>
                  <td class="px-3 py-3 text-xs text-gray-600">
                    <div v-if="!user.isEditing" class="truncate max-w-[80px]" :title="displayValue(user.years_of_service)">
                      {{ displayValue(user.years_of_service) }}
                    </div>
                    <input
                      v-else
                      v-model="user.years_of_service"
                      type="text"
                      class="w-full bg-blue-50 border border-blue-300 px-2 py-1 text-xs text-gray-600 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded"
                      placeholder="อายุงาน"
                    />
                  </td>
                  <td class="px-3 py-3">
                    <span
                      v-if="user.status === 'done'"
                      class="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800"
                    >
                      ทำแล้ว
                    </span>
                    <span
                      v-else-if="user.status === 'in_progress'"
                      class="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-800"
                    >
                      กำลังทำ
                    </span>
                    <span
                      v-else-if="user.status === 'not_started'"
                      class="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800"
                    >
                      ยังไม่เริ่ม
                    </span>
                    <span
                      v-else-if="user.status === 'not_registered'"
                      class="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800"
                    >
                      ยังไม่ได้ลงทะเบียน
                    </span>
                    <span
                      v-else
                      class="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800"
                    >
                      ยังไม่เริ่ม
                    </span>
                  </td>
                  <td class="px-3 py-3">
                    <div v-if="!user.isEditing" class="flex justify-center gap-1">
                      <button
                        @click="editUser(user, index)"
                        class="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200"
                      >
                        แก้ไข
                      </button>
                      <button
                        @click="deleteUser(user, index)"
                        class="px-2 py-1 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded border border-red-200"
                      >
                        ลบ
                      </button>
                    </div>
                    <div v-else class="flex justify-center gap-1">
                      <button
                        @click="saveUser(user, index)"
                        class="px-2 py-1 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded border border-green-200"
                      >
                        บันทึก
                      </button>
                      <button
                        @click="cancelEdit(user, index)"
                        class="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200"
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
          <div class="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div class="flex flex-col sm:flex-row justify-between items-center gap-3">
              <span class="text-sm text-gray-700">
                หน้า {{ currentPage }} จาก {{ totalPages }}
                <span class="text-gray-500 ml-2">(แสดง {{ paginatedUsers.length }} จาก {{ filteredUsers.length }} รายการ)</span>
              </span>
              <div class="flex gap-2">
                <button
                  @click="goToPage(currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ย้อนกลับ
                </button>
                <button
                  @click="goToPage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeDeleteModal"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="p-6">
          <div class="flex items-start mb-4">
            <div class="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <div class="ml-3 flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-1">ยืนยันการลบข้อมูล</h3>
              <p class="text-sm text-gray-600">
                คุณแน่ใจหรือไม่ที่ต้องการลบ "{{ displayValue(userToDelete?.name_user) }}" การกระทำนี้ไม่สามารถยกเลิกได้
              </p>
            </div>
          </div>
          
          <div class="flex justify-end gap-2 mt-6">
            <button
              @click="closeDeleteModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-lg border border-gray-300"
            >
              ยกเลิก
            </button>
            <button
              @click="confirmDelete"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
            >
              ลบข้อมูล
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
import * as XLSX from 'xlsx'

const users = ref([])
const loading = ref(true)

const search = ref('')
const statusFilter = ref('all')
const positionFilter = ref('all')
const departmentFilter = ref('all')
const currentPage = ref(1)
const perPage = 10

const showDeleteModal = ref(false)
const userToDelete = ref(null)
const deleteIndex = ref(-1)

const originalUserData = ref({})

// Function to fetch users from backend
const fetchUsers = async () => {
  try {
    loading.value = true
    const response = await axios.get('http://localhost:5000/api/users/users')
    users.value = response.data.map(user => ({
      ...user,
      isEditing: false
    }))
  } catch (error) {
    console.error('Error fetching users:', error)
    users.value = []
  } finally {
    loading.value = false
  }
}

// Function to refresh users data (to be called after registration)
const refreshUsers = async () => {
  await fetchUsers()
}

function displayValue(value) {
  if (value === null || value === undefined || value === '' || value === '-') {
    return '-'
  }
  return String(value).trim() || '-'
}

function getStatusText(status) {
  const statusMap = {
    'done': 'ทำแล้ว',
    'in_progress': 'กำลังทำ',
    'not_started': 'ยังไม่เริ่ม',
    'not_registered': 'ยังไม่ได้ลงทะเบียน',
    'registered': 'ยังไม่เริ่ม',
    'active': 'ยังไม่เริ่ม'
  }
  return statusMap[status] || status
}

function exportToExcel() {
  const exportData = filteredUsers.value.map((user, index) => ({
    'ลำดับ': index + 1,
    'คำนำหน้า': displayValue(user.title_user),
    'ชื่อ - สกุล': displayValue(user.name_user),
    'อีเมล': user.email_user,
    'บริษัทฯ/พื้นที่': displayValue(user.company_user),
    'ตำแหน่งงาน': displayValue(user.position_user),
    'สายงาน': displayValue(user.job_field_user),
    'กลุ่มงาน': displayValue(user.work_group_user),
    'ส่วนงาน': displayValue(user.section_user),
    'อายุงาน': displayValue(user.years_of_service),
    'สถานะ': getStatusText(user.status)
  }))

  const ws = XLSX.utils.json_to_sheet(exportData)

  ws['!cols'] = [
    { wch: 8 },
    { wch: 15 },
    { wch: 25 },
    { wch: 30 },
    { wch: 25 },
    { wch: 20 },
    { wch: 12 },
    { wch: 20 },
    { wch: 20 },
    { wch: 25 },
    { wch: 18 }
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'รายชื่อผู้ใช้')

  const date = new Date()
  const filename = `รายชื่อผู้ใช้_${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}.xlsx`

  XLSX.writeFile(wb, filename)
}

function editUser(user, index) {
  originalUserData.value[index] = { ...user }
  user.isEditing = true
  users.value = [...users.value]
}

function saveUser(user, index) {
  const fieldsToNormalize = ['title_user', 'name_user', 'position_user', 'section_user', 'job_field_user', 'work_group_user', 'years_of_service', 'company_user']
  fieldsToNormalize.forEach(field => {
    if (!user[field] || String(user[field]).trim() === '') {
      user[field] = '-'
    }
  })
  
  user.isEditing = false
  delete originalUserData.value[index]
  users.value = [...users.value]
}

function cancelEdit(user, index) {
  if (originalUserData.value[index]) {
    const originalData = originalUserData.value[index]
    Object.keys(originalData).forEach(key => {
      if (key !== 'isEditing') {
        user[key] = originalData[key]
      }
    })
    delete originalUserData.value[index]
  }
  user.isEditing = false
  users.value = [...users.value]
}

onMounted(async () => {
  await fetchUsers()
  // Expose refresh function globally for other components to call
  window.refreshUsersList = fetchUsers
})

watch([search, statusFilter, positionFilter, departmentFilter], () => {
  currentPage.value = 1
})

const stats = computed(() => {
  const total = users.value.length
  const done = users.value.filter(u => u.status === 'done').length
  const inProgress = users.value.filter(u => u.status === 'in_progress').length
  const notStarted = users.value.filter(u => u.status === 'not_started' || u.status === 'registered' || u.status === 'active').length
  const notRegistered = users.value.filter(u => u.status === 'not_registered').length
  return { total, done, inProgress, notStarted, notRegistered }
})

const uniquePositions = computed(() => {
  const positions = users.value
    .map(u => u.position_user)
    .filter(p => p && p !== '-')
  return [...new Set(positions)].sort()
})

const uniqueDepartments = computed(() => {
  const departments = users.value
    .map(u => u.job_field_user)
    .filter(d => d && d !== '-')
  return [...new Set(departments)].sort()
})

const filteredUsers = computed(() => {
  const keyword = search.value.toLowerCase()
  // Sort users by sortOrder to maintain original Excel order
  const sortedUsers = [...users.value].sort((a, b) => {
    return (a.sortOrder || 0) - (b.sortOrder || 0)
  })
  
  return sortedUsers.filter(user => {
    const matchSearch = [
      user.title_user,
      user.name_user, 
      user.email_user, 
      user.company_user, 
      user.position_user, 
      user.section_user,
      user.job_field_user, 
      user.work_group_user
    ].some(field => {
      const value = displayValue(field)
      return value !== '-' && value.toLowerCase().includes(keyword)
    })
    
    const matchStatus = 
      statusFilter.value === 'all' || 
      user.status === statusFilter.value ||
      (statusFilter.value === 'not_started' && (user.status === 'registered' || user.status === 'active'))
    
    const matchPosition = 
      positionFilter.value === 'all' || user.position_user === positionFilter.value
    
    const matchDepartment = 
      departmentFilter.value === 'all' || user.job_field_user === departmentFilter.value
      
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
      u.name_user === userToDelete.value.name_user && 
      u.email_user === userToDelete.value.email_user
    )
    if (actualIndex >= 0) {
      users.value.splice(actualIndex, 1)
    }
  }
  closeDeleteModal()
}

// Make refreshUsers available globally
window.refreshUsersList = refreshUsers
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}
</style>