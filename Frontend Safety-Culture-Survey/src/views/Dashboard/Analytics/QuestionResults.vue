<!-- QuestionResults.vue -->
<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { axiosAuth as axios } from '../../../utils/apiClient';
import StackedBar from "../Showgraph/StackedBar.vue";
import NavbarDashboard from '../../../components/NavbarDashboard.vue';

// ========================================
// SECTION 1: STATE
// ========================================
const selectedPosition = ref("All");
const selectedCompany = ref("All");
const selectedCategory = ref("All");
const selectedTimeframe = ref("compare");
const selectedYear = ref(null);
const currentPage = ref(1);
const questionsPerPage = ref(20);

const fullQuestionMeta = ref([]);
const allQuestions = ref([]);
const chartAPIData = ref(null);
const isLoading = ref(true);

// [แก้ไข #1] ลบ fullLabels computed ที่ไม่ได้ใช้งานออก (dead code)
// — เดิมประกาศไว้แต่ไม่มีที่ไหนในไฟล์ reference ถึงเลย

// [แก้ไข #2] เพิ่ม fetchError สำหรับแจ้ง user
// — เดิม catch error แล้ว console.error ทิ้ง user ไม่รู้ว่า error
const fetchError = ref(null);

// [แก้ไข #3] AbortController สำหรับยกเลิก request เก่า
// — ป้องกัน race condition เมื่อ user เปลี่ยน filter เร็วๆ
const abortController = ref(null);

// ========================================
// SECTION 2: DROPDOWN OPTIONS
// ========================================
const positionOptions = ref([{ value: "All", label: "ทุกตำแหน่ง" }]);
const companyOptions = ref([{ value: "All", label: "ทุกบริษัท" }]);
const categoryOptions = ref([{ value: "All", label: "ทุกหมวดหมู่" }]);

const timeframeOptions = [
  { value: "compare", label: "เปรียบเทียบ (ปัจจุบัน vs เป้าหมาย)" },
  { value: "current", label: "ปัจจุบัน" },
  { value: "future", label: "คาดการณ์เป้าหมาย" },
];

const availableYears = ref([]);

// ========================================
// SECTION 3: API FUNCTIONS
// ========================================
const fetchQuestions = async () => {
  try {
    const response = await axios.get('/api/analytics/questions');
    allQuestions.value = response.data;
    updateLabels();
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลคำถาม:', error);
  }
};

const updateLabels = () => {
  let filtered = allQuestions.value;

  if (selectedCategory.value !== 'All') {
    filtered = filtered.filter(q => q.categoryId === parseInt(selectedCategory.value));
  }

  filtered = [...filtered].sort((a, b) => a.id - b.id);

  const maxLength = 25;
  fullQuestionMeta.value = filtered.map((q, index) => ({
    id: q.id,
    label: `Q${index + 1}: ${q.text.length > maxLength ? q.text.substring(0, maxLength) + '...' : q.text}`,
  }));
};

const fetchCompanies = async () => {
  try {
    const response = await axios.get('/api/analytics/companies');
    const companies = response.data
      .map(c => ({ value: c.name, label: c.name }))
      .sort((a, b) => a.label.localeCompare(b.label));
    companyOptions.value.push(...companies);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลบริษัท:', error);
  }
};

const fetchCategories = async () => {
  try {
    const response = await axios.get('/api/categories');
    const categories = response.data.map(c => ({
      value: c.id.toString(),
      label: c.name,
    }));
    categoryOptions.value.push(...categories);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูล Category:', error);
  }
};

const fetchPositions = async () => {
  try {
    const response = await axios.get('/api/positions');
    const positions = response.data.map(p => ({ value: p.name, label: p.name }));
    positionOptions.value.push(...positions);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลตำแหน่ง:', error);
  }
};

const fetchYears = async () => {
  try {
    const { data } = await axios.get('/api/analytics/assessment-years');
    availableYears.value = data;
    if (data.length > 0) selectedYear.value = data[0];
  } catch (err) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลปี:', err);
  }
};

// [แก้ไข #4] fetchChartData — ใช้ AbortController + set fetchError
// — ยกเลิก request เก่าก่อนทุกครั้ง
// — set fetchError เมื่อ fetch ไม่สำเร็จ แทนที่จะ set null เงียบๆ
// — ไม่ set error ถ้าเป็น AbortError (ยกเลิกตั้งใจ ไม่ใช่ error จริง)
const fetchChartData = async () => {
  if (!selectedYear.value) {
    isLoading.value = false;
    return;
  }

  // ยกเลิก request เก่าถ้ายังวิ่งอยู่
  if (abortController.value) abortController.value.abort();
  abortController.value = new AbortController();

  isLoading.value = true;
  fetchError.value = null;
  chartAPIData.value = null;

  try {
    const params = {
      year: selectedYear.value,
      company: selectedCompany.value,
      position: selectedPosition.value,
      categoryId: selectedCategory.value,
    };

    const { data } = await axios.get('/api/analytics/question-results', {
      params,
      signal: abortController.value.signal,
    });

    const stripLeadingPlaceholder = (arr) => {
      if (!Array.isArray(arr) || arr.length === 0) return arr;
      const isAllZero = (scores) => scores && [1, 2, 3, 4, 5].every(level => !scores[level]);
      if (arr.length === allQuestions.value.length + 1 && isAllZero(arr[0])) {
        return arr.slice(1);
      }
      return arr;
    };

    chartAPIData.value = {
      ...data,
      current: stripLeadingPlaceholder(data.current),
      future: stripLeadingPlaceholder(data.future),
    };
  } catch (error) {
    // [แก้ไข #5] ไม่ set error ถ้าเป็น AbortError หรือ axios cancel
    if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') return;
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลกราฟ:', error);
    fetchError.value = 'โหลดข้อมูลกราฟไม่สำเร็จ กรุณาลองใหม่อีกครั้ง';
    chartAPIData.value = null;
  } finally {
    isLoading.value = false;
  }
};

// ========================================
// SECTION 4: LIFECYCLE & WATCHERS
// ========================================
onMounted(async () => {
  await Promise.all([
    fetchQuestions(),
    fetchPositions(),
    fetchYears(),
    fetchCompanies(),
    fetchCategories(),
  ]);

  if (selectedYear.value) {
    fetchChartData();
  } else {
    isLoading.value = false;
  }
});

// [แก้ไข #6] cleanup เมื่อ component ถูก unmount
// — ยกเลิก request ที่ค้างอยู่ทันที ป้องกัน memory leak
onUnmounted(() => {
  if (abortController.value) abortController.value.abort();
});

watch(
  [selectedYear, selectedCompany, selectedPosition, selectedCategory],
  () => {
    currentPage.value = 1;
    fetchChartData();
  },
  { deep: true }
);

watch(selectedCategory, updateLabels);

// ========================================
// SECTION 5: COMPUTED
// ========================================
const isCompareMode = computed(() => selectedTimeframe.value === "compare");

const getPositionLabel = () =>
  positionOptions.value.find(o => o.value === selectedPosition.value)?.label ?? selectedPosition.value;

const getCompanyLabel = () =>
  companyOptions.value.find(o => o.value === selectedCompany.value)?.label ?? selectedCompany.value;

const getCategoryLabel = () =>
  categoryOptions.value.find(o => o.value === selectedCategory.value)?.label ?? 'ทุกหมวดหมู่';

const totalPages = computed(() =>
  Math.ceil(fullQuestionMeta.value.length / questionsPerPage.value)
);

const currentQuestionRange = computed(() => {
  const start = (currentPage.value - 1) * questionsPerPage.value;
  const end = Math.min(start + questionsPerPage.value, fullQuestionMeta.value.length);
  return { start, end };
});

const pagedQuestionMeta = computed(() => {
  const { start, end } = currentQuestionRange.value;
  return fullQuestionMeta.value.slice(start, end);
});

const paginationButtons = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const buttons = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) buttons.push(i);
  } else {
    buttons.push(1);
    if (current > 3) buttons.push('...');
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) buttons.push(i);
    if (current < total - 2) buttons.push('...');
    buttons.push(total);
  }

  return buttons;
});

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page;
};

// ========================================================
// alignScoresToMeta
// ========================================================
// backend ส่ง rawScores เป็น array ของ **คำถามทั้งหมด** ที่ตรงกับ filter
//   current: [ {1:0, 2:3, 3:5, 4:2, 5:0}, ... ]  index 0 = คำถามแรก
//   future:  [ {1:0, 2:1, 3:4, 4:3, 5:1}, ... ]
//
// metaList = pagedQuestionMeta (เฉพาะหน้าปัจจุบัน เช่น index 10-19 ของหน้า 2)
// startIndex = currentQuestionRange.start = offset จริงใน rawScores
//
// ❌ ถ้า map ด้วย i โดยตรง: metaList[0] จะได้ rawScores[0] เสมอ
//    ทำให้หน้า 2 แสดงข้อมูลของหน้า 1 ซ้ำ
// ✅ ต้อง map ด้วย startIndex + i เพื่อ offset ให้ถูกหน้า
// ========================================================
const alignScoresToMeta = (rawScores, metaList, startIndex = 0) => {
  const emptyScore = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  if (!rawScores) return metaList.map(() => emptyScore);

  if (Array.isArray(rawScores)) {
    // ใช้ startIndex เป็น offset เพื่อให้ได้ข้อมูลถูกหน้า
    return metaList.map((_, i) => rawScores[startIndex + i] ?? emptyScore);
  }

  // fallback: object ผูกกับ questionId
  return metaList.map(q => rawScores[String(q.id)] ?? rawScores[q.id] ?? emptyScore);
};

const chartData = computed(() => {
  if (!chartAPIData.value || isLoading.value || fullQuestionMeta.value.length === 0) return null;

  const positionLabel = getPositionLabel();
  const companyLabel = getCompanyLabel();
  const meta = pagedQuestionMeta.value;
  const labels = meta.map(q => q.label);

  // startIndex คือ offset ของหน้าปัจจุบันใน rawScores ทั้งหมด
  // เช่น หน้า 2 แสดง 10/หน้า → startIndex = 10
  const startIndex = currentQuestionRange.value.start;
  // Debug logs removed to avoid leaking internal chart data in console

  if (isCompareMode.value) {
    return {
      labels,
      datasets: [
        {
          label: `${positionLabel} - ${companyLabel} (ปัจจุบัน)`,
          scoreCounts: alignScoresToMeta(chartAPIData.value.current, meta, startIndex),
        },
        {
          label: `${positionLabel} - ${companyLabel} (เป้าหมาย)`,
          scoreCounts: alignScoresToMeta(chartAPIData.value.future, meta, startIndex),
        },
      ],
    };
  }

  const dataKey = selectedTimeframe.value;
  const timeLabel = dataKey === 'current' ? 'ปัจจุบัน' : 'คาดการณ์เป้าหมาย';
  return {
    labels,
    datasets: [{
      label: `${positionLabel} - ${companyLabel} (${timeLabel})`,
      scoreCounts: alignScoresToMeta(chartAPIData.value[dataKey], meta, startIndex),
    }],
  };
});
</script>

<template>
  <div class="flex min-h-screen bg-gray-50">
    <NavbarDashboard />

    <main class="flex-1 ml-0 md:ml-60 p-3 sm:p-6">

      <!-- หัวข้อหน้า -->
      <header class="mb-4 sm:mb-6">
        <h1 class="text-lg sm:text-2xl font-bold text-gray-800">ผลประเมินตามข้อคำถาม</h1>
        <p class="text-xs sm:text-sm text-gray-600 mt-1">วิเคราะห์และเปรียบเทียบคะแนนในแต่ละข้อคำถาม</p>
      </header>

      <!-- ส่วนตัวกรองข้อมูล -->
      <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">

          <div class="space-y-2">
            <label for="company-select" class="block text-xs sm:text-sm font-medium text-gray-700">บริษัท</label>
            <select id="company-select" v-model="selectedCompany"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors">
              <option v-for="option in companyOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
            </select>
          </div>

          <div class="space-y-2">
            <label for="position-select" class="block text-xs sm:text-sm font-medium text-gray-700">ตำแหน่ง</label>
            <select id="position-select" v-model="selectedPosition"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors">
              <option v-for="option in positionOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
            </select>
          </div>

          <div class="space-y-2">
            <label for="category-select" class="block text-xs sm:text-sm font-medium text-gray-700">หมวดหมู่</label>
            <select id="category-select" v-model="selectedCategory"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors">
              <option v-for="option in categoryOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
            </select>
          </div>

          <div class="space-y-2">
            <label for="year-select" class="block text-xs sm:text-sm font-medium text-gray-700">ปีที่ประเมิน</label>
            <select id="year-select" v-model="selectedYear" :disabled="availableYears.length === 0"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors">
              <option v-if="availableYears.length === 0" :value="null">ไม่มีข้อมูล</option>
              <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>

          <div class="space-y-2">
            <label for="timeframe-select" class="block text-xs sm:text-sm font-medium text-gray-700">ช่วงเวลา</label>
            <select id="timeframe-select" v-model="selectedTimeframe"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors">
              <option v-for="option in timeframeOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
            </select>
          </div>
        </div>

        <!-- สรุปตัวกรอง -->
        <div class="mt-4 pt-4 border-t border-gray-200">
          <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
            <span class="font-semibold text-gray-700 w-full sm:w-auto">ตัวกรองที่เลือก:</span>
            <span class="px-2 py-1 bg-green-50 text-green-700 rounded">{{ getCompanyLabel() }}</span>
            <span class="text-gray-400 hidden sm:inline">•</span>
            <span class="px-2 py-1 bg-blue-50 text-blue-700 rounded">{{ getPositionLabel() }}</span>
            <span class="text-gray-400 hidden sm:inline">•</span>
            <span class="px-2 py-1 bg-indigo-50 text-indigo-700 rounded">{{ getCategoryLabel() }}</span>
            <span class="text-gray-400 hidden sm:inline">•</span>
            <span class="px-2 py-1 bg-purple-50 text-purple-700 rounded">ปี {{ selectedYear }}</span>
            <span class="text-gray-400 hidden sm:inline">•</span>
            <span class="px-2 py-1 bg-orange-50 text-orange-700 rounded">
              {{ timeframeOptions.find(o => o.value === selectedTimeframe)?.label }}
            </span>
            <template v-if="totalPages > 1">
              <span class="text-gray-400 hidden sm:inline">•</span>
              <span class="px-2 py-1 bg-gray-50 text-gray-700 rounded">
                หน้า {{ currentPage }} / {{ totalPages }} (คำถามที่ {{ currentQuestionRange.start + 1 }}–{{ currentQuestionRange.end }})
              </span>
            </template>
          </div>
        </div>
      </section>

      <!-- ส่วนแสดงกราฟ -->
      <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <header class="mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200">
          <h2 class="text-base sm:text-lg font-semibold text-gray-800">{{ getPositionLabel() }}</h2>
          <p class="text-xs sm:text-sm text-gray-500 mt-1">{{ getCompanyLabel() }}</p>
        </header>

        <!-- Loading -->
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-10 sm:py-12">
          <div class="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-blue-600 mb-3"></div>
          <p class="text-xs sm:text-sm text-gray-500">กำลังโหลดข้อมูล...</p>
        </div>

        <!-- [แก้ไข #7] Error State — แสดง fetchError ให้ user เห็นพร้อมปุ่ม retry -->
        <div v-else-if="fetchError" class="flex flex-col items-center justify-center py-10 sm:py-12 px-4 text-center">
          <div class="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-red-50 rounded-full mb-4">
            <svg class="w-6 h-6 sm:w-7 sm:h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p class="text-sm font-semibold text-gray-500">เกิดข้อผิดพลาด</p>
          <p class="text-xs text-gray-400 mt-1">{{ fetchError }}</p>
          <button
            @click="fetchChartData"
            class="mt-4 text-sm text-blue-600 hover:text-blue-800 underline"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>

        <!-- กราฟ -->
        <div v-else-if="chartData && chartData.datasets" class="w-full h-[320px] sm:h-[450px] overflow-x-auto">
          <StackedBar :chart-data="chartData" :bar-percentage="0.5" :category-percentage="0.6" />
        </div>

        <!-- Empty State -->
        <div v-else class="flex flex-col items-center justify-center py-14 sm:py-16 px-4 text-center">
          <div class="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-full mb-4">
            <svg class="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p class="text-sm font-semibold text-gray-500">ไม่พบข้อมูล</p>
          <p class="text-xs text-gray-400 mt-1">ลองเปลี่ยนปีหรือเงื่อนไขการค้นหา</p>
        </div>

        <!-- Pagination -->
        <div v-if="!isLoading && !fetchError && chartData" class="mt-4 sm:mt-6 pt-4 border-t border-gray-200">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">

            <div class="text-xs sm:text-sm text-gray-700">
              แสดงคำถามที่ <span class="font-semibold">{{ currentQuestionRange.start + 1 }}</span> –
              <span class="font-semibold">{{ currentQuestionRange.end }}</span> จากทั้งหมด
              <span class="font-semibold">{{ fullQuestionMeta.length }}</span> ข้อ
            </div>

            <div class="flex flex-col xs:flex-row items-start xs:items-center gap-3 sm:gap-4">
              <nav v-if="totalPages > 1" class="flex items-center space-x-0.5 sm:space-x-1 flex-wrap">
                <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
                  class="px-2 sm:px-3 py-1 sm:py-1.5 text-sm font-medium rounded-md transition-colors"
                  :class="currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <template v-for="(page, index) in paginationButtons">
                  <span
                    v-if="page === '...'"
                    :key="`dots-${index}`"
                    class="px-2 sm:px-3 py-1 sm:py-1.5 text-sm text-gray-500"
                  >...</span>
                  <button
                    v-else
                    :key="`page-${index}`"
                    @click="goToPage(page)"
                    class="px-2 sm:px-3 py-1 sm:py-1.5 text-sm font-medium rounded-md transition-colors"
                    :class="currentPage === page ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-gray-700 hover:bg-gray-100'"
                  >
                    {{ page }}
                  </button>
                </template>

                <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
                  class="px-2 sm:px-3 py-1 sm:py-1.5 text-sm font-medium rounded-md transition-colors"
                  :class="currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'">
                  <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </nav>

              <div class="flex items-center space-x-2">
                <label for="per-page" class="text-xs sm:text-sm text-gray-700">แสดงหน้าละ:</label>
                <select id="per-page" v-model.number="questionsPerPage" @change="currentPage = 1"
                  class="px-2 py-1 text-xs sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option :value="10">10</option>
                  <option :value="20">20</option>
                  <option :value="30">30</option>
                  <option :value="50">50</option>
                </select>
                <span class="text-xs sm:text-sm text-gray-700">ข้อ</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>

<style scoped>
select { transition: all 0.2s ease; }
select:hover:not(:disabled) { border-color: #9ca3af; }
select:focus { box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
button { transition: all 0.15s ease; }
button:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
