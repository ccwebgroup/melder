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
        <q-btn @click="dialog = true" flat round size="lg" icon="person" />
      </q-toolbar>
    </q-header>

    <q-footer class="bg-white">
      <q-tabs
        indicator-color="transparent"
        class="text-dark"
        active-color="primary"
      >
        <q-route-tab
          to="/updates"
          no-caps
          name="update"
          icon="campaign"
          label="Updates"
        />
        <q-route-tab
          to="/groups"
          no-caps
          name="groups"
          icon="group"
          label="Groups"
        />
        <q-route-tab
          to="/files"
          no-caps
          name="files"
          icon="folder"
          label="Files"
        />
        <q-route-tab to="/home" no-caps name="home" icon="home" label="Home" />
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

    <!-- User Profile Menu Dialog -->
    <q-dialog
      v-model="dialog"
      position="bottom"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <q-card-section>
          <q-item to="/user/profile">
            <q-item-section avatar>
              <q-avatar color="teal" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-subtitle2">Johnny Deep</q-item-label>
              <q-item-label caption class="text-primary"
                >Manage Your Profile</q-item-label
              >
            </q-item-section>
          </q-item>
        </q-card-section>
        <div class="text-center">
          <q-separator />
          <q-btn flat no-caps label="Settings" />
          <q-separator />
          <q-btn flat no-caps color="negative" label="Sign Out" />
        </div>
      </q-card>
    </q-dialog>
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

  data() {
    return {
      dialog: false,
    };
  },
});
</script>
