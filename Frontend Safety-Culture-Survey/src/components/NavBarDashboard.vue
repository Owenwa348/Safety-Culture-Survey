<template>
  <div class="min-h-screen bg-[#0A2A3A] text-white">
    <!-- Navbar -->
    <nav class="bg-gradient-to-r from-[#06202B] to-[#0A2A3A] shadow-lg border-b border-gray-700 sticky top-0 z-50 backdrop-blur-sm">
      <div class="w-full px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo + Toggle -->
          <div class="flex items-center">
            <button @click="sidebarOpen = !sidebarOpen" class="mr-4 lg:hidden p-2 rounded-lg hover:bg-white/10">
              <span class="block w-5 h-0.5 bg-white mb-1"></span>
              <span class="block w-5 h-0.5 bg-white mb-1"></span>
              <span class="block w-5 h-0.5 bg-white"></span>
            </button>
            <router-link to="/Home" class="flex items-center">
              <img src="/logoandname.png" alt="Logo" class="h-10 w-auto drop-shadow-lg" />
            </router-link>
          </div>

          <!-- Right: Notifications + Avatar -->
          <div class="flex items-center space-x-3">
            <button class="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg relative group">
              <svg class="w-5 h-5 group-hover:animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span class="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-lg animate-pulse">
                3
              </span>
            </button>
            <div class="w-8 h-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-sm font-bold ring-2 ring-white/20">
              JD
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Overlay for mobile -->
    <div v-if="sidebarOpen" @click="sidebarOpen = false" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"></div>

    <!-- Sidebar -->
    <aside :class="['lg:translate-x-0 fixed lg:static inset-y-0 right-0 z-40 w-72 transition-all duration-300 ease-out', sidebarOpen ? 'translate-x-0' : 'translate-x-full']">
      <div class="h-full bg-gradient-to-b from-[#06202B] via-[#0A2A3A] to-[#06202B] backdrop-blur-lg border-l border-white/10 shadow-2xl p-4 space-y-2">
        <template v-for="item in navItems">
          <!-- Menu without children -->
          <button
            v-if="!item.children"
            :key="`btn-${item.id}`"
            @click="selectTab(item.id)"
            :class="getClass(item.id)"
          >
            <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.iconPath" />
            </svg>
            {{ item.label }}
          </button>

          <!-- Menu with children (Dropdown) -->
          <div v-else :key="`div-${item.id}`">
            <button @click="toggleExpand(item.id)" :class="getClass(item.id, true)">
              <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.iconPath" />
              </svg>
              {{ item.label }}
              <svg class="ml-auto w-4 h-4 transition-transform" :class="{ 'rotate-180': expandedMenu === item.id }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
              </svg>
            </button>

            <div v-if="expandedMenu === item.id" class="ml-6 mt-1 space-y-1">
              <button
                v-for="sub in item.children"
                :key="sub.id"
                @click="selectTab(sub.id)"
                :class="getClass(sub.id)"
              >
                <svg v-if="sub.iconPath" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="sub.iconPath" />
                </svg>
                <span v-else class="w-4 h-4 mr-2 flex items-center justify-center text-xs">•</span>
                {{ sub.label }}
              </button>
            </div>
          </div>
        </template>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps({ activeTab: String });
const emit = defineEmits(['update:activeTab']);

const sidebarOpen = ref(false);
const expandedMenu = ref(null);

const toggleExpand = (id) => {
  expandedMenu.value = expandedMenu.value === id ? null : id;
};

const selectTab = (id) => {
  emit('update:activeTab', id);
  sidebarOpen.value = false;
};

// SVG path definitions for icons
const navItems = [
  { 
    id: 'Dashboard', 
    iconPath: "m3 12 2-2m0 0 7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11 2 2m-2-2v10a1 1 0 0 1-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1m-6 0h6", 
    label: 'หน้าหลัก' 
  },
  {
    id: 'Analytics',
    iconPath: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    label: 'ผลลัพธ์การประเมิน',
    children: [
      { id: 'PositionResults', label: 'ผลการประเมินแยกตามหน่วยงาน' },
      { id: 'Analytics-by-unit', label: 'ผลประเมินตามข้อคำถาม' },
    ],
  },
  { 
    id: 'Users', 
    iconPath: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m0 0a4 4 0 005-3.803", 
    label: 'รายชื่อผู้ใช้' 
  },
  {
    id: 'settings',
    iconPath: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    label: 'การตั้งค่าระบบ',
    children: [
      { 
        id: 'Admin', 
        iconPath: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m0 0a4 4 0 005-3.803", 
        label: 'ผู้ดูแลระบบ' 
      },
      { 
        id: 'UploadContacts', 
        iconPath: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12", 
        label: 'อัปโหลดรายชื่อผู้ตประเมิน' 
      },
    ],
  },
];

const getClass = (id, isParent = false) => {
  const baseClasses = 'w-full flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 group relative';
  const activeClasses = 'bg-gradient-to-r from-[#7AE2CF] to-[#5DD4C1] text-black shadow-md scale-105';
  const inactiveClasses = 'text-gray-300 hover:bg-white/10 hover:text-white';
  const parentClasses = isParent ? 'justify-between' : '';
  
  return `${baseClasses} ${props.activeTab === id ? activeClasses : inactiveClasses} ${parentClasses}`;
};
</script>

<style scoped>
/* Optional smooth animation */
nav button {
  animation: slideIn 0.3s ease-out forwards;
}
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>