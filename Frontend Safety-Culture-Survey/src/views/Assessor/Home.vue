<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import NavBar from "../../components/NavBar.vue";
import Footer from "../../components/Footer.vue";

const router = useRouter();
const isOpen = ref(false);
</script>

<template>
  <div class="min-h-screen">
    <NavBar />
    <div class="w-full h-screen overflow-hidden">
      <!-- พื้นหลังรูป -->
      <img src="/industry.jpg" alt="background"
        class="absolute inset-0 w-full h-full object-cover transform scale-100 transition-transform duration-20000 hover:scale-110"
      />
      <!-- Gradient ทึบ -->
      <div class="absolute inset-0  bg-gradient-to-br from-[#06202B]/70 via-[#06202B]/60 to-[#0A3A4A]/50 z-0 scale-100"></div>

      <!-- เนื้อหาหลัก -->
      <div class="z-10 flex flex-col items-center justify-center h-full text-center -translate-y-10 relative">
        <div class="max-w-4xl mx-auto px-4">
          <h2 class="text-white text-5xl font-bold mt-4 animate-slide-up relative z-10">
            <span class="relative z-0">Safety Culture Survey</span>
          </h2>
          
          <h2 class="text-white text-3xl font-bold mt-4 animate-slide-up relative z-10">
            <span class="relative z-0">"Delivering Safety Expertise with Innovative Solutions"</span>
          </h2>
        </div>

        <!-- ปุ่มหลัก -->
        <div class="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12 animate-fade-in-up">
          <!-- ปุ่มทำแบบประเมิน -->
          <router-link to="/login" style="color: white;">
            <button
              style="background-color: #7ae2cf"
              class="relative px-8 py-6 rounded-full text-xl font-semibold hover:bg-[#62CFC0] text-[#000000] transition-all duration-300 shadow-2xl transform hover:scale-105 hover:shadow-[#7ae2cf]/25 overflow-hidden group"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span class="relative z-10 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              ทำแบบประเมิน
            </span>
          </button>
          </router-link>
          

          <!-- ปุ่มติดต่อ -->
          <router-link to="/contact" style="color: white;">
            <button
              style="background-color: #7ae2cf"
              class="relative text-[#000000] px-8 py-6 rounded-full text-xl font-semibold hover:bg-[#62CFC0] transition-all duration-300 shadow-2xl transform hover:scale-105 hover:shadow-[#7ae2cf]/25 overflow-hidden group"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span class="relative z-10 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                ติดต่อสอบถาม
              </span>
            </button>
          </router-link>
        </div>
      </div>

      <div id="Footer">
        <Footer />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* แอนิเมชัน */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 1s ease-out forwards;
}

.animate-slide-up {
  animation: slide-up 1s ease-out 0.3s forwards;
  opacity: 0;
}

.animate-fade-in-up {
  animation: fade-in-up 1s ease-out 0.6s forwards;
  opacity: 0;
}
</style>