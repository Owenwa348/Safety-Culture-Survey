<template>
  <div class="max-w-7xl mx-auto p-6 space-y-6">
    <!-- Header Section -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">จัดการผู้ดูแลระบบ</h2>
          <p class="text-sm text-gray-600 mt-1">จัดการสิทธิ์และสถานะของผู้ดูแลระบบ</p>
        </div>

        <div class="flex items-center gap-4">
          <!-- Search -->
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <input
              v-model="search"
              type="text"
              placeholder="ค้นหาชื่อหรืออีเมล..."
              class="pl-10 pr-4 py-2.5 w-64 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          <!-- Add Admin Button -->
          <button
            @click="showForm = !showForm"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            {{ showForm ? 'ยกเลิก' : 'เพิ่มผู้ดูแล' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Add Admin Form (Toggle) -->
    <AddAdminForm v-if="showForm" @admin-added="handleAdminAdded" />
    <!-- Admin List -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900">รายชื่อผู้ดูแล</h3>
        <p class="text-sm text-gray-600 mt-1">ทั้งหมด {{ filteredAdmins.length }} คน</p>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ข้อมูลผู้ดูแล
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                สิทธิ์
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                สถานะ
              </th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                การจัดการ
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="admin in filteredAdmins" :key="admin.id" class="hover:bg-gray-50 transition-colors">
              <!-- Admin Info -->
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span class="text-sm font-medium text-blue-700">
                        {{ admin.name.charAt(0).toUpperCase() }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ admin.name }}</div>
                    <div class="text-sm text-gray-500">{{ admin.email }}</div>
                  </div>
                </div>
              </td>
              
              <!-- Role -->
              <td class="px-6 py-4">
                <select 
                  v-model="admin.role" 
                  @change="changeRole(admin, admin.role)" 
                  class="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="SuperAdmin">SuperAdmin</option>
                  <option value="Admin">Admin</option>
                </select>
              </td>
              
              <!-- Status -->
              <td class="px-6 py-4">
                <span 
                  :class="admin.active 
                    ? 'bg-green-100 text-green-800 border-green-200' 
                    : 'bg-red-100 text-red-800 border-red-200'"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                >
                  <span 
                    :class="admin.active ? 'bg-green-400' : 'bg-red-400'"
                    class="w-1.5 h-1.5 rounded-full mr-1.5"
                  ></span>
                  {{ admin.active ? 'เปิดใช้งาน' : 'ปิดใช้งาน' }}
                </span>
              </td>
              
              <!-- Actions -->
              <td class="px-6 py-4">
                <div class="flex items-center space-x-3">
                  <button 
                    @click="toggleActive(admin)" 
                    :class="admin.active 
                      ? 'text-yellow-600 hover:text-yellow-800' 
                      : 'text-green-600 hover:text-green-800'"
                    class="text-sm font-medium hover:underline transition-colors"
                  >
                    {{ admin.active ? 'ปิดบัญชี' : 'เปิดบัญชี' }}
                  </button>
                  <span class="text-gray-300">|</span>
                  <button 
                    @click="removeAdmin(admin)" 
                    class="text-sm font-medium text-red-600 hover:text-red-800 hover:underline transition-colors"
                  >
                    ลบ
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Empty State -->
        <div v-if="filteredAdmins.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">ไม่พบผู้ดูแล</h3>
          <p class="mt-1 text-sm text-gray-500">ไม่มีผู้ดูแลที่ตรงกับการค้นหา</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import AddAdminForm from './AddAdminForm.vue';

const showForm = ref(false);
const admins = ref([]);
const search = ref('');

async function fetchAdmins() {
  const { data } = await axios.get('/api/admin');
  admins.value = data;
}

function handleAdminAdded() {
  fetchAdmins();
  showForm.value = false; // ซ่อนฟอร์มเมื่อเพิ่มเสร็จ
}

onMounted(fetchAdmins);
async function changeRole(admin, newRole) {
  try {
    await axios.patch(`/api/admin/${admin.id}/role`, { role: newRole });
    admin.role = newRole;
  } catch (error) {
    alert('เปลี่ยนสิทธิ์ล้มเหลว');
  }
}

async function toggleActive(admin) {
  try {
    await axios.patch(`/api/admin/${admin.id}/status`, { active: !admin.active });
    admin.active = !admin.active;
  } catch (error) {
    alert('อัปเดตสถานะล้มเหลว');
  }
}

async function removeAdmin(admin) {
  if (!confirm(`ต้องการลบ ${admin.name}?`)) return;
  try {
    await axios.delete(`/api/admin/${admin.id}`);
    admins.value = admins.value.filter(a => a.id !== admin.id);
  } catch {
    alert('ลบไม่สำเร็จ');
  }
}

const filteredAdmins = computed(() => {
  const keyword = search.value.toLowerCase();
  return admins.value.filter(a =>
    a.name.toLowerCase().includes(keyword) ||
    a.email.toLowerCase().includes(keyword)
  );
});
</script>