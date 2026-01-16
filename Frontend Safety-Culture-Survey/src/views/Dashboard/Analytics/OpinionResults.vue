<!-- OpinionResults.vue -->
<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Navbar -->
    <NavbarDashboard />

    <!-- Main content -->
    <div class="flex-1 ml-64 p-6">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">
          ผลการประเมินความคิดเห็น
        </h1>
        <p class="text-gray-600">
          แสดงความคิดเห็นจากข้อคำถาม
        </p>
      </div>

      <!-- Summary Stats -->
      <div class="bg-white rounded-lg shadow mb-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-center">
          <div class="p-4">
            <div class="text-2xl font-bold text-blue-600 mb-1">
              {{ questions.length }}
            </div>
            <div class="text-sm text-gray-600">คำถามทั้งหมด</div>
          </div>
          <div class="p-4">
            <div class="text-2xl font-bold text-green-600 mb-1">
              {{ totalOpinions }}
            </div>
            <div class="text-sm text-gray-600">ความคิดเห็นทั้งหมด</div>
          </div>
        </div>
      </div>

      <!-- Filter Controls -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <!-- Dropdown -->
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              เลือกคำถามที่ต้องการดู
            </label>
            <div class="relative">
              <select
                v-model="selectedQuestion"
                @change="handleQuestionSelect"
                class="w-full px-4 py-3 pl-11 pr-10 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none bg-white cursor-pointer hover:border-gray-400 text-gray-700 font-medium"
              >
                <option value="">แสดงทั้งหมด ({{ questions.length }} ข้อ)</option>
                <option
                  v-for="item in questions"
                  :key="item.id"
                  :value="item.id"
                >
                  ข้อ {{ item.id }}: {{ truncateText(item.text, 70) }}
                </option>
              </select>
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          <!-- Toggle Button -->
          <div class="sm:pt-7">
            <button
              @click="toggleAllQuestions"
              :disabled="selectedQuestion !== ''"
              class="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg whitespace-nowrap"
            >
              <span class="flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="!allExpanded" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                </svg>
                {{ allExpanded ? 'ปิดทั้งหมด' : 'เปิดทั้งหมด' }}
              </span>
            </button>
          </div>
        </div>

        <!-- Status Info -->
        <div class="mt-4 pt-4 border-t border-gray-200">
          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-green-500"></div>
              <span class="text-gray-600">
                กำลังแสดง: 
                <span class="font-semibold text-gray-900">
                  {{ selectedQuestion ? `ข้อ ${selectedQuestion}` : `ทั้งหมด ${filteredOpinions.length} ข้อ` }}
                </span>
              </span>
            </div>
            <div v-if="selectedQuestion" class="text-gray-500">
              {{ getCurrentQuestionOpinions() }} ความคิดเห็น
            </div>
          </div>
        </div>
      </div>

      <!-- Questions List -->
      <div class="space-y-4">
        <div
          v-for="item in filteredOpinions"
          :key="item.id"
          :ref="el => questionRefs[item.id] = el"
          class="bg-white rounded-lg shadow-sm border-2 border-gray-200 hover:shadow-lg transition-all scroll-mt-24"
          :class="{ 'ring-2 ring-blue-500 shadow-lg border-blue-300': highlightedQuestion === item.id }"
        >
          <!-- Question Header -->
          <div class="p-5 border-b-2 border-gray-100 bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-all cursor-pointer" @click="toggleQuestion(item.id)">
            <div class="flex justify-between items-start gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-3">
                  <span class="inline-flex items-center justify-center min-w-[2rem] h-8 px-3 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white text-sm font-bold shadow-md">
                    {{ item.id }}
                  </span>
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                    <svg class="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    {{ item.opinions.length }} ความคิดเห็น
                  </span>
                </div>
                <p class="text-base text-gray-800 leading-relaxed font-medium">
                  {{ item.text }}
                </p>
              </div>
              <button
                class="flex-shrink-0 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              >
                <svg
                  :class="{ 'rotate-180': expandedQuestions.includes(item.id) }"
                  class="w-5 h-5 transform transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2.5"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Opinions Content -->
          <div
            v-show="expandedQuestions.includes(item.id)"
            class="p-6 bg-gray-50"
          >
            <!-- Opinions List -->
            <div class="space-y-4">
              <div
                v-for="(opinion, index) in item.opinions"
                :key="index"
                class="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div class="flex items-start space-x-4">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                      <span class="text-white font-bold text-sm">
                        {{ getInitials(opinion.name) }}
                      </span>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-2">
                      <div class="text-sm font-semibold text-gray-900">
                        {{ opinion.name }}
                      </div>
                      <div class="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                      <div class="text-xs text-gray-500">
                        ผู้ให้ความคิดเห็นที่ {{ index + 1 }}
                      </div>
                    </div>
                    <div class="text-sm text-gray-700 leading-relaxed">
                      {{ opinion.comment }}
                    </div>
                  </div>
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
import { ref, onMounted, computed, nextTick } from 'vue';
import axios from 'axios';
import NavbarDashboard from '../../../components/NavbarDashboard.vue';

const questions = ref([]);
const expandedQuestions = ref([]);
const selectedQuestion = ref('');
const highlightedQuestion = ref(null);
const questionRefs = ref({});

const fetchQuestions = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/questions');
    questions.value = response.data.map(q => ({
      ...q,
      opinions: q.surveyAnswers.map(sa => ({
        name: sa.user ? sa.user.name_user : 'ไม่ระบุชื่อ',
        comment: sa.comment
      }))
    }));
  } catch (error) {
    console.error('Error fetching questions:', error);
    questions.value = [
      { id: 1, text: 'เกิดข้อผิดพลาดในการโหลดคำถาม', opinions: [] }
    ];
  }
};

onMounted(() => {
  fetchQuestions();
  expandedQuestions.value = []; // เริ่มต้นโดยไม่เปิดข้อใดๆ
});

const totalOpinions = computed(() => {
  return questions.value.reduce((total, item) => total + item.opinions.length, 0);
});

const allExpanded = computed(() => {
  return expandedQuestions.value.length === filteredOpinions.value.length && filteredOpinions.value.length > 0;
});

const filteredOpinions = computed(() => {
  if (!selectedQuestion.value) {
    return questions.value;
  }
  return questions.value.filter(item => item.id === selectedQuestion.value);
});

const toggleQuestion = (questionId) => {
  const index = expandedQuestions.value.indexOf(questionId);
  if (index > -1) {
    expandedQuestions.value.splice(index, 1);
  } else {
    expandedQuestions.value.push(questionId);
  }
};

const toggleAllQuestions = () => {
  if (allExpanded.value) {
    expandedQuestions.value = [];
  } else {
    expandedQuestions.value = questions.value.map(item => item.id);
  }
};

const getInitials = (name) => {
  if (!name) return '';
  return name.split(' ').map(word => word.charAt(0)).join('');
};

const handleQuestionSelect = () => {
  if (!selectedQuestion.value) {
    expandedQuestions.value = [];
    highlightedQuestion.value = null;
    return;
  }

  const questionId = selectedQuestion.value;
  expandedQuestions.value = [questionId];
  highlightedQuestion.value = questionId;

  nextTick(() => {
    const element = questionRefs.value[questionId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        highlightedQuestion.value = null;
      }, 2000);
    }
  });
};

const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const getCurrentQuestionOpinions = () => {
  if (!selectedQuestion.value) return 0;
  const question = questions.value.find(item => item.id === selectedQuestion.value);
  return question ? question.opinions.length : 0;
};
</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
}

.scroll-mt-24 {
  scroll-margin-top: 6rem;
}

select {
  background-image: none;
}
</style>