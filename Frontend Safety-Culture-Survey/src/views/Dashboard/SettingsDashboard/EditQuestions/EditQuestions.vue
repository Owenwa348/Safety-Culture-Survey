<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h4 class="text-lg font-medium text-gray-900">จัดการคำถามและหมวดหมู่</h4>
      <div class="flex gap-3">
        <button
          @click="showCategoryForm = true"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + เพิ่มหมวดหมู่
        </button>
        <button
          @click="showAddForm = true"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + เพิ่มคำถาม
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">กำลังโหลดข้อมูล...</p>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
      {{ error }}
    </div>

    <template v-if="!loading">
      <!-- Add Category Form -->
      <div v-if="showCategoryForm" class="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <h5 class="font-medium text-gray-900 mb-3">เพิ่มหมวดหมู่ใหม่</h5>
        <div class="flex gap-3">
          <input
            v-model="newCategoryName"
            type="text"
            placeholder="กรอกชื่อหมวดหมู่"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            @keyup.enter="addCategory"
          />
          <button
            @click="addCategory"
            :disabled="submitting"
            class="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            {{ submitting ? 'กำลังเพิ่ม...' : 'เพิ่ม' }}
          </button>
          <button
            @click="cancelCategoryForm"
            class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            ยกเลิก
          </button>
        </div>
      </div>

      <!-- Add Question Form -->
      <div v-if="showAddForm" class="mb-6 p-4 bg-gray-50 rounded-lg border">
        <h5 class="font-medium text-gray-900 mb-3">เพิ่มคำถามใหม่</h5>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่</label>
            <select 
              v-model="newQuestion.categoryId" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">เลือกหมวดหมู่</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">คำถาม</label>
            <textarea
              v-model="newQuestion.text"
              rows="3"
              placeholder="กรอกคำถาม"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ตัวเลือกคำตอบ</label>
            <div class="space-y-2">
              <div v-for="(option, index) in newQuestion.options" :key="index" class="flex gap-3">
                <input
                  v-model="option.text"
                  type="text"
                  :placeholder="`ตัวเลือกที่ ${index + 1}`"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  v-if="newQuestion.options.length > 1"
                  @click="removeOption(index)"
                  class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
                >
                  ลบ
                </button>
              </div>
              <button
                @click="addOption"
                class="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm font-medium"
              >
                + เพิ่มตัวเลือก
              </button>
            </div>
          </div>
          <div class="flex gap-3">
            <button
              @click="addQuestion"
              :disabled="submitting"
              class="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              {{ submitting ? 'กำลังเพิ่ม...' : 'เพิ่ม' }}
            </button>
            <button
              @click="cancelAdd"
              class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </div>

      <!-- Edit Question Form -->
      <div v-if="editingQuestion" class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h5 class="font-medium text-gray-900 mb-3">แก้ไขคำถาม</h5>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่</label>
            <select 
              v-model="editingQuestion.categoryId" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">คำถาม</label>
            <textarea
              v-model="editingQuestion.text"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ตัวเลือกคำตอบ</label>
            <div class="space-y-2">
              <div v-for="(option, index) in editingQuestion.options" :key="index" class="flex gap-3">
                <input
                  v-model="option.text"
                  type="text"
                  :placeholder="`ตัวเลือกที่ ${index + 1}`"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  v-if="editingQuestion.options.length > 1"
                  @click="removeEditOption(index)"
                  class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
                >
                  ลบ
                </button>
              </div>
              <button
                @click="addEditOption"
                class="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm font-medium"
              >
                + เพิ่มตัวเลือก
              </button>
            </div>
          </div>
          <div class="flex gap-3">
            <button
              @click="saveEdit"
              :disabled="submitting"
              class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              {{ submitting ? 'กำลังบันทึก...' : 'บันทึก' }}
            </button>
            <button
              @click="cancelEdit"
              class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </div>

      <!-- Categories and Questions List -->
      <div class="space-y-6">
        <div v-for="category in categories" :key="category.id" class="border border-gray-200 rounded-lg overflow-hidden">
          <!-- Category Header -->
          <div class="bg-gray-100 px-4 py-3 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <h5 v-if="!category.editing" class="font-semibold text-gray-900 text-lg">{{ category.name }}</h5>
                <input
                  v-else
                  v-model="category.tempName"
                  type="text"
                  class="font-semibold text-gray-900 text-lg bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  @keyup.enter="saveCategoryName(category)"
                  @keyup.escape="cancelCategoryEdit(category)"
                />
                <span class="text-sm text-gray-500">({{ getQuestionsByCategory(category.id).length }} คำถาม)</span>
              </div>
              <div class="flex gap-2">
                <button
                  v-if="!category.editing"
                  @click="startCategoryEdit(category)"
                  class="text-blue-600 hover:text-blue-800 px-2 py-1 text-sm font-medium"
                >
                  แก้ไขชื่อ
                </button>
                <template v-else>
                  <button
                    @click="saveCategoryName(category)"
                    :disabled="submitting"
                    class="text-green-600 hover:text-green-800 disabled:text-green-400 px-2 py-1 text-sm font-medium"
                  >
                    บันทึก
                  </button>
                  <button
                    @click="cancelCategoryEdit(category)"
                    class="text-gray-600 hover:text-gray-800 px-2 py-1 text-sm font-medium"
                  >
                    ยกเลิก
                  </button>
                </template>
                <button
                  @click="deleteCategory(category.id)"
                  class="text-red-600 hover:text-red-800 px-2 py-1 text-sm font-medium"
                >
                  ลบหมวดหมู่
                </button>
              </div>
            </div>
          </div>

          <!-- Questions in Category -->
          <div class="p-4">
            <div class="space-y-3">
              <div
                v-for="question in getQuestionsByCategory(category.id)"
                :key="question.id"
                class="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-sm transition-shadow"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-3">
                      <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">ข้อ {{ question.id }}</span>
                    </div>
                    <p class="text-gray-900 mb-4">{{ question.text }}</p>
                    
                    <!-- Answer Options -->
                    <div class="bg-gray-50 rounded-lg p-3">
                      <label class="block text-sm font-medium text-gray-700 mb-2">ตัวเลือกคำตอบ:</label>
                      <div class="space-y-2">
                        <div 
                          v-for="(option, idx) in question.options" 
                          :key="option.id" 
                          class="flex items-center gap-2"
                        >
                          <span class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                            {{ idx + 1 }}
                          </span>
                          <span class="text-gray-700 text-sm">{{ option.text }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col gap-2 ml-4">
                    <button
                      @click="startEdit(question)"
                      class="text-blue-600 hover:text-blue-800 px-3 py-1 text-sm font-medium"
                    >
                      แก้ไข
                    </button>
                    <button
                      @click="deleteQuestion(question.id)"
                      class="text-red-600 hover:text-red-800 px-3 py-1 text-sm font-medium"
                    >
                      ลบ
                    </button>
                    <select
                      :value="question.categoryId"
                      @change="moveQuestion(question.id, $event.target.value)"
                      class="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">ย้ายไปหมวดหมู่...</option>
                      <option 
                        v-for="cat in categories" 
                        :key="cat.id" 
                        :value="cat.id"
                        :disabled="cat.id === question.categoryId"
                      >
                        {{ cat.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-if="getQuestionsByCategory(category.id).length === 0" class="text-center py-8 text-gray-500">
              ไม่มีคำถามในหมวดหมู่นี้
            </div>
          </div>
        </div>
        
        <div v-if="categories.length === 0" class="text-center py-8 text-gray-500">
          ไม่มีหมวดหมู่
        </div>
      </div>

      <!-- Summary -->
      <div class="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-700">สรุป: {{ categories.length }} หมวดหมู่, {{ allQuestions.length }} คำถาม</span>
          <div class="flex gap-4 text-xs text-gray-600">
            <span>📝 คำถามแบบปรนัย</span>
            <span>⚙️ ตัวเลือกแก้ไขได้</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// กำหนด Base URL ของ API
const API_BASE_URL = 'http://localhost:5000/api' // เปลี่ยนตาม URL ของ backend

const categories = ref([])
const allQuestions = ref([])
const loading = ref(false)
const submitting = ref(false)
const error = ref('')

const newQuestion = ref({
  categoryId: '',
  text: '',
  options: [{ text: '' }, { text: '' }]
})

const showAddForm = ref(false)
const showCategoryForm = ref(false)
const editingQuestion = ref(null)
const newCategoryName = ref('')

// Load data from API
const loadData = async () => {
  loading.value = true
  error.value = ''
  try {
    const [categoriesRes, questionsRes] = await Promise.all([
      axios.get(`${API_BASE_URL}/categories`),
      axios.get(`${API_BASE_URL}/questions`)
    ])
    
    categories.value = categoriesRes.data.map(cat => ({
      ...cat,
      editing: false,
      tempName: ''
    }))
    allQuestions.value = questionsRes.data
  } catch (err) {
    console.error('Load data error:', err)
    error.value = 'ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

const getQuestionsByCategory = (categoryId) => {
  return allQuestions.value.filter(q => q.categoryId === categoryId)
}

// Category Functions
const addCategory = async () => {
  if (!newCategoryName.value.trim()) {
    alert('กรุณากรอกชื่อหมวดหมู่')
    return
  }
  
  submitting.value = true
  error.value = ''
  try {
    const response = await axios.post(`${API_BASE_URL}/categories`, {
      name: newCategoryName.value.trim()
    })
    categories.value.push({
      ...response.data,
      editing: false,
      tempName: ''
    })
    newCategoryName.value = ''
    showCategoryForm.value = false
  } catch (err) {
    console.error('Add category error:', err)
    error.value = err.response?.data?.message || 'ไม่สามารถเพิ่มหมวดหมู่ได้'
  } finally {
    submitting.value = false
  }
}

const cancelCategoryForm = () => {
  newCategoryName.value = ''
  showCategoryForm.value = false
}

const startCategoryEdit = (category) => {
  category.editing = true
  category.tempName = category.name
}

const saveCategoryName = async (category) => {
  if (!category.tempName.trim()) {
    alert('กรุณากรอกชื่อหมวดหมู่')
    return
  }
  
  submitting.value = true
  error.value = ''
  try {
    const response = await axios.put(`${API_BASE_URL}/categories/${category.id}`, {
      name: category.tempName.trim()
    })
    category.name = response.data.name
    category.editing = false
    category.tempName = ''
  } catch (err) {
    console.error('Update category error:', err)
    error.value = err.response?.data?.message || 'ไม่สามารถแก้ไขหมวดหมู่ได้'
  } finally {
    submitting.value = false
  }
}

const cancelCategoryEdit = (category) => {
  category.editing = false
  category.tempName = ''
}

const deleteCategory = async (categoryId) => {
  const questionsInCategory = getQuestionsByCategory(categoryId)
  const message = questionsInCategory.length > 0
    ? `หมวดหมู่นี้มี ${questionsInCategory.length} คำถาม คุณต้องการลบหมวดหมู่และคำถามทั้งหมดหรือไม่?`
    : 'คุณต้องการลบหมวดหมู่นี้หรือไม่?'
  
  if (!confirm(message)) return
  
  error.value = ''
  try {
    await axios.delete(`${API_BASE_URL}/categories/${categoryId}`)
    categories.value = categories.value.filter(c => c.id !== categoryId)
    allQuestions.value = allQuestions.value.filter(q => q.categoryId !== categoryId)
  } catch (err) {
    console.error('Delete category error:', err)
    error.value = err.response?.data?.message || 'ไม่สามารถลบหมวดหมู่ได้'
  }
}

// Question Option Functions
const addOption = () => {
  newQuestion.value.options.push({ text: '' })
}

const removeOption = (index) => {
  newQuestion.value.options.splice(index, 1)
}

const addEditOption = () => {
  editingQuestion.value.options.push({ text: '' })
}

const removeEditOption = (index) => {
  editingQuestion.value.options.splice(index, 1)
}

// Question Functions
const addQuestion = async () => {
  if (!newQuestion.value.categoryId || !newQuestion.value.text.trim()) {
    alert('กรุณากรอกข้อมูลหมวดหมู่และคำถาม')
    return
  }
  
  const validOptions = newQuestion.value.options.filter(opt => opt.text.trim())
  if (validOptions.length === 0) {
    alert('กรุณากรอกตัวเลือกอย่างน้อย 1 ข้อ')
    return
  }
  
  submitting.value = true
  error.value = ''
  try {
    const response = await axios.post(`${API_BASE_URL}/questions`, {
      categoryId: parseInt(newQuestion.value.categoryId),
      text: newQuestion.value.text.trim(),
      options: validOptions.map(opt => ({ text: opt.text.trim() }))
    })
    allQuestions.value.push(response.data)
    
    // Reset form
    newQuestion.value = {
      categoryId: '',
      text: '',
      options: [{ text: '' }, { text: '' }]
    }
    showAddForm.value = false
  } catch (err) {
    console.error('Add question error:', err)
    error.value = err.response?.data?.message || 'ไม่สามารถเพิ่มคำถามได้'
  } finally {
    submitting.value = false
  }
}

const cancelAdd = () => {
  newQuestion.value = {
    categoryId: '',
    text: '',
    options: [{ text: '' }, { text: '' }]
  }
  showAddForm.value = false
}

const startEdit = (question) => {
  editingQuestion.value = {
    id: question.id,
    categoryId: question.categoryId,
    text: question.text,
    options: question.options.map(opt => ({ ...opt }))
  }
}

const saveEdit = async () => {
  if (!editingQuestion.value.categoryId || !editingQuestion.value.text.trim()) {
    alert('กรุณากรอกข้อมูลหมวดหมู่และคำถาม')
    return
  }
  
  const validOptions = editingQuestion.value.options.filter(opt => opt.text.trim())
  if (validOptions.length === 0) {
    alert('กรุณากรอกตัวเลือกอย่างน้อย 1 ข้อ')
    return
  }
  
  submitting.value = true
  error.value = ''
  try {
    const response = await axios.put(`${API_BASE_URL}/questions/${editingQuestion.value.id}`, {
      categoryId: parseInt(editingQuestion.value.categoryId),
      text: editingQuestion.value.text.trim(),
      options: validOptions.map(opt => ({ text: opt.text.trim() }))
    })
    
    const index = allQuestions.value.findIndex(q => q.id === editingQuestion.value.id)
    if (index !== -1) {
      allQuestions.value[index] = response.data
    }
    editingQuestion.value = null
  } catch (err) {
    console.error('Update question error:', err)
    error.value = err.response?.data?.message || 'ไม่สามารถแก้ไขคำถามได้'
  } finally {
    submitting.value = false
  }
}

const cancelEdit = () => {
  editingQuestion.value = null
}

const deleteQuestion = async (id) => {
  if (!confirm('คุณต้องการลบคำถามนี้หรือไม่?')) return
  
  error.value = ''
  try {
    await axios.delete(`${API_BASE_URL}/questions/${id}`)
    allQuestions.value = allQuestions.value.filter(q => q.id !== id)
  } catch (err) {
    console.error('Delete question error:', err)
    error.value = err.response?.data?.message || 'ไม่สามารถลบคำถามได้'
  }
}

const moveQuestion = async (questionId, newCategoryId) => {
  if (!newCategoryId) return
  
  error.value = ''
  try {
    await axios.put(`${API_BASE_URL}/questions/${questionId}/move`, {
      newCategoryId: parseInt(newCategoryId)
    })
    
    const question = allQuestions.value.find(q => q.id === questionId)
    if (question) {
      question.categoryId = parseInt(newCategoryId)
    }
  } catch (err) {
    console.error('Move question error:', err)
    error.value = err.response?.data?.message || 'ไม่สามารถย้ายคำถามได้'
  }
}
</script>