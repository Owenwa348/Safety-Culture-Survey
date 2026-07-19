<!-- StackedBarChartDB.vue -->
<template>
  <div class="bg-white rounded-lg shadow relative">
    <!-- Header -->
    <div class="border-b border-gray-200 px-3 sm:px-5 py-3 sm:py-4">
      <h3 class="text-base sm:text-lg font-bold text-gray-800">กราฟผลการประเมินรายข้อ (บริษัท)</h3>
      <p class="text-xs sm:text-sm text-gray-600 mt-1">แสดงจำนวนคำตอบในแต่ละระดับคะแนน แยกตามหมวดหมู่คำถาม</p>
      <div v-if="selectedAreaName" class="mt-3 p-2.5 sm:p-3 bg-blue-50 border border-blue-200 rounded-md">
        <span class="text-xs sm:text-sm font-medium text-blue-900">🏢 บริษัท: {{ selectedAreaName }}</span>
      </div>
    </div>

    <template v-if="!fetchError">
      <!-- Loading Overlay -->
      <div v-if="loading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-sm text-gray-600">กำลังโหลด...</p>
        </div>
      </div>

      <!-- Controls -->
      <div class="px-3 sm:px-5 py-3 sm:py-4 border-b border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">เลือกปี</label>
            <select
              v-model="selectedYear"
              @change="onYearChange"
              :disabled="availableYears.length === 0"
              class="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer appearance-none bg-white bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20stroke=%27%236b7280%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%271.5%27%20d=%27M6%208l4%204%204-4%27/%3e%3c/svg%3e')] bg-[length:1.25em_1.25em] bg-[right_0.5rem_center] bg-no-repeat pr-10 hover:border-gray-400 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option v-if="availableYears.length === 0" :value="null">ไม่มีข้อมูลปี</option>
              <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">เลือกบริษัท</label>
            <select
              v-model="selectedArea"
              @change="onAreaChange"
              class="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer appearance-none bg-white bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20stroke=%27%236b7280%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%271.5%27%20d=%27M6%208l4%204%204-4%27/%3e%3c/svg%3e')] bg-[length:1.25em_1.25em] bg-[right_0.5rem_center] bg-no-repeat pr-10 hover:border-gray-400 transition-all"
            >
              <option value="combined">บริษัททั้งหมด</option>
              <option v-for="area in areas" :key="area.id" :value="area.id">{{ area.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">ช่วงเวลา</label>
            <select
              v-model="selectedTimeframe"
              @change="onTimeframeChange"
              class="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer appearance-none bg-white bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20stroke=%27%236b7280%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%271.5%27%20d=%27M6%208l4%204%204-4%27/%3e%3c/svg%3e')] bg-[length:1.25em_1.25em] bg-[right_0.5rem_center] bg-no-repeat pr-10 hover:border-gray-400 transition-all"
            >
              <option value="comparison">เปรียบเทียบ (ปัจจุบัน vs เป้าหมาย)</option>
              <option value="current">ปัจจุบัน</option>
              <option value="future">เป้าหมาย</option>
            </select>
          </div>
        </div>

        <!-- Summary -->
        <div class="mt-4 pt-4 border-t border-gray-200 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-gray-600">
          <span class="font-medium">กำลังแสดง:</span>
          <span class="font-semibold text-blue-800">ปี {{ selectedYear || 'N/A' }}</span>
          <span class="text-gray-300">•</span>
          <span>{{ selectedAreaName }}</span>
          <span class="text-gray-300">•</span>
          <span>{{ selectedTimeframeLabel }}</span>
        </div>
      </div>

      <!-- Chart or Empty State -->
      <div class="px-2 sm:px-5 py-4 sm:py-5">
        <template v-if="chartData">
          <div :class="selectedTimeframe === 'comparison' ? 'h-[380px] sm:h-[450px] md:h-[500px]' : 'h-[320px] sm:h-[400px] md:h-[450px]'">
            <Bar :data="chartData" :options="chartOptions" />
          </div>
        </template>
        <template v-else>
          <div class="flex flex-col items-center justify-center py-12 sm:py-16 px-4 text-center">
            <div class="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-full mb-4">
              <svg class="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p class="text-sm font-semibold text-gray-500">ยังไม่มีข้อมูลในระบบ</p>
            <p class="text-xs text-gray-400 mt-1">กรุณาเลือกปีหรือบริษัทอื่น</p>
          </div>
        </template>
      </div>

      <!-- Info for comparison mode -->
      <div v-if="selectedTimeframe === 'comparison' && chartData" class="px-3 sm:px-5 pb-4 sm:pb-5">
        <div class="bg-blue-50 border border-blue-200 rounded-md p-2.5 sm:p-3">
          <p class="text-xs sm:text-sm text-blue-900">
            <span class="font-medium">วิธีดูกราฟ:</span>
            แท่งสีเข้มทางซ้ายคือข้อมูลปัจจุบัน ส่วนแท่งสีอ่อนทางขวาคือข้อมูลที่คาดว่าจะเป็นในเป้าหมาย
          </p>
        </div>
      </div>

      <!-- Categories -->
      <div v-if="categories.length > 0" class="px-3 sm:px-5 pb-4 sm:pb-5 border-t border-gray-200">
        <div class="mt-4 sm:mt-5">
          <h4 class="text-sm font-bold text-gray-800 mb-3">📋 หมวดหมู่คำถาม</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
            <div
              v-for="(category, index) in categories"
              :key="category.id"
              class="p-2.5 sm:p-3 border border-gray-200 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div class="flex items-start">
                <span class="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white text-xs font-semibold mr-3 flex-shrink-0">
                  {{ index + 1 }}
                </span>
                <div class="flex-1 min-w-0">
                  <h5 class="text-sm font-medium text-gray-900">{{ category.name }}</h5>
                  <p class="text-xs text-gray-600 mt-1">คำถาม: {{ category.questionCount }} ข้อ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Error State -->
    <template v-else>
      <div class="flex flex-col items-center justify-center py-12 sm:py-16 px-4 text-center">
        <div class="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-red-50 rounded-full mb-4">
          <svg class="w-7 h-7 sm:w-8 sm:h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p class="text-sm font-semibold text-gray-500">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
        <p class="text-xs text-gray-400 mt-1">{{ fetchError }}</p>
        <button
          @click="retryFetch"
          class="mt-4 text-sm text-blue-600 hover:text-blue-800 underline"
        >
          ลองใหม่อีกครั้ง
        </button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { apiFetch } from '../../../utils/apiClient';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ChartDataLabels);

// =======================================
// State
// =======================================
const loading = ref(false);
const fetchError = ref(null);
const filterError = ref(null);

const availableYears = ref([]);
const areas = ref([]);
const categories = ref([]);
const chartDataRaw = ref(null);

const selectedYear = ref(null);
const selectedArea = ref('combined');
const selectedTimeframe = ref('comparison');

const abortController = ref(null);

// =======================================
// Constants
// =======================================
const levelLabels = ['ระดับ 1', 'ระดับ 2', 'ระดับ 3', 'ระดับ 4', 'ระดับ 5'];
const colors = ['#7B341E', '#E53E3E', '#ED8936', '#ECC94B', '#38A169'];
const colorsLight = ['#B5826F', '#fca5a5', '#fdba74', '#fde68a', '#86efac'];

// =======================================
// API Functions
// =======================================
const fetchYears = async () => {
  try {
    const response = await apiFetch('/api/analytics/assessment-years');
    if (!response.ok) throw new Error('Failed to fetch years');
    const data = await response.json();
    availableYears.value = data;
    if (data.length > 0) selectedYear.value = data[0];
  } catch (err) {
    console.error('Error fetching years:', err);
    throw err;
  }
};

const fetchAreas = async () => {
  try {
    const response = await apiFetch('/api/analytics/companies');
    if (!response.ok) throw new Error('Failed to fetch areas');
    areas.value = await response.json();
  } catch (err) {
    console.error('Error fetching areas:', err);
    throw err;
  }
};

const fetchChartData = async (year, areaId, timeframe) => {
  if (!year) {
    chartDataRaw.value = null;
    return;
  }

  if (abortController.value) abortController.value.abort();
  abortController.value = new AbortController();
  const signal = abortController.value.signal;

  const showLoading = !chartDataRaw.value;
  if (showLoading) loading.value = true;

  try {
    const params = new URLSearchParams({
      areaId: areaId || 'combined',
      timeframe: timeframe || 'comparison',
      year,
    });

    const response = await apiFetch(`/api/analytics/stacked-chart-data?${params}`, { signal });
    if (!response.ok) throw new Error('Failed to fetch chart data');

    const data = await response.json();
    chartDataRaw.value = data;
    if (data.categories) categories.value = data.categories;
  } catch (err) {
    if (err.name === 'AbortError') return;
    chartDataRaw.value = null;
    throw err;
  } finally {
    if (showLoading) loading.value = false;
  }
};

const fetchData = async () => {
  loading.value = true;
  fetchError.value = null;
  filterError.value = null;

  try {
    await Promise.all([fetchYears(), fetchAreas()]);
    await fetchChartData(selectedYear.value, selectedArea.value, selectedTimeframe.value);
  } catch (err) {
    fetchError.value = 'เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง';
  } finally {
    loading.value = false;
  }
};

const retryFetch = async () => {
  await fetchData();
};

// =======================================
// Computed
// =======================================
const selectedAreaName = computed(() => {
  if (selectedArea.value === 'combined') return 'บริษัททั้งหมด';
  const area = areas.value.find(a => a.id === selectedArea.value);
  return area ? area.name : '';
});

const selectedTimeframeLabel = computed(() => {
  const labels = {
    comparison: 'เปรียบเทียบ (ปัจจุบัน vs เป้าหมาย)',
    current: 'ข้อมูลปัจจุบัน',
    future: 'ข้อมูลคาดการณ์เป้าหมาย',
  };
  return labels[selectedTimeframe.value];
});

const chartData = computed(() => {
  if (!chartDataRaw.value) return null;

  const { current, future, categories: categoriesList } = chartDataRaw.value;
  if (!categoriesList || categoriesList.length === 0) return null;

  const categoryLabels = categoriesList.map(cat => cat.name);
  const aggregatedCurrent = [[], [], [], [], []];
  const aggregatedFuture = [[], [], [], [], []];
  let questionIndex = 0;

  categoriesList.forEach(category => {
    for (let level = 0; level < 5; level++) {
      let sum = 0;
      for (let q = 0; q < category.questionCount; q++) {
        if (current[level]?.[questionIndex + q]) sum += current[level][questionIndex + q];
      }
      aggregatedCurrent[level].push(sum);
    }
    questionIndex += category.questionCount;
  });

  questionIndex = 0;
  categoriesList.forEach(category => {
    for (let level = 0; level < 5; level++) {
      let sum = 0;
      for (let q = 0; q < category.questionCount; q++) {
        if (future[level]?.[questionIndex + q]) sum += future[level][questionIndex + q];
      }
      aggregatedFuture[level].push(sum);
    }
    questionIndex += category.questionCount;
  });

  if (selectedTimeframe.value === 'comparison') {
    const currentTotal = categoryLabels.map((_, j) =>
      aggregatedCurrent.reduce((sum, level) => sum + level[j], 0)
    );
    const futureTotal = categoryLabels.map((_, j) =>
      aggregatedFuture.reduce((sum, level) => sum + level[j], 0)
    );

    return {
      labels: categoryLabels,
      datasets: [
        ...aggregatedCurrent.map((data, i) => ({
          label: levelLabels[i],
          data: data.map((v, j) => currentTotal[j] ? (v * 100 / currentTotal[j]) : 0),
          rawData: data,
          totalPerCategory: currentTotal,
          backgroundColor: colors[i],
          borderColor: 'rgba(255,255,255,0.3)',
          borderRadius: 3,
          borderWidth: 1,
          stack: 'current',
          barThickness: 17,
        })),
        ...aggregatedFuture.map((data, i) => ({
          label: levelLabels[i],
          data: data.map((v, j) => futureTotal[j] ? (v * 100 / futureTotal[j]) : 0),
          rawData: data,
          totalPerCategory: futureTotal,
          backgroundColor: colorsLight[i],
          borderColor: 'rgba(255,255,255,0.3)',
          borderRadius: 3,
          borderWidth: 1,
          stack: 'future',
          barThickness: 17,
        })),
      ],
    };
  } else {
    const selectedData = selectedTimeframe.value === 'current' ? aggregatedCurrent : aggregatedFuture;
    const total = categoryLabels.map((_, j) =>
      selectedData.reduce((sum, level) => sum + level[j], 0)
    );

    return {
      labels: categoryLabels,
      datasets: selectedData.map((data, i) => ({
        label: levelLabels[i],
        data: data.map((v, j) => total[j] ? (v * 100 / total[j]) : 0),
        rawData: data,
        totalPerCategory: total,
        backgroundColor: colors[i],
        borderColor: 'rgba(255,255,255,0.3)',
        borderWidth: 1,
        borderRadius: 3,
        stack: 'stack1',
        barThickness: 'flex',
        maxBarThickness: 60,
        minBarLength: 2,
      })),
    };
  }
});

const chartOptions = computed(() => {
  const isComparison = selectedTimeframe.value === 'comparison';
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    scales: {
      x: {
        stacked: true,
        categoryPercentage: 0.75,
        barPercentage: 0.9,
        grid: { display: false },
        ticks: {
          font: { size: 10, family: 'inherit' },
          color: '#6B7280',
          maxRotation: 45,
          minRotation: 45,
          autoSkip: false,
          callback: function (value) {
            const label = this.getLabelForValue(value);
            return label.length > 20 ? label.substring(0, 20) + '...' : label;
          },
        },
        border: { display: true, color: '#E5E7EB' },
      },
      y: {
        stacked: true,
        display: false,
        min: 0,
        max: 100,
        ticks: { display: false },
        grid: { display: false },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'start',
        labels: {
          boxWidth: 13,
          boxHeight: 13,
          padding: 15,
          font: { size: 11, family: 'inherit' },
          color: '#1f2937',
          usePointStyle: false,
          generateLabels: (chart) => {
            if (!isComparison) {
              return chart.data.datasets.map((dataset, i) => ({
                text: dataset.label,
                fillStyle: dataset.backgroundColor,
                hidden: dataset.hidden,
                index: i,
              }));
            }
            return [
              ...Array.from({ length: 5 }, (_, i) => {
                const dataset = chart.data.datasets[i];
                return {
                  text: `ระดับ ${i + 1} (ปัจจุบัน)`,
                  fillStyle: colors[i],
                  strokeStyle: colors[i],
                  lineWidth: dataset?.hidden ? 2 : 0,
                  hidden: dataset?.hidden || false,
                  index: i,
                  datasetIndex: i,
                };
              }),
              ...Array.from({ length: 5 }, (_, i) => {
                const dataset = chart.data.datasets[i + 5];
                return {
                  text: `ระดับ ${i + 1} (เป้าหมาย)`,
                  fillStyle: colorsLight[i],
                  strokeStyle: colorsLight[i],
                  lineWidth: dataset?.hidden ? 2 : 0,
                  hidden: dataset?.hidden || false,
                  index: i + 5,
                  datasetIndex: i + 5,
                };
              }),
            ];
          },
        },
        onClick: (e, legendItem, legend) => {
          if (legendItem.datasetIndex !== undefined) {
            const chart = legend.chart;
            const ds = chart.data.datasets[legendItem.datasetIndex];
            if (ds) ds.hidden = !ds.hidden;
            chart.update();
          }
        },
      },
      datalabels: {
        display: ctx => ctx.dataset.rawData[ctx.dataIndex] > 0,
        color: ctx => (isComparison && ctx.datasetIndex >= 5) ? '#000000' : '#ffffff',
        font: { size: isComparison ? 10 : 12, weight: '900', family: 'inherit' },
        formatter: (_, ctx) => ctx.dataset.rawData[ctx.dataIndex],
        anchor: 'center',
        align: 'center',
        textShadowColor: ctx => (isComparison && ctx.datasetIndex >= 5) ? 'transparent' : 'rgba(0,0,0,0.5)',
        textShadowBlur: ctx => (isComparison && ctx.datasetIndex >= 5) ? 0 : 3,
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.85)',
        titleColor: '#fff',
        bodyColor: '#fff',
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 11 },
        padding: 10,
        cornerRadius: 6,
        displayColors: true,
        boxWidth: 10,
        boxHeight: 10,
        callbacks: {
          // หัวข้อ tooltip: บอกชื่อหมวดหมู่ + จำนวนคำตอบรวมของช่วงเวลานั้น
          title: items => {
            if (items.length === 0) return '';
            const categoryName = items[0].label;

            if (isComparison) {
              // แยกเป็น 2 บรรทัด: ปัจจุบัน / เป้าหมาย ตาม stack
              const currentItem = items.find(i => i.dataset.stack === 'current');
              const futureItem = items.find(i => i.dataset.stack === 'future');
              const lines = [`📊 ${categoryName}`];
              if (currentItem) {
                const total = currentItem.dataset.totalPerCategory[currentItem.dataIndex];
                lines.push(`ปัจจุบัน: คำตอบรวมในหมวดนี้ ${total} คำตอบ`);
              }
              if (futureItem) {
                const total = futureItem.dataset.totalPerCategory[futureItem.dataIndex];
                lines.push(`เป้าหมาย: คำตอบรวมในหมวดนี้ ${total} คำตอบ`);
              }
              return lines;
            }

            const total = items[0].dataset.totalPerCategory[items[0].dataIndex];
            const period = selectedTimeframe.value === 'current' ? 'ปัจจุบัน' : 'เป้าหมาย';
            return [`📊 ${categoryName}`, `${period}: คำตอบรวมในหมวดนี้ ${total} คำตอบ`];
          },

          // รายละเอียดแต่ละระดับ: ชื่อระดับ + จำนวนคำตอบ + เปอร์เซ็นต์ พร้อมระบุปัจจุบัน/เป้าหมาย
          label: ctx => {
            const raw = ctx.dataset.rawData[ctx.dataIndex];
            const pct = ctx.parsed.y.toFixed(1);
            const period = isComparison
              ? (ctx.dataset.stack === 'current' ? ' (ปัจจุบัน)' : ' (เป้าหมาย)')
              : '';
            return `${ctx.dataset.label}${period}: ${raw} คำตอบ (${pct}%)`;
          },
        },
      },
    },
  };
});

// =======================================
// Event Handlers
// =======================================
const onYearChange = async () => {
  filterError.value = null;
  try {
    await fetchChartData(selectedYear.value, selectedArea.value, selectedTimeframe.value);
  } catch (err) {
    if (err.name !== 'AbortError') {
      filterError.value = 'ไม่สามารถโหลดข้อมูลสำหรับปีที่เลือกได้';
    }
  }
};

const onAreaChange = async () => {
  filterError.value = null;
  try {
    await fetchChartData(selectedYear.value, selectedArea.value, selectedTimeframe.value);
  } catch (err) {
    if (err.name !== 'AbortError') {
      filterError.value = 'ไม่สามารถโหลดข้อมูลสำหรับบริษัทที่เลือกได้';
    }
  }
};

const onTimeframeChange = async () => {
  filterError.value = null;
  try {
    await fetchChartData(selectedYear.value, selectedArea.value, selectedTimeframe.value);
  } catch (err) {
    if (err.name !== 'AbortError') {
      filterError.value = 'ไม่สามารถโหลดข้อมูลสำหรับช่วงเวลาที่เลือกได้';
    }
  }
};

// =======================================
// Lifecycle
// =======================================
onMounted(() => {
  fetchData();
});

onUnmounted(() => {
  if (abortController.value) abortController.value.abort();
});
</script>