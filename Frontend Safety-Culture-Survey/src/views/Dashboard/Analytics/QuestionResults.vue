
<script setup>
import { ref, computed } from "vue";
import StackedBar from "../Showgraph/StackedBar.vue";
import NavbarDashboard from '../../../components/NavbarDashboard.vue';

const selectedGroup = ref("All");
const selectedType = ref("ทั้งหมด");
const selectedTimeframe = ref("current");

const isCombinedView = computed(() =>
  selectedGroup.value === "All" && selectedType.value === "ทั้งหมด"
);

const fullLabels = [
  "A: Comms with workforce", "B: Commitment level of w/f", "C: Rewards of good HSE",
  "D: Who causes accidents", "E: Profit & HSE", "F: Contractor management",
  "G: Competency & training", "H: Size of HSE Dept.", "I: Work planning",
  "J: Worksite safety mgmt.", "K: Purpose of procedures", "L: Incident reporting",
  "M: Hazard reporting", "N: What after accident", "O: Who checks HSE day-day",
  "P: How HSE meetings feel", "Q: Audits & reviews", "R: Benchmarking"
];

const baseData = {
  DM: {
    labels: ["DMO", "DMF", "DMA", "DMT", "DMP", "DMS", "DMM", "DME", "DMD", "DMQ",],
    v1: {
      current: [
        [2, 1, 1, 1, 1, 5, 1, 2, 4, 4, 1, 5, 3, 2, 1, 4, 5, 3],
        [1, 4, 2, 5, 3, 3, 4, 1, 5, 2, 4, 3, 1, 5, 2, 4, 3, 4],
        [1, 1, 4, 2, 5, 1, 3, 4, 2, 5, 1, 4, 3, 2, 5, 1, 4, 2],
        [1, 2, 3, 1, 4, 5, 2, 3, 1, 4, 5, 2, 3, 1, 4, 5, 2, 3],
        [1, 3, 1, 5, 2, 4, 3, 1, 5, 2, 4, 3, 1, 5, 2, 4, 3, 1],
        [2, 5, 3, 1, 4, 2, 5, 3, 1, 4, 2, 5, 3, 1, 4, 2, 5, 3],
        [1, 3, 5, 2, 4, 1, 3, 5, 2, 4, 1, 3, 5, 2, 4, 1, 3, 5],
        [1, 4, 2, 1, 5, 3, 4, 2, 1, 5, 3, 4, 2, 1, 5, 3, 4, 2],
        [1, 1, 5, 3, 2, 4, 1, 5, 3, 2, 4, 1, 5, 3, 2, 4, 1, 5],
        [1, 2, 4, 1, 3, 5, 2, 4, 1, 3, 5, 2, 4, 1, 3, 5, 2, 4],
      ],
      future: [
        [5, 1, 3, 2, 4, 5, 1, 3, 2, 4, 5, 1, 3, 2, 4, 5, 1, 3],
        [3, 2, 5, 1, 4, 3, 2, 5, 1, 4, 3, 2, 5, 1, 4, 3, 2, 5],
        [2, 4, 1, 5, 3, 2, 4, 1, 5, 3, 2, 4, 1, 5, 3, 2, 4, 1],
        [4, 5, 2, 3, 1, 4, 5, 2, 3, 1, 4, 5, 2, 3, 1, 4, 5, 2],
        [1, 3, 4, 2, 5, 1, 3, 4, 2, 5, 1, 3, 4, 2, 5, 1, 3, 4],
        [3, 1, 5, 4, 2, 3, 1, 5, 4, 2, 3, 1, 5, 4, 2, 3, 1, 5],
        [5, 4, 1, 2, 3, 5, 4, 1, 2, 3, 5, 4, 1, 2, 3, 5, 4, 1],
        [2, 1, 4, 3, 5, 2, 1, 4, 3, 5, 2, 1, 4, 3, 5, 2, 1, 4],
        [4, 3, 2, 5, 1, 4, 3, 2, 5, 1, 4, 3, 2, 5, 1, 4, 3, 2],
        [1, 5, 3, 4, 2, 1, 5, 3, 4, 2, 1, 5, 3, 4, 2, 1, 5, 3],
      ]
    },
    v2: {
      current: [
        [4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5],
        [2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4],
        [1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2],
        [5, 2, 1, 4, 3, 5, 2, 1, 4, 3, 5, 2, 1, 4, 3, 5, 2, 1],
        [3, 4, 5, 2, 1, 3, 4, 5, 2, 1, 3, 4, 5, 2, 1, 3, 4, 5],
        [4, 1, 2, 5, 3, 4, 1, 2, 5, 3, 4, 1, 2, 5, 3, 4, 1, 2],
        [2, 5, 3, 1, 4, 2, 5, 3, 1, 4, 2, 5, 3, 1, 4, 2, 5, 3],
        [1, 3, 4, 5, 2, 1, 3, 4, 5, 2, 1, 3, 4, 5, 2, 1, 3, 4],
        [5, 4, 1, 2, 3, 5, 4, 1, 2, 3, 5, 4, 1, 2, 3, 5, 4, 1],
        [3, 1, 5, 4, 2, 3, 1, 5, 4, 2, 3, 1, 5, 4, 2, 3, 1, 5],
      ],
      future: [
        [1, 4, 2, 5, 3, 1, 4, 2, 5, 3, 1, 4, 2, 5, 3, 1, 4, 2],
        [4, 2, 1, 3, 5, 4, 2, 1, 3, 5, 4, 2, 1, 3, 5, 4, 2, 1],
        [3, 5, 4, 1, 2, 3, 5, 4, 1, 2, 3, 5, 4, 1, 2, 3, 5, 4],
        [2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5],
        [5, 3, 1, 2, 4, 5, 3, 1, 2, 4, 5, 3, 1, 2, 4, 5, 3, 1],
        [1, 2, 3, 5, 4, 1, 2, 3, 5, 4, 1, 2, 3, 5, 4, 1, 2, 3],
        [4, 1, 2, 3, 5, 4, 1, 2, 3, 5, 4, 1, 2, 3, 5, 4, 1, 2],
        [3, 5, 1, 4, 2, 3, 5, 1, 4, 2, 3, 5, 1, 4, 2, 3, 5, 1],
        [2, 4, 5, 1, 3, 2, 4, 5, 1, 3, 2, 4, 5, 1, 3, 2, 4, 5],
        [5, 1, 3, 2, 4, 5, 1, 3, 2, 4, 5, 1, 3, 2, 4, 5, 1, 3],
      ]
    }
  },
  SVP: {
    labels: ["VPO", "VPF", "VPA", "VPT", "VPP", "VPS", "VPM", "VPE", "VPD", "VPQ"],
    v1: {
      current: [
        [3, 1, 4, 5, 2, 3, 1, 4, 5, 2, 3, 1, 4, 5, 2, 3, 1, 4],
        [1, 5, 2, 4, 3, 1, 5, 2, 4, 3, 1, 5, 2, 4, 3, 1, 5, 2],
        [4, 2, 5, 3, 1, 4, 2, 5, 3, 1, 4, 2, 5, 3, 1, 4, 2, 5],
        [2, 3, 1, 4, 5, 2, 3, 1, 4, 5, 2, 3, 1, 4, 5, 2, 3, 1],
        [5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3],
        [3, 1, 2, 5, 4, 3, 1, 2, 5, 4, 3, 1, 2, 5, 4, 3, 1, 2],
        [1, 4, 5, 2, 3, 1, 4, 5, 2, 3, 1, 4, 5, 2, 3, 1, 4, 5],
        [4, 5, 1, 3, 2, 4, 5, 1, 3, 2, 4, 5, 1, 3, 2, 4, 5, 1],
        [2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4],
        [5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2]
      ],
      future: [
        [5, 2, 1, 4, 3, 5, 2, 1, 4, 3, 5, 2, 1, 4, 3, 5, 2, 1],
        [1, 3, 4, 2, 5, 1, 3, 4, 2, 5, 1, 3, 4, 2, 5, 1, 3, 4],
        [3, 4, 2, 5, 1, 3, 4, 2, 5, 1, 3, 4, 2, 5, 1, 3, 4, 2],
        [4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5],
        [2, 5, 3, 1, 4, 2, 5, 3, 1, 4, 2, 5, 3, 1, 4, 2, 5, 3],
        [5, 1, 4, 3, 2, 5, 1, 4, 3, 2, 5, 1, 4, 3, 2, 5, 1, 4],
        [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3],
        [3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5],
        [4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1],
        [2, 1, 3, 5, 4, 2, 1, 3, 5, 4, 2, 1, 3, 5, 4, 2, 1, 3]
      ]
    },
    v2: {
      current: [
        [4, 2, 1, 5, 3, 4, 2, 1, 5, 3, 4, 2, 1, 5, 3, 4, 2, 1],
        [2, 5, 3, 1, 4, 2, 5, 3, 1, 4, 2, 5, 3, 1, 4, 2, 5, 3],
        [5, 1, 4, 3, 2, 5, 1, 4, 3, 2, 5, 1, 4, 3, 2, 5, 1, 4],
        [1, 3, 2, 4, 5, 1, 3, 2, 4, 5, 1, 3, 2, 4, 5, 1, 3, 2],
        [3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5],
        [4, 1, 2, 5, 3, 4, 1, 2, 5, 3, 4, 1, 2, 5, 3, 4, 1, 2],
        [2, 5, 1, 3, 4, 2, 5, 1, 3, 4, 2, 5, 1, 3, 4, 2, 5, 1],
        [5, 3, 4, 2, 1, 5, 3, 4, 2, 1, 5, 3, 4, 2, 1, 5, 3, 4],
        [1, 2, 5, 4, 3, 1, 2, 5, 4, 3, 1, 2, 5, 4, 3, 1, 2, 5],
        [3, 4, 1, 2, 5, 3, 4, 1, 2, 5, 3, 4, 1, 2, 5, 3, 4, 1]
      ],
      future: [
        [4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5],
        [1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2],
        [5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3],
        [2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4],
        [3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1],
        [4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5],
        [1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2],
        [5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3],
        [2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4],
        [3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1]
      ]
    }
  },
  EVP: {
    labels: ["COO", "CFO", "CTO", "CMO", "CCO"],
    v1: {
      current: [
        [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3],
        [5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3],
        [3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2, 1],
        [4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1],
        [2, 1, 4, 3, 5, 2, 1, 4, 3, 5, 2, 1, 4, 3, 5, 2, 1, 4]
      ],
      future: [
        [5, 1, 4, 2, 3, 5, 1, 4, 2, 3, 5, 1, 4, 2, 3, 5, 1, 4],
        [1, 4, 2, 3, 5, 1, 4, 2, 3, 5, 1, 4, 2, 3, 5, 1, 4, 2],
        [4, 2, 3, 5, 1, 4, 2, 3, 5, 1, 4, 2, 3, 5, 1, 4, 2, 3],
        [2, 3, 5, 1, 4, 2, 3, 5, 1, 4, 2, 3, 5, 1, 4, 2, 3, 5],
        [3, 5, 1, 4, 2, 3, 5, 1, 4, 2, 3, 5, 1, 4, 2, 3, 5, 1]
      ]
    },
    v2: {
      current: [
        [3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1],
        [1, 2, 5, 4, 3, 1, 2, 5, 4, 3, 1, 2, 5, 4, 3, 1, 2, 5],
        [4, 5, 2, 1, 3, 4, 5, 2, 1, 3, 4, 5, 2, 1, 3, 4, 5, 2],
        [2, 1, 3, 5, 4, 2, 1, 3, 5, 4, 2, 1, 3, 5, 4, 2, 1, 3],
        [5, 3, 4, 2, 1, 5, 3, 4, 2, 1, 5, 3, 4, 2, 1, 5, 3, 4]
      ],
      future: [
        [5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2],
        [4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2],
        [1, 2, 3, 5, 4, 1, 2, 3, 5, 4, 1, 2, 3, 5, 4, 1, 2, 3],
        [3, 4, 5, 2, 1, 3, 4, 5, 2, 1, 3, 4, 5, 2, 1, 3, 4, 5],
        [2, 5, 1, 4, 3, 2, 5, 1, 4, 3, 2, 5, 1, 4, 3, 2, 5, 1]
      ]
    }
  }
};

// Function to combine all groups data
const combineAllGroups = () => {
  const groups = ['DM', 'SVP', 'EVP'];
  const combinedData = {
    labels: fullLabels,
    v1: { current: [], future: [] },
    v2: { current: [], future: [] }
  };

  // Initialize arrays for each question (18 questions)
  for (let i = 0; i < 18; i++) {
    combinedData.v1.current[i] = [];
    combinedData.v1.future[i] = [];
    combinedData.v2.current[i] = [];
    combinedData.v2.future[i] = [];
  }

  // Combine data from all groups
  groups.forEach(group => {
    const groupData = baseData[group];
    
    // Combine v1 data
    groupData.v1.current.forEach((row, questionIndex) => {
      combinedData.v1.current[questionIndex].push(...row);
    });
    groupData.v1.future.forEach((row, questionIndex) => {
      combinedData.v1.future[questionIndex].push(...row);
    });
    
    // Combine v2 data
    groupData.v2.current.forEach((row, questionIndex) => {
      combinedData.v2.current[questionIndex].push(...row);
    });
    groupData.v2.future.forEach((row, questionIndex) => {
      combinedData.v2.future[questionIndex].push(...row);
    });
  });

  return combinedData;
};

// Add the combined "All" data to baseData
baseData.All = combineAllGroups();

const stackedBarCombinedData = computed(() => {
  const group = baseData["All"];
  const v1 = group.v1?.[selectedTimeframe.value] || [];
  const v2 = group.v2?.[selectedTimeframe.value] || [];

const combined = v1.map((row, i) =>
  row.map((val, j) => val + (v2[i]?.[j] || 0))
);
  return {
    labels: fullLabels,
    datasets: [
      {
        label: `All - V1+V2 (${selectedTimeframe.value === "current" ? "ปัจจุบัน" : "คาดในอนาคต"})`,
        data: combined
      }
    ]
  };
});

const stackedBarV1Data = computed(() => {
  const group = baseData[selectedGroup.value];
  const raw = group.v1?.[selectedTimeframe.value] || [];
  return {
    labels: fullLabels,
    datasets: [
      {
        label: `${selectedGroup.value} - V1 (${selectedTimeframe.value === "current" ? "ปัจจุบัน" : "คาดในอนาคต"})`,
        data: raw
      }
    ]
  };
});

const stackedBarV2Data = computed(() => {
  const group = baseData[selectedGroup.value];
  const raw = group.v2?.[selectedTimeframe.value] || [];
  return {
    labels: fullLabels,
    datasets: [
      {
        label: `${selectedGroup.value} - V2 (${selectedTimeframe.value === "current" ? "ปัจจุบัน" : "คาดในอนาคต"})`,
        data: raw
      }
    ]
  };
});

const groupOptions = [
  { value: "All", label: "รวมทั้งหมด" },
  { value: "DM", label: "Direct Manager (DM)" },
  { value: "SVP", label: "Senior Vice President (SVP)" },
  { value: "EVP", label: "Executive Vice President (EVP)" }
];

const timeframeOptions = [
  { value: "current", label: "ปัจจุบัน" },
  { value: "future", label: "คาดในอนาคต" }
];
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
        <div class="flex flex-col">
          <label class="text-sm text-gray-600 mb-1">เลือกกลุ่ม</label>
          <select
            v-model="selectedGroup"
            class="px-4 py-2 rounded-xl bg-white shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
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

        <div class="flex flex-col">
          <label class="text-sm text-gray-600 mb-1">ช่วงเวลา</label>
          <select
            v-model="selectedTimeframe"
            class="px-4 py-2 rounded-xl bg-white shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
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

      <!-- Combined -->
      <div
        v-if="isCombinedView"
        class="bg-white rounded-2xl shadow-xl p-6 mb-12"
      >
        <h2 class="text-2xl font-semibold text-blue-600 mb-4">
          รวมผล (V1 + V2)
        </h2>
        <div class="overflow-x-auto">
          <div class="min-w-[800px] h-[600px]">
            <StackedBar :chart-data="stackedBarCombinedData" />
          </div>
        </div>
      </div>

      <!-- Separate -->
      <div v-else>
        <!-- V1 -->
        <div class="bg-white rounded-2xl shadow-xl p-6 mb-12">
          <h2 class="text-2xl font-semibold text-green-600 mb-4">
            {{ selectedGroup }} - เวอร์ชัน V1
            ({{ selectedTimeframe === "current" ? "ปัจจุบัน" : "คาดในอนาคต" }})
          </h2>
          <div class="overflow-x-auto">
            <div class="min-w-[800px] h-[600px]">
              <StackedBar :chart-data="stackedBarV1Data" />
            </div>
          </div>
        </div>

        <!-- V2 -->
        <div class="bg-white rounded-2xl shadow-xl p-6">
          <h2 class="text-2xl font-semibold text-purple-600 mb-4">
            {{ selectedGroup }} - เวอร์ชัน V2
            ({{ selectedTimeframe === "current" ? "ปัจจุบัน" : "คาดในอนาคต" }})
          </h2>
          <div class="overflow-x-auto">
            <div class="min-w-[800px] h-[600px]">
              <StackedBar :chart-data="stackedBarV2Data" />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
