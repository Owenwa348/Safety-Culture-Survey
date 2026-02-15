<!-- StackedBar.vue -->
<template>
  <div class="w-full h-full">
    <Bar v-if="formattedChartData?.datasets?.length" :data="formattedChartData" :options="chartOptions" />
    <div v-else class="flex items-center justify-center h-full">
      <p class="text-gray-400">ไม่มีข้อมูลสำหรับแสดงผล</p>
    </div>
  </div>
</template>

<script setup>
import {
  Chart as ChartJS,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Bar } from 'vue-chartjs'
import { computed } from 'vue'

ChartJS.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartDataLabels
)

const props = defineProps({
  chartData: Object,
})

// สีสำหรับคะแนนแต่ละระดับ - ปรับให้ชัดเจนและแยกแยะง่าย
const scoreColors = {
  1: '#7B341E',   // น้ำตาลเข้ม
  2: '#E53E3E',   // แดง
  3: '#ED8936',   // ส้ม
  4: '#ECC94B',   // เหลือง
  5: '#38A169'    // เขียว
}

// สีสำหรับโหมดปัจจุบัน (เข้มชัด)
const currentColors = {
  1: '#7B341E',   // น้ำตาลเข้ม
  2: '#E53E3E',   // แดง
  3: '#ED8936',   // ส้ม
  4: '#ECC94B',   // เหลือง
  5: '#38A169'    // เขียว
}

// สีสำหรับโหมดอนาคต (โทนอ่อนกว่า)
const futureColors = {
  1: '#B5826F',
  2: '#fca5a5',
  3: '#fdba74',
  4: '#fde68a',
  5: '#86efac'
}

const isCompareMode = computed(() => props.chartData?.datasets?.length === 2)

// แปลงข้อมูลเป็นรูปแบบที่ Chart.js เข้าใจ
const formattedChartData = computed(() => {
  if (!props.chartData || !props.chartData.labels || !props.chartData.datasets?.length) return null

  const labels = props.chartData.labels
  const datasets = []

  if (isCompareMode.value) {
    // โหมดเปรียบเทียบ
    const currentData = props.chartData.datasets[0]
    const futureData = props.chartData.datasets[1]

    // สร้าง datasets สำหรับปัจจุบัน
    for (let level = 1; level <= 5; level++) {
      datasets.push({
        label: `คะแนน ${level} (ปัจจุบัน)`,
        data: currentData.scoreCounts.map(scores => scores[level]),
        backgroundColor: currentColors[level],
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 1.5,
        stack: 'current',
        barThickness: 16,
        maxBarThickness: 18,
      })
    }

    // สร้าง datasets สำหรับอนาคต
    for (let level = 1; level <= 5; level++) {
      datasets.push({
        label: `คะแนน ${level} (อนาคต)`,
        data: futureData.scoreCounts.map(scores => scores[level]),
        backgroundColor: futureColors[level],
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 1.5,
        stack: 'future',
        barThickness: 16,
        maxBarThickness: 18,
      })
    }
  } else {
    // โหมดเดี่ยว
    const singleData = props.chartData.datasets[0]

    for (let level = 1; level <= 5; level++) {
      datasets.push({
        label: `คะแนน ${level}`,
        data: singleData.scoreCounts.map(scores => scores[level]),
        backgroundColor: scoreColors[level],
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 1.5,
        stack: 'stack1',
        barThickness: 32,
        maxBarThickness: 36,
      })
    }
  }

  return {
    labels,
    datasets
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      display: true,
      position: 'top',
      align: 'start',
      labels: {
        boxWidth: 14,
        boxHeight: 14,
        padding: 15,
        font: {
          size: 12,
          family: 'inherit',
          weight: '500'
        },
        color: '#1F2937',
        usePointStyle: false,
        generateLabels: (chart) => {
          const datasets = chart.data.datasets;
          const labels = [];
          
          if (isCompareMode.value) {
            // แสดงเฉพาะ Legend สำหรับคะแนน 1-5 ของแต่ละโหมด
            for (let level = 1; level <= 5; level++) {
              labels.push({
                text: `คะแนน ${level}`,
                fillStyle: currentColors[level],
                strokeStyle: 'rgba(255, 255, 255, 0.8)',
                lineWidth: 1.5,
                hidden: false,
                index: level - 1
              });
            }
            
            // เพิ่ม separator
            labels.push({
              text: '─────────',
              fillStyle: 'transparent',
              strokeStyle: 'transparent',
              lineWidth: 0,
              hidden: false,
              fontColor: '#9CA3AF'
            });
            
            labels.push({
              text: '■ ปัจจุบัน (เข้ม)   ■ อนาคต (อ่อน)',
              fillStyle: 'transparent',
              strokeStyle: 'transparent',
              lineWidth: 0,
              hidden: false,
              fontColor: '#6B7280'
            });
          }
          
          return labels;
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(17, 24, 39, 0.95)',
      titleColor: '#F9FAFB',
      bodyColor: '#F3F4F6',
      titleFont: {
        size: 13,
        weight: 'bold',
        family: 'inherit'
      },
      bodyFont: {
        size: 12,
        family: 'inherit'
      },
      padding: 12,
      cornerRadius: 8,
      displayColors: true,
      boxWidth: 12,
      boxHeight: 12,
      boxPadding: 4,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      callbacks: {
        title: (context) => {
          return context[0].label
        },
        label: (context) => {
          const label = context.dataset.label || ''
          const value = context.parsed.y
          return value > 0 ? `${label}: ${value} คน` : ''
        },
        footer: (context) => {
          const total = context.reduce((sum, item) => sum + item.parsed.y, 0)
          return total > 0 ? `━━━━━━━━━━━\nรวมทั้งหมด: ${total} คน` : ''
        }
      }
    },
    datalabels: {
      color: (context) => {
        const value = context.dataset.data[context.dataIndex];
        if (value === 0) return 'transparent';
        
        const datasetIndex = context.datasetIndex;
        // ถ้าเป็นโหมดเปรียบเทียบ และเป็น dataset ของอนาคต (index 5-9) ให้ใช้สีดำ
        if (isCompareMode.value && datasetIndex >= 5) {
          return '#1F2937';
        }
        // นอกนั้นใช้สีขาว
        return '#ffffff';
      },
      anchor: 'center',
      align: 'center',
      font: {
        weight: 'bold',
        size: 10,
        family: 'inherit'
      },
      formatter: (value) => value > 0 ? value : '',
      textShadowColor: (context) => {
        const value = context.dataset.data[context.dataIndex];
        if (value === 0) return 'transparent';
        
        const datasetIndex = context.datasetIndex;
        // ถ้าเป็นโหมดเปรียบเทียบ และเป็น dataset ของอนาคต ไม่ใช้ shadow
        if (isCompareMode.value && datasetIndex >= 5) {
          return 'transparent';
        }
        return 'rgba(0, 0, 0, 0.6)';
      },
      textShadowBlur: (context) => {
        const value = context.dataset.data[context.dataIndex];
        if (value === 0) return 0;
        
        const datasetIndex = context.datasetIndex;
        if (isCompareMode.value && datasetIndex >= 5) {
          return 0;
        }
        return 2;
      }
    }
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
          family: 'inherit',
          weight: '500'
        },
        color: '#4B5563',
        maxRotation: 45,
        minRotation: 45,
        autoSkip: false,
        padding: 8
      },
      border: {
        display: true,
        color: '#D1D5DB',
        width: 1
      }
    },
    y: {
      stacked: true,
      beginAtZero: true,
      grid: {
        color: 'rgba(229, 231, 235, 0.8)',
        drawBorder: false,
        lineWidth: 1
      },
      ticks: {
        font: {
          size: 11,
          family: 'inherit',
          weight: '500'
        },
        color: '#4B5563',
        precision: 0,
        padding: 8,
        callback: (value) => `${value}`
      },
      border: {
        display: false
      },
      title: {
        display: true,
        text: 'จำนวนผู้ตอบ (คน)',
        font: {
          size: 13,
          weight: 'bold',
          family: 'inherit'
        },
        color: '#1F2937',
        padding: { top: 0, bottom: 12 }
      }
    }
  },
  layout: {
    padding: {
      left: 10,
      right: 10,
      top: 10,
      bottom: 10
    }
  }
}))
</script>

<style scoped>
/* สไตล์เพิ่มเติมถ้าต้องการ */
</style>