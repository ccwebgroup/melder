<template>
  <router-view />
</template>

<script setup>
import { onBeforeMount } from "vue";
import { useAuthStore } from "./stores/auth";

const authStore = useAuthStore();

const handler = () => {
  authStore.handleAuthStateChanged();
};

onBeforeMount(() => {
  handler();
});
</script>
