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
        
        <!-- Filters -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-gray-700">บริษัท</label>
            <select 
              v-model="selectedCompany" 
              class="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white transition-all select-custom"
            >
              <option value="combined">Verte Group</option>
              <option value="v1">Verte Smart Solution</option>
              <option value="v2">Verte Security</option>
            </select>
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-sm font-medium text-gray-700">หมวดหมู่</label>
            <select 
              v-model="selectedCategory" 
              @change="onCategoryChange"
              class="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white transition-all select-custom"
            >
              <option v-for="(label, index) in chartLabels" :key="index" :value="index">
                {{ index + 1 }}. {{ label }}
              </option>
            </select>
          </div>

          <div class="flex flex-col gap-1.5 lg:col-span-2">
            <label class="text-sm font-medium text-gray-700">คำถาม</label>
            <select 
              v-model="selectedQuestion" 
              class="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white transition-all select-custom"
            >
              <option v-for="(question, index) in availableQuestions" :key="index" :value="question.id">
                {{ question.number }} {{ question.text }}
              </option>
            </select>
          </div>

          <div class="flex flex-col gap-1.5 lg:col-start-4">
            <label class="text-sm font-medium text-gray-700">แสดงข้อมูล</label>
            <select 
              v-model="selectedView" 
              class="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900 bg-white transition-all select-custom"
            >
              <option value="both">เปรียบเทียบ (ปัจจุบัน กับ อนาคต)</option>
              <option value="current">ปัจจุบัน</option>
              <option value="future">อนาคต</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Chart -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-6 py-5 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900 mb-1">
            {{ selectedCategory + 1 }}. {{ chartLabels[selectedCategory] }}
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
              <div class="w-12 flex flex-col-reverse justify-between pt-2" style="height: 400px;">
                <div v-for="score in [1, 2, 3, 4, 5]" :key="score" 
                     class="text-right pr-3 text-sm font-medium text-gray-700 h-20 flex items-center justify-end">
                  {{ score }}
                </div>
              </div>

              <!-- Chart Area -->
              <div class="flex-1 relative">
                <!-- Grid Lines -->
                <div class="absolute inset-0 flex flex-col-reverse justify-between pt-2" style="height: 400px;">
                  <div v-for="i in 6" :key="i" class="border-t border-gray-200"></div>
                </div>

                <!-- Bars -->
                <div class="relative flex flex-col-reverse justify-between pt-2" style="height: 400px;">
                  <div v-for="score in [1, 2, 3, 4, 5]" :key="score" 
                       class="h-20 flex flex-col justify-center px-2"
                       :class="selectedView === 'both' ? 'gap-1.5' : 'gap-0'">
                    <!-- Future Bar -->
                    <div v-if="selectedView === 'both' || selectedView === 'future'"
                      class="bg-emerald-500 rounded transition-all duration-200 flex items-center"
                      :class="selectedView === 'both' ? 'h-7' : 'h-14'"
                      :style="{ width: getBarWidth(futureData[score - 1]) }"
                    >
                      <span v-if="futureData[score - 1] > 0" 
                            class="text-white text-xs font-medium ml-2">
                        {{ futureData[score - 1] }}
                      </span>
                    </div>
                    <!-- Current Bar -->
                    <div v-if="selectedView === 'both' || selectedView === 'current'"
                      class="bg-blue-500 rounded transition-all duration-200 flex items-center"
                      :class="selectedView === 'both' ? 'h-7' : 'h-14'"
                      :style="{ width: getBarWidth(currentData[score - 1]) }"
                    >
                      <span v-if="currentData[score - 1] > 0" 
                            class="text-white text-xs font-medium ml-2">
                        {{ currentData[score - 1] }}
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
import { ref, computed } from 'vue';

const currentYear = new Date().getFullYear();

const chartLabels = [
  'Leadership & Commitment',
  'Policy & Strategic Objectives',
  'Organization Resource & Documentation',
  'Evaluation & Risk Management',
  'Implementation & Operation Control',
  'Monitoring & Measurement',
  'Audit & Review',
];

const allQuestions = [
  // Category 0: Leadership & Commitment (3 ข้อ)
  { id: 0, category: 0, number: '1', text: 'ผู้บริหารระดับสูงมีความมุ่งมั่นในการดำเนินงานตามมาตรฐาน ISO หรือไม่?' },
  { id: 1, category: 0, number: '2', text: 'องค์กรมีการสื่อสารนโยบายและทิศทางไปยังพนักงานทุกระดับหรือไม่?' },
  { id: 2, category: 0, number: '3', text: 'ผู้บริหารมีส่วนร่วมในการทบทวนและปรับปรุงระบบการจัดการหรือไม่?' },
  
  // Category 1: Policy & Strategic Objectives (3 ข้อ)
  { id: 3, category: 1, number: '4', text: 'องค์กรมีนโยบายที่ชัดเจนและสอดคล้องกับวัตถุประสงค์เชิงกลยุทธ์หรือไม่?' },
  { id: 4, category: 1, number: '5', text: 'มีการทบทวนและปรับปรุงนโยบายอย่างสม่ำเสมอหรือไม่?' },
  { id: 5, category: 1, number: '6', text: 'วัตถุประสงค์เชิงกลยุทธ์สามารถวัดผลได้และมีการติดตามหรือไม่?' },
  
  // Category 2: Organization Resource & Documentation (3 ข้อ)
  { id: 6, category: 2, number: '7', text: 'องค์กรมีทรัพยากรที่เพียงพอสำหรับการดำเนินงานตามระบบหรือไม่?' },
  { id: 7, category: 2, number: '8', text: 'เอกสารและข้อมูลมีการจัดเก็บและควบคุมอย่างเป็นระบบหรือไม่?' },
  { id: 8, category: 2, number: '9', text: 'พนักงานได้รับการฝึกอบรมและพัฒนาทักษะอย่างเหมาะสมหรือไม่?' },
  
  // Category 3: Evaluation & Risk Management (3 ข้อ)
  { id: 9, category: 3, number: '10', text: 'องค์กรมีกระบวนการประเมินความเสี่ยงที่เป็นระบบหรือไม่?' },
  { id: 10, category: 3, number: '11', text: 'มีการวิเคราะห์และจัดการความเสี่ยงอย่างต่อเนื่องหรือไม่?' },
  { id: 11, category: 3, number: '12', text: 'มีแผนรองรับและมาตรการป้องกันความเสี่ยงที่มีประสิทธิภาพหรือไม่?' },
  
  // Category 4: Implementation & Operation Control (3 ข้อ)
  { id: 12, category: 4, number: '13', text: 'กระบวนการปฏิบัติงานมีการควบคุมและติดตามอย่างเหมาะสมหรือไม่?' },
  { id: 13, category: 4, number: '14', text: 'มีการกำหนดหน้าที่ความรับผิดชอบที่ชัดเจนหรือไม่?' },
  { id: 14, category: 4, number: '15', text: 'การดำเนินงานเป็นไปตามแผนและมาตรฐานที่กำหนดหรือไม่?' },
  
  // Category 5: Monitoring & Measurement (3 ข้อ)
  { id: 15, category: 5, number: '16', text: 'องค์กรมีการติดตามและวัดผลการดำเนินงานอย่างสม่ำเสมอหรือไม่?' },
  { id: 16, category: 5, number: '17', text: 'ตัวชี้วัดที่ใช้มีความเหมาะสมและสามารถสะท้อนผลการดำเนินงานหรือไม่?' },
  { id: 17, category: 5, number: '18', text: 'มีการวิเคราะห์ข้อมูลเพื่อนำไปสู่การปรับปรุงหรือไม่?' },
  
  // Category 6: Audit & Review (2 ข้อ)
  { id: 18, category: 6, number: '19', text: 'มีการตรวจประเมินภายในอย่างเป็นระบบและสม่ำเสมอหรือไม่?' },
  { id: 19, category: 6, number: '20', text: 'ผู้บริหารมีการทบทวนระบบการจัดการและปรับปรุงอย่างต่อเนื่องหรือไม่?' },
];

const selectedCompany = ref('combined');
const selectedCategory = ref(0);
const selectedQuestion = ref(0);
const selectedView = ref('both');

const availableQuestions = computed(() => {
  return allQuestions.filter(q => q.category === selectedCategory.value);
});

const selectedQuestionText = computed(() => {
  const question = allQuestions.find(q => q.id === selectedQuestion.value);
  return question ? `${question.number} ${question.text}` : '';
});

const onCategoryChange = () => {
  const firstQuestion = availableQuestions.value[0];
  if (firstQuestion) {
    selectedQuestion.value = firstQuestion.id;
  }
};

const generateCurrentData = (company, questionId) => {
  const patterns = [
    [16, 20, 18, 8, 3],
    [18, 22, 20, 4, 1],
    [20, 21, 18, 5, 2],
    [19, 24, 19, 6, 2],
    [17, 23, 20, 7, 3],
    [15, 21, 22, 6, 1],
    [19, 20, 19, 5, 2],
    [18, 23, 18, 6, 2],
  ];
  const multiplier = company === 'v1' ? 1 : 1.05;
  const pattern = patterns[questionId % patterns.length];
  return pattern.map(v => Math.round(v * multiplier));
};

const generateFutureData = (company, questionId) => {
  const patterns = [
    [2, 2, 5, 29, 30],
    [1, 2, 6, 28, 28],
    [1, 3, 5, 29, 28],
    [2, 2, 6, 30, 30],
    [1, 3, 5, 31, 29],
    [2, 2, 4, 28, 30],
    [1, 3, 5, 30, 28],
    [2, 2, 5, 29, 29],
  ];
  const multiplier = company === 'v1' ? 1 : 1.05;
  const pattern = patterns[questionId % patterns.length];
  return pattern.map(v => Math.round(v * multiplier));
};

const rawCurrentData = {
  v1: Array.from({ length: 20 }, (_, i) => ({
    scores: generateCurrentData('v1', i)
  })),
  v2: Array.from({ length: 20 }, (_, i) => ({
    scores: generateCurrentData('v2', i)
  }))
};

const rawFutureData = {
  v1: Array.from({ length: 20 }, (_, i) => ({
    scores: generateFutureData('v1', i)
  })),
  v2: Array.from({ length: 20 }, (_, i) => ({
    scores: generateFutureData('v2', i)
  }))
};

const currentData = computed(() => {
  const qId = selectedQuestion.value;
  if (selectedCompany.value === 'combined') {
    const v1Data = rawCurrentData.v1[qId].scores;
    const v2Data = rawCurrentData.v2[qId].scores;
    return v1Data.map((v, i) => v + v2Data[i]);
  }
  return rawCurrentData[selectedCompany.value][qId].scores;
});

const futureData = computed(() => {
  const qId = selectedQuestion.value;
  if (selectedCompany.value === 'combined') {
    const v1Data = rawFutureData.v1[qId].scores;
    const v2Data = rawFutureData.v2[qId].scores;
    return v1Data.map((v, i) => v + v2Data[i]);
  }
  return rawFutureData[selectedCompany.value][qId].scores;
});

const getCompanyName = computed(() => {
  const names = {
    'combined': 'Verte Group',
    'v1': 'Verte Smart Solution',
    'v2': 'Verte Security'
  };
  return names[selectedCompany.value];
});

const maxValue = computed(() => {
  const allValues = [...currentData.value, ...futureData.value];
  return Math.max(...allValues, 40);
});

const getBarWidth = (value) => {
  if (value === 0) return '0%';
  const maxWidth = 100;
  const width = (value / maxValue.value) * maxWidth;
  return `${Math.min(width, maxWidth)}%`;
};
</script>

<style scoped>
.select-custom {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.25em 1.25em;
  padding-right: 2.5rem;
}

.select-custom:hover {
  border-color: #9ca3af;
}

.select-custom:focus {
  outline: none;
}
</style>