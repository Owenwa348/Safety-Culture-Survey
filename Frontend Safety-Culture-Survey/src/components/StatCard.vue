<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-600">{{ title }}</p>
        <p class="text-2xl font-bold text-gray-900 mt-2">{{ value }}</p>
        <div :class="['flex items-center mt-2 text-sm', changeType === 'positive' ? 'text-green-600' : 'text-red-600']">
          <component :is="changeType === 'positive' ? 'TrendingUp' : 'TrendingDown'" class="w-4 h-4 mr-1" />
          {{ change }}
        </div>
      </div>
      <div :class="['p-3 rounded-lg', color]">
        <component :is="icon" class="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { TrendingUp, TrendingDown } from 'lucide-vue-next';
defineProps(['title', 'value', 'change', 'changeType', 'icon', 'color']);
</script>
