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
const selectedCategory = ref("All");
const selectedTimeframe = ref("compare");
const selectedYear = ref(null);
const currentPage = ref(1);
const questionsPerPage = ref(20);
const fullLabels = ref([]);
const allQuestions = ref([]);
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

const categoryOptions = ref([
  { value: "All", label: "ทุกหมวดหมู่" },
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
    allQuestions.value = response.data;
    updateLabels();
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลคำถาม:', error);
  }
};

/**
 * อัพเดท labels ตาม category ที่เลือก
 */
const updateLabels = () => {
  let filteredQuestions = allQuestions.value;
  
  // กรองตาม category
  if (selectedCategory.value !== 'All') {
    filteredQuestions = filteredQuestions.filter(
      q => q.categoryId === parseInt(selectedCategory.value)
    );
  }
  
  // แสดงหมายเลขพร้อมตัวอย่างคำถามสั้นๆ
  fullLabels.value = filteredQuestions.map((q, index) => {
    const questionText = q.text;
    const maxLength = 25;
    const truncatedText = questionText.length > maxLength 
      ? questionText.substring(0, maxLength) + '...' 
      : questionText;
    return `Q${index + 1}: ${truncatedText}`;
  });
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
 * ดึงข้อมูล Category ทั้งหมดจาก API
 */
const fetchCategories = async () => {
  try {
    const response = await axios.get('/api/categories');
    const categories = response.data.map(category => ({
      value: category.id.toString(),
      label: category.name
    }));
    categoryOptions.value.push(...categories);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูล Category:', error);
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
      categoryId: selectedCategory.value,
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
    fetchCompanies(),
    fetchCategories()
  ]);
  
  if (selectedYear.value) {
    fetchChartData();
  }
});

watch([selectedYear, selectedCompany, selectedPosition, selectedCategory], () => {
  currentPage.value = 1; // Reset to first page
  fetchChartData();
}, { deep: true });

watch(selectedCategory, updateLabels);

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

const getCategoryLabel = () => {
  const option = categoryOptions.value.find(opt => opt.value === selectedCategory.value);
  return option ? option.label : 'ทุกหมวดหมู่';
};

/**
 * คำนวณจำนวนหน้าทั้งหมด
 */
const totalPages = computed(() => {
  return Math.ceil(fullLabels.value.length / questionsPerPage.value);
});

/**
 * คำนวณ range ของคำถามในหน้าปัจจุบัน
 */
const currentQuestionRange = computed(() => {
  const start = (currentPage.value - 1) * questionsPerPage.value;
  const end = Math.min(start + questionsPerPage.value, fullLabels.value.length);
  return { start, end };
});

/**
 * ดึง labels สำหรับหน้าปัจจุบัน
 */
const paginatedLabels = computed(() => {
  const { start, end } = currentQuestionRange.value;
  return fullLabels.value.slice(start, end);
});

/**
 * ข้อมูลสำหรับ pagination buttons
 */
const paginationButtons = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const buttons = [];
  
  // แสดงเฉพาะหน้าบางหน้าถ้ามีเยอะ
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      buttons.push(i);
    }
  } else {
    buttons.push(1);
    if (current > 3) buttons.push('...');
    
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    
    for (let i = start; i <= end; i++) {
      buttons.push(i);
    }
    
    if (current < total - 2) buttons.push('...');
    buttons.push(total);
  }
  
  return buttons;
});

/**
 * เปลี่ยนหน้า
 */
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

/**
 * จัดเตรียมข้อมูลสำหรับแสดงกราฟ (พร้อม pagination)
 */
const chartData = computed(() => {
  if (!chartAPIData.value || isLoading.value || fullLabels.value.length === 0) {
    return null;
  }

  const positionLabel = getPositionLabel();
  const companyLabel = getCompanyLabel();
  const { start, end } = currentQuestionRange.value;

  if (isCompareMode.value) {
    return {
      labels: paginatedLabels.value,
      datasets: [
        {
          label: `${positionLabel} - ${companyLabel} (ปัจจุบัน)`,
          scoreCounts: chartAPIData.value.current.slice(start, end)
        },
        {
          label: `${positionLabel} - ${companyLabel} (อนาคต)`,
          scoreCounts: chartAPIData.value.future.slice(start, end)
        }
      ]
    };
  } else {
    const dataKey = selectedTimeframe.value;
    const timeLabel = dataKey === 'current' ? 'ปัจจุบัน' : 'คาดในอนาคต';
    return {
      labels: paginatedLabels.value,
      datasets: [{
        label: `${positionLabel} - ${companyLabel} (${timeLabel})`,
        scoreCounts: chartAPIData.value[dataKey].slice(start, end)
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
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          
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

          <!-- ตัวกรอง Category (ใหม่) -->
          <div class="space-y-2">
            <label 
              for="category-select" 
              class="block text-sm font-medium text-gray-700"
            >
              เลือกหมวดหมู่
            </label>
            <select
              id="category-select"
              v-model="selectedCategory"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
            >
              <option 
                v-for="option in categoryOptions" 
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
            <span class="px-2 py-1 bg-green-50 text-green-700 rounded">
              {{ getCompanyLabel() }}
            </span>
            <span class="text-gray-400">•</span>
            <span class="px-2 py-1 bg-blue-50 text-blue-700 rounded">
              {{ getPositionLabel() }}
            </span>
            <span class="text-gray-400">•</span>
            <span class="px-2 py-1 bg-indigo-50 text-indigo-700 rounded">
              {{ getCategoryLabel() }}
            </span>
            <span class="text-gray-400">•</span>
            <span class="px-2 py-1 bg-purple-50 text-purple-700 rounded">
              ปี {{ selectedYear }}
            </span>
            <span class="text-gray-400">•</span>
            <span class="px-2 py-1 bg-orange-50 text-orange-700 rounded">
              {{ timeframeOptions.find(opt => opt.value === selectedTimeframe)?.label }}
            </span>
            <span v-if="totalPages > 1" class="text-gray-400">•</span>
            <span v-if="totalPages > 1" class="px-2 py-1 bg-gray-50 text-gray-700 rounded">
              หน้า {{ currentPage }} จาก {{ totalPages }} (คำถามที่ {{ currentQuestionRange.start + 1 }}-{{ currentQuestionRange.end }})
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

        <!-- ========================================
             ส่วน Pagination Controls (ใหม่)
             ======================================== -->
        <div v-if="!isLoading && chartData" class="mt-6 pt-4 border-t border-gray-200">
          <div class="flex items-center justify-between flex-wrap gap-4">
            <!-- ข้อมูลหน้าปัจจุบัน -->
            <div class="text-sm text-gray-700">
              แสดงคำถามที่ <span class="font-semibold">{{ currentQuestionRange.start + 1 }}</span> ถึง 
              <span class="font-semibold">{{ currentQuestionRange.end }}</span> จากทั้งหมด 
              <span class="font-semibold">{{ fullLabels.length }}</span> คำถาม
            </div>

            <!-- Pagination Controls Container -->
            <div class="flex items-center gap-4">
              <!-- Pagination Buttons (แสดงเฉพาะเมื่อมีหลายหน้า) -->
              <nav v-if="totalPages > 1" class="flex items-center space-x-1">
              <!-- ปุ่มย้อนกลับ -->
              <button
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
                :class="currentPage === 1 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-100'"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <!-- ปุ่มหมายเลขหน้า -->
              <template v-for="(page, index) in paginationButtons" :key="index">
                <span 
                  v-if="page === '...'" 
                  class="px-3 py-1.5 text-sm text-gray-500"
                >
                  ...
                </span>
                <button
                  v-else
                  @click="goToPage(page)"
                  class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
                  :class="currentPage === page
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'"
                >
                  {{ page }}
                </button>
              </template>

              <!-- ปุ่มถัดไป -->
              <button
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
                :class="currentPage === totalPages 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-gray-700 hover:bg-gray-100'"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              </nav>

              <!-- ตัวเลือกจำนวนต่อหน้า (แสดงเสมอ) -->
              <div class="flex items-center space-x-2">
                <label for="per-page" class="text-sm text-gray-700">แสดง:</label>
                <select
                  id="per-page"
                  v-model.number="questionsPerPage"
                  @change="currentPage = 1"
                  class="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option :value="10">10</option>
                  <option :value="20">20</option>
                  <option :value="30">30</option>
                  <option :value="50">50</option>
                </select>
                <span class="text-sm text-gray-700">คำถาม/หน้า</span>
              </div>
            </div>
          </div>
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

button {
  transition: all 0.15s ease;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>