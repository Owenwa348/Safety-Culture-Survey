<!-- EditDepartment.vue -->
<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-6">
      <h4 class="text-lg font-medium text-gray-900">จัดการสายงาน</h4>
      <button @click="showAddForm = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
        + เพิ่มสายงานใหม่
      </button>
    </div>

    <!-- Add Form -->
    <div v-if="showAddForm" class="mb-6 p-4 bg-gray-50 rounded-lg border">
      <h5 class="font-medium text-gray-900 mb-2">เพิ่มสายงานใหม่</h5>
      <p class="text-xs text-blue-600 mb-3">จะเพิ่มให้ทุกบริษัทในกลุ่ม ({{ companyIds.length }} บริษัท)</p>
      <div class="flex gap-3">
        <input v-model="newDepartment" type="text" placeholder="กรอกชื่อสายงาน"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="addDepartment" />
        <button @click="addDepartment"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">เพิ่ม</button>
        <button @click="cancelAdd"
          class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium">ยกเลิก</button>
      </div>
    </div>

    <!-- Edit Form -->
    <div v-if="editingIndex !== -1" class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h5 class="font-medium text-gray-900 mb-3">แก้ไขสายงาน</h5>
      <div class="flex gap-3">
        <input v-model="editingText" type="text"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="saveEdit" />
        <button @click="saveEdit"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">บันทึก</button>
        <button @click="cancelEdit"
          class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium">ยกเลิก</button>
      </div>
    </div>

    <!-- List -->
    <div class="space-y-3">
      <div v-for="(dept, index) in departments" :key="dept.id"
        class="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
        <span class="text-gray-900">{{ dept.name }}</span>
        <div class="flex gap-2">
          <button @click="startEdit(index)"
            class="text-blue-600 hover:text-blue-800 px-3 py-1 text-sm font-medium">แก้ไข</button>
          <button @click="deleteDepartment(dept.id)"
            class="text-red-600 hover:text-red-800 px-3 py-1 text-sm font-medium">ลบ</button>
        </div>
      </div>
      <div v-if="departments.length === 0" class="text-center py-8 text-gray-500">
        ไม่มีข้อมูลสายงานสำหรับกลุ่มนี้
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { axiosAuth as axios } from '../../../../utils/apiClient'

// ✅ เปลี่ยนจาก companyId (Number) → companyIds (Array)
const props = defineProps({
  companyIds: { type: Array, required: true }
})

const API_URL = '/api/departments'
const departments = ref([])
const newDepartment = ref('')
const showAddForm = ref(false)
const editingIndex = ref(-1)
const editingText = ref('')

const fetchDepartments = async () => {
  if (!props.companyIds?.length) return
  try {
    const res = await axios.get(API_URL, {
      params: { companyIds: props.companyIds.join(',') }  // ✅ "1,2,3"
    })
    departments.value = res.data
  } catch (err) {
    console.error('fetchDepartments error:', err)
  }
}

// ✅ โหลดใหม่เมื่อกลุ่มบริษัทเปลี่ยน
watch(() => props.companyIds, fetchDepartments, { immediate: true, deep: true })

const addDepartment = async () => {
  if (!newDepartment.value.trim()) return alert('กรุณากรอกชื่อสายงาน')
  try {
    const res = await axios.post(API_URL, {
      name: newDepartment.value.trim(),
      companyIds: props.companyIds  // ✅ ส่ง array
    })
    // ✅ Refetch เพื่อให้ UI sync กับ database จริง
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
    const res = await axios.put(`${API_URL}/${id}`, {
      name: editingText.value.trim(),
      companyIds: props.companyIds   // ✅ เพิ่ม
    })
    // ✅ Refetch เพื่อให้ UI sync กับ database จริง (backend อัพเดตหลายบริษัท)
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
      params: { companyIds: props.companyIds.join(',') }  // ✅ เพิ่ม
    })
    // ✅ Refetch เพื่อให้ UI sync กับ database จริง (backend ลบหลายบริษัท)
    await fetchDepartments()
  } catch (err) {
    alert('ไม่สามารถลบสายงานได้')
  }
}
</script>