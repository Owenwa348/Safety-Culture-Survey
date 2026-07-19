<!-- Frontend Safety-Culture-Survey\src\views\Assessor\PageAboutUs\TeamMemberProfile.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const memberId = route.params.id

const expandedExperience = ref({})
const expandedEducation = ref({})
const pageVisible = ref(false)

const toggleExperience = (index) => {
  expandedExperience.value[index] = !expandedExperience.value[index]
}

const toggleEducation = (index) => {
  expandedEducation.value[index] = !expandedEducation.value[index]
}

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
      "ความปลอดภัยในการทำงานบนที่สูง",
      "การจัดการข้อผิดพลาดและละเมิดกฎของมนุษย์ (Human Error and Violation Management)",
    ],
    image: "/คทาประภาสะวัต.webp",
    workexperience: [
      {
        title: "Managing Director & Senior Consultant",
        company: "VERTE SMART SOLUTION Co., Ltd.",
        details: [
          "ผู้สอน / ที่ปรึกษา PSM implementation",
          "ที่ปรึกษาการสร้างระบบ Safety Culture",
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
        company: "BST and BST-NBL | May 2008 – Oct 2015",
        details: [
          "ประสบการณ์ในการบริหารจัดการด้านความปลอดภัย อาชีวอนามัย ในช่วงการผลิต",
          "Team member to develop PSI, PHA, II and EPR standard",
          "PSI, PHA team member ร่วมกับบริษัท DuPont ในการทำ HAZOP, LOPA, Consequence analysis (PHAST) และ SIL",
          "ทบทวน ตรวจสอบการออกแบบระบบดับเพลิง ตามมาตรฐาน NFPA 101, 10, 11, 12, 13, 14, 15, 20",
          "ประสบการณ์ด้านการสอบสวนอุบัติการณ์โดย Root Cause Analysis"
        ]
      },
      {
        title: "Safety Officer",
        company: "SCG Paper | Apr 2007 – May 2008",
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
        major: "B.Sc., Occupational Health and Safety | March 2007",
        university: "มหาวิทยาลัยมหิดล",
      }
    ],
    qualifications: [
      "ใบอนุญาตประกอบวิชาชีพวิทยาศาสตร์และเทคโนโลยีควบคุม สาขาอาชีวอนามัยและความปลอดภัย ระดับเชี่ยวชาญ",
      "ผู้ควบคุมระบบบำบัดมลพิษอากาศ",
      "ผู้ควบคุมมลพิษกากอุตสาหกรรม",
      "บุคลากรรับผิดชอบวัตถุอันตราย (บฉ.3)",
      "CQI IRAC Lead Auditor ISO14001",
      "CQI IRAC Lead Auditor ISO45001",
      "External Auditor PSM (I-0185)",
      "วิทยากรความปลอดภัยในการทำงานที่อับอากาศ",
      "Industrial Rope Access Trade Association",
    ],
    contact: [
      {
        address: "บริษัท เวอร์เท่ สมาร์ท โซลูชั่น จำกัด เลขที่ 18/76 หมู่ที่ 1 ตำบลเนินพระ อำเภอเมืองระยอง จังหวัดระยอง 21000",
        email: "kathe@vertesmartsolution.com",
        phone: "087-074-1477",
        facebook: "VERTE SMART Solution",
        linkedin: "Katha Prabhasavat",
        youtube: ["VERTE SMART SOLUTION"],
        website: "https://www.vertesmartsolution.com",
        line: "https://line.me/ti/p/~kpvkpv"
      }
    ]
  },
]

const member = ref(null)
const isLoading = ref(true)

onMounted(() => {
  setTimeout(() => {
    member.value = teamMembers.find(m => m.id.toString() === memberId)
    isLoading.value = false
    setTimeout(() => { pageVisible.value = true }, 50)
  }, 400)
})
</script>

<template>
  <div class="min-h-screen bg-[#0A1628]">

    <!-- ══════════════ LOADING ══════════════ -->
    <div v-if="isLoading" class="flex justify-center items-center min-h-screen">
      <div class="flex flex-col items-center gap-4">
        <div class="w-12 h-12 rounded-full border-2 border-[#7AE2CF]/20 border-t-[#7AE2CF] animate-spin"></div>
        <p class="text-[#7AE2CF]/60 text-sm tracking-widest uppercase">กำลังโหลด</p>
      </div>
    </div>

    <!-- ══════════════ MEMBER NOT FOUND ══════════════ -->
    <div v-else-if="!member" class="flex justify-center items-center min-h-screen px-4">
      <div class="text-center">
        <div class="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-white mb-2">ไม่พบข้อมูลวิทยากร</h3>
        <p class="text-white/40 text-sm mb-8">กรุณาตรวจสอบข้อมูลอีกครั้งหรือติดต่อผู้ดูแลระบบ</p>
        <router-link
          to="/about"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7AE2CF]/10 border border-[#7AE2CF]/30 text-[#7AE2CF] text-sm font-medium hover:bg-[#7AE2CF]/20 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          กลับหน้าเกี่ยวกับเรา
        </router-link>
      </div>
    </div>

    <!-- ══════════════ MAIN CONTENT ══════════════ -->
    <div
      v-else
      class="transition-all duration-700"
      :class="pageVisible ? 'opacity-100' : 'opacity-0'"
    >
      <!-- ── HERO BANNER ── -->
      <div class="relative overflow-hidden">
        <!-- Animated background grid -->
        <div class="absolute inset-0 hero-grid opacity-10"></div>
        <!-- Teal glow -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full bg-[#7AE2CF]/10 blur-3xl pointer-events-none"></div>

        <div class="relative max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-10 sm:pt-28 sm:pb-14">
          <!-- Back link -->
          <router-link
            to="/about"
            class="inline-flex items-center gap-2 text-[#7AE2CF]/60 hover:text-[#7AE2CF] text-sm mb-8 transition-colors group"
          >
            <svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            กลับหน้าทีมงาน
          </router-link>

          <!-- Profile block -->
          <div class="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8">
            <!-- Photo -->
            <div class="relative flex-shrink-0">
              <div class="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[#7AE2CF]/40 to-blue-500/20 blur-sm"></div>
              <img
                :src="member.image"
                :alt="member.name"
                class="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-2xl object-cover border-2 border-[#7AE2CF]/30 shadow-2xl"
              />
            </div>

            <!-- Name / title -->
            <div class="text-center sm:text-left pb-1">
              <!-- Eyebrow -->
              <div class="flex items-center justify-center sm:justify-start gap-2 mb-3">
                <div class="w-4 h-px bg-[#7AE2CF]"></div>
                <span class="text-[#7AE2CF] text-xs tracking-[0.25em] uppercase font-semibold">วิทยากรผู้เชี่ยวชาญ</span>
              </div>
              <h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">{{ member.name }}</h1>
              <p class="mt-2 text-white/50 text-sm sm:text-base leading-relaxed max-w-md">{{ member.position }}</p>
            </div>
          </div>
        </div>

        <!-- Bottom fade -->
        <div class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0A1628] to-transparent"></div>
      </div>

      <!-- ── PAGE BODY ── -->
      <div class="max-w-5xl mx-auto px-4 sm:px-6 pb-24 space-y-6">

        <!-- ── EDUCATION ── -->
        <section class="content-card">
          <div class="section-header">
            <div class="section-icon bg-emerald-500/10 border-emerald-500/30">
              <svg class="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
              </svg>
            </div>
            <h2 class="section-title">การศึกษา</h2>
          </div>

          <div class="space-y-3">
            <div
              v-for="(edu, index) in member.education"
              :key="index"
              class="item-row"
            >
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-400 mt-2"></div>
                <div class="min-w-0">
                  <p class="text-white font-semibold text-sm sm:text-base">{{ edu.university }}</p>
                  <p class="text-white/60 text-sm mt-0.5">{{ edu.major }}</p>
                  <p v-if="edu.degree" class="text-white/40 text-xs mt-0.5 italic">{{ edu.degree }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ── QUALIFICATIONS ── -->
        <section class="content-card">
          <div class="section-header">
            <div class="section-icon bg-amber-500/10 border-amber-500/30">
              <svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <h2 class="section-title">คุณสมบัติและใบรับรอง</h2>
          </div>

          <div class="grid sm:grid-cols-2 gap-2">
            <div
              v-for="(q, index) in member.qualifications"
              :key="index"
              class="flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-white/3 transition-colors"
            >
              <div class="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400 mt-2"></div>
              <p class="text-white/70 text-sm leading-relaxed">{{ q }}</p>
            </div>
          </div>
        </section>

        <!-- ── WORK EXPERIENCE ── -->
        <section class="content-card">
          <div class="section-header">
            <div class="section-icon bg-blue-500/10 border-blue-500/30">
              <svg class="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6.5A1.5 1.5 0 0116.5 16H15v-1a2 2 0 00-2-2H7a2 2 0 00-2 2v1H3.5A1.5 1.5 0 012 14.5V8a2 2 0 012-2h2zM10 5a1 1 0 011 1v1H9V6a1 1 0 011-1z" clip-rule="evenodd"/>
              </svg>
            </div>
            <h2 class="section-title">ประสบการณ์ทำงาน</h2>
          </div>

          <!-- Timeline -->
          <div class="relative">
            <!-- Vertical line -->
            <div class="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-[#7AE2CF]/40 via-blue-500/20 to-transparent sm:left-4"></div>

            <div class="space-y-3">
              <div
                v-for="(exp, index) in member.workexperience"
                :key="index"
                class="relative pl-10 sm:pl-12"
              >
                <!-- Timeline dot -->
                <div class="absolute left-0 top-3.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#0F2040] border border-[#7AE2CF]/30 flex items-center justify-center">
                  <div class="w-2 h-2 rounded-full bg-[#7AE2CF]"></div>
                </div>

                <!-- Accordion card -->
                <div class="rounded-xl border border-white/8 bg-white/3 overflow-hidden hover:border-[#7AE2CF]/20 transition-colors">
                  <button
                    @click="toggleExperience(index)"
                    class="w-full flex items-center justify-between px-4 py-3.5 text-left gap-4"
                  >
                    <div class="min-w-0">
                      <p class="text-white font-semibold text-sm sm:text-base leading-snug">{{ exp.title }}</p>
                      <p v-if="exp.company" class="text-white/40 text-xs mt-0.5 truncate">{{ exp.company }}</p>
                    </div>
                    <svg
                      v-if="exp.details && exp.details.length"
                      :class="{ 'rotate-180': expandedExperience[index] }"
                      class="w-4 h-4 text-[#7AE2CF]/60 flex-shrink-0 transition-transform duration-200"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>

                  <div
                    v-if="exp.details && exp.details.length"
                    v-show="expandedExperience[index]"
                    class="border-t border-white/6 px-4 py-3 space-y-2 bg-white/2"
                  >
                    <div
                      v-for="(detail, di) in exp.details"
                      :key="di"
                      class="flex items-start gap-2.5"
                    >
                      <div class="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#7AE2CF]/60 mt-2"></div>
                      <p class="text-white/60 text-sm leading-relaxed">{{ detail }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ── COURSES TAUGHT ── -->
        <section class="content-card">
          <div class="section-header">
            <div class="section-icon bg-purple-500/10 border-purple-500/30">
              <svg class="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
              </svg>
            </div>
            <h2 class="section-title">หลักสูตรที่สอน</h2>
          </div>

          <div class="grid sm:grid-cols-2 gap-2">
            <div
              v-for="(course, index) in member.coursetaught"
              :key="index"
              class="flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-white/3 transition-colors"
            >
              <div class="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-purple-400 mt-2"></div>
              <p class="text-white/70 text-sm leading-relaxed">{{ course }}</p>
            </div>
          </div>
        </section>

        <!-- ── CONTACT ── -->
        <section class="content-card">
          <div class="section-header">
            <div class="section-icon bg-[#7AE2CF]/10 border-[#7AE2CF]/30">
              <svg class="w-4 h-4 text-[#7AE2CF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
            </div>
            <h2 class="section-title">ติดต่อวิทยากร</h2>
          </div>

          <div v-for="(contact, index) in member.contact" :key="index">
            <!-- Address -->
            <div class="contact-item mb-4 p-4 rounded-xl border border-white/8 bg-white/3">
              <p class="text-white/40 text-xs mb-1 uppercase tracking-wider">ที่อยู่</p>
              <p class="text-white/70 text-sm leading-relaxed">{{ contact.address }}</p>
            </div>

            <!-- Contact grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

              <!-- Phone -->
              <a :href="`tel:${contact.phone}`" class="contact-link group">
                <div class="contact-link-icon bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-500/20">
                  <svg class="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                </div>
                <div class="min-w-0">
                  <p class="text-white/40 text-xs">โทรศัพท์</p>
                  <p class="text-white text-sm font-medium truncate">{{ contact.phone }}</p>
                </div>
              </a>

              <!-- Email -->
              <a :href="`mailto:${contact.email}`" class="contact-link group">
                <div class="contact-link-icon bg-blue-500/10 border-blue-500/20 group-hover:bg-blue-500/20">
                  <svg class="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                </div>
                <div class="min-w-0">
                  <p class="text-white/40 text-xs">อีเมล</p>
                  <p class="text-white text-sm font-medium truncate">{{ contact.email }}</p>
                </div>
              </a>

              <!-- Line -->
              <a :href="contact.line" target="_blank" class="contact-link group">
                <div class="contact-link-icon bg-green-500/10 border-green-500/20 group-hover:bg-green-500/20">
                  <svg class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.070 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                  </svg>
                </div>
                <div class="min-w-0">
                  <p class="text-white/40 text-xs">Line</p>
                  <p class="text-white text-sm font-medium truncate">เพิ่มเพื่อน</p>
                </div>
              </a>

              <!-- Facebook -->
              <div class="contact-link group cursor-pointer">
                <div class="contact-link-icon bg-blue-600/10 border-blue-600/20 group-hover:bg-blue-600/20">
                  <svg class="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div class="min-w-0">
                  <p class="text-white/40 text-xs">Facebook</p>
                  <p class="text-white text-sm font-medium truncate">{{ contact.facebook }}</p>
                </div>
              </div>

              <!-- LinkedIn -->
              <a href="https://www.linkedin.com/company/verte-smart-solution/about/?viewAsMember=true" target="_blank" class="contact-link group">
                <div class="contact-link-icon bg-sky-600/10 border-sky-600/20 group-hover:bg-sky-600/20">
                  <svg class="w-4 h-4 text-sky-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <div class="min-w-0">
                  <p class="text-white/40 text-xs">LinkedIn</p>
                  <p class="text-white text-sm font-medium truncate">{{ contact.linkedin }}</p>
                </div>
              </a>

              <!-- YouTube -->
              <div v-for="(yt, ytIndex) in contact.youtube" :key="ytIndex" class="contact-link group cursor-pointer">
                <div class="contact-link-icon bg-red-500/10 border-red-500/20 group-hover:bg-red-500/20">
                  <svg class="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <div class="min-w-0">
                  <p class="text-white/40 text-xs">YouTube</p>
                  <p class="text-white text-sm font-medium truncate">{{ yt }}</p>
                </div>
              </div>

              <!-- Website -->
              <a :href="contact.website" target="_blank" class="contact-link group sm:col-span-2 lg:col-span-1">
                <div class="contact-link-icon bg-purple-500/10 border-purple-500/20 group-hover:bg-purple-500/20">
                  <svg class="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                  </svg>
                </div>
                <div class="min-w-0">
                  <p class="text-white/40 text-xs">Website</p>
                  <p class="text-[#7AE2CF] text-sm font-medium truncate">{{ contact.website }}</p>
                </div>
              </a>

            </div>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── Grid bg ── */
.hero-grid {
  background-image:
    linear-gradient(rgba(122,226,207,0.2) 1px, transparent 1px),
    linear-gradient(90deg, rgba(122,226,207,0.2) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 100% 100% at 50% 0%, black 40%, transparent 100%);
}

/* ── Content card ── */
.content-card {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 1rem;
  padding: 1.5rem;
}
@media (min-width: 640px) {
  .content-card { padding: 2rem; }
}

/* ── Section header ── */
.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}
.section-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  border-width: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s;
}
.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.01em;
}
@media (min-width: 640px) {
  .section-title { font-size: 1.125rem; }
}

/* ── Item row ── */
.item-row {
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.02);
  transition: border-color 0.2s;
}
.item-row:hover { border-color: rgba(122,226,207,0.15); }

/* ── Contact link ── */
.contact-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(255,255,255,0.07);
  background: rgba(255,255,255,0.02);
  transition: border-color 0.2s, background 0.2s;
  text-decoration: none;
}
.contact-link:hover { border-color: rgba(255,255,255,0.14); background: rgba(255,255,255,0.04); }

.contact-link-icon {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.625rem;
  border-width: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s;
}

/* ── Reduced motion ── */
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
</style>