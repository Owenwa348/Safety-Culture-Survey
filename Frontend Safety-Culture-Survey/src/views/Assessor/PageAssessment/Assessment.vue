<template>
  <div class="min-h-screen bg-gray-100">
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
        <div class="bg-red-50 px-6 py-4 border-b border-red-200">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V4a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-1l-4 4z"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-800">ความคิดเห็นกับข้อคำถามนี้</h3>
            <span class="text-sm text-red-600 font-medium">*บังคับ</span>
          </div>
        </div>
        <div class="p-6">
          <textarea
            v-model="answers[currentIndex].comment"
            rows="4"
            class="w-full p-4 border-2 border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-vertical transition-all duration-200 placeholder-gray-400"
            :class="{
              'border-red-400 bg-red-50': answers[currentIndex].comment === ''
            }"
            placeholder="กรุณากรอกความคิดเห็นของคุณเกี่ยวกับข้อคำถามนี้... (จำเป็นต้องกรอก)"
            required
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
              'bg-green-400': answers[idx].level && answers[idx].futureLevel && answers[idx].comment.trim() !== '' && idx !== currentIndex,
              'bg-gray-300': (!answers[idx].level || !answers[idx].futureLevel || answers[idx].comment.trim() === '') && idx !== currentIndex
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

      <!-- Validation Alert -->
      <div v-if="showValidationAlert" 
           class="fixed top-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          <span class="text-sm">กรุณาเลือกทั้งคะแนนปัจจุบันและอนาคต และกรอกความคิดเห็นก่อนดำเนินการต่อ</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const currentIndex = ref(0);
const showValidationAlert = ref(false);
const categories = ref([]);

const questions = computed(() => {
  return categories.value.flatMap(category => 
    category.questions.map(question => ({...question, categoryName: category.name}))
  );
});

const answers = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/assessment');
    categories.value = response.data;
    answers.value = questions.value.map(() => ({
      level: null,
      futureLevel: null,
      comment: "",
    }));
  } catch (error) {
    console.error('Error fetching assessment data:', error);
  }
});

function goBackOrHome() {
  if (currentIndex.value === 0) {
    router.push('/home');
  } else {
    currentIndex.value--;
  }
}

function goNext() {
  // Validate the current question before doing anything
  const currentAnswer = answers.value[currentIndex.value];
  if (currentAnswer.level === null || currentAnswer.futureLevel === null || currentAnswer.comment.trim() === '') {
    showValidationAlert.value = true;
    setTimeout(() => {
      showValidationAlert.value = false;
    }, 3000);
    return;
  }

  // If it's not the last question, just go to the next one
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++;
  } else {
    // It IS the last question, so this is a submission attempt.
    // Now, check if ALL questions are answered.
    const allAnswered = answers.value.every(
      ans => ans.level !== null && ans.futureLevel !== null && ans.comment.trim() !== ''
    );

    if (allAnswered) {
      // If all are answered, submit.
      alert("ส่งแบบประเมินเรียบร้อยแล้ว ขอบคุณค่ะ");
      console.log("คำตอบทั้งหมด:", answers.value);
      router.push('/home');
      // Here you would typically send the data to the server
      // e.g., axios.post('/api/submit-assessment', { answers: answers.value });
    } else {
      // If not all are answered, show an alert and navigate to the first unanswered question.
       
      const firstUnansweredIndex = answers.value.findIndex(
        ans => ans.level === null || ans.futureLevel === null || ans.comment.trim() === ''
      );
      if (firstUnansweredIndex !== -1) {
        currentIndex.value = firstUnansweredIndex;
      }
    }
  }
}
</script>