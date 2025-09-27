<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-red-100">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="mx-auto w-16 h-16 bg-gradient-to-r from-purple-100 to-red-100 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-800 mb-2">ระบุข้อมูลผู้ดูแลระบบสูงสุด</h1>
        <p class="text-gray-600 text-sm">สำหรับผู้ดูแลระดับสูงสุด (Super Administrator)</p>
        <div class="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 2L3 7v11c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-7-5z" clip-rule="evenodd"></path>
          </svg>
          สิทธิ์สูงสุด
        </div>
      </div>

      <form @submit.prevent="handleSetPassword" class="space-y-6">
        <!-- Email -->
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">อีเมล</label>
          <div class="relative">
            <input
              v-model="email"
              type="email"
              placeholder="superadmin@company.com"
              :disabled="emailFromUrl"
              :class="[
                'w-full border-2 rounded-xl px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 pl-11',
                emailFromUrl ? 'bg-gray-100 cursor-not-allowed' : ''
              ]"
              required
            />
            <div class="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
              </svg>
            </div>
          </div>
          <p v-if="emailFromUrl" class="text-xs text-gray-500">อีเมลถูกกำหนดจากหน้าล็อกอิน</p>
        </div>

        <!-- Phone Number -->
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">เบอร์โทรศัพท์</label>
          <div class="relative">
            <input
              v-model="phoneNumber"
              type="tel"
              placeholder="0812345678"
              class="w-full border-2 rounded-xl px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 pl-11"
              required
              minlength="10"
              maxlength="10"
              pattern="[0-9]{10}"
            />
            <div class="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
            </div>
          </div>
          <p class="text-xs text-gray-500">กรอกเบอร์โทรศัพท์ 10 หลัก (ตัวเลขเท่านั้น)</p>
        </div>

        <!-- PIN Code -->
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">รหัส PIN (6 หลัก)</label>
          <div class="relative">
            <input
              v-model="pinCode"
              :type="showPin ? 'text' : 'password'"
              placeholder="••••••"
              class="w-full border-2 rounded-xl px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 pl-11 pr-11 text-center text-2xl tracking-widest"
              required
              minlength="6"
              maxlength="6"
              pattern="[0-9]{6}"
            />
            <div class="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"></path>
              </svg>
            </div>
            <button
              type="button"
              @click="showPin = !showPin"
              class="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <svg v-if="showPin" class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
              </svg>
              <svg v-else class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </button>
          </div>
          <p class="text-xs text-gray-500">กรอกรหัส PIN 6 หลัก (ตัวเลขเท่านั้น) สำหรับการยืนยันตัวตนเพิ่มเติม</p>
        </div>

        <!-- รหัสผ่าน -->
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">รหัสผ่านใหม่</label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="ระบุรหัสผ่านที่มีความปลอดภัยสูงมาก"
              class="w-full border-2 rounded-xl px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 pl-11 pr-11"
              required
              minlength="10"
            />
            <div class="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <svg v-if="showPassword" class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
              </svg>
              <svg v-else class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </button>
          </div>
          <div class="text-xs text-gray-500 space-y-1">
            <p>รหัสผ่านต้องมีความยาวอย่างน้อย 10 ตัวอักษร</p>
            <p class="text-red-600">⚠️ แนะนำให้ใช้รหัสผ่านที่ซับซ้อนสำหรับระดับสิทธิ์สูงสุด</p>
          </div>
        </div>

        <!-- Password Strength Indicator -->
        <div v-if="password" class="space-y-2">
          <div class="text-xs text-gray-600">ความแข็งแกร่งของรหัสผ่าน:</div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              :class="passwordStrengthClass"
              class="h-2 rounded-full transition-all duration-300"
              :style="{ width: passwordStrengthWidth }"
            ></div>
          </div>
          <div class="text-xs" :class="passwordStrengthTextClass">
            {{ passwordStrengthText }}
          </div>
        </div>

        <!-- ยืนยันรหัสผ่าน -->
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">ยืนยันรหัสผ่าน</label>
          <div class="relative">
            <input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="ระบุรหัสผ่านอีกครั้ง"
              class="w-full border-2 rounded-xl px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-500 pl-11 pr-11"
              required
              minlength="10"
            />
            <div class="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <svg v-if="showConfirmPassword" class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
              </svg>
              <svg v-else class="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </button>
          </div>
        </div>
        <!-- Password mismatch warning -->
        <div v-if="password && confirmPassword && password !== confirmPassword" class="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            รหัสผ่านไม่ตรงกัน
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="!canSubmit"
          :class="[
            'w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform focus:outline-none focus:ring-4 focus:ring-purple-100',
            canSubmit
              ? 'bg-gradient-to-r from-purple-600 to-red-600 text-white hover:scale-[1.02] hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed disabled:hover:scale-100'
          ]"
        >
          <span class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            ตั้งรหัสผ่านผู้ดูแลสูงสุด
          </span>
        </button>
        
        <!-- Back to Login -->
        <div class="text-center pt-4">
          <router-link
            to="/loginsuperadmin"
            class="text-sm text-gray-600 hover:text-purple-600 transition-colors duration-200"
          >
            กลับไปหน้าล็อกอิน
          </router-link>
        </div> 
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SetPasswordSuperAdmin',
  data() {
    return {
      email: '',
      phoneNumber: '',
      pinCode: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      showPin: false,
      emailFromUrl: false,
      
      // Mock database สำหรับ SuperAdmin เท่านั้น
      mockSuperAdminDatabase: [
        { email: 'superadmin@company.com', hasPassword: true, password: 'SuperSecure123!', phoneNumber: '0812345678', pinCode: '123456', role: 'superadmin' },
        { email: 'master@company.com', hasPassword: false, phoneNumber: '', pinCode: '', role: 'superadmin' },
        { email: 'root@company.com', hasPassword: false, phoneNumber: '', pinCode: '', role: 'superadmin' },
      ]
    }
  },
  computed: {
    canSubmit() {
      return this.email && 
             this.phoneNumber &&
             this.phoneNumber.length === 10 &&
             this.pinCode &&
             this.pinCode.length === 6 &&
             this.password && 
             this.confirmPassword && 
             this.password === this.confirmPassword &&
             this.password.length >= 10;
    },
    passwordStrength() {
      if (!this.password) return 0;
      let strength = 0;
      
      // ความยาว
      if (this.password.length >= 10) strength += 20;
      if (this.password.length >= 12) strength += 10;
      
      // มีตัวพิมพ์เล็ก
      if (/[a-z]/.test(this.password)) strength += 15;
      
      // มีตัวพิมพ์ใหญ่
      if (/[A-Z]/.test(this.password)) strength += 15;
      
      // มีตัวเลข
      if (/[0-9]/.test(this.password)) strength += 15;
      
      // มีสัญลักษณ์พิเศษ
      if (/[^A-Za-z0-9]/.test(this.password)) strength += 15;
      
      // มีความหลากหลาย
      if (this.password.length >= 14) strength += 10;
      
      return Math.min(strength, 100);
    },
    passwordStrengthWidth() {
      return `${this.passwordStrength}%`;
    },
    passwordStrengthClass() {
      if (this.passwordStrength < 30) return 'bg-red-500';
      if (this.passwordStrength < 60) return 'bg-yellow-500';
      if (this.passwordStrength < 80) return 'bg-blue-500';
      return 'bg-green-500';
    },
    passwordStrengthText() {
      if (this.passwordStrength < 30) return 'อ่อนแอมาก';
      if (this.passwordStrength < 60) return 'ปานกลาง';
      if (this.passwordStrength < 80) return 'แข็งแกร่ง';
      return 'แข็งแกร่งมาก';
    },
    passwordStrengthTextClass() {
      if (this.passwordStrength < 30) return 'text-red-600';
      if (this.passwordStrength < 60) return 'text-yellow-600';
      if (this.passwordStrength < 80) return 'text-blue-600';
      return 'text-green-600';
    }
  },
  mounted() {
    // ตรวจสอบ URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    
    if (emailParam) {
      this.email = decodeURIComponent(emailParam);
      this.emailFromUrl = true;
    }
  },
  methods: {
    handleSetPassword() {
      if (!this.canSubmit) return;
      
      // ตรวจสอบว่าอีเมลมีในระบบและยังไม่ได้ตั้งรหัสผ่าน
      const superAdmin = this.mockSuperAdminDatabase.find(u => u.email.toLowerCase() === this.email.toLowerCase());
      
      if (!superAdmin) {
        alert('อีเมลของท่านไม่มีในระบบผู้ดูแลสูงสุด หรือไม่มีสิทธิ์ในการเข้าถึงระดับนี้');
        return;
      }
      
      if (superAdmin.hasPassword) {
        alert('บัญชีผู้ดูแลสูงสุดนี้ได้ตั้งรหัสผ่านแล้ว');
        return;
      }
      
      // ตรวจสอบรูปแบบเบอร์โทร
      if (!/^[0-9]{10}$/.test(this.phoneNumber)) {
        alert('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก ตัวเลขเท่านั้น)');
        return;
      }
      
      // ตรวจสอบรูปแบบรหัส PIN
      if (!/^[0-9]{6}$/.test(this.pinCode)) {
        alert('กรุณากรอกรหัส PIN ให้ถูกต้อง (6 หลัก ตัวเลขเท่านั้น)');
        return;
      }
      
      // ตรวจสอบความแข็งแกร่งของรหัสผ่าน
      if (this.passwordStrength < 60) {
        if (!confirm('รหัสผ่านของท่านมีความแข็งแกร่งไม่เพียงพอสำหรับระดับผู้ดูแลสูงสุด คุณต้องการดำเนินการต่อหรือไม่?')) {
          return;
        }
      }
      
      // จำลองการบันทึกรหัสผ่านใหม่
      console.log('ตั้งรหัสผ่านผู้ดูแลสูงสุดสำเร็จ:', {
        email: this.email,
        phoneNumber: this.phoneNumber,
        pinCode: this.pinCode,
        role: 'superadmin',
        passwordStrength: this.passwordStrength
      });
      
      // อัพเดต mock database
      superAdmin.hasPassword = true;
      superAdmin.password = this.password;
      superAdmin.phoneNumber = this.phoneNumber;
      superAdmin.pinCode = this.pinCode;
      
      alert('ตั้งรหัสผ่านผู้ดูแลสูงสุดสำเร็จ! ระบบจะบันทึกล็อกการเข้าใช้งานทั้งหมดของท่าน');
      
      // นำทางกลับไปหน้าล็อกอิน
      this.$router.push('/loginsuperadmin');
    }
  }
}
</script>