<script setup>
import { ref, computed, onMounted, watch } from "vue";
import axios from 'axios';
import StackedBar from "../Showgraph/StackedBar.vue";
import NavbarDashboard from '../../../components/NavbarDashboard.vue';

// ========================================
// ตัวแปร Reactive States
// ========================================
// เก็บค่าตำแหน่งที่เลือก เริ่มต้นเป็น "All" (ทั้งหมด)
const selectedPosition = ref("All");

// เก็บค่าบริษัทที่เลือก เริ่มต้นเป็น "All" (ทั้งหมด)
const selectedCompany = ref("All");

// เก็บค่าช่วงเวลาที่เลือก เริ่มต้นเป็น "compare" (เปรียบเทียบ)
const selectedTimeframe = ref("compare");

// เก็บค่าปีที่เลือก เริ่มต้นเป็น null
const selectedYear = ref(null);

// เก็บข้อความคำถามทั้งหมดที่จะแสดงในกราฟ (จะดึงมาจาก API)
const fullLabels = ref([]);

// เก็บข้อมูลกราฟที่ได้จาก API
const chartAPIData = ref(null);

// สถานะการโหลดข้อมูล true = กำลังโหลด, false = โหลดเสร็จแล้ว
const isLoading = ref(true);

// ========================================
// ข้อมูลตัวเลือกสำหรับ Dropdown
// ========================================
// ตัวเลือกตำแหน่งต่างๆ เริ่มต้นมีแค่ "รวมทั้งหมด" จากนั้นจะดึงข้อมูลเพิ่มจาก API
const positionOptions = ref([
  { value: "All", label: "รวมทั้งหมด" },
]);

// ตัวเลือกบริษัทต่างๆ มีตัวเลือกตายตัวอยู่ (ในอนาคตอาจดึงจาก API)
const companyOptions = ref([
  { value: "All", label: "รวมทั้งหมด" },
  { value: "Verte Security", label: "Verte Security" },
  { value: "Verte Smart Solution", label: "Verte Smart Solution" }
]);

// ตัวเลือกช่วงเวลา มี 3 แบบ: เปรียบเทียบ, ปัจจุบัน, อนาคต
const timeframeOptions = [
  { value: "compare", label: "เปรียบเทียบ (ปัจจุบัน vs อนาคต)" },
  { value: "current", label: "ปัจจุบัน" },
  { value: "future", label: "คาดในอนาคต" },
];

// เก็บรายการปีที่มีข้อมูลในระบบ (จะดึงมาจาก API)
const availableYears = ref([]);

// ========================================
// ฟังก์ชันเรียก API
// ========================================

/**
 * ดึงข้อมูลคำถามทั้งหมดจาก API เพื่อนำมาแสดงเป็นป้ายกำกับในกราฟ
 * แต่ละคำถามจะแสดงในรูปแบบ "Q1: ข้อความคำถาม"
 */
const fetchQuestions = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/questions');
    // แปลงข้อมูลคำถามเป็นรูปแบบ "Q{ลำดับ}: {ข้อความ}"
    fullLabels.value = response.data.map(q => `Q${q.order || q.id}: ${q.text}`);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลคำถาม:', error);
  }
};

/**
 * ดึงข้อมูลตำแหน่งทั้งหมดจาก API 
 * เพื่อนำมาแสดงในตัวเลือก dropdown ของตำแหน่ง
 */
const fetchPositions = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/positions');
    // แปลงข้อมูลตำแหน่งให้อยู่ในรูปแบบที่ dropdown ใช้งานได้
    const positions = response.data.map(position => ({
      value: position.name,
      label: position.name
    }));
    // เพิ่มตำแหน่งที่ดึงมาลงในรายการตัวเลือก (ต่อท้าย "รวมทั้งหมด")
    positionOptions.value.push(...positions);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลตำแหน่ง:', error);
  }
};

/**
 * ดึงรายการปีที่มีข้อมูลการประเมินจาก API
 * และเลือกปีแรกเป็นค่าเริ่มต้นโดยอัตโนมัติ
 */
const fetchYears = async () => {
  try {
    const { data } = await axios.get('http://localhost:5000/api/analytics/assessment-years');
    availableYears.value = data;
    // ถ้ามีข้อมูลปี ให้เลือกปีแรกเป็นค่าเริ่มต้น
    if (data.length > 0) {
      selectedYear.value = data[0];
    }
  } catch (err) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลปี:', err);
  }
};

/**
 * ดึงข้อมูลกราฟตามเงื่อนไขที่เลือก (ปี, บริษัท, ตำแหน่ง)
 * ข้อมูลที่ได้จะถูกนำไปแสดงในกราฟ StackedBar
 */
const fetchChartData = async () => {
  // ถ้ายังไม่ได้เลือกปี ไม่ต้องดึงข้อมูล
  if (!selectedYear.value) return;
  
  // เริ่มการโหลด แสดงสถานะ "กำลังโหลด..."
  isLoading.value = true;
  chartAPIData.value = null;
  
  try {
    // เตรียม parameters สำหรับส่งไปยัง API
    const params = {
      year: selectedYear.value,
      company: selectedCompany.value,
      position: selectedPosition.value,
    };
    
    // เรียก API เพื่อดึงข้อมูลผลการประเมินตามเงื่อนไข
    const { data } = await axios.get('http://localhost:5000/api/analytics/question-results', { params });
    chartAPIData.value = data;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูลกราฟ:', error);
    chartAPIData.value = null; // ล้างข้อมูลเมื่อเกิดข้อผิดพลาด
  } finally {
    // สิ้นสุดการโหลด ไม่ว่าจะสำเร็จหรือล้มเหลว
    isLoading.value = false;
  }
};

// ========================================
// Lifecycle Hooks และ Watchers
// ========================================

/**
 * เมื่อ component ถูกติดตั้ง (mount) จะทำงานดังนี้:
 * 1. ดึงข้อมูลคำถาม
 * 2. ดึงข้อมูลตำแหน่ง
 * 3. ดึงรายการปี
 * 4. หลังจากดึงข้อมูลเสร็จ ถ้ามีปีที่เลือกแล้ว จะดึงข้อมูลกราฟทันที
 */
onMounted(async () => {
  await Promise.all([
    fetchQuestions(),
    fetchPositions(),
    fetchYears()
  ]);
  
  // ดึงข้อมูลกราฟหลังจากตั้งค่าเริ่มต้นเสร็จสมบูรณ์
  if (selectedYear.value) {
    fetchChartData();
  }
});

/**
 * ติดตามการเปลี่ยนแปลงของตัวกรอง (ปี, บริษัท, ตำแหน่ง)
 * เมื่อมีการเปลี่ยนแปลง จะเรียกฟังก์ชัน fetchChartData ใหม่ทันที
 */
watch([selectedYear, selectedCompany, selectedPosition], fetchChartData, { deep: true });

// ========================================
// Computed Properties (คำนวณแบบ Dynamic)
// ========================================

/**
 * ตรวจสอบว่าอยู่ในโหมดเปรียบเทียบหรือไม่
 * ถ้าเป็น "compare" จะแสดงกราฟ 2 ชุด (ปัจจุบัน และ อนาคต)
 */
const isCompareMode = computed(() => selectedTimeframe.value === "compare");

/**
 * หาชื่อแสดงของตำแหน่งที่เลือก
 * @returns {string} ชื่อตำแหน่งภาษาไทย
 */
const getPositionLabel = () => {
  const option = positionOptions.value.find(opt => opt.value === selectedPosition.value);
  return option ? option.label : selectedPosition.value;
};

/**
 * หาชื่อแสดงของบริษัทที่เลือก
 * @returns {string} ชื่อบริษัทภาษาไทย
 */
const getCompanyLabel = () => {
  const option = companyOptions.value.find(opt => opt.value === selectedCompany.value);
  return option ? option.label : selectedCompany.value;
};

/**
 * จัดเตรียมข้อมูลสำหรับแสดงกราฟ
 * ประมวลผลข้อมูลจาก API ให้อยู่ในรูปแบบที่ component StackedBar ใช้งานได้
 * 
 * โหมดเปรียบเทียบ: จะแสดง 2 ชุดข้อมูล (ปัจจุบัน vs อนาคต)
 * โหมดเดี่ยว: จะแสดง 1 ชุดข้อมูล (ปัจจุบัน หรือ อนาคต)
 */
const chartData = computed(() => {
  // ถ้ายังไม่มีข้อมูล หรือกำลังโหลด หรือยังไม่มีป้ายกำกับ ให้คืนค่า null
  if (!chartAPIData.value || isLoading.value || fullLabels.value.length === 0) {
    return null;
  }

  const positionLabel = getPositionLabel();
  const companyLabel = getCompanyLabel();

  // โหมดเปรียบเทียบ: แสดงทั้งปัจจุบันและอนาคต
  if (isCompareMode.value) {
    return {
      labels: fullLabels.value, // ป้ายกำกับคำถาม
      datasets: [
        {
          label: `${positionLabel} - ${companyLabel} (ปัจจุบัน)`,
          scoreCounts: chartAPIData.value.current // ข้อมูลคะแนนปัจจุบัน
        },
        {
          label: `${positionLabel} - ${companyLabel} (อนาคต)`,
          scoreCounts: chartAPIData.value.future // ข้อมูลคะแนนอนาคต
        }
      ]
    };
  } else {
    // โหมดเดี่ยว: แสดงเฉพาะปัจจุบัน หรือ อนาคต
    const dataKey = selectedTimeframe.value; // 'current' หรือ 'future'
    const timeLabel = dataKey === 'current' ? 'ปัจจุบัน' : 'คาดในอนาคต';
    return {
      labels: fullLabels.value,
      datasets: [{
        label: `${positionLabel} - ${companyLabel} (${timeLabel})`,
        scoreCounts: chartAPIData.value[dataKey]
      }]
    };
  }
});
</script>

<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- ========================================
         แถบเมนูด้านข้าง (Sidebar)
         ======================================== -->
    <NavbarDashboard />

    <!-- ========================================
         พื้นที่เนื้อหาหลัก
         ======================================== -->
    <main class="flex-1 ml-60 p-6">
      
      <!-- หัวข้อหน้า -->
      <header class="mb-6">
        <h1 class="text-2xl font-bold text-gray-800">
          ผลประเมินตามข้อคำถาม
        </h1>
        <p class="text-sm text-gray-600 mt-1">
          วิเคราะห์และเปรียบเทียบผลคะแนนในแต่ละข้อคำถาม
        </p>
      </header>

      <!-- ========================================
           ส่วนตัวกรองข้อมูล (Filter Section)
           ======================================== -->
      <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <!-- ตัวกรองตำแหน่ง -->
          <div class="space-y-2">
            <label 
              for="position-select" 
              class="block text-sm font-medium text-gray-700"
            >
              เลือกตำแหน่ง
            </label>
            <select
              id="position-select"
              v-model="selectedPosition"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
            >
              <option 
                v-for="option in positionOptions" 
                :key="option.value" 
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- ตัวกรองบริษัท -->
          <div class="space-y-2">
            <label 
              for="company-select" 
              class="block text-sm font-medium text-gray-700"
            >
              เลือกบริษัท
            </label>
            <select
              id="company-select"
              v-model="selectedCompany"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
            >
              <option 
                v-for="option in companyOptions" 
                :key="option.value" 
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- ตัวกรองปี -->
          <div class="space-y-2">
            <label 
              for="year-select" 
              class="block text-sm font-medium text-gray-700"
            >
              เลือกปี
            </label>
            <select
              id="year-select"
              v-model="selectedYear"
              :disabled="availableYears.length === 0"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              <!-- แสดงข้อความเมื่อไม่มีข้อมูลปี -->
              <option v-if="availableYears.length === 0" :value="null">
                ไม่มีข้อมูลปี
              </option>
              <!-- แสดงรายการปีทั้งหมด -->
              <option 
                v-for="year in availableYears" 
                :key="year" 
                :value="year"
              >
                {{ year }}
              </option>
            </select>
          </div>

          <!-- ตัวกรองช่วงเวลา -->
          <div class="space-y-2">
            <label 
              for="timeframe-select" 
              class="block text-sm font-medium text-gray-700"
            >
              ช่วงเวลา
            </label>
            <select
              id="timeframe-select"
              v-model="selectedTimeframe"
              class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
            >
              <option 
                v-for="option in timeframeOptions" 
                :key="option.value" 
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
        
        <!-- สรุปตัวกรองที่เลือก - แสดงเป็นแท็กสีต่างๆ -->
        <div class="mt-4 pt-4 border-t border-gray-200">
          <div class="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span class="font-semibold text-gray-700">กำลังแสดง:</span>
            <span class="px-2 py-1 bg-blue-50 text-blue-700 rounded">
              {{ getPositionLabel() }}
            </span>
            <span class="text-gray-400">•</span>
            <span class="px-2 py-1 bg-green-50 text-green-700 rounded">
              {{ companyOptions.find(opt => opt.value === selectedCompany)?.label }}
            </span>
            <span class="text-gray-400">•</span>
            <span class="px-2 py-1 bg-purple-50 text-purple-700 rounded">
              ปี {{ selectedYear }}
            </span>
            <span class="text-gray-400">•</span>
            <span class="px-2 py-1 bg-orange-50 text-orange-700 rounded">
              {{ timeframeOptions.find(opt => opt.value === selectedTimeframe)?.label }}
            </span>
          </div>
        </div>
      </section>

      <!-- ========================================
           ส่วนแสดงกราฟ
           ======================================== -->
      <section class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <!-- หัวข้อของกราฟ -->
        <header class="mb-6 pb-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-800">
            {{ getPositionLabel() }}
          </h2>
          <p class="text-sm text-gray-500 mt-1">
            {{ getCompanyLabel() }}
          </p>
        </header>
        
        <!-- แสดงข้อความโหลด เมื่อกำลังดึงข้อมูล -->
        <div v-if="isLoading" class="flex justify-center items-center" style="height: 450px;">
          <p class="text-gray-500">กำลังโหลดข้อมูล...</p>
        </div>
        
        <!-- แสดงกราฟ เมื่อมีข้อมูล -->
        <div v-else-if="chartData && chartData.datasets" class="w-full" style="height: 450px;">
          <StackedBar 
            :chart-data="chartData"
            :bar-percentage="0.5"
            :category-percentage="0.6"
          />
        </div>

        <!-- แสดงข้อความเมื่อไม่พบข้อมูล -->
        <div v-else class="text-center" style="height: 450px;">
          <!-- ไอคอนเอกสาร -->
          <svg 
            class="mx-auto h-12 w-12 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">
            ไม่พบข้อมูล
          </h3>
          <p class="mt-2 text-sm text-gray-500">
            ไม่พบข้อมูลสำหรับการเลือกปัจจุบัน กรุณาเลือกตัวกรองอื่น
          </p>
        </div>
      </section>

    </main>
  </div>
</template>

<style scoped>
/* การเปลี่ยนแปลง style แบบนุ่มนวลเมื่อมีการเปลี่ยนสถานะ */
select {
  transition: all 0.2s ease;
}

/* เปลี่ยนสีขอบเมื่อ hover (ยกเว้นตอนที่ disable) */
select:hover:not(:disabled) {
  border-color: #9ca3af;
}

/* แสดงเงารอบๆ เมื่อ focus ที่ select */
select:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>