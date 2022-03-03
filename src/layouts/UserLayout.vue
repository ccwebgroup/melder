<template>
  <q-layout>
    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition
          appear
          enter-active-class="slide-up"
          leave-active-class="slide-down"
        >
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>
