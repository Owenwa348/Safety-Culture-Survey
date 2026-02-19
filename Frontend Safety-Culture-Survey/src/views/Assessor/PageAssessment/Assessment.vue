<!-- Assessment.vue -->
<template>
  <div class="min-h-screen bg-gray-100">

    <!-- Jump to Question Modal -->
    <Teleport to="body">
      <div
        v-if="showJumpModal"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50" @click="showJumpModal = false"></div>

        <!-- Modal -->
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden flex flex-col max-h-[80vh]">
          <!-- Header -->
          <div class="bg-blue-500 px-6 py-4 flex items-center justify-between shrink-0">
            <div>
              <h2 class="text-white font-bold text-lg">เลือกข้อที่ต้องการ</h2>
              <p class="text-blue-100 text-xs mt-0.5">ตอบแล้ว {{ answeredCount }} / {{ questions.length }} ข้อ</p>
            </div>
            <button @click="showJumpModal = false" type="button" class="text-white hover:text-blue-200 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Legend -->
          <div class="px-6 py-3 bg-gray-50 border-b flex items-center gap-4 text-xs text-gray-600 shrink-0">
            <span class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>ข้อปัจจุบัน
            </span>
            <span class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-green-400 inline-block"></span>ตอบแล้ว
            </span>
            <span class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-gray-300 inline-block"></span>ยังไม่ตอบ
            </span>
          </div>

          <!-- Question List -->
          <div class="overflow-y-auto flex-1 p-3">
            <button
              v-for="(q, idx) in questions"
              :key="idx"
              @click="jumpToQuestion(idx)"
              type="button"
              class="w-full text-left px-4 py-3 rounded-xl text-sm flex items-center gap-3 transition-colors duration-150 mb-1"
              :class="{
                'bg-blue-100 text-blue-700 font-semibold': idx === currentIndex,
                'hover:bg-gray-50 text-gray-700': idx !== currentIndex
              }"
            >
              <span
                class="w-7 h-7 rounded-full text-xs flex items-center justify-center shrink-0 font-bold"
                :class="{
                  'bg-blue-500 text-white': idx === currentIndex,
                  'bg-green-400 text-white': answers[idx] && answers[idx].level && answers[idx].futureLevel && idx !== currentIndex,
                  'bg-gray-200 text-gray-500': !(answers[idx] && answers[idx].level && answers[idx].futureLevel) && idx !== currentIndex
                }"
              >{{ idx + 1 }}</span>
              <span class="truncate flex-1">{{ q.text }}</span>
              <svg
                v-if="answers[idx] && answers[idx].level && answers[idx].futureLevel"
                class="w-4 h-4 text-green-400 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Auto-save Indicator -->
    <div
      v-if="!isLoadingDraft && (answers.some(a => a.level || a.futureLevel))"
      class="fixed bottom-4 left-4 bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-lg text-sm flex items-center gap-2 z-40"
    >
      <svg class="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
      </svg>
      <span>บันทึกอัตโนมัติ</span>
    </div>

    <!-- Header Section -->
    <div class="bg-white shadow border-b sticky top-0 z-10" v-if="questions.length > 0 && questions[currentIndex]">
      <div class="max-w-6xl mx-auto px-4 py-4">
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {{ currentIndex + 1 }}
              </div>
              <span class="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                หมวดหมู่ : {{ questions[currentIndex].categoryName }}
              </span>
            </div>
            <h1 class="text-2xl lg:text-3xl font-bold text-gray-800">
              {{ questions[currentIndex].text }}
            </h1>
          </div>

          <!-- Progress (คลิกเพื่อเปิด modal เลือกข้อ) -->
          <div class="flex flex-col items-end gap-2">
            <div class="text-sm font-medium text-gray-500">ความคืบหน้า</div>
            <button
              @click="showJumpModal = true"
              type="button"
              class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
              title="คลิกเพื่อเลือกข้อที่ต้องการ"
            >
              <span class="text-2xl font-bold text-blue-600">{{ currentIndex + 1 }}</span>
              <span class="text-gray-400">/</span>
              <span class="text-xl text-gray-600">{{ questions.length }}</span>
              <svg class="w-4 h-4 text-blue-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <div class="text-xs text-blue-400">กดเพื่อเลือกข้อ</div>
            <div class="w-32 bg-gray-200 rounded-full h-2">
              <div
                class="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                :style="{ width: ((currentIndex + 1) / questions.length) * 100 + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-6xl mx-auto px-4 py-6">
      <!-- Assessment Card -->
      <div class="bg-white rounded-lg shadow border overflow-hidden">
        <!-- Table Header -->
        <div class="bg-gray-50 px-6 py-4 border-b">
          <div class="grid grid-cols-12 gap-4 items-center">
            <div class="col-span-3">
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center">
                  <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <div class="text-sm font-medium text-gray-700">ปัจจุบัน</div>
                </div>
                <div class="text-center">
                  <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                    </svg>
                  </div>
                  <div class="text-sm font-medium text-gray-700">คาดหวังอนาคต</div>
                </div>
              </div>
            </div>
            <div class="col-span-2 text-center">
              <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/>
                </svg>
              </div>
              <div class="text-sm font-medium text-gray-700">ระดับคะแนน</div>
            </div>
            <div class="col-span-7 text-center">
              <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <div class="text-sm font-medium text-gray-700">คำอธิบายระดับการประเมิน</div>
            </div>
          </div>
        </div>

        <!-- Assessment Options -->
        <form class="divide-y divide-gray-200" v-if="questions.length > 0 && questions[currentIndex]">
          <div
            v-for="(option, index) in questions[currentIndex].options"
            :key="option.id"
            class="px-6 py-4 hover:bg-gray-50 transition-colors duration-200"
            :class="{
              'bg-blue-50 border-l-4 border-blue-500':
                answers[currentIndex].level === (index + 1) || answers[currentIndex].futureLevel === (index + 1)
            }"
          >
            <div class="grid grid-cols-12 gap-4 items-start">
              <!-- Radio Buttons -->
              <div class="col-span-3">
                <div class="grid grid-cols-2 gap-4">
                  <!-- Current Level -->
                  <div class="flex justify-center">
                    <label class="relative cursor-pointer">
                      <input
                        type="radio"
                        :name="'current-level-' + currentIndex"
                        :value="index + 1"
                        v-model="answers[currentIndex].level"
                        class="sr-only"
                      />
                      <div
                        class="w-5 h-5 rounded-full border-2 border-blue-300 flex items-center justify-center transition-all duration-200 hover:border-blue-500"
                        :class="{
                          'bg-blue-500 border-blue-500': answers[currentIndex].level === (index + 1),
                          'bg-white': answers[currentIndex].level !== (index + 1)
                        }"
                      >
                        <div v-if="answers[currentIndex].level === (index + 1)" class="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </label>
                  </div>

                  <!-- Future Level -->
                  <div class="flex justify-center">
                    <label class="relative cursor-pointer">
                      <input
                        type="radio"
                        :name="'future-level-' + currentIndex"
                        :value="index + 1"
                        v-model="answers[currentIndex].futureLevel"
                        class="sr-only"
                      />
                      <div
                        class="w-5 h-5 rounded-full border-2 border-green-300 flex items-center justify-center transition-all duration-200 hover:border-green-500"
                        :class="{
                          'bg-green-500 border-green-500': answers[currentIndex].futureLevel === (index + 1),
                          'bg-white': answers[currentIndex].futureLevel !== (index + 1)
                        }"
                      >
                        <div v-if="answers[currentIndex].futureLevel === (index + 1)" class="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Level Number -->
              <div class="col-span-2 flex justify-center">
                <div class="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                  <span class="text-white font-bold text-lg">{{ index + 1 }}</span>
                </div>
              </div>

              <!-- Level Description -->
              <div class="col-span-7">
                <div class="bg-gray-50 p-4 rounded-lg border">
                  <p class="text-gray-800 font-medium">{{ option.text }}</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <!-- Comment Section -->
      <div class="mt-6 bg-white rounded-lg shadow border overflow-hidden" v-if="questions.length > 0 && answers.length > 0">
        <div class="bg-blue-50 px-6 py-4 border-b border-blue-200">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V4a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-1l-4 4z"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-800">แสดงความคิดเห็นเพิ่มเติม (ถ้ามี)</h3>
          </div>
        </div>
        <div class="p-6">
          <textarea
            v-model="answers[currentIndex].comment"
            rows="4"
            class="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical transition-all duration-200 placeholder-gray-400"
            placeholder="กรุณากรอกความคิดเห็นของคุณเกี่ยวกับข้อคำถามนี้... (ถ้ามี)"
          ></textarea>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="mt-6 flex justify-between items-center gap-4">
        <button
          class="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg shadow border transition-colors duration-200 shrink-0"
          @click="goBackOrHome"
          type="button"
        >
          <svg v-if="currentIndex === 0" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          <span class="font-medium">{{ currentIndex === 0 ? 'กลับไปหน้าหลัก' : 'ก่อนหน้า' }}</span>
        </button>

        <!-- Pagination Indicator (คลิกเพื่อเปิด modal) -->
        <div class="flex items-center justify-center flex-1 overflow-hidden">

          <!-- Dots: ≤ 30 ข้อ -->
          <template v-if="questions.length <= 30">
            <button
              @click="showJumpModal = true"
              type="button"
              class="flex items-center gap-1 flex-wrap justify-center cursor-pointer group"
              title="คลิกเพื่อเลือกข้อ"
            >
              <div
                v-for="(q, idx) in questions"
                :key="idx"
                class="w-3 h-3 rounded-full transition-all duration-300 shrink-0 group-hover:opacity-75"
                :class="{
                  'bg-blue-500 scale-125': idx === currentIndex,
                  'bg-green-400': answers[idx] && answers[idx].level && answers[idx].futureLevel && idx !== currentIndex,
                  'bg-gray-300': !(answers[idx] && answers[idx].level && answers[idx].futureLevel) && idx !== currentIndex
                }"
              ></div>
            </button>
          </template>

          <!-- Progress bar: > 30 ข้อ -->
          <template v-else>
            <button
              @click="showJumpModal = true"
              type="button"
              class="flex flex-col items-center gap-1 w-full max-w-xs cursor-pointer group"
              title="คลิกเพื่อเลือกข้อ"
            >
              <div class="text-xs text-gray-500 font-medium group-hover:text-blue-500 transition-colors">
                ตอบแล้ว {{ answeredCount }} / {{ questions.length }} ข้อ
                · <span class="underline">เลือกข้อ</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  class="h-2.5 rounded-full transition-all duration-300"
                  :class="answeredCount === questions.length ? 'bg-green-500' : 'bg-blue-500'"
                  :style="{ width: (answeredCount / questions.length) * 100 + '%' }"
                ></div>
              </div>
              <div class="text-xs text-gray-400">ข้อที่ {{ currentIndex + 1 }} จาก {{ questions.length }}</div>
            </button>
          </template>

        </div>

        <button
          class="flex items-center gap-2 px-6 py-3 rounded-lg shadow font-medium transition-colors duration-200 shrink-0"
          :class="currentIndex === questions.length - 1
            ? 'bg-green-500 hover:bg-green-600 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white'"
          @click="goNext"
          type="button"
        >
          <span>{{ currentIndex === questions.length - 1 ? "ส่งแบบประเมิน" : "ถัดไป" }}</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from "vue";
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const currentIndex = ref(0);
const categories = ref([]);
const userId = ref(null);
const isLoadingDraft = ref(true);
const autoSaveTimeout = ref(null);
const showJumpModal = ref(false); // ✅ ตัวแปรเดียว ไม่มี showJumpMenu อีกต่อไป

const questions = computed(() => {
  return categories.value.flatMap(category =>
    category.questions.map(question => ({ ...question, categoryName: category.name }))
  );
});

const answers = ref([]);

const answeredCount = computed(() => {
  return answers.value.filter(a => a.level !== null && a.futureLevel !== null).length;
});

// ✅ กระโดดไปข้อที่เลือก แล้วปิด modal
function jumpToQuestion(idx) {
  currentIndex.value = idx;
  showJumpModal.value = false;
}

// Auto-save to localStorage
watch(answers, (newAnswers) => {
  if (!isLoadingDraft.value && userId.value && newAnswers.length > 0) {
    const draftKey = `assessment_draft_${userId.value}`;
    localStorage.setItem(draftKey, JSON.stringify({
      answers: newAnswers,
      currentIndex: currentIndex.value,
      timestamp: new Date().toISOString()
    }));
  }
}, { deep: true });

// Debounced auto-save to backend
const autoSaveToBackend = async (index) => {
  if (autoSaveTimeout.value) clearTimeout(autoSaveTimeout.value);

  autoSaveTimeout.value = setTimeout(async () => {
    const answer = answers.value[index];
    const question = questions.value[index];

    if (answer.level !== null && answer.futureLevel !== null) {
      try {
        await submitAnswer(question.id, answer.level, answer.futureLevel, answer.comment);
        console.log('✅ Auto-saved question', index + 1);
      } catch (error) {
        console.error('❌ Auto-save failed for question', index + 1, error);
      }
    }
  }, 1500);
};

watch(answers, (newAnswers, oldAnswers) => {
  if (!isLoadingDraft.value && oldAnswers.length > 0) {
    for (let i = 0; i < newAnswers.length; i++) {
      if (JSON.stringify(newAnswers[i]) !== JSON.stringify(oldAnswers[i])) {
        autoSaveToBackend(i);
        break;
      }
    }
  }
}, { deep: true });

async function loadDraft() {
  const draftKey = `assessment_draft_${userId.value}`;
  const localDraft = localStorage.getItem(draftKey);

  try {
    const response = await axios.get(`/api/assessment/answers/${userId.value}`);

    if (response.data && response.data.length > 0) {
      console.log('📥 Loading saved answers from server...');
      response.data.forEach(savedAnswer => {
        const questionIndex = questions.value.findIndex(q => q.id === savedAnswer.questionId);
        if (questionIndex !== -1) {
          answers.value[questionIndex] = {
            level: savedAnswer.currentScore,
            futureLevel: savedAnswer.expectedScore,
            comment: savedAnswer.comment || ""
          };
        }
      });
      showNotification('พบข้อมูลที่บันทึกไว้ คุณสามารถทำต่อจากที่ค้างไว้ได้');
      return true;
    }
  } catch (error) {
    console.log('No saved answers on server, checking localStorage...');
  }

  if (localDraft) {
    try {
      const draft = JSON.parse(localDraft);
      const draftAge = new Date() - new Date(draft.timestamp);
      const oneWeek = 7 * 24 * 60 * 60 * 1000;

      if (draftAge < oneWeek) {
        answers.value = draft.answers;
        currentIndex.value = draft.currentIndex || 0;
        console.log('📥 Loaded draft from localStorage');
        showNotification('พบข้อมูลที่บันทึกไว้ในเครื่อง คุณสามารถทำต่อจากที่ค้างไว้ได้');
        return true;
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  }

  return false;
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-slide-in';
  notification.innerHTML = `
    <div class="flex items-center gap-3">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <span>${message}</span>
    </div>
  `;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

onMounted(async () => {
  try {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData && userData.id) {
      userId.value = userData.id;
    } else {
      alert("กรุณาเข้าสู่ระบบก่อนทำแบบประเมิน");
      router.push('/');
      return;
    }

    const response = await axios.get('/api/assessment');
    categories.value = response.data;

    answers.value = questions.value.map(() => ({
      level: null,
      futureLevel: null,
      comment: "",
    }));

    await nextTick();
    await loadDraft();
    isLoadingDraft.value = false;

  } catch (error) {
    console.error('Error fetching assessment data:', error);
    isLoadingDraft.value = false;
  }

  const handleBeforeUnload = (e) => {
    const hasAnswers = answers.value.some(ans => ans.level !== null || ans.futureLevel !== null);
    if (hasAnswers && !isLoadingDraft.value) {
      e.preventDefault();
      e.returnValue = 'คุณมีคำตอบที่ยังไม่ได้ส่ง ข้อมูลจะถูกบันทึกไว้อัตโนมัติ';
      return e.returnValue;
    }
  };
  window.addEventListener('beforeunload', handleBeforeUnload);
});

function goBackOrHome() {
  if (currentIndex.value === 0) {
    router.push('/home');
  } else {
    currentIndex.value--;
  }
}

async function submitAnswer(questionId, currentScore, expectedScore, comment) {
  try {
    const response = await axios.post('/api/assessment/answer', {
      userId: userId.value,
      questionId,
      currentScore,
      expectedScore,
      comment
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting answer:', error);
    throw error;
  }
}

async function submitAllAnswers() {
  for (let i = 0; i < questions.value.length; i++) {
    const answer = answers.value[i];
    const question = questions.value[i];
    if (answer.level !== null && answer.futureLevel !== null) {
      await submitAnswer(question.id, answer.level, answer.futureLevel, answer.comment);
    }
  }
}

async function goNext() {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++;
    return;
  }

  const allAnswered = answers.value.every(
    ans => ans.level !== null && ans.futureLevel !== null
  );

  if (allAnswered) {
    try {
      await submitAllAnswers();
      localStorage.removeItem(`assessment_draft_${userId.value}`);
      alert("ส่งแบบประเมินเรียบร้อยแล้ว ขอบคุณค่ะ");
      if (window.refreshUsersList) window.refreshUsersList();
      router.push('/home');
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการบันทึกคำตอบทั้งหมด กรุณาลองใหม่อีกครั้ง");
    }
  } else {
    alert("กรุณาตอบทุกข้อคำถามให้ครบถ้วนก่อนส่งแบบประเมิน");
    const firstUnansweredIndex = answers.value.findIndex(
      ans => ans.level === null || ans.futureLevel === null
    );
    if (firstUnansweredIndex !== -1) {
      currentIndex.value = firstUnansweredIndex;
    }
  }
}
</script>

<style scoped>
@keyframes slide-in {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>