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

      <!-- Toggle All Button -->
      <div class="mb-6 text-right">
        <button
          @click="toggleAllQuestions"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
        >
          {{ allExpanded ? 'ปิดทั้งหมด' : 'เปิดทั้งหมด' }}
        </button>
      </div>

      <!-- Questions List -->
      <div class="space-y-4">
        <div
          v-for="item in evaluateOpinions"
          :key="item.id"
          class="bg-white rounded-lg shadow border"
        >
          <!-- Question Header -->
          <div class="p-4 border-b bg-gray-50">
            <div class="flex justify-between items-center">
              <div class="flex-1">
                <h3 class="font-medium text-gray-800 mb-1">
                  ข้อที่ {{ item.id }}
                </h3>
                <p class="text-sm text-gray-600">
                  {{ item.question }}
                </p>
              </div>
              <button
                @click="toggleQuestion(item.id)"
                class="ml-4 p-2 text-gray-500 hover:text-gray-700"
              >
                <svg
                  :class="{ 'rotate-180': expandedQuestions.includes(item.id) }"
                  class="w-5 h-5 transform transition-transform"
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
      expandedQuestions: []
    }
  },
  computed: {
    totalOpinions() {
      return this.evaluateOpinions.reduce((total, item) => total + item.opinions.length, 0)
    },
    allExpanded() {
      return this.expandedQuestions.length === this.evaluateOpinions.length
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
        this.expandedQuestions = this.evaluateOpinions.map(item => item.id)
      }
    },
    getInitials(name) {
      return name.split(' ').map(word => word.charAt(0)).join('')
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
</style>