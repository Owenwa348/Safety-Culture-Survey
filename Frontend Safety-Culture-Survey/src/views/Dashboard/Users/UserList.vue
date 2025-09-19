<template>
  <div class="bg-gray-50 p-6">
    <div class="max-w-6xl mx-auto space-y-6">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm border p-6">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 class="text-xl font-semibold text-gray-800">รายชื่อผู้ใช้</h1>
            <div class="text-sm text-gray-600 mt-2 flex flex-col md:flex-row gap-2">
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
            placeholder="ค้นหา ชื่อ/อีเมล/พื้นที่..."
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <select v-model="agencyFilter" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500">
            <option value="all">หน่วยงานทั้งหมด</option>
            <option v-for="agency in uniqueAgencies" :key="agency" :value="agency">
              {{ agency }}
            </option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="bg-white rounded-lg shadow-sm border p-6 text-center">
        <span class="text-gray-500">กำลังโหลดข้อมูล...</span>
      </div>

      <!-- Table -->
      <div v-else class="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ลำดับ</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ชื่อ</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">อีเมล</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">พื้นที่</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">หน่วยงาน</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานะ</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="(user, index) in paginatedUsers"
                :key="index"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 text-gray-900 font-medium">
                  {{ (currentPage - 1) * perPage + index + 1 }}
                </td>
                <td class="px-6 py-4 font-medium text-gray-900">{{ user.name }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ user.email }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ user.area || '-' }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ formatAgency(user) }}</td>
                <td class="px-6 py-4">
                  <span
                    v-if="user.status === 'done'"
                    class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800"
                  >
                    ทำแล้ว
                  </span>
                  <span
                    v-else
                    class="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800"
                  >
                    ยังไม่ได้ทำ
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
  </div>
</template>
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'

const users = ref([])
const loading = ref(true)

const search = ref('')
const agencyFilter = ref('all')
const currentPage = ref(1)
const perPage = 5

onMounted(async () => {
  try {
    const res = await axios.get('/api/user_excel/with-status')
    users.value = res.data
  } catch (err) {
    console.error('Error fetching users:', err)
  } finally {
    loading.value = false
  }
})

// เด้งกลับไปหน้าที่ 1 เมื่อ search หรือ agencyFilter เปลี่ยน
watch([search, agencyFilter], () => {
  currentPage.value = 1
})

const stats = computed(() => {
  const total = users.value.length
  const done = users.value.filter(u => u.status === 'done').length
  const notDone = total - done
  return { total, done, notDone }
})

const uniqueAgencies = computed(() => {
  const agencies = users.value
    .map(u => u.agencyEVP)
    .filter(Boolean)
  return ['all', ...new Set(agencies)]
})

const filteredUsers = computed(() => {
  const keyword = search.value.toLowerCase()
  return users.value.filter(user => {
    const matchSearch = [user.name, user.email, user.area].some(field =>
      String(field || '').toLowerCase().includes(keyword)
    )
    const matchAgency =
      agencyFilter.value === 'all' || user.agencyEVP === agencyFilter.value
    return matchSearch && matchAgency
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

function formatAgency(user) {
  const levels = [user.agencyEVP, user.agencySVP, user.agencyDM]
    .filter(Boolean)
  return levels.join(' / ') || '-'
}
</script>
