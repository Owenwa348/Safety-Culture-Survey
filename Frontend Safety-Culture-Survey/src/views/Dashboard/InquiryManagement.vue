<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar/Sidebar -->
    <NavbarDashboard />
    
    <!-- Main Content with margin-left to avoid sidebar overlap -->
    <div class="ml-64 p-6">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">จัดการติดต่อสอบถาม</h1>
        <p class="text-gray-600">ดูและตอบกลับติดต่อสอบถามจากผู้ประเมิน</p>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div class="text-sm text-gray-600 mb-2">ยังไม่ได้อ่าน</div>
          <div class="text-3xl font-bold text-red-600">{{ stats.unread }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div class="text-sm text-gray-600 mb-2">อ่านแล้ว</div>
          <div class="text-3xl font-bold text-yellow-600">{{ stats.read }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div class="text-sm text-gray-600 mb-2">แก้ไขแล้ว</div>
          <div class="text-3xl font-bold text-green-600">{{ stats.resolved }}</div>
        </div>
        <div class="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div class="text-sm text-gray-600 mb-2">ทั้งหมด</div>
          <div class="text-3xl font-bold text-blue-600">{{ stats.total }}</div>
        </div>
      </div>

      <!-- Filter & Search -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Filter by Status -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">กรองตามสถานะ</label>
            <select 
              v-model="filterStatus"
              @change="fetchInquiries()"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7ae2cf] focus:border-transparent"
            >
              <option value="">ทั้งหมด</option>
              <option value="UNREAD">ยังไม่ได้อ่าน</option>
              <option value="READ">อ่านแล้ว</option>
              <option value="RESOLVED">แก้ไขแล้ว</option>
            </select>
          </div>

          <!-- Pagination -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">จำนวนรายการต่อหน้า</label>
            <select 
              v-model.number="itemsPerPage"
              @change="fetchInquiries()"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7ae2cf] focus:border-transparent"
            >
              <option value="10">10 รายการ</option>
              <option value="20">20 รายการ</option>
              <option value="50">50 รายการ</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading & Error States -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block">
          <svg class="animate-spin h-12 w-12 text-[#7ae2cf]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {{ error }}
      </div>

      <!-- Inquiries Table -->
      <div v-else-if="inquiries.length > 0" class="bg-white rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-100 border-b">
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">วันที่</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">ชื่อ</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">อีเมล</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">เบอร์โทร</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">ข้อความ</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">สถานะ</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">การกระทำ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="inquiry in inquiries" :key="inquiry.id" class="border-b hover:bg-gray-50">
                <td class="px-6 py-3 text-sm text-gray-700 whitespace-nowrap">
                  {{ formatDate(inquiry.createdAt) }}
                </td>
                <td class="px-6 py-3 text-sm font-medium text-gray-800">{{ inquiry.name }}</td>
                <td class="px-6 py-3 text-sm text-gray-600">{{ inquiry.email }}</td>
                <td class="px-6 py-3 text-sm text-gray-600">{{ inquiry.phone }}</td>
                <td class="px-6 py-3 text-sm text-gray-600 max-w-xs truncate">{{ inquiry.message }}</td>
                <td class="px-6 py-3">
                  <span :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap',
                    {
                      'bg-red-100 text-red-700': inquiry.status === 'UNREAD',
                      'bg-yellow-100 text-yellow-700': inquiry.status === 'READ',
                      'bg-green-100 text-green-700': inquiry.status === 'RESOLVED'
                    }
                  ]">
                    {{ getStatusLabel(inquiry.status) }}
                  </span>
                </td>
                <td class="px-6 py-3 text-sm">
                  <div class="flex space-x-2">
                    <button
                      @click="openModal(inquiry)"
                      class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    >
                      ดู
                    </button>
                    <button
                      @click="deleteInquiry(inquiry.id)"
                      class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      ลบ
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Controls -->
        <div class="flex flex-col sm:flex-row justify-between items-center p-6 bg-gray-50 border-t gap-4">
          <div class="text-sm text-gray-600">
            หน้า {{ currentPage }} จากทั้งหมด {{ totalPages }}
          </div>
          <div class="flex space-x-2">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ก่อนหน้า
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>

      <!-- No Data -->
      <div v-else class="bg-white rounded-lg shadow p-12 text-center">
        <p class="text-gray-600 text-lg">ไม่มีติดต่อสอบถาม</p>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="selectedInquiry && showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="bg-[#7ae2cf] text-black px-6 py-4 flex justify-between items-center sticky top-0 z-10">
          <h2 class="text-xl font-bold">รายละเอียดติดต่อสอบถาม</h2>
          <button
            @click="closeModal"
            class="text-2xl font-bold hover:opacity-70 transition"
          >
            ✕
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 space-y-4">
          <!-- Information -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">ชื่อ - นามสกุล</label>
            <p class="text-gray-800">{{ selectedInquiry.name }}</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">อีเมล</label>
              <p class="text-gray-800 break-all">{{ selectedInquiry.email }}</p>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">เบอร์โทร</label>
              <p class="text-gray-800">{{ selectedInquiry.phone }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">วันที่ส่ง</label>
              <p class="text-gray-800">{{ formatDateTime(selectedInquiry.createdAt) }}</p>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">สถานะ</label>
              <span :class="[
                'inline-block px-3 py-1 rounded-full text-xs font-semibold',
                {
                  'bg-red-100 text-red-700': selectedInquiry.status === 'UNREAD',
                  'bg-yellow-100 text-yellow-700': selectedInquiry.status === 'READ',
                  'bg-green-100 text-green-700': selectedInquiry.status === 'RESOLVED'
                }
              ]">
                {{ getStatusLabel(selectedInquiry.status) }}
              </span>
            </div>
          </div>

          <!-- Message -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">ข้อความ</label>
            <div class="bg-gray-50 p-4 rounded text-gray-800 whitespace-pre-wrap">
              {{ selectedInquiry.message }}
            </div>
          </div>

          <!-- Reply Section -->
          <div v-if="selectedInquiry.reply" class="bg-green-50 border border-green-200 rounded p-4">
            <label class="block text-sm font-semibold text-gray-700 mb-2">การตอบกลับ</label>
            <div class="text-gray-800 whitespace-pre-wrap">
              {{ selectedInquiry.reply }}
            </div>
          </div>

          <!-- Reply Form -->
          <div v-else>
            <label class="block text-sm font-semibold text-gray-700 mb-2">ตอบกลับ</label>
            <textarea
              v-model="replyText"
              rows="4"
              class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7ae2cf] focus:border-transparent"
              placeholder="กรุณาระบุข้อความตอบกลับ..."
              :disabled="isReplying"
            ></textarea>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 border-t sticky bottom-0">
          <button
            @click="closeModal"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
          >
            ปิด
          </button>
          <button
            v-if="!selectedInquiry.reply && replyText"
            @click="submitReply"
            :disabled="isReplying"
            class="px-4 py-2 bg-[#7ae2cf] text-black rounded hover:bg-[#62CFC0] transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            <span v-if="!isReplying">ส่งการตอบกลับ</span>
            <span v-else>กำลังส่ง...</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { API_BASE_URL } from "../../config/api";
import NavbarDashboard from '../../components/NavbarDashboard.vue';

// Data
const inquiries = ref([]);
const selectedInquiry = ref(null);
const showModal = ref(false);
const replyText = ref("");

// States
const isLoading = ref(true);
const isReplying = ref(false);
const error = ref("");

// Pagination & Filtering
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalPages = ref(1);
const filterStatus = ref("");

// Statistics
const stats = ref({
  unread: 0,
  read: 0,
  resolved: 0,
  total: 0,
});

/**
 * ดึงข้อมูลติดต่อสอบถาม
 */
const fetchInquiries = async () => {
  isLoading.value = true;
  error.value = "";

  try {
    const url = new URL(`${API_BASE_URL}/api/inquiry/list`);
    url.searchParams.append("page", currentPage.value);
    url.searchParams.append("limit", itemsPerPage.value);
    if (filterStatus.value) {
      url.searchParams.append("status", filterStatus.value);
    }

    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch inquiries");
    }

    inquiries.value = data.data;
    totalPages.value = data.pagination.totalPages;
    fetchStats();
  } catch (err) {
    console.error("Error fetching inquiries:", err);
    error.value = "ไม่สามารถดึงข้อมูลติดต่อสอบถาม";
  } finally {
    isLoading.value = false;
  }
};

/**
 * ดึงสถิติติดต่อสอบถาม
 */
const fetchStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/inquiry/stats/summary`);
    const data = await response.json();

    if (response.ok) {
      stats.value = data.data;
    }
  } catch (err) {
    console.error("Error fetching stats:", err);
  }
};

/**
 * เปิด Modal พร้อมดึงข้อมูลรายละเอียด
 */
const openModal = async (inquiry) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/inquiry/${inquiry.id}`);
    const data = await response.json();

    if (response.ok) {
      selectedInquiry.value = data.data;
      showModal.value = true;
      replyText.value = "";
    }
  } catch (err) {
    console.error("Error fetching inquiry details:", err);
    error.value = "ไม่สามารถดึงข้อมูลรายละเอียด";
  }
};

/**
 * ปิด Modal
 */
const closeModal = () => {
  showModal.value = false;
  selectedInquiry.value = null;
  replyText.value = "";
};

/**
 * ส่งการตอบกลับ
 */
const submitReply = async () => {
  if (!replyText.value.trim()) {
    error.value = "กรุณาระบุข้อความตอบกลับ";
    return;
  }

  isReplying.value = true;

  try {
    const response = await fetch(`${API_BASE_URL}/api/inquiry/${selectedInquiry.value.id}/reply`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reply: replyText.value.trim(),
        status: "RESOLVED",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to submit reply");
    }

    // Update the selected inquiry
    selectedInquiry.value = data.data;
    replyText.value = "";

    // Refresh the list
    fetchInquiries();
  } catch (err) {
    console.error("Error submitting reply:", err);
    error.value = "ไม่สามารถส่งการตอบกลับ";
  } finally {
    isReplying.value = false;
  }
};

/**
 * ลบติดต่อสอบถาม
 */
const deleteInquiry = async (id) => {
  if (!confirm("คุณแน่ใจหรือว่าต้องการลบติดต่อสอบถามนี้?")) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/inquiry/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete inquiry");
    }

    // Refresh the list
    fetchInquiries();
    closeModal();
  } catch (err) {
    console.error("Error deleting inquiry:", err);
    error.value = "ไม่สามารถลบติดต่อสอบถาม";
  }
};

/**
 * ไปหน้าถัดไป
 */
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchInquiries();
  }
};

/**
 * ไปหน้าก่อนหน้า
 */
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchInquiries();
  }
};

/**
 * จัดรูปแบบวันที่
 */
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * จัดรูปแบบวันที่และเวลา
 */
const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * ดึงป้ายกำกับสถานะ
 */
const getStatusLabel = (status) => {
  const labels = {
    UNREAD: "ยังไม่ได้อ่าน",
    READ: "อ่านแล้ว",
    RESOLVED: "แก้ไขแล้ว",
  };
  return labels[status] || status;
};

// Load data on component mount
onMounted(() => {
  fetchInquiries();
});
</script>