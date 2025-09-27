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
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          เพิ่ม
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
            v-model="newQuestion.category" 
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
    </div>

    <!-- Edit Question Form -->
    <div v-if="editingQuestion" class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h5 class="font-medium text-gray-900 mb-3">แก้ไขคำถาม</h5>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่</label>
          <select 
            v-model="editingQuestion.category" 
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
                  class="text-green-600 hover:text-green-800 px-2 py-1 text-sm font-medium"
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
                        v-for="option in question.options" 
                        :key="option.id" 
                        class="flex items-center gap-2"
                      >
                        <span class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                          {{ option.id }}
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
                    :value="question.category"
                    @change="moveQuestion(question.id, $event.target.value)"
                    class="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">ย้ายไปหมวดหมู่...</option>
                    <option 
                      v-for="cat in categories" 
                      :key="cat.id" 
                      :value="cat.id"
                      :disabled="cat.id === question.category"
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
        <span class="text-gray-700">สรุป: {{ categories.length }} หมวดหมู่, {{ questions.length }} คำถาม</span>
        <div class="flex gap-4 text-xs text-gray-600">
          <span>📝 คำถามแบบปรนัย</span>
          <span>⚙️ ตัวเลือกแก้ไขได้</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { categories as initialCategories, questions as initialQuestions } from './Questions.js'

const categories = reactive([])
const questions = reactive([])

const newQuestion = reactive({
  category: '',
  text: '',
  options: [{ id: 1, text: '' }, { id: 2, text: '' }]
})

const showAddForm = ref(false)
const showCategoryForm = ref(false)
const editingQuestion = ref(null)
const newCategoryName = ref('')

// Load initial data
onMounted(() => {
  // Load categories
  categories.splice(0, categories.length, ...initialCategories.map(cat => ({
    ...cat,
    editing: false,
    tempName: ''
  })))
  
  // Load questions
  questions.splice(0, questions.length, ...initialQuestions)
})

const getQuestionsByCategory = (categoryId) => {
  return questions.filter(question => question.category === categoryId)
}

const addCategory = () => {
  if (newCategoryName.value.trim()) {
    const newId = Math.max(...categories.map(c => c.id), 0) + 1
    categories.push({
      id: newId,
      name: newCategoryName.value.trim(),
      editing: false,
      tempName: ''
    })
    newCategoryName.value = ''
    showCategoryForm.value = false
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

const saveCategoryName = (category) => {
  if (category.tempName.trim()) {
    category.name = category.tempName.trim()
  }
  category.editing = false
  category.tempName = ''
}

const cancelCategoryEdit = (category) => {
  category.editing = false
  category.tempName = ''
}

const deleteCategory = (categoryId) => {
  const questionsInCategory = questions.filter(q => q.category === categoryId)
  if (questionsInCategory.length > 0) {
    if (!confirm(`หมวดหมู่นี้มี ${questionsInCategory.length} คำถาม คุณต้องการลบหมวดหมู่และคำถามทั้งหมดหรือไม่?`)) {
      return
    }
    // ลบคำถามในหมวดหมู่นี้ด้วย
    questionsInCategory.forEach(q => {
      const qIndex = questions.findIndex(question => question.id === q.id)
      if (qIndex !== -1) questions.splice(qIndex, 1)
    })
  }
  
  const categoryIndex = categories.findIndex(c => c.id === categoryId)
  if (categoryIndex !== -1) {
    categories.splice(categoryIndex, 1)
  }
}

const addOption = () => {
  const newId = Math.max(...newQuestion.options.map(opt => opt.id), 0) + 1
  newQuestion.options.push({ id: newId, text: '' })
}

const removeOption = (index) => {
  newQuestion.options.splice(index, 1)
  // Update option IDs to maintain sequence
  newQuestion.options.forEach((option, i) => {
    option.id = i + 1
  })
}

const addEditOption = () => {
  const newId = Math.max(...editingQuestion.value.options.map(opt => opt.id), 0) + 1
  editingQuestion.value.options.push({ id: newId, text: '' })
}

const removeEditOption = (index) => {
  editingQuestion.value.options.splice(index, 1)
  // Update option IDs to maintain sequence
  editingQuestion.value.options.forEach((option, i) => {
    option.id = i + 1
  })
}

const addQuestion = () => {
  if (newQuestion.category && newQuestion.text.trim() && 
      newQuestion.options.every(opt => opt.text.trim())) {
    const newId = Math.max(...questions.map(q => q.id), 0) + 1
    questions.push({
      id: newId,
      category: parseInt(newQuestion.category),
      text: newQuestion.text.trim(),
      options: newQuestion.options.map(opt => ({ ...opt, text: opt.text.trim() }))
    })
    
    // Reset form
    newQuestion.category = ''
    newQuestion.text = ''
    newQuestion.options = [{ id: 1, text: '' }, { id: 2, text: '' }]
    showAddForm.value = false
  } else {
    alert('กรุณากรอกข้อมูลให้ครบถ้วน')
  }
}

const cancelAdd = () => {
  newQuestion.category = ''
  newQuestion.text = ''
  newQuestion.options = [{ id: 1, text: '' }, { id: 2, text: '' }]
  showAddForm.value = false
}

const startEdit = (question) => {
  editingQuestion.value = {
    id: question.id,
    category: question.category,
    text: question.text,
    options: question.options.map(opt => ({ ...opt }))
  }
}

const saveEdit = () => {
  if (editingQuestion.value.category && editingQuestion.value.text.trim() &&
      editingQuestion.value.options.every(opt => opt.text.trim())) {
    const question = questions.find(q => q.id === editingQuestion.value.id)
    if (question) {
      question.category = parseInt(editingQuestion.value.category)
      question.text = editingQuestion.value.text.trim()
      question.options = editingQuestion.value.options.map(opt => ({ 
        ...opt, 
        text: opt.text.trim() 
      }))
    }
    editingQuestion.value = null
  } else {
    alert('กรุณากรอกข้อมูลให้ครบถ้วน')
  }
}

const cancelEdit = () => {
  editingQuestion.value = null
}

const deleteQuestion = (id) => {
  if (confirm('คุณต้องการลบคำถามนี้หรือไม่?')) {
    const index = questions.findIndex(q => q.id === id)
    if (index !== -1) {
      questions.splice(index, 1)
    }
  }
}

const moveQuestion = (questionId, newCategoryId) => {
  if (newCategoryId) {
    const question = questions.find(q => q.id === questionId)
    if (question) {
      question.category = parseInt(newCategoryId)
    }
  }
}
</script>