<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const memberId = route.params.id

// เพิ่ม state สำหรับควบคุมการแสดงรายละเอียด
const expandedExperience = ref({})
const expandedEducation = ref({})

// ฟังก์ชันสำหรับ toggle การแสดงรายละเอียด
const toggleExperience = (index) => {
  expandedExperience.value[index] = !expandedExperience.value[index]
}

const toggleEducation = (index) => {
  expandedEducation.value[index] = !expandedEducation.value[index]
}

// ตัวอย่างข้อมูลสมาชิกทั้งหมด
const teamMembers = [
  {
    id: 1,
    name: "นายคทา ประภาสะวัต",
    position: "ความปลอดภัยกระบวนการผลิต SSHE software",
    coursetaught: [
      "การสร้างวัฒนธรรมความปลอดภัย (Safety Culture)",
      "การสร้างผู้นำ ความปลอดภัย (Safety Leadership Program)",
      "การบริหารงานความปลอดภัยด้วย BBS",
      "ความปลอดภัยกระบวนการผลิต (Process Safety Management)",
      "การวิเคราะห์สาเหตุการเกิดอุบัติการณ์ (Root Cause Analysis)",
      "การตัดแยก การล็อคและแขวนป้ายอุปกรณ์ (Isolation & LOTO)",
      "ความปลอดภัยในการทำ งานบนที่สูง",
      "การจัดการข้อผิดพลาดและละเมิดกฎของมนุย",
      "(Human Error and Violation Management)",
    ],
    experience: "15+ ปี",
    image: "/คทาประภาสะวัต.webp",
    workexperience: [
      {
        title: "Managing Director & Senior Consultant",
        company: "VERTE SMART SOLUTION.Co.,Ltd.",
        details: [
          "ผู้สอน / ที่ปรึกษา PSM implementation",
          "่ปรึกษาการสร้างระบบ Safety Culture",
          "ประสบการณ์ PSM external auditor",
          "ผู้เชี่ยวชาญโครงการ Smart Safety Factory โดย กรอ."
        ]
      },
      {
        title: "QSSHE Manager",
        company: "Global Power Synergy Public Company Limited | Nov 2015",
        details: [
          "บริหารงานเชิงกลยุทธ์ company group safety culture roadmap",
          "PSM internal auditor, PSM team member",
          "บริหารงานระบบ ISO 14001 45001 9001 22301",
          "EIA, Eco factory, GI5 and Carbon Footprint Organization"
        ]
      },
      {
        title: "Safety Engineer",
        company: "BST and BST-NBL | May 2008 - Oct 2015",
        details: [
          "ประสบการณ์ในการบริหารจัดการด้านความปลอดภัย อาชีวอนามัย ในช่วงการผลิต และได้รับมอบหมายให้รับผิดชอบงานช่วงการ ก่อสร้าง การเตรียม start up และสร้างระบบการจัดการด้านความ ปลอดภัยของโรงงานแห่งใหม",
          "Team member to develop PSI, PHA, II and EPR standard",
          "PSI, PHA team member ร่วมกับบริษัท DuPont ในการทำ HAZOP,LOPA, Consequence analysis (PHAST) และ SIL",
          "ทบทวน ตรวจสอบการออกแบบระบบดับเพลิง ตามมาตรฐาน NFPA 101, 10, 11, 12, 13, 14, 15, 20",
          "ประสบการ์ด้านการสอบสวนอุบัติการณ์โดย Root Cause Analysis"
        ]
      },
      {
        title: "Safety officer",
        company: "SCG paper | Apr 2007 - May 2008",
        details: []
      },
    ],
    education: [
      {
        degree: "Independent Study: Chemical Dispersion",
        major: "M.Eng., Safety Engineering | March 2011",
        university: "มหาวิทยาลัยเกษตรศาสตร์",
      },
      {
        major: "ฺB.Sc., Occupational Health and Safety | March 2007",
        university: "มหาวิทยาลัยมหิดล",
      }
    ],
    qualifications: [
      "ใบอนุญาตประกอบวิชาชีพวิทยาศาสตร์และ เทคโนโลยีควบคุม สาชาอาชีวอนามัยและ ความปลอดภัย ระดับเชี่ยวชาญ",
      "ผู้ควบคุมระบบบำ บัดมลพิษอากาศ",
      "ผู้ควบคุมมลพิษกากอุตสาหกรรม",
      "บุคลากรรับผิดขอบวัตถุอันตราย (บฉ.3)",
      "CQI IRAC Lead Auditor ISO14001",
      "CQI IRAC Lead Auditor ISO45001",
      "External Auditor PSM (I-0185)",
      "วิทยากรความปลอดภัยในการทำ งานที่อับอากาศ",
      "Industrial Rope Access Trade Association",
    ],
    projects: 40,
    seminars: 25,
    certifications: ["ISO 45001", "OSHA", "NEBOSH"],
    contact: [
      {
        address: "บริษัท เวอร์เท่ สมาร์ท โซลูชั่น จำกัด เลขที่ 18/76 หมู่ที่ 1 ตำบลเนินพระ อำเภอเมืองระยอง จังหวัดระยอง 21000",
        email: "kathe@vertesmartsolution.com",
        phone: "087-074-1477",
        facebook: "VERTE SMART Solution ",
        linkedin:"Katha Prabhasavat",
        youtube: ["VERTE SMART SOLUTION"],
        website: "https://www.vertesmartsolution.com",
        line:"https://line.me/ti/p/~kpvkpv"
      }
    ]
  },
]

const member = ref(null)
const isLoading = ref(true)

onMounted(() => {
  // จำลองการโหลดข้อมูล
  setTimeout(() => {
    member.value = teamMembers.find(m => m.id.toString() === memberId)
    isLoading.value = false
  }, 500)
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <div class="max-w-10xl mx-auto px-4 py-20">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center h-96">
        <!-- <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div> -->
      </div>
      <!-- ข้อมูลวิทยากร -->
      <div v-else-if="member" class="space-y-8">
        <div class="bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-500">
          <!-- Background Pattern -->
          <div class="h-20 relative overflow-hidden" style="background: linear-gradient(to right, #7AE2CF, #077A7D,#06202B);">
            <div class="absolute inset-0 bg-black opacity-10"></div>
          </div>
          <!-- Main Content -->
          
            <!-- Profile Image -->
            <div class="flex justify-center">
              <div class="p-8 flex flex-col items-center gap-6 -mt-3 relative z-10">
    
                <!-- Profile Image -->
                <div class="relative group">
                  <div class="absolute inset-0 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                    <img 
                      :src="member.image" 
                      :alt="member.name" 
                      class="relative w-64 h-64 rounded-2xl object-cover border-4 border-white shadow-2xl transition-transform duration-300" />
              </div>

            <!-- Name & Position -->
            <div class="text-center space-y-2">
              <h4 class="text-3xl font-bold text-gray-800 leading-tight">
                {{ member.name }}
              </h4>
            <div class="inline-block px-6 py-2 rounded-full text-lg font-semibold shadow">
                {{ member.position }}
            </div>
          </div>
        </div>
      </div>
    </div>
        <!-- Description Card -->
        <div class="bg-white rounded-3xl shadow-xl p-8 transform transition-all duration-300">
          <div class="flex items-center mb-6">
            <div class="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-800">เกี่ยวกับวิทยากร</h3>
          </div>
          
          <!-- Education Section -->
          <div class="mb-8 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-2xl p-6 border border-emerald-100">
            <h4 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
              </svg>
              การศึกษา
            </h4>
            
            <div class="space-y-4">
              <div 
                v-for="(edu, index) in member.education" 
                :key="index"
                class="border border-emerald-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <!-- Clickable Header -->
                <div 
                  class="flex items-center justify-between p-4 cursor-pointer hover:bg-emerald-50 transition-colors duration-200">
                  <div class="flex items-center flex-1">
                    <div class="flex-shrink-0 w-3 h-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full mr-4"></div>
                    <div class="flex-1">
                      <span class="font-semibold text-gray-800 text-lg block">{{ edu.university }}</span>
                      <span class="text-base text-gray-600 block">{{ edu.major }}</span>
                      <span class="text-sm text-gray-400 font-light italic">{{ edu.degree }}</span>
                    </div>
                  </div>
                  <div class="flex-shrink-0">
                  </div>
                </div>
                
                <!-- Expandable Content -->
                <div 
                  v-show="expandedEducation[index]"
                  class="border-t border-emerald-100 bg-gradient-to-r from-emerald-50 to-cyan-50 animate-fade-in">
                  <div class="p-4 space-y-3">
                    <div 
                      v-for="(detail, detailIndex) in edu.details" 
                      :key="detailIndex"
                      class="flex items-start">
                      <div class="flex-shrink-0 w-2 h-2 bg-emerald-400 rounded-full mt-2 mr-3"></div>
                      <p class="text-gray-700 text-base leading-relaxed">{{ detail }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 border border-purple-100 shadow-md">
            <h4 class="text-2xl font-bold text-gray-800 mb-5 flex items-center">
              <svg class="w-6 h-6 mr-3 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 6V4c0-.55-.45-1-1-1H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5c.55 0 1-.45 1-1v-2m0-10h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-6" />
                  </svg>
                   คุณสมบัติ
                  </h4>

                <div class="space-y-3 mt-4">
                  <div 
                    v-for="(course, index) in member.qualifications" 
                    :key="index"
                    class="flex items-start">
                      <div class="flex-shrink-0 w-2 h-2 bg-red-600 rounded-full mt-2 mr-4"></div>
                        <p class="text-gray-700 text-base leading-relaxed">{{ course }}</p>
                      </div>
                    </div>
                  </div>
          <!-- Work Experience Section -->
          <div class="mb-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-100">
            <h4 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6.5A1.5 1.5 0 0116.5 16H15v-1a2 2 0 00-2-2H7a2 2 0 00-2 2v1H3.5A1.5 1.5 0 012 14.5V8a2 2 0 012-2h2zM10 5a1 1 0 011 1v1H9V6a1 1 0 011-1z" clip-rule="evenodd"/>
              </svg>
              ประสบการณ์ทำงาน
            </h4>
            
            <!-- Expandable Work Experience -->
            <div class="space-y-4">
              <div 
                v-for="(experience, index) in member.workexperience" 
                :key="index"
                class="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <!-- Clickable Header -->
                <div 
                  @click="toggleExperience(index)"
                  class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200">
                  <div class="flex items-center flex-1">
                    <div class="flex-shrink-0 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-4"></div>
                    <div class="flex-1">
                      <span class="font-semibold text-gray-800 text-lg block">{{ experience.title }}</span>
                      <span 
                        v-if="experience.company" 
                        class="text-sm text-gray-400 font-light italic">
                        {{ experience.company }}
                      </span>
                    </div>
                  </div>
                  <div class="flex-shrink-0">
                    <svg 
                      :class="{ 'rotate-180': expandedExperience[index] }" 
                      class="w-5 h-5 text-gray-500 transform transition-transform duration-200"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                </div>
                
                <!-- Expandable Content -->
                <div 
                  v-show="expandedExperience[index]"
                  class="border-t border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50 animate-fade-in">
                  <div class="p-4 space-y-3">
                    <div 
                      v-for="(detail, detailIndex) in experience.details" 
                      :key="detailIndex"
                      class="flex items-start">
                      <div class="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3"></div>
                      <p class="text-gray-700 text-base leading-relaxed">{{ detail }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Expertise Section -->
          <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
            <h4 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              หลักสูตรที่สอน
            </h4>
            <div class="space-y-3 mt-4 ">
              <div 
                v-for="(course, index) in member.coursetaught" 
                :key="index"
                class="flex items-start">
                <div class="flex-shrink-0 w-2 h-2 bg-purple-600 rounded-full mt-2 mr-4"></div>
                <p class="text-gray-700 text-base leading-relaxed">{{ course }}</p>
              </div>
            </div>
          </div>
        </div>
        

        <!-- Contact Card -->
        <div class="bg-white rounded-3xl shadow-xl p-8">
          <h3 class="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <div class="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-full mr-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
            </div>
            ติดต่อวิทยากร
          </h3>

  <div 
    v-for="(contact, index) in member.contact" 
    :key="index"
    class="border border-emerald-200 rounded-lg p-4 mb-4">
    
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      
      <!-- Address Card - Copy to clipboard -->
      <button 
        @click="copyToClipboard(contact.address, 'ที่อยู่')"
        class="flex items-start space-x-4 bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-xl border border-green-100 hover:shadow-md transition-all duration-200 cursor-pointer w-full text-left group">
        <div class="bg-green-500 p-2 rounded-full flex-shrink-0 group-hover:bg-green-600 transition-colors">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2L3 7v11h4v-6h6v6h4V7l-7-5z"/>
          </svg>
        </div>
        <div class="min-w-0">
          <p class="text-sm text-gray-600">ที่อยู่</p>
          <p class="font-semibold text-gray-800 text-sm leading-relaxed">{{ contact.address }}</p>
        </div>
      </button>

      <!-- Line -->
      <div class="bg-gradient-to-r from-green-50 to-lime-50 p-4 rounded-xl border border-green-100">
        <div class="flex items-center space-x-2 mb-3">
          <div class="bg-green-500 p-2 rounded-full">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.070 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
            </svg>
          </div>
          <p class="text-sm text-gray-600 font-medium">Line</p>
        </div>
        <a :href="contact.line" target="_blank" class="text-green-600 hover:text-green-800 font-semibold text-sm break-all">
          {{ contact.line }}
        </a>
      </div>

      
      
      <!-- Phone Card -->
      <a 
        :href="`tel:${contact.phone}`"
        class="flex items-center space-x-4 bg-gradient-to-r from-green-50 to-lime-50 p-4 rounded-xl border border-green-100 hover:shadow-md transition-all duration-200 cursor-pointer group no-underline">
        <div class="bg-green-500 p-2 rounded-full group-hover:bg-green-600 transition-colors">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
          </svg>
        </div>
        <div>
          <p class="text-sm text-gray-600">โทรศัพท์</p>
          <p class="font-semibold text-gray-800">{{ contact.phone }}</p>
        </div>
      </a>

      <!-- Email Card -->
      <a 
        :href="`mailto:${contact.email}`"
        class="flex items-center space-x-4 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-200 cursor-pointer group no-underline">
        <div class="bg-blue-500 p-2 rounded-full group-hover:bg-blue-600 transition-colors">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
          </svg>
        </div>
        <div>
          <p class="text-sm text-gray-600">อีเมล</p>
          <p class="font-semibold text-gray-800">{{ contact.email }}</p>
        </div>
      </a>
      <!-- Facebook Card -->
      <button 
        @click="openFacebook(contact.facebook)"
        class="flex items-center space-x-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-200 cursor-pointer w-full text-left group">
        <div class="bg-blue-600 p-2 rounded-full group-hover:bg-blue-700 transition-colors">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </div>
        <div>
          <p class="text-sm text-gray-600">Facebook</p>
          <p class="font-semibold text-gray-800">{{ contact.facebook }}</p>
        </div>
      </button>

      <!-- LinkedIn Card -->
       <a href="https://www.linkedin.com/company/verte-smart-solution/about/?viewAsMember=true" aria-label="LinkedIn">
      <button 
        @click="openLinkedIn(contact.linkedin)"
        class="flex items-center space-x-4 bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-200 cursor-pointer w-full text-left group">
        <div class="bg-blue-700 p-2 rounded-full group-hover:bg-blue-800 transition-colors">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </div>
        <div>
          <p class="text-sm text-gray-600">LinkedIn</p>
          <p class="font-semibold text-gray-800">{{ contact.linkedin }}</p>
        </div>
      </button>
      </a>

      <!-- Website Card -->
      <div class="flex items-center space-x-4 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
        <div class="bg-purple-500 p-2 rounded-full">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
          </svg>
        </div>
        <div class="min-w-0">
          <p class="text-sm text-gray-600">Website</p>
          <a :href="contact.website" target="_blank" class="font-semibold text-purple-600 hover:text-purple-800 text-sm break-all">
            {{ contact.website }}
          </a>
        </div>
      </div>

      <div class="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-xl border border-red-100">
        <div class="flex items-center space-x-2 mb-3">
          <div class="bg-red-500 p-2 rounded-full">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
          <p class="text-sm text-gray-600 font-medium">YouTube Channels</p>
        </div>
        <div class="space-y-2">
          <button 
            @click="openYoutube(youtube)"
            v-for="(youtube, ytIndex) in contact.youtube" 
            :key="ytIndex"
            class="flex items-start hover:bg-white hover:bg-opacity-50 p-2 rounded-lg transition-all duration-200 w-full text-left group">
            <div class="flex-shrink-0 w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 group-hover:bg-red-500"></div>
            <p class="text-gray-700 text-sm leading-relaxed group-hover:text-red-600 font-medium">{{ youtube }}</p>
          </button>
        </div>
      </div>
    </div>

  </div>
          

        </div>
      </div>

      <!-- กรณีไม่พบข้อมูล -->
      <div v-else class="text-center mt-20">
        <div class="bg-white rounded-3xl shadow-xl p-12 max-w-md mx-auto">
          <div class="bg-gradient-to-r from-gray-100 to-gray-200 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-800 mb-2">ไม่พบข้อมูลวิทยากร</h3>
          <p class="text-gray-600 mb-6">กรุณาตรวจสอบข้อมูลอีกครั้งหรือติดต่อผู้ดูแลระบบ</p>
          <router-link to="/about" class="w-full">
          <button class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            กลับหน้าหลัก
          </button>
          </router-link>
        </div>
      </div>
      
    </div>
  </div>
</template>

<style scoped>
/* Custom animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* Hover effects */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Gradient text */
.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Smooth transitions */
.transform {
  transition: transform 0.2s ease-in-out;
}

/* Rotation animation for chevron */
.rotate-180 {
  transform: rotate(180deg);
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>