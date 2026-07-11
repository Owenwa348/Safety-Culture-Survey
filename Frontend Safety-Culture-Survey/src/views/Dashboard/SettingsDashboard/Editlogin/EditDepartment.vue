<!-- EditDepartment.vue -->
<template>
  <div class="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">
      <h4 class="text-base sm:text-lg font-medium text-gray-900">จัดการสายงาน</h4>
      <button @click="showAddForm = true"
        class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 sm:py-2 rounded-lg text-sm font-medium transition-colors">
        + เพิ่มสายงานใหม่
      </button>
    </div>

    <!-- Add Form -->
    <div v-if="showAddForm" class="mb-5 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg border">
      <h5 class="font-medium text-gray-900 mb-2 text-sm sm:text-base">เพิ่มสายงานใหม่</h5>
      <p class="text-xs text-blue-600 mb-3">จะเพิ่มให้ทุกบริษัทในกลุ่ม ({{ companyIds.length }} บริษัท)</p>
      <div class="flex flex-col sm:flex-row gap-3">
        <input v-model="newDepartment" type="text" placeholder="กรอกชื่อสายงาน"
          class="flex-1 min-w-0 px-3 py-2.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="addDepartment" />
        <div class="flex gap-3">
          <button @click="addDepartment"
            class="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 sm:py-2 rounded-lg text-sm font-medium">เพิ่ม</button>
          <button @click="cancelAdd"
            class="flex-1 sm:flex-none bg-gray-500 hover:bg-gray-600 text-white px-4 py-2.5 sm:py-2 rounded-lg text-sm font-medium">ยกเลิก</button>
        </div>
      </div>
    </div>

    <!-- Edit Form -->
    <div v-if="editingIndex !== -1" class="mb-5 sm:mb-6 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h5 class="font-medium text-gray-900 mb-3 text-sm sm:text-base">แก้ไขสายงาน</h5>
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
      <div v-for="(dept, index) in departments" :key="dept.id"
        class="flex items-center justify-between gap-2 p-3 sm:p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
        <span class="text-sm sm:text-base text-gray-900 min-w-0 truncate">{{ dept.name }}</span>
        <div class="flex gap-1 sm:gap-2 flex-shrink-0">
          <button @click="startEdit(index)"
            class="text-blue-600 hover:text-blue-800 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium">แก้ไข</button>
          <button @click="deleteDepartment(dept.id)"
            class="text-red-600 hover:text-red-800 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium">ลบ</button>
        </div>
      </div>
      <div v-if="departments.length === 0" class="text-center py-8 text-sm sm:text-base text-gray-500">
        ไม่มีข้อมูลสายงานสำหรับกลุ่มนี้
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

const API_URL = '/api/departments'
const departments = ref([])
const newDepartment = ref('')
const showAddForm = ref(false)
const editingIndex = ref(-1)
const editingText = ref('')

let abortController = null

const fetchDepartments = async () => {
  if (!props.companyIds?.length) return

  // ยกเลิก request เก่าที่ยังค้างอยู่
  if (abortController) abortController.abort()
  abortController = new AbortController()

  try {
    const res = await axios.get(API_URL, {
      params: { companyIds: props.companyIds.join(',') },
      signal: abortController.signal
    })
    departments.value = res.data
  } catch (err) {
    if (axios.isCancel?.(err) || err.code === 'ECONNABORTED' || err.name === 'CanceledError') return
    console.error('fetchDepartments error:', err)
  }
}

watch(() => props.companyIds, fetchDepartments, { immediate: true, deep: true })

onUnmounted(() => {
  if (abortController) abortController.abort()
})

const addDepartment = async () => {
  if (!newDepartment.value.trim()) return alert('กรุณากรอกชื่อสายงาน')
  try {
    await axios.post(API_URL, {
      name: newDepartment.value.trim(),
      companyIds: props.companyIds
    })
    await fetchDepartments()
    newDepartment.value = ''
    showAddForm.value = false
  } catch (err) {
    if (err.response?.status === 409) alert('มีสายงานชื่อนี้อยู่แล้ว')
    else alert('ไม่สามารถเพิ่มสายงานได้')
  }
}

const cancelAdd = () => { newDepartment.value = ''; showAddForm.value = false }

const startEdit = (index) => {
  editingIndex.value = index
  editingText.value = departments.value[index].name
}

const saveEdit = async () => {
  if (!editingText.value.trim()) return alert('กรุณากรอกชื่อสายงาน')
  const id = departments.value[editingIndex.value].id
  try {
    await axios.put(`${API_URL}/${id}`, {
      name: editingText.value.trim(),
      companyIds: props.companyIds
    })
    await fetchDepartments()
    editingIndex.value = -1
    editingText.value = ''
  } catch (err) {
    alert('ไม่สามารถแก้ไขข้อมูลได้')
  }
}

const cancelEdit = () => { editingIndex.value = -1; editingText.value = '' }

const deleteDepartment = async (id) => {
  if (!confirm('คุณต้องการลบสายงานนี้หรือไม่?')) return
  try {
    await axios.delete(`${API_URL}/${id}`, {
      params: { companyIds: props.companyIds.join(',') }
    })
    await fetchDepartments()
  } catch (err) {
    alert('ไม่สามารถลบสายงานได้')
  }
}
</script>