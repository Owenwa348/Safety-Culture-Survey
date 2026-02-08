<!-- SalesBarChartDB.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600 font-semibold">กำลังโหลดข้อมูล...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="max-w-7xl mx-auto">
      <!-- Header Card -->
      <div class="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
        <div class="bg-gradient-to-r px-8 py-6">
          <h1 class="text-2xl font-bold mb-2">ผลการประเมินบริษัท ประจำปี {{ selectedYear }}</h1>
          <p>การวิเคราะห์ผลการประเมินตามตำแหน่งและพื้นที่การดำเนินงาน</p>
          
          <!-- Error Warning -->
          <div v-if="error" class="mt-3 bg-red-100 border-l-4 border-red-500 text-red-700 p-3 text-sm rounded">
            <p class="font-semibold">⚠️ เกิดข้อผิดพลาด</p>
            <p class="text-xs mt-1">{{ error }}</p>
          </div>
        </div>
        
        <!-- Filters -->
        <div class="px-8 py-5 bg-gray-50 border-b">
          <div class="flex flex-wrap items-center gap-6">
            <div class="flex items-center space-x-3">
              <label class="text-sm font-semibold text-gray-700">ปี:</label>
              <select 
                v-model="selectedYear"
                class="px-4 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
              >
                <option v-for="year in availableYears" :key="year" :value="year">
                  {{ year }}
                </option>
              </select>
            </div>
            <div class="flex items-center space-x-3">
              <label class="text-sm font-semibold text-gray-700">พื้นที่:</label>
              <select 
                v-model="selectedVersion" 
                class="px-4 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
              >
                <option value="combined">บริษัททั้งหมด</option>
                <option v-for="company in companies" :key="company.id" :value="company.id">
                  {{ company.name }}
                </option>
              </select>
            </div>

            <div class="flex items-center space-x-3">
              <label class="text-sm font-semibold text-gray-700">ช่วงเวลา:</label>
              <select 
                v-model="selectedTimePeriod" 
                class="px-4 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
              >
                <option value="all">เปรียบเทียบ (ปัจจุบัน กับ อนาคต)</option>
                <option value="current">ปัจจุบัน</option>
                <option value="future">อนาคต</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <template v-if="chartData.datasets.length > 0">
        <!-- Chart Card -->
        <div class="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
          <div class="px-8 py-5 border-b bg-gradient-to-r from-gray-50 to-white">
            <h2 class="text-lg font-bold text-gray-800 flex items-center">
              <span class="w-1 h-6 bg-blue-600 rounded-full mr-3"></span>
              กราฟแสดงผลการประเมิน
            </h2>
            <p class="text-sm text-gray-600 mt-1 ml-7">เปรียบเทียบคะแนนเฉลี่ยในแต่ละหมวดหมู่</p>
          </div>
          
          <div class="px-8 py-8">
            <div class="h-[450px]">
              <Bar :data="chartData" :options="chartOptions" />
            </div>
          </div>
        </div>

        <!-- Table Card -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <div class="px-8 py-5 border-b bg-gradient-to-r from-gray-50 to-white">
            <h2 class="text-lg font-bold text-gray-800 flex items-center">
              <span class="w-1 h-6 bg-blue-600 rounded-full mr-3"></span>
              ตารางข้อมูลรายละเอียด
            </h2>
            <p class="text-sm text-gray-600 mt-1 ml-7">{{ getTableDescription }}</p>
          </div>
          
          <div class="overflow-x-auto max-w-full">
            <table class="w-full divide-y divide-gray-200">
              <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th class="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 min-w-[200px] max-w-[250px]">
                    <div class="truncate">{{ tableHeader }}</div>
                  </th>
                  <th 
                    v-for="(label, index) in chartLabels" 
                    :key="index" 
                    class="px-3 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider min-w-[100px] max-w-[140px]"
                    :title="label"
                  >
                    <div class="truncate">
                      {{ label }}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100">
                <tr 
                  v-for="(dataset, index) in chartData.datasets" 
                  :key="index" 
                  class="hover:bg-blue-50 transition-colors duration-200"
                >
                  <td class="px-4 py-4 text-sm font-semibold text-gray-800 sticky left-0 bg-white z-10 border-r border-gray-100 min-w-[200px] max-w-[250px]">
                    <div class="flex items-center gap-2">
                      <div 
                        class="w-3 h-3 rounded flex-shrink-0 shadow-sm" 
                        :style="{ backgroundColor: dataset.backgroundColor }"
                      ></div>
                      <span class="truncate text-xs">{{ dataset.label }}</span>
                    </div>
                  </td>
                  <td 
                    v-for="(score, scoreIndex) in dataset.data" 
                    :key="scoreIndex" 
                    class="px-3 py-4 text-sm text-center font-semibold min-w-[100px] max-w-[140px]"
                    :class="getScoreClass(score)"
                  >
                    <div class="truncate">{{ formatScore(score) }}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Footer Summary -->
          <div class="px-4 sm:px-8 py-5 bg-gradient-to-r from-gray-50 to-blue-50 border-t overflow-x-auto">
            <div class="space-y-4 min-w-[600px]">
              <div class="flex items-center space-x-6 text-sm text-gray-700 flex-wrap">
                <span class="font-semibold whitespace-nowrap">จำนวนกลุ่ม: <span class="text-blue-600">{{ chartData.datasets.length }}</span></span>
                <span class="font-semibold whitespace-nowrap">จำนวนหมวดหมู่: <span class="text-blue-600">{{ chartLabels.length }}</span></span>
              </div>
              
              <div class="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-green-500 rounded shadow-sm flex-shrink-0"></div>
                  <span class="text-gray-700 font-medium whitespace-nowrap">ดีเยี่ยม ≥ 4.5</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-blue-500 rounded shadow-sm flex-shrink-0"></div>
                  <span class="text-gray-700 font-medium whitespace-nowrap">ดี 4.0 - 4.49</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-yellow-500 rounded shadow-sm flex-shrink-0"></div>
                  <span class="text-gray-700 font-medium whitespace-nowrap">ปานกลาง 3.5 - 3.99</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-red-500 rounded shadow-sm flex-shrink-0"></div>
                  <span class="text-gray-700 font-medium whitespace-nowrap">ต้องพัฒนา &lt; 3.5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <div v-else class="mt-6 rounded-xl bg-white p-10 text-center shadow-md">
        <p class="text-lg font-semibold text-gray-500">ยังไม่มีข้อมูลในระบบ</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Reactive state
const selectedVersion = ref("combined");
const selectedTimePeriod = ref("all");
const currentData = ref({});
const futureData = ref({});
const loading = ref(true);
const error = ref(null);
const companies = ref([]);
const categories = ref([]);
const areaNameMap = ref({
  'combined': 'บริษัททั้งหมด',
});

const availableYears = ref([]);
const selectedYear = ref(new Date().getFullYear());

const chartLabels = computed(() => {
  if (categories.value && categories.value.length > 0) {
    return [...categories.value.map(c => c.name), 'AVG'];
  }
  return [];
});

const timePeriodMap = {
  'all': 'ทั้งหมด',
  'current': 'ปัจจุบัน',
  'future': 'อนาคต'
};

const colors = {
  'ผู้บริหารระดับสูง / ผู้จัดการส่วน': '#1e40af',
  'ผู้จัดการแผนก / ผู้จัดการ / พนักงานอาวุโส': '#059669',
  'พนักงาน': '#dc2626',
  'ผู้รับเหมาประจำ': '#f97316',
  'all_current': '#7c3aed',
  'all_future': '#10b981',
  'all_combined': '#1e40af',
  'future_single': '#f59e0b'
};

const fetchAssessmentYears = async () => {
  try {
    const response = await fetch('/api/analytics/assessment-years');
    if (!response.ok) {
      throw new Error('ไม่สามารถดึงข้อมูลปีได้');
    }
    const years = await response.json();
    availableYears.value = years.sort((a, b) => b - a); // Sort descending
    if (!availableYears.value.includes(selectedYear.value)) {
      selectedYear.value = availableYears.value[0] || new Date().getFullYear();
    }
  } catch (err) {
    console.error(err.message);
    if (availableYears.value.length === 0) {
      availableYears.value = [new Date().getFullYear()];
    }
  }
};

const fetchCompanies = async () => {
  try {
    const response = await fetch('/api/companies');
    if (!response.ok) {
      throw new Error('ไม่สามารถดึงข้อมูลบริษัทได้');
    }
    const companyNames = await response.json();
    
    // Sort company names alphabetically to ensure consistent v1, v2 assignment
    companyNames.sort();
    
    const companyOptions = [];
    const newAreaNameMap = { 'combined': 'บริษัททั้งหมด' };

    companyNames.forEach((name, index) => {
      const versionId = `v${index + 1}`;
      companyOptions.push({ id: versionId, name: name });
      newAreaNameMap[versionId] = name;
    });

    companies.value = companyOptions;
    areaNameMap.value = newAreaNameMap;

  } catch (err) {
    console.error(err.message);
    companies.value = [];
    areaNameMap.value = { 'combined': 'บริษัททั้งหมด' };
  }
};

const fetchCategories = async () => {
  try {
    const response = await fetch('/api/categories');
    if (!response.ok) {
      throw new Error('ไม่สามารถดึงข้อมูลหมวดหมู่ได้');
    }
    categories.value = await response.json();
  } catch (err) {
    console.error(err.message);
    categories.value = [];
  }
};


// ฟังก์ชันดึงข้อมูลจาก Backend
const fetchData = async () => {
  error.value = null;
  loading.value = true;
  currentData.value = {};
  futureData.value = {};
  try {
    const yearQuery = `?year=${selectedYear.value}`;
    // เรียก API ทั้ง 2 endpoints พร้อมกัน
    const [currentResponse, futureResponse] = await Promise.all([
      fetch(`/api/analytics/evaluation/current${yearQuery}`),
      fetch(`/api/analytics/evaluation/future${yearQuery}`)
    ]);

    if (!currentResponse.ok || !futureResponse.ok) {
      throw new Error('ไม่สามารถดึงข้อมูลจากเซิร์ฟเวอร์ได้');
    }

    const currentResult = await currentResponse.json();
    const futureResult = await futureResponse.json();

    if (Object.keys(currentResult).length > 0 && Object.keys(futureResult).length > 0) {
      currentData.value = currentResult;
      futureData.value = futureResult;
    }

  } catch (err) {
    console.error('Fetch error:', err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// ฟังก์ชันคำนวณข้อมูลตามช่วงเวลา
const getDataForTimePeriod = (timePeriod) => {
  if (!currentData.value || !futureData.value) return {};
  
  if (timePeriod === 'current') {
    return currentData.value;
  } else if (timePeriod === 'future') {
    return futureData.value;
  } else {
    const combinedData = {};
    for (const group in currentData.value) {
      combinedData[group] = {
        v1: currentData.value[group].v1.map((val, idx) => (val + futureData.value[group].v1[idx]) / 2),
        v2: currentData.value[group].v2.map((val, idx) => (val + futureData.value[group].v2[idx]) / 2)
      };
    }
    return combinedData;
  }
};

// Computed สำหรับข้อมูลกราฟ
const chartData = computed(() => {
  if (!currentData.value || !futureData.value || Object.keys(currentData.value).length === 0) {
    return { labels: chartLabels.value, datasets: [] };
  }

  const datasets = [];
  const timePeriod = selectedTimePeriod.value;
  const version = selectedVersion.value;

  // Show breakdown by position for 'current' or 'future' time periods
  if (timePeriod === 'current' || timePeriod === 'future') {
    const rawData = (timePeriod === 'current') ? currentData.value : futureData.value;
    
    for (const group in rawData) { // group is position name
      let dataPoints = [];
      
      if (version === 'combined') {
        const v1Data = rawData[group].v1 || [];
        const v2Data = rawData[group].v2 || [];
        const maxLength = Math.max(v1Data.length, v2Data.length, chartLabels.value.length);
        for (let i = 0; i < maxLength; i++) {
          const v1 = v1Data[i] || 0;
          const v2 = v2Data[i] || 0;
          if (v1 > 0 && v2 > 0) {
            dataPoints.push((v1 + v2) / 2);
          } else {
            dataPoints.push(v1 || v2);
          }
        }
      } else {
        // Specific version (e.g., 'v1') is selected
        dataPoints = rawData[group][version] || [];
      }
      
      if (dataPoints.length > 0) {
        datasets.push({
          label: `${areaNameMap.value[version]} / ${selectedYear.value}`,
          backgroundColor: colors[group] || '#a8a29e',
          data: dataPoints,
        });
      }
    }
  } else { // 'all' - for comparing current vs future (aggregated view)
    if (version === "combined") {
      const currentCombined = currentData.value;
      const futureCombined = futureData.value;
      const totalGroups = Object.keys(currentCombined).length;

      const currentDataPoints = chartLabels.value.map((_, i) => {
        let sum = 0;
        for (const group in currentCombined) {
          const v1 = currentCombined[group].v1?.[i] || 0;
          const v2 = currentCombined[group].v2?.[i] || 0;
          const avg = (v1 > 0 && v2 > 0) ? (v1 + v2) / 2 : (v1 || v2);
          sum += avg;
        }
        return totalGroups > 0 ? sum / totalGroups : 0;
      });

      const futureDataPoints = chartLabels.value.map((_, i) => {
        let sum = 0;
        for (const group in futureCombined) {
          const v1 = futureCombined[group].v1?.[i] || 0;
          const v2 = futureCombined[group].v2?.[i] || 0;
          const avg = (v1 > 0 && v2 > 0) ? (v1 + v2) / 2 : (v1 || v2);
          sum += avg;
        }
        return totalGroups > 0 ? sum / totalGroups : 0;
      });

      datasets.push({
        label: `ค่าเฉลี่ยของปัจจุบัน (${areaNameMap.value[version]}) ปี ${selectedYear.value}`,
        backgroundColor: colors.all_current,
        data: currentDataPoints,
      });

      datasets.push({
        label: `ค่าเฉลี่ยของอนาคต (${areaNameMap.value[version]}) ปี ${selectedYear.value}`,
        backgroundColor: colors.all_future,
        data: futureDataPoints,
      });

    } else { // 'all' for a specific version
      const currentRawData = currentData.value;
      const futureRawData = futureData.value;
      const totalGroups = Object.keys(currentRawData).length;

      const currentDataPoints = chartLabels.value.map((_, i) => {
        let sum = 0;
        for (const group in currentRawData) {
          sum += currentRawData[group][version]?.[i] || 0;
        }
        return totalGroups > 0 ? sum / totalGroups : 0;
      });

      const futureDataPoints = chartLabels.value.map((_, i) => {
        let sum = 0;
        for (const group in futureRawData) {
          sum += futureRawData[group][version]?.[i] || 0;
        }
        return totalGroups > 0 ? sum / totalGroups : 0;
      });

      datasets.push({
        label: `ค่าเฉลี่ย ปัจจุบัน ${selectedYear.value} (${areaNameMap.value[version]})`,
        backgroundColor: colors.all_current,
        data: currentDataPoints,
      });

      datasets.push({
        label: `ค่าเฉลี่ย อนาคต ${selectedYear.value} (${areaNameMap.value[version]})`,
        backgroundColor: colors.all_future,
        data: futureDataPoints,
      });
    }
  }

  return { labels: chartLabels.value, datasets };
});

const formatScore = (score) => {
  return typeof score === 'number' ? score.toFixed(2) : '0.00';
};

const getScoreClass = (score) => {
  if (score >= 4.5) return 'text-green-700 bg-green-50';
  if (score >= 4.0) return 'text-blue-700 bg-blue-50';
  if (score >= 3.5) return 'text-yellow-700 bg-yellow-50';
  return 'text-red-700 bg-red-50';
};

const tableHeader = computed(() => {
  if (selectedTimePeriod.value === 'all') {
    return 'ช่วงเวลา / บริษัท / ปี';
  }
  return 'บริษัท / ปี';
});

const getTableDescription = computed(() => {
  const area = areaNameMap.value[selectedVersion.value];
  const time = timePeriodMap[selectedTimePeriod.value];
  
  if (selectedVersion.value === 'combined') {
    return `รวมทุกบริษัท (${area} - ${time})`;
  } else {
    return `ทุกตำแหน่งใน ${area} - ${time}`;
  }
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { 
      position: 'top',
      labels: {
        font: { size: 13, weight: '600' },
        padding: 20,
        usePointStyle: true,
        pointStyle: 'circle',
        boxWidth: 10,
        boxHeight: 10,
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      titleFont: { size: 14, weight: 'bold' },
      bodyFont: { size: 13 },
      padding: 12,
      cornerRadius: 8,
      displayColors: true,
      callbacks: {
        label: context => `${context.dataset.label}: ${context.parsed.y.toFixed(2)}`
      }
    },
    datalabels: { display: false }
  },
  scales: {
    y: {
      suggestedMin: 2.0,
      suggestedMax: 5.0,
      title: { 
        display: true, 
        text: 'คะแนนเฉลี่ย',
        font: { size: 14, weight: '600' },
        color: '#374151'
      },
      ticks: {
        stepSize: 0.5,
        callback: val => val.toFixed(1),
        font: { size: 12 },
        color: '#6b7280'
      },
      grid: { 
        color: 'rgba(0, 0, 0, 0.06)',
        drawBorder: false
      }
    },
    x: {
      ticks: {
        maxRotation: 45,
        minRotation: 30,
        font: { size: 11, weight: '500' },
        color: '#6b7280'
      },
      grid: { display: false }
    }
  },
  elements: {
    bar: {
      borderSkipped: false,
      borderRadius: 4
    }
  }
};

watch(selectedYear, (newYear, oldYear) => {
  if (newYear !== oldYear) {
    fetchData();
  }
});

// เรียกใช้งานตอนโหลดครั้งแรก
onMounted(async () => {
  loading.value = true;
  await fetchAssessmentYears();
  await Promise.all([
    fetchCompanies(),
    fetchCategories(),
    fetchData()
  ]);
  loading.value = false;
});
</script>

<style scoped>
select {
  cursor: pointer;
  transition: all 0.2s ease;
}

select:hover {
  border-color: #60a5fa;
}

select:focus {
  outline: none;
}

/* Scrollbar สำหรับตาราง */
.overflow-x-auto {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 10px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #9ca3af;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

/* ป้องกันตารางล้น */
table {
  border-collapse: separate;
  border-spacing: 0;
  table-layout: auto;
  width: 100%;
  max-width: 100%;
}

/* Sticky column shadow effect */
th.sticky,
td.sticky {
  position: sticky;
  left: 0;
  z-index: 10;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
}

th.sticky {
  z-index: 20;
}

tbody tr:last-child td {
  border-bottom: none;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .overflow-x-auto {
    max-width: 100vw;
    margin-left: -1.5rem;
    margin-right: -1.5rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  
  table {
    font-size: 0.875rem;
  }
  
  th.sticky,
  td.sticky {
    min-width: 150px !important;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>