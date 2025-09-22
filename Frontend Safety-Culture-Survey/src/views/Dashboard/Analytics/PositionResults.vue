<script setup>
import { ref, computed } from "vue";
import BetChart from "../Showgraph/BetChart.vue";
import Comment from "../../../components/Comment.vue";
import NavbarDashboard from '../../../components/NavbarDashboard.vue';

const selectedGroup = ref("all");
const selectedUnits = ref([]);
const selectedPeriod = ref("both");
const selectedVersion = ref("both");

// ฟังก์ชันช่วย
const shouldInclude = (version) => {
  return selectedVersion.value === version || selectedVersion.value === "both";
};

const shouldIncludePeriod = (period) => {
  return selectedPeriod.value === period || selectedPeriod.value === "both";
};

const baseData = {
contractor: {
    labels: ["CEO", "REP", "COO", "CFO", "SSE", "PSE", "CME"],
    v1: {
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
    v2: {
      current: [
        [5, 3, 1, 4, 2, 3, 5, 1, 4, 2, 5, 3, 1, 4, 2, 3, 5, 1],
        [1, 4, 3, 2, 5, 4, 1, 3, 2, 5, 1, 4, 3, 2, 5, 4, 1, 3],
        [2, 1, 5, 3, 4, 1, 2, 5, 3, 4, 2, 1, 5, 3, 4, 1, 2, 5],
        [4, 5, 2, 1, 3, 5, 4, 2, 1, 3, 4, 5, 2, 1, 3, 5, 4, 2],
        [3, 2, 4, 5, 1, 2, 3, 4, 5, 1, 3, 2, 4, 5, 1, 2, 3, 4],
        [5, 1, 2, 4, 3, 1, 5, 2, 4, 3, 5, 1, 2, 4, 3, 1, 5, 2],
        [4, 3, 5, 1, 2, 3, 4, 5, 1, 2, 4, 3, 5, 1, 2, 3, 4, 5]
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
    v1: {
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
    v2: {
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
    v1: {
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
    v2: {
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
    v1: {
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
    v2: {
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

const colorScheme = {
  senior: { current: "#dc2626", future: "#ef4444" },
  manager: { current: "#7c3aed", future: "#a855f7" },
  employee: { current: "#1e40af", future: "#3b82f6" },
  contractor: { current: "#065f46", future: "#10b981" }
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

  if (selectedVersion.value === "both") {
    if (shouldIncludePeriod("current")) {
      datasets.push({
        label: "V1+V2 (ปัจจุบัน)",
        backgroundColor: isAll ? "#1e40af" : "#6366f1", // Indigo
        data: getAverages(["v1", "v2"], "current")
      });
    }
    if (shouldIncludePeriod("future")) {
      datasets.push({
        label: "V1+V2 (อนาคต)",
        backgroundColor: isAll ? "#3b82f6" : "#93c5fd", // Blue
        data: getAverages(["v1", "v2"], "future")
      });
    }
  } else {
    const version = selectedVersion.value;
    if (shouldIncludePeriod("current")) {
      datasets.push({
        label: `${version.toUpperCase()} (ปัจจุบัน)`,
        backgroundColor: isAll ? "#1e40af" : colorScheme[selectedGroup.value]?.[version === "v1" ? "current" : "future"],
        data: getAverages([version], "current")
      });
    }
    if (shouldIncludePeriod("future")) {
      datasets.push({
        label: `${version.toUpperCase()} (อนาคต)`,
        backgroundColor: isAll ? "#3b82f6" : colorScheme[selectedGroup.value]?.[version === "v1" ? "current" : "future"],
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
      const labels = group.labels;
      let count = 0;
      if (shouldInclude("v1")) {
        if (shouldIncludePeriod("current")) count += group.v1.current.length;
        if (shouldIncludePeriod("future")) count += group.v1.future.length;
      }
      if (shouldInclude("v2")) {
        if (shouldIncludePeriod("current")) count += group.v2.current.length;
        if (shouldIncludePeriod("future")) count += group.v2.future.length;
      }
      return sum + count;
    }, 0);
  } else {
    const group = baseData[selectedGroup.value];
    const unitLabels = selectedUnits.value.length > 0 ? selectedUnits.value : group.labels;

    if (shouldInclude("v1")) {
      if (shouldIncludePeriod("current")) total += getCount(group, "v1", unitLabels);
      if (shouldIncludePeriod("future")) total += getCount(group, "v1", unitLabels);
    }
    if (shouldInclude("v2")) {
      if (shouldIncludePeriod("current")) total += getCount(group, "v2", unitLabels);
      if (shouldIncludePeriod("future")) total += getCount(group, "v2", unitLabels);
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
    <main class="flex-1 ml-60 p-6 md:p-10 max-w-7xl">
      <!-- Header -->
      <header class="text-center mb-10">
        <h1 class="text-4xl font-bold text-gray-800">ผลการประเมินแยกตามหน่วยงาน</h1>
      </header>

      <!-- Filter -->
      <div class="bg-white rounded-2xl p-8 mb-10 shadow-xl border border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">เลือกกลุ่ม</label>
            <select v-model="selectedGroup" @change="handleGroupChange"
              class="px-4 py-2 border border-gray-300 rounded-lg">
              <option value="all">รวมทั้งหมด</option>
              <option value="contractor">ผู้รับเหมา</option>
              <option value="employee">พนักงาน</option>
              <option value="manager">ผู้จัดการแผนก / ผู้จัดการ / พนักงานอาวุโส</option>
              <option value="senior">ผู้บริหารระดับสูง / ผู้จัดการส่วน</option>
            </select>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">เลือกพื้นที่</label>
            <select v-model="selectedVersion" class="px-4 py-2 border border-gray-300 rounded-lg">
              <option value="both">verte group</option>
              <option value="v1">verte smart solution</option>
              <option value="v2">verte security</option>
            </select>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">ช่วงเวลา</label>
            <select v-model="selectedPeriod" class="px-4 py-2 border border-gray-300 rounded-lg">
              <option value="both">ปัจจุบันและอนาคต</option>
              <option value="current">เฉพาะปัจจุบัน</option>
              <option value="future">เฉพาะอนาคต</option>
            </select>
          </div>
        </div>

        <div class="flex justify-between items-center bg-gray-100 p-4 rounded-lg mb-6">
          <span class="text-lg font-semibold">{{ dataSummary.group }}</span>
          <span class="text-sm text-gray-700">จำนวน: {{ dataSummary.total }} รายการ</span>
        </div>

        <div v-if="selectedGroup !== 'all' && availableUnits.length > 0" class="border-t pt-6">
          <div class="flex justify-between items-center mb-4">
            <label class="text-sm font-medium text-gray-700">เลือกฝ่ายย่อย</label>
            <button @click="clearAllUnits" class="bg-blue-500 text-white px-4 py-2 rounded-md text-sm">
              ล้างทั้งหมด
            </button>
          </div>
          <div
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-52 overflow-y-auto bg-gray-50 p-4 rounded-lg border">
            <label v-for="unit in availableUnits" :key="unit"
              class="flex items-center gap-2 bg-white px-3 py-2 rounded border">
              <input type="checkbox" :value="unit" v-model="selectedUnits" class="accent-blue-600">
              <span class="text-sm">{{ unit }}</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Chart -->
      <div class="flex flex-col gap-10">
        <div class="bg-white rounded-2xl shadow-xl border overflow-hidden">
          <div class="px-8 py-6 bg-gray-100 border-b">
            <h2 class="text-xl font-semibold text-gray-800">แผนภูมิแท่ง</h2>
          </div>
          <div class="p-8">
            <BetChart :chart-data="chartData" />
          </div>
        </div>

        <!-- Comment -->
        <div class="bg-white rounded-2xl shadow-xl border overflow-hidden">
          <div class="px-8 py-6 bg-gray-100 border-b">
            <h2 class="text-xl font-semibold text-gray-800">ความคิดเห็น</h2>
          </div>
          <div class="p-8">
            <Comment />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
