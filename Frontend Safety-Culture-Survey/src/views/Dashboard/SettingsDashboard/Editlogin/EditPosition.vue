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

    <!-- Positions List -->
    <div class="space-y-3">
      <div
        v-for="(position, index) in positions"
        :key="index"
        class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
      >
        <span class="text-gray-900">{{ position }}</span>
        <div class="flex gap-2">
          <button
            @click="startEdit(index)"
            class="text-blue-600 hover:text-blue-800 px-3 py-1 text-sm font-medium"
          >
            แก้ไข
          </button>
          <button
            @click="deletePosition(index)"
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
import { ref, reactive } from 'vue'

const positions = reactive([
  'ผู้บริหารระดับสูง / ผู้จัดการส่วน',
  'ผู้จัดการแผนก / ผู้จัดการ / พนักงานอาวุโส',
  'พนักงาน',
  'ผู้รับเหมาประจำ'
])

const newPosition = ref('')
const showAddForm = ref(false)
const editingIndex = ref(-1)
const editingText = ref('')

const addPosition = () => {
  if (newPosition.value.trim()) {
    positions.push(newPosition.value.trim())
    newPosition.value = ''
    showAddForm.value = false
  }
}

const cancelAdd = () => {
  newPosition.value = ''
  showAddForm.value = false
}

const startEdit = (index) => {
  editingIndex.value = index
  editingText.value = positions[index]
}

const saveEdit = () => {
  if (editingText.value.trim()) {
    positions[editingIndex.value] = editingText.value.trim()
    editingIndex.value = -1
    editingText.value = ''
  }
}

const cancelEdit = () => {
  editingIndex.value = -1
  editingText.value = ''
}

const deletePosition = (index) => {
  if (confirm('คุณต้องการลบตำแหน่งงานนี้หรือไม่?')) {
    positions.splice(index, 1)
  }
}
</script>