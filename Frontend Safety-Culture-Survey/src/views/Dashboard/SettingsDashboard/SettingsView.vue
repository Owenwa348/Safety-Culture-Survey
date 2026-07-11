<!-- SettingsView.vue -->
<script setup>
import NavbarDashboard from '../../../components/NavbarDashboard.vue'
import EditPosition from './Editlogin/EditPosition.vue'
import EditDepartment from './Editlogin/EditDepartment.vue'
import EditWorkGroup from './Editlogin/EditWorkGroup.vue'
import EditExperience from './Editlogin/EditExperience.vue'
import EditQuestions from './EditQuestions/EditQuestions.vue'
import ClearAssessmentData from './Editlogin/ClearAssessmentData.vue'
import { ref, onMounted, computed } from 'vue'
import { axiosAuth as axios } from '../../../utils/apiClient'

const activeTab = ref('position')
const selectedGroupPrefix = ref(null)
const selectedCompanyIds = ref([])
const companyGroups = ref([])
const loadingGroups = ref(false)
const groupDropdownOpen = ref(false)

const tabs = [
  { id: 'position',   name: 'ตำแหน่งงาน', icon: '👤' },
  { id: 'department', name: 'สายงาน',      icon: '🏗️' },
  { id: 'workgroup',  name: 'กลุ่มงาน',    icon: '👥' },
  { id: 'experience', name: 'อายุงาน',     icon: '📅' },
  { id: 'questions',  name: 'คำถาม',       icon: '❓' },
  { id: 'clear-assessment', name: 'ล้างข้อมูลประเมิน', icon: '🗑️' },
]

const fetchCompanyGroups = async () => {
  loadingGroups.value = true
  try {
    const res = await axios.get('/api/companies/groups')
    companyGroups.value = res.data
    if (companyGroups.value.length > 0) selectGroup(companyGroups.value[0])
  } catch (err) {
    console.error('fetchCompanyGroups error:', err)
  } finally {
    loadingGroups.value = false
  }
}

const selectGroup = (group) => {
  selectedGroupPrefix.value = group.groupPrefix
  selectedCompanyIds.value = group.companyIds
  groupDropdownOpen.value = false
}

const selectedGroup = computed(() =>
  companyGroups.value.find(g => g.groupPrefix === selectedGroupPrefix.value)
)

onMounted(fetchCompanyGroups)
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <NavbarDashboard />

    <div class="ml-0 md:ml-64 mr-0 md:mr-6 px-3 sm:px-4 md:px-0 mt-4 md:mt-8 pb-8 md:pb-10">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8">

        <!-- Header -->
        <div class="mb-5 md:mb-6">
          <h3 class="text-xl md:text-2xl font-semibold text-gray-900 mb-1">Settings</h3>
          <p class="text-gray-500 text-xs sm:text-sm">จัดการการตั้งค่าระบบและข้อมูลพื้นฐาน</p>
        </div>

        <!-- ✅ Group Selector — ใช้ Custom Dropdown แทนปุ่มเรียงแนวนอน -->
        <div class="mb-5 md:mb-6">
          <label class="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
            กลุ่มบริษัทที่ต้องการตั้งค่า
          </label>

          <!-- Loading skeleton -->
          <div v-if="loadingGroups" class="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg animate-pulse">
            <div class="w-8 h-8 bg-gray-200 rounded-lg flex-shrink-0"></div>
            <div class="h-4 bg-gray-200 rounded w-32 sm:w-40"></div>
          </div>

          <!-- Custom Dropdown -->
          <div v-else class="relative">
            <!-- Trigger Button -->
            <button
              @click="groupDropdownOpen = !groupDropdownOpen"
              class="w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 rounded-xl text-left transition-all duration-200 focus:outline-none"
              :class="selectedGroupPrefix
                ? 'border-blue-500 shadow-sm shadow-blue-100'
                : 'border-gray-200 hover:border-gray-300'"
            >
              <div class="flex items-center gap-2 sm:gap-3 min-w-0">
                <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  :class="selectedGroupPrefix ? 'bg-blue-100' : 'bg-gray-100'">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="selectedGroupPrefix ? 'text-blue-600' : 'text-gray-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div class="min-w-0">
                  <p v-if="selectedGroup" class="text-sm font-semibold text-gray-800 truncate">
                    {{ selectedGroup.groupName }}
                  </p>
                  <p v-else class="text-sm text-gray-400">เลือกกลุ่มบริษัท...</p>
                  <p v-if="selectedGroup" class="text-xs text-gray-400 mt-0.5">
                    {{ selectedGroup.companies.length }} บริษัทในกลุ่ม
                  </p>
                </div>
              </div>
              <!-- Arrow icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 flex-shrink-0 transition-transform duration-200" :class="groupDropdownOpen ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown Panel -->
            <transition
              enter-active-class="transition ease-out duration-150"
              enter-from-class="opacity-0 translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-100"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-1"
            >
              <div
                v-if="groupDropdownOpen"
                class="absolute z-30 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
              >
                <!-- Scrollable list — รองรับบริษัทเยอะโดยไม่ดันจอ -->
                <div class="max-h-60 sm:max-h-64 overflow-y-auto divide-y divide-gray-50">
                  <button
                    v-for="group in companyGroups"
                    :key="group.groupPrefix"
                    @click="selectGroup(group)"
                    class="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-blue-50 transition-colors duration-150 text-left"
                    :class="selectedGroupPrefix === group.groupPrefix ? 'bg-blue-50' : ''"
                  >
                    <!-- Active indicator -->
                    <div class="w-2 h-2 rounded-full flex-shrink-0 transition-colors"
                      :class="selectedGroupPrefix === group.groupPrefix ? 'bg-blue-500' : 'bg-gray-200'">
                    </div>

                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium truncate"
                        :class="selectedGroupPrefix === group.groupPrefix ? 'text-blue-700' : 'text-gray-700'">
                        {{ group.groupName }}
                      </p>
                      <!-- Company tags — wrap ได้อิสระ ไม่ล้น -->
                      <div class="flex flex-wrap gap-1 mt-1">
                        <span
                          v-for="company in group.companies"
                          :key="company.id"
                          class="inline-block text-xs px-2 py-0.5 rounded-full"
                          :class="selectedGroupPrefix === group.groupPrefix
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-500'"
                        >
                          {{ company.name }}
                        </span>
                      </div>
                    </div>

                    <!-- Checkmark -->
                    <svg v-if="selectedGroupPrefix === group.groupPrefix"
                      xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </transition>

            <!-- Backdrop to close dropdown -->
            <div
              v-if="groupDropdownOpen"
              class="fixed inset-0 z-20"
              @click="groupDropdownOpen = false"
            ></div>
          </div>

          <!-- Selected company chips (แสดงใต้ dropdown เมื่อเลือกแล้ว) -->
          <div v-if="selectedGroup && !groupDropdownOpen" class="mt-3 flex flex-wrap gap-2">
            <span
              v-for="company in selectedGroup.companies"
              :key="company.id"
              class="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-full px-3 py-1"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
              {{ company.name }}
            </span>
          </div>

          <p v-if="!selectedGroupPrefix && !loadingGroups" class="mt-2 text-xs text-red-500 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
            </svg>
            กรุณาเลือกกลุ่มบริษัทก่อนดำเนินการตั้งค่า
          </p>
        </div>

        <!-- Divider -->
        <div class="border-t border-gray-100 mb-5 md:mb-6"></div>

        <!-- Tab Navigation -->
        <div class="border-b border-gray-200 mb-6 md:mb-8">
          <nav class="tabs-scroll -mb-px flex flex-nowrap overflow-x-auto gap-1">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'flex items-center gap-1.5 sm:gap-2 py-2.5 px-3 sm:py-3 sm:px-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap flex-shrink-0 transition-colors duration-200 rounded-t-lg',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              <span class="text-sm sm:text-base leading-none">{{ tab.icon }}</span>
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- Placeholder ยังไม่เลือกกลุ่ม -->
        <div
          v-if="!selectedGroupPrefix"
          class="flex flex-col items-center justify-center py-12 md:py-20 px-4 text-gray-400 text-center"
        >
          <div class="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 md:h-10 md:w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p class="text-sm sm:text-base font-medium text-gray-500">กรุณาเลือกกลุ่มบริษัทด้านบนก่อน</p>
          <p class="text-xs sm:text-sm mt-1 text-gray-400">ข้อมูลการตั้งค่าจะแสดงรวมทุกบริษัทในกลุ่มที่เลือก</p>
        </div>

        <!-- Tab Content -->
        <div v-else class="tab-content">
          <div v-show="activeTab === 'position'" class="animate-fadeIn">
            <EditPosition :company-ids="selectedCompanyIds" />
          </div>
          <div v-show="activeTab === 'department'" class="animate-fadeIn">
            <EditDepartment :company-ids="selectedCompanyIds" />
          </div>
          <div v-show="activeTab === 'workgroup'" class="animate-fadeIn">
            <EditWorkGroup :company-ids="selectedCompanyIds" />
          </div>
          <div v-show="activeTab === 'experience'" class="animate-fadeIn">
            <EditExperience :company-ids="selectedCompanyIds" />
          </div>
          <div v-show="activeTab === 'questions'" class="animate-fadeIn">
            <EditQuestions :company-ids="selectedCompanyIds" />
          </div>
          <div v-show="activeTab === 'clear-assessment'" class="animate-fadeIn">
            <ClearAssessmentData />
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.25s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
.tab-content > div {
  min-height: 300px;
}
@media (min-width: 768px) {
  .tab-content > div {
    min-height: 400px;
  }
}

/* ซ่อน scrollbar ของแถบแท็บบนมือถือ แต่ยัง scroll ได้ */
.tabs-scroll {
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.tabs-scroll::-webkit-scrollbar {
  display: none;
}
</style>