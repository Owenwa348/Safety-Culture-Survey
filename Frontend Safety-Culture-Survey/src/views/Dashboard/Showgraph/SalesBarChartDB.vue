<template>
  <div class="bg-white border border-gray-200 rounded-lg shadow-sm">
    <!-- Header -->
    <div class="border-b border-gray-100 px-6 py-4">
      <h3 class="text-xl font-semibold text-gray-900">ผลการประเมินบริษัท Verte Group ใน ปี 2025</h3>
      <p class="text-sm text-gray-600 mt-1">การวิเคราะห์ผลการประเมิน บริษัท Verte Group ตามตำแหน่งและพื้นที่</p>
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
            <option value="combined">Verte Group</option>
            <option value="v1">Verte Smart Solution</option>
            <option value="v2">Verte Security</option>
          </select>
        </div>

        <!-- ช่วงเวลา -->
        <div class="flex items-center space-x-3">
          <label class="text-sm font-medium text-gray-700">ช่วงเวลา:</label>
          <select 
            v-model="selectedTimePeriod" 
            class="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="all">ทั้งหมด</option>
            <option value="current">ปัจจุบัน (Q1-Q2)</option>
            <option value="future">อนาคต (Q3-Q4)</option>
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
            แสดงคะแนนเฉลี่ย: {{ getTableDescription }}
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
                <span>ต้องพัฒนา (&lt;3.5)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

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

// ข้อมูลปัจจุบัน (Q1-Q2)
const currentData = {
  'ผู้บริหารระดับสูง / ผู้จัดการส่วน': {
    v1: [4.40, 4.30, 4.10, 3.90, 4.40, 4.00, 3.90, 4.14],
    v2: [4.48, 4.36, 4.24, 4.10, 4.60, 4.28, 4.10, 4.28]
  },
  'ผู้จัดการแผนก / ผู้จัดการ / พนักงานอาวุโส': {
    v1: [4.05, 4.00, 3.90, 3.80, 4.40, 3.95, 3.70, 3.97],
    v2: [4.17, 4.24, 4.14, 4.14, 4.58, 4.13, 3.98, 4.15]
  },
  'พนักงาน': {
    v1: [4.08, 3.95, 4.06, 4.07, 4.30, 4.05, 3.85, 4.05],
    v2: [4.18, 4.07, 4.22, 4.21, 4.38, 4.17, 3.94, 4.11]
  },
  'ผู้รับเหมาประจำ': {
    v1: [3.90, 3.80, 3.70, 3.60, 4.00, 3.70, 3.50, 3.73],
    v2: [4.05, 3.95, 4.00, 4.00, 4.20, 4.00, 3.80, 3.99]
  }
};

// ข้อมูลอนาคต (Q3-Q4) - เพิ่มขึ้นเล็กน้อย
const futureData = {
  'ผู้บริหารระดับสูง / ผู้จัดการส่วน': {
    v1: [4.52, 4.45, 4.28, 4.15, 4.55, 4.18, 4.08, 4.31],
    v2: [4.65, 4.52, 4.41, 4.28, 4.75, 4.45, 4.28, 4.48]
  },
  'ผู้จัดการแผนก / ผู้จัดการ / พนักงานอาวุโส': {
    v1: [4.22, 4.18, 4.08, 3.98, 4.58, 4.12, 3.88, 4.15],
    v2: [4.35, 4.42, 4.32, 4.32, 4.75, 4.31, 4.16, 4.33]
  },
  'พนักงาน': {
    v1: [4.25, 4.12, 4.24, 4.25, 4.48, 4.23, 4.03, 4.23],
    v2: [4.36, 4.25, 4.40, 4.39, 4.56, 4.35, 4.12, 4.35]
  },
  'ผู้รับเหมาประจำ': {
    v1: [4.08, 3.98, 3.88, 3.78, 4.18, 3.88, 3.68, 3.92],
    v2: [4.23, 4.13, 4.18, 4.18, 4.38, 4.18, 3.98, 4.18]
  }
};

// แมปชื่อพื้นที่
const areaNameMap = {
  'combined': 'Verte Group',
  'v1': 'Verte Smart Solution',
  'v2': 'Verte Security'
};

// แมปชื่อช่วงเวลา
const timePeriodMap = {
  'all': 'ทั้งหมด',
  'current': 'ปัจจุบัน',
  'future': 'อนาคต'
};

const selectedVersion = ref("combined");
const selectedTimePeriod = ref("all");

const colors = {
  'ผู้บริหารระดับสูง / ผู้จัดการส่วน': '#1e40af',
  'ผู้จัดการแผนก / ผู้จัดการ / พนักงานอาวุโส': '#059669',
  'พนักงาน': '#dc2626',
  'ผู้รับเหมาประจำ': '#f97316',
  'all_current': '#7c3aed',
  'all_future': '#059669',
  'all_combined': '#1e40af'
};

// ฟังก์ชันสำหรับคำนวณข้อมูลตามช่วงเวลา
const getDataForTimePeriod = (timePeriod) => {
  if (timePeriod === 'current') {
    return currentData;
  } else if (timePeriod === 'future') {
    return futureData;
  } else {
    // รวมข้อมูลทั้งหมด (เฉลี่ยของ current และ future)
    const combinedData = {};
    for (const group in currentData) {
      combinedData[group] = {
        v1: currentData[group].v1.map((val, idx) => (val + futureData[group].v1[idx]) / 2),
        v2: currentData[group].v2.map((val, idx) => (val + futureData[group].v2[idx]) / 2)
      };
    }
    return combinedData;
  }
};

const chartData = computed(() => {
  const datasets = [];
  const rawData = getDataForTimePeriod(selectedTimePeriod.value);

  if (selectedVersion.value === "combined") {
    if (selectedTimePeriod.value === 'all') {
      // แสดงทั้ง current และ future
      const currentCombined = getDataForTimePeriod('current');
      const futureCombined = getDataForTimePeriod('future');
      
      // ข้อมูลปัจจุบัน
      const totalGroups = Object.keys(currentCombined).length;
      const currentDataPoints = chartLabels.map((_, i) => {
        let sum = 0;
        for (const group in currentCombined) {
          const v1 = currentCombined[group].v1[i];
          const v2 = currentCombined[group].v2[i];
          const avg = (v1 + v2) / 2;
          sum += avg;
        }
        return sum / totalGroups;
      });

      // ข้อมูลอนาคต
      const futureDataPoints = chartLabels.map((_, i) => {
        let sum = 0;
        for (const group in futureCombined) {
          const v1 = futureCombined[group].v1[i];
          const v2 = futureCombined[group].v2[i];
          const avg = (v1 + v2) / 2;
          sum += avg;
        }
        return sum / totalGroups;
      });

      datasets.push({
        label: `ปัจจุบัน (${areaNameMap[selectedVersion.value]})`,
        backgroundColor: colors.all_current,
        data: currentDataPoints,
      });

      datasets.push({
        label: `อนาคต (${areaNameMap[selectedVersion.value]})`,
        backgroundColor: colors.all_future,
        data: futureDataPoints,
      });
    } else {
      // แสดงเฉพาะช่วงเวลาที่เลือก
      const totalGroups = Object.keys(rawData).length;
      const data = chartLabels.map((_, i) => {
        let sum = 0;
        for (const group in rawData) {
          const v1 = rawData[group].v1[i];
          const v2 = rawData[group].v2[i];
          const avg = (v1 + v2) / 2;
          sum += avg;
        }
        return sum / totalGroups;
      });

      datasets.push({
        label: `รวมทุกกลุ่ม (${areaNameMap[selectedVersion.value]} - ${timePeriodMap[selectedTimePeriod.value]})`,
        backgroundColor: colors.all_combined,
        data,
      });
    }
  } else {
    // แสดงแต่ละกลุ่ม
    for (const group in rawData) {
      const v1 = rawData[group].v1;
      const v2 = rawData[group].v2;
      const data = selectedVersion.value === 'v1' ? v1 : v2;

      datasets.push({
        label: `${group} (${areaNameMap[selectedVersion.value]} - ${timePeriodMap[selectedTimePeriod.value]})`,
        backgroundColor: colors[group],
        data,
      });
    }
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

// คำนวณข้อมูลสำหรับแสดงในตารางรายละเอียด
const getTableDescription = computed(() => {
  const area = areaNameMap[selectedVersion.value];
  const time = timePeriodMap[selectedTimePeriod.value];
  
  if (selectedVersion.value === 'combined') {
    return `รวมทุกพื้นที่ (${area} - ${time})`;
  } else {
    return `ทุกกลุ่มใน ${area} - ${time}`;
  }
});

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
    datalabels: { display: false }
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