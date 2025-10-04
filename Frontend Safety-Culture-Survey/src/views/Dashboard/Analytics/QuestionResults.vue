<!-- QuestionResults.vue -->

<script setup>
import { ref, computed } from "vue";
import StackedBar from "../Showgraph/StackedBar.vue";
import NavbarDashboard from '../../../components/NavbarDashboard.vue';
import { baseData, fullLabels } from './basedata.js';

const selectedGroup = ref("All");
const selectedArea = ref("both");
const selectedTimeframe = ref("compare");

// ตัวเลือกสำหรับกลุ่ม
const groupOptions = [
  { value: "All", label: "รวมทั้งหมด" },
  { value: "ผู้บริหารระดับสูง", label: "ผู้บริหารระดับสูง / ผู้จัดการส่วน" },
  { value: "ผู้จัดการส่วน", label: "ผู้จัดการแผนก / ผู้จัดการ / พนักงานอาวุโส" },
  { value: "พนักงาน", label: "พนักงาน" },
  { value: "ผู้รับเหมาประจำ", label: "ผู้รับเหมาประจำ" }
];

// ตัวเลือกสำหรับพื้นที่
const areaOptions = [
  { value: "both", label: "Verte Group" },
  { value: "v1", label: "Verte Security" },
  { value: "v2", label: "Verte Smart Solution" }
];

// ตัวเลือกสำหรับช่วงเวลา
const timeframeOptions = [
  { value: "compare", label: "เปรียบเทียบ (ปัจจุบัน vs อนาคต)" },
  { value: "current", label: "ปัจจุบัน" },
  { value: "future", label: "คาดในอนาคต" },
];

// คำนวณว่าต้องแสดงข้อมูลแบบไหน
const shouldShowCombined = computed(() => selectedArea.value === "both");
const shouldShowV1Only = computed(() => selectedArea.value === "v1");
const shouldShowV2Only = computed(() => selectedArea.value === "v2");
const isCompareMode = computed(() => selectedTimeframe.value === "compare");

// ฟังก์ชันช่วยในการดึงข้อมูลจากกลุ่มที่เลือก
const getDataFromGroup = (version, timeframe) => {
  if (selectedGroup.value === "All") {
    return baseData["All"][version]?.[timeframe] || [];
  } else {
    return baseData[selectedGroup.value]?.[version]?.[timeframe] || [];
  }
};

// ฟังก์ชันสำหรับนับจำนวนคะแนนแต่ละระดับ (1-5) ในแต่ละข้อ
const countScoresPerQuestion = (dataArray) => {
  const result = [];
  const numQuestions = fullLabels.length;
  
  for (let q = 0; q < numQuestions; q++) {
    const scores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    dataArray.forEach(row => {
      const score = row[q];
      if (score >= 1 && score <= 5) {
        scores[score]++;
      }
    });
    
    result.push(scores);
  }
  
  return result;
};

// ฟังก์ชันสำหรับสร้าง label ของกลุ่ม
const getGroupLabel = () => {
  const option = groupOptions.find(opt => opt.value === selectedGroup.value);
  return option ? option.label : selectedGroup.value;
};

// ข้อมูลสำหรับแสดงแบบรวม V1+V2 (โหมดเดี่ยว)
const stackedBarCombinedData = computed(() => {
  if (isCompareMode.value) return null;
  
  const v1Data = getDataFromGroup('v1', selectedTimeframe.value);
  const v2Data = getDataFromGroup('v2', selectedTimeframe.value);
  
  const combinedData = [...v1Data, ...v2Data];
  const scoreCounts = countScoresPerQuestion(combinedData);

  return {
    labels: fullLabels,
    datasets: [{
      label: `${getGroupLabel()} - Verte Group`,
      scoreCounts: scoreCounts
    }]
  };
});

// ข้อมูลสำหรับแสดงแบบรวม V1+V2 (โหมดเปรียบเทียบ)
const stackedBarCombinedCompareData = computed(() => {
  if (!isCompareMode.value) return null;
  
  const v1Current = getDataFromGroup('v1', 'current');
  const v2Current = getDataFromGroup('v2', 'current');
  const v1Future = getDataFromGroup('v1', 'future');
  const v2Future = getDataFromGroup('v2', 'future');

  const combinedCurrent = [...v1Current, ...v2Current];
  const combinedFuture = [...v1Future, ...v2Future];
  
  const currentScores = countScoresPerQuestion(combinedCurrent);
  const futureScores = countScoresPerQuestion(combinedFuture);

  return {
    labels: fullLabels,
    datasets: [
      {
        label: `${getGroupLabel()} - Verte Group (ปัจจุบัน)`,
        scoreCounts: currentScores
      },
      {
        label: `${getGroupLabel()} - Verte Group (อนาคต)`,
        scoreCounts: futureScores
      }
    ]
  };
});

// ข้อมูลสำหรับ V1 เท่านั้น (โหมดเดี่ยว)
const stackedBarV1Data = computed(() => {
  if (isCompareMode.value) return null;
  
  const v1Data = getDataFromGroup('v1', selectedTimeframe.value);
  const scoreCounts = countScoresPerQuestion(v1Data);
  
  return {
    labels: fullLabels,
    datasets: [{
      label: `${getGroupLabel()} - Verte Security`,
      scoreCounts: scoreCounts
    }]
  };
});

// ข้อมูลสำหรับ V1 เท่านั้น (โหมดเปรียบเทียบ)
const stackedBarV1CompareData = computed(() => {
  if (!isCompareMode.value) return null;
  
  const v1Current = getDataFromGroup('v1', 'current');
  const v1Future = getDataFromGroup('v1', 'future');
  
  const currentScores = countScoresPerQuestion(v1Current);
  const futureScores = countScoresPerQuestion(v1Future);
  
  return {
    labels: fullLabels,
    datasets: [
      {
        label: `${getGroupLabel()} - Verte Security (ปัจจุบัน)`,
        scoreCounts: currentScores
      },
      {
        label: `${getGroupLabel()} - Verte Security (อนาคต)`,
        scoreCounts: futureScores
      }
    ]
  };
});

// ข้อมูลสำหรับ V2 เท่านั้น (โหมดเดี่ยว)
const stackedBarV2Data = computed(() => {
  if (isCompareMode.value) return null;
  
  const v2Data = getDataFromGroup('v2', selectedTimeframe.value);
  const scoreCounts = countScoresPerQuestion(v2Data);
  
  return {
    labels: fullLabels,
    datasets: [{
      label: `${getGroupLabel()} - Verte Smart Solution`,
      scoreCounts: scoreCounts
    }]
  };
});

// ข้อมูลสำหรับ V2 เท่านั้น (โหมดเปรียบเทียบ)
const stackedBarV2CompareData = computed(() => {
  if (!isCompareMode.value) return null;
  
  const v2Current = getDataFromGroup('v2', 'current');
  const v2Future = getDataFromGroup('v2', 'future');
  
  const currentScores = countScoresPerQuestion(v2Current);
  const futureScores = countScoresPerQuestion(v2Future);
  
  return {
    labels: fullLabels,
    datasets: [
      {
        label: `${getGroupLabel()} - Verte Smart Solution (ปัจจุบัน)`,
        scoreCounts: currentScores
      },
      {
        label: `${getGroupLabel()} - Verte Smart Solution (อนาคต)`,
        scoreCounts: futureScores
      }
    ]
  };
});
</script>

<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <NavbarDashboard />

    <!-- Main Content -->
    <main class="flex-1 ml-60 p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800">ผลประเมินตามข้อคำถาม</h1>
        <p class="text-sm text-gray-600 mt-1">วิเคราะห์และเปรียบเทียบผลคะแนนในแต่ละข้อคำถาม</p>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-5 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- เลือกกลุ่ม -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              เลือกกลุ่มผู้ตอบ
            </label>
            <select
              v-model="selectedGroup"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option v-for="option in groupOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- เลือกพื้นที่ -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              เลือกพื้นที่
            </label>
            <select
              v-model="selectedArea"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option v-for="option in areaOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- เลือกช่วงเวลา -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ช่วงเวลา
            </label>
            <select
              v-model="selectedTimeframe"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option v-for="option in timeframeOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
        
        <!-- Summary Info -->
        <div class="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
          <span class="font-medium">กำลังแสดง:</span>
          <span class="ml-2">{{ getGroupLabel() }}</span>
          <span class="mx-2">•</span>
          <span>{{ areaOptions.find(opt => opt.value === selectedArea)?.label }}</span>
          <span class="mx-2">•</span>
          <span>{{ timeframeOptions.find(opt => opt.value === selectedTimeframe)?.label }}</span>
        </div>
      </div>

      <!-- แสดงข้อมูลรวม V1+V2 -->
      <div v-if="shouldShowCombined" class="bg-white rounded-lg shadow p-5">
        <div class="mb-4 pb-3 border-b border-gray-200">
          <h2 class="text-lg font-bold text-gray-800">{{ getGroupLabel() }}</h2>
          <p class="text-sm text-gray-600 mt-1">Verte Group (Security + Smart Solution)</p>
        </div>
        <div class="w-full" style="height: 600px;">
          <StackedBar 
            v-if="!isCompareMode" 
            :chart-data="stackedBarCombinedData" 
          />
          <StackedBar 
            v-else 
            :chart-data="stackedBarCombinedCompareData" 
          />
        </div>
      </div>

      <!-- แสดงข้อมูล V1 เท่านั้น -->
      <div v-if="shouldShowV1Only" class="bg-white rounded-lg shadow p-5">
        <div class="mb-4 pb-3 border-b border-gray-200">
          <h2 class="text-lg font-bold text-gray-800">{{ getGroupLabel() }}</h2>
          <p class="text-sm text-gray-600 mt-1">Verte Security</p>
        </div>
        <div class="w-full" style="height: 600px;">
          <StackedBar 
            v-if="!isCompareMode" 
            :chart-data="stackedBarV1Data" 
          />
          <StackedBar 
            v-else 
            :chart-data="stackedBarV1CompareData" 
          />
        </div>
      </div>

      <!-- แสดงข้อมูล V2 เท่านั้น -->
      <div v-if="shouldShowV2Only" class="bg-white rounded-lg shadow p-5">
        <div class="mb-4 pb-3 border-b border-gray-200">
          <h2 class="text-lg font-bold text-gray-800">{{ getGroupLabel() }}</h2>
          <p class="text-sm text-gray-600 mt-1">Verte Smart Solution</p>
        </div>
        <div class="w-full" style="height: 600px;">
          <StackedBar 
            v-if="!isCompareMode" 
            :chart-data="stackedBarV2Data" 
          />
          <StackedBar 
            v-else 
            :chart-data="stackedBarV2CompareData" 
          />
        </div>
      </div>

      <!-- แสดงข้อความเมื่อไม่มีข้อมูล -->
      <div v-if="!shouldShowCombined && !shouldShowV1Only && !shouldShowV2Only" 
           class="bg-white rounded-lg shadow p-12 text-center">
        <p class="text-gray-400">ไม่พบข้อมูลสำหรับการเลือกปัจจุบัน</p>
        <p class="text-gray-400 text-sm mt-2">กรุณาเลือกตัวกรองอื่น</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
select {
  transition: all 0.2s ease;
}
</style>