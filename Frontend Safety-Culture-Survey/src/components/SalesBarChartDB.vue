<script setup>
import { ref, computed } from 'vue';
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

const chartLabels = [
  'Leadership & Commitment',
  'Policy & Strategic Objectives',
  'Organization Resource & Documentation',
  'Evaluation & Risk Management',
  'Implementation & Operation Control',
  'Monitoring & Measurement',
  'Audit & Review',
  'AVG',
];

const rawData = {
  'EVP': {
    v1: [4.40, 4.30, 4.10, 3.90, 4.40, 4.00, 3.90, 4.14],
    v2: [4.48, 4.36, 4.24, 4.10, 4.60, 4.28, 4.10, 4.28]
  },
  'SVP/VP': {
    v1: [4.05, 4.00, 3.90, 3.80, 4.40, 3.95, 3.70, 3.97],
    v2: [4.17, 4.24, 4.14, 4.14, 4.58, 4.13, 3.98, 4.15]
  },
  'DM': {
    v1: [4.08, 3.95, 4.06, 4.07, 4.30, 4.05, 3.85, 4.05],
    v2: [4.18, 4.07, 4.22, 4.21, 4.38, 4.17, 3.94, 4.11]
  }
};

const selectedVersion = ref("combined");
const selectedGroup = ref("all");
const individualGroup = ref("EVP");

const colors = {
  'EVP': '#1e40af',
  'SVP/VP': '#059669',
  'DM': '#dc2626',
  'all': '#7c3aed'
};

const chartData = computed(() => {
  const datasets = [];

  if (selectedVersion.value === "combined") {
    const totalGroups = Object.keys(rawData).length;
    const data = chartLabels.map((_, i) => {
      let sum = 0;
      for (const group in rawData) { // วนลูปผ่านแต่ละกลุ่ม
        const v1 = rawData[group].v1[i];
        const v2 = rawData[group].v2[i];
        const avg = (v1 + v2) / 2; // คำนวณค่าเฉลี่ยของ V1 และ V2
        sum += avg;
      }
      return sum / totalGroups;
    });

    datasets.push({
      label: 'รวมทุกกลุ่ม (V1+V2)',
      backgroundColor: colors.all,
      data,
    });
  } else if (selectedGroup.value === "all") {
    for (const group in rawData) {
      const v1 = rawData[group].v1;
      const v2 = rawData[group].v2;
      const data = selectedVersion.value === 'v1' ? v1 : v2;

      datasets.push({
        label: `${group} (${selectedVersion.value.toUpperCase()})`,
        backgroundColor: colors[group],
        data,
      });
    }
  } else {
    const group = individualGroup.value;
    const v1 = rawData[group].v1;
    const v2 = rawData[group].v2;
    const data = selectedVersion.value === 'v1' ? v1 : v2;

    datasets.push({
      label: `${group} (${selectedVersion.value.toUpperCase()})`,
      backgroundColor: colors[group],
      data,
    });
  }

  return { labels: chartLabels, datasets };
});

// Helper methods for table
const getShortLabel = (label, index) => {
  const shortLabels = [
    'L&C',     // Leadership & Commitment
    'P&SO',    // Policy & Strategic Objectives
    'ORD',     // Organization Resource & Documentation
    'E&RM',    // Evaluation & Risk Management
    'I&OC',    // Implementation & Operation Control
    'M&M',     // Monitoring & Measurement
    'A&R',     // Audit & Review
    'AVG'      // AVG
  ];
  return shortLabels[index] || label;
};

const formatScore = (score) => {
  return typeof score === 'number' ? score.toFixed(2) : '0.00';
};

const getScoreClass = (score) => {
  if (score >= 4.5) return 'text-green-700 bg-green-50';
  if (score >= 4.0) return 'text-blue-700 bg-blue-50';
  if (score >= 3.5) return 'text-yellow-700 bg-yellow-50';
  return 'text-red-700 bg-red-50';
};


const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { 
      position: 'top',
      labels: {
        font: { size: 12, weight: '500' },
        padding: 16,
        usePointStyle: true,
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      cornerRadius: 4,
      callbacks: {
        label: context => `${context.dataset.label}: ${context.parsed.y.toFixed(2)}`
      }
    },
    datalabels: { display: false } // ปิดการแสดงผล datalabels
  },
  scales: {
    y: {
      suggestedMin: 3.4,
      suggestedMax: 4.8,
      title: { 
        display: true, 
        text: 'คะแนนเฉลี่ย',
        font: { size: 13, weight: '500' }
      },
      ticks: {
        stepSize: 0.2,
        callback: val => val.toFixed(1),
      },
      grid: { color: 'rgba(0, 0, 0, 0.05)' }
    },
    x: {
      ticks: {
        
        maxRotation: 45,
        minRotation: 20,
        font: { size: 11 }
      },
      grid: { display: false }
    }
  },
  elements: {
    bar: {
      borderSkipped: false,
      borderRadius: 2
    }
  }
};
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg shadow-sm">
    <!-- Header -->
    <div class="border-b border-gray-100 px-6 py-4">
      <h3 class="text-xl font-semibold text-gray-900">ผลการประเมินบริษัท verte group ใน ปี 2025</h3>
      <p class="text-sm text-gray-600 mt-1">การวิเคราะห์ผลการประเมิน บริษัท verte group ตามตำแหน่งและพื้นที่</p>
    </div>

<div class="px-6 py-4 bg-gray-50 border-b border-gray-100">
  <div class="flex flex-wrap items-center gap-6">
    <!-- พื้นที่ -->
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
</div>

    <!-- Chart -->
    <div class="px-6 py-6">
      <div class="h-96">
        <Bar :data="chartData" :options="chartOptions" />
      </div>
    </div>

    <!-- Table -->
    <div class="px-6 pb-6">
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <div class="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h4 class="text-sm font-semibold text-gray-900">ตารางข้อมูลรายละเอียด</h4>
          <p class="text-xs text-gray-600 mt-1">
            แสดงคะแนนเฉลี่ย: 
            <span v-if="selectedVersion === 'combined'">รวมทุกพื้นที่ (V1+V2)</span>
            <span v-else-if="selectedGroup === 'all'">ทุกกลุ่มใน {{ selectedVersion === 'v1' ? 'verte smart solution' : 'verte security' }}</span>
            <span v-else>กลุ่ม {{ individualGroup }} ใน {{ selectedVersion === 'v1' ? 'verte smart solution' : 'verte security' }}</span>
          </p>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  กลุ่ม/ตำแหน่ง
                </th>
                <th 
                  v-for="(label, index) in chartLabels" 
                  :key="index" 
                  class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  :title="label"
                >
                  <div class="truncate max-w-20">
                    {{ getShortLabel(label, index) }}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr 
                v-for="(dataset, index) in chartData.datasets" 
                :key="index" 
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="px-4 py-3 text-sm font-medium text-gray-900">
                  <div class="flex items-center">
                    <div 
                      class="w-3 h-3 rounded-full mr-2 flex-shrink-0" 
                      :style="{ backgroundColor: dataset.backgroundColor }"
                    ></div>
                    <span class="truncate">{{ dataset.label }}</span>
                  </div>
                </td>
                <td 
                  v-for="(score, scoreIndex) in dataset.data" 
                  :key="scoreIndex" 
                  class="px-3 py-3 text-sm text-center"
                  :class="getScoreClass(score)"
                >
                  <span class="font-medium">{{ formatScore(score) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Summary Statistics -->
        <div class="bg-gray-50 px-4 py-3 border-t border-gray-200">
          <div class="flex flex-wrap items-center justify-between text-xs text-gray-600">
            <div class="flex items-center space-x-4">
              <span>จำนวนกลุ่ม: <strong>{{ chartData.datasets.length }}</strong></span>
              <span>จำนวนหมวดหมู่: <strong>{{ chartLabels.length }}</strong></span>
            </div>
            <div class="flex items-center space-x-4 mt-2 sm:mt-0">
              <div class="flex items-center space-x-1">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>ดีเยี่ยม (≥4.5)</span>
              </div>
              <div class="flex items-center space-x-1">
                <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>ดี (4.0-4.49)</span>
              </div>
              <div class="flex items-center space-x-1">
                <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span>ปานกลาง (3.5-3.99)</span>
              </div>
              <div class="flex items-center space-x-1">
                <div class="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>ต้องพัฒนา (3.5)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
select:focus {
  outline: none;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f9fafb;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>