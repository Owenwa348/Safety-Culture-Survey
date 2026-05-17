<!-- AdminList.vue -->
<template>
  <div class="flex-1 flex flex-col ml-64">
    <NavbarDashboard />

    <div class="max-w-7xl mx-auto p-6 space-y-6 w-full">
      <!-- Header Section -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">จัดการผู้ตรวจสอบผลการประเมิน (Admin)</h2>
            <p class="text-sm text-gray-600 mt-1">จัดการสิทธิ์และสถานะของผู้ดูแลระบบระดับ Admin</p>
          </div>

          <div class="flex items-center gap-3 flex-wrap justify-end">
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
                class="pl-4 pr-4 py-2.5 w-56 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Download Template Button -->
            <button
              @click="downloadTemplate"
              :disabled="isDownloading"
              class="flex items-center gap-1.5 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 whitespace-nowrap text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {{ isDownloading ? 'กำลังดาวน์โหลด...' : 'ดาวน์โหลดแม่แบบ' }}
            </button>

            <!-- Upload Excel Button — opens modal -->
            <button
              @click="openUploadModal"
              class="flex items-center gap-1.5 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors whitespace-nowrap text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12" />
              </svg>
              นำเข้าจาก Excel
            </button>

            <!-- Add Admin Button -->
            <button
              @click="showForm = !showForm"
              class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap text-sm"
            >
              {{ showForm ? 'ยกเลิก' : '+ เพิ่ม Admin' }}
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
                        <input v-model="editData.fullName" type="text" placeholder="ชื่อ - นามสกุล" class="w-full px-2 py-1 text-sm border border-gray-300 rounded" />
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
                    <input v-model="editData.companyName" type="text" placeholder="บริษัท" class="w-full px-2 py-1 text-sm border border-gray-300 rounded" />
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
                        <button
                          @click="toggleStatus(admin)"
                          :class="admin.status === 'ACTIVE' ? 'text-yellow-600 hover:text-yellow-800' : 'text-green-600 hover:text-green-800'"
                          class="text-sm font-medium"
                        >
                          {{ admin.status === 'ACTIVE' ? 'ปิดบัญชี' : 'เปิดบัญชี' }}
                        </button>
                        <span class="text-gray-300">|</span>
                      </template>
                      <button @click="deleteAdmin(admin)" class="text-sm font-medium text-red-600 hover:text-red-800">ลบ</button>
                    </template>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="loading" class="text-center py-12 text-gray-500">กำลังโหลด...</div>
          <div v-if="!loading && filteredAdmins.length === 0" class="text-center py-12">
            <h3 class="mt-2 text-sm font-medium text-gray-900">ไม่พบข้อมูล Admin</h3>
            <p class="mt-1 text-sm text-gray-500">ไม่มี Admin ในระบบหรือที่ตรงกับการค้นหา</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ─── Upload Excel Modal ─────────────────────────────────────────────── -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showUploadModal"
          class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          @click.self="closeUploadModal"
        >
          <div class="bg-white rounded-xl border border-gray-200 w-full max-w-sm overflow-hidden shadow-2xl">

            <!-- Modal Header -->
            <div class="flex items-start gap-3 px-5 py-4 border-b border-gray-100">
              <div class="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-sm font-semibold text-gray-900">นำเข้า Admin จาก Excel</h3>
                <p class="text-xs text-gray-500 mt-0.5">อัปโหลดไฟล์ .xlsx ตามแม่แบบที่กำหนดเท่านั้น</p>
              </div>
              <button
                @click="closeUploadModal"
                class="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors flex-shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Modal Body -->
            <div class="px-5 py-4 space-y-3">

              <!-- Steps -->
              <div class="space-y-2">
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">ขั้นตอน</p>
                <ol class="space-y-2">
                  <li v-for="(step, i) in uploadSteps" :key="i" class="flex gap-3 items-start">
                    <span class="w-5 h-5 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5 border border-blue-100">
                      {{ i + 1 }}
                    </span>
                    <div>
                      <p class="text-sm text-gray-800 font-medium leading-snug">{{ step.title }}</p>
                      <p class="text-xs text-gray-500 mt-0.5 leading-relaxed">{{ step.desc }}</p>
                    </div>
                  </li>
                </ol>
              </div>

              <!-- Drop zone -->
              <div
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleDrop"
                @click="$refs.modalFileInput.click()"
                :class="[
                  'border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all duration-150',
                  isDragging
                    ? 'border-purple-400 bg-purple-50'
                    : uploadFile
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                ]"
              >
                <!-- Icon -->
                <div class="flex justify-center mb-2">
                  <svg
                    v-if="!uploadFile"
                    xmlns="http://www.w3.org/2000/svg"
                    :class="['w-7 h-7', isDragging ? 'text-purple-400' : 'text-gray-300']"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-7 h-7 text-green-500"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                <template v-if="!uploadFile">
                  <p class="text-sm font-medium text-gray-700">คลิกหรือลากไฟล์มาวางที่นี่</p>
                  <p class="text-xs text-gray-400 mt-1">รองรับเฉพาะไฟล์ .xlsx (ไม่เกิน 5 MB)</p>
                </template>
                <template v-else>
                  <p class="text-sm font-medium text-green-700">{{ uploadFile.name }}</p>
                  <p class="text-xs text-green-500 mt-1">{{ (uploadFile.size / 1024).toFixed(1) }} KB · คลิกเพื่อเปลี่ยนไฟล์</p>
                </template>
              </div>

              <input
                ref="modalFileInput"
                type="file"
                accept=".xlsx"
                class="hidden"
                @change="onFileSelect"
              />

              <!-- Progress bar -->
              <div v-if="isUploading" class="space-y-1.5">
                <div class="flex justify-between text-xs text-gray-500">
                  <span>กำลังนำเข้าข้อมูล...</span>
                  <span>{{ uploadProgress }}%</span>
                </div>
                <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-purple-500 rounded-full transition-all duration-300"
                    :style="{ width: uploadProgress + '%' }"
                  ></div>
                </div>
              </div>

              <!-- Result -->
              <Transition name="fade">
                <div
                  v-if="uploadResult"
                  :class="[
                    'rounded-lg border p-3',
                    uploadResult.ok
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  ]"
                >
                  <div class="flex gap-2 items-start">
                    <svg
                      v-if="uploadResult.ok"
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div class="flex-1 min-w-0">
                      <p :class="['text-sm font-medium', uploadResult.ok ? 'text-green-800' : 'text-red-800']">
                        {{ uploadResult.title }}
                      </p>
                      <p class="text-xs text-gray-500 mt-0.5">{{ uploadResult.detail }}</p>
                      <!-- Error list -->
                      <ul v-if="uploadResult.errors?.length" class="mt-2 space-y-0.5 max-h-24 overflow-y-auto">
                        <li
                          v-for="err in uploadResult.errors"
                          :key="err"
                          class="text-xs text-red-600 flex gap-1.5 items-start"
                        >
                          <span class="mt-0.5 flex-shrink-0">•</span>
                          <span>{{ err }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Transition>

            </div>

            <!-- Modal Footer -->
            <div class="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
              <p class="text-xs text-gray-400 truncate max-w-[150px]">
                {{ uploadFile ? `${uploadFile.name}` : 'ยังไม่ได้เลือกไฟล์' }}
              </p>
              <div class="flex gap-2 flex-shrink-0">
                <button
                  @click="closeUploadModal"
                  :disabled="isUploading"
                  class="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  ยกเลิก
                </button>
                <button
                  @click="submitUpload"
                  :disabled="!uploadFile || isUploading"
                  class="flex items-center gap-1.5 px-3.5 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg v-if="!isUploading" xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {{ isUploading ? 'กำลังนำเข้า...' : 'นำเข้าข้อมูล' }}
                </button>
              </div>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import AddAdminForm from './AddAdminForm.vue';
import NavbarDashboard from '../../../../components/NavbarDashboard.vue';

const API_URL = '/api/admin';

// ─── Table state ──────────────────────────────────────────────────────────────
const showForm        = ref(false);
const search          = ref('');
const selectedCompany = ref('');
const editingAdmin    = ref(null);
const editData        = ref({ fullName: '', companyName: '' });
const admins          = ref([]);
const loading         = ref(true);
const isDownloading   = ref(false);

// ─── Upload modal state ───────────────────────────────────────────────────────
const showUploadModal = ref(false);
const isDragging      = ref(false);
const uploadFile      = ref(null);
const isUploading     = ref(false);
const uploadProgress  = ref(0);
const uploadResult    = ref(null);
const modalFileInput  = ref(null);

// 2 ขั้นตอน — ข้อ 2 เดิม (วิธีกรอกข้อมูล) ย้ายไปอธิบายใน Excel แล้ว
const uploadSteps = [
  {
    title: 'ดาวน์โหลดแม่แบบ Excel',
    desc:  'รับไฟล์ที่มีคำอธิบายวิธีกรอกข้อมูลพร้อมใช้',
  },
  {
    title: 'อัปโหลดไฟล์ที่กรอกเรียบร้อยแล้ว',
    desc:  'รองรับ .xlsx ขนาดไม่เกิน 5 MB · ครั้งละไม่เกิน 100 แถว',
  },
];

// ─── Auth helper ──────────────────────────────────────────────────────────────
const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  return { headers: { Authorization: `Bearer ${token}` } };
};

// ─── Fetch Admins ─────────────────────────────────────────────────────────────
async function fetchAdmins() {
  loading.value = true;
  try {
    const { data } = await axios.get(`${API_URL}/list`, getAuthHeader());
    admins.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Failed to fetch admins:', error);
    admins.value = [];
  } finally {
    loading.value = false;
  }
}

function handleAdminAdded() {
  fetchAdmins();
  showForm.value = false;
}

onMounted(fetchAdmins);

// ─── Download Template ────────────────────────────────────────────────────────
async function downloadTemplate() {
  isDownloading.value = true;
  try {
    const response = await axios.get(`${API_URL}/template`, {
      ...getAuthHeader(),
      responseType: 'blob',
    });
    const url  = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href  = url;
    link.setAttribute('download', 'admin_template.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download template error:', error);
    alert('ดาวน์โหลดแม่แบบล้มเหลว');
  } finally {
    isDownloading.value = false;
  }
}

// ─── Upload Modal ─────────────────────────────────────────────────────────────
function openUploadModal() {
  showUploadModal.value = true;
  uploadFile.value      = null;
  uploadProgress.value  = 0;
  uploadResult.value    = null;
  isDragging.value      = false;
}

function closeUploadModal() {
  if (isUploading.value) return;
  showUploadModal.value = false;
  uploadFile.value      = null;
  uploadProgress.value  = 0;
  uploadResult.value    = null;
  isDragging.value      = false;
}

function onFileSelect(e) {
  const file = e.target.files[0];
  if (!file) return;
  if (!file.name.endsWith('.xlsx')) {
    uploadResult.value = {
      ok:     false,
      title:  'ไม่รองรับรูปแบบไฟล์',
      detail: 'กรุณาใช้ไฟล์ .xlsx เท่านั้น',
    };
    return;
  }
  uploadFile.value   = file;
  uploadResult.value = null;
  e.target.value     = '';
}

function handleDrop(e) {
  isDragging.value = false;
  const file       = e.dataTransfer.files[0];
  if (!file) return;
  if (!file.name.endsWith('.xlsx')) {
    uploadResult.value = {
      ok:     false,
      title:  'ไม่รองรับรูปแบบไฟล์',
      detail: 'กรุณาใช้ไฟล์ .xlsx เท่านั้น',
    };
    return;
  }
  uploadFile.value   = file;
  uploadResult.value = null;
}

async function submitUpload() {
  if (!uploadFile.value || isUploading.value) return;

  isUploading.value    = true;
  uploadProgress.value = 0;
  uploadResult.value   = null;

  // Simulate progress while waiting for server
  const iv = setInterval(() => {
    uploadProgress.value = Math.min(uploadProgress.value + 8, 85);
  }, 150);

  try {
    const formData = new FormData();
    formData.append('file', uploadFile.value);

    const { data } = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
        // ไม่กำหนด Content-Type — axios จัดการ multipart/form-data boundary ให้เองอัตโนมัติ
      },
    });

    clearInterval(iv);
    uploadProgress.value = 100;

    uploadResult.value = {
      ok:     true,
      title:  `นำเข้าสำเร็จ ${data.added} รายการ`,
      detail: `เพิ่มใหม่ ${data.added} รายการ · ข้อผิดพลาด ${data.errors?.length || 0} รายการ`,
      errors: data.errors || [],
    };

    await fetchAdmins();
  } catch (error) {
    clearInterval(iv);
    uploadProgress.value = 0;
    uploadResult.value = {
      ok:     false,
      title:  'นำเข้าล้มเหลว',
      detail: error.response?.data?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
    };
  } finally {
    isUploading.value = false;
  }
}

// ─── Table Actions ────────────────────────────────────────────────────────────
function formatName(first, last) {
  return (first || last) ? `${first || ''} ${last || ''}`.trim() : '-';
}

function formatDateTime(dateString) {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('th-TH', {
    year:  'numeric',
    month: 'short',
    day:   'numeric',
  });
}

function startEdit(admin) {
  editingAdmin.value = admin.id;
  editData.value = {
    fullName:    formatName(admin.firstName, admin.lastName) === '-' ? '' : formatName(admin.firstName, admin.lastName),
    companyName: admin.companyName || '',
  };
}

function cancelEdit() {
  editingAdmin.value = null;
}

async function saveAdmin(admin) {
  const nameParts = editData.value.fullName.trim().split(/\s+/);
  const firstName = nameParts[0] || '';
  const lastName  = nameParts.slice(1).join(' ') || '';

  try {
    const { data } = await axios.put(
      `${API_URL}/update/${admin.id}`,
      { firstName, lastName, companyName: editData.value.companyName },
      getAuthHeader()
    );
    const index = admins.value.findIndex((a) => a.id === admin.id);
    if (index !== -1) admins.value[index] = { ...admins.value[index], ...data.admin };
    cancelEdit();
  } catch (error) {
    console.error('Failed to update admin:', error);
    alert('อัปเดตข้อมูลล้มเหลว');
  }
}

async function toggleStatus(admin) {
  if (admin.status === 'PENDING') return;
  const newStatus = admin.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
  if (!confirm(`ต้องการ${newStatus === 'INACTIVE' ? 'ปิด' : 'เปิด'}บัญชี ${admin.email}?`)) return;

  try {
    await axios.put(`${API_URL}/status/${admin.id}`, { status: newStatus }, getAuthHeader());
    admin.status = newStatus;
  } catch (error) {
    console.error('Failed to toggle status:', error);
  }
}

async function deleteAdmin(admin) {
  if (!confirm(`ต้องการลบ ${admin.email}?`)) return;
  try {
    await axios.delete(`${API_URL}/delete/${admin.id}`, getAuthHeader());
    admins.value = admins.value.filter((a) => a.id !== admin.id);
  } catch (error) {
    console.error('Failed to remove admin:', error);
  }
}

function getStatusClass(status) {
  switch (status) {
    case 'ACTIVE':   return 'bg-green-100 text-green-800 border-green-200';
    case 'INACTIVE': return 'bg-red-100 text-red-800 border-red-200';
    case 'PENDING':  return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:         return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

function getStatusText(status) {
  switch (status) {
    case 'ACTIVE':   return 'ยืนยันตัวตนแล้ว';
    case 'INACTIVE': return 'ปิดใช้งาน';
    case 'PENDING':  return 'ยังไม่ยืนยันตัวตน';
    default:         return 'ไม่ทราบสถานะ';
  }
}

// ─── Computed ─────────────────────────────────────────────────────────────────
const filteredAdmins = computed(() => {
  return admins.value.filter((admin) => {
    const keyword = search.value.toLowerCase();
    const name    = formatName(admin.firstName, admin.lastName).toLowerCase();
    const email   = admin.email.toLowerCase();
    const company = (admin.companyName || '').toLowerCase();

    const matchesSearch  = name.includes(keyword) || email.includes(keyword) || company.includes(keyword);
    const matchesCompany = !selectedCompany.value || admin.companyName === selectedCompany.value;

    return matchesSearch && matchesCompany;
  });
});

const uniqueCompanies = computed(() => {
  const companies = [...new Set(admins.value.map((a) => a.companyName).filter(Boolean))];
  return companies.sort();
});
</script>

<style scoped>
/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .bg-white {
  transform: scale(0.96) translateY(-8px);
}
.modal-leave-to .bg-white {
  transform: scale(0.96) translateY(-8px);
  opacity: 0;
}

/* Fade for result box */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Spin animation for loading icon */
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
</style>