<!-- Assessment.vue -->
<template>
  <div class="min-h-screen bg-[#F7F6FC] font-body text-[#1E2235]">

    <!-- Jump to Question Modal -->
    <Teleport to="body">
      <Transition name="modal-pop">
        <div
          v-if="showJumpModal"
          class="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div class="absolute inset-0 bg-black/50" @click="showJumpModal = false"></div>
          <div class="relative bg-white rounded-[28px] shadow-2xl border border-[#ECEAF5] w-full max-w-lg mx-4 overflow-hidden flex flex-col max-h-[80vh]">
            <div class="bg-gradient-to-r from-[#4338CA] to-[#6D5BD0] px-6 py-4 flex items-center justify-between shrink-0">
              <div>
                <h2 class="text-white font-display font-semibold text-lg">เลือกข้อที่ต้องการ</h2>
                <p class="text-white/80 text-xs mt-0.5">ตอบแล้ว {{ answeredCount }} / {{ questions.length }} ข้อ</p>
              </div>
              <button @click="showJumpModal = false" type="button" class="text-white/90 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-full">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div class="px-6 py-3 bg-[#FBFAFE] border-b border-[#ECEAF5] flex items-center gap-4 text-xs text-[#8B8FA3] shrink-0">
              <span class="flex items-center gap-1.5">
                <span class="w-3 h-3 rounded-full bg-[#4338CA] inline-block"></span>ข้อปัจจุบัน
              </span>
              <span class="flex items-center gap-1.5">
                <span class="w-3 h-3 rounded-full bg-[#059669] inline-block"></span>ตอบแล้ว
              </span>
              <span class="flex items-center gap-1.5">
                <span class="w-3 h-3 rounded-full bg-[#E3E0F0] inline-block"></span>ยังไม่ตอบ
              </span>
            </div>

            <div class="overflow-y-auto flex-1 p-3 jump-list">
              <button
                v-for="(q, idx) in questions"
                :key="idx"
                @click="jumpToQuestion(idx)"
                type="button"
                class="w-full text-left px-4 py-3 rounded-xl text-sm flex items-center gap-3 transition-colors duration-150 mb-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4338CA]"
                :class="{
                  'bg-[#EEF2FF] text-[#4338CA] font-semibold': idx === currentIndex,
                  'hover:bg-[#FAFAFD] text-[#3F4257]': idx !== currentIndex
                }"
              >
                <span
                  class="w-7 h-7 rounded-full text-xs flex items-center justify-center shrink-0 font-display font-bold"
                  :class="{
                    'bg-[#4338CA] text-white': idx === currentIndex,
                    'bg-[#059669] text-white': answers[idx] && answers[idx].level && answers[idx].futureLevel && idx !== currentIndex,
                    'bg-[#ECEAF5] text-[#9B97B3]': !(answers[idx] && answers[idx].level && answers[idx].futureLevel) && idx !== currentIndex
                  }"
                >{{ idx + 1 }}</span>
                <span class="truncate flex-1">{{ q.text }}</span>
                <svg
                  v-if="answers[idx] && answers[idx].level && answers[idx].futureLevel"
                  class="w-4 h-4 text-[#059669] shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Auto-save Indicator -->
    <div
      v-if="!isLoadingDraft && answers.some(a => a.level || a.futureLevel)"
      class="fixed bottom-4 left-4 bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] px-4 py-2 rounded-full shadow-lg text-sm flex items-center gap-2 z-40"
    >
      <svg class="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
      </svg>
      <span>บันทึกอัตโนมัติ</span>
    </div>

    <!-- Header Section -->
    <div class="bg-white/90 backdrop-blur shadow-sm border-b border-[#ECEAF5] sticky top-0 z-10" v-if="questions.length > 0 && questions[currentIndex]">
      <div class="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 sm:gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 sm:gap-3 mb-2">
              <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white font-display font-bold text-xs sm:text-sm bg-gradient-to-br from-[#4338CA] to-[#6D5BD0] shrink-0">
                {{ currentIndex + 1 }}
              </div>
              <span class="text-xs sm:text-sm font-medium text-[#4338CA] bg-[#EEF2FF] px-3 py-1 rounded-full truncate">
                หมวดหมู่ : {{ questions[currentIndex].categoryName }}
              </span>
            </div>
            <h1 class="font-display text-xl sm:text-2xl lg:text-3xl font-semibold text-[#1E2235] leading-snug">
              {{ questions[currentIndex].text }}
            </h1>
          </div>

          <div class="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end shrink-0">
            <button
              @click="showJumpModal = true"
              type="button"
              class="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E0E7FF] bg-[#EEF2FF] hover:bg-[#E0E7FF] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4338CA]"
              title="คลิกเพื่อเลือกข้อที่ต้องการ"
            >
              <span class="text-xl sm:text-2xl font-display font-bold text-[#4338CA]">{{ currentIndex + 1 }}</span>
              <span class="text-[#C7C2EC]">/</span>
              <span class="text-lg sm:text-xl text-[#8B8FA3]">{{ questions.length }}</span>
              <svg class="w-4 h-4 text-[#6D63B5] ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="mt-3 flex items-center gap-3">
          <div class="text-[11px] text-[#8B8FA3] hidden sm:block whitespace-nowrap">กดเพื่อเลือกข้อ</div>
          <div class="flex-1 bg-[#ECEAF5] rounded-full h-2 overflow-hidden">
            <div
              class="bg-gradient-to-r from-[#4338CA] to-[#6D5BD0] h-2 rounded-full transition-all duration-300 ease-out"
              :style="{ width: ((currentIndex + 1) / questions.length) * 100 + '%' }"
            ></div>
          </div>
          <div class="text-[11px] text-[#8B8FA3] shrink-0 whitespace-nowrap">{{ currentIndex + 1 }}/{{ questions.length }}</div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">

      <Transition name="fade-slide" mode="out-in">
        <div :key="currentIndex" class="space-y-4 sm:space-y-6">

          <!-- Assessment Card -->
          <div class="bg-white rounded-2xl shadow-sm border border-[#ECEAF5] overflow-hidden" v-if="questions.length > 0 && questions[currentIndex]">
            <div class="hidden lg:block bg-[#FBFAFE] px-6 py-4 border-b border-[#ECEAF5]">
              <div class="grid grid-cols-12 gap-4 items-center">
                <div class="col-span-3">
                  <div class="grid grid-cols-2 gap-4">
                    <div class="text-center">
                      <div class="w-10 h-10 bg-[#EEF2FF] rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg class="w-5 h-5 text-[#4338CA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <div class="text-sm font-medium text-[#3F4257]">ปัจจุบัน</div>
                    </div>
                    <div class="text-center">
                      <div class="w-10 h-10 bg-[#ECFDF5] rounded-full flex items-center justify-center mx-auto mb-2">
                        <svg class="w-5 h-5 text-[#059669]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                        </svg>
                      </div>
                      <div class="text-sm font-medium text-[#3F4257]">เป้าหมาย</div>
                    </div>
                  </div>
                </div>
                <div class="col-span-2 text-center">
                  <div class="w-10 h-10 bg-[#FFFBEB] rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg class="w-5 h-5 text-[#D97706]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/>
                    </svg>
                  </div>
                  <div class="text-sm font-medium text-[#3F4257]">ระดับคะแนน</div>
                </div>
                <div class="col-span-7 text-center">
                  <div class="w-10 h-10 bg-[#EEF2FF] rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg class="w-5 h-5 text-[#4338CA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <div class="text-sm font-medium text-[#3F4257]">คำอธิบายระดับการประเมิน</div>
                </div>
              </div>
            </div>

            <!-- Assessment Options -->
            <form class="p-3 sm:p-4 lg:p-6 space-y-3" v-if="questions.length > 0 && questions[currentIndex]">
              <div
                v-for="(option, index) in questions[currentIndex].options"
                :key="option.id"
                class="rounded-2xl border px-4 py-4 sm:px-5 transition-all duration-200"
                :class="{
                  'bg-[#F5F4FC] border-[#C7C2EC] shadow-sm':
                    answers[currentIndex].level === (index + 1) || answers[currentIndex].futureLevel === (index + 1),
                  'bg-white border-[#ECEAF5] hover:border-[#D9D5EE] hover:bg-[#FAFAFD]':
                    !(answers[currentIndex].level === (index + 1) || answers[currentIndex].futureLevel === (index + 1))
                }"
              >
                <div class="flex flex-col gap-4 lg:grid lg:grid-cols-12 lg:gap-4 lg:items-center">

                  <!-- Current / Future Level -->
                  <div class="order-3 lg:order-1 lg:col-span-3">
                    <div class="grid grid-cols-2 gap-3 sm:gap-4">
                      <!-- Current Level -->
                      <label class="flex flex-col items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          :name="'current-level-' + currentIndex"
                          :value="index + 1"
                          v-model="answers[currentIndex].level"
                          class="sr-only"
                          @change="onAnswerChange(currentIndex)"
                        />
                        <span
                          class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200"
                          :class="answers[currentIndex].level === (index + 1)
                            ? 'bg-[#4338CA] border-[#4338CA] scale-105'
                            : 'bg-white border-[#C7C2EC] hover:border-[#4338CA]'"
                        >
                          <span v-if="answers[currentIndex].level === (index + 1)" class="w-2 h-2 bg-white rounded-full"></span>
                        </span>
                        <span class="lg:hidden text-[11px] text-[#8B85A8]">ปัจจุบัน</span>
                      </label>

                      <!-- Future Level -->
                      <label class="flex flex-col items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          :name="'future-level-' + currentIndex"
                          :value="index + 1"
                          v-model="answers[currentIndex].futureLevel"
                          class="sr-only"
                          @change="onAnswerChange(currentIndex)"
                        />
                        <span
                          class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200"
                          :class="answers[currentIndex].futureLevel === (index + 1)
                            ? 'bg-[#059669] border-[#059669] scale-105'
                            : 'bg-white border-[#A7E0C8] hover:border-[#059669]'"
                        >
                          <span v-if="answers[currentIndex].futureLevel === (index + 1)" class="w-2 h-2 bg-white rounded-full"></span>
                        </span>
                        <span class="lg:hidden text-[11px] text-[#8B85A8]">คาดหวัง</span>
                      </label>
                    </div>
                  </div>

                  <!-- Level Number -->
                  <div class="order-1 lg:order-2 lg:col-span-2 flex justify-start lg:justify-center">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white font-display font-bold text-base shadow-sm bg-gradient-to-br from-[#4338CA] to-[#6D5BD0]">
                      {{ index + 1 }}
                    </div>
                  </div>

                  <!-- Level Description -->
                  <div class="order-2 lg:order-3 lg:col-span-7">
                    <p class="text-[#3F4257] leading-relaxed text-sm sm:text-[15px]">{{ option.text }}</p>
                  </div>

                </div>
              </div>
            </form>
          </div>

          <!-- Comment Section -->
          <div class="bg-white rounded-2xl shadow-sm border border-[#ECEAF5] overflow-hidden" v-if="questions.length > 0 && answers.length > 0">
            <div class="bg-[#EEF2FF] px-6 py-4 border-b border-[#E0E7FF]">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-[#4338CA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V4a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-1l-4 4z"/>
                  </svg>
                </div>
                <h3 class="font-display text-lg font-semibold text-[#1E2235]">แสดงความคิดเห็นเพิ่มเติม (ถ้ามี)</h3>
              </div>
            </div>
            <div class="p-4 sm:p-6">
              <textarea
                v-model="answers[currentIndex].comment"
                rows="4"
                class="w-full p-4 border border-[#ECEAF5] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4338CA] focus:border-transparent resize-vertical transition-all duration-200 placeholder-[#B5B2C9] text-[#3F4257]"
                placeholder="กรุณากรอกความคิดเห็นของคุณเกี่ยวกับข้อคำถามนี้... (ถ้ามี)"
                @input="onAnswerChange(currentIndex)"
              ></textarea>
            </div>
          </div>

        </div>
      </Transition>

      <!-- Navigation Buttons -->
      <div class="mt-4 sm:mt-6 flex justify-between items-center gap-2 sm:gap-4">
        <button
          class="flex items-center gap-2 bg-white hover:bg-[#FAFAFD] text-[#3F4257] px-3 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-sm border border-[#ECEAF5] transition-all duration-200 shrink-0 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4338CA]"
          @click="goBackOrHome"
          type="button"
        >
          <svg v-if="currentIndex === 0" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          <span class="font-medium text-xs sm:text-base">{{ currentIndex === 0 ? 'กลับไปหน้าหลัก' : 'ก่อนหน้า' }}</span>
        </button>

        <!-- Pagination Indicator -->
        <div class="flex items-center justify-center flex-1 overflow-hidden">
          <template v-if="questions.length <= 30">
            <button
              @click="showJumpModal = true"
              type="button"
              class="flex items-center gap-1.5 flex-wrap justify-center cursor-pointer group focus-visible:outline-none"
              title="คลิกเพื่อเลือกข้อ"
            >
              <div
                v-for="(q, idx) in questions"
                :key="idx"
                class="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 shrink-0 group-hover:opacity-80"
                :class="{
                  'bg-[#4338CA] scale-125 ring-2 ring-[#C7C2EC] ring-offset-1': idx === currentIndex,
                  'bg-[#059669]': answers[idx] && answers[idx].level && answers[idx].futureLevel && idx !== currentIndex,
                  'bg-[#E3E0F0]': !(answers[idx] && answers[idx].level && answers[idx].futureLevel) && idx !== currentIndex
                }"
              ></div>
            </button>
          </template>

          <template v-else>
            <button
              @click="showJumpModal = true"
              type="button"
              class="flex flex-col items-center gap-1 w-full max-w-xs cursor-pointer group focus-visible:outline-none"
              title="คลิกเพื่อเลือกข้อ"
            >
              <div class="text-xs text-[#8B8FA3] font-medium group-hover:text-[#4338CA] transition-colors">
                ตอบแล้ว {{ answeredCount }} / {{ questions.length }} ข้อ
                · <span class="underline">เลือกข้อ</span>
              </div>
              <div class="w-full bg-[#ECEAF5] rounded-full h-2.5">
                <div
                  class="h-2.5 rounded-full transition-all duration-300"
                  :class="answeredCount === questions.length ? 'bg-[#059669]' : 'bg-gradient-to-r from-[#4338CA] to-[#6D5BD0]'"
                  :style="{ width: (answeredCount / questions.length) * 100 + '%' }"
                ></div>
              </div>
              <div class="text-xs text-[#A8A4BD]">ข้อที่ {{ currentIndex + 1 }} จาก {{ questions.length }}</div>
            </button>
          </template>
        </div>

        <button
          class="flex items-center gap-2 px-3 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-sm font-medium transition-all duration-200 shrink-0 hover:-translate-y-0.5 text-xs sm:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          :class="currentIndex === questions.length - 1
            ? 'bg-gradient-to-r from-[#059669] to-[#10B981] text-white focus-visible:ring-[#059669]'
            : 'bg-gradient-to-r from-[#4338CA] to-[#6D5BD0] text-white focus-visible:ring-[#4338CA]'"
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
const showJumpModal = ref(false);

// ─── Computed ───────────────────────────────────────────────────────────────────

const questions = computed(() => {
  return categories.value.flatMap(category =>
    category.questions.map(question => ({ ...question, categoryName: category.name }))
  );
});

const answers = ref([]);

const answeredCount = computed(() => {
  return answers.value.filter(a => a.level !== null && a.futureLevel !== null).length;
});

// ─── Jump Modal ─────────────────────────────────────────────────────────────────

function jumpToQuestion(idx) {
  currentIndex.value = idx;
  showJumpModal.value = false;
}

// ─── Auto-save ──────────────────────────────────────────────────────────────────

// เรียกเมื่อผู้ใช้เปลี่ยนคำตอบ (@change บน radio, @input บน textarea)
function onAnswerChange(index) {
  if (isLoadingDraft.value) return;
  saveToLocalStorage();

  // debounce บันทึก backend 1.5 วิ
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
}

function saveToLocalStorage() {
  if (!userId.value || answers.value.length === 0) return;
  const draftKey = `assessment_draft_${userId.value}`;
  localStorage.setItem(draftKey, JSON.stringify({
    answers: answers.value,
    currentIndex: currentIndex.value,
    timestamp: new Date().toISOString()
  }));
}

// บันทึก currentIndex ทุกครั้งที่เปลี่ยนหน้า
watch(currentIndex, () => {
  if (!isLoadingDraft.value) saveToLocalStorage();
});

// ─── Load Draft ─────────────────────────────────────────────────────────────────

async function loadDraft() {
  // 1) ลอง load จาก backend ก่อน — ใช้ GET /api/assessment/answers/:userId
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
    console.log('ไม่พบข้อมูลจาก server กำลังตรวจสอบ localStorage...');
  }

  // 2) fallback → localStorage
  const draftKey = `assessment_draft_${userId.value}`;
  const localDraft = localStorage.getItem(draftKey);
  if (localDraft) {
    try {
      const draft = JSON.parse(localDraft);
      const draftAge = new Date() - new Date(draft.timestamp);
      const oneWeek = 7 * 24 * 60 * 60 * 1000;

      if (draftAge < oneWeek && draft.answers && draft.answers.length === answers.value.length) {
        answers.value = draft.answers;
        currentIndex.value = draft.currentIndex || 0;
        console.log('📥 Loaded draft from localStorage');
        showNotification('พบข้อมูลที่บันทึกไว้ในเครื่อง คุณสามารถทำต่อจากที่ค้างไว้ได้');
        return true;
      }
    } catch (error) {
      console.error('Error loading draft from localStorage:', error);
      localStorage.removeItem(draftKey);
    }
  }

  return false;
}

// ─── Notification ───────────────────────────────────────────────────────────────

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'fixed top-4 right-4 bg-[#4338CA] text-white px-6 py-4 rounded-2xl shadow-xl z-50 animate-slide-in';
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
    notification.style.transition = 'opacity 0.3s';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// ─── onMounted ──────────────────────────────────────────────────────────────────

onMounted(async () => {
  try {
    // 1) ดึง userId
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (userData && userData.id) {
      userId.value = userData.id;
    } else {
      alert("กรุณาเข้าสู่ระบบก่อนทำแบบประเมิน");
      router.push('/');
      return;
    }

    // 2) ดึง categories — GET /api/assessment?userId=
    const response = await axios.get(`/api/assessment?userId=${userId.value}`);
    categories.value = response.data;

    // 3) ตั้งค่า answers เริ่มต้น (null ทุกข้อ)
    answers.value = questions.value.map(() => ({
      level: null,
      futureLevel: null,
      comment: "",
    }));

    // 4) โหลด draft (server หรือ localStorage)
    await nextTick();
    await loadDraft();

  } catch (error) {
    console.error('Error fetching assessment data:', error);
  } finally {
    isLoadingDraft.value = false;
  }

  // แจ้งเตือนเมื่อปิดหน้า
  window.addEventListener('beforeunload', (e) => {
    const hasAnswers = answers.value.some(ans => ans.level !== null || ans.futureLevel !== null);
    if (hasAnswers && !isLoadingDraft.value) {
      e.preventDefault();
      e.returnValue = 'คุณมีคำตอบที่ยังไม่ได้ส่ง ข้อมูลจะถูกบันทึกไว้อัตโนมัติ';
      return e.returnValue;
    }
  });
});

// ─── Navigation ─────────────────────────────────────────────────────────────────

function goBackOrHome() {
  if (currentIndex.value === 0) {
    router.push('/home');
  } else {
    currentIndex.value--;
  }
}

// ─── API Calls ──────────────────────────────────────────────────────────────────

async function submitAnswer(questionId, currentScore, expectedScore, comment) {
  const response = await axios.post('/api/assessment/answer', {
    userId: userId.value,
    questionId,
    currentScore,
    expectedScore,
    comment
  });
  return response.data;
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

// ─── goNext ─────────────────────────────────────────────────────────────────────

async function goNext() {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++;
    return;
  }

  const allAnswered = answers.value.every(
    ans => ans.level !== null && ans.futureLevel !== null
  );

  if (!allAnswered) {
    alert("กรุณาตอบทุกข้อคำถามให้ครบถ้วนก่อนส่งแบบประเมิน");
    const firstUnansweredIndex = answers.value.findIndex(
      ans => ans.level === null || ans.futureLevel === null
    );
    if (firstUnansweredIndex !== -1) {
      currentIndex.value = firstUnansweredIndex;
    }
    return;
  }

  try {
    await submitAllAnswers();
    localStorage.removeItem(`assessment_draft_${userId.value}`);
    alert("ส่งแบบประเมินเรียบร้อยแล้ว ขอบคุณค่ะ");
    if (window.refreshUsersList) window.refreshUsersList();
    router.push('/home');
  } catch (error) {
    alert("เกิดข้อผิดพลาดในการบันทึกคำตอบทั้งหมด กรุณาลองใหม่อีกครั้ง");
  }
}
</script>

<style scoped>
/* ── Type tokens ─────────────────────────────────────────────────────────────
   Display: Bai Jamjuree (headings, numbers, badges)
   Body: Sarabun (everything else) — both are Thai-native, set deliberately
   instead of relying on the system default font. */
@import url('https://fonts.googleapis.com/css2?family=Bai+Jamjuree:wght@500;600;700&family=Sarabun:wght@400;500;600&display=swap');

.font-display { font-family: 'Bai Jamjuree', 'Sarabun', sans-serif; }
.font-body { font-family: 'Sarabun', 'Bai Jamjuree', sans-serif; }

/* ── Question transition ─────────────────────────────────────────────────── */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ── Jump modal transition ───────────────────────────────────────────────── */
.modal-pop-enter-active,
.modal-pop-leave-active {
  transition: opacity 0.2s ease;
}
.modal-pop-enter-from,
.modal-pop-leave-to {
  opacity: 0;
}
.modal-pop-enter-active .relative,
.modal-pop-leave-active .relative {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-pop-enter-from .relative,
.modal-pop-leave-to .relative {
  transform: scale(0.96);
  opacity: 0;
}

/* ── Jump list scrollbar ─────────────────────────────────────────────────── */
.jump-list::-webkit-scrollbar { width: 6px; }
.jump-list::-webkit-scrollbar-track { background: transparent; }
.jump-list::-webkit-scrollbar-thumb {
  background-color: #E3E0F0;
  border-radius: 999px;
}

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

@media (prefers-reduced-motion: reduce) {
  .fade-slide-enter-active,
  .fade-slide-leave-active,
  .modal-pop-enter-active,
  .modal-pop-leave-active,
  .modal-pop-enter-active .relative,
  .modal-pop-leave-active .relative,
  .animate-pulse,
  .animate-slide-in {
    transition: none !important;
    animation: none !important;
  }
}
</style>