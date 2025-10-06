<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Navbar -->
    <NavbarDashboard />

    <!-- Main content -->
    <div class="flex-1 ml-64 p-6">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">
          ผลการประเมินความคิดเห็น
        </h1>
        <p class="text-gray-600">
          แสดงความคิดเห็นจาก 20 ข้อคำถาม
        </p>
      </div>

      <!-- Summary Stats -->
      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
          <div class="p-4">
            <div class="text-2xl font-bold text-blue-600 mb-1">
              {{ evaluateOpinions.length }}
            </div>
            <div class="text-sm text-gray-600">คำถามทั้งหมด</div>
          </div>
          <div class="p-4">
            <div class="text-2xl font-bold text-green-600 mb-1">
              {{ totalOpinions }}
            </div>
            <div class="text-sm text-gray-600">ความคิดเห็นทั้งหมด</div>
          </div>
        </div>
      </div>

      <!-- Search Box -->
      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <div class="flex items-center gap-3">
          <div class="flex-1 relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="ค้นหาจากเลขข้อ"
              class="w-full px-4 py-2.5 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <button
            @click="toggleAllQuestions"
            class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition whitespace-nowrap"
          >
            {{ allExpanded ? 'ปิดทั้งหมด' : 'เปิดทั้งหมด' }}
          </button>
        </div>

        <!-- Search Results Info -->
        <div v-if="searchQuery" class="mt-3 text-sm text-gray-600">
          พบ <span class="font-medium text-blue-600">{{ filteredOpinions.length }}</span> ผลลัพธ์
        </div>
      </div>

      <!-- Questions List -->
      <div class="space-y-4">
        <div
          v-for="item in filteredOpinions"
          :key="item.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <!-- Question Header -->
          <div class="p-4 border-b bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" @click="toggleQuestion(item.id)">
            <div class="flex justify-between items-start gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-semibold">
                    {{ item.id }}
                  </span>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {{ item.opinions.length }} ความคิดเห็น
                  </span>
                </div>
                <p class="text-sm text-gray-700 leading-relaxed">
                  <span v-html="highlightText(item.question)"></span>
                </p>
              </div>
              <button
                class="flex-shrink-0 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  :class="{ 'rotate-180': expandedQuestions.includes(item.id) }"
                  class="w-5 h-5 transform transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Opinions Content -->
          <div
            v-show="expandedQuestions.includes(item.id)"
            class="p-4"
          >
            <!-- Opinion Count -->
            <div class="mb-4">
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {{ item.opinions.length }} ความคิดเห็น
              </span>
            </div>

            <!-- Opinions List -->
            <div class="space-y-3">
              <div
                v-for="(opinion, index) in item.opinions"
                :key="index"
                class="border rounded-md p-3 hover:bg-gray-50"
              >
                <div class="flex items-start space-x-3">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <span class="text-white font-medium text-xs">
                        {{ getInitials(opinion.name) }}
                      </span>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-gray-900 mb-1">
                      {{ opinion.name }}
                    </div>
                    <div class="text-sm text-gray-700">
                      {{ opinion.comment }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Results Message -->
        <div v-if="filteredOpinions.length === 0" class="text-center py-12">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">ไม่พบผลลัพธ์</h3>
          <p class="text-gray-600">ลองค้นหาด้วยคำอื่นหรือเลขข้อที่ต่างกัน</p>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { evaluateOpinions } from './EvaluateOpinion.js'
import NavbarDashboard from '../../../components/NavbarDashboard.vue'

export default {
  name: 'OpinionResults',
  components: {
    NavbarDashboard
  },
  data() {
    return {
      evaluateOpinions: evaluateOpinions,
      expandedQuestions: [],
      selectedQuestion: '',
      searchQuery: '',
      highlightedQuestion: null
    }
  },
  computed: {
    totalOpinions() {
      return this.evaluateOpinions.reduce((total, item) => total + item.opinions.length, 0)
    },
    allExpanded() {
      return this.expandedQuestions.length === this.filteredOpinions.length && this.filteredOpinions.length > 0
    },
    filteredOpinions() {
      if (!this.searchQuery) {
        return this.evaluateOpinions
      }

      const query = this.searchQuery.toLowerCase().trim()
      
      return this.evaluateOpinions.filter(item => {
        // ค้นหาจากเลขข้อ
        if (item.id.toString() === query) {
          return true
        }
        
        // ค้นหาจากคำในคำถาม
        return item.question.toLowerCase().includes(query)
      })
    }
  },
  methods: {
    toggleQuestion(questionId) {
      const index = this.expandedQuestions.indexOf(questionId)
      if (index > -1) {
        this.expandedQuestions.splice(index, 1)
      } else {
        this.expandedQuestions.push(questionId)
      }
    },
    toggleAllQuestions() {
      if (this.allExpanded) {
        this.expandedQuestions = []
      } else {
        this.expandedQuestions = this.filteredOpinions.map(item => item.id)
      }
    },
    getInitials(name) {
      return name.split(' ').map(word => word.charAt(0)).join('')
    },
    jumpToQuestion() {
      if (!this.selectedQuestion) return

      const questionId = this.selectedQuestion
      
      // เปิดคำถามที่เลือก
      if (!this.expandedQuestions.includes(questionId)) {
        this.expandedQuestions.push(questionId)
      }

      // Highlight คำถาม
      this.highlightedQuestion = questionId

      // Scroll ไปยังคำถาม
      this.$nextTick(() => {
        const element = this.$refs[`question-${questionId}`]
        if (element && element[0]) {
          element[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
          
          // ลบ highlight หลัง 2 วินาที
          setTimeout(() => {
            this.highlightedQuestion = null
          }, 2000)
        }
      })

      // Reset dropdown
      setTimeout(() => {
        this.selectedQuestion = ''
      }, 500)
    },
    clearSearch() {
      this.searchQuery = ''
    },
    highlightText(text) {
      if (!this.searchQuery) return text

      const query = this.searchQuery.trim()
      const regex = new RegExp(`(${query})`, 'gi')
      return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>')
    }
  },
  watch: {
    searchQuery(newVal) {
      // เมื่อค้นหา ให้เปิดผลลัพธ์ทั้งหมดอัตโนมัติ
      if (newVal) {
        this.expandedQuestions = this.filteredOpinions.map(item => item.id)
      }
    }
  },
  mounted() {
    // เปิดข้อแรกเป็นค่าเริ่มต้น
    this.expandedQuestions = [1]
  }
}
</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
}

.scroll-mt-24 {
  scroll-margin-top: 6rem;
}

mark {
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
}
</style>