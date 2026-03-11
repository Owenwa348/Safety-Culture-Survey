<!-- StackedBarChartDB.vue -->
<template>
  <div class="bg-white rounded-lg shadow relative">
    <!-- Header -->
    <div class="border-b border-gray-200 px-5 py-4">
      <h3 class="text-lg font-bold text-gray-800">กราฟผลการประเมินรายข้อ (บริษัท)</h3>
      <p class="text-sm text-gray-600 mt-1">การวิเคราะห์การกระจายตัวของข้อมูลตามระดับแต่ละหมวดหมู่คำถาม</p>
      <!-- Company Name Display -->
      <div v-if="selectedAreaName" class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <span class="text-sm font-medium text-blue-900">🏢 บริษัท: {{ selectedAreaName }}</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="px-5 py-4">
      <div class="bg-red-50 border border-red-200 rounded-md p-4">
        <p class="text-sm text-red-800">{{ error }}</p>
        <button 
          @click="fetchData" 
          class="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          ลองใหม่อีกครั้ง
        </button>
      </div>
    </div>

    <template v-if="!error">
      <!-- Loading Overlay -->
      <div v-if="loading" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p class="mt-2 text-sm text-gray-600">กำลังโหลด...</p>
        </div>
      </div>

      <!-- Controls -->
      <div class="px-5 py-4 border-b border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">เลือกปี</label>
            <select 
              v-model="selectedYear" 
              @change="onYearChange"
              :disabled="availableYears.length === 0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer appearance-none bg-white bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20stroke=%27%236b7280%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%271.5%27%20d=%27M6%208l4%204%204-4%27/%3e%3c/svg%3e')] bg-[length:1.25em_1.25em] bg-[right_0.5rem_center] bg-no-repeat pr-10 hover:border-gray-400 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option v-if="availableYears.length === 0" :value="null">ไม่มีข้อมูลปี</option>
              <option v-for="year in availableYears" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">เลือกบริษัท</label>
            <select 
              v-model="selectedArea" 
              @change="onAreaChange"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer appearance-none bg-white bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20stroke=%27%236b7280%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%271.5%27%20d=%27M6%208l4%204%204-4%27/%3e%3c/svg%3e')] bg-[length:1.25em_1.25em] bg-[right_0.5rem_center] bg-no-repeat pr-10 hover:border-gray-400 transition-all"
            >
              <option value="combined">บริษัททั้งหมด</option>
              <option v-for="area in areas" :key="area.id" :value="area.id">
                {{ area.name }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ช่วงเวลา</label>
            <select 
              v-model="selectedTimeframe" 
              @change="onTimeframeChange"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer appearance-none bg-white bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20stroke=%27%236b7280%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%271.5%27%20d=%27M6%208l4%204%204-4%27/%3e%3c/svg%3e')] bg-[length:1.25em_1.25em] bg-[right_0.5rem_center] bg-no-repeat pr-10 hover:border-gray-400 transition-all"
            >
              <option value="comparison">เปรียบเทียบ (ปัจจุบัน vs อนาคต)</option>
              <option value="current">ปัจจุบัน</option>
              <option value="future">อนาคต</option>
            </select>
          </div>
        </div>

        <!-- Summary -->
        <div class="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
          <span class="font-medium">กำลังแสดง:</span>
          <span class="ml-2 font-semibold text-blue-800">ปี {{ selectedYear || 'N/A' }}</span>
          <span class="mx-2">•</span>
          <span class="ml-1">{{ selectedAreaName }}</span>
          <span class="mx-2">•</span>
          <span>{{ selectedTimeframeLabel }}</span>
        </div>
      </div>

      <!-- Chart -->
      <div class="px-5 py-5">
        <div :class="selectedTimeframe === 'comparison' ? 'h-[500px]' : 'h-[450px]'">
          <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
        </div>
      </div>

      <!-- Info for comparison mode -->
      <div v-if="selectedTimeframe === 'comparison'" class="px-5 pb-5">
        <div class="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p class="text-sm text-blue-900">
            <span class="font-medium">คำแนะนำ:</span> 
            แท่งซ้าย (สีเข้ม) = ข้อมูลปัจจุบัน • แท่งขวา (สีอ่อน) = ข้อมูลคาดการณ์อนาคต
          </p>
        </div>
      </div>
       <!-- Categories Display Below Chart -->
      <div v-if="categories.length > 0" class="px-5 pb-5 border-t border-gray-200">
        <div class="mt-5">
          <h4 class="text-sm font-bold text-gray-800 mb-3">📋 หมวดหมู่คำถาม</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div 
              v-for="(category, index) in categories" 
              :key="category.id"
              class="p-3 border border-gray-200 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div class="flex items-start">
                <span class="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-white text-xs font-semibold mr-3 flex-shrink-0">
                  {{ index + 1 }}
                </span>
                <div class="flex-1">
                  <h5 class="text-sm font-medium text-gray-900">{{ category.name }}</h5>
                  <p class="text-xs text-gray-600 mt-1">คำถาม: {{ category.questionCount }} ข้อ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ChartDataLabels);

// =======================================
// API Configuration
// =======================================
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// =======================================
// State Management
// =======================================
const loading = ref(false);
const error = ref(null);

const availableYears = ref([]);
const areas = ref([]);
const categories = ref([]);
const chartDataRaw = ref(null);

const selectedYear = ref(null);
const selectedArea = ref('combined');
const selectedTimeframe = ref('comparison');

const levelLabels = ['ระดับ 1', 'ระดับ 2', 'ระดับ 3', 'ระดับ 4', 'ระดับ 5'];

// สีแบบเดียวกับ StackedBar.vue
const colors = ['#7B341E', '#E53E3E', '#ED8936', '#ECC94B', '#38A169'];
const colorsLight = ['#B5826F', '#fca5a5', '#fdba74', '#fde68a', '#86efac'];

// =======================================
// API Functions
// =======================================

// Fetch available assessment years
const fetchYears = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/assessment-years`);
    if (!response.ok) throw new Error('Failed to fetch years');
    const data = await response.json();
    availableYears.value = data;
    if (data.length > 0) {
      selectedYear.value = data[0]; // Default to the most recent year
    }
  } catch (err) {
    console.error('Error fetching years:', err);
    throw err;
  }
};

// Fetch areas/companies list
const fetchAreas = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/companies`);
    if (!response.ok) throw new Error('Failed to fetch areas');
    const data = await response.json();
    areas.value = data;
  } catch (err) {
    console.error('Error fetching areas:', err);
    throw err;
  }
};

// Fetch stacked chart data
const fetchChartData = async (year, areaId, timeframe) => {
  if (!year) {
    chartDataRaw.value = null; // Clear data if no year is selected
    return;
  }
  
  // แสดง loading overlay เฉพาะตอนไม่มีข้อมูลเลย
  const showLoading = !chartDataRaw.value;
  if (showLoading) loading.value = true;
  
  try {
    const params = new URLSearchParams({
      areaId: areaId || 'combined',
      timeframe: timeframe || 'comparison',
      year: year
    });
    
    const response = await fetch(`${API_BASE_URL}/analytics/stacked-chart-data?${params}`);
    if (!response.ok) throw new Error('Failed to fetch chart data');
    const data = await response.json();
    chartDataRaw.value = data;
    
    // อัปเดต categories จากข้อมูล API
    if (data.categories) {
      categories.value = data.categories;
    }
  } catch (err) {
    console.error('Error fetching chart data:', err);
    chartDataRaw.value = null; // Clear data on error
    throw err;
  } finally {
    if (showLoading) loading.value = false;
  }
};
// Fetch all data
const fetchData = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    await Promise.all([
      fetchYears(),
      fetchAreas()
    ]);
    
    await fetchChartData(selectedYear.value, selectedArea.value, selectedTimeframe.value);
  } catch (err) {
    error.value = 'เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง';
  } finally {
    loading.value = false;
  }
};

// =======================================
// Computed Properties
// =======================================

const selectedAreaName = computed(() => {
  if (selectedArea.value === 'combined') return 'บริษัททั้งหมด';
  const area = areas.value.find(a => a.id === selectedArea.value);
  return area ? area.name : '';
});

const selectedTimeframeLabel = computed(() => {
  const labels = {
    'comparison': 'เปรียบเทียบ (ปัจจุบัน vs อนาคต)',
    'current': 'ข้อมูลปัจจุบัน',
    'future': 'ข้อมูลคาดการณ์อนาคต'
  };
  return labels[selectedTimeframe.value];
});

const chartData = computed(() => {
  if (!chartDataRaw.value) return null;

  const { current, future, categories: categoriesList } = chartDataRaw.value;

  // If there are no categories, return null
  if (!categoriesList || categoriesList.length === 0) return null;
  
  // รวมข้อมูลแต่ละหมวดหมู่ (รวมคำถามทั้งหมดของแต่ละหมวดให้เป็นค่าเดียว)
  const categoryLabels = categoriesList.map(cat => cat.name);
  
  // รวมข้อมูล current สำหรับแต่ละหมวดหมู่
  const aggregatedCurrent = [[], [], [], [], []];
  const aggregatedFuture = [[], [], [], [], []];
  let questionIndex = 0;

  categoriesList.forEach(category => {
    for (let level = 0; level < 5; level++) {
      let categorySum = 0;
      for (let q = 0; q < category.questionCount; q++) {
        if (current[level] && current[level][questionIndex + q]) {
          categorySum += current[level][questionIndex + q];
        }
      }
      aggregatedCurrent[level].push(categorySum);
    }
    questionIndex += category.questionCount;
  });

  questionIndex = 0;
  categoriesList.forEach(category => {
    for (let level = 0; level < 5; level++) {
      let categorySum = 0;
      for (let q = 0; q < category.questionCount; q++) {
        if (future[level] && future[level][questionIndex + q]) {
          categorySum += future[level][questionIndex + q];
        }
      }
      aggregatedFuture[level].push(categorySum);
    }
    questionIndex += category.questionCount;
  });

  // สร้าง datasets ตามช่วงเวลา
  if (selectedTimeframe.value === 'comparison') {
    const currentTotalPerCategory = categoryLabels.map((_, j) =>
      aggregatedCurrent.reduce((sum, level) => sum + level[j], 0)
    );
    
    const futureTotalPerCategory = categoryLabels.map((_, j) =>
      aggregatedFuture.reduce((sum, level) => sum + level[j], 0)
    );

    const currentDatasets = aggregatedCurrent.map((data, i) => {
      return {
        label: `${levelLabels[i]}`,
        data: data.map((v, j) => currentTotalPerCategory[j] ? (v * 100 / currentTotalPerCategory[j]) : 0),
        rawData: data,
        totalPerCategory: currentTotalPerCategory,
        backgroundColor: colors[i],
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 3,
        borderWidth: 1,
        stack: 'current',
        barThickness: 17
      };
    });

    const futureDatasets = aggregatedFuture.map((data, i) => {
      return {
        label: `${levelLabels[i]}`,
        data: data.map((v, j) => futureTotalPerCategory[j] ? (v * 100 / futureTotalPerCategory[j]) : 0),
        rawData: data,
        totalPerCategory: futureTotalPerCategory,
        backgroundColor: colorsLight[i],
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 3,
        borderWidth: 1,
        stack: 'future',
        barThickness: 17
      };
    });

    return {
      labels: categoryLabels,
      datasets: [...currentDatasets, ...futureDatasets]
    };
  } else {
    const selectedData = selectedTimeframe.value === 'current' ? aggregatedCurrent : aggregatedFuture;
    const totalPerCategory = categoryLabels.map((_, j) =>
      selectedData.reduce((sum, level) => sum + level[j], 0)
    );

    return {
      labels: categoryLabels,
      datasets: selectedData.map((data, i) => {
        return {
          label: levelLabels[i],
          data: data.map((v, j) => totalPerCategory[j] ? (v * 100 / totalPerCategory[j]) : 0),
          rawData: data,
          totalPerCategory: totalPerCategory,
          backgroundColor: colors[i],
          borderColor: 'rgba(255, 255, 255, 0.3)',
          borderWidth: 1,
          borderRadius: 3,
          stack: 'stack1',
          barThickness: 'flex',
          maxBarThickness: 60,
          minBarLength: 2
        };
      })
    };
  }
});

const chartOptions = computed(() => {
  const isComparison = selectedTimeframe.value === 'comparison';
  
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        stacked: true,
        categoryPercentage: 0.75,
        barPercentage: 0.9,
        grid: { 
          display: false
        },
        ticks: { 
          font: { 
            size: 10,
            family: 'inherit'
          }, 
          color: '#6B7280',
          maxRotation: 45,
          minRotation: 45,
          autoSkip: false,
          callback: function(value) {
            const label = this.getLabelForValue(value);
            if (label.length > 20) {
              return label.substring(0, 20) + '...';
            }
            return label;
          }
        },
        border: {
          display: true,
          color: '#E5E7EB'
        }
      },
      y: {
        stacked: true,
        display: false,
        min: 0,
        max: 100,
        ticks: {
          display: false
        },
        grid: {
          display: false
        }
      }
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
          font: { 
            size: 11,
            family: 'inherit'
          },
          color: '#1f2937',
          usePointStyle: false,
          generateLabels: (chart) => {
            if (!isComparison) {
              return chart.data.datasets.map((dataset, i) => ({
                text: dataset.label,
                fillStyle: dataset.backgroundColor,
                hidden: dataset.hidden,
                index: i
              }));
            }
            
            const labels = [];
            
            // ระดับ 1-5 ปัจจุบัน
            for (let i = 0; i < 5; i++) {
              const dataset = chart.data.datasets[i];
              labels.push({
                text: `ระดับ ${i + 1} (ปัจจุบัน)`,
                fillStyle: colors[i],
                strokeStyle: colors[i],
                lineWidth: dataset?.hidden ? 2 : 0,
                hidden: dataset?.hidden || false,
                index: i,
                datasetIndex: i
              });
            }
            
            // ระดับ 1-5 อนาคต
            for (let i = 0; i < 5; i++) {
              const dataset = chart.data.datasets[i + 5];
              labels.push({
                text: `ระดับ ${i + 1} (อนาคต)`,
                fillStyle: colorsLight[i],
                strokeStyle: colorsLight[i],
                lineWidth: dataset?.hidden ? 2 : 0,
                hidden: dataset?.hidden || false,
                index: i + 5,
                datasetIndex: i + 5
              });
            }
            
            return labels;
          }
        },
        onClick: (e, legendItem, legend) => {
          if (legendItem.datasetIndex !== undefined) {
            const chart = legend.chart;
            const datasetIndex = legendItem.datasetIndex;
            
            if (chart.data.datasets[datasetIndex]) {
              chart.data.datasets[datasetIndex].hidden = !chart.data.datasets[datasetIndex].hidden;
            }
            
            chart.update();
          }
        }
      },
      datalabels: {
        display: ctx => {
          const rawValue = ctx.dataset.rawData[ctx.dataIndex];
          return rawValue > 0;
        },
        color: (context) => {
          const datasetIndex = context.datasetIndex;
          if (isComparison && datasetIndex >= 5) {
            return '#000000';
          }
          return '#ffffff';
        },
        font: { 
          size: isComparison ? 10 : 12, 
          weight: '900',
          family: 'inherit'
        },
        formatter: (_, ctx) => {
          return ctx.dataset.rawData[ctx.dataIndex];
        },
        anchor: 'center',
        align: 'center',
        textShadowColor: (context) => {
          const datasetIndex = context.datasetIndex;
          if (isComparison && datasetIndex >= 5) {
            return 'transparent';
          }
          return 'rgba(0, 0, 0, 0.5)';
        },
        textShadowBlur: (context) => {
          const datasetIndex = context.datasetIndex;
          if (isComparison && datasetIndex >= 5) {
            return 0;
          }
          return 3;
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        titleColor: '#fff',
        bodyColor: '#fff',
        titleFont: {
          size: 12,
          weight: 'bold'
        },
        bodyFont: {
          size: 11
        },
        padding: 10,
        cornerRadius: 6,
        displayColors: true,
        boxWidth: 10,
        boxHeight: 10,
        callbacks: {
          title: (items) => {
            if (isComparison && items.length > 0) {
              const stack = items[0].dataset.stack;
              const period = stack === 'current' ? 'ปัจจุบัน' : 'อนาคต';
              return `${items[0].label} (${period})`;
            }
            return items[0]?.label || '';
          },
          label: ctx => {
            const levelLabel = ctx.dataset.label;
            const rawValue = ctx.dataset.rawData[ctx.dataIndex];
            const percentage = ctx.parsed.y.toFixed(2);
            const total = ctx.dataset.totalPerCategory[ctx.dataIndex];
            return `${levelLabel}: ${rawValue} รายการ (${percentage}%) จากทั้งหมด ${total}`;
          }
        }
      }
    }
  };
});

// =======================================
// Methods
// =======================================
const onYearChange = async () => {
  error.value = null;
  try {
    await fetchChartData(selectedYear.value, selectedArea.value, selectedTimeframe.value);
  } catch (err) {
    error.value = 'เกิดข้อผิดพลาดในการโหลดข้อมูลสำหรับปีที่เลือก';
  }
};

const onAreaChange = async () => {
  try {
    await fetchChartData(selectedYear.value, selectedArea.value, selectedTimeframe.value);
  } catch (err) {
    error.value = 'เกิดข้อผิดพลาดในการโหลดข้อมูล';
  }
};

const onTimeframeChange = async () => {
  try {
    await fetchChartData(selectedYear.value, selectedArea.value, selectedTimeframe.value);
  } catch (err) {
    error.value = 'เกิดข้อผิดพลาดในการโหลดข้อมูล';
  }
};

// =======================================
// Lifecycle Hooks
// =======================================

onMounted(() => {
  fetchData();
});
</script>