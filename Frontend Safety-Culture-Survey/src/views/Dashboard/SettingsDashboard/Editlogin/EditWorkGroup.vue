<!-- Edit Work Group.vue -->
<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h4 class="text-lg font-medium text-gray-900">จัดการกลุ่มงาน</h4>
      <button
        @click="showAddForm = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        + เพิ่มกลุ่มงานใหม่
      </button>
    </div>

    <!-- Add Form -->
    <div v-if="showAddForm" class="mb-6 p-4 bg-gray-50 rounded-lg border">
      <h5 class="font-medium text-gray-900 mb-3">เพิ่มกลุ่มงานใหม่</h5>
      <div class="flex gap-3">
        <input
          v-model="newWorkGroup"
          type="text"
          placeholder="กรอกชื่อกลุ่มงาน"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="addWorkGroup"
        />
        <button
          @click="addWorkGroup"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          เพิ่ม
        </button>
        <button
          @click="cancelAdd"
          class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          ยกเลิก
        </button>
      </div>
    </div>

    <!-- Edit Form -->
    <div
      v-if="editingItem"
      class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
    >
      <h5 class="font-medium text-gray-900 mb-3">แก้ไขกลุ่มงาน</h5>
      <div class="flex gap-3">
        <input
          v-model="editingText"
          type="text"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="saveEdit"
        />
        <button
          @click="saveEdit"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          บันทึก
        </button>
        <button
          @click="cancelEdit"
          class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          ยกเลิก
        </button>
      </div>
    </div>

    <!-- Work Groups List -->
    <div class="space-y-3">
      <div
        v-for="workGroup in workGroups"
        :key="workGroup.id"
        class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
      >
        <span class="text-gray-900">{{ workGroup.name }}</span>
        <div class="flex gap-2">
          <button
            @click="startEdit(workGroup)"
            class="text-blue-600 hover:text-blue-800 px-3 py-1 text-sm font-medium"
          >
            แก้ไข
          </button>
          <button
            @click="deleteWorkGroup(workGroup.id)"
            class="text-red-600 hover:text-red-800 px-3 py-1 text-sm font-medium"
          >
            ลบ
          </button>
        </div>
      </div>

      <div
        v-if="workGroups.length === 0"
        class="text-center py-8 text-gray-500"
      >
        ไม่มีข้อมูลกลุ่มงาน
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// API base URL
const API_URL = '/api/workgroups' // 🔧 เปลี่ยนตาม backend ของคุณ

const workGroups = ref([])
const showAddForm = ref(false)
const newWorkGroup = ref('')
const editingItem = ref(null)
const editingText = ref('')

// ✅ โหลดข้อมูลจาก backend
const fetchWorkGroups = async () => {
  try {
    const res = await axios.get(API_URL)
    workGroups.value = res.data
  } catch (err) {
    console.error('fetchWorkGroups error:', err)
    alert('เกิดข้อผิดพลาดในการโหลดข้อมูล')
  }
}

// ✅ เพิ่มกลุ่มงาน
const addWorkGroup = async () => {
  if (!newWorkGroup.value.trim()) return
  try {
    await axios.post(API_URL, { name: newWorkGroup.value.trim() })
    newWorkGroup.value = ''
    showAddForm.value = false
    await fetchWorkGroups()
  } catch (err) {
    console.error('addWorkGroup error:', err)
    alert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล')
  }
}

// ✅ เริ่มแก้ไข
const startEdit = (item) => {
  editingItem.value = item
  editingText.value = item.name
}

// ✅ บันทึกการแก้ไข
const saveEdit = async () => {
  if (!editingItem.value || !editingText.value.trim()) return
  try {
    await axios.put(`${API_URL}/${editingItem.value.id}`, {
      name: editingText.value.trim(),
    })
    editingItem.value = null
    editingText.value = ''
    await fetchWorkGroups()
  } catch (err) {
    console.error('saveEdit error:', err)
    alert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการแก้ไข')
  }
}

// ✅ ยกเลิกแก้ไข
const cancelEdit = () => {
  editingItem.value = null
  editingText.value = ''
}

// ✅ ยกเลิกเพิ่ม
const cancelAdd = () => {
  showAddForm.value = false
  newWorkGroup.value = ''
}

// ✅ ลบกลุ่มงาน
const deleteWorkGroup = async (id) => {
  if (!confirm('คุณต้องการลบกลุ่มงานนี้หรือไม่?')) return
  try {
    await axios.delete(`${API_URL}/${id}`)
    await fetchWorkGroups()
  } catch (err) {
    console.error('deleteWorkGroup error:', err)
    alert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการลบข้อมูล')
  }
}

onMounted(fetchWorkGroups)
</script>
