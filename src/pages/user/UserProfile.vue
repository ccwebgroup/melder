<template>
  <q-page>
    <q-toolbar class="text-dark">
      <q-btn @click="$router.go(-1)" no-caps flat icon="arrow_back" />
    </q-toolbar>
    <div class="q-mx-auto text-center">
      <q-avatar size="100px" v-if="authUser.photoURL">
        <img src="https://cdn.quasar.dev/img/avatar.png"
      /></q-avatar>
      <q-avatar
        v-else
        size="100px"
        color="teal"
        text-color="white"
        class="text-bold"
        >{{ authUser.displayName.charAt(0).toUpperCase() }}</q-avatar
      >

      <div class="text-subtitle2 text-bold q-mt-sm">
        {{ authUser.displayName }}
      </div>
      <div class="text-caption">
        <q-icon name="email" class="q-mr-sm" /><span>{{ authUser.email }}</span>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();

const authUser = computed(() => store.state.auth.authUser);
</script>
