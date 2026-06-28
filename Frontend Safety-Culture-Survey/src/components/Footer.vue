<template>
  <footer class="text-white py-4 bottom-0 left-0 w-full z-50 bg-[#06202B] backdrop-blur-md shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Grid หลัก: mobile = 1 col, sm = 2 col, lg = 3 col -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-center">

        <!-- ที่อยู่ -->
        <div class="flex flex-col items-center sm:items-start text-center sm:text-left">
          <h4 class="font-bold text-sm leading-snug">บริษัท เวอร์เท่ สมาร์ท โซลูชั่น จำกัด</h4>
          <p class="mt-1 text-xs text-white/70 leading-relaxed">
            เลขที่ 18/76 หมู่ที่ 1 ตำบลเนินพระ อำเภอเมืองระยอง
          </p>
          <p class="text-xs text-white/70">จังหวัดระยอง 21000</p>
        </div>

        <!-- เบอร์กับอีเมล -->
        <div class="flex flex-col items-center gap-2">
          <div class="flex items-center gap-2 text-sm">
            <font-awesome-icon icon="phone" class="text-base flex-shrink-0" />
            <span>087-074-1477</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <font-awesome-icon icon="envelope" class="text-base flex-shrink-0" />
            <span class="break-all sm:break-normal">info@vertesmartsolution.com</span>
          </div>
        </div>

        <!-- สื่อต่างๆ -->
        <div class="flex flex-col items-center sm:col-span-2 lg:col-span-1 lg:items-end gap-2">
          <div class="flex gap-4">
            <a href="https://www.linkedin.com/company/verte-smart-solution/about/?viewAsMember=true"
               aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"
               class="text-xl hover:text-gray-400 transition">
              <font-awesome-icon :icon="['fab', 'linkedin']" />
            </a>
            <a href="https://line.me/ti/p/~kpvkpv"
               aria-label="Line" target="_blank" rel="noopener noreferrer"
               class="text-xl hover:text-green-400 transition">
              <font-awesome-icon :icon="['fab', 'line']" />
            </a>
            <a href="https://www.facebook.com/vertesmartsolution#"
               aria-label="Facebook" target="_blank" rel="noopener noreferrer"
               class="text-xl hover:text-blue-400 transition">
              <font-awesome-icon :icon="['fab', 'facebook']" />
            </a>
            <a href="https://www.youtube.com/@vertesmartsolution6082"
               aria-label="YouTube" target="_blank" rel="noopener noreferrer"
               class="text-xl hover:text-red-400 transition">
              <font-awesome-icon :icon="['fab', 'youtube']" />
            </a>
          </div>
          <p class="text-xs text-white/50">© Copyright 2025 | Verte Smart Solution</p>
        </div>

      </div>
    </div>
  </footer>
</template>