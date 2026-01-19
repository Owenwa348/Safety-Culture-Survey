<!-- EditPosition.vue -->
<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-6">
      <h4 class="text-lg font-medium text-gray-900">จัดการตำแหน่งงาน</h4>
      <button
        @click="showAddForm = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        + เพิ่มตำแหน่งใหม่
      </button>
    </div>

    <!-- Add Form -->
    <div v-if="showAddForm" class="mb-6 p-4 bg-gray-50 rounded-lg border">
      <h5 class="font-medium text-gray-900 mb-3">เพิ่มตำแหน่งงานใหม่</h5>
      <div class="flex gap-3">
        <input
          v-model="newPosition"
          type="text"
          placeholder="กรอกชื่อตำแหน่งงาน"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="addPosition"
        />
        <button
          @click="addPosition"
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
    <div v-if="editingIndex !== -1" class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h5 class="font-medium text-gray-900 mb-3">แก้ไขตำแหน่งงาน</h5>
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

    <!-- Position List -->
    <div class="space-y-3">
      <div
        v-for="(position, index) in positions"
        :key="position.id"
        class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
      >
        <span class="text-gray-900">{{ position.name }}</span>
        <div class="flex gap-2">
          <button
            @click="startEdit(index)"
            class="text-blue-600 hover:text-blue-800 px-3 py-1 text-sm font-medium"
          >
            แก้ไข
          </button>
          <button
            @click="deletePosition(position.id)"
            class="text-red-600 hover:text-red-800 px-3 py-1 text-sm font-medium"
          >
            ลบ
          </button>
        </div>
      </div>

      <div v-if="positions.length === 0" class="text-center py-8 text-gray-500">
        ไม่มีข้อมูลตำแหน่งงาน
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// 🔹 เปลี่ยน URL ให้ตรงกับ backend ของคุณ เช่น /api/positions
const API_URL = '/api/positions'

const positions = ref([])
const newPosition = ref('')
const showAddForm = ref(false)
const editingIndex = ref(-1)
const editingText = ref('')

// โหลดข้อมูลจาก backend
const fetchPositions = async () => {
  try {
    const res = await axios.get(API_URL)
    positions.value = res.data
  } catch (err) {
    console.error('fetchPositions error:', err)
    alert('ไม่สามารถโหลดข้อมูลตำแหน่งได้')
  }
}

// เพิ่มตำแหน่ง
const addPosition = async () => {
  if (!newPosition.value.trim()) return
  try {
    const res = await axios.post(API_URL, { name: newPosition.value })
    positions.value.push(res.data)
    newPosition.value = ''
    showAddForm.value = false
  } catch (err) {
    console.error('addPosition error:', err)
    alert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการเพิ่ม')
  }
}

const cancelAdd = () => {
  newPosition.value = ''
  showAddForm.value = false
}

// เริ่มแก้ไข
const startEdit = (index) => {
  editingIndex.value = index
  editingText.value = positions.value[index].name
}

// บันทึกการแก้ไข
const saveEdit = async () => {
  const pos = positions.value[editingIndex.value]
  if (!editingText.value.trim()) return
  try {
    const res = await axios.put(`${API_URL}/${pos.id}`, { name: editingText.value })
    positions.value[editingIndex.value] = res.data
    editingIndex.value = -1
    editingText.value = ''
  } catch (err) {
    console.error('saveEdit error:', err)
    alert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการแก้ไข')
  }
}

const cancelEdit = () => {
  editingIndex.value = -1
  editingText.value = ''
}

// ลบตำแหน่ง
const deletePosition = async (id) => {
  if (!confirm('คุณต้องการลบตำแหน่งนี้หรือไม่?')) return
  try {
    await axios.delete(`${API_URL}/${id}`)
    positions.value = positions.value.filter((p) => p.id !== id)
  } catch (err) {
    console.error('deletePosition error:', err)
    alert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการลบ')
  }
}

// โหลดข้อมูลตอนเปิดหน้า
onMounted(fetchPositions)
</script>
