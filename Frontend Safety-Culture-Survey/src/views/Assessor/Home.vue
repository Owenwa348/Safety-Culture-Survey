<!-- Frontend Safety-Culture-Survey\src\views\Assessor\Home.vue -->
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
    <div class="hero-wrapper">
      <!-- Background -->
      <img
        src="/industry.jpg"
        alt="background"
        class="hero-bg"
      />

      <!-- Overlay gradient -->
      <div class="hero-overlay"></div>

      <!-- Main content -->
      <div class="hero-content">
        <div class="hero-inner">

          <!-- Headline -->
          <h1 class="hero-title animate-slide-up">
            Safety Culture Survey
          </h1>

          <!-- Tagline pill -->
          <div class="hero-tagline animate-slide-up-delay">
            "Delivering Safety Expertise with Human-Centered Solutions"
          </div>

          <!-- CTA Buttons -->
          <div class="hero-cta animate-fade-in-up">

            <!-- ปุ่มทำแบบประเมิน (primary) -->
            <router-link to="/assessment" class="cta-link">
              <button class="btn-primary">
                <span class="btn-radar"></span>
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ทำแบบประเมิน
              </button>
            </router-link>

            <!-- ปุ่มติดต่อ (ghost) -->
            <router-link to="/contact" class="cta-link">
              <button class="btn-ghost">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                ติดต่อสอบถาม
              </button>
            </router-link>

          </div>
        </div>
      </div>

      <!-- Footer pinned at bottom -->
      <div class="hero-footer">
        <Footer />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ─── Layout ────────────────────────────────────────── */
.hero-wrapper {
  position: relative;
  width: 100%;
  min-height: 100svh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', Arial, Helvetica, sans-serif;
}

.hero-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.05);
  transition: transform 18s ease-out;
}

.hero-wrapper:hover .hero-bg {
  transform: scale(1.12);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    #06202b 0%,
    #06202bcc 40%,
    #0a3a4acc 70%,
    #06202bdd 100%
  );
  z-index: 1;
}

/* ─── Content center ─────────────────────────────────── */
.hero-content {
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(80px, 10vh, 120px) clamp(1rem, 5vw, 3rem) clamp(1rem, 4vh, 2rem);
}

.hero-inner {
  max-width: 900px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(1rem, 2.5vh, 1.5rem);
}

/* ─── Badge / eyebrow ────────────────────────────────── */

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #7ae2cf;
  box-shadow: 0 0 6px #7ae2cf;
  animation: pulse-dot 2s infinite;
}

/* ─── Headline ───────────────────────────────────────── */
.hero-title {
  margin: 0;
  font-size: clamp(1.9rem, 5.6vw, 3.75rem);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.01em;
  color: #ffffff;
  white-space: nowrap;
  text-shadow: 0 2px 40px rgba(6, 32, 43, 0.5);
}

/* ─── Tagline ────────────────────────────────────────── */
.hero-tagline {
  max-width: 560px;
  padding: 12px 24px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: rgba(255, 255, 255, 0.75);
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  font-style: italic;
  letter-spacing: 0.01em;
  line-height: 1.5;
}

/* ─── CTA Buttons ────────────────────────────────────── */
.hero-cta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  align-items: center;
  margin-top: clamp(0.5rem, 2vh, 1rem);
}

.cta-link {
  text-decoration: none;
}

/* Primary: teal filled */
.btn-primary {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: clamp(14px, 2vw, 18px) clamp(28px, 4vw, 40px);
  border-radius: 999px;
  border: none;
  cursor: pointer;
  background: #7ae2cf;
  color: #06202b;
  font-size: clamp(0.95rem, 2vw, 1.1rem);
  font-weight: 700;
  letter-spacing: 0.01em;
  overflow: visible;
  transition: background 0.25s, transform 0.2s, box-shadow 0.25s;
  box-shadow: 0 0 0 0 rgba(122, 226, 207, 0);
}

.btn-primary:hover {
  background: #5fd4bf;
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 8px 32px rgba(122, 226, 207, 0.35);
}

.btn-primary:active {
  transform: translateY(0) scale(0.98);
}

/* Radar / sonar ping ring on primary button */
.btn-radar {
  position: absolute;
  inset: -1px;
  border-radius: 999px;
  border: 2px solid rgba(122, 226, 207, 0.6);
  animation: radar-ping 2.4s ease-out infinite;
  pointer-events: none;
}

/* Ghost: outline */
.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: clamp(14px, 2vw, 18px) clamp(28px, 4vw, 40px);
  border-radius: 999px;
  border: 1.5px solid rgba(255, 255, 255, 0.35);
  cursor: pointer;
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  font-size: clamp(0.95rem, 2vw, 1.1rem);
  font-weight: 600;
  letter-spacing: 0.01em;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: background 0.25s, border-color 0.25s, transform 0.2s;
}

.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(122, 226, 207, 0.5);
  transform: translateY(-2px) scale(1.02);
}

.btn-ghost:active {
  transform: translateY(0) scale(0.98);
}

.btn-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* ─── Footer ─────────────────────────────────────────── */
.hero-footer {
  position: relative;
  z-index: 10;
}

/* ─── Animations ─────────────────────────────────────── */
@keyframes radar-ping {
  0%   { transform: scale(1);   opacity: 0.8; }
  70%  { transform: scale(1.55); opacity: 0; }
  100% { transform: scale(1.55); opacity: 0; }
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1;   transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(0.8); }
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-slide-up       { animation: slide-up   0.9s ease-out 0.3s both; }
.animate-slide-up-delay { animation: slide-up   0.9s ease-out 0.5s both; }
.animate-fade-in-up     { animation: fade-in-up 0.9s ease-out 0.65s both; }

/* ─── Responsive ─────────────────────────────────────── */
@media (max-width: 480px) {
  .hero-cta {
    flex-direction: column;
    width: 100%;
  }

  .cta-link {
    width: 100%;
  }

  .btn-primary,
  .btn-ghost {
    width: 100%;
    justify-content: center;
  }

  .hero-tagline {
    font-size: 0.85rem;
    padding: 10px 16px;
  }

  .hero-title {
    /* On very narrow screens, keeping one line would shrink text too much,
       so let it wrap gracefully as a fallback */
    white-space: normal;
    font-size: clamp(1.7rem, 8vw, 2.2rem);
  }
}

@media (max-width: 360px) {
  .hero-title {
    font-size: 1.6rem;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .hero-bg,
  .btn-radar,
  .badge-dot,
  .animate-fade-in,
  .animate-slide-up,
  .animate-slide-up-delay,
  .animate-fade-in-up {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
</style>