<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from './components/HelloWorld.vue'
import { onMounted } from 'vue';

const mockGet = async () => {
  const response = await fetch('/api/getUser');
  const data = await response.json();
  console.log('mock get data:', data);
}

const mockPost = async () => {
  const response = await fetch('/api/updateUser', {
    method: 'POST'
  });
  const data = await response.json();
  console.log('mock post data:', data);
}
onMounted(async () => {
  console.log(9999)
  await mockGet();
  await mockPost();
})
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
