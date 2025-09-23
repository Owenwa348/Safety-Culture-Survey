<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-6">
      <h4 class="text-lg font-medium text-gray-900">จัดการสายงาน</h4>
      <button
        @click="showAddForm = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        + เพิ่มสายงานใหม่
      </button>
    </div>

    <!-- Add Form -->
    <div v-if="showAddForm" class="mb-6 p-4 bg-gray-50 rounded-lg border">
      <h5 class="font-medium text-gray-900 mb-3">เพิ่มสายงานใหม่</h5>
      <div class="flex gap-3">
        <input
          v-model="newDepartment"
          type="text"
          placeholder="กรอกชื่อสายงาน"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="addDepartment"
        />
        <button
          @click="addDepartment"
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
      <h5 class="font-medium text-gray-900 mb-3">แก้ไขสายงาน</h5>
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

    <!-- Departments List -->
    <div class="space-y-3">
      <div
        v-for="(department, index) in departments"
        :key="index"
        class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
      >
        <span class="text-gray-900">{{ department }}</span>
        <div class="flex gap-2">
          <button
            @click="startEdit(index)"
            class="text-blue-600 hover:text-blue-800 px-3 py-1 text-sm font-medium"
          >
            แก้ไข
          </button>
          <button
            @click="deleteDepartment(index)"
            class="text-red-600 hover:text-red-800 px-3 py-1 text-sm font-medium"
          >
            ลบ
          </button>
        </div>
      </div>
      
      <div v-if="departments.length === 0" class="text-center py-8 text-gray-500">
        ไม่มีข้อมูลสายงาน
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const departments = reactive([
  'CEO',
  'REP',
  'COO',
  'CFO',
  'SSE',
  'PSE',
  'CME'
])

const newDepartment = ref('')
const showAddForm = ref(false)
const editingIndex = ref(-1)
const editingText = ref('')

const addDepartment = () => {
  if (newDepartment.value.trim()) {
    departments.push(newDepartment.value.trim())
    newDepartment.value = ''
    showAddForm.value = false
  }
}

const cancelAdd = () => {
  newDepartment.value = ''
  showAddForm.value = false
}

const startEdit = (index) => {
  editingIndex.value = index
  editingText.value = departments[index]
}

const saveEdit = () => {
  if (editingText.value.trim()) {
    departments[editingIndex.value] = editingText.value.trim()
    editingIndex.value = -1
    editingText.value = ''
  }
}

const cancelEdit = () => {
  editingIndex.value = -1
  editingText.value = ''
}

const deleteDepartment = (index) => {
  if (confirm('คุณต้องการลบสายงานนี้หรือไม่?')) {
    departments.splice(index, 1)
  }
}
</script>