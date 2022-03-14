<template>
  <q-layout view="lHh Lpr lFf">
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

    <q-footer :class="$q.dark.isActive ? 'bg-dark' : 'bg-white text-dark'">
      <q-tabs
        indicator-color="transparent"
        :active-color="$q.dark.isActive ? 'secondary' : 'primary'"
      >
        <q-route-tab
          to="/updates"
          no-caps
          name="update"
          icon="ti-announcement"
          label="Updates"
        />
        <q-route-tab
          to="/groups"
          no-caps
          name="groups"
          icon="ti-id-badge"
          label="Groups"
        />
        <q-route-tab
          to="/files"
          no-caps
          name="files"
          icon="ti-folder"
          label="Files"
        />
        <q-route-tab
          to="/home"
          no-caps
          name="home"
          icon="ti-home"
          label="Home"
        />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>
