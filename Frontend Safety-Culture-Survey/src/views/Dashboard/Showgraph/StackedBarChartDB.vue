<!-- StackedBarChartDB.vue -->
<template>
  <div class="bg-white rounded-lg shadow">
    <!-- Header -->
    <div class="border-b border-gray-200 px-5 py-4">
      <h3 class="text-lg font-bold text-gray-800">กราฟผลการประเมินรายข้อ (บริษัท)</h3>
      <p class="text-sm text-gray-600 mt-1">การวิเคราะห์การกระจายตัวของข้อมูลตามระดับแต่ละข้อ</p>
    </div>

    <!-- Controls -->
    <div class="px-5 py-4 border-b border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">เลือกพื้นที่</label>
          <select 
            v-model="selectedArea" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option v-for="area in areas" :key="area.id" :value="area.id">
              {{ area.name }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">ช่วงเวลา</label>
          <select 
            v-model="selectedTimeframe" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        <span class="ml-2">{{ selectedAreaName }}</span>
        <span class="mx-2">•</span>
        <span>{{ selectedTimeframeLabel }}</span>
      </div>
    </div>

    <!-- Chart -->
    <div class="px-5 py-5">
      <div :class="selectedTimeframe === 'comparison' ? 'h-[600px]' : 'h-[500px]'">
        <Bar :data="chartData" :options="chartOptions" />
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
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

// Mock data
const areas = ref([
  { id: 'combined', name: 'Verte Group' },
  { id: 'area1', name: 'Verte Smart Solution' },
  { id: 'area2', name: 'Verte Security' }
]);

const levelLabels = ['ระดับ 1', 'ระดับ 2', 'ระดับ 3', 'ระดับ 4', 'ระดับ 5'];
const chartLabels = [
  'A:Comms with workforce', 'B:Commitment level of w/f', 'C:Rewards of good HSE', 'D:Who causes accidents',
  'E:Profit & HSE', 'F:Contractor management', 'G:Competency & training', 'H:Size of HSE Dept.',
  'I:Work planning', 'J:Worksite safety management', 'K:Purpose of procedures', 'L:Incident reporting',
  'M:Hazard reporting', 'N:What after accident', 'O:Who checks HSE day-day',
  'P:How HSE meetings feel', 'Q:Audits & reviews', 'R:Benchmarking',
];

// ข้อมูลปัจจุบัน - Verte Smart Solution
const currentDataArea1 = [
  [10, 10, 10, 60, 40, 30, 10, 50, 40, 60, 70, 80, 30, 40, 50, 70, 60, 50],
  [20, 10, 30, 50, 10, 80, 50, 10, 10, 10, 20, 20, 10, 20, 20, 10, 40, 30],
  [20, 25, 30, 18, 15, 20, 25, 25, 18, 20, 28, 26, 21, 25, 26, 24, 10, 10],
  [25, 20, 5, 28, 30, 25, 15, 22, 35, 28, 20, 25, 25, 20, 30, 28, 10, 10],
  [10, 7, 10, 10, 12, 5, 20, 10, 8, 15, 12, 9, 18, 15, 5, 8, 10, 10]
];

// ข้อมูลปัจจุบัน - Verte Security
const currentDataArea2 = [
  [8, 4, 7, 3, 3, 4, 8, 5, 5, 4, 6, 6, 3, 3, 4, 6, 5, 5],
  [1, 1, 2, 4, 1, 6, 5, 1, 1, 1, 1, 1, 1, 2, 3, 1, 2, 2],
  [18, 20, 25, 15, 12, 20, 22, 20, 17, 20, 25, 23, 19, 22, 23, 20, 10, 10],
  [20, 18, 4, 22, 25, 22, 12, 20, 30, 22, 18, 22, 22, 18, 28, 22, 10, 10],
  [8, 6, 8, 9, 10, 4, 18, 8, 7, 12, 10, 8, 15, 13, 4, 7, 8, 8]
];

// ข้อมูลอนาคต - Verte Smart Solution
const futureDataArea1 = [
  [8, 8, 8, 45, 30, 22, 8, 38, 30, 45, 52, 60, 22, 30, 38, 52, 45, 38],
  [15, 8, 22, 38, 8, 60, 38, 8, 8, 8, 15, 15, 8, 15, 15, 8, 30, 22],
  [25, 30, 35, 22, 18, 25, 30, 30, 22, 25, 33, 31, 26, 30, 31, 29, 15, 15],
  [35, 30, 8, 38, 40, 35, 22, 32, 45, 38, 30, 35, 35, 30, 40, 38, 18, 18],
  [18, 15, 18, 18, 22, 12, 32, 18, 15, 25, 22, 18, 28, 25, 12, 15, 18, 18]
];

// ข้อมูลอนาคต - Verte Security
const futureDataArea2 = [
  [6, 3, 5, 2, 2, 3, 6, 4, 4, 3, 4, 4, 2, 2, 3, 4, 4, 4],
  [1, 1, 1, 3, 1, 4, 4, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1],
  [25, 28, 35, 22, 18, 28, 32, 28, 25, 28, 35, 33, 28, 32, 33, 28, 18, 18],
  [28, 26, 6, 32, 35, 32, 18, 28, 42, 32, 26, 32, 32, 26, 40, 32, 18, 18],
  [15, 12, 15, 18, 20, 8, 32, 15, 12, 22, 20, 15, 28, 25, 8, 12, 15, 15]
];

const selectedArea = ref('combined');
const selectedTimeframe = ref('comparison');

// สีแบบเดียวกับ StackedBar.vue
const colors = ['#7B341E', '#E53E3E', '#ED8936', '#ECC94B', '#38A169'];
const colorsLight = ['#B5826F', '#fca5a5', '#fdba74', '#fde68a', '#86efac'];

const selectedAreaName = computed(() => {
  return areas.value.find(a => a.id === selectedArea.value)?.name || '';
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
  let currentData, futureData;
  
  // เลือกข้อมูลตามพื้นที่
  if (selectedArea.value === 'area1') {
    currentData = currentDataArea1;
    futureData = futureDataArea1;
  } else if (selectedArea.value === 'area2') {
    currentData = currentDataArea2;
    futureData = futureDataArea2;
  } else {
    currentData = currentDataArea1.map((row, i) =>
      row.map((v, j) => v + (currentDataArea2[i]?.[j] ?? 0))
    );
    futureData = futureDataArea1.map((row, i) =>
      row.map((v, j) => v + (futureDataArea2[i]?.[j] ?? 0))
    );
  }

  // สร้าง datasets ตามช่วงเวลา
  if (selectedTimeframe.value === 'comparison') {
    const currentTotalPerCategory = chartLabels.map((_, j) =>
      currentData.reduce((sum, level) => sum + level[j], 0)
    );
    
    const futureTotalPerCategory = chartLabels.map((_, j) =>
      futureData.reduce((sum, level) => sum + level[j], 0)
    );

    const currentDatasets = currentData.map((data, i) => {
      const total = data.reduce((sum, v) => sum + v, 0);
      return {
        label: `${levelLabels[i]}`,
        data: data.map((v, j) => currentTotalPerCategory[j] ? +(v * 100 / currentTotalPerCategory[j]).toFixed(2) : 0),
        raw: data,
        total,
        backgroundColor: colors[i],
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 3,
        borderWidth: 1,
        stack: 'current',
        barThickness: 25,
        barPercentage: 0.9,
        categoryPercentage: 0.8
      };
    });

    const futureDatasets = futureData.map((data, i) => {
      const total = data.reduce((sum, v) => sum + v, 0);
      return {
        label: `${levelLabels[i]}`,
        data: data.map((v, j) => futureTotalPerCategory[j] ? +(v * 100 / futureTotalPerCategory[j]).toFixed(2) : 0),
        raw: data,
        total,
        backgroundColor: colorsLight[i],
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 3,
        borderWidth: 1,
        stack: 'future',
        barThickness: 25,
        barPercentage: 0.9,
        categoryPercentage: 0.8
      };
    });

    return {
      labels: chartLabels,
      datasets: [...currentDatasets, ...futureDatasets]
    };
  } else {
    const selectedData = selectedTimeframe.value === 'current' ? currentData : futureData;
    const totalPerCategory = chartLabels.map((_, j) =>
      selectedData.reduce((sum, level) => sum + level[j], 0)
    );

    return {
      labels: chartLabels,
      datasets: selectedData.map((data, i) => {
        const total = data.reduce((sum, v) => sum + v, 0);
        return {
          label: levelLabels[i],
          data: data.map((v, j) => totalPerCategory[j] ? +(v * 100 / totalPerCategory[j]).toFixed(2) : 0),
          raw: data,
          total,
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
          autoSkip: false
        },
        border: {
          display: true,
          color: '#E5E7EB'
        },
        barPercentage: isComparison ? 0.8 : 0.95,
        categoryPercentage: isComparison ? 0.8 : 0.85
      },
      y: {
        stacked: true,
        display: false,
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
            
            // ซ่อน/แสดงเฉพาะ dataset ที่คลิก
            if (chart.data.datasets[datasetIndex]) {
              chart.data.datasets[datasetIndex].hidden = !chart.data.datasets[datasetIndex].hidden;
            }
            
            chart.update();
          }
        }
      },
      datalabels: {
        display: ctx => {
          const value = ctx.dataset.raw[ctx.dataIndex];
          return value > 0;
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
        formatter: (_, ctx) => ctx.dataset.raw[ctx.dataIndex],
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
            const percentage = ctx.parsed.y.toFixed(2);
            const count = ctx.dataset.raw[ctx.dataIndex];
            return `${levelLabel}: ${percentage}% (${count} รายการ)`;
          }
        }
      }
    }
  };
});
</script>

<style scoped>
select {
  transition: all 0.2s ease;
}
</style>