<!-- SalesBarChartDB.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header Card -->
      <div class="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
        <div class="bg-gradient-to-r px-8 py-6">
          <h1 class="text-2xl font-bold mb-2">ผลการประเมินบริษัท Verte Group ประจำปี 2025</h1>
          <p>การวิเคราะห์ผลการประเมินตามตำแหน่งและพื้นที่การดำเนินงาน</p>
        </div>
        
        <!-- Filters -->
        <div class="px-8 py-5 bg-gray-50 border-b">
          <div class="flex flex-wrap items-center gap-6">
            <div class="flex items-center space-x-3">
              <label class="text-sm font-semibold text-gray-700">พื้นที่:</label>
              <select 
                v-model="selectedVersion" 
                class="px-4 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
              >
                <option value="combined">Verte Group</option>
                <option value="v1">Verte Smart Solution</option>
                <option value="v2">Verte Security</option>
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
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                  กลุ่ม / ตำแหน่ง
                </th>
                <th 
                  v-for="(label, index) in chartLabels" 
                  :key="index" 
                  class="px-4 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider"
                  :title="label"
                >
                  <div class="truncate">
                    {{ getShortLabel(label, index) }}
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
                <td class="px-6 py-4 text-sm font-semibold text-gray-800 sticky left-0 bg-white z-10 border-r border-gray-100">
                  <div class="flex items-center">
                    <div 
                      class="w-4 h-4 rounded mr-3 flex-shrink-0 shadow-sm" 
                      :style="{ backgroundColor: dataset.backgroundColor }"
                    ></div>
                    <span class="truncate">{{ dataset.label }}</span>
                  </div>
                </td>
                <td 
                  v-for="(score, scoreIndex) in dataset.data" 
                  :key="scoreIndex" 
                  class="px-4 py-4 text-sm text-center font-semibold"
                  :class="getScoreClass(score)"
                >
                  {{ formatScore(score) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Footer Summary -->
        <div class="px-8 py-5 bg-gradient-to-r from-gray-50 to-blue-50 border-t">
          <div class="flex flex-wrap items-center justify-between text-sm">
            <div class="flex items-center space-x-6 text-gray-700">
              <span class="font-semibold">จำนวนกลุ่ม: <span class="text-blue-600">{{ chartData.datasets.length }}</span></span>
              <span class="font-semibold">จำนวนหมวดหมู่: <span class="text-blue-600">{{ chartLabels.length }}</span></span>
            </div>
            <div class="flex items-center gap-4 mt-3 sm:mt-0">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-green-500 rounded shadow-sm"></div>
                <span class="text-gray-700 font-medium">ดีเยี่ยม ≥ 4.5</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-blue-500 rounded shadow-sm"></div>
                <span class="text-gray-700 font-medium">ดี 4.0 - 4.49</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-yellow-500 rounded shadow-sm"></div>
                <span class="text-gray-700 font-medium">ปานกลาง 3.5 - 3.99</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-red-500 rounded shadow-sm"></div>
                <span class="text-gray-700 font-medium">ต้องพัฒนา &lt; 3.5</span>
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

// ข้อมูลปัจจุบัน 
const currentData = {
  'ผู้บริหารระดับสูง / ผู้จัดการส่วน': {
    v1: [3.85, 3.72, 3.58, 3.45, 3.92, 3.68, 3.55, 3.68],
    v2: [3.95, 3.88, 3.75, 3.62, 4.05, 3.85, 3.68, 3.83]
  },
  'ผู้จัดการแผนก / ผู้จัดการ / พนักงานอาวุโส': {
    v1: [3.65, 3.55, 3.42, 3.35, 3.88, 3.58, 3.38, 3.54],
    v2: [3.78, 3.72, 3.62, 3.55, 4.02, 3.75, 3.52, 3.71]
  },
  'พนักงาน': {
    v1: [3.85, 3.68, 2.52, 3.45, 2.95, 3.72, 3.58, 2.68],
    v2: [2.98, 2.85, 2.68, 2.58, 3.08, 2.88, 2.72, 2.82]
  },
  'ผู้รับเหมาประจำ': {
    v1: [3.55, 3.42, 2.28, 3.18, 2.68, 3.48, 3.35, 2.42],
    v2: [2.72, 2.58, 2.45, 2.32, 2.82, 2.65, 2.48, 2.57]
  }
};

// ข้อมูลอนาคต - เพิ่มขึ้นอย่างชัดเจน
const futureData = {
  'ผู้บริหารระดับสูง / ผู้จัดการส่วน': {
    v1: [4.62, 4.55, 4.45, 4.38, 4.72, 4.58, 4.42, 4.53],
    v2: [4.75, 4.68, 4.58, 4.48, 4.85, 4.72, 4.55, 4.66]
  },
  'ผู้จัดการแผนก / ผู้จัดการ / พนักงานอาวุโส': {
    v1: [4.48, 4.38, 4.28, 4.18, 4.62, 4.45, 4.28, 4.38],
    v2: [4.58, 4.52, 4.42, 4.35, 4.72, 4.58, 4.42, 4.51]
  },
  'พนักงาน': {
    v1: [4.22, 4.12, 4.02, 3.95, 4.38, 4.18, 4.05, 4.13],
    v2: [4.38, 4.28, 4.18, 4.08, 4.52, 4.35, 4.18, 4.28]
  },
  'ผู้รับเหมาประจำ': {
    v1: [3.95, 3.85, 3.72, 3.65, 4.08, 3.92, 3.78, 3.85],
    v2: [4.12, 4.02, 3.92, 3.82, 4.25, 4.08, 3.95, 4.02]
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
  'all_future': '#10b981',
  'all_combined': '#1e40af',
  'future_single': '#f59e0b'  // สีสำหรับกราฟอนาคตเมื่อเลือกแค่ช่วงเวลาเดียว
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

  if (selectedVersion.value === "combined") {
    // กรณีเลือก Verte Group (รวมทั้งหมด)
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
      const rawData = getDataForTimePeriod(selectedTimePeriod.value);
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

      // เลือกสีตามช่วงเวลา
      const barColor = selectedTimePeriod.value === 'future' ? colors.future_single : colors.all_combined;

      datasets.push({
        label: `รวมทุกกลุ่ม (${areaNameMap[selectedVersion.value]} - ${timePeriodMap[selectedTimePeriod.value]})`,
        backgroundColor: barColor,
        data,
      });
    }
  } else {
    // กรณีเลือกพื้นที่เฉพาะ (Verte Smart Solution หรือ Verte Security)
    if (selectedTimePeriod.value === 'all') {
      // เปรียบเทียบระหว่าง ปัจจุบัน และ อนาคต - แสดงเฉพาะค่าเฉลี่ยรวมของทั้ง 4 ตำแหน่ง
      const currentRawData = getDataForTimePeriod('current');
      const futureRawData = getDataForTimePeriod('future');
      
      const totalGroups = Object.keys(currentRawData).length;

      // คำนวณค่าเฉลี่ยรวมของทั้ง 4 ตำแหน่งสำหรับปัจจุบัน
      const currentDataPoints = chartLabels.map((_, i) => {
        let sum = 0;
        for (const group in currentRawData) {
          const value = selectedVersion.value === 'v1' ? currentRawData[group].v1[i] : currentRawData[group].v2[i];
          sum += value;
        }
        return sum / totalGroups;
      });

      // คำนวณค่าเฉลี่ยรวมของทั้ง 4 ตำแหน่งสำหรับอนาคต
      const futureDataPoints = chartLabels.map((_, i) => {
        let sum = 0;
        for (const group in futureRawData) {
          const value = selectedVersion.value === 'v1' ? futureRawData[group].v1[i] : futureRawData[group].v2[i];
          sum += value;
        }
        return sum / totalGroups;
      });

      // แสดงเฉพาะ 2 กราฟ: ปัจจุบัน และ อนาคต
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
      // แสดงเฉพาะช่วงเวลาที่เลือก - แสดงค่าเฉลี่ยรวมของทั้ง 4 ตำแหน่ง
      const rawData = getDataForTimePeriod(selectedTimePeriod.value);
      const totalGroups = Object.keys(rawData).length;
      
      const dataPoints = chartLabels.map((_, i) => {
        let sum = 0;
        for (const group in rawData) {
          const value = selectedVersion.value === 'v1' ? rawData[group].v1[i] : rawData[group].v2[i];
          sum += value;
        }
        return sum / totalGroups;
      });

      // เลือกสีตามช่วงเวลา
      const barColor = selectedTimePeriod.value === 'future' ? colors.future_single : colors.all_combined;

      datasets.push({
        label: `รวมทุกตำแหน่ง (${areaNameMap[selectedVersion.value]} - ${timePeriodMap[selectedTimePeriod.value]})`,
        backgroundColor: barColor,
        data: dataPoints,
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

.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

table {
  border-collapse: separate;
  border-spacing: 0;
}

tbody tr:last-child td {
  border-bottom: none;
}
</style>