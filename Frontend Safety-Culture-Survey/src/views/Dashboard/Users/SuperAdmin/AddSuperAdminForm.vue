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
import axios from 'axios';

// Define emits
const emit = defineEmits(['admin-added']);

// Reactive data
const adminForms = ref([
  { email: '' }
]);

const error = ref('');
const successMessage = ref('');
const isLoading = ref(false);

// API base URL
const API_URL = 'http://localhost:5000/api/super-admins';

// Add new admin form
function addAdmin() {
  adminForms.value.push({ email: '' });
}

// Remove admin form
function removeAdmin(index) {
  if (adminForms.value.length > 1) {
    adminForms.value.splice(index, 1);
  }
}

// Clear all forms
function clearForm() {
  adminForms.value = [{ email: '' }];
  error.value = '';
  successMessage.value = '';
}

// Submit form
async function submitForm() {
  error.value = '';
  successMessage.value = '';
  isLoading.value = true;

  // 1. Validate all forms for empty emails
  if (adminForms.value.some(admin => !admin.email.trim())) {
    error.value = 'กรุณากรอกอีเมลให้ครบถ้วน';
    isLoading.value = false;
    return;
  }

  // 2. Check for duplicate emails in the form
  const emailSet = new Set();
  const duplicateEmails = adminForms.value
    .map(admin => admin.email.toLowerCase().trim())
    .filter(email => {
      if (emailSet.has(email)) return true;
      emailSet.add(email);
      return false;
    });

  if (duplicateEmails.length > 0) {
    error.value = `พบอีเมลซ้ำในฟอร์ม: ${[...new Set(duplicateEmails)].join(', ')}`;
    isLoading.value = false;
    return;
  }

  // 3. Create API requests
  const requests = adminForms.value.map(admin => 
    axios.post(API_URL, { email: admin.email.trim() })
  );

  try {
    const results = await Promise.allSettled(requests);
    
    const successfulAdds = [];
    const failedAdds = [];

    results.forEach((result, index) => {
      const email = adminForms.value[index].email;
      if (result.status === 'fulfilled') {
        successfulAdds.push(email);
      } else {
        // Axios wraps the error response in result.reason.response
        const errorMessage = result.reason.response?.data?.message || result.reason.message;
        failedAdds.push({ email, reason: errorMessage });
      }
    });

    let summaryMessage = '';
    if (successfulAdds.length > 0) {
      summaryMessage += `เพิ่ม Super Admin สำเร็จ ${successfulAdds.length} คน `;
      successMessage.value = summaryMessage;
      emit('admin-added'); // Notify parent to refresh
      clearForm();
    }

    if (failedAdds.length > 0) {
      const errorDetails = failedAdds.map(f => `${f.email} (${f.reason})`).join('; ');
      error.value = `ล้มเหลว ${failedAdds.length} คน: ${errorDetails}`;
    }

  } catch (e) {
    // This catch block might not be strictly necessary with allSettled but is good for unforeseen issues
    error.value = 'เกิดข้อผิดพลาดที่ไม่คาดคิดขณะส่งข้อมูล';
  } finally {
    isLoading.value = false;
    // Hide messages after 5 seconds
    setTimeout(() => {
      successMessage.value = '';
      error.value = '';
    }, 5000);
  }
}
</script>