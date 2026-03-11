<script setup>
import { ref, computed, onMounted } from "vue";
import BetChart from "../Showgraph/BetChart.vue";
import NavbarDashboard from '../../../components/NavbarDashboard.vue';

const selectedGroup = ref("all");
const selectedUnits = ref([]);
const selectedPeriod = ref("both");
const selectedVersion = ref("both");
const versionOptions = ref([]);

const shouldInclude = (version) => {
  return selectedVersion.value === version || selectedVersion.value === "both";
};

const shouldIncludePeriod = (period) => {
  return selectedPeriod.value === period || selectedPeriod.value === "both";
};

const fetchVersionOptions = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'both', name: 'Verte Group' },
        { id: 'company_1', name: 'Verte Smart Solution' },
        { id: 'company_2', name: 'Verte Security' }
      ]);
    }, 100);
  });
};

onMounted(async () => {
  versionOptions.value = await fetchVersionOptions();
});

const baseData = {
  contractor: {
    labels: ["CEO", "REP", "COO", "CFO", "SSE", "PSE", "CME"],
    company_1: {
      current: [
        [3, 4, 2, 1, 5, 4, 3, 1, 2, 5, 3, 4, 2, 1, 5, 4, 3, 1],
        [2, 3, 5, 4, 1, 3, 2, 5, 4, 1, 2, 3, 5, 4, 1, 3, 2, 5],
        [4, 1, 3, 5, 2, 1, 4, 3, 5, 2, 4, 1, 3, 5, 2, 1, 4, 3],
        [1, 5, 4, 2, 3, 5, 1, 4, 2, 3, 1, 5, 4, 2, 3, 5, 1, 4],
        [5, 2, 1, 3, 4, 2, 5, 1, 3, 4, 5, 2, 1, 3, 4, 2, 5, 1],
        [3, 4, 5, 1, 2, 4, 3, 5, 1, 2, 3, 4, 5, 1, 2, 4, 3, 5],
        [2, 1, 4, 3, 5, 1, 2, 4, 3, 5, 2, 1, 4, 3, 5, 1, 2, 4]
      ],
      future: [
        [4, 2, 5, 3, 1, 2, 4, 5, 3, 1, 4, 2, 5, 3, 1, 2, 4, 5],
        [5, 3, 1, 4, 2, 3, 5, 1, 4, 2, 5, 3, 1, 4, 2, 3, 5, 1],
        [1, 4, 3, 2, 5, 4, 1, 3, 2, 5, 1, 4, 3, 2, 5, 4, 1, 3],
        [3, 1, 2, 5, 4, 1, 3, 2, 5, 4, 3, 1, 2, 5, 4, 1, 3, 2],
        [2, 5, 4, 1, 3, 5, 2, 4, 1, 3, 2, 5, 4, 1, 3, 5, 2, 4],
        [4, 3, 1, 2, 5, 3, 4, 1, 2, 5, 4, 3, 1, 2, 5, 3, 4, 1],
        [1, 2, 3, 4, 5, 2, 1, 3, 4, 5, 1, 2, 3, 4, 5, 2, 1, 3]
      ]
    },
    company_2: {
      current: [
        [5, 3, 1, 4, 2, 3, 5, 1, 4, 2, 5, 3, 1, 4, 2, 3, 5, 1],
        [1, 4, 3, 2, 5, 4, 1, 3, 2, 5, 1, 4, 3, 2, 5, 4, 1, 3],
        [2, 1, 5, 3, 4, 1, 2, 5, 3, 4, 2, 1, 5, 3, 4, 1, 2, 5],
        [4, 5, 2, 1, 3, 5, 4, 2, 1, 3, 4, 5, 2, 1, 3, 5, 4, 2],
        [3, 2, 4, 5, 1, 2, 3, 4, 5, 1, 3, 2, 4, 5, 1, 2, 3, 4],
        [5, 1, 2, 4, 3, 1, 5, 2, 4, 3, 5, 1, 2, 4, 3, 1, 5, 2],
        [4, 3, 5, 1, 2, 3, 4, 5, 1, 2, 4, 3, 5, 1, 2, 4, 3, 5]
      ],
      future: [
        [2, 4, 3, 5, 1, 4, 2, 3, 5, 1, 2, 4, 3, 5, 1, 4, 2, 3],
        [5, 1, 4, 2, 3, 1, 5, 4, 2, 3, 5, 1, 4, 2, 3, 1, 5, 4],
        [4, 3, 2, 1, 5, 3, 4, 2, 1, 5, 4, 3, 2, 1, 5, 3, 4, 2],
        [1, 2, 5, 4, 3, 2, 1, 5, 4, 3, 1, 2, 5, 4, 3, 2, 1, 5],
        [3, 5, 1, 2, 4, 5, 3, 1, 2, 4, 3, 5, 1, 2, 4, 5, 3, 1],
        [2, 1, 4, 3, 5, 1, 2, 4, 3, 5, 2, 1, 4, 3, 5, 1, 2, 4],
        [5, 4, 2, 1, 3, 4, 5, 2, 1, 3, 5, 4, 2, 1, 3, 4, 5, 2]
      ]
    }
  },
  employee: {
    labels: ["CEO", "REP", "COO", "CFO", "SSE", "PSE", "CME"],
    company_1: {
      current: [
        [2, 5, 1, 4, 3, 5, 1, 2, 4, 4, 1, 5, 3, 2, 1, 4, 5, 3],
        [1, 4, 2, 5, 3, 3, 4, 1, 5, 2, 4, 3, 1, 5, 2, 4, 3, 4],
        [3, 1, 4, 2, 5, 1, 3, 4, 2, 5, 1, 4, 3, 2, 5, 1, 4, 2],
        [5, 2, 3, 1, 4, 5, 2, 3, 1, 4, 5, 2, 3, 1, 4, 5, 2, 3],
        [4, 3, 1, 5, 2, 4, 3, 1, 5, 2, 4, 3, 1, 5, 2, 4, 3, 1],
        [2, 5, 3, 1, 4, 2, 5, 3, 1, 4, 2, 5, 3, 1, 4, 2, 5, 3],
        [1, 3, 5, 2, 4, 1, 3, 5, 2, 4, 1, 3, 5, 2, 4, 1, 3, 5]
      ],
      future: [
        [5, 1, 3, 2, 4, 5, 1, 3, 2, 4, 5, 1, 3, 2, 4, 5, 1, 3],
        [3, 2, 5, 1, 4, 3, 2, 5, 1, 4, 3, 2, 5, 1, 4, 3, 2, 5],
        [2, 4, 1, 5, 3, 2, 4, 1, 5, 3, 2, 4, 1, 5, 3, 2, 4, 1],
        [4, 5, 2, 3, 1, 4, 5, 2, 3, 1, 4, 5, 2, 3, 1, 4, 5, 2],
        [1, 3, 4, 2, 5, 1, 3, 4, 2, 5, 1, 3, 4, 2, 5, 1, 3, 4],
        [3, 1, 5, 4, 2, 3, 1, 5, 4, 2, 3, 1, 5, 4, 2, 3, 1, 5],
        [5, 4, 1, 2, 3, 5, 4, 1, 2, 3, 5, 4, 1, 2, 3, 5, 4, 1]
      ]
    },
    company_2: {
      current: [
        [4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5],
        [2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4],
        [1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2],
        [5, 2, 1, 4, 3, 5, 2, 1, 4, 3, 5, 2, 1, 4, 3, 5, 2, 1],
        [3, 4, 5, 2, 1, 3, 4, 5, 2, 1, 3, 4, 5, 2, 1, 3, 4, 5],
        [4, 1, 2, 5, 3, 4, 1, 2, 5, 3, 4, 1, 2, 5, 3, 4, 1, 2],
        [2, 5, 3, 1, 4, 2, 5, 3, 1, 4, 2, 5, 3, 1, 4, 2, 5, 3]
      ],
      future: [
        [1, 4, 2, 5, 3, 1, 4, 2, 5, 3, 1, 4, 2, 5, 3, 1, 4, 2],
        [4, 2, 1, 3, 5, 4, 2, 1, 3, 5, 4, 2, 1, 3, 5, 4, 2, 1],
        [3, 5, 4, 1, 2, 3, 5, 4, 1, 2, 3, 5, 4, 1, 2, 3, 5, 4],
        [2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5],
        [5, 3, 1, 2, 4, 5, 3, 1, 2, 4, 5, 3, 1, 2, 4, 5, 3, 1],
        [1, 2, 3, 5, 4, 1, 2, 3, 5, 4, 1, 2, 3, 5, 4, 1, 2, 3],
        [4, 1, 2, 3, 5, 4, 1, 2, 3, 5, 4, 1, 2, 3, 5, 4, 1, 2]
      ]
    }
  },
  manager: {
    labels: ["CEO", "REP", "COO", "CFO", "SSE", "PSE", "CME"],
    company_1: {
      current: [
        [3, 1, 4, 5, 2, 3, 1, 4, 5, 2, 3, 1, 4, 5, 2, 3, 1, 4],
        [1, 5, 2, 4, 3, 1, 5, 2, 4, 3, 1, 5, 2, 4, 3, 1, 5, 2],
        [4, 2, 5, 3, 1, 4, 2, 5, 3, 1, 4, 2, 5, 3, 1, 4, 2, 5],
        [2, 3, 1, 4, 5, 2, 3, 1, 4, 5, 2, 3, 1, 4, 5, 2, 3, 1],
        [5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3],
        [3, 1, 2, 5, 4, 3, 1, 2, 5, 4, 3, 1, 2, 5, 4, 3, 1, 2],
        [1, 4, 5, 2, 3, 1, 4, 5, 2, 3, 1, 4, 5, 2, 3, 1, 4, 5]
      ],
      future: [
        [5, 2, 1, 4, 3, 5, 2, 1, 4, 3, 5, 2, 1, 4, 3, 5, 2, 1],
        [1, 3, 4, 2, 5, 1, 3, 4, 2, 5, 1, 3, 4, 2, 5, 1, 3, 4],
        [3, 4, 2, 5, 1, 3, 4, 2, 5, 1, 3, 4, 2, 5, 1, 3, 4, 2],
        [4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5],
        [2, 5, 3, 1, 4, 2, 5, 3, 1, 4, 2, 5, 3, 1, 4, 2, 5, 3],
        [5, 1, 4, 3, 2, 5, 1, 4, 3, 2, 5, 1, 4, 3, 2, 5, 1, 4],
        [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3]
      ]
    },
    company_2: {
      current: [
        [4, 2, 1, 5, 3, 4, 2, 1, 5, 3, 4, 2, 1, 5, 3, 4, 2, 1],
        [2, 5, 3, 1, 4, 2, 5, 3, 1, 4, 2, 5, 3, 1, 4, 2, 5, 3],
        [5, 1, 4, 3, 2, 5, 1, 4, 3, 2, 5, 1, 4, 3, 2, 5, 1, 4],
        [1, 3, 2, 4, 5, 1, 3, 2, 4, 5, 1, 3, 2, 4, 5, 1, 3, 2],
        [3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5],
        [4, 1, 2, 5, 3, 4, 1, 2, 5, 3, 4, 1, 2, 5, 3, 4, 1, 2],
        [2, 5, 1, 3, 4, 2, 5, 1, 3, 4, 2, 5, 1, 3, 4, 2, 5, 1]
      ],
      future: [
        [4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5],
        [1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2],
        [5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3],
        [2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4],
        [3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1],
        [4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5],
        [1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2]
      ]
    }
  },
  senior: {
    labels: ["CEO", "REP", "COO", "CFO", "SSE", "PSE", "CME"],
    company_1: {
      current: [
        [1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3],
        [5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3],
        [3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2, 1],
        [4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1],
        [2, 1, 4, 3, 5, 2, 1, 4, 3, 5, 2, 1, 4, 3, 5, 2, 1, 4],
        [1, 3, 5, 4, 2, 1, 3, 5, 4, 2, 1, 3, 5, 4, 2, 1, 3, 5],
        [5, 2, 4, 1, 3, 5, 2, 4, 1, 3, 5, 2, 4, 1, 3, 5, 2, 4]
      ],
      future: [
        [5, 1, 4, 2, 3, 5, 1, 4, 2, 3, 5, 1, 4, 2, 3, 5, 1, 4],
        [1, 4, 2, 3, 5, 1, 4, 2, 3, 5, 1, 4, 2, 3, 5, 1, 4, 2],
        [4, 2, 3, 5, 1, 4, 2, 3, 5, 1, 4, 2, 3, 5, 1, 4, 2, 3],
        [2, 3, 5, 1, 4, 2, 3, 5, 1, 4, 2, 3, 5, 1, 4, 2, 3, 5],
        [3, 5, 1, 4, 2, 3, 5, 1, 4, 2, 3, 5, 1, 4, 2, 3, 5, 1],
        [2, 1, 3, 5, 4, 2, 1, 3, 5, 4, 2, 1, 3, 5, 4, 2, 1, 3],
        [4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2]
      ]
    },
    company_2: {
      current: [
        [3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1, 5, 2, 3, 4, 1],
        [1, 2, 5, 4, 3, 1, 2, 5, 4, 3, 1, 2, 5, 4, 3, 1, 2, 5],
        [4, 5, 2, 1, 3, 4, 5, 2, 1, 3, 4, 5, 2, 1, 3, 4, 5, 2],
        [2, 1, 3, 5, 4, 2, 1, 3, 5, 4, 2, 1, 3, 5, 4, 2, 1, 3],
        [5, 3, 4, 2, 1, 5, 3, 4, 2, 1, 5, 3, 4, 2, 1, 5, 3, 4],
        [3, 2, 1, 4, 5, 3, 2, 1, 4, 5, 3, 2, 1, 4, 5, 3, 2, 1],
        [1, 4, 2, 3, 5, 1, 4, 2, 3, 5, 1, 4, 2, 3, 5, 1, 4, 2]
      ],
      future: [
        [5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2],
        [4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2, 1, 5, 4, 3, 2],
        [1, 2, 3, 5, 4, 1, 2, 3, 5, 4, 1, 2, 3, 5, 4, 1, 2, 3],
        [3, 4, 5, 2, 1, 3, 4, 5, 2, 1, 3, 4, 5, 2, 1, 3, 4, 5],
        [2, 5, 1, 4, 3, 2, 5, 1, 4, 3, 2, 5, 1, 4, 3, 2, 5, 1],
        [4, 1, 3, 2, 5, 4, 1, 3, 2, 5, 4, 1, 3, 2, 5, 4, 1, 3],
        [3, 2, 4, 1, 5, 3, 2, 4, 1, 5, 3, 2, 4, 1, 5, 3, 2, 4]
      ]
    }
  },
};

// สีที่ชัดเจนและแยกแยะง่าย
const colorScheme = {
  contractor: { 
    current: "#16a34a",  // เขียวเข้ม
    future: "#86efac"    // เขียวอ่อน
  },
  employee: { 
    current: "#2563eb",  // น้ำเงินเข้ม
    future: "#93c5fd"    // น้ำเงินอ่อน
  },
  manager: { 
    current: "#9333ea",  // ม่วงเข้ม
    future: "#c084fc"    // ม่วงอ่อน
  },
  senior: { 
    current: "#dc2626",  // แดงเข้ม
    future: "#fca5a5"    // แดงอ่อน
  },
  all: {
    current: "#1e40af",  // น้ำเงินเข้ม
    future: "#93c5fd"    // น้ำเงินอ่อน
  }
};

const groupNames = {
  all: "รวมทั้งหมด",
  senior: "ผู้บริหารระดับสูง / ผู้จัดการส่วน",
  manager: "ผู้จัดการแผนก / ผู้จัดการ / พนักงานอาวุโส",
  employee: "พนักงาน",
  contractor: "ผู้รับเหมา"
};

const calculateAverage = (scores) => {
  if (!Array.isArray(scores) || scores.length === 0) return 0;
  const flat = scores.flat();
  if (flat.length === 0) return 0;
  return +(flat.reduce((a, b) => a + b, 0) / flat.length).toFixed(2);
};

const availableUnits = computed(() => {
  if (selectedGroup.value === "all") return [];
  return baseData[selectedGroup.value]?.labels || [];
});

const handleGroupChange = () => selectedUnits.value = [];
const clearAllUnits = () => selectedUnits.value = [];

const chartData = computed(() => {
  const isAll = selectedGroup.value === "all";
  const datasets = [];
  let labels = [];

  if (isAll) {
    const allLabels = Object.values(baseData).flatMap(g => g.labels);
    labels = [...new Set(allLabels)];
  } else {
    const groupLabels = baseData[selectedGroup.value]?.labels || [];
    labels = selectedUnits.value.length > 0 ? selectedUnits.value : groupLabels;
  }

  const getScores = (group, version, period, label) => {
    const labelIndex = group.labels.indexOf(label);
    if (labelIndex === -1) return null;
    return group[version]?.[period]?.[labelIndex] || null;
  };

  const getAverages = (versions, period) => {
    return labels.map(label => {
      const values = [];

      if (isAll) {
        Object.values(baseData).forEach(group => {
          versions.forEach(v => {
            const scores = getScores(group, v, period, label);
            if (scores) values.push(calculateAverage(scores));
          });
        });
      } else {
        const group = baseData[selectedGroup.value];
        versions.forEach(v => {
          const scores = getScores(group, v, period, label);
          if (scores) values.push(calculateAverage(scores));
        });
      }

      if (values.length === 0) return 0;
      return +(values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
    });
  };

  const colors = isAll ? colorScheme.all : colorScheme[selectedGroup.value];
  
  if (selectedVersion.value === "both") {
    if (shouldIncludePeriod("current")) {
      datasets.push({
        label: "ปัจจุบัน",
        backgroundColor: colors.current,
        data: getAverages(["company_1", "company_2"], "current")
      });
    }
    if (shouldIncludePeriod("future")) {
      datasets.push({
        label: "อนาคต",
        backgroundColor: colors.future,
        data: getAverages(["company_1", "company_2"], "future")
      });
    }
  } else {
    const version = selectedVersion.value;
    const versionName = versionOptions.value.find(v => v.id === version)?.name || version.toUpperCase();
    
    if (shouldIncludePeriod("current")) {
      datasets.push({
        label: `${versionName} - ปัจจุบัน`,
        backgroundColor: colors.current,
        data: getAverages([version], "current")
      });
    }
    if (shouldIncludePeriod("future")) {
      datasets.push({
        label: `${versionName} - อนาคต`,
        backgroundColor: colors.future,
        data: getAverages([version], "future")
      });
    }
  }

  return { labels, datasets };
});

const dataSummary = computed(() => {
  const groupLabel = groupNames[selectedGroup.value];
  let total = 0;

  const getCount = (group, version, labelList) => {
    const available = group[version];
    const labels = group.labels;
    return labelList.reduce((count, label) => {
      const idx = labels.indexOf(label);
      return (idx !== -1 && available.current?.[idx]) ? count + 1 : count;
    }, 0);
  };

  if (selectedGroup.value === "all") {
    total = Object.values(baseData).reduce((sum, group) => {
      let count = 0;
      if (shouldInclude("company_1")) {
        if (shouldIncludePeriod("current")) count += group.company_1.current.length;
        if (shouldIncludePeriod("future")) count += group.company_1.future.length;
      }
      if (shouldInclude("company_2")) {
        if (shouldIncludePeriod("current")) count += group.company_2.current.length;
        if (shouldIncludePeriod("future")) count += group.company_2.future.length;
      }
      return sum + count;
    }, 0);
  } else {
    const group = baseData[selectedGroup.value];
    const unitLabels = selectedUnits.value.length > 0 ? selectedUnits.value : group.labels;

    if (shouldInclude("company_1")) {
      if (shouldIncludePeriod("current")) total += getCount(group, "company_1", unitLabels);
      if (shouldIncludePeriod("future")) total += getCount(group, "company_1", unitLabels);
    }
    if (shouldInclude("company_2")) {
      if (shouldIncludePeriod("current")) total += getCount(group, "company_2", unitLabels);
      if (shouldIncludePeriod("future")) total += getCount(group, "company_2", unitLabels);
    }
  }

  return { group: groupLabel, total };
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <NavbarDashboard/>

    <!-- Main Content -->
    <main class="flex-1 ml-60 p-8 max-w-7xl">
      <!-- Header -->
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">ผลการประเมินแยกตามสายงาน</h1>
        <p class="text-gray-600 mt-2">แสดงค่าเฉลี่ยคะแนนการประเมินตามตำแหน่งและพื้นที่</p>
      </header>

      <!-- Filter Section -->
      <div class="bg-white rounded-lg p-6 mb-8 shadow-sm border border-gray-200">
        <!-- Main Filters -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ตำแหน่ง</label>
            <select 
              v-model="selectedGroup" 
              @change="handleGroupChange"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">รวมทั้งหมด</option>
              <option value="senior">ผู้บริหารระดับสูง / ผู้จัดการส่วน</option>
              <option value="manager">ผู้จัดการแผนก / ผู้จัดการ / พนักงานอาวุโส</option>
              <option value="employee">พนักงาน</option>
              <option value="contractor">ผู้รับเหมา</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">พื้นที่</label>
            <select 
              v-model="selectedVersion" 
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option v-for="option in versionOptions" :key="option.id" :value="option.id">
                {{ option.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ช่วงเวลา</label>
            <select 
              v-model="selectedPeriod" 
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="both">เปรียบเทียบ (ปัจจุบัน กับ อนาคต)</option>
              <option value="current">ปัจจุบัน</option>
              <option value="future">อนาคต</option>
            </select>
          </div>
        </div>

        <!-- Summary Info -->
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div class="flex items-center gap-3">
            <div 
              class="w-4 h-4 rounded"
              :style="{ backgroundColor: selectedGroup === 'all' ? colorScheme.all.current : colorScheme[selectedGroup]?.current }"
            ></div>
            <span class="font-medium text-gray-900">{{ dataSummary.group }}</span>
          </div>
          <span class="text-sm text-gray-600">
            จำนวนข้อมูล: <span class="font-semibold text-gray-900">{{ dataSummary.total }}</span> รายการ
          </span>
        </div>

        <!-- Unit Selection -->
        <div v-if="selectedGroup !== 'all' && availableUnits.length > 0" class="mt-6 pt-6 border-t border-gray-200">
          <div class="flex items-center justify-between mb-3">
            <label class="text-sm font-medium text-gray-700">เลือกสายงาน</label>
            <button 
              @click="clearAllUnits" 
              class="px-4 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              ล้างทั้งหมด
            </button>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
            <label 
              v-for="unit in availableUnits" 
              :key="unit"
              class="flex items-center gap-2 p-2.5 bg-gray-50 rounded border border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-colors"
            >
              <input 
                type="checkbox" 
                :value="unit" 
                v-model="selectedUnits" 
                class="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              >
              <span class="text-sm text-gray-700">{{ unit }}</span>
            </label>
          </div>
        </div>

        <!-- Legend -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <h3 class="text-sm font-medium text-gray-700 mb-3">สัญลักษณ์กราฟ</h3>
          <div class="flex flex-wrap gap-6">
            <div class="flex items-center gap-2">
              <div 
                class="w-8 h-4 rounded"
                :style="{ backgroundColor: selectedGroup === 'all' ? colorScheme.all.current : colorScheme[selectedGroup]?.current }"
              ></div>
              <span class="text-sm text-gray-700">ปัจจุบัน</span>
            </div>
            <div class="flex items-center gap-2">
              <div 
                class="w-8 h-4 rounded"
                :style="{ backgroundColor: selectedGroup === 'all' ? colorScheme.all.future : colorScheme[selectedGroup]?.future }"
              ></div>
              <span class="text-sm text-gray-700">อนาคต</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Chart Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">กราฟแสดงผลการประเมิน</h2>
          <p class="text-sm text-gray-600 mt-1">ค่าเฉลี่ยคะแนนการประเมินแยกตามสายงาน (คะแนนเต็ม 5)</p>
        </div>
        <div class="p-6">
          <BetChart :chart-data="chartData" />
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

input[type="checkbox"] {
  cursor: pointer;
}

input[type="checkbox"]:checked {
  background-color: #2563eb;
  border-color: #2563eb;
}
</style>