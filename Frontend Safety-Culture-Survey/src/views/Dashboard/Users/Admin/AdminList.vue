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
                class="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">ทุกบริษัท</option>
                <option v-for="company in uniqueCompanies" :key="company" :value="company">
                  {{ company }}
                </option>
              </select>

              <!-- Search -->
              <div class="relative">
                <input
                  v-model="search"
                  type="text"
                  placeholder="ค้นหาชื่อ, อีเมล..."
                  class="pl-4 pr-4 py-2.5 w-64 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <!-- Add Admin Button -->
              <button
                @click="showForm = !showForm"
                class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                {{ showForm ? 'ยกเลิก' : 'เพิ่ม Admin' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Add Admin Form -->
        <AddAdminForm v-if="showForm" @admin-added="handleAdminAdded" />

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
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ข้อมูลผู้ดูแล</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">บริษัท</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">สิทธิ์</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">สถานะ</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">วันที่เข้าร่วม</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">การจัดการ</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="admin in filteredAdmins" :key="admin.id" class="hover:bg-gray-50 transition-colors">
                  <!-- Admin Info -->
                  <td class="px-6 py-4">
                    <div class="flex items-center">
                      <div class="ml-4 flex-1">
                        <template v-if="editingAdmin === admin.id">
                           <input v-model="editData.fullName" type="text" placeholder="ชื่อ - นามสกุล" class="w-full px-2 py-1 text-sm border border-gray-300 rounded"/>
                        </template>
                        <template v-else>
                          <div class="text-sm font-medium text-gray-900">{{ formatName(admin.firstName, admin.lastName) }}</div>
                          <div class="text-sm text-gray-500">{{ admin.email }}</div>
                        </template>
                      </div>
                    </div>
                  </td>

                  <!-- Company -->
                  <td class="px-6 py-4">
                    <template v-if="editingAdmin === admin.id">
                      <input v-model="editData.companyName" type="text" placeholder="บริษัท" class="w-full px-2 py-1 text-sm border border-gray-300 rounded"/>
                    </template>
                    <template v-else>
                      <div class="text-sm text-gray-900">{{ admin.companyName }}</div>
                    </template>
                  </td>
                  
                  <!-- Role -->
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      {{ admin.role }}
                    </span>
                  </td>
                  
                  <!-- Status -->
                  <td class="px-6 py-4">
                     <span :class="getStatusClass(admin.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border">
                      {{ getStatusText(admin.status) }}
                    </span>
                  </td>

                  <!-- Join Date -->
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">{{ formatDateTime(admin.joinedAt) }}</div>
                  </td>
                  
                  <!-- Actions -->
                  <td class="px-6 py-4">
                    <div class="flex items-center space-x-3">
                      <template v-if="editingAdmin === admin.id">
                        <button @click="saveAdmin(admin)" class="text-sm font-medium text-green-600 hover:text-green-800">บันทึก</button>
                        <span class="text-gray-300">|</span>
                        <button @click="cancelEdit()" class="text-sm font-medium text-gray-600 hover:text-gray-800">ยกเลิก</button>
                      </template>
                      <template v-else>
                        <template v-if="admin.status !== 'PENDING'">
                          <button @click="startEdit(admin)" class="text-sm font-medium text-blue-600 hover:text-blue-800">แก้ไข</button>
                          <span class="text-gray-300">|</span>
                          <button @click="toggleStatus(admin)" :class="admin.status === 'ACTIVE' ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'" class="text-sm font-medium">
                            {{ admin.status === 'ACTIVE' ? 'ปิดบัญชี' : 'เปิดบัญชี' }}
                          </button>
                          <span class="text-gray-300">|</span>
                        </template>
                        <button @click="deleteAdmin(admin)" class="text-sm font-medium text-red-600 hover:text-red-800">
                          ลบ
                        </button>
                      </template>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <div v-if="loading" class="text-center py-12">กำลังโหลด...</div>
            <div v-if="!loading && filteredAdmins.length === 0" class="text-center py-12">
              <h3 class="mt-2 text-sm font-medium text-gray-900">ไม่พบข้อมูล Admin</h3>
              <p class="mt-1 text-sm text-gray-500">ไม่มี Admin ในระบบหรือที่ตรงกับการค้นหา</p>
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

const API_URL = '/api/admin';

const showForm = ref(false);
const search = ref('');
const selectedCompany = ref('');
const editingAdmin = ref(null);
const editData = ref({ fullName: '', companyName: '' });
const admins = ref([]);
const loading = ref(true);

async function fetchAdmins() {
  loading.value = true;
  try {
    const { data } = await axios.get(`${API_URL}/list`);
    admins.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Failed to fetch admins:', error);
    admins.value = [];
    alert('ไม่สามารถโหลดข้อมูล Admin ได้');
  } finally {
    loading.value = false;
  }
}

function handleAdminAdded() {
  fetchAdmins();
  showForm.value = false;
}

onMounted(fetchAdmins);

function formatName(first, last) {
    return (first || last) ? `${first || ''} ${last || ''}`.trim() : '-';
}

function formatDateTime(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
}

function startEdit(admin) {
  editingAdmin.value = admin.id;
  editData.value = {
    fullName: formatName(admin.firstName, admin.lastName) === '-' ? '' : formatName(admin.firstName, admin.lastName),
    companyName: admin.companyName || ''
  };
}

function cancelEdit() {
  editingAdmin.value = null;
}

async function saveAdmin(admin) {
  const nameParts = editData.value.fullName.trim().split(/\s+/);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const payload = {
      firstName,
      lastName,
      companyName: editData.value.companyName
  };

  try {
    const { data } = await axios.put(`${API_URL}/update/${admin.id}`, payload);
    const index = admins.value.findIndex(a => a.id === admin.id);
    if (index !== -1) {
      admins.value[index] = { ...admins.value[index], ...data.admin };
    }
    cancelEdit();
  } catch (error) {
    console.error('Failed to update admin:', error);
    alert('อัปเดตข้อมูลล้มเหลว');
  }
}

async function toggleStatus(admin) {
  if (admin.status === 'PENDING') {
      alert('ไม่สามารถเปลี่ยนสถานะผู้ที่ยังไม่ยืนยันตัวตนได้');
      return;
  }
  const newStatus = admin.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
  const actionText = newStatus === 'INACTIVE' ? 'ปิดบัญชี' : 'เปิดบัญชี';

  if (!confirm(`ต้องการ ${actionText} ของ ${admin.email} หรือไม่?`)) return;

  try {
    await axios.put(`${API_URL}/status/${admin.id}`, { status: newStatus });
    admin.status = newStatus;
  } catch (error) {
    console.error('Failed to toggle status:', error);
    alert(`เกิดข้อผิดพลาดในการ ${actionText}`);
  }
}

async function deleteAdmin(admin) {
  if (!confirm(`ต้องการลบ ${admin.email} ออกจากระบบใช่หรือไม่?`)) return;
  
  try {
    await axios.delete(`${API_URL}/delete/${admin.id}`);
    admins.value = admins.value.filter(a => a.id !== admin.id);
  } catch (error) {
    console.error('Failed to remove admin:', error);
    alert('เกิดข้อผิดพลาดในการลบผู้ดูแล');
  }
}

function getStatusClass(status) {
  switch (status) {
    case 'ACTIVE': return 'bg-green-100 text-green-800 border-green-200';
    case 'INACTIVE': return 'bg-red-100 text-red-800 border-red-200';
    case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

function getStatusText(status) {
  switch (status) {
    case 'ACTIVE': return 'ยืนยันตัวตนแล้ว';
    case 'INACTIVE': return 'ปิดใช้งาน';
    case 'PENDING': return 'ยังไม่ยืนยันตัวตน';
    default: return 'ไม่ทราบสถานะ';
  }
}

const filteredAdmins = computed(() => {
  return admins.value.filter(admin => {
    const keyword = search.value.toLowerCase();
    const name = formatName(admin.firstName, admin.lastName).toLowerCase();
    const email = admin.email.toLowerCase();
    const company = (admin.companyName || '').toLowerCase();
    
    const matchesSearch = name.includes(keyword) || email.includes(keyword) || company.includes(keyword);
    const matchesCompany = !selectedCompany.value || admin.companyName === selectedCompany.value;
    
    return matchesSearch && matchesCompany;
  });
});

const uniqueCompanies = computed(() => {
  const companies = [...new Set(admins.value.map(a => a.companyName).filter(Boolean))];
  return companies.sort();
});
</script>
