<!-- WorkGroupEvaluationResults.vue -->
<script setup>
import { ref, computed, onMounted, watch } from "vue";
import axios from 'axios';
import BetChart from "../Showgraph/BetChart.vue";
import NavbarDashboard from '../../../components/NavbarDashboard.vue';

// ============================================
// SECTION 1: STATE MANAGEMENT
// ============================================
const positions = ref([]);
const departments = ref([]);
const workGroups = ref([]);
const years = ref([]);
const selectedDepartment = ref("all");
const selectedUnit = ref("all"); // Corresponds to departmentId
const selectedGroups = ref(["all"]); // Corresponds to workGroupId
const selectedCompany = ref("all"); // เปลี่ยนจาก selectedVersion เป็น selectedCompany
const selectedPeriod = ref("both");
const selectedYear = ref(null);
const companyOptions = ref([]); // เปลี่ยนจาก versionOptions เป็น companyOptions

const evaluationResults = ref([]); // To store data from the API
const isLoading = ref(false);

// ============================================
// SECTION 2: API & HELPER FUNCTIONS
// ============================================

/**
 * Fetches evaluation data from the API based on current filters.
 */
const fetchEvaluationData = async () => {
  if (!selectedYear.value) return;
  isLoading.value = true;
  try {
    const params = new URLSearchParams({
      year: selectedYear.value,
      positionId: selectedDepartment.value,
      departmentId: selectedUnit.value,
      workGroupId: selectedGroups.value.join(','),
      company: selectedCompany.value, // ใช้ selectedCompany แทน selectedVersion
    });
    
    const response = await axios.get(`/api/analytics/workgroup-evaluation?${params.toString()}`);
    evaluationResults.value = response.data;
  } catch (error) {
    console.error('Error fetching evaluation data:', error);
    evaluationResults.value = [];
  } finally {
    isLoading.value = false;
  }
};

/**
 * Fetches positions from the API.
 */
const fetchPositions = async () => {
  try {
    const response = await axios.get('/api/positions');
    positions.value = [{ id: 'all', name: 'ทั้งหมด' }, ...response.data];
  } catch (error) {
    console.error('Error fetching positions:', error);
    positions.value = [{ id: 'all', name: 'ทั้งหมด' }];
  }
};

/**
 * Fetches departments from the API.
 */
const fetchDepartments = async () => {
  try {
    const response = await axios.get('/api/departments');
    departments.value = [{ id: 'all', name: 'ทั้งหมด' }, ...response.data];
  } catch (error) {
    console.error('Error fetching departments:', error);
    departments.value = [{ id: 'all', name: 'ทั้งหมด' }];
  }
};

/**
 * Fetches work groups from the API.
 */
const fetchWorkGroups = async () => {
  try {
    const response = await axios.get('/api/workgroups');
    workGroups.value = [{ id: 'all', name: 'ทั้งหมด' }, ...response.data];
  } catch (error) {
    console.error('Error fetching work groups:', error);
    workGroups.value = [{ id: 'all', name: 'ทั้งหมด' }];
  }
};

/**
 * Fetches available assessment years from the API.
 */
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

/**
 * ตรวจสอบว่าควรรวม company นี้หรือไม่
 */
const shouldIncludeCompany = (companyId) => {
  return selectedCompany.value === 'all' || selectedCompany.value === companyId;
};

/**
 * ตรวจสอบว่าควรรวม period นี้หรือไม่
 */
const shouldIncludePeriod = (period) => {
  return selectedPeriod.value === period || selectedPeriod.value === "both";
};

/**
 * คำนวณค่าเฉลี่ยจาก array ของคะแนน
 */
const calculateAverage = (scores) => {
  if (!Array.isArray(scores) || scores.length === 0) return 0;
  const flat = Array.isArray(scores[0]) ? scores.flat() : scores;
  if (flat.length === 0) return 0;
  return +(flat.reduce((a, b) => a + b, 0) / flat.length).toFixed(2);
};

/**
 * Fetches company options from the API.
 * แก้ไขให้แสดงบริษัททั้งหมดจาก API และใช้ company_1, company_2 format
 */
const fetchCompanyOptions = async () => {
  try {
    const response = await axios.get('/api/companies');
    const companies = response.data;

    // สร้าง options โดยเริ่มจาก "ทั้งหมด"
    const options = [
      { id: 'all', name: 'บริษัททั้งหมด' }
    ];

    // เรียงบริษัทตามตัวอักษรเพื่อให้สอดคล้องกับ Backend
    let sortedCompanies = [];
    
    if (Array.isArray(companies)) {
      // ถ้า API ส่งมาเป็น array ของ objects
      if (companies.length > 0 && typeof companies[0] === 'object' && companies[0].name) {
        sortedCompanies = companies.map(c => c.name).sort();
      } 
      // ถ้า API ส่งมาเป็น array ของ strings
      else {
        sortedCompanies = [...companies].sort();
      }
    }

    // สร้าง options ด้วย company_1, company_2, company_3... ตามลำดับที่เรียง
    sortedCompanies.forEach((companyName, index) => {
      options.push({
        id: `company_${index + 1}`,
        name: companyName
      });
    });
    
    return options;
  } catch (error) {
    console.error('Error fetching companies:', error);
    return [
      { id: 'all', name: 'บริษัททั้งหมด' }
    ];
  }
};

// ============================================
// SECTION 3: COMPUTED PROPERTIES
// ============================================

/**
 * สายงานที่สามารถเลือกได้ตามตำแหน่งที่เลือก
 */
const availableUnits = computed(() => {
  return departments.value;
});

/**
 * กลุ่มงานที่สามารถเลือกได้ตามตำแหน่งและสายงานที่เลือก
 */
const availableWorkGroups = computed(() => {
  return workGroups.value;
});

/**
 * ข้อมูลสำหรับแสดงกราฟ
 */
const chartData = computed(() => {
  const data = evaluationResults.value;
  if (!data || data.length === 0) return { labels: [], datasets: [] };

  // กรองข้อมูลตามบริษัทที่เลือก (ถ้าไม่ใช่ 'all')
  let filteredData = data;
  if (selectedCompany.value !== 'all') {
    // Backend จะส่งข้อมูลที่กรองแล้ว ดังนั้นไม่ต้องกรองเพิ่ม
    // แต่เก็บไว้เผื่อใช้ในอนาคต
    filteredData = data;
  }

  const groupedData = new Map();
  let labels = [];
  const datasets = [];

  // Determine the primary dimension for the x-axis (labels)
  let dimensionKey;
  let dimensionSource;

  // กรณีที่ 1: เลือก "ตำแหน่ง: ทั้งหมด"
  if (selectedDepartment.value === 'all') {
    // ถ้าเลือก "สายงาน: ทั้งหมด" → แสดงตามสายงาน
    if (selectedUnit.value === 'all') {
      dimensionKey = 'job_field_user';
      dimensionSource = departments.value.filter(d => d.id !== 'all');
    } 
    // ถ้าเลือก "สายงาน: เฉพาะสาย" → แสดงตามกลุ่มงาน
    else {
      dimensionKey = 'work_group_user';
      dimensionSource = selectedGroups.value.includes('all')
        ? workGroups.value.filter(g => g.id !== 'all')
        : workGroups.value.filter(g => selectedGroups.value.includes(g.id));
    }
  } 
  // กรณีที่ 2: เลือก "ตำแหน่ง: เฉพาะตำแหน่ง"
  else {
    // ถ้าเลือก "สายงาน: ทั้งหมด" → แสดงตามสายงาน
    if (selectedUnit.value === 'all') {
      dimensionKey = 'job_field_user';
      dimensionSource = departments.value.filter(d => d.id !== 'all');
    } 
    // ถ้าเลือก "สายงาน: เฉพาะสาย" → แสดงตามกลุ่มงาน
    else {
      dimensionKey = 'work_group_user';
      dimensionSource = selectedGroups.value.includes('all')
        ? workGroups.value.filter(g => g.id !== 'all')
        : workGroups.value.filter(g => selectedGroups.value.includes(g.id));
    }
  }
  
  labels = dimensionSource.map(item => item.name);

  // Initialize map with all possible labels to maintain order
  labels.forEach(label => {
    groupedData.set(label, { current: [], future: [] });
  });

  // Group scores from results
  filteredData.forEach(item => {
    if (item.user) {
        const groupName = item.user[dimensionKey];
        if (groupedData.has(groupName)) {
            const group = groupedData.get(groupName);
            if(item.currentScore) group.current.push(item.currentScore);
            if(item.expectedScore) group.future.push(item.expectedScore);
        }
    }
  });

  // Calculate averages and build datasets
  const currentScores = [];
  const futureScores = [];

  labels.forEach(label => {
    const scores = groupedData.get(label);
    currentScores.push(calculateAverage(scores.current));
    futureScores.push(calculateAverage(scores.future));
  });

  if (shouldIncludePeriod("current")) {
    datasets.push({
      label: "ปัจจุบัน",
      backgroundColor: "#1e40af",
      data: currentScores
    });
  }

  if (shouldIncludePeriod("future")) {
    datasets.push({
      label: "อนาคต",
      backgroundColor: "#3b82f6",
      data: futureScores
    });
  }
  
  return { labels, datasets };
});


/**
 * สรุปข้อมูลที่เลือก
 */
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

  // แสดงชื่อบริษัทที่เลือก
  const companyName = companyOptions.value.find(c => c.id === selectedCompany.value)?.name || "บริษัททั้งหมด";
  
  // นับจำนวนข้อมูลที่แสดงจริงในกราฟ
  const actualCount = chartData.value.datasets.reduce((sum, dataset) => {
    return sum + dataset.data.filter(val => val > 0).length;
  }, 0);
  
  return { 
    department: deptName,
    unit: unitName,
    group: groupNames,
    company: companyName,
    total: evaluationResults.value.length,
    displayCount: actualCount
  };
});

// ============================================
// SECTION 4: EVENT HANDLERS
// ============================================

/**
 * จัดการการเปลี่ยนแปลงของ checkbox กลุ่มงาน
 */
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
        if (selectedGroups.value.length === 0) {
          selectedGroups.value = ['all'];
        }
      } else {
        selectedGroups.value.push(groupId);
      }
    }
  }
};

// ============================================
// SECTION 5: WATCHERS
// ============================================

watch([selectedDepartment, selectedUnit, selectedGroups, selectedCompany, selectedYear], fetchEvaluationData, { deep: true });

watch(selectedDepartment, () => {
  selectedUnit.value = "all";
  selectedGroups.value = ["all"];
});

watch(selectedUnit, () => {
  selectedGroups.value = ["all"];
});

// ============================================
// SECTION 6: LIFECYCLE HOOKS
// ============================================

onMounted(async () => {
  await fetchPositions();
  await fetchDepartments();
  await fetchWorkGroups();
  await fetchAssessmentYears();
  companyOptions.value = await fetchCompanyOptions();
  
  // Initial data fetch
  if (selectedYear.value) {
    await fetchEvaluationData();
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <NavbarDashboard/>

    <!-- Main Content -->
    <main class="flex-1 ml-60 p-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header Section -->
        <header class="mb-6">
          <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h1 class="text-2xl font-bold text-gray-900 mb-1">ผลการประเมินตามกลุ่มงาน</h1>
            <p class="text-sm text-gray-600">วิเคราะห์และเปรียบเทียบผลการประเมินตามตำแหน่ง สายงาน และกลุ่มงาน</p>
          </div>
        </header>

        <!-- Filter Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div class="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-3.5 rounded-t-lg">
            <h2 class="text-sm font-semibold text-gray-800 flex items-center">
              <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
              </svg>
              เงื่อนไขการแสดงผล
            </h2>
          </div>
          
          <div class="p-5">
            <!-- Row 1: บริษัท, ตำแหน่ง, สายงาน -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <!-- บริษัท -->
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1.5">บริษัท</label>
                <div class="relative">
                  <select 
                    v-model="selectedCompany"
                    class="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all text-sm appearance-none hover:border-gray-400"
                  >
                    <option v-for="option in companyOptions" :key="option.id" :value="option.id">
                      {{ option.name }}
                    </option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- ตำแหน่ง -->
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1.5">
                  ตำแหน่ง <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <select 
                    v-model="selectedDepartment"
                    class="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all text-sm appearance-none hover:border-gray-400"
                  >
                    <option v-for="pos in positions" :key="pos.id" :value="pos.id">
                      {{ pos.name }}
                    </option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- สายงาน -->
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1.5">
                  สายงาน <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <select 
                    v-model="selectedUnit"
                    class="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all text-sm appearance-none hover:border-gray-400"
                  >
                    <option v-for="unit in availableUnits" :key="unit.id" :value="unit.id">
                      {{ unit.name }}
                    </option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Row 2: ช่วงเวลา, ปี -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <!-- ช่วงเวลา -->
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1.5">ช่วงเวลา</label>
                <div class="relative">
                  <select 
                    v-model="selectedPeriod"
                    class="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all text-sm appearance-none hover:border-gray-400"
                  >
                    <option value="both">ปัจจุบันและอนาคต</option>
                    <option value="current">เฉพาะปัจจุบัน</option>
                    <option value="future">เฉพาะอนาคต</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- ปี -->
              <div>
                <label class="block text-xs font-medium text-gray-700 mb-1.5">ปี</label>
                <div class="relative">
                  <select 
                    v-model="selectedYear"
                    class="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all text-sm appearance-none hover:border-gray-400"
                  >
                    <option v-for="year in years" :key="year" :value="year">
                      {{ year }}
                    </option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Row 3: กลุ่มงาน (Compact Checkboxes) -->
            <div class="mb-4">
              <label class="block text-xs font-medium text-gray-700 mb-2">
                กลุ่มงาน <span class="text-gray-500 text-xs font-normal">(เลือกได้หลายรายการ)</span>
              </label>
              <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
                <label 
                  v-for="group in availableWorkGroups" 
                  :key="group.id"
                  class="relative flex items-center px-3 py-2 border rounded-lg cursor-pointer transition-all"
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
            <div class="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200">
              <h3 class="text-xs font-semibold text-gray-700 mb-2.5 flex items-center">
                <svg class="w-3.5 h-3.5 mr-1.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                  <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"></path>
                </svg>
                สรุปเงื่อนไขที่เลือก
              </h3>
              <div class="grid grid-cols-2 md:grid-cols-5 gap-2.5">
                <div class="bg-white rounded-md p-2.5 border border-gray-200">
                  <p class="text-xs text-gray-500 mb-0.5">ตำแหน่ง</p>
                  <p class="text-sm font-semibold text-gray-900 truncate" :title="dataSummary.department">{{ dataSummary.department }}</p>
                </div>
                <div class="bg-white rounded-md p-2.5 border border-gray-200">
                  <p class="text-xs text-gray-500 mb-0.5">สายงาน</p>
                  <p class="text-sm font-semibold text-gray-900 truncate" :title="dataSummary.unit">{{ dataSummary.unit }}</p>
                </div>
                <div class="bg-white rounded-md p-2.5 border border-gray-200">
                  <p class="text-xs text-gray-500 mb-0.5">กลุ่มงาน</p>
                  <p class="text-sm font-semibold text-gray-900 truncate" :title="dataSummary.group">{{ dataSummary.group }}</p>
                </div>
                <div class="bg-white rounded-md p-2.5 border border-gray-200">
                  <p class="text-xs text-gray-500 mb-0.5">บริษัท</p>
                  <p class="text-sm font-semibold text-gray-900 truncate" :title="dataSummary.company">{{ dataSummary.company }}</p>
                </div>
                <div class="bg-white rounded-md p-2.5 border border-gray-200 ring-2 ring-blue-500">
                  <p class="text-xs text-gray-500 mb-0.5">ข้อมูลดิบทั้งหมด</p>
                  <p class="text-sm font-bold text-blue-600">{{ dataSummary.total }} รายการ</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chart Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
            <h2 class="text-sm font-semibold text-gray-800 mb-2.5 flex items-center">
              <svg class="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              แผนภูมิแสดงค่าเฉลี่ยคะแนนการประเมิน
            </h2>
            <div class="flex items-center gap-4 text-xs">
              <div class="flex items-center gap-1.5">
                <div class="w-3 h-3 bg-blue-800 rounded"></div>
                <span class="text-gray-700">ปัจจุบัน</span>
              </div>
              <div class="flex items-center gap-1.5">
                <div class="w-3 h-3 bg-blue-500 rounded"></div>
                <span class="text-gray-700">อนาคต</span>
              </div>
            </div>
          </div>
          <div class="p-6">
            <div v-if="isLoading" class="flex justify-center items-center h-64">
              <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            <div v-else-if="chartData.labels.length === 0" class="flex flex-col justify-center items-center h-64 text-gray-500">
              <svg class="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              <p class="text-sm">ไม่พบข้อมูลสำหรับเงื่อนไขที่เลือก</p>
            </div>
            <BetChart v-else :chart-data="chartData" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Smooth transitions */
select, label {
  transition: all 0.2s ease;
}
</style>