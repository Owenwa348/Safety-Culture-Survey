<script setup>
import Footer from "../../../components/Footer.vue";
import NavBar from "../../../components/NavBar.vue";
import { ref } from "vue";

const isOpen = ref(false);

// ข้อมูลทีมวิทยากร
const teamMembers = ref([
  {
    id: 1,
    name: "คทา ประภาสะวัต",
    position: "ความปลอดภัย ความปลอดภัยกระบวนการผลิต SSHE software",
    image: "/คทาประภาสะวัต.webp",
  },
]);
</script>

<template>
  <div class="min-h-screen">
    <NavBar />
    <div class="from-gray-50 to-white min-h-screen">
      <div class="z-10 pt-20 pb-16">

        <div class="text-center mb-16">
          <h4 class="text-3xl font-bold mb-4 relative inline-block">
            เกี่ยวกับเรา
            <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-45 h-1 bg-gradient-to-r from-[#7AE2CF] to-blue-400 rounded-full"></div>
          </h4>
        </div>

        <!-- ข้อมูลบริษัท -->
        <section class="max-w-6xl mx-auto relative px-4 mb-24">
          <div class="relative flex flex-col md:flex-row items-center">
            <div class="w-full md:w-7/12 group relative">
              <div class="relative overflow-hidden rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-105">
                <img
                  src="/industryv2.jpg"
                  alt="โรงงาน"
                  class="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div class="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-[#7AE2CF] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div class="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-[#7AE2CF] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>

            <!-- กล่องข้อความ -->
            <div class="w-full md:w-8/12 bg-white border-l-6 border-[#7AE2CF] p-8 rounded-2xl shadow-2xl relative overflow-hidden transform transition-all duration-300 hover:shadow-3xl md:-ml-32 mt-8 md:mt-0 z-10">
              <div class="absolute top-0 right-0 w-32 h-32 opacity-5">
                <svg viewBox="0 0 100 100" class="w-full h-full">
                  <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#7AE2CF" stroke-width="1" />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#grid)" />
                </svg>
              </div>

              <div class="flex items-center mb-6">
                <div class="w-12 h-12 bg-gradient-to-br from-[#7AE2CF] to-blue-400 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    ></path>
                  </svg>
                </div>
                <h2 class="text-3xl font-bold text-[#000000]">Verte Smart Solution</h2>
              </div>

              <div class="relative mb-6">
                <div class="h-1 bg-gradient-to-r from-[#7AE2CF] via-blue-400 to-green-400 rounded-full"></div>
                <div class="absolute top-0 left-0 h-1 w-0 bg-white rounded-full animate-pulse"></div>
              </div>

              <div class="space-y-6">
                <div class="relative pl-6">
                  <div class="absolute left-0 top-2 w-2 h-2 bg-[#7AE2CF] rounded-full"></div>
                  <p class="text-[#000000] text-xl leading-relaxed font-medium relative">
                    <span class="bg-gradient-to-r from-[#7AE2CF]/10 to-transparent px-2 py-1 rounded">
                      "Empowering Thai industry to enhance safety, reduce risks, and drive a future of sustainable operational excellence through SHE innovation"
                    </span>
                  </p>
                </div>

                <div class="relative pl-6">
                  <div class="absolute left-0 top-2 w-2 h-2 bg-blue-400 rounded-full"></div>
                  <p class="text-[#000000] text-xl leading-relaxed font-medium relative">
                    <span class="bg-gradient-to-r from-blue-400/10 to-transparent px-2 py-1 rounded">
                      "เสริมพลังให้อุตสาหกรรมไทย ยกระดับความปลอดภัย ลดความเสี่ยง และขับเคลื่อนสู่ความเป็นเลิศในการดำเนินงานอย่างยั่งยืน ผ่านนวัตกรรมด้านความปลอดภัย อาชีวอนามัย และสิ่งแวดล้อม (SHE)"
                    </span>
                  </p>
                </div>
              </div>

              <div class="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-[#7AE2CF]/10 to-transparent rounded-tl-full"></div>
            </div>
          </div>
        </section>

        <!-- Divider Section -->
        <div class="max-w-4xl mx-auto px-4 mb-16">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center">
              <div class="bg-white px-6">
                <div class="flex items-center space-x-4">
                  <div class="w-3 h-3 bg-[#7AE2CF] rounded-full animate-pulse"></div>
                  <div class="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style="animation-delay: 0.5s"></div>
                  <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse" style="animation-delay: 1s"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- วิทยากร -->
        <section class="max-w-6xl mx-auto px-4">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold mb-4 relative inline-block">
              ทีมวิทยากรผู้เชี่ยวชาญ
              <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-85 h-1 bg-gradient-to-r from-[#7AE2CF] to-blue-400 "></div>
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mb-16 ">
            <router-link
                v-for="member in teamMembers"
              :key="member.id"
              :to="{ name: 'TeamMemberProfile', params: { id: member.id } }"
              class="group relative bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-3xl max-w-sm w-full">
              <div class="relative h-64 overflow-hidden">
                <img :src="member.image" :alt="member.name" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div
                  v-if="member.experience"
                  class="absolute top-4 right-4 bg-[#7AE2CF] text-white px-3 py-1 rounded-full text-sm font-semibold"
                >
                  {{ member.experience }}
                </div>
              </div>

              <div class="p-6 relative">
                <div class="mb-4">
                  <h3 class="text-xl font-bold text-[#000000] mb-2">{{ member.name }}</h3>
                  <p class="text-[#7AE2CF] font-semibold mb-1">{{ member.position }}</p>
                  <p class="text-gray-600 text-sm">{{ member.expertise }}</p>
                </div>

                <p class="text-gray-700 text-sm leading-relaxed mb-4">
                  {{ member.description }}
                </p>

                <div class="h-1 bg-gradient-to-r from-[#7AE2CF] to-blue-400 rounded-full w-1/3 group-hover:w-full transition-all duration-500"></div>
              </div>
            </router-link>
          </div>
        </section>
        <!-- Footer Placeholder -->
        <div class="mt-20 relative overflow-hidden">
          <div class="max-w-4xl mx-auto px-4 mb-8">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gradient-to-r from-[#7AE2CF] to-blue-400"></div>
              </div>
              <div class="relative flex justify-center">
                <div class="bg-white px-6">
                  <div class="flex items-center space-x-4">
                    <div class="w-2 h-2 bg-[#7AE2CF] rounded-full"></div>
                    <div class="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Footer -->
      <Footer/>
    </div>
  </div>
</template>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.shadow-3xl {
  box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
}

.border-l-6 {
  border-left-width: 6px;
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>