<template>
  <div class="bg-white border border-gray-200 p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
    <div class="mb-6">
      <h3 class="text-xl font-semibold text-gray-800 mb-1">เพิ่มผู้ดูแล</h3>
      <p class="text-sm text-gray-600">กรอกข้อมูลผู้ดูแลระบบใหม่</p>
    </div>
    
    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">ชื่อ</label>
        <input 
          v-model="form.name" 
          type="text" 
          placeholder="กรอกชื่อผู้ดูแล" 
          class="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          required 
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">อีเมล</label>
        <input 
          v-model="form.email" 
          type="email" 
          placeholder="example@email.com" 
          class="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          required 
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">บทบาท</label>
        <select 
          v-model="form.role" 
          class="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
        >
          <option value="Admin">Admin</option>
          <option value="SuperAdmin">SuperAdmin</option>
        </select>
      </div>
      
      <button 
        type="submit" 
        class="w-full bg-blue-600 text-white font-medium px-4 py-2.5 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 mt-6"
      >
        เพิ่มผู้ดูแล
      </button>
    </form>
    
    <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
      <p class="text-sm text-red-700">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const emit = defineEmits(['admin-added']);

const form = ref({
  name: '',
  email: '',
  role: 'Admin',
});

const error = ref('');

async function submitForm() {
  error.value = '';
  try {
    await axios.post('/api/admin/create', form.value);
    form.value = { name: '', email: '', role: 'Admin' };
    emit('admin-added');
  } catch (err) {
    error.value = err.response?.data?.message || 'เกิดข้อผิดพลาด';
  }
}
</script>