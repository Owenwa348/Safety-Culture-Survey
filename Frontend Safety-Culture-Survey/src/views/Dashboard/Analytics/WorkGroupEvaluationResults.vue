<!-- WorkGroupEvaluationResults.vue -->
<script setup>
import { ref, computed, onMounted, watch } from "vue";
import BetChart from "../Showgraph/BetChart.vue";
import NavbarDashboard from '../../../components/NavbarDashboard.vue';
import { 
  departments, 
  unitsByDepartment, 
  workGroups, 
  evaluationData 
} from './WorkGroupbasedata.js';

// ============================================
// SECTION 1: STATE MANAGEMENT
// ============================================
const selectedDepartment = ref("all");
const selectedUnit = ref("all");
const selectedGroups = ref(["all"]);
const selectedVersion = ref("both");
const selectedPeriod = ref("both");
const versionOptions = ref([]);

// ============================================
// SECTION 2: HELPER FUNCTIONS
// ============================================

/**
 * ตรวจสอบว่าควรรวม version นี้หรือไม่
 * @param {string} version - v1 หรือ v2
 * @returns {boolean}
 */
const shouldInclude = (version) => {
  return selectedVersion.value === version || selectedVersion.value === "both";
};

/**
 * ตรวจสอบว่าควรรวม period นี้หรือไม่
 * @param {string} period - current หรือ future
 * @returns {boolean}
 */
const shouldIncludePeriod = (period) => {
  return selectedPeriod.value === period || selectedPeriod.value === "both";
};

/**
 * คำนวณค่าเฉลี่ยจาก array ของคะแนน
 * @param {Array} scores - array ของคะแนน
 * @returns {number}
 */
const calculateAverage = (scores) => {
  if (!Array.isArray(scores) || scores.length === 0) return 0;
  const flat = Array.isArray(scores[0]) ? scores.flat() : scores;
  if (flat.length === 0) return 0;
  return +(flat.reduce((a, b) => a + b, 0) / flat.length).toFixed(2);
};

/**
 * ดึงข้อมูล version options จาก API (Mock)
 */
const fetchVersionOptions = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'both', name: 'verte group' },
        { id: 'v1', name: 'verte smart solution' },
        { id: 'v2', name: 'verte security' }
      ]);
    }, 100);
  });
};

// ============================================
// SECTION 3: COMPUTED PROPERTIES
// ============================================

/**
 * สายงานที่สามารถเลือกได้ตามตำแหน่งที่เลือก
 */
const availableUnits = computed(() => {
  if (selectedDepartment.value === "all") {
    const allUnits = new Set();
    Object.keys(unitsByDepartment).forEach(dept => {
      unitsByDepartment[dept].forEach(unit => {
        allUnits.add(JSON.stringify(unit));
      });
    });
    return Array.from(allUnits).map(u => JSON.parse(u));
  }
  return unitsByDepartment[selectedDepartment.value] || [];
});

/**
 * กลุ่มงานที่สามารถเลือกได้ตามตำแหน่งและสายงานที่เลือก
 */
const availableWorkGroups = computed(() => {
  if (selectedDepartment.value === "all" && selectedUnit.value === "all") {
    return workGroups;
  }
  
  if (selectedDepartment.value === "all" && selectedUnit.value !== "all") {
    const availableGroups = [{ id: 'all', name: 'ทั้งหมด' }];
    const groupSet = new Set();
    
    Object.keys(evaluationData).forEach(deptKey => {
      const dept = evaluationData[deptKey];
      if (dept[selectedUnit.value]) {
        Object.keys(dept[selectedUnit.value]).forEach(groupKey => {
          groupSet.add(groupKey);
        });
      }
    });
    
    workGroups.forEach(group => {
      if (group.id !== 'all' && groupSet.has(group.id)) {
        availableGroups.push(group);
      }
    });
    
    return availableGroups;
  }
  
  if (selectedUnit.value === "all") {
    return workGroups;
  }
  
  const dept = evaluationData[selectedDepartment.value];
  if (!dept) return workGroups;
  
  const unit = dept[selectedUnit.value];
  if (!unit) return workGroups;
  
  const availableGroups = [{ id: 'all', name: 'ทั้งหมด' }];
  workGroups.forEach(group => {
    if (group.id !== 'all' && unit[group.id]) {
      availableGroups.push(group);
    }
  });
  
  return availableGroups;
});

/**
 * ข้อมูลสำหรับแสดงกราฟ
 */
const chartData = computed(() => {
  const datasets = [];
  let labels = [];

  // CASE 1: เลือกตำแหน่ง = "ทั้งหมด"
  if (selectedDepartment.value === "all") {
    
    // CASE 1.1: เลือกสายงานเฉพาะ
    if (selectedUnit.value !== "all") {
      
      // CASE 1.1.1: เลือกกลุ่มงาน = "ทั้งหมด"
      if (selectedGroups.value.includes('all')) {
        const availableGroupsList = workGroups.filter(g => g.id !== 'all');
        labels = availableGroupsList.map(g => g.name);
        
        const getWorkGroupAverages = (period) => {
          return availableGroupsList.map(group => {
            const scores = [];
            
            Object.keys(evaluationData).forEach(deptKey => {
              const deptData = evaluationData[deptKey];
              if (!deptData || !deptData[selectedUnit.value]) return;
              
              const groupData = deptData[selectedUnit.value][group.id];
              if (groupData) {
                if (shouldInclude("v1") && groupData.v1?.[period]) {
                  scores.push(...groupData.v1[period]);
                }
                if (shouldInclude("v2") && groupData.v2?.[period]) {
                  scores.push(...groupData.v2[period]);
                }
              }
            });
            
            return calculateAverage(scores);
          });
        };
        
        if (shouldIncludePeriod("current")) {
          datasets.push({
            label: "ปัจจุบัน",
            backgroundColor: "#1e40af",
            data: getWorkGroupAverages("current")
          });
        }
        
        if (shouldIncludePeriod("future")) {
          datasets.push({
            label: "อนาคต",
            backgroundColor: "#3b82f6",
            data: getWorkGroupAverages("future")
          });
        }
      } 
      // CASE 1.1.2: เลือกกลุ่มงานเฉพาะ
      else {
        labels = selectedGroups.value.map(groupId => {
          const group = workGroups.find(g => g.id === groupId);
          return group ? group.name : groupId;
        });
        
        const getSelectedGroupsAverages = (period) => {
          return selectedGroups.value.map(groupId => {
            const scores = [];
            
            Object.keys(evaluationData).forEach(deptKey => {
              const deptData = evaluationData[deptKey];
              if (!deptData || !deptData[selectedUnit.value]) return;
              
              const groupData = deptData[selectedUnit.value][groupId];
              if (groupData) {
                if (shouldInclude("v1") && groupData.v1?.[period]) {
                  scores.push(...groupData.v1[period]);
                }
                if (shouldInclude("v2") && groupData.v2?.[period]) {
                  scores.push(...groupData.v2[period]);
                }
              }
            });
            
            return calculateAverage(scores);
          });
        };
        
        if (shouldIncludePeriod("current")) {
          datasets.push({
            label: "ปัจจุบัน",
            backgroundColor: "#1e40af",
            data: getSelectedGroupsAverages("current")
          });
        }
        
        if (shouldIncludePeriod("future")) {
          datasets.push({
            label: "อนาคต",
            backgroundColor: "#3b82f6",
            data: getSelectedGroupsAverages("future")
          });
        }
      }
    } 
    // CASE 1.2: เลือกสายงาน = "ทั้งหมด" -> แสดงกราฟเป็นสายงานเสมอ
    else {
      // รวมสายงานทั้งหมดจากทุกตำแหน่ง
      const allUnitsMap = new Map();
      Object.keys(evaluationData).forEach(deptKey => {
        Object.keys(evaluationData[deptKey]).forEach(unitKey => {
          if (!allUnitsMap.has(unitKey)) {
            const unitInfo = availableUnits.value.find(u => u.id === unitKey);
            if (unitInfo) {
              allUnitsMap.set(unitKey, unitInfo.name);
            }
          }
        });
      });
      
      const unitsList = Array.from(allUnitsMap.entries());
      labels = unitsList.map(([id, name]) => name);
      
      const getUnitAverages = (period) => {
        return unitsList.map(([unitId]) => {
          const scores = [];
          
          Object.keys(evaluationData).forEach(deptKey => {
            const deptData = evaluationData[deptKey];
            if (!deptData || !deptData[unitId]) return;
            
            // กำหนดกลุ่มงานที่จะนับ
            const groupsToUse = selectedGroups.value.includes('all') 
              ? Object.keys(deptData[unitId])
              : selectedGroups.value;
            
            groupsToUse.forEach(groupKey => {
              const groupData = deptData[unitId][groupKey];
              if (groupData) {
                if (shouldInclude("v1") && groupData.v1?.[period]) {
                  scores.push(...groupData.v1[period]);
                }
                if (shouldInclude("v2") && groupData.v2?.[period]) {
                  scores.push(...groupData.v2[period]);
                }
              }
            });
          });
          
          return calculateAverage(scores);
        });
      };
      
      if (shouldIncludePeriod("current")) {
        datasets.push({
          label: "ปัจจุบัน",
          backgroundColor: "#1e40af",
          data: getUnitAverages("current")
        });
      }
      
      if (shouldIncludePeriod("future")) {
        datasets.push({
          label: "อนาคต",
          backgroundColor: "#3b82f6",
          data: getUnitAverages("future")
        });
      }
    }
    
    return { labels, datasets };
  }

  // CASE 2: เลือกตำแหน่งเฉพาะ และเลือกสายงาน = "ทั้งหมด"
  if (selectedUnit.value === "all") {
    const units = unitsByDepartment[selectedDepartment.value] || [];
    labels = units.map(u => u.name);
    
    const getUnitAverages = (period) => {
      return units.map(unitObj => {
        const scores = [];
        const unit = evaluationData[selectedDepartment.value]?.[unitObj.id];
        
        if (!unit) return 0;
        
        const groupsToUse = selectedGroups.value.includes('all') 
          ? Object.keys(unit)
          : selectedGroups.value;
        
        groupsToUse.forEach(groupId => {
          const group = unit[groupId];
          if (group) {
            if (shouldInclude("v1") && group.v1?.[period]) {
              scores.push(...group.v1[period]);
            }
            if (shouldInclude("v2") && group.v2?.[period]) {
              scores.push(...group.v2[period]);
            }
          }
        });
        
        return calculateAverage(scores);
      });
    };
    
    if (shouldIncludePeriod("current")) {
      datasets.push({
        label: "ปัจจุบัน",
        backgroundColor: "#1e40af",
        data: getUnitAverages("current")
      });
    }
    
    if (shouldIncludePeriod("future")) {
      datasets.push({
        label: "อนาคต",
        backgroundColor: "#3b82f6",
        data: getUnitAverages("future")
      });
    }
    
    return { labels, datasets };
  }

  // CASE 3: เลือกกลุ่มงาน = "ทั้งหมด"
  if (selectedGroups.value.includes('all')) {
    const unit = evaluationData[selectedDepartment.value]?.[selectedUnit.value];
    if (!unit) return { labels: [], datasets: [] };
    
    const groupIds = Object.keys(unit);
    labels = groupIds.map(groupId => {
      const group = workGroups.find(g => g.id === groupId);
      return group ? group.name : groupId;
    });
    
    const getGroupAverages = (period) => {
      return groupIds.map(groupId => {
        const group = unit[groupId];
        const scores = [];
        
        if (group) {
          if (shouldInclude("v1") && group.v1?.[period]) {
            scores.push(...group.v1[period]);
          }
          if (shouldInclude("v2") && group.v2?.[period]) {
            scores.push(...group.v2[period]);
          }
        }
        
        return calculateAverage(scores);
      });
    };
    
    if (shouldIncludePeriod("current")) {
      datasets.push({
        label: "ปัจจุบัน",
        backgroundColor: "#1e40af",
        data: getGroupAverages("current")
      });
    }
    
    if (shouldIncludePeriod("future")) {
      datasets.push({
        label: "อนาคต",
        backgroundColor: "#3b82f6",
        data: getGroupAverages("future")
      });
    }
    
    return { labels, datasets };
  }

  // CASE 4: เลือกเฉพาะบางกลุ่มงาน
  labels = selectedGroups.value.map(groupId => {
    const group = workGroups.find(g => g.id === groupId);
    return group ? group.name : groupId;
  });
  
  const getSelectedGroupsAverages = (period) => {
    return selectedGroups.value.map(groupId => {
      const unit = evaluationData[selectedDepartment.value]?.[selectedUnit.value];
      if (!unit) return 0;
      
      const group = unit[groupId];
      const scores = [];
      
      if (group) {
        if (shouldInclude("v1") && group.v1?.[period]) {
          scores.push(...group.v1[period]);
        }
        if (shouldInclude("v2") && group.v2?.[period]) {
          scores.push(...group.v2[period]);
        }
      }
      
      return calculateAverage(scores);
    });
  };
  
  if (shouldIncludePeriod("current")) {
    datasets.push({
      label: "ปัจจุบัน",
      backgroundColor: "#1e40af",
      data: getSelectedGroupsAverages("current")
    });
  }
  
  if (shouldIncludePeriod("future")) {
    datasets.push({
      label: "อนาคต",
      backgroundColor: "#3b82f6",
      data: getSelectedGroupsAverages("future")
    });
  }

  return { labels, datasets };
});

/**
 * สรุปข้อมูลที่เลือก
 */
const dataSummary = computed(() => {
  const deptName = departments.find(d => d.id === selectedDepartment.value)?.name || "";
  
  let unitName = "ทั้งหมด";
  if (selectedUnit.value !== "all") {
    if (selectedDepartment.value === "all") {
      const unit = availableUnits.value.find(u => u.id === selectedUnit.value);
      unitName = unit?.name || selectedUnit.value;
    } else {
      const unit = unitsByDepartment[selectedDepartment.value]?.find(u => u.id === selectedUnit.value);
      unitName = unit?.name || selectedUnit.value;
    }
  }
  
  let groupNames = "";
  if (selectedGroups.value.includes('all')) {
    groupNames = "ทั้งหมด";
  } else {
    groupNames = selectedGroups.value
      .map(id => workGroups.find(g => g.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  }
  
  let total = 0;

  if (selectedDepartment.value === "all") {
    if (selectedUnit.value === "all") {
      Object.keys(evaluationData).forEach(deptKey => {
        Object.keys(evaluationData[deptKey]).forEach(unitKey => {
          const groupsToCount = selectedGroups.value.includes('all') 
            ? Object.keys(evaluationData[deptKey][unitKey])
            : selectedGroups.value;
          
          groupsToCount.forEach(groupKey => {
            const group = evaluationData[deptKey][unitKey][groupKey];
            if (group) {
              if (shouldInclude("v1")) {
                if (shouldIncludePeriod("current") && group.v1?.current) total += group.v1.current.length;
                if (shouldIncludePeriod("future") && group.v1?.future) total += group.v1.future.length;
              }
              if (shouldInclude("v2")) {
                if (shouldIncludePeriod("current") && group.v2?.current) total += group.v2.current.length;
                if (shouldIncludePeriod("future") && group.v2?.future) total += group.v2.future.length;
              }
            }
          });
        });
      });
    } else {
      Object.keys(evaluationData).forEach(deptKey => {
        const unit = evaluationData[deptKey][selectedUnit.value];
        if (unit) {
          const groupsToCount = selectedGroups.value.includes('all') ? Object.keys(unit) : selectedGroups.value;
          groupsToCount.forEach(groupKey => {
            const group = unit[groupKey];
            if (group) {
              if (shouldInclude("v1")) {
                if (shouldIncludePeriod("current") && group.v1?.current) total += group.v1.current.length;
                if (shouldIncludePeriod("future") && group.v1?.future) total += group.v1.future.length;
              }
              if (shouldInclude("v2")) {
                if (shouldIncludePeriod("current") && group.v2?.current) total += group.v2.current.length;
                if (shouldIncludePeriod("future") && group.v2?.future) total += group.v2.future.length;
              }
            }
          });
        }
      });
    }
  } else if (selectedUnit.value === "all") {
    const units = unitsByDepartment[selectedDepartment.value] || [];
    units.forEach(unitObj => {
      const unit = evaluationData[selectedDepartment.value]?.[unitObj.id];
      if (unit) {
        const groupsToCount = selectedGroups.value.includes('all') ? Object.keys(unit) : selectedGroups.value;
        groupsToCount.forEach(groupKey => {
          const group = unit[groupKey];
          if (group) {
            if (shouldInclude("v1")) {
              if (shouldIncludePeriod("current") && group.v1?.current) total += group.v1.current.length;
              if (shouldIncludePeriod("future") && group.v1?.future) total += group.v1.future.length;
            }
            if (shouldInclude("v2")) {
              if (shouldIncludePeriod("current") && group.v2?.current) total += group.v2.current.length;
              if (shouldIncludePeriod("future") && group.v2?.future) total += group.v2.future.length;
            }
          }
        });
      }
    });
  } else {
    const unit = evaluationData[selectedDepartment.value]?.[selectedUnit.value];
    if (unit) {
      const groupsToCount = selectedGroups.value.includes('all') ? Object.keys(unit) : selectedGroups.value;
      groupsToCount.forEach(groupKey => {
        const group = unit[groupKey];
        if (group) {
          if (shouldInclude("v1")) {
            if (shouldIncludePeriod("current") && group.v1?.current) total += group.v1.current.length;
            if (shouldIncludePeriod("future") && group.v1?.future) total += group.v1.future.length;
          }
          if (shouldInclude("v2")) {
            if (shouldIncludePeriod("current") && group.v2?.current) total += group.v2.current.length;
            if (shouldIncludePeriod("future") && group.v2?.future) total += group.v2.future.length;
          }
        }
      });
    }
  }

  return { 
    department: deptName,
    unit: unitName,
    group: groupNames,
    total 
  };
});

// ============================================
// SECTION 4: EVENT HANDLERS
// ============================================

/**
 * จัดการการเปลี่ยนแปลงของ checkbox กลุ่มงาน
 * @param {string} groupId - ID ของกลุ่มงาน
 */
const handleGroupChange = (groupId) => {
  if (groupId === 'all') {
    selectedGroups.value = ['all'];
  } else {
    if (selectedGroups.value.includes('all')) {
      selectedGroups.value = [groupId];
    } else {
      const index = selectedGroups.value.indexOf(groupId);
      if (index > -1) {
        selectedGroups.value.splice(index, 1);
        if (selectedGroups.value.length === 0) {
          selectedGroups.value = ['all'];
        }
      } else {
        selectedGroups.value.push(groupId);
      }
    }
  }
};

// ============================================
// SECTION 5: WATCHERS
// ============================================

// Reset selections when department changes
watch(selectedDepartment, () => {
  selectedUnit.value = "all";
  selectedGroups.value = ["all"];
});

// Reset group selection when unit changes
watch(selectedUnit, () => {
  selectedGroups.value = ["all"];
});

// ============================================
// SECTION 6: LIFECYCLE HOOKS
// ============================================

onMounted(async () => {
  versionOptions.value = await fetchVersionOptions();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <NavbarDashboard/>

    <!-- Main Content -->
    <main class="flex-1 ml-60 p-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header Section -->
        <header class="mb-6">
          <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h1 class="text-2xl font-bold text-gray-900 mb-1">ผลการประเมินตามกลุ่มงาน</h1>
            <p class="text-sm text-gray-600">วิเคราะห์และเปรียบเทียบผลการประเมินตามตำแหน่ง สายงาน และกลุ่มงาน</p>
          </div>
        </header>

        <!-- Filter Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div class="border-b border-gray-200 bg-gray-50 px-6 py-4 rounded-t-lg">
            <h2 class="text-base font-semibold text-gray-800 flex items-center">
              <svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
              </svg>
              เลือกเงื่อนไขการแสดงผล
            </h2>
          </div>
          
          <div class="p-6">
            <!-- Row 1: ตำแหน่ง, สายงาน -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <!-- ตำแหน่ง -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  ตำแหน่ง
                  <span class="text-red-500 ml-1">*</span>
                </label>
                <div class="relative">
                  <select 
                    v-model="selectedDepartment"
                    class="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors text-sm appearance-none"
                  >
                    <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                      {{ dept.name }}
                    </option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- สายงาน -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  สายงาน
                  <span class="text-red-500 ml-1">*</span>
                </label>
                <div class="relative">
                  <select 
                    v-model="selectedUnit"
                    class="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors text-sm appearance-none"
                  >
                    <option value="all">ทั้งหมด</option>
                    <option v-for="unit in availableUnits" :key="unit.id" :value="unit.id">
                      {{ unit.name }}
                    </option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Row 2: กลุ่มงาน (Checkbox) -->
            <div class="mb-5">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                กลุ่มงาน
                <span class="text-gray-500 text-xs font-normal ml-1">(เลือกได้หลายรายการ)</span>
              </label>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <label 
                  v-for="group in availableWorkGroups" 
                  :key="group.id"
                  class="relative flex items-center px-4 py-3 border rounded-md cursor-pointer transition-all"
                  :class="{ 
                    'border-blue-500 bg-blue-50': selectedGroups.includes(group.id),
                    'border-gray-300 bg-white hover:border-gray-400': !selectedGroups.includes(group.id)
                  }"
                >
                  <input
                    type="checkbox"
                    :checked="selectedGroups.includes(group.id)"
                    @change="handleGroupChange(group.id)"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span class="ml-3 text-sm text-gray-800">{{ group.name }}</span>
                  <svg v-if="selectedGroups.includes(group.id)" class="w-4 h-4 text-blue-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                </label>
              </div>
            </div>

            <!-- Row 3: พื้นที่, ช่วงเวลา -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <!-- พื้นที่ -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">พื้นที่</label>
                <div class="relative">
                  <select 
                    v-model="selectedVersion"
                    class="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors text-sm appearance-none"
                  >
                    <option v-for="option in versionOptions" :key="option.id" :value="option.id">
                      {{ option.name }}
                    </option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- ช่วงเวลา -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">ช่วงเวลา</label>
                <div class="relative">
                  <select 
                    v-model="selectedPeriod"
                    class="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors text-sm appearance-none"
                  >
                    <option value="both">ปัจจุบันและอนาคต</option>
                    <option value="current">เฉพาะปัจจุบัน</option>
                    <option value="future">เฉพาะอนาคต</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Summary Info -->
            <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <svg class="w-4 h-4 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                  <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"></path>
                </svg>
                สรุปเงื่อนไขที่เลือก
              </h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div class="bg-white rounded-md p-3 border border-gray-200">
                  <p class="text-xs text-gray-500 mb-0.5">ตำแหน่ง</p>
                  <p class="text-sm font-semibold text-gray-900">{{ dataSummary.department }}</p>
                </div>
                <div class="bg-white rounded-md p-3 border border-gray-200">
                  <p class="text-xs text-gray-500 mb-0.5">สายงาน</p>
                  <p class="text-sm font-semibold text-gray-900">{{ dataSummary.unit }}</p>
                </div>
                <div class="bg-white rounded-md p-3 border border-gray-200">
                  <p class="text-xs text-gray-500 mb-0.5">กลุ่มงาน</p>
                  <p class="text-sm font-semibold text-gray-900 truncate" :title="dataSummary.group">{{ dataSummary.group }}</p>
                </div>
                <div class="bg-white rounded-md p-3 border border-gray-200">
                  <p class="text-xs text-gray-500 mb-0.5">จำนวนข้อมูล</p>
                  <p class="text-sm font-bold text-blue-600">{{ dataSummary.total }} รายการ</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chart Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 class="text-base font-semibold text-gray-800 mb-3 flex items-center">
              <svg class="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              แผนภูมิแสดงค่าเฉลี่ยคะแนนการประเมิน
            </h2>
            <div class="flex items-center gap-6 text-sm">
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-blue-800 rounded"></div>
                <span class="text-gray-700">ปัจจุบัน</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-blue-500 rounded"></div>
                <span class="text-gray-700">อนาคต</span>
              </div>
            </div>
          </div>
          <div class="p-6">
            <BetChart :chart-data="chartData" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>