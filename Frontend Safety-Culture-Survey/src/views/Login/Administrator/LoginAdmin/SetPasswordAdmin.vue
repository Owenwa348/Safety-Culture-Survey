<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-800 mb-2">ระบุข้อมูลผู้ดูแลระบบ</h1>
        <p class="text-gray-600 text-sm">สำหรับผู้ดูแลระบบ (Administrator)</p>
      </div>

      <form @submit.prevent="handleSetPassword" class="space-y-6">
        <!-- Email -->
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">อีเมล</label>
          <div class="relative">
            <input
              v-model="email"
              type="email"
              placeholder="admin@company.com"
              :disabled="emailFromUrl"
              :class="[
                'w-full border-2 rounded-xl px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 pl-11',
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
        </div>

        <!-- ชื่อ - นามสกุล -->
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">ชื่อ - นามสกุล</label>
          <div class="relative">
            <input
              v-model="fullName"
              type="text"
              placeholder="ระบุชื่อและนามสกุลของท่าน"
              class="w-full border-2 rounded-xl px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 pl-11"
              required
              minlength="2"
            />
            <div class="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- เบอร์โทรศัพท์ -->
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">เบอร์โทรศัพท์</label>
          <div class="relative">
            <input
              v-model="phoneNumber"
              type="tel"
              placeholder="0xx-xxx-xxxx"
              class="w-full border-2 rounded-xl px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 pl-11"
              required
              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}|[0-9]{10}"
              maxlength="12"
            />
            <div class="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- ชื่อบริษัท -->
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">ชื่อบริษัท/องค์กร</label>
          <div class="relative">
            <input
              v-model="companyName"
              type="text"
              placeholder="ระบุชื่อบริษัทหรือองค์กร"
              class="w-full border-2 rounded-xl px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 pl-11"
              required
              minlength="2"
            />
            <div class="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- รหัสผ่าน -->
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">รหัสผ่านใหม่</label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="ระบุรหัสผ่านที่มีความปลอดภัยสูง"
              class="w-full border-2 rounded-xl px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 pl-11 pr-11"
              required
              minlength="8"
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
        </div>

        <!-- ยืนยันรหัสผ่าน -->
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">ยืนยันรหัสผ่าน</label>
          <div class="relative">
            <input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="ระบุรหัสผ่านอีกครั้ง"
              class="w-full border-2 rounded-xl px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 pl-11 pr-11"
              required
              minlength="8"
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
            'w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform focus:outline-none focus:ring-4 focus:ring-blue-100',
            canSubmit
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:scale-[1.02] hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed disabled:hover:scale-100'
          ]"
        >
          <span class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            ตั้งรหัสผ่านผู้ดูแลระบบ
          </span>
        </button>
        
        <!-- Back to Login -->
        <div class="text-center pt-4">
          <router-link
            to="/login-all"
            class="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
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
  name: 'SetPasswordAdmin',
  data() {
    return {
      email: '',
      fullName: '',
      phoneNumber: '',
      companyName: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      emailFromUrl: false,
      
      // Mock database สำหรับ Admin เท่านั้น
      mockAdminDatabase: [
        { 
          email: 'admin01@company.com', 
          hasPassword: true, 
          password: '123456', 
          fullName: 'สมชาย ใจดี',
          phoneNumber: '081-234-5678',
          companyName: 'บริษัท เทคโนโลยี จำกัด',
          role: 'admin' 
        },
        { 
          email: 'admin02@company.com', 
          hasPassword: false, 
          fullName: '', 
          phoneNumber: '',
          companyName: '',
          role: 'admin' 
        },
      ]
    }
  },
  computed: {
    canSubmit() {
      return this.email && 
             this.fullName &&
             this.fullName.length >= 2 &&
             this.phoneNumber &&
             this.companyName &&
             this.companyName.length >= 2 &&
             this.password && 
             this.confirmPassword && 
             this.password === this.confirmPassword &&
             this.password.length >= 8 &&
             this.isValidPhoneNumber();
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
    isValidPhoneNumber() {
      // ตรวจสอบรูปแบบเบอร์โทร
      const phonePattern = /^(0\d{2}-\d{3}-\d{4}|0\d{9})$/;
      return phonePattern.test(this.phoneNumber);
    },
    
    formatPhoneNumber() {
      // จัดรูปแบบเบอร์โทรอัตโนมัติ
      let phone = this.phoneNumber.replace(/\D/g, '');
      if (phone.length === 10 && phone.startsWith('0')) {
        this.phoneNumber = phone.substring(0, 3) + '-' + phone.substring(3, 6) + '-' + phone.substring(6);
      }
    },
    
    handleSetPassword() {
      if (!this.canSubmit) return;
      
      // ตรวจสอบว่าอีเมลมีในระบบและยังไม่ได้ตั้งรหัสผ่าน
      const admin = this.mockAdminDatabase.find(u => u.email.toLowerCase() === this.email.toLowerCase());
      
      if (!admin) {
        alert('อีเมลของท่านไม่มีในระบบผู้ดูแล หรือไม่มีสิทธิ์ในการเข้าถึง');
        return;
      }
      
      if (admin.hasPassword) {
        alert('บัญชีผู้ดูแลนี้ได้ตั้งรหัสผ่านแล้ว');
        return;
      }
      
      // จำลองการบันทึกรหัสผ่านใหม่
      console.log('ตั้งรหัสผ่านผู้ดูแลระบบสำเร็จ:', {
        email: this.email,
        fullName: this.fullName,
        phoneNumber: this.phoneNumber,
        companyName: this.companyName,
        role: 'admin'
      });
      
      // อัพเดต mock database
      admin.hasPassword = true;
      admin.password = this.password;
      admin.fullName = this.fullName;
      admin.phoneNumber = this.phoneNumber;
      admin.companyName = this.companyName;
      
      alert('ตั้งรหัสผ่านผู้ดูแลระบบสำเร็จ! กรุณาสามารถเข้าสู่ระบบได้แล้ว');
      
      // นำทางกลับไปหน้าล็อกอิน
      this.$router.push('/loginadmin');
    }
  },
  watch: {
    phoneNumber() {
      // จัดรูปแบบเบอร์โทรขณะพิมพ์
      this.formatPhoneNumber();
    }
  }
}
</script>