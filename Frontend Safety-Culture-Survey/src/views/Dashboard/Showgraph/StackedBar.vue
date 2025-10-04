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
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
        stack: 'current',
        barThickness: 30,
      })
    }

    // สร้าง datasets สำหรับอนาคต
    for (let level = 1; level <= 5; level++) {
      datasets.push({
        label: `คะแนน ${level} (อนาคต)`,
        data: futureData.scoreCounts.map(scores => scores[level]),
        backgroundColor: futureColors[level],
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
        stack: 'future',
        barThickness: 30,
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
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
        stack: 'stack1',
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
        boxWidth: 12,
        boxHeight: 12,
        padding: 12,
        font: {
          size: 11,
          family: 'inherit'
        },
        color: '#374151',
        usePointStyle: false,
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
          return total > 0 ? `รวมทั้งหมด: ${total} คน` : ''
        }
      }
    },
    datalabels: {
      color: (context) => {
        const datasetIndex = context.datasetIndex;
        // ถ้าเป็นโหมดเปรียบเทียบ และเป็น dataset ของอนาคต (index 5-9) ให้ใช้สีดำ
        if (isCompareMode.value && datasetIndex >= 5) {
          return '#000000';
        }
        // นอกนั้นใช้สีขาว
        return '#ffffff';
      },
      anchor: 'center',
      align: 'center',
      font: {
        weight: '900',
        size: 12,
        family: 'inherit'
      },
      formatter: (value) => value > 0 ? value : '',
      textShadowColor: (context) => {
        const datasetIndex = context.datasetIndex;
        // ถ้าเป็นโหมดเปรียบเทียบ และเป็น dataset ของอนาคต ไม่ใช้ shadow
        if (isCompareMode.value && datasetIndex >= 5) {
          return 'transparent';
        }
        return 'rgba(0, 0, 0, 0.5)';
      },
      textShadowBlur: (context) => {
        const datasetIndex = context.datasetIndex;
        if (isCompareMode.value && datasetIndex >= 5) {
          return 0;
        }
        return 3;
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
      }
    },
    y: {
      stacked: true,
      beginAtZero: true,
      grid: {
        color: '#F3F4F6',
        drawBorder: false
      },
      ticks: {
        font: {
          size: 11,
          family: 'inherit'
        },
        color: '#6B7280',
        precision: 0,
        callback: (value) => `${value}`
      },
      border: {
        display: false
      },
      title: {
        display: true,
        text: 'จำนวนผู้ตอบ (คน)',
        font: {
          size: 12,
          weight: 'bold',
          family: 'inherit'
        },
        color: '#374151',
        padding: { top: 0, bottom: 10 }
      }
    }
  }
}))
</script>

<style scoped>
/* สไตล์เพิ่มเติมถ้าต้องการ */
</style>