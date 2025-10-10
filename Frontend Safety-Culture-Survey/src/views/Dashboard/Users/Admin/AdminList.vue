<template>
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
              <h2 class="text-2xl font-bold text-gray-900">จัดการผู้ตรวจสอบผลการประเมิน (Admin)</h2>
              <p class="text-sm text-gray-600 mt-1">จัดการสิทธิ์และสถานะของผู้ดูแลระบบระดับ Admin</p>
            </div>

            <div class="flex items-center gap-4">
              <!-- Company Filter -->
              <select
                v-model="selectedCompany"
                class="px-3 py-2.5 border border-gray-300 rounded-lg text-sm 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       focus:border-transparent transition-colors bg-white"
              >
                <option value="">ทุกบริษัท</option>
                <option v-for="company in uniqueCompanies" :key="company" :value="company">
                  {{ company }}
                </option>
              </select>

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
                  placeholder="ค้นหาชื่อ, อีเมล..."
                  class="pl-10 pr-4 py-2.5 w-64 border border-gray-300 rounded-lg text-sm 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         focus:border-transparent transition-colors"
                />
              </div>

              <!-- Add Admin Button -->
              <button
                @click="showForm = !showForm"
                class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                {{ showForm ? 'ยกเลิก' : 'เพิ่ม Admin' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Add Admin Form -->
        <AddAdminForm v-if="showForm" @admin-added="handleAdminAdded" role="Admin" />

        <!-- Admin List -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">รายชื่อ Admin</h3>
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
                    บริษัท
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    สิทธิ์
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    สถานะ
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    วันที่เข้าร่วม
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
                            {{ getDisplayInitial(admin) }}
                          </span>
                        </div>
                      </div>
                      <div class="ml-4 flex-1">
                        <!-- Edit Mode for Name -->
                        <template v-if="editingAdmin === admin.id && admin.is_verified">
                          <div class="space-y-2">
                            <div class="flex gap-2">
                              <input
                                v-model="editData.name"
                                type="text"
                                placeholder="ชื่อ - นามสกุล"
                                class="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                            <input
                              v-model="editData.email"
                              type="email"
                              placeholder="อีเมล"
                              class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </template>
                        <!-- Display Mode -->
                        <template v-else>
                          <div class="text-sm font-medium text-gray-900">{{ getDisplayName(admin) }}</div>
                          <div class="text-sm text-gray-500">{{ admin.email }}</div>
                        </template>
                      </div>
                    </div>
                  </td>

                  <!-- Company -->
                  <td class="px-6 py-4">
                    <!-- Edit Mode for Company -->
                    <template v-if="editingAdmin === admin.id && admin.is_verified">
                      <input
                        v-model="editData.company"
                        type="text"
                        placeholder="บริษัท"
                        class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </template>
                    <!-- Display Mode -->
                    <template v-else>
                      <div class="text-sm text-gray-900">{{ admin.company }}</div>
                    </template>
                  </td>
                  
                  <!-- Role (Read Only for Admin level) -->
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      Admin
                    </span>
                  </td>
                  
                  <!-- Status -->
                  <td class="px-6 py-4">
                    <span v-if="!admin.is_verified" 
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                      <span class="w-1.5 h-1.5 rounded-full bg-orange-400 mr-1.5"></span>
                      ยังไม่ยืนยันตัวตน
                    </span>
                    <span v-else
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
                    <div class="text-sm text-gray-900">{{ formatJoinDate(admin) }}</div>
                  </td>
                  
                  <!-- Actions -->
                  <td class="px-6 py-4">
                    <div class="flex items-center space-x-3">
                      <!-- Edit Mode Actions -->
                      <template v-if="editingAdmin === admin.id">
                        <button 
                          @click="saveAdmin(admin)" 
                          class="text-sm font-medium text-green-600 hover:text-green-800 hover:underline transition-colors"
                        >
                          บันทึก
                        </button>
                        <span class="text-gray-300">|</span>
                        <button 
                          @click="cancelEdit()" 
                          class="text-sm font-medium text-gray-600 hover:text-gray-800 hover:underline transition-colors"
                        >
                          ยกเลิก
                        </button>
                      </template>
                      <!-- Normal Mode Actions -->
                      <template v-else>
                        <!-- Edit button only for verified users -->
                        <template v-if="admin.is_verified">
                          <button 
                            @click="startEdit(admin)" 
                            class="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                          >
                            แก้ไข
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
                        </template>
                        <!-- Delete button available for all users -->
                        <button 
                          @click="removeAdmin(admin)" 
                          class="text-sm font-medium text-red-600 hover:text-red-800 hover:underline transition-colors"
                        >
                          ลบ
                        </button>
                      </template>
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
              <h3 class="mt-2 text-sm font-medium text-gray-900">ไม่พบ Admin</h3>
              <p class="mt-1 text-sm text-gray-500">ไม่มี Admin ที่ตรงกับการค้นหา</p>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import AddAdminForm from './AddAdminForm.vue';
import NavbarDashboard from '../../../../components/NavbarDashboard.vue';

const showForm = ref(false);
const search = ref('');
const selectedCompany = ref('');
const editingAdmin = ref(null);
const editData = ref({
  name: '',
  email: '',
  company: ''
});

const admins = ref([
  {
    id: 1,
    name: 'สมชาย ใจดี',
    email: 'somchai@company.com',
    role: 'Admin',
    active: true,
    is_verified: true,
    company: 'บริษัท FDDD จำกัด',
    created_at: '2024-01-15T08:30:00Z',
    verified_at: '2024-01-16T10:00:00Z'
  },
  {
    id: 2,
    name: 'สมหญิง ทำงาน',
    email: 'somying@company.com',
    role: 'Admin',
    active: false,  
    is_verified: true,
    company: 'บริษัท ABC จำกัด',
    created_at: '2024-02-20T14:15:00Z',
    verified_at: '2024-02-21T09:30:00Z'
  },
  {
    id: 3,
    name: null, // ยังไม่ได้ยืนยันตัวตน
    email: 'newuser@company.com',
    role: 'Admin',
    active: false,
    is_verified: false,
    company: 'บริษัท XYZ จำกัด',
    created_at: '2024-03-10T16:45:00Z',
    verified_at: null
  }
]);

// Get display name - show "-" if not verified, otherwise show name
function getDisplayName(admin) {
  if (!admin.is_verified) {
    return '-';
  }
  return admin.name || admin.email;
}

// Get display initial for avatar
function getDisplayInitial(admin) {
  if (!admin.is_verified || !admin.name) {
    return admin.email.charAt(0).toUpperCase();
  }
  return admin.name.charAt(0).toUpperCase();
}

// Format join date - show "-" if not verified, otherwise show verified date
function formatJoinDate(admin) {
  if (!admin.is_verified || !admin.verified_at) {
    return '-';
  }
  
  const date = new Date(admin.verified_at);
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Start editing
function startEdit(admin) {
  editingAdmin.value = admin.id;
  editData.value = {
    name: admin.name|| '',
    email: admin.email,
    company: admin.company
  };
}

// Cancel editing
function cancelEdit() {
  editingAdmin.value = null;
  editData.value = {
    name: '',
    email: '',
    company: ''
  };
}

// Save admin changes
async function saveAdmin(admin) {
  try {
    // Validation
    if (!editData.value.name.trim()) {
      alert('กรุณาระบุชื่อและสกุล');
      return;
    }
    
    if (!editData.value.email.trim()) {
      alert('กรุณาระบุอีเมล');
      return;
    }
    
    if (!editData.value.company.trim()) {
      alert('กรุณาระบุบริษัท');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editData.value.email)) {
      alert('รูปแบบอีเมลไม่ถูกต้อง');
      return;
    }
    
    // Check for duplicate email (excluding current admin)
    const duplicateEmail = admins.value.find(a => 
      a.id !== admin.id && a.email.toLowerCase() === editData.value.email.toLowerCase()
    );
    
    if (duplicateEmail) {
      alert('อีเมลนี้มีอยู่ในระบบแล้ว');
      return;
    }
    
    // Update admin data
    admin.name = editData.value.name.trim();
    admin.email = editData.value.email.trim();
    admin.company = editData.value.company.trim();
    
    // เมื่อมี API จริง ใช้โค้ดนี้
    /*
    await axios.patch(`/api/admin/${admin.id}`, {
      name: admin.name,
      email: admin.email,
      company: admin.company
    });
    */
    
    console.log('Admin updated:', admin);
    alert('อัปเดตข้อมูลเรียบร้อยแล้ว');
    
    // Reset edit mode
    cancelEdit();
    
  } catch (error) {
    console.error('Failed to update admin:', error);
    alert('อัปเดตข้อมูลล้มเหลว');
  }
}

// Fetch only Admin role users
async function fetchAdmins() {
  try {
    // เมื่อมี API จริง ใช้โค้ดนี้
    // const { data } = await axios.get('/api/admin?role=Admin');
    // admins.value = data;
    
    // ใช้ข้อมูลปลอมชั่วคราว
    console.log('Fetching admins...');
  } catch (error) {
    console.error('Failed to fetch admins:', error);
    alert('ไม่สามารถโหลดข้อมูล Admin ได้');
  }
}

function handleAdminAdded(newAdmins) {
  if (newAdmins && Array.isArray(newAdmins)) {
    // เพิ่มรายชื่อใหม่เข้าไปในรายการ
    admins.value = [...admins.value, ...newAdmins];
  } else {
    // กรณีไม่มีข้อมูลส่งมา (สำหรับ API call)
    fetchAdmins();
  }
  showForm.value = false;
}

onMounted(fetchAdmins);

// Toggle active status for verified admins only
async function toggleActive(admin) {
  // Only allow toggle for verified users
  if (!admin.is_verified) {
    alert('ไม่สามารถเปลี่ยนสถานะได้ เนื่องจากยังไม่ยืนยันตัวตน');
    return;
  }

  try {
    // เมื่อมี API จริง ใช้โค้ดนี้
    // await axios.patch(`/api/admin/${admin.id}/status`, { active: !admin.active });
    
    // สำหรับข้อมูลจำลอง - อัปเดตทันที
    admin.active = !admin.active;
    console.log(`Admin ${admin.name} status changed to: ${admin.active ? 'active' : 'inactive'}`);
  } catch (error) {
    console.error('Failed to toggle status:', error);
    alert('อัปเดตสถานะล้มเหลว');
  }
}

// Remove admin function - แก้ไขให้ทำงานกับข้อมูลจำลอง
function removeAdmin(admin) {
  console.log('removeAdmin called with:', admin);
  
  const displayName = getDisplayName(admin);
  console.log('Display name:', displayName);
  
  if (!confirm(`ต้องการลบ ${displayName} (${admin.email}) ออกจากระบบ?`)) {
    console.log('User cancelled deletion');
    return;
  }
  
  console.log('Before remove, admins count:', admins.value.length);
  
  try {
    // สำหรับข้อมูลจำลอง - ลบทันทีโดยไม่ต้อง call API
    admins.value = admins.value.filter(a => a.id !== admin.id);
    
    console.log('After remove, admins count:', admins.value.length);
    console.log('Admin removed successfully');
    
    // แสดงข้อความยืนยัน
    alert(`ลบ ${displayName} เรียบร้อยแล้ว`);
    
    // Reset edit mode if we're editing this admin
    if (editingAdmin.value === admin.id) {
      cancelEdit();
    }
    
    // เมื่อมี API จริง ใช้โค้ดนี้แทน
    /*
    await axios.delete(`/api/admin/${admin.id}`);
    admins.value = admins.value.filter(a => a.id !== admin.id);
    */
  } catch (error) {
    console.error('Failed to remove admin:', error);
    alert('ลบไม่สำเร็จ');
  }
}

// Computed properties
const filteredAdmins = computed(() => {
  const keyword = search.value.toLowerCase();
  return admins.value.filter(a => {
    const name = (a.name || '').toLowerCase();
    const email = a.email.toLowerCase();
    const company = (a.company || '').toLowerCase();
    
    const matchesSearch = name.includes(keyword) ||
                         email.includes(keyword) ||
                         company.includes(keyword);
    
    const matchesCompany = !selectedCompany.value || a.company === selectedCompany.value;
    
    return matchesSearch && matchesCompany;
  });
});

// Get unique companies for filter dropdown
const uniqueCompanies = computed(() => {
  const companies = [...new Set(admins.value.map(a => a.company).filter(Boolean))];
  return companies.sort();
});
</script>