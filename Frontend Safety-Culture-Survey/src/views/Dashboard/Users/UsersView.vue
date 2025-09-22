<script setup>
import UserList from '../Users/UserList.vue';
import Admin from './Admin/AdminList.vue';
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
      <UserList />
    </div>
    <div class="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
      <Admin />
    </div>
  </div>
</template>