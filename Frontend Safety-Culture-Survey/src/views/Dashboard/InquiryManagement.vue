<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar/Sidebar -->
    <NavbarDashboard />
    
    <!-- Main Content with margin-left to avoid sidebar overlap -->
    <div class="ml-64 p-6">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">ข้อความติดต่อสอบถาม</h1>
        <p class="text-gray-600">ดูข้อความติดต่อสอบถามจากผู้ประเมิน</p>
      </div>

      <!-- Filter & Search -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Year Filter -->
          <div>
            <label for="year-filter" class="block text-sm font-semibold text-gray-700 mb-2">ปี</label>
            <select 
              id="year-filter"
              v-model="selectedYear"
              @change="applyFilters"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7ae2cf] focus:border-transparent"
            >
              <option value="">ทั้งหมด</option>
              <option v-for="year in yearOptions" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>

          <!-- Month Filter -->
          <div>
            <label for="month-filter" class="block text-sm font-semibold text-gray-700 mb-2">เดือน</label>
            <select 
              id="month-filter"
              v-model="selectedMonth"
              @change="applyFilters"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7ae2cf] focus:border-transparent"
            >
              <option value="">ทั้งหมด</option>
              <option v-for="month in monthOptions" :key="month.value" :value="month.value">
                {{ month.text }}
              </option>
            </select>
          </div>

          <!-- Company Filter -->
          <div>
            <label for="company-filter" class="block text-sm font-semibold text-gray-700 mb-2">บริษัท</label>
            <select 
              id="company-filter"
              v-model="selectedCompany"
              @change="applyFilters"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7ae2cf] focus:border-transparent"
              :disabled="isCompaniesLoading"
            >
              <option value="">ทั้งหมด</option>
              <option v-for="company in companies" :key="company" :value="company">
                {{ company }}
              </option>
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
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">การกระทำ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="inquiry in inquiries" :key="inquiry.id" class="border-b hover:bg-gray-50">
                <td class="px-6 py-3 text-sm text-gray-700 whitespace-nowrap">
                  {{ formatDate(inquiry.createdAt) }}
                </td>
                <td class="px-6 py-3 text-sm font-medium text-gray-800 max-w-[10rem] truncate" :title="inquiry.name">{{ inquiry.name }}</td>
                <td class="px-6 py-3 text-sm text-gray-600 max-w-[12rem] truncate" :title="inquiry.email">{{ inquiry.email }}</td>
                <td class="px-6 py-3 text-sm text-gray-600">{{ inquiry.phone }}</td>
                <td class="px-6 py-3 text-sm text-gray-600 max-w-xs truncate" :title="inquiry.message">{{ inquiry.message }}</td>
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
            แสดง {{ inquiries.length }} รายการ | หน้า {{ currentPage }} จากทั้งหมด {{ totalPages }}
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
        <p class="text-gray-600 text-lg">ไม่มีติดต่อสอบถามที่ตรงกับเงื่อนไข</p>
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
          </div>

          <!-- Message -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">ข้อความ</label>
            <div class="bg-gray-50 p-4 rounded text-gray-800 whitespace-pre-wrap break-words">
              {{ selectedInquiry.message }}
            </div>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { API_BASE_URL } from "../../config/api";
import NavbarDashboard from '../../components/NavbarDashboard.vue';

// Data
const inquiries = ref([]);
const selectedInquiry = ref(null);
const showModal = ref(false);

// States
const isLoading = ref(true);
const error = ref("");
const isCompaniesLoading = ref(true);

// Pagination & Filtering
const currentPage = ref(1);
const itemsPerPage = ref(10); // Still used for API request limit
const totalPages = ref(1);
const selectedYear = ref("");
const selectedMonth = ref("");
const selectedCompany = ref("");
const companies = ref([]);

/**
 * Generate year options for the last 5 years
 */
const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i < 5; i++) {
    years.push(currentYear - i);
  }
  return years;
});

/**
 * Month options
 */
const monthOptions = ref([
  { value: 1, text: 'มกราคม' },
  { value: 2, text: 'กุมภาพันธ์' },
  { value: 3, text: 'มีนาคม' },
  { value: 4, text: 'เมษายน' },
  { value: 5, text: 'พฤษภาคม' },
  { value: 6, text: 'มิถุนายน' },
  { value: 7, text: 'กรกฎาคม' },
  { value: 8, text: 'สิงหาคม' },
  { value: 9, text: 'กันยายน' },
  { value: 10, text: 'ตุลาคม' },
  { value: 11, text: 'พฤศจิกายน' },
  { value: 12, text: 'ธันวาคม' },
]);


/**
 * Fetch distinct company names
 */
const fetchCompanies = async () => {
  isCompaniesLoading.value = true;
  try {
    const response = await fetch(`${API_BASE_URL}/api/companies`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch companies');
    }
    const data = await response.json();
    companies.value = data; // Assuming the endpoint returns an array of strings
  } catch (err) {
    console.error("Error fetching companies:", err);
    companies.value = []; // Reset on error
  } finally {
    isCompaniesLoading.value = false;
  }
};


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

    let yearToFilter = selectedYear.value;
    // If a month is selected but a year is not, default to the current year.
    if (selectedMonth.value && !selectedYear.value) {
      yearToFilter = new Date().getFullYear();
    }

    if (yearToFilter) {
      url.searchParams.append("year", yearToFilter);
    }
    if (selectedMonth.value) {
      url.searchParams.append("month", selectedMonth.value);
    }
    if (selectedCompany.value) {
      url.searchParams.append("company", selectedCompany.value);
    }

    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch inquiries");
    }

    inquiries.value = data.data;
    totalPages.value = data.pagination.totalPages;
  } catch (err) {
    console.error("Error fetching inquiries:", err);
    error.value = "ไม่สามารถดึงข้อมูลติดต่อสอบถาม";
  } finally {
    isLoading.value = false;
  }
};

/**
 * Apply filters and reset pagination
 */
const applyFilters = () => {
  currentPage.value = 1;
  fetchInquiries();
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

// Load data on component mount
onMounted(() => {
  fetchCompanies();
  fetchInquiries();
});
</script>