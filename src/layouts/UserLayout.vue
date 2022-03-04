<template>
  <q-layout>
    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition
          appear
          enter-active-class="slide-up"
          leave-active-class="slide-down"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>
