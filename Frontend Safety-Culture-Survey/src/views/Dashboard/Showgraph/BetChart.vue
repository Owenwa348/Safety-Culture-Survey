<template>
  <div class="bg-white rounded-xl shadow p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">BarChart</h3>
    <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
  </div>
</template>
<script setup>
import { Chart as ChartJS, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { Bar } from 'vue-chartjs'

// ลงทะเบียน Chart.js และ plugin
ChartJS.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels)

const props = defineProps({
  chartData: Object
})

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true
    },
    datalabels: {
      color: '#333',
      anchor: 'end',
      align: 'top',
      font: {
        weight: 'bold'
      },
      formatter: (value) => value
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}
</script>