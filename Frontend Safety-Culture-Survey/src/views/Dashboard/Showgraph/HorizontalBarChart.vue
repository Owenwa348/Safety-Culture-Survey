<!-- HorizontalBarChart.vue -->
<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm mb-6 p-6 border border-gray-200">
        <h1 class="text-2xl font-semibold text-gray-900 mb-2">
          การวิเคราะห์การประเมินประจำปี {{ selectedYear }}
        </h1>
        <p class="text-sm text-gray-600 mb-6">
          การเปรียบเทียบผลการกระจายตัวของข้อมูลตามระดับแต่ละหมวดหมู่ระหว่างปัจจุบันและอนาคต
        </p>
        
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-4">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p class="mt-2 text-sm text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>

        <!-- Error State -->
        <div v-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <p class="text-sm text-red-800">{{ error }}</p>
          <button 
            @click="fetchData" 
            class="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
        
        <!-- Filters -->
        <div v-if="!loading" class="space-y-4">
          <!-- Row 1: Year, Company, View -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium text-gray-700">ปี</label>
              <select 
                v-model="selectedYear" 
                @change="onYearChange"
                class="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20stroke=%27%236b7280%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%271.5%27%20d=%27M6%208l4%204%204-4%27/%3e%3c/svg%3e')] bg-[length:1.25em_1.25em] bg-[right_0.5rem_center] bg-no-repeat pr-10"
              >
                <option v-for="year in availableYears" :key="year" :value="year">
                  {{ year }}
                </option>
              </select>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium text-gray-700">บริษัท</label>
              <select 
                v-model="selectedCompany" 
                @change="onCompanyChange"
                class="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20stroke=%27%236b7280%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%271.5%27%20d=%27M6%208l4%204%204-4%27/%3e%3c/svg%3e')] bg-[length:1.25em_1.25em] bg-[right_0.5rem_center] bg-no-repeat pr-10"
              >
                <option value="combined">บริษัททั้งหมด</option>
                <option v-for="company in companies" :key="company.id" :value="company.id">
                  {{ company.name }}
                </option>
              </select>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium text-gray-700">แสดงข้อมูล</label>
              <select 
                v-model="selectedView" 
                class="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20stroke=%27%236b7280%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%271.5%27%20d=%27M6%208l4%204%204-4%27/%3e%3c/svg%3e')] bg-[length:1.25em_1.25em] bg-[right_0.5rem_center] bg-no-repeat pr-10"
              >
                <option value="both">เปรียบเทียบ (ปัจจุบัน กับ อนาคต)</option>
                <option value="current">ปัจจุบัน</option>
                <option value="future">อนาคต</option>
              </select>
            </div>
          </div>

          <!-- Row 2: Category and Question -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium text-gray-700">หมวดหมู่</label>
              <select 
                v-model="selectedCategory" 
                @change="onCategoryChange"
                class="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20stroke=%27%236b7280%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%271.5%27%20d=%27M6%208l4%204%204-4%27/%3e%3c/svg%3e')] bg-[length:1.25em_1.25em] bg-[right_0.5rem_center] bg-no-repeat pr-10"
              >
                <option v-for="(category, index) in categories" :key="category.id" :value="index">
                  {{ index + 1 }}. {{ category.name }}
                </option>
              </select>
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-sm font-medium text-gray-700">คำถาม</label>
              <select 
                v-model="selectedQuestion" 
                @change="onQuestionChange"
                class="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20stroke=%27%236b7280%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%271.5%27%20d=%27M6%208l4%204%204-4%27/%3e%3c/svg%3e')] bg-[length:1.25em_1.25em] bg-[right_0.5rem_center] bg-no-repeat pr-10"
              >
                <option 
                  v-for="question in availableQuestions" 
                  :key="question.id" 
                  :value="question.id"
                >
                  {{ question.number }} {{ question.text }}
                </option>
              </select>
              <!-- แสดง placeholder ถ้าไม่มีคำถามในหมวดหมู่นี้ -->
              <p v-if="availableQuestions.length === 0" class="text-xs text-gray-400 mt-1">
                ไม่มีคำถามในหมวดหมู่นี้
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Chart -->
      <div v-if="!loading && chartData" class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-6 py-5 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900 mb-1">
            {{ selectedCategory + 1 }}. {{ categories[selectedCategory]?.name }}
          </h2>
          <p class="text-sm text-gray-600 mb-3">
            {{ getCompanyName }} · การกระจายของคะแนนในแต่ละระดับ (1-5)
          </p>
          <div class="bg-gray-50 border-l-2 border-gray-400 p-3 rounded">
            <p class="text-sm text-gray-800">
              {{ selectedQuestionText }}
            </p>
          </div>
        </div>
        
        <div class="px-6 py-6">
          <!-- Legend -->
          <div class="flex items-center gap-6 mb-6 pb-4 border-b border-gray-200">
            <div v-if="selectedView === 'both' || selectedView === 'future'" class="flex items-center gap-2">
              <div class="w-4 h-4 rounded bg-emerald-500"></div>
              <span class="text-sm font-medium text-gray-700">อนาคต (เป้าหมาย)</span>
            </div>
            <div v-if="selectedView === 'both' || selectedView === 'current'" class="flex items-center gap-2">
              <div class="w-4 h-4 rounded bg-blue-500"></div>
              <span class="text-sm font-medium text-gray-700">ปัจจุบัน</span>
            </div>
          </div>

          <!-- Chart Container -->
          <div class="relative">
            <div class="flex">
              <!-- Y-axis Labels -->
              <div class="w-12 flex flex-col-reverse justify-between pt-2 h-[400px]">
                <div v-for="score in [1, 2, 3, 4, 5]" :key="score" 
                     class="text-right pr-3 text-sm font-medium text-gray-700 h-20 flex items-center justify-end">
                  {{ score }}
                </div>
              </div>

              <!-- Chart Area -->
              <div class="flex-1 relative">
                <!-- Grid Lines -->
                <div class="absolute inset-0 flex flex-col-reverse justify-between pt-2 h-[400px]">
                  <div v-for="i in 6" :key="i" class="border-t border-gray-200"></div>
                </div>

                <!-- Bars -->
                <div class="relative flex flex-col-reverse justify-between pt-2 h-[400px]">
                  <div v-for="score in [1, 2, 3, 4, 5]" :key="score" 
                       class="h-20 flex flex-col justify-center px-2"
                       :class="selectedView === 'both' ? 'gap-1.5' : 'gap-0'">
                    <!-- Future Bar -->
                    <div v-if="selectedView === 'both' || selectedView === 'future'"
                      class="bg-emerald-500 rounded transition-all duration-200 flex items-center"
                      :class="selectedView === 'both' ? 'h-7' : 'h-14'"
                      :style="{ width: getBarWidth(chartData.future[score - 1]) }"
                    >
                      <span v-if="chartData.future[score - 1] > 0" 
                            class="text-white text-xs font-medium ml-2">
                        {{ chartData.future[score - 1] }}
                      </span>
                    </div>
                    <!-- Current Bar -->
                    <div v-if="selectedView === 'both' || selectedView === 'current'"
                      class="bg-blue-500 rounded transition-all duration-200 flex items-center"
                      :class="selectedView === 'both' ? 'h-7' : 'h-14'"
                      :style="{ width: getBarWidth(chartData.current[score - 1]) }"
                    >
                      <span v-if="chartData.current[score - 1] > 0" 
                            class="text-white text-xs font-medium ml-2">
                        {{ chartData.current[score - 1] }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- X-axis -->
                <div class="flex justify-between mt-4 px-2">
                  <span v-for="i in 9" :key="i" class="text-xs text-gray-600 font-medium">
                    {{ (i - 1) * 5 }}
                  </span>
                </div>
                <div class="text-center mt-2">
                  <span class="text-sm font-medium text-gray-700">จำนวนคำตอบ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state เมื่อยังไม่มีคำถามให้เลือก -->
      <div v-if="!loading && !selectedQuestion" class="bg-white rounded-lg shadow-sm border border-gray-200 p-10 text-center">
        <p class="text-gray-500">กรุณาเลือกคำถามเพื่อดูข้อมูล</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { apiFetch } from '../../../utils/apiClient';

// =======================================
// State Management
// =======================================
const loading = ref(false);
const error = ref(null);

const availableYears = ref([]);
const companies = ref([]);
const categories = ref([]);
const questions = ref([]);
const surveyData = ref(null);

const selectedYear = ref(new Date().getFullYear());
const selectedCompany = ref('combined');
const selectedCategory = ref(0);
const selectedQuestion = ref(null);
const selectedView = ref('both');

// =======================================
// API Functions
// =======================================

const fetchYears = async () => {
  const response = await apiFetch('/api/analytics/assessment-years');
  if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลปีได้');
  const data = await response.json();
  availableYears.value = data;
  if (data.length > 0) selectedYear.value = data[0];
};

const fetchCompanies = async () => {
  const response = await apiFetch('/api/analytics/companies');
  if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลบริษัทได้');
  companies.value = await response.json();
};

// ✅ ดึง categories จาก stacked-chart-data และ questions จาก analytics/questions
// ทั้งคู่ใช้ auth token อย่างเดียว ไม่ต้องส่ง companyIds จาก frontend
const fetchCategoriesAndQuestions = async () => {
  // ดึง categories
  const catRes = await apiFetch(`/api/analytics/stacked-chart-data?year=${selectedYear.value}`);
  if (!catRes.ok) throw new Error('ไม่สามารถดึงข้อมูลหมวดหมู่ได้');
  const catData = await catRes.json();
  categories.value = catData.categories || [];

  // ✅ ดึง questions ผ่าน endpoint ใหม่ที่ใช้ scope จาก token โดยตรง
  const qRes = await apiFetch('/api/analytics/questions');
  if (!qRes.ok) throw new Error('ไม่สามารถดึงข้อมูลคำถามได้');
  const qData = await qRes.json();

  // เพิ่ม number สำหรับแสดงผล (Q1, Q2, ...)
  questions.value = qData.map((q, index) => ({
    ...q,
    number: `Q${index + 1}`,
  }));
};

const fetchSurveyData = async (questionId, companyId, year) => {
  if (!questionId || !year) {
    surveyData.value = null;
    return;
  }
  const params = new URLSearchParams({
    questionId,
    companyId: companyId || 'combined',
    year,
  });
  const response = await apiFetch(`/api/analytics/survey-data?${params}`);
  if (!response.ok) {
    surveyData.value = null;
    throw new Error('ไม่สามารถดึงข้อมูลกราฟได้');
  }
  surveyData.value = await response.json();
};

const fetchData = async () => {
  loading.value = true;
  error.value = null;

  try {
    // โหลด years และ companies พร้อมกัน
    await Promise.all([fetchYears(), fetchCompanies()]);

    // โหลด categories และ questions
    await fetchCategoriesAndQuestions();

    // เลือกคำถามแรกของหมวดหมู่แรกโดยอัตโนมัติ
    if (categories.value.length > 0 && questions.value.length > 0) {
      const firstCategoryId = categories.value[0]?.id;
      const firstQuestion = questions.value.find(q => q.categoryId === firstCategoryId);
      if (firstQuestion) {
        selectedQuestion.value = firstQuestion.id;
        await fetchSurveyData(firstQuestion.id, selectedCompany.value, selectedYear.value);
      }
    }
  } catch (err) {
    error.value = err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง';
  } finally {
    loading.value = false;
  }
};

// =======================================
// Computed Properties
// =======================================

const availableQuestions = computed(() => {
  const category = categories.value[selectedCategory.value];
  if (!category) return [];
  return questions.value.filter(q => q.categoryId === category.id);
});

const selectedQuestionText = computed(() => {
  const question = questions.value.find(q => q.id === selectedQuestion.value);
  return question ? `${question.number} ${question.text}` : 'กรุณาเลือกคำถาม';
});

const getCompanyName = computed(() => {
  if (selectedCompany.value === 'combined') return 'บริษัททั้งหมด';
  const company = companies.value.find(c => c.id === selectedCompany.value);
  return company ? company.name : '';
});

const chartData = computed(() => {
  if (!surveyData.value) return { current: [0, 0, 0, 0, 0], future: [0, 0, 0, 0, 0] };
  return {
    current: surveyData.value.current || [0, 0, 0, 0, 0],
    future: surveyData.value.future || [0, 0, 0, 0, 0],
  };
});

const maxValue = computed(() => {
  if (!chartData.value) return 40;
  const allValues = [...chartData.value.current, ...chartData.value.future];
  const max = Math.max(...allValues);
  return max > 0 ? Math.ceil(max / 5) * 5 : 40;
});

// =======================================
// Methods
// =======================================

const getBarWidth = (value) => {
  if (value === 0) return '0%';
  const width = (value / maxValue.value) * 100;
  return `${Math.min(width, 100)}%`;
};

const handleDataFetch = async () => {
  if (!selectedQuestion.value) return;
  loading.value = true;
  error.value = null;
  try {
    await fetchSurveyData(selectedQuestion.value, selectedCompany.value, selectedYear.value);
  } catch (err) {
    error.value = err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล';
  } finally {
    loading.value = false;
  }
};

const onYearChange = async () => {
  await handleDataFetch();
};

const onCategoryChange = async () => {
  // เลือกคำถามแรกของหมวดหมู่ที่เปลี่ยนไป
  const firstQuestion = availableQuestions.value[0];
  if (firstQuestion) {
    selectedQuestion.value = firstQuestion.id;
    await handleDataFetch();
  } else {
    selectedQuestion.value = null;
    surveyData.value = null;
  }
};

const onQuestionChange = async () => {
  await handleDataFetch();
};

const onCompanyChange = async () => {
  await handleDataFetch();
};

// =======================================
// Lifecycle Hooks
// =======================================

onMounted(() => {
  fetchData();
});
</script>