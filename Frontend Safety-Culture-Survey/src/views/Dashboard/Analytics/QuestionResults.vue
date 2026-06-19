<!-- QuestionResults.vue -->
<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { axiosAuth as axios } from '../../../utils/apiClient';
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

// ✅ เก็บทั้ง id และ label คู่กัน เพื่อจับคู่กับข้อมูลกราฟแบบแม่นยำ
// แทนที่จะพึ่ง index ของ array ล้วนๆ ซึ่งเป็นสาเหตุที่ทำให้ label เลื่อน
// เมื่อลำดับคำถามจาก /api/analytics/questions กับ /api/analytics/question-results ไม่ตรงกัน
const fullQuestionMeta = ref([]); // [{ id, label }]
const allQuestions = ref([]);
const chartAPIData = ref(null);
const isLoading = ref(true);

// labels แบบ string ล้วน (ไว้ใช้ที่อื่นที่ต้องการแค่ label เช่นนับจำนวนทั้งหมด)
const fullLabels = computed(() => fullQuestionMeta.value.map(q => q.label));

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
 * ดึงข้อมูลคำถามจาก analytics endpoint
 * ✅ ใช้ /api/analytics/questions แทน /api/questions
 *    เพื่อรองรับ SuperAdmin และไม่ต้องส่ง companyIds
 */
const fetchQuestions = async () => {
  try {
    const response = await axios.get('/api/analytics/questions');
    allQuestions.value = response.data;
    updateLabels();
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลคำถาม:', error);
  }
};

/**
 * อัพเดท labels ตาม category ที่เลือก
 * ✅ เรียงตาม id เสมอ และเก็บ id กำกับไว้กับทุก label
 *    เพื่อให้จับคู่กับ chartAPIData ด้วย id ได้ ไม่พึ่ง index เพียงอย่างเดียว
 */
const updateLabels = () => {
  let filteredQuestions = allQuestions.value;

  if (selectedCategory.value !== 'All') {
    filteredQuestions = filteredQuestions.filter(
      q => q.categoryId === parseInt(selectedCategory.value)
    );
  }

  // เรียงตาม id เสมอ กันกรณี backend ส่งลำดับไม่นิ่ง/ไม่ตรงกันระหว่าง endpoint
  filteredQuestions = [...filteredQuestions].sort((a, b) => a.id - b.id);

  const maxLength = 25;
  fullQuestionMeta.value = filteredQuestions.map((q, index) => {
    const truncated = q.text.length > maxLength
      ? q.text.substring(0, maxLength) + '...'
      : q.text;
    return {
      id: q.id,
      label: `Q${index + 1}: ${truncated}`
    };
  });
};

/**
 * ดึงข้อมูลบริษัททั้งหมดจาก API
 */
const fetchCompanies = async () => {
  try {
    const response = await axios.get('/api/analytics/companies');
    const companies = response.data.map(company => ({
      value: company.name,
      label: company.name
    }));
    companies.sort((a, b) => a.label.localeCompare(b.label));
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

    // ⚠️ WORKAROUND ฝั่ง frontend สำหรับบั๊กที่ backend ส่ง array เกินมา 1 รายการ
    // (เช่น current.length === 81 ทั้งที่มีคำถามจริง 80 ข้อ)
    // โดยรายการแรก (index 0) เป็นค่า all-zero placeholder ที่เกิดจาก backend
    // สร้าง array แบบ 1-indexed (ใช้ questionId เป็น index ตรงๆ โดยไม่ลบ 1)
    // ทำให้ index 0 ไม่เคยถูกเขียนค่าจริง และข้อมูลของทุกคำถามเลื่อนไปข้างหน้า 1 ตำแหน่ง
    //
    // ทางแก้ที่ถูกต้องคือแก้ที่ backend ให้ใช้ index แบบ 0-indexed
    // (เช่น results[questionId - 1] = scores แทน results[questionId] = scores)
    // โค้ดด้านล่างนี้เป็นแค่ safety-net ฝั่ง frontend ระหว่างรอแก้ backend
const stripLeadingPlaceholder = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return arr;

  const isAllZero = (scores) =>
    scores && [1, 2, 3, 4, 5].every(level => !scores[level]);

  // Backend มี 1-indexed bug → index 0 จะเป็น all-zero เสมอ
  // ตัดออกเฉพาะกรณีที่จำนวนเกินมาพอดี 1 และตัวแรกเป็น all-zero
  if (arr.length === allQuestions.value.length + 1 && isAllZero(arr[0])) {
    return arr.slice(1); // ✅ ตัด placeholder ออก ไม่ต้อง warn แล้ว
  }

  return arr;
};

    chartAPIData.value = {
      ...data,
      current: stripLeadingPlaceholder(data.current),
      future: stripLeadingPlaceholder(data.future),
    };
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
  currentPage.value = 1;
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

const totalPages = computed(() => {
  return Math.ceil(fullQuestionMeta.value.length / questionsPerPage.value);
});

const currentQuestionRange = computed(() => {
  const start = (currentPage.value - 1) * questionsPerPage.value;
  const end = Math.min(start + questionsPerPage.value, fullQuestionMeta.value.length);
  return { start, end };
});

// meta (id + label) เฉพาะหน้าปัจจุบัน — ใช้จับคู่กับข้อมูลกราฟ
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
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

/**
 * ✅ จับคู่ scoreCounts กับคำถามด้วย questionId แทนการพึ่ง index ตรงๆ
 * รองรับ 2 รูปแบบที่ backend อาจส่งมา:
 *   1) array เรียงตามลำดับเดียวกับ allQuestions (เรียงตาม id)
 *   2) object/map ที่ผูกกับ questionId เช่น { "12": {1:8,2:5,...}, "15": {...} }
 *
 * ถ้าจำนวนข้อมูลไม่ตรงกับจำนวนคำถามทั้งหมด จะ warn ใน console
 * เพื่อให้รู้ทันทีว่าควรตรวจสอบฝั่ง backend (แนะนำให้ backend ส่ง questionId
 * กำกับมาด้วยเสมอ จะตัดปัญหานี้ได้ถาวร)
 */
const alignScoresToMeta = (rawScores, metaList) => {
  const emptyScore = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  if (!rawScores) return metaList.map(() => emptyScore);

  // กรณี backend ส่งเป็น object/map ผูกกับ questionId
  if (!Array.isArray(rawScores)) {
    return metaList.map(q => rawScores[q.id] ?? emptyScore);
  }

  // กรณี backend ส่งเป็น array — ต้องเรียงตามลำดับเดียวกับ allQuestions (เรียงตาม id)
  if (rawScores.length !== allQuestions.value.length) {
    console.warn(
      `[QuestionResults] จำนวนข้อมูลกราฟ (${rawScores.length}) ไม่ตรงกับจำนวนคำถามทั้งหมด (${allQuestions.value.length}) ` +
      `— label อาจเลื่อนไม่ตรงกับข้อมูล กรุณาตรวจสอบว่า backend ส่ง questionId กำกับมาด้วยหรือไม่`
    );
  }

  const sortedQuestions = [...allQuestions.value].sort((a, b) => a.id - b.id);
  const idToScore = new Map(sortedQuestions.map((q, i) => [q.id, rawScores[i]]));
  return metaList.map(q => idToScore.get(q.id) ?? emptyScore);
};

const chartData = computed(() => {
  if (!chartAPIData.value || isLoading.value || fullQuestionMeta.value.length === 0) {
    return null;
  }

  const positionLabel = getPositionLabel();
  const companyLabel = getCompanyLabel();
  const meta = pagedQuestionMeta.value;
  const labels = meta.map(q => q.label);

  if (isCompareMode.value) {
    return {
      labels,
      datasets: [
        {
          label: `${positionLabel} - ${companyLabel} (ปัจจุบัน)`,
          scoreCounts: alignScoresToMeta(chartAPIData.value.current, meta)
        },
        {
          label: `${positionLabel} - ${companyLabel} (อนาคต)`,
          scoreCounts: alignScoresToMeta(chartAPIData.value.future, meta)
        }
      ]
    };
  } else {
    const dataKey = selectedTimeframe.value;
    const timeLabel = dataKey === 'current' ? 'ปัจจุบัน' : 'คาดในอนาคต';
    return {
      labels,
      datasets: [{
        label: `${positionLabel} - ${companyLabel} (${timeLabel})`,
        scoreCounts: alignScoresToMeta(chartAPIData.value[dataKey], meta)
      }]
    };
  }
});
</script>

<template>
  <div class="flex min-h-screen bg-gray-50">
    <NavbarDashboard />

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

      <!-- ส่วนตัวกรองข้อมูล -->
      <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

          <!-- ตัวกรองบริษัท -->
          <div class="space-y-2">
            <label for="company-select" class="block text-sm font-medium text-gray-700">
              เลือกบริษัท
            </label>
            <select
              id="company-select"
              v-model="selectedCompany"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
            >
              <option v-for="option in companyOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- ตัวกรองตำแหน่ง -->
          <div class="space-y-2">
            <label for="position-select" class="block text-sm font-medium text-gray-700">
              เลือกตำแหน่ง
            </label>
            <select
              id="position-select"
              v-model="selectedPosition"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
            >
              <option v-for="option in positionOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- ตัวกรอง Category -->
          <div class="space-y-2">
            <label for="category-select" class="block text-sm font-medium text-gray-700">
              เลือกหมวดหมู่
            </label>
            <select
              id="category-select"
              v-model="selectedCategory"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
            >
              <option v-for="option in categoryOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- ตัวกรองปี -->
          <div class="space-y-2">
            <label for="year-select" class="block text-sm font-medium text-gray-700">
              เลือกปี
            </label>
            <select
              id="year-select"
              v-model="selectedYear"
              :disabled="availableYears.length === 0"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              <option v-if="availableYears.length === 0" :value="null">ไม่มีข้อมูลปี</option>
              <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>

          <!-- ตัวกรองช่วงเวลา -->
          <div class="space-y-2">
            <label for="timeframe-select" class="block text-sm font-medium text-gray-700">
              ช่วงเวลา
            </label>
            <select
              id="timeframe-select"
              v-model="selectedTimeframe"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
            >
              <option v-for="option in timeframeOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- สรุปตัวกรองที่เลือก -->
        <div class="mt-4 pt-4 border-t border-gray-200">
          <div class="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span class="font-semibold text-gray-700">กำลังแสดง:</span>
            <span class="px-2 py-1 bg-green-50 text-green-700 rounded">{{ getCompanyLabel() }}</span>
            <span class="text-gray-400">•</span>
            <span class="px-2 py-1 bg-blue-50 text-blue-700 rounded">{{ getPositionLabel() }}</span>
            <span class="text-gray-400">•</span>
            <span class="px-2 py-1 bg-indigo-50 text-indigo-700 rounded">{{ getCategoryLabel() }}</span>
            <span class="text-gray-400">•</span>
            <span class="px-2 py-1 bg-purple-50 text-purple-700 rounded">ปี {{ selectedYear }}</span>
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

      <!-- ส่วนแสดงกราฟ -->
      <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <header class="mb-6 pb-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-800">{{ getPositionLabel() }}</h2>
          <p class="text-sm text-gray-500 mt-1">{{ getCompanyLabel() }}</p>
        </header>

        <!-- Loading -->
        <div v-if="isLoading" class="flex justify-center items-center" style="height: 450px;">
          <p class="text-gray-500">กำลังโหลดข้อมูล...</p>
        </div>

        <!-- กราฟ -->
        <div v-else-if="chartData && chartData.datasets" class="w-full" style="height: 450px;">
          <StackedBar
            :chart-data="chartData"
            :bar-percentage="0.5"
            :category-percentage="0.6"
          />
        </div>

        <!-- ไม่พบข้อมูล -->
        <div v-else class="flex flex-col justify-center items-center text-center" style="height: 450px;">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">ไม่พบข้อมูล</h3>
          <p class="mt-2 text-sm text-gray-500">ไม่พบข้อมูลสำหรับการเลือกปัจจุบัน กรุณาเลือกตัวกรองอื่น</p>
        </div>

        <!-- Pagination Controls -->
        <div v-if="!isLoading && chartData" class="mt-6 pt-4 border-t border-gray-200">
          <div class="flex items-center justify-between flex-wrap gap-4">

            <!-- ข้อมูลหน้าปัจจุบัน -->
            <div class="text-sm text-gray-700">
              แสดงคำถามที่ <span class="font-semibold">{{ currentQuestionRange.start + 1 }}</span> ถึง
              <span class="font-semibold">{{ currentQuestionRange.end }}</span> จากทั้งหมด
              <span class="font-semibold">{{ fullQuestionMeta.length }}</span> คำถาม
            </div>

            <div class="flex items-center gap-4">
              <!-- Pagination Buttons -->
              <nav v-if="totalPages > 1" class="flex items-center space-x-1">
                <button
                  @click="goToPage(currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
                  :class="currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <template v-for="(page, index) in paginationButtons">
                  <span
                    v-if="page === '...'"
                    :key="`dots-${index}`"
                    class="px-3 py-1.5 text-sm text-gray-500"
                  >...</span>
                  <button
                    v-else
                    :key="`page-${index}`"
                    @click="goToPage(page)"
                    class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
                    :class="currentPage === page ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-gray-700 hover:bg-gray-100'"
                  >{{ page }}</button>
                </template>

                <button
                  @click="goToPage(currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
                  :class="currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </nav>

              <!-- จำนวนต่อหน้า -->
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