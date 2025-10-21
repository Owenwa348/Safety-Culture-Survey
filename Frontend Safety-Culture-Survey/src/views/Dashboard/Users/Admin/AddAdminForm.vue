<!-- AddAdminForm.vue -->
<template>
  <div class="bg-white border border-gray-200 p-6 rounded-lg shadow-md w-full">
    <div class="mb-6">
      <h3 class="text-xl font-semibold text-gray-800 mb-1">เพิ่มผู้ดูแล</h3>
      <p class="text-sm text-gray-600">กรอกข้อมูลผู้ดูแลระบบใหม่ (สามารถเพิ่มได้หลายคนพร้อมกัน)</p>
    </div>
    
    <form @submit.prevent="submitForm" class="space-y-4">
      <!-- Header Row -->
      <div class="grid grid-cols-12 gap-4 items-center font-medium text-sm text-gray-700 border-b pb-2">
        <div class="col-span-5">อีเมล</div>
        <div class="col-span-6">บริษัท</div>
        <div class="col-span-1 text-center">ลบ</div>
      </div>
      
      <!-- Admin Rows -->
      <div v-for="(admin, index) in adminForms" :key="index" class="grid grid-cols-12 gap-4 items-start py-2 border-b border-gray-100">
        <div class="col-span-5">
          <input 
            v-model="admin.email" 
            type="email" 
            placeholder="example@email.com" 
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            required 
          />
        </div>
        
        <div class="col-span-6">
          <input 
            v-model="admin.company" 
            type="text" 
            placeholder="ชื่อบริษัท" 
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            required 
          />
        </div>
        
        <div class="col-span-1 flex justify-center">
          <button 
            v-if="adminForms.length > 1"
            type="button"
            @click="removeAdmin(index)"
            class="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Add More Button -->
      <div class="flex justify-between items-center pt-4">
        <button 
          type="button"
          @click="addAdmin"
          class="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          เพิ่มผู้ดูแล
        </button>
        
        <div class="text-sm text-gray-500">
          รวม {{ adminForms.length }} คน
        </div>
      </div>
      
      <!-- Submit Buttons -->
      <div class="flex gap-3 pt-4 border-t">
        <button 
          type="submit" 
          class="flex-1 bg-blue-600 text-white font-medium px-4 py-2.5 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          เพิ่มผู้ดูแลทั้งหมด
        </button>
        
        <button 
          type="button"
          @click="clearForm"
          class="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
        >
          ล้างข้อมูล
        </button>
      </div>
    </form>
    
    <!-- Success Message -->
    <div v-if="successMessage" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
      <p class="text-sm text-green-700">{{ successMessage }}</p>
    </div>
    
    <!-- Error Message -->
    <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
      <p class="text-sm text-red-700">{{ error }}</p>
    </div>
    
    <!-- Bulk Import Option -->
    <div class="mt-6 pt-4 border-t border-gray-200">
      <div class="flex items-center justify-between mb-3">
        <h4 class="text-md font-medium text-gray-700">นำเข้าจากไฟล์ Excel/CSV</h4>
        <button 
          type="button"
          @click="downloadTemplate"
          class="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          ดาวน์โหลดแม่แบบ
        </button>
      </div>
      
      <div class="flex items-center gap-3">
        <input 
          ref="fileInput"
          type="file" 
          accept=".csv,.xlsx,.xls"
          @change="handleFileUpload"
          class="hidden"
        />
        
        <button 
          type="button"
          @click="$refs.fileInput.click()"
          class="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          เลือกไฟล์ Excel/CSV
        </button>
        
        <span v-if="uploadedFile" class="text-sm text-gray-600">
          {{ uploadedFile.name }}
        </span>
      </div>
      
      <p class="text-xs text-gray-500 mt-2">
        รองรับไฟล์ .xlsx, .xls และ .csv เท่านั้น
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

// Define emits
const emit = defineEmits(['admin-added']);

// Reactive data
const adminForms = ref([
  {
    email: '',
    company: '',
    role: 'Admin'
  }
]);

const error = ref('');
const successMessage = ref('');
const uploadedFile = ref(null);

// Add new admin form
function addAdmin() {
  adminForms.value.push({
    email: '',
    company: '',
    role: 'Admin'
  });
}

// Remove admin form
function removeAdmin(index) {
  if (adminForms.value.length > 1) {
    adminForms.value.splice(index, 1);
  }
}

// Clear all forms
function clearForm() {
  adminForms.value = [{
    email: '',
    company: '',
    role: 'Admin'
  }];
  error.value = '';
  successMessage.value = '';
  uploadedFile.value = null;
}

// Submit form
async function submitForm() {
  error.value = '';
  successMessage.value = '';

  // Validate all forms
  const invalidForms = adminForms.value.filter(admin => !admin.email || !admin.company);
  if (invalidForms.length > 0) {
    error.value = 'กรุณากรอกข้อมูลให้ครบถ้วน (อีเมล, บริษัท)';
    return;
  }

  // Check for duplicate emails in the form
  const emailSet = new Set();
  const duplicateEmails = [];
  adminForms.value.forEach(admin => {
    if (emailSet.has(admin.email.toLowerCase())) {
      duplicateEmails.push(admin.email);
    } else {
      emailSet.add(admin.email.toLowerCase());
    }
  });
  if (duplicateEmails.length > 0) {
    error.value = `พบอีเมลซ้ำในฟอร์ม: ${duplicateEmails.join(', ')}`;
    return;
  }

  const promises = adminForms.value.map(admin => {
    return axios.post('http://localhost:5000/api/admin/add', {
      email: admin.email.trim(),
      companyName: admin.company.trim() // Map component's 'company' to backend's 'companyName'
    });
  });

  try {
    const results = await Promise.allSettled(promises);
    
    const successfulAdds = [];
    const failedAdds = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successfulAdds.push(adminForms.value[index].email);
      } else {
        const errorMessage = result.reason.response?.data?.message || result.reason.message;
        failedAdds.push(`${adminForms.value[index].email} (${errorMessage})`);
      }
    });

    if (successfulAdds.length > 0) {
      successMessage.value = `เพิ่มผู้ดูแลสำเร็จ ${successfulAdds.length} คน`;
      emit('admin-added'); // Emit event to notify parent to refresh list
    }

    if (failedAdds.length > 0) {
      error.value = `เกิดข้อผิดพลาดในการเพิ่ม ${failedAdds.length} คน: ${failedAdds.join('; ')}`;
    }

    if (failedAdds.length === 0) {
      clearForm(); // Clear form only if all were successful
    } else {
      // Filter out successful ones and keep failed ones in the form
      adminForms.value = adminForms.value.filter((_, index) => results[index].status !== 'fulfilled');
    }

    setTimeout(() => {
      successMessage.value = '';
      error.value = '';
    }, 5000);

  } catch (e) {
    console.error('An unexpected error occurred during form submission:', e);
    error.value = 'เกิดข้อผิดพลาดที่ไม่คาดคิด โปรดลองอีกครั้ง';
  }
}

// Download template
function downloadTemplate() {
  const csvContent = "\uFEFFemail,company\n";
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'แม่แบบข้อมูลผู้ดูแล.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// File upload handling
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  uploadedFile.value = file;
  const fileName = file.name.toLowerCase();
  
  if (fileName.endsWith('.csv')) {
    handleCSVFile(file);
  } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
    handleExcelFile(file);
  } else {
    error.value = 'รองรับเฉพาะไฟล์ .csv, .xlsx และ .xls เท่านั้น';
    uploadedFile.value = null;
  }
}

// Handle CSV file
function handleCSVFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const csv = e.target.result;
      parseCSVData(csv);
    } catch (err) {
      error.value = 'ไฟล์ CSV ไม่ถูกต้อง กรุณาตรวจสอบรูปแบบ';
    }
  };
  reader.readAsText(file);
}

// Handle Excel file (mock)
function handleExcelFile(file) {
  error.value = 'การอ่านไฟล์ Excel ต้องการ library เพิ่มเติม (xlsx)';
  
  // จำลองข้อมูล
  setTimeout(() => {
    const mockData = [
      { email: 'somchai@abc.com', company: 'บริษัท เอบีซี จำกัด' },
      { email: 'somying@xyz.com', company: 'บริษัท เอ็กซ์วายซี จำกัด' }
    ];
    processFileData(mockData);
  }, 1000);
}

// Parse CSV data
function parseCSVData(csv) {
  const lines = csv.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length >= 2) {
        data.push({
          email: values[0] || '',
          company: values[1] || ''
        });
      }
    }
  }
  
  processFileData(data);
}

// Process file data
function processFileData(data) {
  if (data.length === 0) {
    error.value = 'ไม่พบข้อมูลในไฟล์';
    return;
  }
  
  // ล้างฟอร์มเดิม
  adminForms.value = [];
  
  // เพิ่มข้อมูลจากไฟล์
  data.forEach(item => {
    if (item.email && item.company) {
      adminForms.value.push({
        email: item.email.trim(),
        company: item.company.trim(),
        role: 'Admin'
      });
    }
  });
  
  if (adminForms.value.length === 0) {
    error.value = 'ไม่พบข้อมูลที่ถูกต้องในไฟล์ (ต้องมี email และ company)';
    return;
  }
  
  successMessage.value = `นำเข้าข้อมูลจากไฟล์สำเร็จ ${adminForms.value.length} คน`;
  error.value = '';
}
</script>
