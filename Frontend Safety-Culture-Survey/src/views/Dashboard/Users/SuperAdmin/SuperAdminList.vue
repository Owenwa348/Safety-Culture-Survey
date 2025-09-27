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
                <tr v-for="admin in filteredAdmins" :key="admin.id" class="hover:bg-gray-50 transition-colors">
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
                  
                  <!-- Role (Fixed as SuperAdmin) -->
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                      Super Admin
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
                      {{ admin.status === 'active' && admin.lastLogin ? formatDateTime(admin.lastLogin) : '-' }}
                    </div>
                  </td>
                  
                  <!-- Actions -->
                  <td class="px-6 py-4">
                    <div class="flex items-center space-x-3" v-if="admin.status === 'pending'">
                      <button 
                        @click="removeAdmin(admin)" 
                        class="text-sm font-medium text-red-600 hover:text-red-800 hover:underline transition-colors"
                      >
                        ลบ
                      </button>
                    </div>
                    <div class="flex items-center space-x-3" v-else>
                      <button 
                        @click="toggleActive(admin)" 
                        :class="admin.status === 'active' 
                          ? 'text-yellow-600 hover:text-yellow-800' 
                          : 'text-green-600 hover:text-green-800'"
                        class="text-sm font-medium hover:underline transition-colors"
                      >
                        {{ admin.status === 'active' ? 'ปิดบัญชี' : 'เปิดบัญชี' }}
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">ไม่พบผู้ดูแล</h3>
              <p class="mt-1 text-sm text-gray-500">ไม่มีผู้ดูแลที่ตรงกับการค้นหา</p>
              <div class="mt-4 text-xs text-red-500">
                Debug: admins.length = {{ admins.length }}, filteredAdmins.length = {{ filteredAdmins.length }}
              </div>
            </div>
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

const showForm = ref(false);
const admins = ref([]);
const search = ref('');

// ข้อมูลตัวอย่าง
const sampleAdmins = [
  {
    id: 1,
    email: 'somchai.w@company.com',
    role: 'SuperAdmin',
    status: 'active',
    created_at: '2024-01-15T08:30:00Z',
    lastLogin: '2024-09-23T14:35:22Z'
  },
  {
    id: 2,
    email: 'supawadee.j@company.com',
    role: 'SuperAdmin',
    status: 'pending',
    created_at: '2024-02-20T14:15:00Z',
    lastLogin: null
  },
  {
    id: 3,
    email: 'admin.disabled@company.com',
    role: 'SuperAdmin',
    status: 'inactive',
    created_at: '2024-01-10T10:20:00Z',
    lastLogin: null
  }
];

// Fetch all admins
async function fetchAdmins() {
  try {
    const { data } = await axios.get('/api/admin');
    admins.value = Array.isArray(data) ? data : sampleAdmins;
  } catch (error) {
    console.error('Failed to fetch admins:', error);
    admins.value = sampleAdmins;
    console.log('Using sample data instead');
  }
}

function handleAdminAdded() {
  fetchAdmins();
  showForm.value = false;
}

// ใช้ข้อมูลตัวอย่างทันทีและไม่เรียก API ในการ demo
onMounted(() => {
  admins.value = [...sampleAdmins];
  console.log('Loaded sample admins:', admins.value);
});

async function toggleActive(admin) {
  try {
    const newStatus = admin.status === 'active' ? 'inactive' : 'active';
    await axios.patch(`/api/admin/${admin.id}/status`, { status: newStatus });
    admin.status = newStatus;
    // ถ้าเปิดใช้งาน ให้ใส่เวลาล่าสุด
    if (newStatus === 'active') {
      admin.lastLogin = new Date().toISOString();
    }
  } catch (error) {
    console.error('Failed to toggle status:', error);
    // สำหรับ demo จะแสดงผลการเปลี่ยนแปลงทันที
    admin.status = admin.status === 'active' ? 'inactive' : 'active';
    // ถ้าเปิดใช้งาน ให้ใส่เวลาล่าสุด
    if (admin.status === 'active') {
      admin.lastLogin = new Date().toISOString();
    }
    alert('อัปเดตสถานะสำเร็จ (Demo Mode)');
  }
}

async function removeAdmin(admin) {
  if (!confirm(`ต้องการลบ ${admin.email}?\n\nการดำเนินการนี้ไม่สามารถยกเลิกได้`)) return;
  
  try {
    await axios.delete(`/api/admin/${admin.id}`);
    admins.value = admins.value.filter(a => a.id !== admin.id);
  } catch (error) {
    console.error('Failed to remove admin:', error);
    // สำหรับ demo จะลบออกจาก array ทันที
    admins.value = admins.value.filter(a => a.id !== admin.id);
    alert('ลบสำเร็จ (Demo Mode)');
  }
}

function getStatusClass(status) {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'inactive':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

function getStatusDotClass(status) {
  switch (status) {
    case 'active':
      return 'bg-green-400';
    case 'inactive':
      return 'bg-red-400';
    case 'pending':
      return 'bg-yellow-400';
    default:
      return 'bg-gray-400';
  }
}

function getStatusText(status) {
  switch (status) {
    case 'active':
      return 'เปิดใช้งาน';
    case 'inactive':
      return 'ปิดใช้งาน';
    case 'pending':
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
    second: '2-digit'
  });
}

const filteredAdmins = computed(() => {
  if (!Array.isArray(admins.value)) {
    return [];
  }

  let filtered = [...admins.value];

  // Filter by search keyword
  const keyword = search.value.toLowerCase();
  if (keyword) {
    filtered = filtered.filter(admin =>
      admin.email.toLowerCase().includes(keyword)
    );
  }

  // Sort by email
  return filtered.sort((a, b) => a.email.localeCompare(b.email));
});
</script>