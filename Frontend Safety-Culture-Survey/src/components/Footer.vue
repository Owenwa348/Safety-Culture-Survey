<template>
  <footer class="text-white py-3  ottom-0 left-0 w-full z-50 bg-[#06202B] backdrop-blur-md shadow-md">
    <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
      
      <!-- ที่อยู่ -->
      <div class="flex flex-col items-start">
        <h4 class="font-bold">บริษัท เวอร์เท่ สมาร์ท โซลูชั่น จำกัด</h4>
        <p class="mt-1">เลขที่ 18/76 หมู่ที่ 1 ตำบลเนินพระ อำเภอเมืองระยอง</p>
        <p>จังหวัดระยอง 21000</p>
      </div>

      <!-- เบอร์กับอีเมล -->
      <div class="flex flex-col items-start text-left space-y-2 mx-auto">
        <div class="flex items-center space-x-2">
          <font-awesome-icon icon="phone" class="text-lg" />
          <span>087-074-1477</span>
        </div>
        <div class="flex items-center space-x-2">
          <font-awesome-icon icon="envelope" class="text-lg" />
          <span>info@vertesmartsolution.com</span> 
        </div>
      </div>

      <!-- สื่อต่างๆ -->
      <div class="flex flex-col items-end space-y-2">
        <div class="flex space-x-4">
          <a href="https://www.linkedin.com/company/verte-smart-solution/about/?viewAsMember=true" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
            <font-awesome-icon :icon="['fab', 'linkedin']" class="text-xl hover:text-gray-400 transition" />
          </a>
          <a href="https://line.me/ti/p/~kpvkpv" aria-label="Line" target="_blank" rel="noopener noreferrer">
            <font-awesome-icon :icon="['fab', 'line']" class="text-xl hover:text-green-400 transition" />
          </a>
          <a href="https://www.facebook.com/vertesmartsolution#" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
            <font-awesome-icon :icon="['fab', 'facebook']" class="text-xl hover:text-blue-400 transition" />
          </a>
          <a href="https://www.youtube.com/@vertesmartsolution6082" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
            <font-awesome-icon :icon="['fab', 'youtube']" class="text-xl hover:text-red-400 transition" />
          </a>
        </div>
        <p class="text-sm mt-2">© Copyright 2025 | Verte Smart Solution</p>
      </div>

    </div>
  </footer>
</template>
