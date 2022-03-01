<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-white">
      <q-toolbar class="text-dark">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          class="desktop-only"
          @click="toggleLeftDrawer"
        />

        <q-avatar>
          <img src="~assets/melder-logo.svg" />
        </q-avatar>
        <q-space />
        <q-btn flat round size="lg" icon="person" />
      </q-toolbar>
    </q-header>

    <q-footer class="bg-white">
      <q-tabs indicator-color="transparent" class="text-dark">
        <q-route-tab
          no-caps
          name="update"
          icon="fas fa-bullhorn"
          label="Updates"
        />
        <q-route-tab no-caps name="groups" icon="fas fa-users" label="Groups" />
        <q-route-tab
          to="/home"
          no-caps
          name="home"
          icon="ti-home"
          label="Home"
        />
      </q-tabs>
    </q-footer>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Melder Logo </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink.vue";

const linksList = [
  {
    title: "Home",
    caption: "",
    icon: "home",
    link: "/home",
  },
  {
    title: "Groups",
    caption: "",
    icon: "groups",
    link: "/groups",
  },
];

import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
