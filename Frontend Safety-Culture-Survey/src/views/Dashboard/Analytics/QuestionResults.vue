<script setup>
import { ref, computed } from "vue";
import StackedBar from "../Showgraph/StackedBar.vue";
import NavbarDashboard from '../../../components/NavbarDashboard.vue';
import { baseData, fullLabels } from './basedata.js';

const selectedGroup = ref("All");
const selectedArea = ref("both");
const selectedTimeframe = ref("current");

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
  { value: "both", label: "ทั้งสองพื้นที่ (V1+V2)" },
  { value: "v1", label: "Verte Security เท่านั้น" },
  { value: "v2", label: "Verte Smart Solution เท่านั้น" }
];

// ตัวเลือกสำหรับช่วงเวลา
const timeframeOptions = [
  { value: "current", label: "ปัจจุบัน" },
  { value: "future", label: "คาดในอนาคต" }
];

// คำนวณว่าต้องแสดงข้อมูลแบบไหน
const shouldShowCombined = computed(() => selectedArea.value === "both");
const shouldShowV1Only = computed(() => selectedArea.value === "v1");
const shouldShowV2Only = computed(() => selectedArea.value === "v2");

// ฟังก์ชันช่วยในการรวมข้อมูลจากทุกกลุ่ม
const combineDataFromAllGroups = (version, timeframe) => {
  if (selectedGroup.value === "All") {
    // ถ้าเลือก "All" ให้ใช้ข้อมูลจาก baseData["All"] ที่รวมไว้แล้ว
    return baseData["All"][version]?.[timeframe] || [];
  } else {
    // ถ้าเลือกกลุ่มเฉพาะ ให้ใช้ข้อมูลของกลุ่มนั้น
    return baseData[selectedGroup.value]?.[version]?.[timeframe] || [];
  }
};

// ข้อมูลสำหรับแสดงแบบรวม V1+V2
const stackedBarCombinedData = computed(() => {
  const v1Data = combineDataFromAllGroups('v1', selectedTimeframe.value);
  const v2Data = combineDataFromAllGroups('v2', selectedTimeframe.value);

  // รวมข้อมูล V1 + V2
  const combinedData = v1Data.map((row, i) =>
    row.map((val, j) => val + (v2Data[i]?.[j] || 0))
  );

  return {
    labels: fullLabels,
    datasets: [
      {
        label: `${selectedGroup.value === "All" ? "รวมทั้งหมด" : selectedGroup.value} - V1+V2 (${selectedTimeframe.value === "current" ? "ปัจจุบัน" : "คาดในอนาคต"})`,
        data: combinedData
      }
    ]
  };
});

// ข้อมูลสำหรับ V1 เท่านั้น
const stackedBarV1Data = computed(() => {
  const v1Data = combineDataFromAllGroups('v1', selectedTimeframe.value);
  
  return {
    labels: fullLabels,
    datasets: [
      {
        label: `${selectedGroup.value === "All" ? "รวมทั้งหมด" : selectedGroup.value} - Verte Security (${selectedTimeframe.value === "current" ? "ปัจจุบัน" : "คาดในอนาคต"})`,
        data: v1Data
      }
    ]
  };
});

// ข้อมูลสำหรับ V2 เท่านั้น
const stackedBarV2Data = computed(() => {
  const v2Data = combineDataFromAllGroups('v2', selectedTimeframe.value);
  
  return {
    labels: fullLabels,
    datasets: [
      {
        label: `${selectedGroup.value === "All" ? "รวมทั้งหมด" : selectedGroup.value} - Verte Smart Solution (${selectedTimeframe.value === "current" ? "ปัจจุบัน" : "คาดในอนาคต"})`,
        data: v2Data
      }
    ]
  };
});

// ฟังก์ชันสำหรับรีเซ็ตค่าเมื่อเลือกกลุ่มใหม่
const onGroupChange = () => {
  // สามารถเพิ่มโลจิกเพิ่มเติมได้ถ้าต้องการ
};

// ฟังก์ชันสำหรับจัดการการเปลี่ยนพื้นที่
const onAreaChange = () => {
  // สามารถเพิ่มโลจิกเพิ่มเติมได้ถ้าต้องการ
};
</script>

<template>
  <div class="flex min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
    <!-- Sidebar -->
    <NavbarDashboard />

    <!-- Main Content -->
    <main class="flex-1 ml-60 p-6">
      <h1 class="text-3xl font-bold text-center mb-10 text-gray-800">
        ผลประเมินตามข้อคำถาม
      </h1>

      <!-- Filters -->
      <div class="flex flex-wrap justify-center gap-6 mb-10">
        <!-- เลือกกลุ่ม -->
        <div class="flex flex-col min-w-[200px]">
          <label class="text-sm font-medium text-gray-700 mb-2">เลือกกลุ่ม</label>
          <select
            v-model="selectedGroup"
            @change="onGroupChange"
            class="px-4 py-2 rounded-xl bg-white shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          >
            <option
              v-for="option in groupOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- เลือกพื้นที่ -->
        <div class="flex flex-col min-w-[220px]">
          <label class="text-sm font-medium text-gray-700 mb-2">เลือกพื้นที่</label>
          <select
            v-model="selectedArea"
            @change="onAreaChange"
            class="px-4 py-2 rounded-xl bg-white shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
          >
            <option
              v-for="option in areaOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- เลือกช่วงเวลา -->
        <div class="flex flex-col min-w-[150px]">
          <label class="text-sm font-medium text-gray-700 mb-2">ช่วงเวลา</label>
          <select
            v-model="selectedTimeframe"
            class="px-4 py-2 rounded-xl bg-white shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
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

      <!-- แสดงข้อมูลรวม V1+V2 -->
      <div
        v-if="shouldShowCombined"
        class="bg-white rounded-2xl shadow-xl p-6 mb-8"
      >
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-semibold text-blue-600">
          {{ selectedGroup === "All" ? "รวมทั้งหมด" : selectedGroup }} - ทั้งสองพื้นที่ (V1+V2)
          </h2>
          <div class="flex items-center space-x-2 text-sm text-gray-600">
            <span class="px-3 py-1 bg-blue-100 rounded-full">
              {{ selectedTimeframe === "current" ? "ปัจจุบัน" : "คาดในอนาคต" }}
            </span>
          </div>
        </div>
        <div class="overflow-x-auto">
          <div class="min-w-[800px] h-[600px]">
            <StackedBar :chart-data="stackedBarCombinedData" />
          </div>
        </div>
      </div>

      <!-- แสดงข้อมูล V1 เท่านั้น -->
      <div 
        v-if="shouldShowV1Only"
        class="bg-white rounded-2xl shadow-xl p-6 mb-8"
      >
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-semibold text-green-600">
           {{ selectedGroup === "All" ? "รวมทั้งหมด" : selectedGroup }} - Verte Security
          </h2>
          <div class="flex items-center space-x-2 text-sm text-gray-600">
            <span class="px-3 py-1 bg-green-100 rounded-full">
              {{ selectedTimeframe === "current" ? "ปัจจุบัน" : "คาดในอนาคต" }}
            </span>
          </div>
        </div>
        <div class="overflow-x-auto">
          <div class="min-w-[800px] h-[600px]">
            <StackedBar :chart-data="stackedBarV1Data" />
          </div>
        </div>
      </div>

      <!-- แสดงข้อมูล V2 เท่านั้น -->
      <div 
        v-if="shouldShowV2Only"
        class="bg-white rounded-2xl shadow-xl p-6 mb-8"
      >
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-semibold text-purple-600">
           {{ selectedGroup === "All" ? "รวมทั้งหมด" : selectedGroup }} - Verte Smart Solution
          </h2>
          <div class="flex items-center space-x-2 text-sm text-gray-600">
            <span class="px-3 py-1 bg-purple-100 rounded-full">
              {{ selectedTimeframe === "current" ? "ปัจจุบัน" : "คาดในอนาคต" }}
            </span>
          </div>
        </div>
        <div class="overflow-x-auto">
          <div class="min-w-[800px] h-[600px]">
            <StackedBar :chart-data="stackedBarV2Data" />
          </div>
        </div>
      </div>

      <!-- แสดงข้อความเมื่อไม่มีข้อมูล -->
      <div v-if="!shouldShowCombined && !shouldShowV1Only && !shouldShowV2Only" class="text-center py-12">
        <div class="text-gray-500 text-lg">ไม่มีข้อมูลสำหรับการเลือกปัจจุบัน</div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* เพิ่ม style สำหรับ transition ที่นุ่มนวล */
.transition-all {
  transition: all 0.2s ease-in-out;
}

/* สำหรับ hover effect บน select */
select:hover {
  border-color: #9CA3AF;
}

/* เพิ่มเงาให้กับ card เมื่อ hover */
.bg-white:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.3s ease-in-out;
}
</style>