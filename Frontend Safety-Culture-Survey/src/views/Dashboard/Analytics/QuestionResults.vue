<script setup>
import { ref, computed, onMounted, watch } from "vue";
import axios from 'axios';
import StackedBar from "../Showgraph/StackedBar.vue";
import NavbarDashboard from '../../../components/NavbarDashboard.vue';

// ========================================
// ตัวแปร Reactive States
// ========================================
const selectedPosition = ref("All");
const selectedCompany = ref("All");
const selectedTimeframe = ref("compare");
const selectedYear = ref(null);
const fullLabels = ref([]);
const chartAPIData = ref(null);
const isLoading = ref(true);

// ========================================
// ข้อมูลตัวเลือกสำหรับ Dropdown
// ========================================
const positionOptions = ref([
  { value: "All", label: "รวมทั้งหมด" },
]);

const companyOptions = ref([
  { value: "All", label: "รวมทั้งหมด" },
]);

const timeframeOptions = [
  { value: "compare", label: "เปรียบเทียบ (ปัจจุบัน vs อนาคต)" },
  { value: "current", label: "ปัจจุบัน" },
  { value: "future", label: "คาดในอนาคต" },
];

const availableYears = ref([]);

// ========================================
// ฟังก์ชันเรียก API
// ========================================

/**
 * ดึงข้อมูลคำถามทั้งหมดจาก API เพื่อนำมาแสดงเป็นป้ายกำกับในกราฟ
 * แสดงหมายเลขและตัวอย่างคำถามสั้นๆ เช่น "Q1: ทักษะการทำงาน..."
 */
const fetchQuestions = async () => {
  try {
    const response = await axios.get('/api/questions');
    // แสดงหมายเลขพร้อมตัวอย่างคำถามสั้นๆ (ไม่เกิน 25 ตัวอักษร)
    fullLabels.value = response.data.map((q, index) => {
      const questionText = q.text;
      const maxLength = 25; // กำหนดความยาวสูงสุดของตัวอย่าง
      const truncatedText = questionText.length > maxLength 
        ? questionText.substring(0, maxLength) + '...' 
        : questionText;
      return `Q${index + 1}: ${truncatedText}`;
    });
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลคำถาม:', error);
  }
};

/**
 * ดึงข้อมูลบริษัททั้งหมดจาก API
 */
const fetchCompanies = async () => {
  try {
    const response = await axios.get('/api/companies');
    const companies = response.data.map(companyName => ({
      value: companyName,
      label: companyName
    }));
    companyOptions.value.push(...companies);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลบริษัท:', error);
  }
};

/**
 * ดึงข้อมูลตำแหน่งทั้งหมดจาก API 
 */
const fetchPositions = async () => {
  try {
    const response = await axios.get('/api/positions');
    const positions = response.data.map(position => ({
      value: position.name,
      label: position.name
    }));
    positionOptions.value.push(...positions);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลตำแหน่ง:', error);
  }
};

/**
 * ดึงรายการปีที่มีข้อมูลการประเมินจาก API
 */
const fetchYears = async () => {
  try {
    const { data } = await axios.get('/api/analytics/assessment-years');
    availableYears.value = data;
    if (data.length > 0) {
      selectedYear.value = data[0];
    }
  } catch (err) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลปี:', err);
  }
};

/**
 * ดึงข้อมูลกราฟตามเงื่อนไขที่เลือก
 */
const fetchChartData = async () => {
  if (!selectedYear.value) return;
  
  isLoading.value = true;
  chartAPIData.value = null;
  
  try {
    const params = {
      year: selectedYear.value,
      company: selectedCompany.value,
      position: selectedPosition.value,
    };
    
    const { data } = await axios.get('/api/analytics/question-results', { params });
    chartAPIData.value = data;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลกราฟ:', error);
    chartAPIData.value = null;
  } finally {
    isLoading.value = false;
  }
};

// ========================================
// Lifecycle Hooks และ Watchers
// ========================================

onMounted(async () => {
  await Promise.all([
    fetchQuestions(),
    fetchPositions(),
    fetchYears(),
    fetchCompanies()
  ]);
  
  if (selectedYear.value) {
    fetchChartData();
  }
});

watch([selectedYear, selectedCompany, selectedPosition], fetchChartData, { deep: true });

// ========================================
// Computed Properties
// ========================================

const isCompareMode = computed(() => selectedTimeframe.value === "compare");

const getPositionLabel = () => {
  const option = positionOptions.value.find(opt => opt.value === selectedPosition.value);
  return option ? option.label : selectedPosition.value;
};

const getCompanyLabel = () => {
  const option = companyOptions.value.find(opt => opt.value === selectedCompany.value);
  return option ? option.label : selectedCompany.value;
};

/**
 * จัดเตรียมข้อมูลสำหรับแสดงกราฟ
 */
const chartData = computed(() => {
  if (!chartAPIData.value || isLoading.value || fullLabels.value.length === 0) {
    return null;
  }

  const positionLabel = getPositionLabel();
  const companyLabel = getCompanyLabel();

  if (isCompareMode.value) {
    return {
      labels: fullLabels.value,
      datasets: [
        {
          label: `${positionLabel} - ${companyLabel} (ปัจจุบัน)`,
          scoreCounts: chartAPIData.value.current
        },
        {
          label: `${positionLabel} - ${companyLabel} (อนาคต)`,
          scoreCounts: chartAPIData.value.future
        }
      ]
    };
  } else {
    const dataKey = selectedTimeframe.value;
    const timeLabel = dataKey === 'current' ? 'ปัจจุบัน' : 'คาดในอนาคต';
    return {
      labels: fullLabels.value,
      datasets: [{
        label: `${positionLabel} - ${companyLabel} (${timeLabel})`,
        scoreCounts: chartAPIData.value[dataKey]
      }]
    };
  }
});
</script>

<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- ========================================
         แถบเมนูด้านข้าง (Sidebar)
         ======================================== -->
    <NavbarDashboard />

    <!-- ========================================
         บริษัทเนื้อหาหลัก
         ======================================== -->
    <main class="flex-1 ml-60 p-6">
      
      <!-- หัวข้อหน้า -->
      <header class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800">
          ผลประเมินตามข้อคำถาม
        </h1>
        <p class="text-sm text-gray-600 mt-1">
          วิเคราะห์และเปรียบเทียบผลคะแนนในแต่ละข้อคำถาม
        </p>
      </header>

      <!-- ========================================
           ส่วนตัวกรองข้อมูล (Filter Section)
           ======================================== -->
      <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <!-- ตัวกรองตำแหน่ง -->
          <div class="space-y-2">
            <label 
              for="position-select" 
              class="block text-sm font-medium text-gray-700"
            >
              เลือกตำแหน่ง
            </label>
            <select
              id="position-select"
              v-model="selectedPosition"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
            >
              <option 
                v-for="option in positionOptions" 
                :key="option.value" 
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- ตัวกรองบริษัท -->
          <div class="space-y-2">
            <label 
              for="company-select" 
              class="block text-sm font-medium text-gray-700"
            >
              เลือกบริษัท
            </label>
            <select
              id="company-select"
              v-model="selectedCompany"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
            >
              <option 
                v-for="option in companyOptions" 
                :key="option.value" 
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- ตัวกรองปี -->
          <div class="space-y-2">
            <label 
              for="year-select" 
              class="block text-sm font-medium text-gray-700"
            >
              เลือกปี
            </label>
            <select
              id="year-select"
              v-model="selectedYear"
              :disabled="availableYears.length === 0"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              <option v-if="availableYears.length === 0" :value="null">
                ไม่มีข้อมูลปี
              </option>
              <option 
                v-for="year in availableYears" 
                :key="year" 
                :value="year"
              >
                {{ year }}
              </option>
            </select>
          </div>

          <!-- ตัวกรองช่วงเวลา -->
          <div class="space-y-2">
            <label 
              for="timeframe-select" 
              class="block text-sm font-medium text-gray-700"
            >
              ช่วงเวลา
            </label>
            <select
              id="timeframe-select"
              v-model="selectedTimeframe"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
            >
              <option 
                v-for="option in timeframeOptions" 
                :key="option.value" 
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
        
        <!-- สรุปตัวกรองที่เลือก -->
        <div class="mt-4 pt-4 border-t border-gray-200">
          <div class="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span class="font-semibold text-gray-700">กำลังแสดง:</span>
            <span class="px-2 py-1 bg-blue-50 text-blue-700 rounded">
              {{ getPositionLabel() }}
            </span>
            <span class="text-gray-400">•</span>
            <span class="px-2 py-1 bg-green-50 text-green-700 rounded">
              {{ companyOptions.find(opt => opt.value === selectedCompany)?.label }}
            </span>
            <span class="text-gray-400">•</span>
            <span class="px-2 py-1 bg-purple-50 text-purple-700 rounded">
              ปี {{ selectedYear }}
            </span>
            <span class="text-gray-400">•</span>
            <span class="px-2 py-1 bg-orange-50 text-orange-700 rounded">
              {{ timeframeOptions.find(opt => opt.value === selectedTimeframe)?.label }}
            </span>
          </div>
        </div>
      </section>

      <!-- ========================================
           ส่วนแสดงกราฟ
           ======================================== -->
      <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <!-- หัวข้อของกราฟ -->
        <header class="mb-6 pb-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-800">
            {{ getPositionLabel() }}
          </h2>
          <p class="text-sm text-gray-500 mt-1">
            {{ getCompanyLabel() }}
          </p>
        </header>
        
        <!-- แสดงข้อความโหลด -->
        <div v-if="isLoading" class="flex justify-center items-center" style="height: 450px;">
          <p class="text-gray-500">กำลังโหลดข้อมูล...</p>
        </div>
        
        <!-- แสดงกราฟ -->
        <div v-else-if="chartData && chartData.datasets" class="w-full" style="height: 450px;">
          <StackedBar 
            :chart-data="chartData"
            :bar-percentage="0.5"
            :category-percentage="0.6"
          />
        </div>

        <!-- แสดงข้อความเมื่อไม่พบข้อมูล -->
        <div v-else class="flex flex-col justify-center items-center text-center" style="height: 450px;">
          <svg 
            class="mx-auto h-12 w-12 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">
            ไม่พบข้อมูล
          </h3>
          <p class="mt-2 text-sm text-gray-500">
            ไม่พบข้อมูลสำหรับการเลือกปัจจุบัน กรุณาเลือกตัวกรองอื่น
          </p>
        </div>
      </section>

    </main>
  </div>
</template>

<style scoped>
select {
  transition: all 0.2s ease;
}

select:hover:not(:disabled) {
  border-color: #9ca3af;
}

select:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>