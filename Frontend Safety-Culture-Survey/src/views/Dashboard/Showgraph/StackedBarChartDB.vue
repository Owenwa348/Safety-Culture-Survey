<template>
  <div class="bg-white border border-gray-200 rounded-lg shadow-sm">
    <!-- Header -->
    <div class="border-b border-gray-100 px-6 py-4">
      <h3 class="text-xl font-semibold text-gray-900">Stacked Bar Chart</h3>
      <p class="text-sm text-gray-600 mt-1">การวิเคราะห์การกระจายตัวของข้อมูลตามระดับ</p>
    </div>

    <!-- Controls -->
    <div class="px-6 py-4 bg-gray-50 border-b border-gray-100">
      <div class="flex items-center space-x-3">
        <label class="text-sm font-medium text-gray-700">เลือกพื้นที่:</label>
        <select 
          v-model="selectedVersion" 
          class="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          <option value="combined">verte group</option>
          <option value="v1">verte smart solution</option>
          <option value="v2">verte security</option>
        </select>
      </div>
    </div>

    <!-- Summary -->
    <div class="px-6 py-4 bg-gray-50 border-b border-gray-100">
      <div class="flex flex-wrap gap-4">
        <div v-for="(dataset, i) in chartData.datasets" :key="i" class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-sm" :style="{ backgroundColor: dataset.backgroundColor }"></div>
          <span class="text-sm font-medium text-gray-700">{{ dataset.label }}</span>
          <span class="text-sm text-gray-500">{{ dataset.total }} รายการ</span>
        </div>
      </div>
    </div>

    <!-- Chart -->
    <div class="px-6 py-6">
      <div class="h-96">
        <Bar :data="chartData" :options="chartOptions" />
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

const levelLabels = ['ระดับ 1', 'ระดับ 2', 'ระดับ 3', 'ระดับ 4', 'ระดับ 5'];
const chartLabels = [
  'A:Comms with workforce', 'B:Commitment level of w/f', 'C:Rewards of good HSE', 'D:Who causes accidents',
  'E:Profit & HSE', 'F:Contractor management', 'G:Competency & training', 'H:Size of HSE Dept.',
  'I:Work planning', 'J:Worksite safety management', 'K:Purpose of procedures', 'L:Incident reporting',
  'M:Hazard reporting', 'N:What after accident', 'O:Who checks HSE day-day',
  'P:How HSE meetings feel', 'Q:Audits & reviews', 'R:Benchmarking'
];

const rawDataV1 = [
  [10, 10, 10, 60, 40, 30, 10, 50, 40, 60, 70, 80, 30, 40, 50, 70, 60, 50],
  [20, 10, 30, 50, 10, 80, 50, 10, 10, 10, 20, 20, 10, 20, 20, 10, 40, 30],
  [20, 25, 30, 18, 15, 20, 25, 25, 18, 20, 28, 26, 21, 25, 26, 24, 10, 10],
  [25, 20, 5, 28, 30, 25, 15, 22, 35, 28, 20, 25, 25, 20, 30, 28, 10, 10],
  [10, 7, 10, 10, 12, 5, 20, 10, 8, 15, 12, 9, 18, 15, 5, 8, 10, 10]
];

const rawDataV2 = [
  [8, 4, 7, 3, 3, 4, 8, 5, 5, 4, 6, 6, 3, 3, 4, 6, 5, 5],
  [1, 1, 2, 4, 1, 6, 5, 1, 1, 1, 1, 1, 1, 2, 3, 1, 2, 2],
  [18, 20, 25, 15, 12, 20, 22, 20, 17, 20, 25, 23, 19, 22, 23, 20, 10, 10],
  [20, 18, 4, 22, 25, 22, 12, 20, 30, 22, 18, 22, 22, 18, 28, 22, 10, 10],
  [8, 6, 8, 9, 10, 4, 18, 8, 7, 12, 10, 8, 15, 13, 4, 7, 8, 8]
];

const selectedVersion = ref('combined');
const colors = ['#7B341E', '#dc2626', '#f97316', '#fbbf24', '#10b981'];

const chartData = computed(() => {
  let selectedData;
  if (selectedVersion.value === 'v1') {
    selectedData = rawDataV1;
  } else if (selectedVersion.value === 'v2') {
    selectedData = rawDataV2;
  } else {
    selectedData = rawDataV1.map((row, i) =>
      row.map((v, j) => v + (rawDataV2[i]?.[j] ?? 0))
    );
  }

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
        borderRadius: 2,
      };
    })
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true,
      grid: { display: false },
      ticks: { 
        font: { size: 11, weight: '500' }, 
        color: '#374151',
        maxRotation: 45,
        minRotation: 20
      }
    },
    y: {
      stacked: true,
      display: false,
      
    }
  },
  plugins: {
    datalabels: {
      display: ctx => ctx.dataset.raw[ctx.dataIndex] > 0,
      color: '#fff',
      font: { size: 10, weight: 'bold' },
      formatter: (_, ctx) => ctx.dataset.raw[ctx.dataIndex],
      anchor: 'center',
      align: 'center'
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      cornerRadius: 4,
      callbacks: {
        label: ctx => `${ctx.dataset.label}: ${ctx.raw}% (${ctx.dataset.raw[ctx.dataIndex]} รายการ)`
      }
    },
    legend: { display: false }
  },
  interaction: {
    mode: 'index',
    intersect: false
  }
};
</script>

<style scoped>
select:focus {
  outline: none;
}
</style>