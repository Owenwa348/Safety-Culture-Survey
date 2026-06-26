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

const scoreColors = {
  1: '#7B341E',
  2: '#E53E3E',
  3: '#ED8936',
  4: '#ECC94B',
  5: '#38A169'
}

const currentColors = {
  1: '#7B341E',
  2: '#E53E3E',
  3: '#ED8936',
  4: '#ECC94B',
  5: '#38A169'
}

const futureColors = {
  1: '#B5826F',
  2: '#fca5a5',
  3: '#fdba74',
  4: '#fde68a',
  5: '#86efac'
}

const isCompareMode = computed(() => props.chartData?.datasets?.length === 2)

const formattedChartData = computed(() => {
  if (!props.chartData || !props.chartData.labels || !props.chartData.datasets?.length) return null

  const labels = props.chartData.labels
  const datasets = []

  if (isCompareMode.value) {
    const currentData = props.chartData.datasets[0]
    const futureData = props.chartData.datasets[1]

    for (let level = 1; level <= 5; level++) {
      datasets.push({
        label: `คะแนน ${level} (ปัจจุบัน)`,
        data: currentData.scoreCounts.map(scores => scores[level]),
        backgroundColor: currentColors[level],
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 1.5,
        stack: 'current',
        // [แก้ไข #3] barPercentage/categoryPercentage ต้องอยู่ใน dataset level
        // ไม่ใช่ใน scales.x — Chart.js v3 อ่านค่าเหล่านี้จาก dataset
        // barPercentage: ความกว้างของ bar ภายใน slot (0.9 = แทบเต็ม slot)
        // categoryPercentage: ขนาดของ slot ต่อ category (0.9 = ชิดกันมาก)
        barPercentage: 0.9,
        categoryPercentage: 0.85,
      })
    }

    for (let level = 1; level <= 5; level++) {
      datasets.push({
        label: `คะแนน ${level} (อนาคต)`,
        data: futureData.scoreCounts.map(scores => scores[level]),
        backgroundColor: futureColors[level],
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 1.5,
        stack: 'future',
        barPercentage: 0.9,
        categoryPercentage: 0.85,
      })
    }
  } else {
    const singleData = props.chartData.datasets[0]

    for (let level = 1; level <= 5; level++) {
      datasets.push({
        label: `คะแนน ${level}`,
        data: singleData.scoreCounts.map(scores => scores[level]),
        backgroundColor: scoreColors[level],
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 1.5,
        stack: 'stack1',
        barPercentage: 0.8,
        categoryPercentage: 0.7,
      })
    }
  }

  return { labels, datasets }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  resizeDelay: 0,
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
          const labels = []

          if (isCompareMode.value) {
            for (let level = 1; level <= 5; level++) {
              labels.push({
                text: `คะแนน ${level}`,
                fillStyle: currentColors[level],
                strokeStyle: 'rgba(255, 255, 255, 0.8)',
                lineWidth: 1.5,
                hidden: false,
                index: level - 1
              })
            }
            labels.push({
              text: '─────────',
              fillStyle: 'transparent',
              strokeStyle: 'transparent',
              lineWidth: 0,
              hidden: false,
              fontColor: '#9CA3AF'
            })
            labels.push({
              text: '■ ปัจจุบัน (เข้ม)   ■ อนาคต (อ่อน)',
              fillStyle: 'transparent',
              strokeStyle: 'transparent',
              lineWidth: 0,
              hidden: false,
              fontColor: '#6B7280'
            })
          }

          return labels
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(17, 24, 39, 0.95)',
      titleColor: '#F9FAFB',
      bodyColor: '#F3F4F6',
      titleFont: { size: 13, weight: 'bold', family: 'inherit' },
      bodyFont: { size: 12, family: 'inherit' },
      padding: 12,
      cornerRadius: 8,
      displayColors: true,
      boxWidth: 12,
      boxHeight: 12,
      boxPadding: 4,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      callbacks: {
        title: (context) => context[0].label,
        label: (context) => {
          const value = context.parsed.y
          return value > 0 ? `${context.dataset.label}: ${value} คน` : ''
        },
        footer: (context) => {
          // แยก sum ตาม stack (current vs future) ไม่รวมกัน
          // เพราะคนละกลุ่มผู้ตอบ การรวมกันทำให้ตัวเลขเกินจริง
          const currentTotal = context
            .filter(item => item.dataset.stack === 'current' || item.dataset.stack === 'stack1')
            .reduce((sum, item) => sum + item.parsed.y, 0)
          const futureTotal = context
            .filter(item => item.dataset.stack === 'future')
            .reduce((sum, item) => sum + item.parsed.y, 0)

          if (futureTotal > 0) {
            // โหมด compare: แสดงแยก
            return `━━━━━━━━━━━\nรวมปัจจุบัน: ${currentTotal} คน\nรวมอนาคต: ${futureTotal} คน`
          }
          return currentTotal > 0 ? `━━━━━━━━━━━\nรวมทั้งหมด: ${currentTotal} คน` : ''
        }
      }
    },
datalabels: {
  display: (context) => context.dataset.data[context.dataIndex] > 0,
  color: (context) => {
    if (isCompareMode.value && context.datasetIndex >= 5) return '#1F2937'
    return '#ffffff'
  },
  anchor: 'center',
  align: 'center',
  font: { weight: 'bold', size: 9, family: 'inherit' },
  formatter: (value) => value > 0 ? value : '',
  textShadowColor: (context) => {
    if (isCompareMode.value && context.datasetIndex >= 5) return 'transparent'
    return 'rgba(0, 0, 0, 0.6)'
  },
  textShadowBlur: (context) => {
    if (isCompareMode.value && context.datasetIndex >= 5) return 0
    return 2
  }
}
  },
  scales: {
    x: {
      stacked: true,
      grid: { display: false },
      ticks: {
        font: { size: 10, family: 'inherit', weight: '600' },
        color: '#374151',
        maxRotation: 45,
        minRotation: 45,
        autoSkip: false,
        padding: 5
      },
      border: { display: true, color: '#D1D5DB', width: 1 }
    },
    y: {
      stacked: true,
      beginAtZero: true,
      // ปล่อยให้ Chart.js คำนวณ Y max เอง — ทำได้ถูกต้องกว่าการ override
      grid: {
        color: 'rgba(229, 231, 235, 0.8)',
        drawBorder: false,
        lineWidth: 1
      },
      ticks: {
        // [แก้ไข #2] เพิ่ม font size จาก 11 → 13 และเข้มสีจาก #4B5563 → #111827
        font: { size: 13, family: 'inherit', weight: '600' },
        color: '#111827',
        precision: 0,
        padding: 8,
        callback: (value) => `${value}`
      },
      border: { display: false },
      title: {
        display: true,
        text: 'จำนวนผู้ตอบ (คน)',
        // [แก้ไข #2] เพิ่ม font size title แกน Y ด้วย
        font: { size: 13, weight: 'bold', family: 'inherit' },
        color: '#111827',
        padding: { top: 0, bottom: 12 }
      }
    }
  },
  layout: {
    padding: { left: 10, right: 10, top: 10, bottom: 10 }
  }
}))
</script>

<style scoped>
/* สไตล์เพิ่มเติมถ้าต้องการ */
</style>