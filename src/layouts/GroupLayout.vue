<template>
  <q-layout>
    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition
          appear
          enter-active-class="slideInRight"
          leave-active-class="slideOutRight"
        >
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>
