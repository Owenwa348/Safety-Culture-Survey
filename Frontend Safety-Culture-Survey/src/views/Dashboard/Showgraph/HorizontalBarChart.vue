<!-- HorizontalBarChart.vue -->
<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm mb-6 p-6 border border-gray-200">
        <h1 class="text-2xl font-semibold text-gray-900 mb-2">
          การวิเคราะห์การประเมินประจำปี {{ currentYear }}
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
        <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-gray-700">บริษัท</label>
            <select 
              v-model="selectedCompany" 
              @change="onCompanyChange"
              class="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20stroke=%27%236b7280%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%271.5%27%20d=%27M6%208l4%204%204-4%27/%3e%3c/svg%3e')] bg-[length:1.25em_1.25em] bg-[right_0.5rem_center] bg-no-repeat pr-10 hover:border-gray-400"
            >
              <option value="combined">บริษัททั้งหมด</option>
              <option v-for="company in companies" :key="company.id" :value="company.id">
                {{ company.name }}
              </option>
            </select>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-gray-700">หมวดหมู่</label>
            <select 
              v-model="selectedCategory" 
              @change="onCategoryChange"
              class="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20stroke=%27%236b7280%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%271.5%27%20d=%27M6%208l4%204%204-4%27/%3e%3c/svg%3e')] bg-[length:1.25em_1.25em] bg-[right_0.5rem_center] bg-no-repeat pr-10 hover:border-gray-400"
            >
              <option v-for="(category, index) in categories" :key="category.id" :value="index">
                {{ index + 1 }}. {{ category.name }}
              </option>
            </select>
          </div>

          <div class="flex flex-col gap-1.5 lg:col-span-2">
            <label class="text-sm font-medium text-gray-700">คำถาม</label>
            <select 
              v-model="selectedQuestion" 
              @change="onQuestionChange"
              class="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20stroke=%27%236b7280%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%271.5%27%20d=%27M6%208l4%204%204-4%27/%3e%3c/svg%3e')] bg-[length:1.25em_1.25em] bg-[right_0.5rem_center] bg-no-repeat pr-10 hover:border-gray-400"
            >
              <option v-for="question in availableQuestions" :key="question.id" :value="question.id">
                {{ question.number }} {{ question.text }}
              </option>
            </select>
          </div>

          <div class="flex flex-col gap-1.5 lg:col-start-4">
            <label class="text-sm font-medium text-gray-700">แสดงข้อมูล</label>
            <select 
              v-model="selectedView" 
              class="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20fill=%27none%27%20viewBox=%270%200%2020%2020%27%3e%3cpath%20stroke=%27%236b7280%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27%20stroke-width=%271.5%27%20d=%27M6%208l4%204%204-4%27/%3e%3c/svg%3e')] bg-[length:1.25em_1.25em] bg-[right_0.5rem_center] bg-no-repeat pr-10 hover:border-gray-400"
            >
              <option value="both">เปรียบเทียบ (ปัจจุบัน กับ อนาคต)</option>
              <option value="current">ปัจจุบัน</option>
              <option value="future">อนาคต</option>
            </select>
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// =======================================
// API Configuration
// =======================================
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// =======================================
// State Management
// =======================================
const currentYear = new Date().getFullYear();
const loading = ref(false);
const error = ref(null);

const companies = ref([]);
const categories = ref([]);
const questions = ref([]);
const surveyData = ref(null);

const selectedCompany = ref('combined');
const selectedCategory = ref(0);
const selectedQuestion = ref(null);
const selectedView = ref('both');

// =======================================
// API Functions
// =======================================

// Fetch companies list
const fetchCompanies = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/companies`);
    if (!response.ok) throw new Error('Failed to fetch companies');
    const data = await response.json();
    companies.value = data;
  } catch (err) {
    console.error('Error fetching companies:', err);
    throw err;
  }
};

// Fetch categories list
const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    const data = await response.json();
    // Sort by id
    categories.value = data.sort((a, b) => a.id - b.id);
  } catch (err) {
    console.error('Error fetching categories:', err);
    throw err;
  }
};

// Fetch questions list
const fetchQuestions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/questions`);
    if (!response.ok) throw new Error('Failed to fetch questions');
    const data = await response.json();
    // Add number field and sort
    const questionsWithNumbers = data.map((q, index) => ({
      ...q,
      number: `Q${index + 1}`
    }));
    questions.value = questionsWithNumbers;
  } catch (err) {
    console.error('Error fetching questions:', err);
    throw err;
  }
};

// Fetch survey data for specific question and company
const fetchSurveyData = async (questionId, companyId) => {
  try {
    const params = new URLSearchParams({
      questionId: questionId,
      companyId: companyId || 'combined',
      year: currentYear
    });
    
    const response = await fetch(`${API_BASE_URL}/analytics/survey-data?${params}`);
    if (!response.ok) throw new Error('Failed to fetch survey data');
    const data = await response.json();
    surveyData.value = data;
  } catch (err) {
    console.error('Error fetching survey data:', err);
    throw err;
  }
};

// Fetch all data
const fetchData = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    await Promise.all([
      fetchCompanies(),
      fetchCategories(),
      fetchQuestions()
    ]);
    
    // Set initial question after loading questions
    if (questions.value.length > 0) {
      const firstQuestion = questions.value.find(q => q.categoryId === categories.value[0]?.id);
      if (firstQuestion) {
        selectedQuestion.value = firstQuestion.id;
        await fetchSurveyData(firstQuestion.id, selectedCompany.value);
      }
    }
  } catch (err) {
    error.value = 'เกิดข้อผิดพลาดในการโหลดข้อมูล กรุณาลองใหม่อีกครั้ง';
  } finally {
    loading.value = false;
  }
};

// =======================================
// Computed Properties
// =======================================

const availableQuestions = computed(() => {
  if (!categories.value[selectedCategory.value]) return [];
  const categoryId = categories.value[selectedCategory.value].id;
  return questions.value.filter(q => q.categoryId === categoryId);
});

const selectedQuestionText = computed(() => {
  const question = questions.value.find(q => q.id === selectedQuestion.value);
  return question ? `${question.number} ${question.text}` : '';
});

const getCompanyName = computed(() => {
  if (selectedCompany.value === 'combined') return 'บริษัททั้งหมด';
  const company = companies.value.find(c => c.id === selectedCompany.value);
  return company ? company.name : '';
});

const chartData = computed(() => {
  if (!surveyData.value) return null;
  
  return {
    current: surveyData.value.current || [0, 0, 0, 0, 0],
    future: surveyData.value.future || [0, 0, 0, 0, 0]
  };
});

const maxValue = computed(() => {
  if (!chartData.value) return 40;
  const allValues = [...chartData.value.current, ...chartData.value.future];
  return Math.max(...allValues, 40);
});

// =======================================
// Methods
// =======================================

const getBarWidth = (value) => {
  if (value === 0) return '0%';
  const maxWidth = 100;
  const width = (value / maxValue.value) * maxWidth;
  return `${Math.min(width, maxWidth)}%`;
};

const onCategoryChange = async () => {
  const firstQuestion = availableQuestions.value[0];
  if (firstQuestion) {
    selectedQuestion.value = firstQuestion.id;
    await onQuestionChange();
  }
};

const onQuestionChange = async () => {
  if (selectedQuestion.value) {
    loading.value = true;
    try {
      await fetchSurveyData(selectedQuestion.value, selectedCompany.value);
    } catch (err) {
      error.value = 'เกิดข้อผิดพลาดในการโหลดข้อมูล';
    } finally {
      loading.value = false;
    }
  }
};

const onCompanyChange = async () => {
  if (selectedQuestion.value) {
    loading.value = true;
    try {
      await fetchSurveyData(selectedQuestion.value, selectedCompany.value);
    } catch (err) {
      error.value = 'เกิดข้อผิดพลาดในการโหลดข้อมูล';
    } finally {
      loading.value = false;
    }
  }
};

// =======================================
// Lifecycle Hooks
// =======================================

onMounted(() => {
  fetchData();
});
</script>