<!-- Frontend Safety-Culture-Survey\src\views\Assessor\PageAboutUs\AboutUs.vue -->
<script setup>
import Footer from "../../../components/Footer.vue";
import NavBar from "../../../components/NavBar.vue";
import { ref, onMounted } from "vue";

const isOpen = ref(false);
const heroVisible = ref(false);
const sectionVisible = ref({});

const teamMembers = ref([
  {
    id: 1,
    name: "คทา ประภาสะวัต",
    position: "ความปลอดภัยกระบวนการผลิต SSHE Software",
    image: "/คทาประภาสะวัต.webp",
    expertise: "Process Safety & SHE Innovation",
  },
]);

onMounted(() => {
  setTimeout(() => { heroVisible.value = true; }, 100);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          sectionVisible.value[entry.target.id] = true;
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll("[data-observe]").forEach((el) => {
    observer.observe(el);
  });
});
</script>

<template>
  <div class="min-h-screen bg-[#0A1628]">
    <NavBar />

    <!-- ═══════════════════════════════════ HERO ═══════════════════════════════════ -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden">

      <!-- Animated grid background -->
      <div class="absolute inset-0 hero-grid opacity-20"></div>

      <!-- Floating orbs -->
      <div class="absolute top-1/4 left-1/4 w-64 h-64 rounded-full orb-1 blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full orb-2 blur-3xl pointer-events-none"></div>

      <!-- Scanning line effect -->
      <div class="scan-line absolute inset-0 pointer-events-none"></div>

      <!-- Content -->
      <div
        class="relative z-10 text-center px-6 max-w-4xl mx-auto transition-all duration-1000"
        :class="heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'"
      >
        <!-- Eyebrow tag -->
        <div class="inline-flex items-center gap-2 mb-6">
          <div class="w-6 h-px bg-[#7AE2CF]"></div>
          <span class="text-[#7AE2CF] text-sm tracking-[0.25em] font-medium uppercase">Safety · Health · Environment</span>
          <div class="w-6 h-px bg-[#7AE2CF]"></div>
        </div>

        <h1 class="hero-title text-5xl sm:text-6xl md:text-8xl font-black text-white mb-4 leading-none">
          Verte<br>
          <span class="text-stroke-teal">Smart</span><br>
          Solution
        </h1>

        <!-- Scroll indicator -->
        <div class="mt-16 flex justify-center">
          <div class="scroll-dot flex flex-col items-center gap-1">
            <div class="w-px h-8 bg-gradient-to-b from-transparent to-[#7AE2CF]"></div>
            <div class="w-1.5 h-1.5 rounded-full bg-[#7AE2CF] animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════ ABOUT SECTION ════════════════════════════ -->
    <section
      id="about"
      data-observe
      class="py-24 px-6 relative transition-all duration-700"
      :class="sectionVisible['about'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
    >
      <div class="max-w-6xl mx-auto">
        <!-- Section label -->
        <div class="flex items-center gap-4 mb-12">
          <div class="w-10 h-px bg-[#7AE2CF]"></div>
          <span class="text-[#7AE2CF] text-xs tracking-[0.3em] uppercase font-semibold">เกี่ยวกับเรา</span>
        </div>

        <div class="grid md:grid-cols-2 gap-12 items-center">
          <!-- Image block -->
          <div class="relative group">
            <div class="absolute -inset-1 rounded-2xl bg-gradient-to-br from-[#7AE2CF]/30 to-blue-500/10 blur-sm group-hover:blur-md transition-all duration-500"></div>
            <div class="relative rounded-2xl overflow-hidden border border-[#7AE2CF]/20">
              <img
                src="/industryv2.jpg"
                alt="โรงงาน"
                class="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <!-- Industrial overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-[#0A1628]/70 via-transparent to-transparent"></div>
              <!-- Corner marks -->
              <div class="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#7AE2CF]"></div>
              <div class="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#7AE2CF]"></div>
              <div class="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#7AE2CF]"></div>
              <div class="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#7AE2CF]"></div>
            </div>
          </div>

          <!-- Text block -->
          <div>
            <h2 class="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
              นวัตกรรมเพื่อ<br>
              <span class="text-[#7AE2CF]">ความปลอดภัย</span><br>
              ระดับอุตสาหกรรม
            </h2>

            <div class="space-y-5">
              <div class="flex gap-4 items-start">
                <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-[#7AE2CF]/10 border border-[#7AE2CF]/30 flex items-center justify-center mt-0.5">
                  <svg class="w-4 h-4 text-[#7AE2CF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <p class="text-white/70 leading-relaxed">
                  มุ่งมั่นพัฒนาระบบบริหารจัดการความปลอดภัย อาชีวอนามัย และสิ่งแวดล้อม (SHE) ด้วยเทคโนโลยีที่ทันสมัย
                </p>
              </div>

              <div class="flex gap-4 items-start">
                <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mt-0.5">
                  <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p class="text-white/70 leading-relaxed">
                  ขับเคลื่อนอุตสาหกรรมไทยสู่มาตรฐานสากล ลดความเสี่ยง และสร้างวัฒนธรรมความปลอดภัยที่ยั่งยืน
                </p>
              </div>

              <div class="flex gap-4 items-start">
                <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-center mt-0.5">
                  <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                  </svg>
                </div>
                <p class="text-white/70 leading-relaxed">
                  นวัตกรรม SHE ที่ออกแบบมาเฉพาะสำหรับบริบทอุตสาหกรรมไทย เข้าใจง่าย ใช้งานได้จริง
                </p>
              </div>
            </div>

            <!-- Mission quote -->
            <div class="mt-8 p-5 rounded-xl border border-[#7AE2CF]/20 bg-[#7AE2CF]/5 relative overflow-hidden">
              <div class="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#7AE2CF] to-blue-400"></div>
              <p class="text-[#7AE2CF] text-sm font-medium italic pl-4 leading-relaxed">
                "Empowering Thai industry to enhance safety, reduce risks, and drive a future of sustainable operational excellence through SHE innovation"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════ TEAM SECTION ═══════════════════════════ -->
    <section
      id="team"
      data-observe
      class="py-24 px-6 relative transition-all duration-700 delay-150"
      :class="sectionVisible['team'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
    >
      <!-- Subtle divider -->
      <div class="max-w-6xl mx-auto mb-16">
        <div class="flex items-center gap-6">
          <div class="flex-1 h-px bg-gradient-to-r from-transparent via-[#7AE2CF]/30 to-transparent"></div>
          <div class="flex gap-2">
            <div class="w-2 h-2 rounded-full bg-[#7AE2CF]"></div>
            <div class="w-2 h-2 rounded-full bg-blue-400"></div>
            <div class="w-2 h-2 rounded-full bg-green-400"></div>
          </div>
          <div class="flex-1 h-px bg-gradient-to-r from-transparent via-[#7AE2CF]/30 to-transparent"></div>
        </div>
      </div>

      <div class="max-w-6xl mx-auto">
        <!-- Section label -->
        <div class="flex items-center gap-4 mb-4">
          <div class="w-10 h-px bg-[#7AE2CF]"></div>
          <span class="text-[#7AE2CF] text-xs tracking-[0.3em] uppercase font-semibold">ผู้เชี่ยวชาญ</span>
        </div>

        <h2 class="text-3xl md:text-4xl font-black text-white mb-12">
          ทีมวิทยากร<br>
          <span class="text-[#7AE2CF]">ผู้เชี่ยวชาญ</span>
        </h2>

        <!-- Team grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <router-link
            v-for="member in teamMembers"
            :key="member.id"
            :to="{ name: 'TeamMemberProfile', params: { id: member.id } }"
            class="group block"
          >
            <div class="relative rounded-2xl overflow-hidden bg-[#0F2040] border border-white/5 hover:border-[#7AE2CF]/40 transition-all duration-500 hover:shadow-card">
              <!-- Photo -->
              <div class="relative h-72 overflow-hidden">
                <img
                  :src="member.image"
                  :alt="member.name"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-[#0F2040] via-[#0F2040]/20 to-transparent"></div>

                <!-- Hover overlay -->
                <div class="absolute inset-0 bg-[#7AE2CF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <!-- Corner marks on hover -->
                <div class="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#7AE2CF] opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div class="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#7AE2CF] opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              </div>

              <!-- Info -->
              <div class="p-6 relative">
                <h3 class="text-white font-bold text-xl mb-1">{{ member.name }}</h3>
                <p class="text-[#7AE2CF] text-sm font-medium mb-2">{{ member.expertise }}</p>
                <p class="text-white/50 text-sm leading-relaxed">{{ member.position }}</p>

                <!-- Bottom bar -->
                <div class="mt-5 flex items-center justify-between">
                  <div class="h-0.5 bg-gradient-to-r from-[#7AE2CF] to-blue-400 rounded-full w-1/4 group-hover:w-3/4 transition-all duration-500"></div>
                  <div class="flex items-center gap-1.5 text-[#7AE2CF] text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    ดูโปรไฟล์
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<style scoped>
/* ─── Hero grid ─── */
.hero-grid {
  background-image:
    linear-gradient(rgba(122, 226, 207, 0.15) 1px, transparent 1px),
    linear-gradient(90deg, rgba(122, 226, 207, 0.15) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
}

/* ─── Orbs ─── */
.orb-1 {
  background: radial-gradient(circle, rgba(122, 226, 207, 0.15) 0%, transparent 70%);
  animation: drift1 8s ease-in-out infinite;
}
.orb-2 {
  background: radial-gradient(circle, rgba(59, 130, 246, 0.10) 0%, transparent 70%);
  animation: drift2 10s ease-in-out infinite;
}

@keyframes drift1 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(30px, -20px); }
}
@keyframes drift2 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-20px, 25px); }
}

/* ─── Scan line ─── */
.scan-line::after {
  content: '';
  position: absolute;
  top: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(122, 226, 207, 0.4), transparent);
  animation: scan 6s linear infinite;
}
@keyframes scan {
  0% { top: 0%; }
  100% { top: 100%; }
}

/* ─── Hero title ─── */
.hero-title {
  letter-spacing: -0.03em;
}

.text-stroke-teal {
  -webkit-text-stroke: 2px #7AE2CF;
  color: transparent;
}

/* ─── Card shadow ─── */
.hover\:shadow-card:hover {
  box-shadow:
    0 0 0 1px rgba(122, 226, 207, 0.2),
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(122, 226, 207, 0.05);
}

/* ─── Reduced motion ─── */
@media (prefers-reduced-motion: reduce) {
  .orb-1, .orb-2 { animation: none; }
  .scan-line::after { animation: none; }
}
</style>