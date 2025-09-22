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
              <h2 class="text-2xl font-bold text-gray-900">จัดการ Super Admin</h2>
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
                  placeholder="ค้นหาชื่อหรืออีเมล..."
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
                    ข้อมูลผู้ดูแล
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
                  <!-- Admin Info -->
                  <td class="px-6 py-4">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div 
                          :class="admin.role === 'SuperAdmin' ? 'bg-purple-100' : 'bg-blue-100'"
                          class="h-10 w-10 rounded-full flex items-center justify-center"
                        >
                          <span 
                            :class="admin.role === 'SuperAdmin' ? 'text-purple-700' : 'text-blue-700'"
                            class="text-sm font-medium"
                          >
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
                  
                  <!-- Role (Editable for SuperAdmin) -->
                  <td class="px-6 py-4">
                    <select 
                      v-model="admin.role" 
                      @change="changeRole(admin, admin.role)" 
                      class="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none 
                             focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
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

                  <!-- Join Date -->
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">{{ formatDate(admin.created_at) }}</div>
                    <div class="text-xs text-gray-500">{{ formatTime(admin.created_at) }}</div>
                  </td>
                  
                  <!-- Actions -->
                  <td class="px-6 py-4">
                    <div class="flex items-center space-x-3">
                      <button 
                        @click="viewDetails(admin)"
                        class="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
                      >
                        ดูรายละเอียด
                      </button>
                      <span class="text-gray-300">|</span>
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              <h3 class="mt-2 text-sm font-medium text-gray-900">ไม่พบผู้ดูแล</h3>
              <p class="mt-1 text-sm text-gray-500">ไม่มีผู้ดูแลที่ตรงกับการค้นหา</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="showDetailModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">รายละเอียดผู้ดูแล</h3>
        </div>
        <div class="px-6 py-4" v-if="selectedAdmin">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">ชื่อ</label>
              <p class="text-sm text-gray-900">{{ selectedAdmin.name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">อีเมล</label>
              <p class="text-sm text-gray-900">{{ selectedAdmin.email }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">สิทธิ์</label>
              <p class="text-sm text-gray-900">{{ selectedAdmin.role }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">สถานะ</label>
              <p class="text-sm text-gray-900">{{ selectedAdmin.active ? 'เปิดใช้งาน' : 'ปิดใช้งาน' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">วันที่เข้าสู่ระบบล่าสุด</label>
              <p class="text-sm text-gray-900">{{ formatDate(selectedAdmin.created_at) }}</p>
            </div>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-gray-200 text-right">
          <button 
            @click="showDetailModal = false"
            class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            ปิด
          </button>
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
const showDetailModal = ref(false);
const admins = ref([]); // ให้ default เป็น empty array
const search = ref('');
const roleFilter = ref('all');
const selectedAdmin = ref(null);

// Fetch all admins (SuperAdmin can see both SuperAdmin and Admin)
async function fetchAdmins() {
  try {
    const { data } = await axios.get('/api/admin');
    //  ตรวจสอบว่า data เป็น array หรือไม่
    admins.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Failed to fetch admins:', error);
    //  กรณี error ให้ set เป็น empty array
    admins.value = [];
    alert('ไม่สามารถโหลดข้อมูลผู้ดูแลได้');
  }
}

function handleAdminAdded() {
  fetchAdmins();
  showForm.value = false;
}

onMounted(fetchAdmins);

async function changeRole(admin, newRole) {
  try {
    await axios.patch(`/api/admin/${admin.id}/role`, { role: newRole });
    admin.role = newRole;
    // Show success message
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
    Toast.fire({
      icon: 'success',
      title: 'เปลี่ยนสิทธิ์สำเร็จ'
    });
  } catch (error) {
    console.error('Failed to change role:', error);
    alert('เปลี่ยนสิทธิ์ล้มเหลว');
    // Revert the change
    admin.role = admin.role === 'SuperAdmin' ? 'Admin' : 'SuperAdmin';
  }
}

async function toggleActive(admin) {
  try {
    await axios.patch(`/api/admin/${admin.id}/status`, { active: !admin.active });
    admin.active = !admin.active;
  } catch (error) {
    console.error('Failed to toggle status:', error);
    alert('อัปเดตสถานะล้มเหลว');
  }
}

async function removeAdmin(admin) {
  if (!confirm(`ต้องการลบ ${admin.name}?\n\nการดำเนินการนี้ไม่สามารถยกเลิกได้`)) return;
  
  try {
    await axios.delete(`/api/admin/${admin.id}`);
    admins.value = admins.value.filter(a => a.id !== admin.id);
  } catch (error) {
    console.error('Failed to remove admin:', error);
    alert('ลบไม่สำเร็จ');
  }
}

function viewDetails(admin) {
  selectedAdmin.value = admin;
  showDetailModal.value = true;
}

function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatTime(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Computed properties for statistics
const superAdminCount = computed(() => {
  return Array.isArray(admins.value) ? admins.value.filter(admin => admin.role === 'SuperAdmin').length : 0;
});

const adminCount = computed(() => {
  return Array.isArray(admins.value) ? admins.value.filter(admin => admin.role === 'Admin').length : 0;
});

const activeCount = computed(() => {
  return Array.isArray(admins.value) ? admins.value.filter(admin => admin.active).length : 0;
});

const inactiveCount = computed(() => {
  return Array.isArray(admins.value) ? admins.value.filter(admin => !admin.active).length : 0;
});

const filteredAdmins = computed(() => {
  //  ตรวจสอบให้แน่ใจว่า admins.value เป็น array
  if (!Array.isArray(admins.value)) {
    return [];
  }

  let filtered = [...admins.value]; //  สร้าง copy ของ array

  // Filter by role
  if (roleFilter.value !== 'all') {
    filtered = filtered.filter(admin => admin.role === roleFilter.value);
  }

  // Filter by search keyword
  const keyword = search.value.toLowerCase();
  if (keyword) {
    filtered = filtered.filter(admin =>
      admin.name.toLowerCase().includes(keyword) ||
      admin.email.toLowerCase().includes(keyword)
    );
  }

  // Sort by role (SuperAdmin first) then by name
  return filtered.sort((a, b) => {
    if (a.role !== b.role) {
      return a.role === 'SuperAdmin' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
});
</script>