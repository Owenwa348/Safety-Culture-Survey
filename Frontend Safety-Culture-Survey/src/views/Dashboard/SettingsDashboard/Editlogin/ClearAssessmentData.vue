<!-- ClearAssessmentData.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { axiosAuth as axios } from '../../../../utils/apiClient'

// ✅ States
const selectedCompanyId = ref<number | null>(null)
const selectedYear = ref<number>(new Date().getFullYear())
const companyList = ref<Array<{ id: number; name: string }>>([])
const loading = ref(false)
const stats = ref<{
  companyName: string
  totalUsers: number
  usersWithAssessment: number
  totalAnswers: number
  canClear: boolean
  yearSelected: number
} | null>(null)
const showConfirmDialog = ref(false)
const clearing = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// ✅ Generate year options (ปีปัจจุบัน ไปจนถึง 5 ปีที่แล้ว)
const yearOptions = ref<number[]>([])

const generateYearOptions = () => {
  const currentYear = new Date().getFullYear()
  yearOptions.value = []
  for (let i = currentYear; i >= currentYear - 5; i--) {
    yearOptions.value.push(i)
  }
}

// ✅ Fetch companies
const fetchCompanies = async () => {
  loading.value = true
  try {
    const res = await axios.get('/api/companies')
    companyList.value = res.data
  } catch (err) {
    console.error('Error fetching companies:', err)
    errorMessage.value = 'ไม่สามารถโหลดข้อมูลบริษัทได้'
  } finally {
    loading.value = false
  }
}

// ✅ Fetch assessment stats
const fetchStats = async (companyId: number, year: number) => {
  loading.value = true
  stats.value = null
  successMessage.value = ''
  errorMessage.value = ''
  
  try {
    const res = await axios.get(
      `/api/super-admins/assessment/stats/${companyId}?year=${year}`
    )
    stats.value = res.data
  } catch (err) {
    console.error('Error fetching stats:', err)
    stats.value = null
    errorMessage.value = 'ไม่สามารถโหลดข้อมูลสถิติการประเมิน'
  } finally {
    loading.value = false
  }
}

// ✅ Handle company change
const onCompanyChange = () => {
  if (selectedCompanyId.value) {
    fetchStats(selectedCompanyId.value, selectedYear.value)
  } else {
    stats.value = null
  }
}

// ✅ Handle year change
const onYearChange = () => {
  if (selectedCompanyId.value) {
    fetchStats(selectedCompanyId.value, selectedYear.value)
  }
}

// ✅ Open confirmation dialog
const openConfirmDialog = () => {
  showConfirmDialog.value = true
}

// ✅ Close confirmation dialog
const closeConfirmDialog = () => {
  showConfirmDialog.value = false
}

// ✅ Clear assessment data
const clearData = async () => {
  if (!selectedCompanyId.value) {
    errorMessage.value = 'กรุณาเลือกบริษัท'
    return
  }

  clearing.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const res = await axios.delete(
      `/api/super-admins/assessment/clear/${selectedCompanyId.value}?year=${selectedYear.value}`
    )
    
    successMessage.value = `✅ ${res.data.message} (ลบ ${res.data.deletedCount} รายการ ปี ${selectedYear.value})`
    closeConfirmDialog()
    
    // Refresh stats
    setTimeout(() => {
      fetchStats(selectedCompanyId.value!, selectedYear.value)
    }, 1000)
  } catch (err: any) {
    console.error('Error clearing data:', err)
    errorMessage.value = err.response?.data?.message || 'เกิดข้อผิดพลาดในการล้างข้อมูล'
  } finally {
    clearing.value = false
  }
}

onMounted(() => {
  generateYearOptions()
  fetchCompanies()
})
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-2">
        ⚠️ ล้างข้อมูลการประเมิน
      </h3>
      <p class="text-sm text-gray-600">
        เลือกบริษัทและปีเพื่อล้างข้อมูลคำตอบการประเมิน และรีเซตสถานะผู้ประเมินเป็น "ยังไม่เริ่ม"
      </p>
    </div>

    <!-- Alert Messages -->
    <div v-if="successMessage" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
      <p class="text-sm text-green-700">{{ successMessage }}</p>
    </div>

    <div v-if="errorMessage" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-sm text-red-700">{{ errorMessage }}</p>
    </div>

    <!-- Company & Year Selection -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Company Dropdown -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          เลือกบริษัท <span class="text-red-500">*</span>
        </label>
        <select
          v-model.number="selectedCompanyId"
          @change="onCompanyChange"
          :disabled="loading"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        >
          <option :value="null">-- เลือกบริษัท --</option>
          <option v-for="company in companyList" :key="company.id" :value="company.id">
            {{ company.name }}
          </option>
        </select>
      </div>

      <!-- Year Dropdown -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          เลือกปี <span class="text-red-500">*</span>
        </label>
        <select
          v-model.number="selectedYear"
          @change="onYearChange"
          :disabled="!selectedCompanyId || loading"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        >
          <option v-for="year in yearOptions" :key="year" :value="year">
            ปี {{ year + 543 }} ({{ year }})
          </option>
        </select>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading && selectedCompanyId" class="space-y-3 mb-6">
      <div class="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
    </div>

    <!-- Stats Display -->
    <div v-if="stats && !loading" class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h4 class="font-semibold text-gray-900 mb-3">
        📊 สถิติการประเมิน ปี {{ selectedYear + 543 }} ({{ selectedYear }})
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white p-3 rounded-lg border border-gray-200">
          <p class="text-xs text-gray-500 mb-1">จำนวนพนักงาน</p>
          <p class="text-2xl font-bold text-blue-600">{{ stats.totalUsers }}</p>
        </div>
        <div class="bg-white p-3 rounded-lg border border-gray-200">
          <p class="text-xs text-gray-500 mb-1">พนักงานที่ประเมิน</p>
          <p class="text-2xl font-bold text-blue-600">{{ stats.usersWithAssessment }}</p>
        </div>
        <div class="bg-white p-3 rounded-lg border border-gray-200">
          <p class="text-xs text-gray-500 mb-1">จำนวนคำตอบทั้งหมด</p>
          <p class="text-2xl font-bold text-blue-600">{{ stats.totalAnswers }}</p>
        </div>
        <div class="bg-white p-3 rounded-lg border border-gray-200">
          <p class="text-xs text-gray-500 mb-1">สถานะ</p>
          <p v-if="stats.canClear" class="text-2xl font-bold text-green-600">✓ พร้อม</p>
          <p v-else class="text-2xl font-bold text-gray-400">ว่าง</p>
        </div>
      </div>
    </div>

    <!-- Clear Button -->
    <div v-if="stats && stats.canClear && !loading" class="flex gap-3">
      <button
        @click="openConfirmDialog"
        :disabled="clearing"
        class="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:bg-gray-400"
      >
        <span v-if="!clearing">🗑️ ล้างข้อมูลการประเมิน ปี {{ selectedYear + 543 }}</span>
        <span v-else>กำลังโปรเซส...</span>
      </button>
    </div>

    <!-- Confirmation Dialog -->
    <div v-if="showConfirmDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border-l-4 border-red-600">
        <h3 class="text-lg font-bold text-gray-900 mb-2">⚠️ ยืนยันการล้างข้อมูล</h3>
        <p class="text-gray-600 mb-2">
          คุณต้องการล้างข้อมูลคำตอบการประเมินของบริษัท <strong>{{ stats?.companyName }}</strong> 
          ประจำปี <strong>{{ selectedYear + 543 }} ({{ selectedYear }})</strong> ใช่หรือไม่?
        </p>
        <p class="text-sm text-gray-600 mb-2">
          ✓ และจะรีเซตสถานะของผู้ประเมินเป็น <strong>"ยังไม่เริ่ม"</strong>
        </p>
        <p class="text-sm text-red-600 font-semibold mb-4">
          ⚠️ การดำเนินการนี้ไม่สามารถย้อนกลับได้ ({{ stats?.totalAnswers }} รายการจะถูกลบถาวร)
        </p>
        
        <div class="flex gap-3">
          <button
            @click="closeConfirmDialog"
            :disabled="clearing"
            class="flex-1 px-4 py-2 bg-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-400 transition disabled:opacity-50"
          >
            ยกเลิก
          </button>
          <button
            @click="clearData"
            :disabled="clearing"
            class="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            <span v-if="!clearing">ยืนยันการลบ</span>
            <span v-else>กำลังลบ...</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Smooth transitions */
select, button {
  transition: all 0.3s ease;
}
</style>
