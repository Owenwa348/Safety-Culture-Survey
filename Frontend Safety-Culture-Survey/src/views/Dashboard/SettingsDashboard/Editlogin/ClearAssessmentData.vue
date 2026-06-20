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

// ✅ Generate year options (ปี ปัจจุบัน ไปจนถึง 5 ปีที่แล้ว)
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

    successMessage.value = `${res.data.message} (ลบ ${res.data.deletedCount} รายการ ปี ${selectedYear.value})`
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
  <div class="max-w-5xl mx-auto p-6 md:p-8">
    <!-- Page Header -->
    <div class="mb-8 pb-5 border-b border-slate-200">
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0 w-9 h-9 rounded-md bg-amber-50 border border-amber-200 flex items-center justify-center mt-0.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-amber-600">
            <path d="M12 3.5L21.5 20H2.5L12 3.5Z" />
            <line x1="12" y1="9.5" x2="12" y2="14" />
            <circle cx="12" cy="16.8" r="0.6" fill="currentColor" stroke="none" />
          </svg>
        </div>
        <div>
          <h3 class="text-xl font-semibold text-slate-900 tracking-tight">
            ล้างข้อมูลการประเมิน
          </h3>
          <p class="mt-1 text-sm text-slate-500 leading-relaxed">
            เลือกบริษัทและปีเพื่อดำเนินการล้างข้อมูลคำตอบการประเมินของพนักงานในขอบเขตที่ระบุ
            การดำเนินการนี้ไม่สามารถย้อนกลับได้ กรุณาตรวจสอบความถูกต้องก่อนยืนยัน
          </p>
        </div>
      </div>
    </div>

    <!-- Alert: Success -->
    <div v-if="successMessage" class="mb-6 flex items-start gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-md">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 12.5l2.5 2.5L16 9.5" />
      </svg>
      <p class="text-sm text-emerald-800">{{ successMessage }}</p>
    </div>

    <!-- Alert: Error -->
    <div v-if="errorMessage" class="mb-6 flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-md">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5">
        <circle cx="12" cy="12" r="9" />
        <line x1="9" y1="9" x2="15" y2="15" />
        <line x1="15" y1="9" x2="9" y2="15" />
      </svg>
      <p class="text-sm text-red-800">{{ errorMessage }}</p>
    </div>

    <!-- Filter Panel -->
    <div class="mb-6 p-5 bg-white border border-slate-200 rounded-md">
      <h4 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
        ขอบเขตข้อมูล
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <!-- Company Dropdown -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">
            บริษัท <span class="text-red-600">*</span>
          </label>
          <select
            v-model.number="selectedCompanyId"
            @change="onCompanyChange"
            :disabled="loading"
            class="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
          >
            <option value="">— เลือกบริษัท —</option>
            <option v-for="company in companyList" :key="company.id" :value="company.id">
              {{ company.name }}
            </option>
          </select>
        </div>

        <!-- Year Dropdown -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1.5">
            ปีที่ประเมิน <span class="text-red-600">*</span>
          </label>
          <select
            v-model.number="selectedYear"
            @change="onYearChange"
            :disabled="!selectedCompanyId || loading"
            class="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 disabled:bg-slate-50 disabled:text-slate-400"
          >
            <option v-for="year in yearOptions" :key="year" :value="year">
              ปี {{ year }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading && selectedCompanyId" class="mb-6">
      <div class="h-24 bg-slate-100 border border-slate-200 rounded-md animate-pulse"></div>
    </div>

    <!-- Stats Panel -->
    <div v-if="stats && !loading" class="mb-6 border border-slate-200 rounded-md overflow-hidden">
      <div class="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <h4 class="text-sm font-semibold text-slate-800">
          สถิติการประเมิน — ปี {{ selectedYear }}
        </h4>
        <span
          v-if="stats.canClear"
          class="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-emerald-100 text-emerald-700"
        >
          มีข้อมูลที่สามารถล้างได้
        </span>
        <span
          v-else
          class="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-slate-100 text-slate-500"
        >
          ไม่มีข้อมูล
        </span>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-200">
        <div class="p-4">
          <p class="text-xs text-slate-500 mb-1">จำนวนพนักงาน</p>
          <p class="text-xl font-semibold text-slate-900">{{ stats.totalUsers }}</p>
        </div>
        <div class="p-4">
          <p class="text-xs text-slate-500 mb-1">พนักงานที่ประเมินแล้ว</p>
          <p class="text-xl font-semibold text-slate-900">{{ stats.usersWithAssessment }}</p>
        </div>
        <div class="p-4">
          <p class="text-xs text-slate-500 mb-1">จำนวนคำตอบทั้งหมด</p>
          <p class="text-xl font-semibold text-slate-900">{{ stats.totalAnswers }}</p>
        </div>
        <div class="p-4">
          <p class="text-xs text-slate-500 mb-1">สถานะข้อมูล</p>
          <p class="text-xl font-semibold" :class="stats.canClear ? 'text-emerald-600' : 'text-slate-400'">
            {{ stats.canClear ? 'พร้อมดำเนินการ' : 'ว่าง' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Clear Action -->
    <div v-if="stats && stats.canClear && !loading">
      <button
        @click="openConfirmDialog"
        :disabled="clearing"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-red-700 text-white text-sm font-semibold rounded-md hover:bg-red-800 disabled:bg-slate-300 disabled:text-slate-500"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
          <path d="M4 7h16" />
          <path d="M9 7V4.5a1 1 0 011-1h4a1 1 0 011 1V7" />
          <path d="M6 7l1 13a1 1 0 001 1h8a1 1 0 001-1l1-13" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
        <span v-if="!clearing">ล้างข้อมูลการประเมิน ปี {{ selectedYear }}</span>
        <span v-else>กำลังดำเนินการ...</span>
      </button>
    </div>

    <!-- Confirmation Dialog -->
    <div v-if="showConfirmDialog" class="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-md shadow-xl max-w-md w-full border border-slate-200">
        <div class="px-6 pt-6 pb-5">
          <div class="flex items-center gap-3 mb-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-red-700">
                <path d="M12 3.5L21.5 20H2.5L12 3.5Z" />
                <line x1="12" y1="9.5" x2="12" y2="14" />
                <circle cx="12" cy="16.8" r="0.6" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <h3 class="text-base font-semibold text-slate-900">ยืนยันการล้างข้อมูล</h3>
          </div>

          <p class="text-sm text-slate-600 leading-relaxed mb-4">
            ระบบจะลบข้อมูลคำตอบการประเมินของบริษัท
            <span class="font-semibold text-slate-900">{{ stats?.companyName }}</span>
            ประจำปี
            <span class="font-semibold text-slate-900">{{ selectedYear }}</span>
            อย่างถาวร
          </p>

          <div class="px-4 py-3 bg-red-50 border border-red-200 rounded-md">
            <p class="text-xs font-medium text-red-700">
              จำนวนข้อมูลที่จะถูกลบ: {{ stats?.totalAnswers }} รายการ — ไม่สามารถกู้คืนได้หลังยืนยัน
            </p>
          </div>
        </div>

        <div class="flex gap-3 px-6 pb-6">
          <button
            @click="closeConfirmDialog"
            :disabled="clearing"
            class="flex-1 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50"
          >
            ยกเลิก
          </button>
          <button
            @click="clearData"
            :disabled="clearing"
            class="flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-700 rounded-md hover:bg-red-800 disabled:opacity-50"
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
select,
button {
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}
</style>