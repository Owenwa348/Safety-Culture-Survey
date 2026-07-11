<!-- EditExperience.vue -->
<template>
  <div class="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">
      <h4 class="text-base sm:text-lg font-medium text-gray-900">จัดการประสบการณ์การทำงาน</h4>
      <button @click="showAddForm = true"
        class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 sm:py-2 rounded-lg text-sm font-medium transition-colors">
        + เพิ่มช่วงประสบการณ์ใหม่
      </button>
    </div>

    <!-- Add Form -->
    <div v-if="showAddForm" class="mb-5 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg border">
      <h5 class="font-medium text-gray-900 mb-2 text-sm sm:text-base">เพิ่มช่วงประสบการณ์ใหม่</h5>
      <p class="text-xs text-blue-600 mb-3">จะเพิ่มให้ทุกบริษัทในกลุ่ม ({{ companyIds.length }} บริษัท)</p>
      <div class="flex flex-col sm:flex-row gap-3">
        <input v-model="newExperience" type="text" placeholder="กรอกช่วงประสบการณ์การทำงาน"
          class="flex-1 min-w-0 px-3 py-2.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="addExperience" />
        <div class="flex gap-3">
          <button @click="addExperience"
            class="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 sm:py-2 rounded-lg text-sm font-medium">เพิ่ม</button>
          <button @click="cancelAdd"
            class="flex-1 sm:flex-none bg-gray-500 hover:bg-gray-600 text-white px-4 py-2.5 sm:py-2 rounded-lg text-sm font-medium">ยกเลิก</button>
        </div>
      </div>
    </div>

    <!-- Edit Form -->
    <div v-if="editingIndex !== -1" class="mb-5 sm:mb-6 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h5 class="font-medium text-gray-900 mb-3 text-sm sm:text-base">แก้ไขช่วงประสบการณ์</h5>
      <div class="flex flex-col sm:flex-row gap-3">
        <input v-model="editingText" type="text"
          class="flex-1 min-w-0 px-3 py-2.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="saveEdit" />
        <div class="flex gap-3">
          <button @click="saveEdit"
            class="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 sm:py-2 rounded-lg text-sm font-medium">บันทึก</button>
          <button @click="cancelEdit"
            class="flex-1 sm:flex-none bg-gray-500 hover:bg-gray-600 text-white px-4 py-2.5 sm:py-2 rounded-lg text-sm font-medium">ยกเลิก</button>
        </div>
      </div>
    </div>

    <!-- List -->
    <div class="space-y-2 sm:space-y-3">
      <div v-for="(exp, index) in experiences" :key="exp.id"
        class="flex items-center justify-between gap-2 p-3 sm:p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
        <span class="text-sm sm:text-base text-gray-900 min-w-0 truncate">{{ exp.name }}</span>
        <div class="flex gap-1 sm:gap-2 flex-shrink-0">
          <button @click="startEdit(index)"
            class="text-blue-600 hover:text-blue-800 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium">แก้ไข</button>
          <button @click="deleteExperience(exp.id)"
            class="text-red-600 hover:text-red-800 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium">ลบ</button>
        </div>
      </div>
      <div v-if="experiences.length === 0" class="text-center py-8 text-sm sm:text-base text-gray-500">
        ไม่มีข้อมูลประสบการณ์การทำงานสำหรับกลุ่มนี้
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
import { axiosAuth as axios } from '../../../../utils/apiClient'

const props = defineProps({
  companyIds: { type: Array, required: true }
})

const API_URL = '/api/experiences'
const experiences = ref([])
const newExperience = ref('')
const showAddForm = ref(false)
const editingIndex = ref(-1)
const editingText = ref('')

let abortController = null

const fetchExperiences = async () => {
  if (!props.companyIds?.length) return

  // ยกเลิก request เก่าที่ยังค้างอยู่
  if (abortController) abortController.abort()
  abortController = new AbortController()

  try {
    const res = await axios.get(API_URL, {
      params: { companyIds: props.companyIds.join(',') },
      signal: abortController.signal
    })
    experiences.value = res.data
  } catch (err) {
    if (axios.isCancel?.(err) || err.code === 'ECONNABORTED' || err.name === 'CanceledError') return
    console.error('fetchExperiences error:', err)
    alert('ไม่สามารถโหลดข้อมูลได้')
  }
}

watch(() => props.companyIds, fetchExperiences, { immediate: true, deep: true })

onUnmounted(() => {
  if (abortController) abortController.abort()
})

const addExperience = async () => {
  if (!newExperience.value.trim()) return
  try {
    await axios.post(API_URL, {
      name: newExperience.value,
      companyIds: props.companyIds
    })
    await fetchExperiences()
    newExperience.value = ''
    showAddForm.value = false
  } catch (err) {
    alert(err.response?.data?.message || 'เกิดข้อผิดพลาด')
  }
}

const startEdit = (index) => {
  editingIndex.value = index
  editingText.value = experiences.value[index].name
}

const saveEdit = async () => {
  const exp = experiences.value[editingIndex.value]
  if (!editingText.value.trim()) return
  try {
    await axios.put(`${API_URL}/${exp.id}`, {
      name: editingText.value,
      companyIds: props.companyIds
    })
    await fetchExperiences()
    editingIndex.value = -1
    editingText.value = ''
  } catch (err) {
    alert(err.response?.data?.message || 'เกิดข้อผิดพลาด')
  }
}

const cancelEdit = () => { editingIndex.value = -1; editingText.value = '' }
const cancelAdd = () => { newExperience.value = ''; showAddForm.value = false }

const deleteExperience = async (id) => {
  if (!confirm('คุณต้องการลบช่วงประสบการณ์นี้หรือไม่?')) return
  try {
    await axios.delete(`${API_URL}/${id}`, {
      params: { companyIds: props.companyIds.join(',') }
    })
    await fetchExperiences()
  } catch (err) {
    alert(err.response?.data?.message || 'เกิดข้อผิดพลาด')
  }
}
</script>