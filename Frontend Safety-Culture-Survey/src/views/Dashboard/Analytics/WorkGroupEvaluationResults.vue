<!-- WorkGroupEvaluationResults.vue -->
<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import BetChart from "../Showgraph/BetChart.vue";
import NavbarDashboard from '../../../components/NavbarDashboard.vue';
import { axiosAuth as axios } from '../../../utils/apiClient';

// ============================================
// SECTION 1: STATE MANAGEMENT
// ============================================
const positions = ref([]);
const departments = ref([]);
const workGroups = ref([]);
const years = ref([]);
const selectedDepartment = ref("all");
const selectedUnit = ref("all");
const selectedGroups = ref(["all"]);
const selectedCompany = ref("all");
const selectedPeriod = ref("both");
const selectedYear = ref(null);
const companyOptions = ref([]);

const evaluationResults = ref([]);
const isLoading = ref(false);

// [แก้ไข #1] เพิ่ม fetchError สำหรับแจ้งผู้ใช้เมื่อโหลดข้อมูลไม่สำเร็จ
// — เดิม catch error แล้ว console.error ทิ้งไว้ ผู้ใช้ไม่รู้ว่าเกิด error
const fetchError = ref(null);

// [แก้ไข #2] flag ป้องกัน watch ทำงานซ้ำตอน reset ตัวกรอง
// — เมื่อ selectedDepartment เปลี่ยน จะ reset selectedUnit และ selectedGroups
// — การ reset นั้นจะ trigger watch หลักอีกครั้ง ทำให้ fetchEvaluationData ถูกเรียก 2 ครั้ง
// — isResetting ใช้บอกให้ watch หลักรู้ว่าให้รอก่อน ไม่ต้อง fetch ระหว่าง reset
const isResetting = ref(false);

// [แก้ไข #3] AbortController สำหรับยกเลิกคำขอเก่า
// — ป้องกัน race condition เมื่อผู้ใช้เปลี่ยนตัวกรองเร็วๆ
const abortController = ref(null);

// ============================================
// SECTION 2: HELPER
// ============================================
const getUserCompanyIds = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return [];
    const user = JSON.parse(userStr);
    if (user.companyIds && Array.isArray(user.companyIds)) return user.companyIds;
    if (user.companyId) return [user.companyId];
    if (user.company_ids && Array.isArray(user.company_ids)) return user.company_ids;
    if (user.company?.id) return [user.company.id];
    return [];
  } catch {
    return [];
  }
};

// ============================================
// SECTION 3: API & HELPER FUNCTIONS
// ============================================

// [แก้ไข #4] fetchEvaluationData — ใช้ AbortController + set fetchError
// — ยกเลิกคำขอเก่าก่อนทุกครั้ง
// — set fetchError เมื่อโหลดไม่สำเร็จ แทนที่จะ console.error เงียบๆ
const fetchEvaluationData = async () => {
  if (!selectedYear.value) return;

  // ยกเลิกคำขอเก่าถ้ายังทำงานอยู่
  if (abortController.value) abortController.value.abort();
  abortController.value = new AbortController();

  isLoading.value = true;
  fetchError.value = null;

  try {
    const params = new URLSearchParams({
      year: selectedYear.value,
      positionId: selectedDepartment.value,
      departmentId: selectedUnit.value,
      workGroupId: selectedGroups.value.join(','),
      company: selectedCompany.value,
    });

    const response = await axios.get(
      `/api/analytics/workgroup-evaluation?${params.toString()}`,
      { signal: abortController.value.signal }
    );
    evaluationResults.value = response.data;
  } catch (error) {
    // [แก้ไข #5] ไม่ set error ถ้าเป็น AbortError
    if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') return;
    console.error('Error fetching evaluation data:', error);
    fetchError.value = 'ไม่สามารถโหลดข้อมูลการประเมินได้ กรุณาลองใหม่อีกครั้ง';
    evaluationResults.value = [];
  } finally {
    isLoading.value = false;
  }
};

const fetchPositions = async () => {
  try {
    const companyIds = getUserCompanyIds();
    const params = companyIds.length ? `?companyIds=${companyIds.join(',')}` : '';
    const response = await axios.get(`/api/positions${params}`);
    positions.value = [{ id: 'all', name: 'ทั้งหมด' }, ...response.data];
  } catch (error) {
    console.error('Error fetching positions:', error);
    positions.value = [{ id: 'all', name: 'ทั้งหมด' }];
  }
};

const fetchDepartments = async () => {
  try {
    const companyIds = getUserCompanyIds();
    const params = companyIds.length ? `?companyIds=${companyIds.join(',')}` : '';
    const response = await axios.get(`/api/departments${params}`);
    departments.value = [{ id: 'all', name: 'ทั้งหมด' }, ...response.data];
  } catch (error) {
    console.error('Error fetching departments:', error);
    departments.value = [{ id: 'all', name: 'ทั้งหมด' }];
  }
};

const fetchWorkGroups = async () => {
  try {
    const companyIds = getUserCompanyIds();
    const params = companyIds.length ? `?companyIds=${companyIds.join(',')}` : '';
    const response = await axios.get(`/api/workgroups${params}`);
    workGroups.value = [{ id: 'all', name: 'ทั้งหมด' }, ...response.data];
  } catch (error) {
    console.error('Error fetching work groups:', error);
    workGroups.value = [{ id: 'all', name: 'ทั้งหมด' }];
  }
};

const fetchAssessmentYears = async () => {
  try {
    const response = await axios.get('/api/analytics/assessment-years');
    if (response.data && response.data.length > 0) {
      years.value = response.data;
      selectedYear.value = response.data[0];
    } else {
      const currentYear = new Date().getFullYear();
      years.value = [currentYear];
      selectedYear.value = currentYear;
    }
  } catch (error) {
    console.error('Error fetching assessment years:', error);
    const currentYear = new Date().getFullYear();
    years.value = [currentYear];
    selectedYear.value = currentYear;
  }
};

const shouldIncludePeriod = (period) =>
  selectedPeriod.value === period || selectedPeriod.value === "both";

const calculateAverage = (scores) => {
  if (!Array.isArray(scores) || scores.length === 0) return 0;
  const flat = Array.isArray(scores[0]) ? scores.flat() : scores;
  if (flat.length === 0) return 0;
  return +(flat.reduce((a, b) => a + b, 0) / flat.length).toFixed(2);
};

const fetchCompanyOptions = async () => {
  try {
    const response = await axios.get('/api/analytics/companies');
    const companies = response.data;
    const options = [{ id: 'all', name: 'บริษัททั้งหมด' }];

    let sortedCompanies = [];
    if (Array.isArray(companies)) {
      sortedCompanies = companies.length > 0 && typeof companies[0] === 'object'
        ? companies.map(c => c.name).sort()
        : [...companies].sort();
    }

    sortedCompanies.forEach((name, index) => {
      options.push({ id: `company_${index + 1}`, name });
    });

    return options;
  } catch (error) {
    console.error('Error fetching companies:', error);
    return [{ id: 'all', name: 'บริษัททั้งหมด' }];
  }
};

// ============================================
// SECTION 4: COMPUTED PROPERTIES
// ============================================
const availableUnits = computed(() => departments.value);
const availableWorkGroups = computed(() => workGroups.value);

const chartData = computed(() => {
  const data = evaluationResults.value;
  if (!data || data.length === 0) return { labels: [], datasets: [] };

  const groupedData = new Map();
  let labels = [];
  const datasets = [];

  let dimensionKey;
  let dimensionSource;

  if (selectedUnit.value === 'all') {
    dimensionKey = 'job_field_user';
    dimensionSource = departments.value.filter(d => d.id !== 'all');
  } else {
    dimensionKey = 'work_group_user';
    dimensionSource = selectedGroups.value.includes('all')
      ? workGroups.value.filter(g => g.id !== 'all')
      : workGroups.value.filter(g => selectedGroups.value.includes(g.id));
  }

  labels = dimensionSource.map(item => item.name);
  labels.forEach(label => groupedData.set(label, { current: [], future: [] }));

  data.forEach(item => {
    if (item.user) {
      const groupName = item.user[dimensionKey];
      if (groupedData.has(groupName)) {
        const group = groupedData.get(groupName);
        if (item.currentScore) group.current.push(item.currentScore);
        if (item.expectedScore) group.future.push(item.expectedScore);
      }
    }
  });

  const currentScores = labels.map(label => calculateAverage(groupedData.get(label).current));
  const futureScores = labels.map(label => calculateAverage(groupedData.get(label).future));

  if (shouldIncludePeriod("current")) {
    datasets.push({ label: "ปัจจุบัน", backgroundColor: "#1e40af", data: currentScores });
  }
  if (shouldIncludePeriod("future")) {
    datasets.push({ label: "เป้าหมาย", backgroundColor: "#3b82f6", data: futureScores });
  }

  return { labels, datasets };
});

const dataSummary = computed(() => {
  const deptName = positions.value.find(d => d.id === selectedDepartment.value)?.name || "ทั้งหมด";
  const unitName = departments.value.find(u => u.id === selectedUnit.value)?.name || "ทั้งหมด";

  let groupNames = "ทั้งหมด";
  if (!selectedGroups.value.includes('all')) {
    groupNames = selectedGroups.value
      .map(id => workGroups.value.find(g => g.id === id)?.name)
      .filter(Boolean)
      .join(", ") || "ไม่มี";
  }

  const companyName = companyOptions.value.find(c => c.id === selectedCompany.value)?.name || "บริษัททั้งหมด";
  const actualCount = chartData.value.datasets.reduce(
    (sum, dataset) => sum + dataset.data.filter(val => val > 0).length, 0
  );

  return {
    department: deptName,
    unit: unitName,
    group: groupNames,
    company: companyName,
    total: evaluationResults.value.length,
    displayCount: actualCount,
  };
});

// ============================================
// SECTION 5: EVENT HANDLERS
// ============================================
const handleGroupChange = (groupId) => {
  if (groupId === 'all') {
    selectedGroups.value = ['all'];
  } else {
    if (selectedGroups.value.includes('all')) {
      selectedGroups.value = [groupId];
    } else {
      const index = selectedGroups.value.indexOf(groupId);
      if (index > -1) {
        selectedGroups.value.splice(index, 1);
        if (selectedGroups.value.length === 0) selectedGroups.value = ['all'];
      } else {
        selectedGroups.value.push(groupId);
      }
    }
  }
};

// ============================================
// SECTION 6: WATCHERS
// ============================================

// [แก้ไข #6] watch หลัก — ตรวจสอบ isResetting ก่อนดึงข้อมูล
// — ถ้ากำลัง reset ตัวกรองอยู่ให้รอก่อน เพื่อไม่ให้ดึงข้อมูลระหว่างนั้น
// — ป้องกัน fetchEvaluationData ถูกเรียกซ้ำ 2 ครั้งเมื่อตำแหน่งเปลี่ยน
watch(
  [selectedDepartment, selectedUnit, selectedGroups, selectedCompany, selectedYear],
  () => {
    if (!isResetting.value) fetchEvaluationData();
  },
  { deep: true }
);

// [แก้ไข #7] watch selectedDepartment — ใช้ isResetting + nextTick
// — set isResetting = true ก่อน reset
// — รอ nextTick ให้ Vue อัปเดต reactive values ก่อน
// — แล้วค่อย set isResetting = false และดึงข้อมูล 1 ครั้ง
watch(selectedDepartment, async () => {
  isResetting.value = true;
  selectedUnit.value = "all";
  selectedGroups.value = ["all"];
  await nextTick();
  isResetting.value = false;
  fetchEvaluationData();
});

// [แก้ไข #8] watch selectedUnit — ใช้ isResetting + nextTick เช่นกัน
watch(selectedUnit, async () => {
  isResetting.value = true;
  selectedGroups.value = ["all"];
  await nextTick();
  isResetting.value = false;
  fetchEvaluationData();
});

// ============================================
// SECTION 7: LIFECYCLE HOOKS
// ============================================
onMounted(async () => {
  await fetchPositions();
  await fetchDepartments();
  await fetchWorkGroups();
  await fetchAssessmentYears();
  companyOptions.value = await fetchCompanyOptions();

  if (selectedYear.value) {
    await fetchEvaluationData();
  }
});

// [แก้ไข #9] ล้างข้อมูลเมื่อ component ถูกปิด
// — ยกเลิกคำขอที่ค้างอยู่ทันที ป้องกัน memory leak
onUnmounted(() => {
  if (abortController.value) abortController.value.abort();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <NavbarDashboard />

    <main class="flex-1 ml-0 md:ml-60 p-3 sm:p-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <header class="mb-4 sm:mb-6">
          <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
            <h1 class="text-lg sm:text-2xl font-bold text-gray-900 mb-1">ผลการประเมินตามกลุ่มงาน</h1>
            <p class="text-xs sm:text-sm text-gray-600">วิเคราะห์และเปรียบเทียบผลการประเมินตามตำแหน่ง สายงาน และกลุ่มงาน</p>
          </div>
        </header>

        <!-- Filter Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 sm:mb-6">
          <div class="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 sm:px-6 py-3 sm:py-3.5 rounded-t-lg">
            <h2 class="text-sm font-semibold text-gray-800 flex items-center">
              <svg class="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
              </svg>
              ตัวกรองข้อมูล
            </h2>
          </div>

          <div class="p-4 sm:p-5">
            <!-- Row 1: บริษัท, ตำแหน่ง, สายงาน -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1.5">บริษัท</label>
                <div class="relative">
                  <select v-model="selectedCompany" class="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all text-sm appearance-none hover:border-gray-400">
                    <option v-for="option in companyOptions" :key="option.id" :value="option.id">{{ option.name }}</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1.5">ตำแหน่ง <span class="text-red-500">*</span></label>
                <div class="relative">
                  <select v-model="selectedDepartment" class="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all text-sm appearance-none hover:border-gray-400">
                    <option v-for="pos in positions" :key="pos.id" :value="pos.id">{{ pos.name }}</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1.5">สายงาน <span class="text-red-500">*</span></label>
                <div class="relative">
                  <select v-model="selectedUnit" class="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all text-sm appearance-none hover:border-gray-400">
                    <option v-for="unit in availableUnits" :key="unit.id" :value="unit.id">{{ unit.name }}</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Row 2: ช่วงเวลา, ปี -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1.5">ช่วงเวลา</label>
                <div class="relative">
                  <select v-model="selectedPeriod" class="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all text-sm appearance-none hover:border-gray-400">
                    <option value="both">ปัจจุบันและเป้าหมาย</option>
                    <option value="current">เฉพาะปัจจุบัน</option>
                    <option value="future">เฉพาะเป้าหมาย</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1.5">ปี</label>
                <div class="relative">
                  <select v-model="selectedYear" class="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all text-sm appearance-none hover:border-gray-400">
                    <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Row 3: กลุ่มงาน -->
            <div class="mb-4">
              <label class="block text-xs font-medium text-gray-700 mb-2">
                กลุ่มงาน <span class="text-gray-500 text-xs font-normal">(เลือกได้มากกว่า 1 รายการ)</span>
              </label>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                <label
                  v-for="group in availableWorkGroups"
                  :key="group.id"
                  class="relative flex items-center px-2.5 sm:px-3 py-2 border rounded-lg cursor-pointer transition-all"
                  :class="{
                    'border-blue-500 bg-blue-50 ring-1 ring-blue-500': selectedGroups.includes(group.id),
                    'border-gray-300 bg-white hover:border-blue-300 hover:bg-gray-50': !selectedGroups.includes(group.id)
                  }"
                >
                  <input
                    type="checkbox"
                    :checked="selectedGroups.includes(group.id)"
                    @change="handleGroupChange(group.id)"
                    class="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                  />
                  <span class="ml-2 text-xs text-gray-800 truncate" :title="group.name">{{ group.name }}</span>
                </label>
              </div>
            </div>

            <!-- Summary Info -->
            <div class="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-3 sm:p-4 border border-gray-200">
              <h3 class="text-xs font-semibold text-gray-700 mb-2.5 flex items-center">
                <svg class="w-3.5 h-3.5 mr-1.5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                  <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"></path>
                </svg>
                สรุปตัวกรองที่เลือก
              </h3>
              <div class="grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-2.5">
                <div class="bg-white rounded-md p-2 sm:p-2.5 border border-gray-200">
                  <p class="text-[11px] sm:text-xs text-gray-500 mb-0.5">ตำแหน่ง</p>
                  <p class="text-xs sm:text-sm font-semibold text-gray-900 truncate" :title="dataSummary.department">{{ dataSummary.department }}</p>
                </div>
                <div class="bg-white rounded-md p-2 sm:p-2.5 border border-gray-200">
                  <p class="text-[11px] sm:text-xs text-gray-500 mb-0.5">สายงาน</p>
                  <p class="text-xs sm:text-sm font-semibold text-gray-900 truncate" :title="dataSummary.unit">{{ dataSummary.unit }}</p>
                </div>
                <div class="bg-white rounded-md p-2 sm:p-2.5 border border-gray-200">
                  <p class="text-[11px] sm:text-xs text-gray-500 mb-0.5">กลุ่มงาน</p>
                  <p class="text-xs sm:text-sm font-semibold text-gray-900 truncate" :title="dataSummary.group">{{ dataSummary.group }}</p>
                </div>
                <div class="bg-white rounded-md p-2 sm:p-2.5 border border-gray-200">
                  <p class="text-[11px] sm:text-xs text-gray-500 mb-0.5">บริษัท</p>
                  <p class="text-xs sm:text-sm font-semibold text-gray-900 truncate" :title="dataSummary.company">{{ dataSummary.company }}</p>
                </div>
                <div class="bg-white rounded-md p-2 sm:p-2.5 border border-gray-200 ring-2 ring-blue-500 col-span-2 md:col-span-1">
                  <p class="text-[11px] sm:text-xs text-gray-500 mb-0.5">จำนวนข้อมูลทั้งหมด</p>
                  <p class="text-xs sm:text-sm font-bold text-blue-600">{{ dataSummary.total }} รายการ</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chart Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
            <h2 class="text-sm font-semibold text-gray-800 mb-2.5 flex items-center">
              <svg class="w-4 h-4 mr-2 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              แผนภูมิแสดงค่าเฉลี่ยคะแนนการประเมิน
            </h2>
            <div class="flex items-center flex-wrap gap-3 sm:gap-4 text-xs">
              <div class="flex items-center gap-1.5">
                <div class="w-3 h-3 bg-blue-800 rounded flex-shrink-0"></div>
                <span class="text-gray-700">ปัจจุบัน</span>
              </div>
              <div class="flex items-center gap-1.5">
                <div class="w-3 h-3 bg-blue-500 rounded flex-shrink-0"></div>
                <span class="text-gray-700">เป้าหมาย</span>
              </div>
            </div>
          </div>

          <div class="p-3 sm:p-6">
            <!-- Loading -->
            <div v-if="isLoading" class="flex flex-col items-center justify-center py-10 sm:py-12">
              <div class="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-blue-600 mb-3"></div>
              <p class="text-xs sm:text-sm text-gray-500">กำลังโหลดข้อมูล...</p>
            </div>

            <!-- [แก้ไข #10] Error State — แสดงข้อความแจ้งเตือนพร้อมปุ่มลองใหม่ -->
            <div v-else-if="fetchError" class="flex flex-col items-center justify-center py-10 sm:py-12 px-4 text-center">
              <div class="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-red-50 rounded-full mb-4">
                <svg class="w-6 h-6 sm:w-7 sm:h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p class="text-sm font-semibold text-gray-500">เกิดข้อผิดพลาด</p>
              <p class="text-xs text-gray-400 mt-1">{{ fetchError }}</p>
              <button
                @click="fetchEvaluationData"
                class="mt-4 text-sm text-blue-600 hover:text-blue-800 underline"
              >
                ลองใหม่อีกครั้ง
              </button>
            </div>

            <!-- Empty State -->
            <div v-else-if="chartData.labels.length === 0" class="flex flex-col items-center justify-center py-10 sm:py-12 px-4 text-center">
              <div class="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-full mb-4">
                <svg class="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p class="text-sm font-semibold text-gray-500">ยังไม่มีข้อมูลในระบบ</p>
              <p class="text-xs text-gray-400 mt-1">ไม่พบข้อมูลสำหรับตัวกรองที่เลือก</p>
            </div>

            <!-- Chart -->
            <div v-else class="w-full overflow-x-auto">
              <div class="min-w-[480px] sm:min-w-0">
                <BetChart :chart-data="chartData" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: #f1f5f9; }
::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
select, label { transition: all 0.2s ease; }
</style>
