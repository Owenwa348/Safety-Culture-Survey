<template>
  <div class="bg-white rounded-xl shadow p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Radar Chart </h3>
    <Radar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { Radar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

const props = defineProps({
  chartData: Object
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      ticks: {
        display: false   // ซ่อนตัวเลขรอบวงในเรดาร์
      },
      grid: {
        circular: true
      },
      angleLines: {
        display: true
      },
      pointLabels: {
        display: true    // แสดงชื่อรอบวง เช่น BFS, EFM
      }
    }
  },
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: false
    }
  }
};
</script>

<style scoped>
canvas {
  height: 300px !important;
}
</style>
