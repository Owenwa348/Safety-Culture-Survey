<!-- HorizontalBarChart.vue -->
<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm mb-6 p-6 border border-gray-200">
        <h1 class="text-2xl font-semibold text-gray-900 mb-2">
          การวิเคราะห์การประเมินประจำปี {{ currentYear }}
        </h1>
        <p class="text-gray-600">
          การเปรียบเทียบผลการประเมินระหว่างปัจจุบันและอนาคตตามหมวดหมู่
        </p>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm mb-6 p-6 border border-gray-200">
        <div class="flex flex-wrap items-center gap-6">
          <div class="flex items-center gap-3">
            <label class="text-sm font-medium text-gray-700 w-16">บริษัท</label>
            <select 
              v-model="selectedCompany" 
              class="px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all select-custom min-w-[200px]"
            >
              <option value="combined">Verte Group</option>
              <option value="v1">Verte Smart Solution</option>
              <option value="v2">Verte Security</option>
            </select>
          </div>

          <div class="flex items-center gap-3">
            <label class="text-sm font-medium text-gray-700 w-16">หมวดหมู่</label>
            <select 
              v-model="selectedCategory" 
              class="px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all select-custom min-w-[280px]"
            >
              <option v-for="(label, index) in chartLabels" :key="index" :value="index">
                {{ label }}
              </option>
            </select>
          </div>

          <div class="flex items-center gap-3">
            <label class="text-sm font-medium text-gray-700 w-20">แสดงข้อมูล</label>
            <select 
              v-model="selectedView" 
              class="px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all select-custom min-w-[160px]"
            >
              <option value="both">ทั้งหมด</option>
              <option value="current">ปัจจุบัน</option>
              <option value="future">อนาคต</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Chart -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900 mb-1">
            {{ chartLabels[selectedCategory] }}
          </h2>
          <p class="text-sm text-gray-600">
            {{ getCompanyName }} · การกระจายของคะแนนในแต่ละระดับ (1-5)
          </p>
        </div>
        
        <div class="px-6 py-6">
          <!-- Legend -->
          <div class="flex items-center gap-6 mb-6 pb-4 border-b border-gray-100">
            <div v-if="selectedView === 'both' || selectedView === 'current'" class="flex items-center gap-2">
              <div class="w-4 h-4 rounded bg-blue-500"></div>
              <span class="text-sm font-medium text-gray-700">ปัจจุบัน</span>
            </div>
            <div v-if="selectedView === 'both' || selectedView === 'future'" class="flex items-center gap-2">
              <div class="w-4 h-4 rounded bg-emerald-500"></div>
              <span class="text-sm font-medium text-gray-700">อนาคต</span>
            </div>
          </div>

          <!-- Chart Container -->
          <div class="relative">
            <div class="flex">
              <!-- Y-axis Labels -->
              <div class="w-12 flex flex-col-reverse justify-between pt-2" style="height: 400px;">
                <div v-for="score in [1, 2, 3, 4, 5]" :key="score" 
                     class="text-right pr-3 text-sm font-medium text-gray-700 h-16 flex items-center justify-end">
                  {{ score }}
                </div>
              </div>

              <!-- Chart Area -->
              <div class="flex-1 relative">
                <!-- Grid Lines -->
                <div class="absolute inset-0 flex flex-col-reverse justify-between pt-2" style="height: 400px;">
                  <div v-for="i in 6" :key="i" class="border-t border-gray-100"></div>
                </div>

                <!-- Bars -->
                <div class="relative flex flex-col-reverse justify-between pt-2" style="height: 400px;">
                  <div v-for="score in [1, 2, 3, 4, 5]" :key="score" 
                       class="h-16 flex flex-col justify-center px-2"
                       :class="selectedView === 'both' ? 'gap-1.5' : 'gap-0'">
                    <!-- Current Bar -->
                    <div v-if="selectedView === 'both' || selectedView === 'current'"
                      class="bg-blue-500 rounded-md transition-all duration-300 ease-out hover:bg-blue-600 flex items-center"
                      :class="selectedView === 'both' ? 'h-6' : 'h-12'"
                      :style="{ width: getBarWidth(currentData[score - 1]) }"
                    >
                      <span v-if="currentData[score - 1] > 0" 
                            class="text-white text-xs font-semibold ml-2">
                        {{ currentData[score - 1] }}
                      </span>
                    </div>
                    <!-- Future Bar -->
                    <div v-if="selectedView === 'both' || selectedView === 'future'"
                      class="bg-emerald-500 rounded-md transition-all duration-300 ease-out hover:bg-emerald-600 flex items-center"
                      :class="selectedView === 'both' ? 'h-6' : 'h-12'"
                      :style="{ width: getBarWidth(futureData[score - 1]) }"
                    >
                      <span v-if="futureData[score - 1] > 0" 
                            class="text-white text-xs font-semibold ml-2">
                        {{ futureData[score - 1] }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- X-axis -->
                <div class="flex justify-between mt-3 px-2">
                  <span v-for="i in 9" :key="i" class="text-xs text-gray-500 font-medium">
                    {{ (i - 1) * 5 }}
                  </span>
                </div>
                <div class="text-center mt-2">
                  <span class="text-sm font-medium text-gray-600">จำนวนคำตอบ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="px-6 py-5 bg-gray-50 border-t border-gray-200">
          <div class="grid gap-4 max-w-md"
               :class="selectedView === 'both' ? 'grid-cols-2' : 'grid-cols-1'">
            <div v-if="selectedView === 'both' || selectedView === 'current'" 
                 class="bg-white rounded-lg p-4 border border-gray-200">
              <div class="text-xs font-medium text-gray-500 mb-1">รวมคำตอบปัจจุบัน</div>
              <div class="text-2xl font-semibold text-gray-900">{{ getTotalCurrent }}</div>
            </div>
            <div v-if="selectedView === 'both' || selectedView === 'future'" 
                 class="bg-white rounded-lg p-4 border border-gray-200">
              <div class="text-xs font-medium text-gray-500 mb-1">รวมคำตอบอนาคต</div>
              <div class="text-2xl font-semibold text-gray-900">{{ getTotalFuture }}</div>
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

const selectedCompany = ref('combined');
const selectedCategory = ref(0);
const selectedView = ref('both');

// ข้อมูลปัจจุบัน - กระจุกตัวที่คะแนน 1-3
const rawCurrentData = {
  v1: [
    { scores: [18, 22, 20, 4, 1] }, // หมวดที่ 1
    { scores: [20, 21, 18, 5, 2] }, // หมวดที่ 2
    { scores: [19, 24, 19, 6, 2] }, // หมวดที่ 3
    { scores: [21, 23, 17, 5, 3] }, // หมวดที่ 4
    { scores: [17, 20, 22, 4, 2] }, // หมวดที่ 5
    { scores: [18, 21, 20, 6, 3] }, // หมวดที่ 6
    { scores: [19, 22, 19, 5, 2] }, // หมวดที่ 7
  ],
  v2: [
    { scores: [16, 20, 22, 7, 3] }, // หมวดที่ 1
    { scores: [18, 21, 20, 6, 4] }, // หมวดที่ 2
    { scores: [17, 23, 18, 8, 2] }, // หมวดที่ 3
    { scores: [19, 22, 19, 7, 4] }, // หมวดที่ 4
    { scores: [15, 19, 21, 9, 3] }, // หมวดที่ 5
    { scores: [16, 20, 20, 8, 4] }, // หมวดที่ 6
    { scores: [17, 21, 19, 7, 3] }, // หมวดที่ 7
  ]
};

// ข้อมูลอนาคต - กระจุกตัวที่คะแนน 4-5
const rawFutureData = {
  v1: [
    { scores: [1, 3, 6, 20, 15] }, // หมวดที่ 1
    { scores: [2, 2, 7, 19, 16] }, // หมวดที่ 2
    { scores: [1, 4, 5, 21, 14] }, // หมวดที่ 3
    { scores: [2, 3, 6, 20, 15] }, // หมวดที่ 4
    { scores: [1, 2, 5, 22, 16] }, // หมวดที่ 5
    { scores: [2, 3, 7, 19, 17] }, // หมวดที่ 6
    { scores: [1, 4, 6, 20, 16] }, // หมวดที่ 7
  ],
  v2: [
    { scores: [2, 3, 5, 22, 16] }, // หมวดที่ 1
    { scores: [1, 2, 6, 21, 17] }, // หมวดที่ 2
    { scores: [2, 4, 7, 19, 15] }, // หมวดที่ 3
    { scores: [1, 3, 6, 20, 16] }, // หมวดที่ 4
    { scores: [2, 2, 5, 23, 15] }, // หมวดที่ 5
    { scores: [1, 3, 6, 21, 17] }, // หมวดที่ 6
    { scores: [2, 4, 5, 20, 16] }, // หมวดที่ 7
  ]
};

// คำนวณข้อมูลรวม
const getCombinedData = (dataSource) => {
  return dataSource.v1.map((v1Cat, catIndex) => {
    const v2Cat = dataSource.v2[catIndex];
    return {
      scores: v1Cat.scores.map((v1Score, scoreIndex) => 
        v1Score + v2Cat.scores[scoreIndex]
      )
    };
  });
};

const currentData = computed(() => {
  const category = selectedCategory.value;
  if (selectedCompany.value === 'combined') {
    const combined = getCombinedData(rawCurrentData);
    return combined[category].scores;
  }
  return rawCurrentData[selectedCompany.value][category].scores;
});

const futureData = computed(() => {
  const category = selectedCategory.value;
  if (selectedCompany.value === 'combined') {
    const combined = getCombinedData(rawFutureData);
    return combined[category].scores;
  }
  return rawFutureData[selectedCompany.value][category].scores;
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

const getTotalCurrent = computed(() => {
  return currentData.value.reduce((sum, val) => sum + val, 0);
});

const getTotalFuture = computed(() => {
  return futureData.value.reduce((sum, val) => sum + val, 0);
});
</script>

<style scoped>
.select-custom {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.75rem center;
  background-repeat: no-repeat;
  background-size: 1.25em 1.25em;
  padding-right: 2.5rem;
}

.select-custom:hover {
  border-color: #93c5fd;
}

.select-custom:focus {
  outline: none;
}
</style>