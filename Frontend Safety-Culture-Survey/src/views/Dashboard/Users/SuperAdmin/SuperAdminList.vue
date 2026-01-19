<template>
  <!-- Wrap everything in a single root div -->
  <div>
    <!-- Main content with proper margin to avoid sidebar overlap -->
    <div class="flex-1 flex flex-col ml-64">
      <!-- Navbar -->
      <NavbarDashboard />

      <!-- Page content -->
      <div class="max-w-7xl mx-auto p-6 space-y-6 w-full">
        <!-- Header Section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">จัดการรายชื่อ Super Admin</h2>
              <p class="text-sm text-gray-600 mt-1">จัดการสิทธิ์และสถานะของผู้ดูแลระบบระดับสูง</p>
            </div>

            <div class="flex items-center gap-4">
              <!-- Search -->
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
                <input
                  v-model="search"
                  type="text"
                  placeholder="ค้นหาอีเมล..."
                  class="pl-10 pr-4 py-2.5 w-64 border border-gray-300 rounded-lg text-sm 
                         focus:outline-none focus:ring-2 focus:ring-purple-500 
                         focus:border-transparent transition-colors"
                />
              </div>

              <!-- Add Admin Button -->
              <button
                @click="showForm = !showForm"
                class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                {{ showForm ? 'ยกเลิก' : 'เพิ่มผู้ดูแล' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Add Admin Form -->
        <AddSuperAdminForm v-if="showForm" @admin-added="handleAdminAdded" />
        
        <!-- Admin List -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">รายชื่อผู้ดูแลระบบ</h3>
            <p class="text-sm text-gray-600 mt-1">ทั้งหมด {{ filteredAdmins.length }} คน</p>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    อีเมล
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    สิทธิ์
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    สถานะ
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    วันที่เข้าสู่ระบบล่าสุด
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    การจัดการ
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="isLoading">
                  <td colspan="5" class="text-center py-12 text-gray-500">กำลังโหลดข้อมูล...</td>
                </tr>
                <tr v-else-if="error">
                   <td colspan="5" class="text-center py-12 text-red-500">{{ error }}</td>
                </tr>
                <tr v-for="admin in filteredAdmins" :key="admin.id" v-else class="hover:bg-gray-50 transition-colors">
                  <!-- Admin Email -->
                  <td class="px-6 py-4">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div class="bg-purple-100 h-10 w-10 rounded-full flex items-center justify-center">
                          <span class="text-purple-700 text-sm font-medium">
                            {{ admin.email.charAt(0).toUpperCase() }}
                          </span>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ admin.email }}</div>
                      </div>
                    </div>
                  </td>
                  
                  <!-- Role -->
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                      {{ admin.role }}
                    </span>
                  </td>
                  
                  <!-- Status -->
                  <td class="px-6 py-4">
                    <span 
                      :class="getStatusClass(admin.status)"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                    >
                      <span 
                        :class="getStatusDotClass(admin.status)"
                        class="w-1.5 h-1.5 rounded-full mr-1.5"
                      ></span>
                      {{ getStatusText(admin.status) }}
                    </span>
                  </td>

                  <!-- Last Login -->
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">
                      {{ admin.status === 'ACTIVE' && admin.lastLogin ? formatDateTime(admin.lastLogin) : '-' }}
                    </div>
                  </td>
                  
                  <!-- Actions -->
                  <td class="px-6 py-4">
                    <!-- Actions for PENDING status -->
                    <div class="flex items-center space-x-3" v-if="admin.status === 'PENDING'">
                      <button 
                        @click="deleteSuperAdmin(admin)" 
                        class="text-sm font-medium text-red-600 hover:text-red-800 hover:underline transition-colors"
                      >
                        ลบ
                      </button>
                    </div>
                    <!-- Actions for ACTIVE or INACTIVE status -->
                    <div class="flex items-center space-x-3" v-else>
                      <button 
                        @click="toggleAccountStatus(admin)" 
                        :class="admin.status === 'ACTIVE' 
                          ? 'text-yellow-600 hover:text-yellow-800' 
                          : 'text-green-600 hover:text-green-800'"
                        class="text-sm font-medium hover:underline transition-colors"
                      >
                        {{ admin.status === 'ACTIVE' ? 'ปิดบัญชี' : 'เปิดบัญชี' }}
                      </button>
                      <span class="text-gray-300">|</span>
                      <button 
                        @click="deleteSuperAdmin(admin)" 
                        class="text-sm font-medium text-red-600 hover:text-red-800 hover:underline transition-colors"
                      >
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
                 <tr v-if="!isLoading && filteredAdmins.length === 0">
                    <td colspan="5" class="text-center py-12">
                        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                        <h3 class="mt-2 text-sm font-medium text-gray-900">ไม่พบผู้ดูแล</h3>
                        <p class="mt-1 text-sm text-gray-500">ไม่มีผู้ดูแลที่ตรงกับการค้นหา หรือยังไม่มีข้อมูล</p>
                    </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import AddSuperAdminForm from './AddSuperAdminForm.vue'; 
import NavbarDashboard from '../../../../components/NavbarDashboard.vue';

const API_URL = '/api/super-admins';

const showForm = ref(false);
const admins = ref([]);
const search = ref('');
const isLoading = ref(true);
const error = ref(null);

// Fetch all super admins
async function fetchSuperAdmins() {
  isLoading.value = true;
  error.value = null;
  try {
    const { data } = await axios.get(API_URL);
    admins.value = Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Failed to fetch super admins:', err);
    error.value = 'ไม่สามารถโหลดข้อมูลได้ กรุณาตรวจสอบว่าเซิร์ฟเวอร์ Backend ทำงานอยู่';
    admins.value = []; // Clear data on error
  } finally {
    isLoading.value = false;
  }
}

// Handle event from child component
function handleAdminAdded() {
  fetchSuperAdmins(); // Refresh the list
  showForm.value = false; // Close the form
}

// Load data on component mount
onMounted(() => {
  fetchSuperAdmins();
});

// Toggle account status (Activate/Deactivate)
async function toggleAccountStatus(admin) {
  const newStatus = admin.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
  const actionText = newStatus === 'INACTIVE' ? 'ปิดบัญชี' : 'เปิดบัญชี';

  if (!confirm(`ต้องการ ${actionText} ของ ${admin.email} หรือไม่?`)) return;

  try {
    await axios.put(`${API_URL}/${admin.id}/status`, { status: newStatus });
    // Update local data to reflect the change immediately
    const index = admins.value.findIndex(a => a.id === admin.id);
    if (index !== -1) {
      admins.value[index].status = newStatus;
    }
  } catch (err) {
    console.error(`Failed to ${actionText}:`, err);
    alert(`เกิดข้อผิดพลาดในการ${actionText}`);
  }
}

// Delete a super admin
async function deleteSuperAdmin(admin) {
  if (!confirm(`ต้องการลบ ${admin.email} ออกจากระบบใช่หรือไม่?\nการดำเนินการนี้ไม่สามารถย้อนกลับได้`)) return;

  try {
    await axios.delete(`${API_URL}/${admin.id}`);
    admins.value = admins.value.filter(a => a.id !== admin.id);
  } catch (err) {
    console.error('Failed to delete admin:', err);
    alert('เกิดข้อผิดพลาดในการลบ');
  }
}

// --- Helper Functions for Display ---

function getStatusClass(status) {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'INACTIVE':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

function getStatusDotClass(status) {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-400';
    case 'INACTIVE':
      return 'bg-red-400';
    case 'PENDING':
      return 'bg-yellow-400';
    default:
      return 'bg-gray-400';
  }
}

function getStatusText(status) {
  switch (status) {
    case 'ACTIVE':
      return 'ยืนยันตัวตนแล้ว';
    case 'INACTIVE':
      return 'ปิดใช้งาน';
    case 'PENDING':
      return 'ยังไม่ยืนยันตัวตน';
    default:
      return 'ไม่ทราบสถานะ';
  }
}

function formatDateTime(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('th-TH', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const filteredAdmins = computed(() => {
  if (!admins.value) return [];

  let filtered = [...admins.value];
  const keyword = search.value.toLowerCase().trim();

  if (keyword) {
    filtered = filtered.filter(admin =>
      admin.email.toLowerCase().includes(keyword)
    );
  }

  return filtered;
});

</script>