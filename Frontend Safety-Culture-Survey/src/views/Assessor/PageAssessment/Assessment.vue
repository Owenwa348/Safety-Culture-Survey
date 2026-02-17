<!-- Assessment.vue -->
<template>
  <div class="min-h-screen bg-gray-100">
    
    <!-- Auto-save Indicator -->
    <div 
      v-if="!isLoadingDraft && (answers.some(a => a.level || a.futureLevel))"
      class="fixed bottom-4 left-4 bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-lg text-sm flex items-center gap-2 z-50"
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
          <div class="flex flex-col items-end gap-2">
            <div class="text-sm font-medium text-gray-500">
              ความคืบหน้า
            </div>
            <div class="flex items-center gap-3">
              <div class="text-2xl font-bold text-blue-600">{{ currentIndex + 1 }}</div>
              <div class="text-gray-400">/</div>
              <div class="text-xl text-gray-600">{{ questions.length }}</div>
            </div>
            <div class="w-32 bg-gray-200 rounded-full h-2 mt-1">
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
                      <div class="w-5 h-5 rounded-full border-2 border-blue-300 flex items-center justify-center transition-all duration-200 hover:border-blue-500"
                           :class="{
                             'bg-blue-500 border-blue-500': answers[currentIndex].level === (index + 1),
                             'bg-white': answers[currentIndex].level !== (index + 1)
                           }">
                        <div v-if="answers[currentIndex].level === (index + 1)" 
                             class="w-2 h-2 bg-white rounded-full"></div>
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
                      <div class="w-5 h-5 rounded-full border-2 border-green-300 flex items-center justify-center transition-all duration-200 hover:border-green-500"
                           :class="{
                             'bg-green-500 border-green-500': answers[currentIndex].futureLevel === (index + 1),
                             'bg-white': answers[currentIndex].futureLevel !== (index + 1)
                           }">
                        <div v-if="answers[currentIndex].futureLevel === (index + 1)" 
                             class="w-2 h-2 bg-white rounded-full"></div>
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
                  <p class="text-gray-800 font-medium">
                    {{ option.text }}
                  </p>
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
      <div class="mt-6 flex justify-between items-center">
        <button
          class="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg shadow border transition-colors duration-200"
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

        <div class="flex items-center gap-2">
          <div
            v-for="(q, idx) in questions"
            :key="idx"
            class="w-3 h-3 rounded-full transition-all duration-300"
            :class="{
              'bg-blue-500': idx === currentIndex,
              'bg-green-400': answers[idx].level && answers[idx].futureLevel && idx !== currentIndex,
              'bg-gray-300': (!answers[idx].level || !answers[idx].futureLevel) && idx !== currentIndex
            }"
          ></div>
        </div>

        <button
          class="flex items-center gap-2 px-6 py-3 rounded-lg shadow font-medium transition-colors duration-200"
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
const userId = ref(null); // We'll get the user ID from localStorage
const isLoadingDraft = ref(true);
const autoSaveTimeout = ref(null);

const questions = computed(() => {
  return categories.value.flatMap(category => 
    category.questions.map(question => ({...question, categoryName: category.name}))
  );
});

const answers = ref([]);

// Auto-save to localStorage when answers change
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
  if (autoSaveTimeout.value) {
    clearTimeout(autoSaveTimeout.value);
  }
  
  autoSaveTimeout.value = setTimeout(async () => {
    const answer = answers.value[index];
    const question = questions.value[index];
    
    // Only save if both current and future levels are filled
    if (answer.level !== null && answer.futureLevel !== null) {
      try {
        await submitAnswer(
          question.id,
          answer.level,
          answer.futureLevel,
          answer.comment
        );
        console.log('✅ Auto-saved question', index + 1);
      } catch (error) {
        console.error('❌ Auto-save failed for question', index + 1, error);
      }
    }
  }, 1500); // Save after 1.5 seconds of inactivity
};

// Watch individual answer changes for auto-save
watch(answers, (newAnswers, oldAnswers) => {
  if (!isLoadingDraft.value && oldAnswers.length > 0) {
    // Find which answer changed
    for (let i = 0; i < newAnswers.length; i++) {
      if (JSON.stringify(newAnswers[i]) !== JSON.stringify(oldAnswers[i])) {
        autoSaveToBackend(i);
        break;
      }
    }
  }
}, { deep: true });

// Load draft from localStorage or backend
async function loadDraft() {
  const draftKey = `assessment_draft_${userId.value}`;
  const localDraft = localStorage.getItem(draftKey);
  
  try {
    // Try to load from backend first
    const response = await axios.get(`/api/assessment/answers/${userId.value}`);
    
    if (response.data && response.data.length > 0) {
      console.log('📥 Loading saved answers from server...');
      
      // Map backend answers to our answers array
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
      
      // Show notification
      showNotification('พบข้อมูลที่บันทึกไว้ คุณสามารถทำต่อจากที่ค้างไว้ได้');
      return true;
    }
  } catch (error) {
    console.log('No saved answers on server, checking localStorage...');
  }
  
  // If no backend data, try localStorage
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

// Show notification
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
    // Get user ID from localStorage
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData && userData.id) {
      userId.value = userData.id;
    } else {
      // If no user data in localStorage, redirect to login
      alert("กรุณาเข้าสู่ระบบก่อนทำแบบประเมิน");
      router.push('/');
      return;
    }
    
    const response = await axios.get('/api/assessment');
    categories.value = response.data;
    
    // Initialize empty answers
    answers.value = questions.value.map(() => ({
      level: null,
      futureLevel: null,
      comment: "",
    }));
    
    // Load draft after initialization
    await nextTick();
    await loadDraft();
    isLoadingDraft.value = false;
    
  } catch (error) {
    console.error('Error fetching assessment data:', error);
    isLoadingDraft.value = false;
  }
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
      questionId: questionId,
      currentScore: currentScore,
      expectedScore: expectedScore,
      comment: comment
    });
    
    console.log('Answer submitted:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error submitting answer:', error);
    throw error;
  }
}

async function submitAllAnswers() {
  try {
    // Submit all answers
    for (let i = 0; i < questions.value.length; i++) {
      const answer = answers.value[i];
      const question = questions.value[i];
      
      if (answer.level !== null && answer.futureLevel !== null) {
        await submitAnswer(
          question.id,
          answer.level,
          answer.futureLevel,
          answer.comment
        );
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error submitting all answers:', error);
    throw error;
  }
}

async function goNext() {
  // If it's not the last question, just go to the next one. No validation needed.
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++;
    return;
  }

  // If we are here, the user is clicking "Submit Assessment" on the last question.
  // Now, we validate that ALL questions have been answered.
  const allAnswered = answers.value.every(
    ans => ans.level !== null && ans.futureLevel !== null
  );

  if (allAnswered) {
    // If all questions are answered, proceed with submitting all answers.
    try {
      await submitAllAnswers();
      
      // Clear draft from localStorage after successful submission
      const draftKey = `assessment_draft_${userId.value}`;
      localStorage.removeItem(draftKey);
      console.log('✅ Draft cleared after submission');
      
      alert("ส่งแบบประเมินเรียบร้อยแล้ว ขอบคุณค่ะ");
      console.log("คำตอบทั้งหมด:", answers.value);
      if (window.refreshUsersList) {
        window.refreshUsersList();
      }
      router.push('/home');
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการบันทึกคำตอบทั้งหมด กรุณาลองใหม่อีกครั้ง");
    }
  } else {
    // If not all questions are answered, show an alert and go to the first unanswered question.
    alert("กรุณาตอบทุกข้อคำถามให้ครบถ้วนก่อนส่งแบบประเมิน");
    const firstUnansweredIndex = answers.value.findIndex(
      ans => ans.level === null || ans.futureLevel === null
    );
    if (firstUnansweredIndex !== -1) {
      currentIndex.value = firstUnansweredIndex;
    }
  }
}

// Warn user before leaving if they have unsaved answers
onMounted(() => {
  const handleBeforeUnload = (e) => {
    const hasAnswers = answers.value.some(
      ans => ans.level !== null || ans.futureLevel !== null
    );
    
    if (hasAnswers && !isLoadingDraft.value) {
      e.preventDefault();
      e.returnValue = 'คุณมีคำตอบที่ยังไม่ได้ส่ง ข้อมูลจะถูกบันทึกไว้อัตโนมัติ';
      return e.returnValue;
    }
  };
  
  window.addEventListener('beforeunload', handleBeforeUnload);
  
  // Cleanup
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
});
</script>

<style scoped>
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>