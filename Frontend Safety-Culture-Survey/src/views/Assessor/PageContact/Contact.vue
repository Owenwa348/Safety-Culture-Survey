<!-- Frontend Safety-Culture-Survey\src\views\Assessor\PageContact\Contact.vue -->
<template>
  <div class="page-root">
    <NavBar />

    <main class="contact-main">
      <!-- ─── Left panel ─── -->
      <aside class="info-panel">
        <div class="info-inner">
          <span class="eyebrow">ติดต่อเรา</span>
          <h1 class="info-title">ยินดีรับฟัง<br />ทุกคำถาม</h1>
          <p class="info-sub">กรอกแบบฟอร์มทางขวา แล้วเราจะติดต่อกลับภายใน 1–2 วันทำการ</p>

          <!-- decorative dots -->
          <div class="dots" aria-hidden="true">
            <span v-for="n in 12" :key="n" class="dot" :style="`--i:${n}`"></span>
          </div>
        </div>

        <!-- teal blob background -->
        <div class="blob" aria-hidden="true"></div>
      </aside>

      <!-- ─── Form panel ─── -->
      <section class="form-panel">
        <!-- status banner -->
        <transition name="slide-fade">
          <div
            v-if="submitMessage"
            class="status-banner"
            :class="submitStatus === 'success' ? 'status-success' : 'status-error'"
            role="alert"
          >
            <svg v-if="submitStatus === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>{{ submitMessage }}</span>
          </div>
        </transition>

        <form @submit.prevent="handleSubmit" novalidate class="contact-form">

          <!-- ชื่อ - นามสกุล -->
          <div class="field-group" :class="{ 'has-error': nameError, 'is-filled': name }">
            <label class="field-label" for="inp-name">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              ชื่อ – นามสกุล <span class="required">*</span>
            </label>
            <input
              id="inp-name"
              v-model="name"
              type="text"
              class="field-input"
              placeholder="กรุณาระบุชื่อ – นามสกุล"
              autocomplete="name"
              required
              :disabled="isSubmitting"
              @input="validateName"
            />
            <p v-if="nameError" class="field-error">{{ nameError }}</p>
          </div>

          <!-- row: email + phone (side-by-side on md+) -->
          <div class="field-row">
            <!-- อีเมล -->
            <div class="field-group" :class="{ 'has-error': emailError, 'is-filled': email }">
              <label class="field-label" for="inp-email">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                อีเมล <span class="required">*</span>
              </label>
              <input
                id="inp-email"
                v-model="email"
                type="email"
                class="field-input"
                placeholder="example@email.com"
                autocomplete="email"
                required
                :disabled="isSubmitting"
                @input="validateEmail"
              />
              <p v-if="emailError" class="field-error">{{ emailError }}</p>
            </div>

            <!-- เบอร์โทรศัพท์ -->
            <div class="field-group" :class="{ 'has-error': phoneError, 'is-filled': phone }">
              <label class="field-label" for="inp-phone">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                เบอร์ติดต่อกลับ <span class="required">*</span>
              </label>
              <input
                id="inp-phone"
                v-model="phone"
                type="tel"
                inputmode="numeric"
                class="field-input"
                placeholder="0812345678"
                maxlength="10"
                required
                :disabled="isSubmitting"
                @input="validatePhone"
              />
              <p v-if="phoneError" class="field-error">{{ phoneError }}</p>
              <p v-else class="field-hint">ตัวเลข 10 หลัก ขึ้นต้นด้วย 0</p>
            </div>
          </div>

          <!-- ข้อความ -->
          <div class="field-group" :class="{ 'has-error': messageError, 'is-filled': message }">
            <label class="field-label" for="inp-message">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
              </svg>
              ฝากข้อความ <span class="required">*</span>
            </label>
            <textarea
              id="inp-message"
              v-model="message"
              rows="5"
              class="field-input field-textarea"
              placeholder="กรุณากรอกข้อความที่ต้องการสอบถาม..."
              required
              :disabled="isSubmitting"
              @input="validateMessage"
            ></textarea>
            <div class="textarea-meta">
              <p v-if="messageError" class="field-error">{{ messageError }}</p>
              <span v-else></span>
              <span class="char-count" :class="{ 'char-warn': message.length > 0 && message.length < 10 }">
                {{ message.length }} ตัวอักษร
              </span>
            </div>
          </div>

          <!-- actions -->
          <div class="form-actions">
            <button
              type="button"
              class="btn-reset"
              :disabled="isSubmitting"
              @click="handleReset"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              ล้างข้อมูล
            </button>

            <button
              type="submit"
              class="btn-submit"
              :disabled="isSubmitting || !isFormValid"
            >
              <span v-if="!isSubmitting" class="btn-inner">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
                ส่งข้อความ
              </span>
              <span v-else class="btn-inner">
                <svg class="spin" viewBox="0 0 24 24" fill="none">
                  <circle class="spin-track" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                กำลังส่ง...
              </span>
            </button>
          </div>

        </form>
      </section>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import Footer from "../../../components/Footer.vue";
import { ref, computed } from "vue";
import NavBar from "../../../components/NavBar.vue";
import { API_BASE_URL } from "../../../config/api";

const name    = ref("");
const email   = ref("");
const phone   = ref("");
const message = ref("");

const isSubmitting  = ref(false);
const submitMessage = ref("");
const submitStatus  = ref("");

const nameError    = ref("");
const emailError   = ref("");
const phoneError   = ref("");
const messageError = ref("");

const validateName = () => {
  const nameRegex = /^[ก-๏a-zA-Z\s]+$/;
  if (!name.value)                       { nameError.value = ""; return false; }
  if (!nameRegex.test(name.value))       { nameError.value = "กรุณากรอกเฉพาะตัวอักษรภาษาไทยหรือภาษาอังกฤษ"; return false; }
  if (name.value.trim().length < 2)      { nameError.value = "กรุณากรอกชื่อ-นามสกุลอย่างน้อย 2 ตัวอักษร"; return false; }
  nameError.value = ""; return true;
};

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value)                      { emailError.value = ""; return false; }
  if (!emailRegex.test(email.value))     { emailError.value = "รูปแบบอีเมลไม่ถูกต้อง (example@email.com)"; return false; }
  emailError.value = ""; return true;
};

const validatePhone = () => {
  const numbersOnly = phone.value.replace(/\D/g, "");
  if (numbersOnly.length > 10) { phone.value = numbersOnly.slice(0, 10); return false; }
  phone.value = numbersOnly;
  if (!phone.value)                      { phoneError.value = ""; return false; }
  if (!phone.value.startsWith("0"))      { phoneError.value = "เบอร์โทรศัพท์ต้องขึ้นต้นด้วย 0"; return false; }
  if (phone.value.length !== 10)         { phoneError.value = `กรุณากรอกให้ครบ 10 หลัก (ปัจจุบัน ${phone.value.length} หลัก)`; return false; }
  phoneError.value = ""; return true;
};

const validateMessage = () => {
  if (!message.value)                    { messageError.value = ""; return false; }
  if (message.value.trim().length < 10)  { messageError.value = "กรุณากรอกข้อความอย่างน้อย 10 ตัวอักษร"; return false; }
  messageError.value = ""; return true;
};

const isFormValid = computed(() =>
  name.value.trim() && email.value.trim() && phone.value.trim() && message.value.trim() &&
  !nameError.value && !emailError.value && !phoneError.value && !messageError.value
);

const handleSubmit = async () => {
  const ok = validateName() & validateEmail() & validatePhone() & validateMessage();
  if (!ok) {
    submitMessage.value = "กรุณาตรวจสอบข้อมูลให้ถูกต้องครบถ้วน";
    submitStatus.value  = "error";
    setTimeout(() => { submitMessage.value = ""; submitStatus.value = ""; }, 4000);
    return;
  }

  isSubmitting.value  = true;
  submitMessage.value = "";
  submitStatus.value  = "";

  try {
    const response = await fetch(`${API_BASE_URL}/api/inquiry/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name:    name.value.trim(),
        email:   email.value.trim(),
        phone:   phone.value.trim(),
        message: message.value.trim(),
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      submitMessage.value = data.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
      submitStatus.value  = "error";
      return;
    }

    submitMessage.value = data.message || "ส่งข้อความสำเร็จ! เราจะติดต่อกลับโดยเร็วที่สุด";
    submitStatus.value  = "success";
    setTimeout(handleReset, 1200);
  } catch {
    submitMessage.value = "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง";
    submitStatus.value  = "error";
  } finally {
    isSubmitting.value = false;
    setTimeout(() => { submitMessage.value = ""; submitStatus.value = ""; }, 5000);
  }
};

const handleReset = () => {
  name.value = email.value = phone.value = message.value = "";
  nameError.value = emailError.value = phoneError.value = messageError.value = "";
};
</script>

<style scoped>
/* ── tokens ────────────────────────────────────────────── */
:root {
  --teal-light : #7ae2cf;
  --teal-mid   : #4ec9b4;
  --teal-deep  : #0f766e;
  --ice        : #f0fdf9;
  --slate-900  : #0f172a;
  --slate-700  : #334155;
  --slate-500  : #64748b;
  --slate-300  : #cbd5e1;
  --slate-100  : #f1f5f9;
  --error      : #dc2626;
  --success    : #059669;
  --radius-lg  : 1.25rem;
  --radius-xl  : 1.75rem;
  --shadow-card: 0 4px 6px -1px rgb(0 0 0 / .07), 0 10px 40px -10px rgb(15 118 110 / .12);
}

/* ── page shell ─────────────────────────────────────────── */
.page-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(150deg, #e6faf6 0%, #f8fafc 55%, #eef9f7 100%);
  font-family: 'Inter', 'Noto Sans Thai', system-ui, sans-serif;
}

/* ── main two-column wrapper ────────────────────────────── */
.contact-main {
  flex: 1;
  display: flex;
  align-items: stretch;
  gap: 0;
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  padding: 3rem 1.25rem 4rem;
}

/* ── left panel ─────────────────────────────────────────── */
.info-panel {
  position: relative;
  display: none;           /* hidden on mobile */
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  border-radius: var(--radius-xl) 0 0 var(--radius-xl);
  background: linear-gradient(145deg, #0d9488 0%, #0f766e 60%, #115e59 100%);
  color: #fff;
  padding: 3.5rem 2.5rem;
  min-width: 300px;
  flex: 0 0 320px;
}

.info-inner { position: relative; z-index: 1; }

.eyebrow {
  display: inline-block;
  font-size: .7rem;
  font-weight: 700;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: #99f6e4;
  margin-bottom: .75rem;
}

.info-title {
  font-size: clamp(1.75rem, 2.4vw, 2.25rem);
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 1rem;
  letter-spacing: -.02em;
}

.info-sub {
  font-size: .9rem;
  line-height: 1.65;
  color: #ccfbf1;
  margin-bottom: 2.5rem;
}

.contact-meta {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: .9rem;
}

.contact-meta li {
  display: flex;
  align-items: center;
  gap: .65rem;
  font-size: .85rem;
  color: #e0fdf4;
}

.meta-icon {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  background: rgba(255 255 255 / .12);
  border-radius: .6rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.meta-icon svg { width: 1rem; height: 1rem; }

/* decorative dots grid */
.dots {
  position: absolute;
  bottom: 2rem;
  right: -1rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: .55rem;
}
.dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: rgba(255 255 255 / calc(0.08 + var(--i) * 0.04));
}

/* background blob */
.blob {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse 220px 260px at 105% 0%, rgba(255 255 255 / .10) 0%, transparent 70%),
    radial-gradient(ellipse 180px 200px at -20% 100%, rgba(0 0 0 / .12) 0%, transparent 70%);
}

/* ── form panel ─────────────────────────────────────────── */
.form-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
  padding: 2.25rem 1.75rem;
  transition: border-radius .3s;
}

/* ── status banner ──────────────────────────────────────── */
.status-banner {
  display: flex;
  align-items: center;
  gap: .65rem;
  padding: .85rem 1.1rem;
  border-radius: .875rem;
  font-size: .875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.status-banner svg { width: 1.2rem; height: 1.2rem; flex-shrink: 0; }

.status-success {
  background: #ecfdf5;
  color: var(--success);
  border: 1.5px solid #6ee7b7;
}

.status-error {
  background: #fef2f2;
  color: var(--error);
  border: 1.5px solid #fca5a5;
}

/* ── form layout ────────────────────────────────────────── */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
}

.field-row {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ── field group ────────────────────────────────────────── */
.field-group {
  display: flex;
  flex-direction: column;
  gap: .4rem;
  position: relative;
}

/* left accent bar — the signature element */
.field-group::before {
  content: '';
  position: absolute;
  left: 0;
  top: 2.5rem;        /* below label */
  bottom: 0;
  width: 3px;
  border-radius: 0 2px 2px 0;
  background: var(--slate-300);
  transition: background .25s, opacity .25s;
  opacity: 0;
}

.field-group:focus-within::before,
.field-group.is-filled::before {
  opacity: 1;
  background: linear-gradient(to bottom, var(--teal-light), var(--teal-mid));
}

.field-group.has-error::before {
  opacity: 1;
  background: var(--error);
}

.field-label {
  display: flex;
  align-items: center;
  gap: .45rem;
  font-size: .8rem;
  font-weight: 700;
  color: var(--slate-700);
  letter-spacing: .03em;
  text-transform: uppercase;
  padding-left: 0;
}

.field-label svg { width: .95rem; height: .95rem; color: var(--teal-mid); flex-shrink: 0; }

.required { color: var(--error); margin-left: .1rem; font-weight: 700; }

.field-input {
  width: 100%;
  padding: .75rem 1rem;
  border: 1.5px solid var(--slate-300);
  border-radius: .75rem;
  font-size: .95rem;
  color: var(--slate-900);
  background: var(--slate-100);
  transition: border-color .2s, box-shadow .2s, background .2s;
  outline: none;
  line-height: 1.5;
  font-family: inherit;
}

.field-input::placeholder { color: var(--slate-500); }

.field-input:hover:not(:disabled) {
  border-color: var(--teal-light);
  background: #f6fffe;
}

.field-input:focus {
  border-color: var(--teal-mid);
  background: #fff;
  box-shadow: 0 0 0 3.5px rgba(122 226 207 / .22);
}

.has-error .field-input {
  border-color: var(--error);
  background: #fff9f9;
}

.has-error .field-input:focus {
  box-shadow: 0 0 0 3.5px rgba(220 38 38 / .14);
}

.field-input:disabled { opacity: .55; cursor: not-allowed; }

.field-textarea {
  resize: vertical;
  min-height: 130px;
}

/* custom scrollbar */
.field-textarea::-webkit-scrollbar       { width: 6px; }
.field-textarea::-webkit-scrollbar-track { background: var(--slate-100); border-radius: 8px; }
.field-textarea::-webkit-scrollbar-thumb { background: var(--teal-light); border-radius: 8px; }

.field-error {
  font-size: .78rem;
  color: var(--error);
  display: flex;
  align-items: center;
  gap: .3rem;
  margin: 0;
}

.field-hint  { font-size: .78rem; color: var(--slate-500); margin: 0; }

.textarea-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: .5rem;
}

.char-count      { font-size: .75rem; color: var(--slate-500); white-space: nowrap; }
.char-warn       { color: var(--error); }

/* ── action buttons ─────────────────────────────────────── */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: .75rem;
  padding-top: .5rem;
  flex-wrap: wrap;
}

.btn-reset,
.btn-submit {
  display: inline-flex;
  align-items: center;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-weight: 700;
  border-radius: 99px;
  padding: .7rem 1.5rem;
  font-size: .875rem;
  transition: all .22s ease;
  gap: .45rem;
  line-height: 1;
}

.btn-reset svg,
.btn-submit svg { width: 1rem; height: 1rem; }

.btn-reset {
  background: var(--slate-100);
  color: var(--slate-700);
  border: 1.5px solid var(--slate-300);
}

.btn-reset:hover:not(:disabled) {
  background: var(--slate-200, #e2e8f0);
  border-color: var(--slate-400, #94a3b8);
  color: var(--slate-900);
}

.btn-submit {
  background: linear-gradient(135deg, var(--teal-light) 0%, var(--teal-mid) 100%);
  color: #0f3d38;
  box-shadow: 0 2px 14px rgba(78 201 180 / .35);
}

.btn-submit:hover:not(:disabled):not([disabled]) {
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(78 201 180 / .45);
  filter: brightness(1.04);
}

.btn-submit:active:not(:disabled) { transform: translateY(0); }

.btn-reset:disabled,
.btn-submit:disabled {
  opacity: .5;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.btn-inner { display: flex; align-items: center; gap: .4rem; }

/* spin animation */
.spin { animation: rotate .8s linear infinite; }
.spin-track { opacity: .2; }

@keyframes rotate { to { transform: rotate(360deg); } }

/* ── transition: status banner ──────────────────────────── */
.slide-fade-enter-active { transition: all .3s cubic-bezier(.22, .61, .36, 1); }
.slide-fade-leave-active { transition: all .25s ease-in; }
.slide-fade-enter-from   { opacity: 0; transform: translateY(-10px); }
.slide-fade-leave-to     { opacity: 0; transform: translateY(-8px); }

/* ── reduced motion ─────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition-duration: .01ms !important; animation-duration: .01ms !important; }
}

/* ────────────────────────────────────────────────────────
   RESPONSIVE
──────────────────────────────────────────────────────── */

/* sm : ≥ 480px — wider padding, side-by-side email+phone */
@media (min-width: 480px) {
  .field-row {
    flex-direction: row;
    gap: 1rem;
  }
  .field-row .field-group { flex: 1; }

  .form-panel { padding: 2.5rem 2.25rem; }
}

/* md : ≥ 768px — show left panel, attach it to form card */
@media (min-width: 768px) {
  .contact-main { padding: 4rem 2rem 5rem; }

  .info-panel {
    display: flex;
  }

  .form-panel {
    border-radius: 0 var(--radius-xl) var(--radius-xl) 0;
    padding: 3rem 2.75rem;
  }
}

/* lg : ≥ 1024px — more breathing room */
@media (min-width: 1024px) {
  .contact-main { padding: 5rem 2rem 6rem; }

  .info-panel { flex: 0 0 340px; padding: 4rem 3rem; }

  .form-panel { padding: 3.25rem 3.5rem; }

  .info-title { font-size: 2.25rem; }
}

/* xl : ≥ 1280px */
@media (min-width: 1280px) {
  .info-panel { flex: 0 0 370px; }
}

/* xs : < 360px — tighten a bit more */
@media (max-width: 360px) {
  .form-panel { padding: 1.5rem 1.1rem; }
  .contact-form { gap: 1.2rem; }
  .form-actions { flex-direction: column-reverse; }
  .btn-reset, .btn-submit { justify-content: center; width: 100%; }
}
</style>