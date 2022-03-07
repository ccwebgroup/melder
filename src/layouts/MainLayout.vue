<template>
  <q-layout view="lHh Lpr lFf">
    <q-header :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'">
      <q-toolbar :class="$q.dark.isActive ? '' : 'text-dark'">
        <q-avatar>
          <img src="~assets/melder-logo.svg" />
        </q-avatar>
        <q-space />
        <q-btn @click="dialog = true" flat round size="lg" icon="person" />
      </q-toolbar>
    </q-header>

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

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Melder Logo </q-item-label>

        <!-- <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        /> -->
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
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
              <q-avatar v-if="authUser.photoURL" color="teal">
                <img :src="authUser.photoURL" alt="Avatar" />
              </q-avatar>
              <q-avatar
                v-else
                color="teal"
                text-color="white"
                class="text-bold"
                >{{ authUser.displayName.charAt(0).toUpperCase() }}</q-avatar
              >
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-subtitle2 text-bold">{{
                authUser.displayName
              }}</q-item-label>
              <q-item-label
                caption
                :class="$q.dark.isActive ? 'text-secondary' : 'text-primary'"
                >Manage Your Profile</q-item-label
              >
            </q-item-section>
          </q-item>
        </q-card-section>
        <div class="text-center">
          <q-separator />
          <q-btn
            @click="
              settingsDialog = true;
              dialog = false;
            "
            flat
            no-caps
            label="Settings"
          />
          <q-separator />
          <q-btn
            @click="logout"
            flat
            no-caps
            color="negative"
            label="Sign Out"
          />
        </div>
      </q-card>
    </q-dialog>

    <!-- App Settings Dialog -->
    <q-dialog
      v-model="settingsDialog"
      maximized
      transition-show="slide-left"
      transition-hide="slide-right"
    >
      <q-card>
        <q-toolbar>
          <q-btn v-close-popup no-caps flat icon="arrow_back" />
        </q-toolbar>
        <q-card-section>
          <div class="text-h6 text-bold">Settings</div>
          <q-list>
            <q-item>
              <q-item-section avatar
                ><q-icon name="mode_night"
              /></q-item-section>
              <q-item-section>
                <q-item-label>Dark Theme</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle
                  @update:model-value="changeTheme"
                  v-model="darkTheme"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import EssentialLink from "components/EssentialLink.vue";
import { useStore } from "vuex";
import { defineComponent, ref, computed, watch } from "vue";
import { useQuasar } from "quasar";

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

const $q = useQuasar();
const store = useStore();
const leftDrawerOpen = ref(false);
const authUser = computed(() => store.state.auth.authUser);
const settingsDialog = ref(false);
const dialog = ref(false);
const darkTheme = ref();

//Get Auth User Profile details
const profile = computed(() => store.state.user.profile);

darkTheme.value = profile.value.darkTheme;
const changeTheme = (value, evt) => {
  $q.dark.set(value);
  store.dispatch("user/setTheme", value);
};

// Log out Method
const logout = () => {
  store.dispatch("auth/logoutUser");
};
</script>
