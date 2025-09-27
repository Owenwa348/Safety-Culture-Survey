<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
    <div class="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div class="text-center mb-8">
        <div class="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-800">ลงทะเบียนผู้ใช้งาน</h1>
        <p class="text-gray-600 mt-2">สร้างบัญชีใหม่เพื่อเข้าใช้งานระบบ</p>
      </div>

      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- ข้อมูลส่วนตัว -->
        <div class="bg-gray-50 p-6 rounded-xl border">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            ข้อมูลส่วนตัว
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- ชื่อ - นามสกุล -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">ชื่อ - นามสกุล <span class="text-red-500">*</span></label>
              <input 
                type="text" 
                v-model="form.fullName"
                @input="validateFullName"
                class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-gray-300" 
                placeholder="ชื่อและนามสกุลของคุณ"
                required
              />
            </div>

            <!-- บริษัท/องค์กร -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">บริษัท/องค์กร <span class="text-red-500">*</span></label>
              <input 
                type="text" 
                v-model="form.company"
                class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-gray-300" 
                placeholder="กรุณากรอกชื่อบริษัท/องค์กร"
                required
              />
            </div>

            <!-- อีเมล -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">อีเมล <span class="text-red-500">*</span></label>
              <input 
                type="email" 
                v-model="form.email"
                @blur="validateEmail"
                class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-gray-300" 
                placeholder="example@company.com"
                required
              />
              <div v-if="emailError" class="mt-2 text-red-500 text-sm">
                {{ emailError }}
              </div>
            </div>

            <!-- เบอร์โทรศัพท์ -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">เบอร์โทรศัพท์ <span class="text-red-500">*</span></label>
              <input 
                type="text" 
                v-model="form.phone"
                @input="validatePhone"
                class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-gray-300" 
                placeholder="0xx-xxx-xxxx"
                maxlength="10"
                required
              />
              <div v-if="phoneError" class="mt-2 text-red-500 text-sm">
                {{ phoneError }}
              </div>
            </div>
          </div>
        </div>

        <!-- ข้อมูลการทำงาน -->
        <div class="bg-gray-50 p-6 rounded-xl border">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            ข้อมูลการทำงาน
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- ตำแหน่งงานในปัจจุบัน -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">ตำแหน่งงานในปัจจุบันของท่าน <span class="text-red-500">*</span></label>
              <select 
                v-model="form.position"
                class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-gray-300"
                required
              >
                <option value="">เลือกตำแหน่งงาน</option>
                <option value="executive">ผู้บริหารระดับสูง / ผู้จัดการส่วน</option>
                <option value="manager">ผู้จัดการแผนก / ผู้จัดการ / พนักงานอาวุโส</option>
                <option value="employee">พนักงาน</option>
                <option value="contractor">ผู้รับเหมาประจำ</option>
              </select>
            </div>

            <!-- สายงานที่สังกัด -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">สายงานที่ท่านสังกัด <span class="text-red-500">*</span></label>
              <select 
                v-model="form.department"
                @change="handleDepartmentChange"
                class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-gray-300"
                required
              >
                <option value="">เลือกสายงาน</option>
                <option value="CEO">CEO</option>
                <option value="REP">REP</option>
                <option value="COO">COO</option>
                <option value="CFO">CFO</option>
                <option value="SSE">SSE</option>
                <option value="PSE">PSE</option>
                <option value="CME">CME</option>
                <option value="other">อื่นๆ (ระบุ)</option>
              </select>
            </div>

            <!-- ระบุสายงานอื่นๆ -->
            <div v-if="form.department === 'other'" class="md:col-span-2">
              <label class="block text-sm font-semibold text-gray-700 mb-2">ระบุสายงาน <span class="text-red-500">*</span></label>
              <input 
                type="text" 
                v-model="form.customDepartment"
                class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-gray-300" 
                placeholder="กรุณาระบุสายงาน"
                required
              />
            </div>

            <!-- กลุ่มงานที่สังกัด -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">กลุ่มงานที่ท่านสังกัด <span class="text-red-500">*</span></label>
              <select 
                v-model="form.workGroup"
                class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-gray-300"
                required
              >
                <option value="">เลือกกลุ่มงาน</option>
                <option value="operation">หน่วยงานเดินเครื่อง (Operation)</option>
                <option value="maintenance">หน่วยงานบำรุงรักษา (Maintenance)</option>
                <option value="engineering">หน่วยงานวิศวกรรม (Engineering)</option>
                <option value="supporting">หน่วยงานสนับสนุน (Supporting functions)</option>
              </select>
            </div>

            <!-- อายุงาน -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">อายุงาน <span class="text-red-500">*</span></label>
              <select 
                v-model="form.workExperience"
                class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-gray-300"
                required
              >
                <option value="">เลือกอายุงาน</option>
                <option value="0-3">0-3 ปี</option>
                <option value="3-5">3 ปีขึ้นไป แต่ไม่เกิน 5 ปี</option>
                <option value="5-10">5 ปีขึ้นไป แต่ไม่เกิน 10 ปี</option>
                <option value="10-15">10 ปีขึ้นไป แต่ไม่เกิน 15 ปี</option>
                <option value="15+">มากกว่า 15 ปีขึ้นไป</option>
              </select>
            </div>
          </div>
        </div>

        <!-- ข้อมูลรหัสผ่าน -->
        <div class="bg-gray-50 p-6 rounded-xl border">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            ตั้งรหัสผ่าน
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- รหัสผ่าน -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">รหัสผ่าน <span class="text-red-500">*</span></label>
              <div class="relative">
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  v-model="form.password"
                  @input="checkPasswordStrength"
                  class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-gray-300" 
                  placeholder="รหัสผ่านของคุณ (อย่างน้อย 6 ตัวอักษร)"
                  minlength="6"
                  required
                />
                <button 
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                  </svg>
                </button>
              </div>
              
              <!-- Password Strength Indicator -->
              <div v-if="form.password" class="mt-3">
                <div class="flex items-center justify-between text-xs mb-2">
                  <span class="font-medium text-gray-600">ความแข็งแรงของรหัสผ่าน:</span>
                  <span :class="passwordStrength.color" class="font-bold">{{ passwordStrength.text }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    :class="passwordStrength.bgColor" 
                    class="h-2 rounded-full transition-all duration-300"
                    :style="{ width: passwordStrength.width }"
                  ></div>
                </div>
                <div class="mt-2 space-y-1 text-xs text-gray-600">
                  <div class="flex items-center space-x-2">
                    <span :class="passwordChecks.length ? 'text-green-500' : 'text-gray-400'">✓</span>
                    <span>อย่างน้อย 6 ตัวอักษร</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span :class="passwordChecks.uppercase ? 'text-green-500' : 'text-gray-400'">✓</span>
                    <span>มีตัวอักษรพิมพ์ใหญ่</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span :class="passwordChecks.lowercase ? 'text-green-500' : 'text-gray-400'">✓</span>
                    <span>มีตัวอักษรพิมพ์เล็ก</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span :class="passwordChecks.number ? 'text-green-500' : 'text-gray-400'">✓</span>
                    <span>มีตัวเลข</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- ยืนยันรหัสผ่าน -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">ยืนยันรหัสผ่าน <span class="text-red-500">*</span></label>
              <div class="relative">
                <input 
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  v-model="form.confirmPassword"
                  class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 transition-all focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-gray-300" 
                  placeholder="ยืนยันรหัสผ่านของคุณ"
                  required
                />
                <button 
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg v-if="!showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                  </svg>
                </button>
              </div>
              
              <!-- Password Match Indicator -->
              <div v-if="form.confirmPassword" class="mt-2 flex items-center space-x-2">
                <span v-if="passwordsMatch" class="text-green-500 text-sm font-medium flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  รหัสผ่านตรงกัน
                </span>
                <span v-else class="text-red-500 text-sm font-medium flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                  </svg>
                  รหัสผ่านไม่ตรงกัน
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Terms and Conditions -->
        <div class="flex items-start space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <input 
            type="checkbox" 
            id="terms" 
            v-model="form.acceptTerms"
            class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            required
          />
          <label for="terms" class="text-sm text-gray-700">
            ฉันได้อ่านและยอมรับ <a href="#" class="text-blue-600 hover:text-blue-800 underline font-medium">ข้อกำหนดการใช้งาน</a> และ 
            <a href="#" class="text-blue-600 hover:text-blue-800 underline font-medium">นโยบายความเป็นส่วนตัว</a> ของระบบ
          </label>
        </div>

        <button 
          type="submit" 
          :disabled="!isFormValid || isLoading"
          :class="isFormValid && !isLoading
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105' 
            : 'bg-gray-300 cursor-not-allowed'"
          class="w-full text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg"
        >
          <span v-if="isLoading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            กำลังสร้างบัญชี...
          </span>
          <span v-else>
            <svg class="inline-block w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            ลงทะเบียนผู้ใช้งาน
          </span>
        </button>

        <div class="text-center pt-4">
          <p class="text-sm text-gray-600">
            มีบัญชีอยู่แล้ว? 
            <a href="#" class="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
               @click="$router?.push('/') || (window.location.href = '/')">เข้าสู่ระบบ</a>
          </p>
        </div>
      </form>

      <!-- Success Modal -->
      <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl transform transition-all">
          <div class="text-center">
            <!-- Success Icon -->
            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <!-- Success Message -->
            <h3 class="text-2xl font-bold text-gray-900 mb-4">ลงทะเบียนสำเร็จ!</h3>
            <div class="text-gray-600 space-y-3 mb-6">
              <p class="text-base">
                บัญชีของคุณได้ถูกสร้างเรียบร้อยแล้ว
              </p>
              <p class="text-base">
                คุณสามารถเข้าสู่ระบบได้ทันที
              </p>
            </div>
            
            <!-- Action Buttons -->
            <div class="space-y-3">
              <button 
                @click="redirectToLogin"
                class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                ไปหน้าเข้าสู่ระบบ
              </button>
              <button 
                @click="resetForm"
                class="w-full border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-all duration-200 hover:bg-gray-50 hover:border-gray-400"
              >
                ลงทะเบียนบัญชีใหม่อีก
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompanyRegistrationForm',
  data() {
    return {
      form: {
        fullName: '',
        email: '',
        phone: '',
        company: '',
        customCompany: '',
        position: '',
        department: '',
        customDepartment: '',
        workGroup: '',
        workExperience: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
      },
      showPassword: false,
      showConfirmPassword: false,
      isLoading: false,
      emailError: '',
      phoneError: '',
      passwordChecks: {
        length: false,
        uppercase: false,
        lowercase: false,
        number: false
      },
      showSuccessModal: false
    }
  },
  computed: {
    passwordsMatch() {
      return this.form.password === this.form.confirmPassword && this.form.confirmPassword.length > 0
    },
    passwordStrength() {
      const checks = this.passwordChecks
      const checkedCount = Object.values(checks).filter(Boolean).length
      
      if (checkedCount === 0) {
        return { text: 'อ่อนแอมาก', color: 'text-red-600', bgColor: 'bg-red-500', width: '25%' }
      } else if (checkedCount === 1) {
        return { text: 'อ่อนแอ', color: 'text-red-500', bgColor: 'bg-red-400', width: '40%' }
      } else if (checkedCount === 2) {
        return { text: 'ปานกลาง', color: 'text-yellow-600', bgColor: 'bg-yellow-500', width: '60%' }
      } else if (checkedCount === 3) {
        return { text: 'ดี', color: 'text-blue-600', bgColor: 'bg-blue-500', width: '80%' }
      } else {
        return { text: 'แข็งแรง', color: 'text-green-600', bgColor: 'bg-green-500', width: '100%' }
      }
    },
    isFormValid() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      
      return (
        this.form.fullName.trim() !== '' &&
        emailRegex.test(this.form.email) &&
        this.form.phone.length === 10 &&
        this.form.phone.startsWith('0') &&
        this.form.company !== '' &&
        this.form.position !== '' &&
        this.form.department !== '' &&
        (this.form.department !== 'other' || this.form.customDepartment.trim() !== '') &&
        this.form.workGroup !== '' &&
        this.form.workExperience !== '' &&
        this.form.password.length >= 6 &&
        this.passwordsMatch &&
        this.form.acceptTerms &&
        !this.emailError &&
        !this.phoneError
      )
    }
  },
  methods: {
    handleCompanyChange() {
      // No longer needed since it's a text input
    },
    handleDepartmentChange() {
      if (this.form.department !== 'other') {
        this.form.customDepartment = ''
      }
    },
    checkPasswordStrength() {
      const password = this.form.password
      
      this.passwordChecks = {
        length: password.length >= 6,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password)
      }
    },
    validatePhone() {
      // Allow only numbers
      this.form.phone = this.form.phone.replace(/[^0-9]/g, '')
      
      // Check phone number requirements
      if (this.form.phone.length > 0) {
        if (!this.form.phone.startsWith('0')) {
          this.phoneError = 'เบอร์โทรศัพท์ต้องขึ้นต้นด้วย 0'
        } else if (this.form.phone.length !== 10) {
          this.phoneError = 'เบอร์โทรศัพท์ต้องมี 10 หลัก'
        } else {
          this.phoneError = ''
        }
      } else {
        this.phoneError = ''
      }
    },
    validateFullName() {
      // Allow Thai characters, English letters, and spaces
      this.form.fullName = this.form.fullName.replace(/[^ก-๙a-zA-Z\s]/g, '')
    },
    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (this.form.email && !emailRegex.test(this.form.email)) {
        this.emailError = 'กรุณากรอกอีเมลที่ถูกต้อง'
      } else {
        this.emailError = ''
      }
    },
    resetForm() {
      this.form = {
        fullName: '',
        email: '',
        phone: '',
        company: '',
        customCompany: '',
        position: '',
        department: '',
        customDepartment: '',
        workGroup: '',
        workExperience: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
      }
      
      // Reset all validation states
      this.emailError = ''
      this.phoneError = ''
      this.passwordChecks = {
        length: false,
        uppercase: false,
        lowercase: false,
        number: false
      }
      
      this.showSuccessModal = false
    },
    redirectToLogin() {
      // Use Vue Router if available, otherwise fallback to window location
      if (this.$router) {
        this.$router.push('/')
      } else {
        window.location.href = '/'
      }
    },
    async submitForm() {
      if (!this.isFormValid) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง')
        return
      }

      this.isLoading = true

      try {
        // สร้างข้อมูลสำหรับบันทึก
        const registrationData = {
          fullName: this.form.fullName,
          email: this.form.email,
          phone: this.form.phone,
          company: this.form.company,
          position: this.form.position,
          department: this.form.department === 'other' ? this.form.customDepartment : this.form.department,
          workGroup: this.form.workGroup,
          workExperience: this.form.workExperience,
          registrationDate: new Date().toLocaleString('th-TH', {
            timeZone: 'Asia/Bangkok',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        }

        // จำลองการส่งข้อมูลไปยัง API
        await this.simulateApiCall(registrationData)

        // แสดง Modal สำเร็จ
        this.showSuccessModal = true

      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการลงทะเบียน:', error)
        alert('เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง')
      } finally {
        this.isLoading = false
      }
    },

    async simulateApiCall(data) {
      // จำลองการเรียก API (ใช้เวลา 2 วินาที)
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('ข้อมูลการลงทะเบียน:', data)
          
          // บันทึกข้อมูลลงใน memory (ไม่ใช้ localStorage)
          if (typeof window !== 'undefined') {
            // จำลองการบันทึกข้อมูลในหน่วยความจำ
            window.registeredUsers = window.registeredUsers || []
            window.registeredUsers.push({
              ...data,
              id: Date.now(),
              createdAt: new Date().toISOString()
            })
            console.log('Users in memory:', window.registeredUsers)
          }
          
          resolve()
        }, 2000)
      })
    }
  }
}
</script>

<style scoped>
/* Additional custom styles if needed */
</style>