<template>
  <q-layout>
    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition
          appear
          enter-active-class="slideInRight"
          leave-active-class="slideOutRight"
        >
          <component :is="Component" :key="$route.path" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>
