<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-6">
      <h4 class="text-lg font-medium text-gray-900">จัดการประสบการณ์การทำงาน</h4>
      <button
        @click="showAddForm = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        + เพิ่มช่วงประสบการณ์ใหม่
      </button>
    </div>

    <!-- Add Form -->
    <div v-if="showAddForm" class="mb-6 p-4 bg-gray-50 rounded-lg border">
      <h5 class="font-medium text-gray-900 mb-3">เพิ่มช่วงประสบการณ์ใหม่</h5>
      <div class="flex gap-3">
        <input
          v-model="newExperience"
          type="text"
          placeholder="กรอกช่วงประสบการณ์การทำงาน"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="addExperience"
        />
        <button
          @click="addExperience"
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
      <h5 class="font-medium text-gray-900 mb-3">แก้ไขช่วงประสบการณ์</h5>
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

    <!-- Experience List -->
    <div class="space-y-3">
      <div
        v-for="(experience, index) in experiences"
        :key="index"
        class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
      >
        <span class="text-gray-900">{{ experience }}</span>
        <div class="flex gap-2">
          <button
            @click="startEdit(index)"
            class="text-blue-600 hover:text-blue-800 px-3 py-1 text-sm font-medium"
          >
            แก้ไข
          </button>
          <button
            @click="deleteExperience(index)"
            class="text-red-600 hover:text-red-800 px-3 py-1 text-sm font-medium"
          >
            ลบ
          </button>
        </div>
      </div>
      
      <div v-if="experiences.length === 0" class="text-center py-8 text-gray-500">
        ไม่มีข้อมูลประสบการณ์การทำงาน
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const experiences = reactive([
  '0-3 ปี',
  '3 ปีขึ้นไป แต่ไม่เกิน 5 ปี',
  '5 ปีขึ้นไป แต่ไม่เกิน 10 ปี',
  '10 ปีขึ้นไป แต่ไม่เกิน 15 ปี',
  'มากกว่า 15 ปีขึ้นไป'
])

const newExperience = ref('')
const showAddForm = ref(false)
const editingIndex = ref(-1)
const editingText = ref('')

const addExperience = () => {
  if (newExperience.value.trim()) {
    experiences.push(newExperience.value.trim())
    newExperience.value = ''
    showAddForm.value = false
  }
}

const cancelAdd = () => {
  newExperience.value = ''
  showAddForm.value = false
}

const startEdit = (index) => {
  editingIndex.value = index
  editingText.value = experiences[index]
}

const saveEdit = () => {
  if (editingText.value.trim()) {
    experiences[editingIndex.value] = editingText.value.trim()
    editingIndex.value = -1
    editingText.value = ''
  }
}

const cancelEdit = () => {
  editingIndex.value = -1
  editingText.value = ''
}

const deleteExperience = (index) => {
  if (confirm('คุณต้องการลบช่วงประสบการณ์นี้หรือไม่?')) {
    experiences.splice(index, 1)
  }
}
</script>