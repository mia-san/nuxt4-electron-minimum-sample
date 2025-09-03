<template>
  <div>
    <div style="text-align: center;">{{ timestamp }}</div>
    <NuxtWelcome />
  </div>
</template>

<script setup>
const timestamp = ref('---- startup ----');

setInterval(
  async () => {
    timestamp.value = await window.ipcRenderer.invoke('app-start-time')
  },
  1 * 1000
);
</script>
