<!-- SalesBarChartDB.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6 overflow-x-hidden">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
        <p class="mt-4 text-gray-600 font-semibold">กำลังโหลดข้อมูล...</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="max-w-7xl mx-auto space-y-6">
      <!-- Header Card -->
      <div class="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
        <div class="bg-gradient-to-r px-8 py-6">
          <h1 class="text-2xl font-bold mb-2">ผลการประเมินบริษัท ประจำปี {{ selectedYear }}</h1>
          <p>วิเคราะห์ผลการประเมินตามตำแหน่งงานและบริษัท</p>

          <!-- Error Warning -->
          <div v-if="fetchError" class="mt-3 bg-red-100 border-l-4 border-red-500 text-red-700 p-3 text-sm rounded">
            <p class="font-semibold">⚠️ โหลดข้อมูลไม่สำเร็จ</p>
            <p class="text-xs mt-1">{{ fetchError }}</p>
            <button @click="retryFetch" class="mt-2 text-xs text-red-600 hover:text-red-800 underline">
              ลองอีกครั้ง
            </button>
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
              <label class="text-sm font-semibold text-gray-700">บริษัท:</label>
              <select
                v-model="selectedVersion"
                class="px-4 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
              >
                <option value="combined">ทุกบริษัท</option>
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
                <option value="all">เปรียบเทียบปัจจุบันกับเป้าหมาย</option>
                <option value="current">ปัจจุบัน</option>
                <option value="future">เป้าหมาย</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <template v-if="chartData.datasets.length > 0">
        <!-- Chart Card -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 class="text-lg font-bold text-gray-900">กราฟแสดงผลการประเมิน</h2>
            <p class="text-sm text-gray-600 mt-1">เปรียบเทียบคะแนนเฉลี่ยในแต่ละหมวดหมู่</p>
          </div>
          <div class="px-6 py-6">
            <div class="h-[580px] w-full">
              <Bar :key="chartRenderKey" :data="chartData" :options="chartOptions" />
            </div>
          </div>
        </div>

        <!-- Table Card -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 class="text-lg font-bold text-gray-900">ตารางข้อมูลรายละเอียด</h2>
            <p class="text-sm text-gray-600 mt-1">{{ getTableDescription }}</p>
          </div>
          <div class="overflow-x-auto" style="max-width: calc(100vw - 4rem);">
            <table class="w-auto divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-4 text-left text-sm font-bold text-gray-800 min-w-[200px] sticky left-0 bg-gray-50 z-10">
                    {{ tableHeader }}
                  </th>
                  <th
                    v-for="(label, index) in chartLabels"
                    :key="`header-${index}`"
                    class="px-4 py-4 text-center text-sm font-semibold text-gray-800 min-w-[140px]"
                    :title="label"
                  >
                    <div class="line-clamp-3 leading-relaxed">{{ label }}</div>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr
                  v-for="(dataset, idx) in chartData.datasets"
                  :key="`row-${idx}`"
                  class="hover:bg-gray-50"
                >
                  <td class="px-4 py-3 text-sm font-medium text-gray-900 min-w-[200px] sticky left-0 bg-white z-10">
                    <div class="flex items-center gap-2">
                      <span
                        class="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                        :style="{ backgroundColor: dataset.backgroundColor }"
                      ></span>
                      <span class="truncate" :title="dataset.label">{{ dataset.label }}</span>
                    </div>
                  </td>
                  <td
                    v-for="(score, scoreIdx) in dataset.data"
                    :key="`score-${idx}-${scoreIdx}`"
                    class="px-4 py-3 text-center text-sm font-semibold min-w-[140px]"
                    :class="getScoreClass(score)"
                  >
                    {{ formatScore(score) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Footer Summary -->
          <div class="px-4 py-4 bg-gray-50 border-t border-gray-200">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div class="flex items-center gap-4 text-sm text-gray-700 flex-wrap">
                <span class="font-semibold whitespace-nowrap">
                  จำนวนกลุ่ม: <span class="text-blue-600">{{ chartData.datasets.length }}</span>
                </span>
                <span class="font-semibold whitespace-nowrap">
                  จำนวนหมวดหมู่: <span class="text-blue-600">{{ chartLabels.length }}</span>
                </span>
              </div>
              <div class="flex flex-wrap items-center gap-2.5 text-xs">
                <div class="flex items-center gap-1.5">
                  <span class="w-3 h-3 bg-green-500 rounded shadow-sm"></span>
                  <span class="text-gray-700 font-medium whitespace-nowrap">ดีเยี่ยม ≥ 4.5</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="w-3 h-3 bg-blue-500 rounded shadow-sm"></span>
                  <span class="text-gray-700 font-medium whitespace-nowrap">ดี 4.0–4.49</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="w-3 h-3 bg-yellow-500 rounded shadow-sm"></span>
                  <span class="text-gray-700 font-medium whitespace-nowrap">พอใช้ 3.5–3.99</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <span class="w-3 h-3 bg-red-500 rounded shadow-sm"></span>
                  <span class="text-gray-700 font-medium whitespace-nowrap">ต้องพัฒนา &lt; 3.5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Empty State -->
      <template v-else>
        <div class="bg-white rounded-lg shadow">
          <div class="flex flex-col items-center justify-center py-16">
            <div class="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p class="text-sm font-semibold text-gray-500">ไม่พบข้อมูล</p>
            <p class="text-xs text-gray-400 mt-1">ลองเปลี่ยนปีหรือบริษัทที่ต้องการดู</p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
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
import { apiFetch } from '../../../utils/apiClient';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// =======================================
// Reactive State
// =======================================
const selectedVersion = ref('combined');
const selectedTimePeriod = ref('all');
const currentData = ref({});
const futureData = ref({});
const loading = ref(true);

const fetchError = ref(null);

const companies = ref([]);
const categories = ref([]);
const areaNameMap = ref({ combined: 'ทุกบริษัท' });
const availableYears = ref([]);
const selectedYear = ref(new Date().getFullYear());
const chartRenderKey = ref(0);

const abortController = ref(null);

// =======================================
// Constants
// =======================================
const timePeriodMap = { all: 'ทั้งหมด', current: 'ปัจจุบัน', future: 'เป้าหมาย' };

const colors = {
  'ผู้บริหารระดับสูง / ผู้จัดการส่วน': '#1e40af',
  'ผู้จัดการแผนก / ผู้จัดการ / พนักงานอาวุโส': '#059669',
  'พนักงาน': '#dc2626',
  'ผู้รับเหมาประจำ': '#f97316',
  all_current: '#7c3aed',
  all_future: '#10b981',
};

// =======================================
// Computed
// =======================================
const chartLabels = computed(() => {
  if (categories.value?.length > 0) {
    return [...categories.value.map(c => c.name), 'AVG'];
  }
  return [];
});

// =======================================
// API Functions
// =======================================
const fetchAssessmentYears = async () => {
  try {
    const response = await apiFetch('/api/analytics/assessment-years');
    if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลปีได้');
    const years = await response.json();
    availableYears.value = years.sort((a, b) => b - a);
    if (!availableYears.value.includes(selectedYear.value)) {
      selectedYear.value = availableYears.value[0] || new Date().getFullYear();
    }
  } catch (err) {
    console.error(err.message);
    if (availableYears.value.length === 0) availableYears.value = [new Date().getFullYear()];
  }
};

const fetchCompanies = async () => {
  try {
    const response = await apiFetch('/api/analytics/companies');
    if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลบริษัทได้');
    const data = await response.json();
    const companyNames = data.map(c => c.name).sort();
    companies.value = companyNames.map((name, i) => ({ id: `company_${i + 1}`, name }));
    areaNameMap.value = {
      combined: 'ทุกบริษัท',
      ...Object.fromEntries(companyNames.map((name, i) => [`company_${i + 1}`, name])),
    };
  } catch (err) {
    console.error(err.message);
  }
};

const fetchCategories = async () => {
  try {
    const response = await apiFetch(`/api/analytics/stacked-chart-data?year=${selectedYear.value}`);
    if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลหมวดหมู่ได้');
    const data = await response.json();
    categories.value = data.categories || [];
  } catch (err) {
    console.error(err.message);
  }
};

const fetchData = async () => {
  if (abortController.value) abortController.value.abort();
  abortController.value = new AbortController();

  fetchError.value = null;
  loading.value = true;
  currentData.value = {};
  futureData.value = {};

  try {
    const yearQuery = `?year=${selectedYear.value}`;
    const signal = abortController.value.signal;

    const [currentResponse, futureResponse] = await Promise.all([
      apiFetch(`/api/analytics/evaluation/current${yearQuery}`, { signal }),
      apiFetch(`/api/analytics/evaluation/future${yearQuery}`, { signal }),
    ]);

    if (!currentResponse.ok || !futureResponse.ok) {
      throw new Error('ดึงข้อมูลจากเซิร์ฟเวอร์ไม่สำเร็จ');
    }

    const [currentResult, futureResult] = await Promise.all([
      currentResponse.json(),
      futureResponse.json(),
    ]);

    if (Object.keys(currentResult).length > 0) {
      currentData.value = currentResult;
      futureData.value = futureResult;
    }
  } catch (err) {
    if (err.name === 'AbortError') return;
    console.error('Fetch error:', err);
    fetchError.value = err.message;
  } finally {
    loading.value = false;
  }
};

const retryFetch = async () => {
  await fetchData();
};

// =======================================
// Computed — Chart Data
// =======================================
const chartData = computed(() => {
  if (!currentData.value || !futureData.value || Object.keys(currentData.value).length === 0) {
    return { labels: chartLabels.value, datasets: [] };
  }

  const datasets = [];
  const timePeriod = selectedTimePeriod.value;
  const version = selectedVersion.value;

  if (timePeriod === 'current' || timePeriod === 'future') {
    const rawData = timePeriod === 'current' ? currentData.value : futureData.value;

    for (const group in rawData) {
      let dataPoints = [];

      if (version === 'combined') {
        const company1Data = rawData[group].company_1 || [];
        const company2Data = rawData[group].company_2 || [];
        const maxLength = Math.max(company1Data.length, company2Data.length, chartLabels.value.length);
        for (let i = 0; i < maxLength; i++) {
          const c1 = company1Data[i] || 0;
          const c2 = company2Data[i] || 0;
          dataPoints.push(c1 > 0 && c2 > 0 ? (c1 + c2) / 2 : c1 || c2);
        }
      } else {
        dataPoints = rawData[group][version] || [];
      }

      if (dataPoints.length > 0) {
        datasets.push({
          label: `${group} - ${areaNameMap.value[version]}`,
          backgroundColor: colors[group] || '#a8a29e',
          data: dataPoints,
        });
      }
    }
  } else {
    if (version === 'combined') {
      const totalGroups = Object.keys(currentData.value).length;

      const currentDataPoints = chartLabels.value.map((_, i) => {
        let sum = 0;
        for (const group in currentData.value) {
          const c1 = currentData.value[group].company_1?.[i] || 0;
          const c2 = currentData.value[group].company_2?.[i] || 0;
          sum += c1 > 0 && c2 > 0 ? (c1 + c2) / 2 : c1 || c2;
        }
        return totalGroups > 0 ? sum / totalGroups : 0;
      });

      const futureDataPoints = chartLabels.value.map((_, i) => {
        let sum = 0;
        for (const group in futureData.value) {
          const c1 = futureData.value[group].company_1?.[i] || 0;
          const c2 = futureData.value[group].company_2?.[i] || 0;
          sum += c1 > 0 && c2 > 0 ? (c1 + c2) / 2 : c1 || c2;
        }
        return totalGroups > 0 ? sum / totalGroups : 0;
      });

      datasets.push({
        label: `คะแนนเฉลี่ยปัจจุบัน (${areaNameMap.value[version]}) ปี ${selectedYear.value}`,
        backgroundColor: colors.all_current,
        data: currentDataPoints,
      });
      datasets.push({
        label: `คะแนนเฉลี่ยเป้าหมาย (${areaNameMap.value[version]}) ปี ${selectedYear.value}`,
        backgroundColor: colors.all_future,
        data: futureDataPoints,
      });
    } else {
      const totalGroups = Object.keys(currentData.value).length;

      const currentDataPoints = chartLabels.value.map((_, i) => {
        let sum = 0;
        for (const group in currentData.value) sum += currentData.value[group][version]?.[i] || 0;
        return totalGroups > 0 ? sum / totalGroups : 0;
      });

      const futureDataPoints = chartLabels.value.map((_, i) => {
        let sum = 0;
        for (const group in futureData.value) sum += futureData.value[group][version]?.[i] || 0;
        return totalGroups > 0 ? sum / totalGroups : 0;
      });

      datasets.push({
        label: `คะแนนเฉลี่ยปัจจุบัน ปี ${selectedYear.value} (${areaNameMap.value[version]})`,
        backgroundColor: colors.all_current,
        data: currentDataPoints,
      });
      datasets.push({
        label: `คะแนนเฉลี่ยเป้าหมาย ปี ${selectedYear.value} (${areaNameMap.value[version]})`,
        backgroundColor: colors.all_future,
        data: futureDataPoints,
      });
    }
  }

  return { labels: chartLabels.value, datasets };
});

// =======================================
// Helpers
// =======================================
const formatScore = (score) => (typeof score === 'number' ? score.toFixed(2) : '0.00');

const getScoreClass = (score) => {
  if (score >= 4.5) return 'text-green-700 bg-green-50';
  if (score >= 4.0) return 'text-blue-700 bg-blue-50';
  if (score >= 3.5) return 'text-yellow-700 bg-yellow-50';
  return 'text-red-700 bg-red-50';
};

const tableHeader = computed(() =>
  selectedTimePeriod.value === 'all' ? 'ช่วงเวลา / บริษัท / ปี' : 'บริษัท / ปี'
);

const getTableDescription = computed(() => {
  const area = areaNameMap.value[selectedVersion.value];
  const time = timePeriodMap[selectedTimePeriod.value];
  return selectedVersion.value === 'combined'
    ? `รวมทุกบริษัท (${area} — ${time})`
    : `ทุกตำแหน่งใน ${area} — ${time}`;
});

const chartOptions = computed(() => {
  const allValues = chartData.value.datasets.flatMap(d => d.data).filter(v => v > 0);
  const dataMin = allValues.length > 0 ? Math.min(...allValues) : 2.0;
  const yMin = Math.max(0, Math.floor((dataMin - 0.5) * 2) / 2);

  return {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { left: 5, right: 5, top: 5, bottom: 50 } },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        align: 'center',
        labels: {
          font: { size: 12, weight: '600' },
          padding: 10,
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 8,
          boxHeight: 8,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: context => `${context.dataset.label}: ${context.parsed.y.toFixed(2)}`,
        },
      },
      datalabels: { display: false },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: yMin,
        max: 5.0,
        title: {
          display: true,
          text: 'คะแนนเฉลี่ย',
          font: { size: 14, weight: '600' },
          color: '#374151',
        },
        ticks: {
          stepSize: 0.5,
          callback: val => val.toFixed(1),
          font: { size: 12 },
          color: '#6b7280',
        },
        grid: { color: 'rgba(0, 0, 0, 0.06)', drawBorder: false },
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: { size: 10, weight: '500' },
          color: '#374151',
          autoSkip: false,
          padding: 4,
          callback: function (value) {
            const label = this.getLabelForValue(value);
            return label.length > 15 ? label.substring(0, 15) + '...' : label;
          },
        },
        grid: { display: false, drawBorder: true },
      },
    },
    elements: { bar: { borderSkipped: false, borderRadius: 4 } },
  };
});

// =======================================
// Watchers
// =======================================
watch(selectedYear, (newYear, oldYear) => {
  if (newYear !== oldYear) fetchData();
});

watch([selectedVersion, selectedTimePeriod], () => {
  chartRenderKey.value++;
}, { deep: true });

watch(chartData, () => {
  chartRenderKey.value++;
}, { deep: true });

// =======================================
// Lifecycle
// =======================================
onMounted(async () => {
  loading.value = true;
  await fetchAssessmentYears();
  await Promise.all([fetchCompanies(), fetchCategories()]);
  await fetchData();
});

onUnmounted(() => {
  if (abortController.value) abortController.value.abort();
});
</script>

<style scoped>
select {
  cursor: pointer;
  transition: all 0.2s ease;
}
select:hover { border-color: #60a5fa; }
select:focus { outline: none; }

.overflow-x-auto { -webkit-overflow-scrolling: touch; }
.overflow-x-auto::-webkit-scrollbar { height: 8px; }
.overflow-x-auto::-webkit-scrollbar-track { background: #f3f4f6; border-radius: 4px; }
.overflow-x-aux::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
.overflow-x-auto::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
.overflow-x-auto::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
