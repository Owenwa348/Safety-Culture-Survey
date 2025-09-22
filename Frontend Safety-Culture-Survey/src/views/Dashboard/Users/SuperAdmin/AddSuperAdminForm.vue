<!-- AddSuperAdminForm.vue -->
<template>
  <div class="bg-white border border-gray-200 p-6 rounded-lg shadow-md w-full">
    <div class="mb-6">
      <h3 class="text-xl font-semibold text-gray-800 mb-1">เพิ่ม Super Admin</h3>
      <p class="text-sm text-gray-600">กรอกอีเมลของผู้ดูแลระบบระดับสูงใหม่ (สามารถเพิ่มได้หลายคนพร้อมกัน)</p>
    </div>
    
    <form @submit.prevent="submitForm" class="space-y-4">
      <!-- Header Row -->
      <div class="grid grid-cols-12 gap-4 items-center font-medium text-sm text-gray-700 border-b pb-2">
        <div class="col-span-10">อีเมล</div>
        <div class="col-span-2 text-center">ลบ</div>
      </div>
      
      <!-- Admin Rows -->
      <div v-for="(admin, index) in adminForms" :key="index" class="grid grid-cols-12 gap-4 items-start py-2 border-b border-gray-100">
        <div class="col-span-10">
          <input 
            v-model="admin.email" 
            type="email" 
            placeholder="example@email.com" 
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
            required 
          />
        </div>
        
        <div class="col-span-2 flex justify-center">
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
          เพิ่ม Super Admin อีกคน
        </button>
        
        <div class="text-sm text-gray-500">
          รวม {{ adminForms.length }} คน
        </div>
      </div>
      
      <!-- Submit Buttons -->
      <div class="flex gap-3 pt-4 border-t">
        <button 
          type="submit" 
          class="flex-1 bg-blue-600 text-white font-medium px-4 py-2.5 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200"
        >
          เพิ่ม Super Admin ทั้งหมด
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
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Define emits
const emit = defineEmits(['admin-added']);

// Reactive data
const adminForms = ref([
  {
    email: '',
    role: 'SuperAdmin'
  }
]);

const error = ref('');
const successMessage = ref('');

// Add new admin form
function addAdmin() {
  adminForms.value.push({
    email: '',
    role: 'SuperAdmin'
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
    role: 'SuperAdmin'
  }];
  error.value = '';
  successMessage.value = '';
}

// Submit form
function submitForm() {
  error.value = '';
  successMessage.value = '';
  
  console.log('Submit form called with:', adminForms.value);
  
  // Validate all forms
  const invalidForms = adminForms.value.filter(admin => !admin.email);
  
  if (invalidForms.length > 0) {
    error.value = 'กรุณากรอกอีเมลให้ครบถ้วน';
    return;
  }
  
  // ตรวจสอบอีเมลซ้ำ
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
    error.value = `พบอีเมลซ้ำ: ${duplicateEmails.join(', ')}`;
    return;
  }
  
  // สร้าง array ของ SuperAdmin ใหม่
  const newAdmins = adminForms.value.map((admin, index) => ({
    id: Date.now() + index, // สร้าง ID ชั่วคราว
    name: null, // ยังไม่ยืนยันตัวตน
    email: admin.email.trim(),
    role: 'SuperAdmin',
    active: false,
    is_verified: false, // ยังไม่ยืนยันตัวตน
    created_at: new Date().toISOString(),
    verified_at: null
  }));
  
  console.log('New SuperAdmins created:', newAdmins);
  
  // แสดงข้อความสำเร็จ
  successMessage.value = `เพิ่ม Super Admin สำเร็จ ${adminForms.value.length} คน`;
  
  // ส่งข้อมูลใหม่ไปยัง parent component
  emit('admin-added', newAdmins);
  
  // ล้างฟอร์ม
  clearForm();
  
  // ซ่อนข้อความสำเร็จหลัง 3 วินาที
  setTimeout(() => {
    successMessage.value = '';
  }, 3000);
}
</script>