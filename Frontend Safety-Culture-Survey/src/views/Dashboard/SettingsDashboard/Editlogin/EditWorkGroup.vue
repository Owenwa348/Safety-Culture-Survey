<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
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
    <div v-if="editingIndex !== -1" class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
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
        v-for="(workGroup, index) in workGroups"
        :key="index"
        class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
      >
        <span class="text-gray-900">{{ workGroup }}</span>
        <div class="flex gap-2">
          <button
            @click="startEdit(index)"
            class="text-blue-600 hover:text-blue-800 px-3 py-1 text-sm font-medium"
          >
            แก้ไข
          </button>
          <button
            @click="deleteWorkGroup(index)"
            class="text-red-600 hover:text-red-800 px-3 py-1 text-sm font-medium"
          >
            ลบ
          </button>
        </div>
      </div>
      
      <div v-if="workGroups.length === 0" class="text-center py-8 text-gray-500">
        ไม่มีข้อมูลกลุ่มงาน
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const workGroups = reactive([
  'หน่วยงานเดินเครื่อง',
  'หน่วยงานบำรุงรักษา',
  'หน่วยงานวิศวกรรม',
  'หน่วยงานสนับสนุน'
])

const newWorkGroup = ref('')
const showAddForm = ref(false)
const editingIndex = ref(-1)
const editingText = ref('')

const addWorkGroup = () => {
  if (newWorkGroup.value.trim()) {
    workGroups.push(newWorkGroup.value.trim())
    newWorkGroup.value = ''
    showAddForm.value = false
  }
}

const cancelAdd = () => {
  newWorkGroup.value = ''
  showAddForm.value = false
}

const startEdit = (index) => {
  editingIndex.value = index
  editingText.value = workGroups[index]
}

const saveEdit = () => {
  if (editingText.value.trim()) {
    workGroups[editingIndex.value] = editingText.value.trim()
    editingIndex.value = -1
    editingText.value = ''
  }
}

const cancelEdit = () => {
  editingIndex.value = -1
  editingText.value = ''
}

const deleteWorkGroup = (index) => {
  if (confirm('คุณต้องการลบกลุ่มงานนี้หรือไม่?')) {
    workGroups.splice(index, 1)
  }
}
</script>