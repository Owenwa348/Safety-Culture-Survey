<!-- EditQuestions.vue -->
<template>
  <div class="bg-white rounded-lg border border-gray-300 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
      <h4 class="text-xl font-semibold text-gray-800">จัดการคำถามและหมวดหมู่</h4>
      <div class="flex gap-3">
        <button
          @click="showCategoryForm = true"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium"
        >
          + เพิ่มหมวดหมู่
        </button>
        <button
          @click="showAddForm = true"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
        >
          + เพิ่มคำถาม
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
      <p class="mt-3 text-gray-600">กำลังโหลดข้อมูล...</p>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-300 rounded text-red-700 text-sm flex items-center justify-between">
      <span>{{ error }}</span>
      <button @click="error = ''" class="text-red-800 hover:text-red-900">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="mb-4 p-3 bg-green-50 border border-green-300 rounded text-green-700 text-sm flex items-center justify-between">
      <span>{{ successMessage }}</span>
      <button @click="successMessage = ''" class="text-green-800 hover:text-green-900">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <template v-if="!loading">
      <!-- Add Category Form -->
      <div v-if="showCategoryForm" class="mb-6 p-4 bg-gray-50 rounded border border-gray-300">
        <h5 class="font-medium text-gray-800 mb-3">เพิ่มหมวดหมู่ใหม่</h5>
        <div class="flex gap-2">
          <input
            v-model="newCategoryName"
            type="text"
            placeholder="ชื่อหมวดหมู่"
            class="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            @keyup.enter="addCategory"
          />
          <button
            @click="addCategory"
            :disabled="submitting"
            class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded text-sm font-medium"
          >
            {{ submitting ? 'กำลังบันทึก...' : 'บันทึก' }}
          </button>
          <button
            @click="cancelCategoryForm"
            class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium"
          >
            ยกเลิก
          </button>
        </div>
      </div>

      <!-- Add Question Form -->
      <div v-if="showAddForm" class="mb-6 p-4 bg-gray-50 rounded border border-gray-300">
        <h5 class="font-medium text-gray-800 mb-3">เพิ่มคำถามใหม่</h5>
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่</label>
            <select 
              v-model="newQuestion.categoryId" 
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">ตัวเลือกคำตอบ</label>
            <div class="space-y-2">
              <div v-for="(option, index) in newQuestion.options" :key="index" class="flex gap-2 items-center">
                <button
                  v-if="index > 0"
                  @click="moveOptionUp(index, 'new')"
                  class="text-gray-500 hover:text-gray-700"
                  title="เลื่อนขึ้น"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  v-else
                  class="w-5 h-5"
                ></button>
                <button
                  v-if="index < newQuestion.options.length - 1"
                  @click="moveOptionDown(index, 'new')"
                  class="text-gray-500 hover:text-gray-700"
                  title="เลื่อนลง"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button
                  v-else
                  class="w-5 h-5"
                ></button>
                <span class="flex items-center justify-center w-8 h-10 bg-gray-200 text-gray-700 rounded text-sm font-medium">{{ index + 1 }}</span>
                <input
                  v-model="option.text"
                  type="text"
                  :placeholder="`ตัวเลือกที่ ${index + 1}`"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  v-if="newQuestion.options.length > 1"
                  @click="removeOption(index)"
                  class="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm"
                >
                  ลบ
                </button>
              </div>
              <button
                @click="addOption"
                class="w-full bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm font-medium"
              >
                + เพิ่มตัวเลือก
              </button>
            </div>
          </div>
          <div class="flex gap-2 pt-2">
            <button
              @click="addQuestion"
              :disabled="submitting"
              class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded text-sm font-medium"
            >
              {{ submitting ? 'กำลังบันทึก...' : 'บันทึก' }}
            </button>
            <button
              @click="cancelAdd"
              class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </div>

      <!-- Categories and Questions List -->
      <div class="space-y-6">
        <div v-for="(category, catIndex) in categories" :key="category.id" class="border border-gray-300 rounded overflow-hidden">
          <!-- Category Header -->
          <div class="bg-gray-100 px-4 py-3 border-b border-gray-300">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="inline-flex items-center justify-center w-6 h-6 bg-gray-700 text-white rounded text-xs font-semibold">
                  {{ catIndex + 1 }}
                </span>
                <div v-if="!category.editing" class="flex items-center gap-2">
                  <h5 class="font-semibold text-gray-800 text-base">{{ category.name }}</h5>
                  <button
                    @click="startCategoryEdit(category)"
                    class="text-blue-600 hover:text-blue-800"
                    title="แก้ไข"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
                <div v-else class="flex items-center gap-2">
                  <input
                    v-model="category.tempName"
                    type="text"
                    class="font-semibold text-gray-800 text-base bg-white border border-blue-400 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    @keyup.enter="saveCategoryName(category)"
                    @keyup.escape="cancelCategoryEdit(category)"
                  />
                  <button
                    @click="saveCategoryName(category)"
                    :disabled="submitting"
                    class="text-green-600 hover:text-green-800 disabled:text-gray-400"
                    title="บันทึก"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  <button
                    @click="cancelCategoryEdit(category)"
                    class="text-gray-600 hover:text-gray-800"
                    title="ยกเลิก"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <span class="text-sm text-gray-600">({{ getQuestionsByCategory(category.id).length }} คำถาม)</span>
              </div>
              <button
                @click="deleteCategory(category.id)"
                class="text-red-600 hover:text-red-800 text-sm font-medium"
                title="ลบหมวดหมู่"
              >
                ลบหมวดหมู่
              </button>
            </div>
          </div>

          <!-- Questions in Category -->
          <div class="p-4 bg-white">
            <div class="space-y-3">
              <div
                v-for="question in getQuestionsWithSequentialNumbers(category.id)"
                :key="question.id"
                class="border border-gray-300 rounded p-4"
                :class="editingQuestionId === question.id ? 'bg-blue-50 border-blue-400' : 'bg-white'"
              >
                <div class="flex gap-3">
                  <!-- Question Number -->
                  <div class="flex flex-col gap-1 flex-shrink-0">
                    <input
                      v-if="editingQuestionId === question.id"
                      v-model="inlineEditData.displayNumber"
                      type="text"
                      class="w-16 h-8 text-center bg-blue-600 text-white rounded text-sm font-semibold border-2 border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title="เลขข้อ (ใส่อะไรก็ได้)"
                      placeholder="เลข"
                    />
                    <span v-else class="inline-flex items-center justify-center w-16 h-8 bg-blue-600 text-white rounded text-sm font-semibold">
                      {{ question.sequentialNumber }}
                    </span>
                    <span v-if="editingQuestionId === question.id" class="text-xs text-gray-500 text-center">
                      แก้ไขได้
                    </span>
                  </div>

                  <!-- Question Content -->
                  <div class="flex-1 min-w-0">
                    <!-- Question Text -->
                    <div class="mb-3">
                      <div v-if="editingQuestionId !== question.id" class="flex items-start justify-between">
                        <p class="text-gray-800 font-medium">{{ question.text }}</p>
                        <button
                          @click="startInlineEdit(question)"
                          class="text-blue-600 hover:text-blue-800 ml-2 flex-shrink-0"
                          title="แก้ไข"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      </div>
                      <div v-else>
                        <textarea
                          v-model="inlineEditData.text"
                          rows="2"
                          class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          @keyup.escape="cancelInlineEdit"
                        ></textarea>
                      </div>
                    </div>
                    
                    <!-- Answer Options -->
                    <div class="bg-gray-50 rounded p-3 border border-gray-200">
                      <label class="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">ตัวเลือกคำตอบ</label>
                      <div class="space-y-2">
                        <div 
                          v-for="(option, optIndex) in editingQuestionId === question.id ? inlineEditData.options : question.options" 
                          :key="option.id || optIndex" 
                          class="flex items-center gap-2"
                        >
                          <!-- Move buttons (only in edit mode) -->
                          <template v-if="editingQuestionId === question.id">
                            <button
                              v-if="optIndex > 0"
                              @click="moveOptionUp(optIndex, 'edit')"
                              class="text-gray-500 hover:text-gray-700"
                              title="เลื่อนขึ้น"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                              </svg>
                            </button>
                            <div v-else class="w-4 h-4"></div>
                            <button
                              v-if="optIndex < inlineEditData.options.length - 1"
                              @click="moveOptionDown(optIndex, 'edit')"
                              class="text-gray-500 hover:text-gray-700"
                              title="เลื่อนลง"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            <div v-else class="w-4 h-4"></div>
                          </template>
                          
                          <span class="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-semibold flex-shrink-0">
                            {{ optIndex + 1 }}
                          </span>
                          <input
                            v-if="editingQuestionId === question.id"
                            v-model="option.text"
                            type="text"
                            class="flex-1 text-gray-700 text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <span v-else class="text-gray-700 text-sm flex-1">{{ option.text }}</span>
                          <button
                            v-if="editingQuestionId === question.id && inlineEditData.options.length > 1"
                            @click="removeInlineEditOption(optIndex)"
                            class="text-red-600 hover:text-red-800 flex-shrink-0"
                            title="ลบตัวเลือก"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <button
                          v-if="editingQuestionId === question.id"
                          @click="addInlineEditOption"
                          class="w-full bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs font-medium"
                        >
                          + เพิ่มตัวเลือก
                        </button>
                      </div>
                    </div>

                    <!-- Edit Actions -->
                    <div v-if="editingQuestionId === question.id" class="flex gap-2 mt-3">
                      <button
                        @click="saveInlineEdit"
                        :disabled="submitting"
                        class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded text-sm font-medium"
                      >
                        {{ submitting ? 'กำลังบันทึก...' : 'บันทึก' }}
                      </button>
                      <button
                        @click="cancelInlineEdit"
                        class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium"
                      >
                        ยกเลิก
                      </button>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex flex-col gap-2 flex-shrink-0">
                    <select
                      :value="question.categoryId"
                      @change="moveQuestion(question.id, $event.target.value)"
                      class="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      title="ย้ายหมวดหมู่"
                    >
                      <option value="">ย้ายไป...</option>
                      <option 
                        v-for="cat in categories" 
                        :key="cat.id" 
                        :value="cat.id"
                        :disabled="cat.id === question.categoryId"
                      >
                        {{ cat.name }}
                      </option>
                    </select>
                    <button
                      @click="deleteQuestion(question.id)"
                      class="text-red-600 hover:text-red-800 text-xs font-medium border border-red-300 rounded px-2 py-1 hover:bg-red-50"
                      title="ลบคำถาม"
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-if="getQuestionsByCategory(category.id).length === 0" class="text-center py-8 text-gray-500 text-sm">
              ไม่มีคำถามในหมวดหมู่นี้
            </div>
          </div>
        </div>
        
        <div v-if="categories.length === 0" class="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded">
          <p class="font-medium">ไม่มีหมวดหมู่</p>
          <p class="text-sm mt-1">กรุณาเพิ่มหมวดหมู่ใหม่เพื่อเริ่มต้น</p>
        </div>
      </div>

      <!-- Summary -->
      <div class="mt-6 pt-4 border-t border-gray-200">
        <div class="flex items-center justify-between text-sm text-gray-600">
          <span><strong class="text-gray-800">สรุป:</strong> {{ categories.length }} หมวดหมู่, {{ allQuestions.length }} คำถาม</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

const categories = ref([])
const allQuestions = ref([])
const loading = ref(false)
const submitting = ref(false)
const error = ref('')
const successMessage = ref('')

const newQuestion = ref({
  categoryId: '',
  text: '',
  options: [{ text: '' }, { text: '' }]
})

const showAddForm = ref(false)
const showCategoryForm = ref(false)
const newCategoryName = ref('')

const editingQuestionId = ref(null)
const inlineEditData = ref({
  text: '',
  options: [],
  categoryId: null,
  displayNumber: 1
})

const getQuestionsWithSequentialNumbers = (categoryId) => {
  const questions = allQuestions.value.filter(q => q.categoryId === categoryId)
  const sortedQuestions = [...questions].sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order
    }
    if (a.order !== undefined) return -1
    if (b.order !== undefined) return 1
    return a.id - b.id
  })
  
  return sortedQuestions.map((question) => ({
    ...question,
    sequentialNumber: question.order !== undefined ? question.order + 1 : question.id
  }))
}

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
    
    allQuestions.value.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order
      }
      return a.id - b.id
    })
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

const getMaxQuestionNumber = (categoryId) => {
  return getQuestionsByCategory(categoryId).length
}

const showSuccess = (message) => {
  successMessage.value = message
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}

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
    showSuccess('เพิ่มหมวดหมู่สำเร็จ')
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
    showSuccess('แก้ไขหมวดหมู่สำเร็จ')
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
    showSuccess('ลบหมวดหมู่สำเร็จ')
  } catch (err) {
    console.error('Delete category error:', err)
    error.value = err.response?.data?.message || 'ไม่สามารถลบหมวดหมู่ได้'
  }
}

const addOption = () => {
  newQuestion.value.options.push({ text: '' })
}

const removeOption = (index) => {
  newQuestion.value.options.splice(index, 1)
}

const moveOptionUp = (index, context) => {
  const options = context === 'new' ? newQuestion.value.options : inlineEditData.value.options
  if (index > 0) {
    const temp = options[index]
    options[index] = options[index - 1]
    options[index - 1] = temp
  }
}

const moveOptionDown = (index, context) => {
  const options = context === 'new' ? newQuestion.value.options : inlineEditData.value.options
  if (index < options.length - 1) {
    const temp = options[index]
    options[index] = options[index + 1]
    options[index + 1] = temp
  }
}

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
    
    newQuestion.value = {
      categoryId: '',
      text: '',
      options: [{ text: '' }, { text: '' }]
    }
    showAddForm.value = false
    showSuccess('เพิ่มคำถามสำเร็จ')
    
    await loadData()
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

const startInlineEdit = (question) => {
  const categoryQuestions = getQuestionsWithSequentialNumbers(question.categoryId)
  const questionWithNumber = categoryQuestions.find(q => q.id === question.id)
  
  editingQuestionId.value = question.id
  inlineEditData.value = {
    text: question.text,
    categoryId: question.categoryId,
    options: question.options.map(opt => ({ ...opt })),
    displayNumber: questionWithNumber ? questionWithNumber.sequentialNumber : 1
  }
}

const saveInlineEdit = async () => {
  if (!inlineEditData.value.text.trim()) {
    alert('กรุณากรอกคำถาม')
    return
  }
  
  const validOptions = inlineEditData.value.options.filter(opt => opt.text.trim())
  if (validOptions.length === 0) {
    alert('กรุณากรอกตัวเลือกอย่างน้อย 1 ข้อ')
    return
  }
  
  submitting.value = true
  error.value = ''
  try {
    const updateData = {
      categoryId: parseInt(inlineEditData.value.categoryId),
      text: inlineEditData.value.text.trim(),
      options: validOptions.map(opt => ({ text: opt.text.trim() }))
    }
    
    // Check if question number changed - support any value (string or number)
    const categoryQuestions = getQuestionsWithSequentialNumbers(inlineEditData.value.categoryId)
    const currentQuestion = categoryQuestions.find(q => q.id === editingQuestionId.value)
    
    // Convert displayNumber to number if it's a valid number, otherwise keep as string
    const newDisplayNumber = inlineEditData.value.displayNumber
    const currentDisplayNumber = currentQuestion ? currentQuestion.sequentialNumber : 1
    
    if (newDisplayNumber != currentDisplayNumber) {
      // If it's a number, convert to order (0-based), otherwise send as custom text
      if (!isNaN(newDisplayNumber) && newDisplayNumber !== '') {
        updateData.order = parseInt(newDisplayNumber) - 1
      } else {
        // Store custom text as order (backend should handle this)
        updateData.order = newDisplayNumber
      }
    }
    
    const response = await axios.put(`${API_BASE_URL}/questions/${editingQuestionId.value}`, updateData)
    
    const index = allQuestions.value.findIndex(q => q.id === editingQuestionId.value)
    if (index !== -1) {
      allQuestions.value[index] = response.data
    }
    editingQuestionId.value = null
    inlineEditData.value = { text: '', options: [], categoryId: null, displayNumber: '' }
    showSuccess('แก้ไขคำถามสำเร็จ')
    
    await loadData()
  } catch (err) {
    console.error('Update question error:', err)
    error.value = err.response?.data?.message || 'ไม่สามารถแก้ไขคำถามได้'
  } finally {
    submitting.value = false
  }
}

const cancelInlineEdit = () => {
  editingQuestionId.value = null
  inlineEditData.value = { text: '', options: [], categoryId: null, displayNumber: '' }
}

const addInlineEditOption = () => {
  inlineEditData.value.options.push({ text: '' })
}

const removeInlineEditOption = (index) => {
  inlineEditData.value.options.splice(index, 1)
}

const deleteQuestion = async (id) => {
  if (!confirm('คุณต้องการลบคำถามนี้หรือไม่?')) return
  
  error.value = ''
  try {
    await axios.delete(`${API_BASE_URL}/questions/${id}`)
    allQuestions.value = allQuestions.value.filter(q => q.id !== id)
    showSuccess('ลบคำถามสำเร็จ')
    
    await loadData()
  } catch (err) {
    console.error('Delete question error:', err)
    error.value = err.response?.data?.message || 'ไม่สามารถลบคำถามได้'
  }
}

const moveQuestion = async (questionId, newCategoryId) => {
  if (!newCategoryId) return
  
  error.value = ''
  try {
    const response = await axios.put(`${API_BASE_URL}/questions/${questionId}/move`, {
      newCategoryId: parseInt(newCategoryId)
    })
    
    const index = allQuestions.value.findIndex(q => q.id === questionId)
    if (index !== -1) {
      allQuestions.value[index] = response.data
    }
    showSuccess('ย้ายคำถามสำเร็จ')
    
    await loadData()
  } catch (err) {
    console.error('Move question error:', err)
    error.value = err.response?.data?.message || 'ไม่สามารถย้ายคำถามได้'
  }
}
</script>

<style scoped>
/* Minimal custom styles - most styling is done with Tailwind */
</style>