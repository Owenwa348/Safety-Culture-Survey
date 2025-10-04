// WorkGroupbasedata.js

// ข้อมูลตำแหน่ง
export const departments = [
  { id: 'all', name: 'รวมทั้งหมด' },
  { id: 'contractor', name: 'ผู้รับเหมา' },
  { id: 'employee', name: 'พนักงาน' },
  { id: 'manager', name: 'ผู้จัดการแผนก / ผู้จัดการ / พนักงานอาวุโส' },
  { id: 'senior', name: 'ผู้บริหารระดับสูง / ผู้จัดการส่วน' }
];

// ข้อมูลสายงานตามตำแหน่ง
export const unitsByDepartment = {
  contractor: [
    { id: 'CEO', name: 'CEO' },
    { id: 'REP', name: 'REP' },
    { id: 'COO', name: 'COO' },
    { id: 'CFO', name: 'CFO' },
    { id: 'SSE', name: 'SSE' },
    { id: 'PSE', name: 'PSE' },
    { id: 'CME', name: 'CME' }
  ],
  employee: [
    { id: 'CEO', name: 'CEO' },
    { id: 'REP', name: 'REP' },
    { id: 'COO', name: 'COO' },
    { id: 'CFO', name: 'CFO' },
    { id: 'SSE', name: 'SSE' },
    { id: 'PSE', name: 'PSE' },
    { id: 'CME', name: 'CME' }
  ],
  manager: [
    { id: 'CEO', name: 'CEO' },
    { id: 'REP', name: 'REP' },
    { id: 'COO', name: 'COO' },
    { id: 'CFO', name: 'CFO' },
    { id: 'SSE', name: 'SSE' },
    { id: 'PSE', name: 'PSE' },
    { id: 'CME', name: 'CME' }
  ],
  senior: [
    { id: 'CEO', name: 'CEO' },
    { id: 'REP', name: 'REP' },
    { id: 'COO', name: 'COO' },
    { id: 'CFO', name: 'CFO' },
    { id: 'SSE', name: 'SSE' },
    { id: 'PSE', name: 'PSE' },
    { id: 'CME', name: 'CME' }
  ]
};

// ข้อมูลกลุ่มงาน
export const workGroups = [
  { id: 'all', name: 'ทั้งหมด' },
  { id: 'operation', name: 'หน่วยงานเดินเครื่อง (Operation)' },
  { id: 'maintenance', name: 'หน่วยงานบำรุงรักษา (Maintenance)' },
  { id: 'engineering', name: 'หน่วยงานวิศวกรรม (Engineering)' },
  { id: 'supporting', name: 'หน่วยงานสนับสนุน (Supporting functions)' }
];

// ฟังก์ชันสร้างข้อมูลสุ่มสำหรับแต่ละกลุ่มงาน
const generateWorkGroupData = () => ({
  v1: {
    current: Array.from({length: 18}, () => Math.floor(Math.random() * 5) + 1),
    future: Array.from({length: 18}, () => Math.floor(Math.random() * 5) + 1)
  },
  v2: {
    current: Array.from({length: 18}, () => Math.floor(Math.random() * 5) + 1),
    future: Array.from({length: 18}, () => Math.floor(Math.random() * 5) + 1)
  }
});

// โครงสร้างข้อมูล: department -> unit -> workGroup -> version -> period -> scores
export const evaluationData = {
  // ตำแหน่ง: ผู้รับเหมา
  contractor: {
    CEO: {
      operation: {
        v1: {
          current: [3, 4, 2, 1, 5, 4, 3, 1, 2, 5, 3, 4, 2, 1, 5, 4, 3, 1],
          future: [4, 2, 5, 3, 1, 2, 4, 5, 3, 1, 4, 2, 5, 3, 1, 2, 4, 5]
        },
        v2: {
          current: [5, 3, 1, 4, 2, 3, 5, 1, 4, 2, 5, 3, 1, 4, 2, 3, 5, 1],
          future: [2, 4, 3, 5, 1, 4, 2, 3, 5, 1, 2, 4, 3, 5, 1, 4, 2, 3]
        }
      },
      maintenance: generateWorkGroupData(),
      engineering: generateWorkGroupData(),
      supporting: generateWorkGroupData()
    },
    REP: {
      operation: generateWorkGroupData(),
      maintenance: generateWorkGroupData(),
      engineering: generateWorkGroupData(),
      supporting: generateWorkGroupData()
    },
    COO: {
      operation: generateWorkGroupData(),
      maintenance: generateWorkGroupData(),
      engineering: generateWorkGroupData(),
      supporting: generateWorkGroupData()
    },
    CFO: {
      operation: generateWorkGroupData(),
      maintenance: generateWorkGroupData(),
      engineering: generateWorkGroupData(),
      supporting: generateWorkGroupData()
    },
    SSE: {
      operation: generateWorkGroupData(),
      maintenance: generateWorkGroupData(),
      engineering: generateWorkGroupData(),
      supporting: generateWorkGroupData()
    },
    PSE: {
      operation: generateWorkGroupData(),
      maintenance: generateWorkGroupData(),
      engineering: generateWorkGroupData(),
      supporting: generateWorkGroupData()
    },
    CME: {
      operation: generateWorkGroupData(),
      maintenance: generateWorkGroupData(),
      engineering: generateWorkGroupData(),
      supporting: generateWorkGroupData()
    }
  },

  // ตำแหน่ง: พนักงาน
  employee: {
    CEO: {
      operation: generateWorkGroupData(),
      maintenance: generateWorkGroupData(),
      engineering: generateWorkGroupData(),
      supporting: generateWorkGroupData()
    },
    REP: {
      operation: generateWorkGroupData(),
      maintenance: generateWorkGroupData(),
      engineering: generateWorkGroupData(),
      supporting: generateWorkGroupData()
    },
    COO: {
      operation: generateWorkGroupData(),
      maintenance: generateWorkGroupData(),
      engineering: generateWorkGroupData(),
      supporting: generateWorkGroupData()
    },
    CFO: {
      operation: generateWorkGroupData(),
      maintenance: generateWorkGroupData(),
      engineering: generateWorkGroupData(),
      supporting: generateWorkGroupData()
    },
    SSE: {
      operation: generateWorkGroupData(),
      maintenance: generateWorkGroupData(),
      engineering: generateWorkGroupData(),
      supporting: generateWorkGroupData()
    },
    PSE: {
      operation: generateWorkGroupData(),
      maintenance: generateWorkGroupData(),
      engineering: generateWorkGroupData(),
      supporting: generateWorkGroupData()
    },
    CME: {
      operation: generateWorkGroupData(),
      maintenance: generateWorkGroupData(),
      engineering: generateWorkGroupData(),
      supporting: generateWorkGroupData()
    }
  },

  // ตำแหน่ง: ผู้จัดการแผนก / ผู้จัดการ / พนักงานอาวุโส
  manager: {
    CEO: {
      operation: generateWorkGroupData(),
      maintenance: generateWorkGroupData(),
      engineering: generateWorkGroupData(),
      supporting: generateWorkGroupData()
    },
    REP: {
      operation: generateWorkGroupData(),
      maintenance: generateWorkGroupData(),
      engineering: generateWorkGroupData(),
      supporting: generateWorkGroupData()
    },
    COO: {
      operation: generateWorkGroupData(),
      maintenance: generateWorkGroupData(),
      engineering: generateWorkGroupData(),
      supporting: generateWorkGroupData()
    },
    CFO: {
      operation: generateWorkGroupData(),
      maintenance: generateWorkGroupData(),
      engineering: generateWorkGroupData(),
      supporting: generateWorkGroupData()
    },
    SSE: {
      operation: generateWorkGroupData(),
      maintenance: generateWorkGroupData(),
      engineering: generateWorkGroupData(),
      supporting: generateWorkGroupData()
    },
    PSE: {
      operation: generateWorkGroupData(),
      maintenance: generateWorkGroupData(),
      engineering: generateWorkGroupData(),
      supporting: generateWorkGroupData()
    },
    CME: {
      operation: generateWorkGroupData(),
      maintenance: generateWorkGroupData(),
      engineering: generateWorkGroupData(),
      supporting: generateWorkGroupData()
    }
  },

  // ตำแหน่ง: ผู้บริหารระดับสูง / ผู้จัดการส่วน
  senior: {
    CEO: {
      operation: generateWorkGroupData(),
      maintenance: generateWorkGroupData(),
      engineering: generateWorkGroupData(),
      supporting: generateWorkGroupData()
    },
    REP: {
      operation: generateWorkGroupData(),
      maintenance: generateWorkGroupData(),
      engineering: generateWorkGroupData(),
      supporting: generateWorkGroupData()
    },
    COO: {
      operation: generateWorkGroupData(),
      maintenance: generateWorkGroupData(),
      engineering: generateWorkGroupData(),
      supporting: generateWorkGroupData()
    },
    CFO: {
      operation: generateWorkGroupData(),
      maintenance: generateWorkGroupData(),
      engineering: generateWorkGroupData(),
      supporting: generateWorkGroupData()
    },
    SSE: {
      operation: generateWorkGroupData(),
      maintenance: generateWorkGroupData(),
      engineering: generateWorkGroupData(),
      supporting: generateWorkGroupData()
    },
    PSE: {
      operation: generateWorkGroupData(),
      maintenance: generateWorkGroupData(),
      engineering: generateWorkGroupData(),
      supporting: generateWorkGroupData()
    },
    CME: {
      operation: generateWorkGroupData(),
      maintenance: generateWorkGroupData(),
      engineering: generateWorkGroupData(),
      supporting: generateWorkGroupData()
    }
  }
};

// ฟังก์ชันช่วยดึงข้อมูลตามเงื่อนไข
export const getEvaluationData = (department, unit, workGroup, version, period) => {
  try {
    if (department === 'all' || !evaluationData[department]) {
      return null;
    }
    
    if (unit === 'all' || !evaluationData[department][unit]) {
      return null;
    }
    
    if (workGroup === 'all' || !evaluationData[department][unit][workGroup]) {
      return null;
    }
    
    if (version === 'both') {
      return null;
    }
    
    return evaluationData[department][unit][workGroup][version]?.[period];
  } catch (error) {
    console.error('Error getting evaluation data:', error);
    return null;
  }
};