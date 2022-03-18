<template>
  <q-layout view="lHh Lpr lFf">
    <q-header :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'">
      <q-toolbar :class="$q.dark.isActive ? '' : 'text-dark'">
        <q-avatar size="30px" class="q-mr-lg">
          <img src="~assets/melder-logo.svg" />
        </q-avatar>
        <div class="text-h5 text-bold">{{ $route.name }}</div>
        <q-space />
        <div class="q-gutter-x-sm q-my-md">
          <q-btn
            @click="notifDialog = true"
            padding="none"
            size="lg"
            dense
            flat
            round
            icon="las la-bell"
          >
            <q-badge
              v-if="notifications.length"
              floating
              color="red"
              rounded
              :label="notifications.length"
            />
          </q-btn>
          <q-btn
            padding="none"
            @click="dialog = true"
            dense
            flat
            round
            size="lg"
            icon="las la-user-circle"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-footer :class="$q.dark.isActive ? 'bg-dark' : 'bg-white text-dark'">
      <q-tabs
        indicator-color="transparent"
        :active-color="$q.dark.isActive ? 'secondary' : 'primary'"
      >
        <q-route-tab to="/updates" no-caps name="update" icon="ti-announcement" label="Updates" />
        <q-route-tab to="/groups" no-caps name="groups" icon="ti-id-badge" label="Groups" />
        <q-route-tab to="/files" no-caps name="files" icon="ti-folder" label="Files" />
        <q-route-tab to="/home" no-caps name="home" icon="ti-home" label="Home" />
      </q-tabs>
    </q-footer>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>Melder Logo</q-item-label>

        <!-- <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />-->
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </q-page-container>

    <!-- User Menu Dialog -->
    <q-dialog
      full-width
      v-model="dialog"
      position="bottom"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="border-top-rounded">
        <q-card-section>
          <q-item to="/user/profile">
            <q-item-section avatar>
              <q-avatar v-if="authUser.photoURL">
                <img :src="authUser.photoURL" alt="Avatar" />
              </q-avatar>
              <q-avatar
                v-else
                color="teal"
                text-color="white"
                class="text-bold"
              >{{ authUser.displayName.charAt(0).toUpperCase() }}</q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-subtitle2 text-bold">{{ authUser.displayName }}</q-item-label>
              <q-item-label
                caption
                :class="$q.dark.isActive ? 'text-secondary' : 'text-primary'"
              >Manage Your Profile</q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>
        <div class="text-center">
          <q-separator />
          <q-btn
            padding="md"
            @click="settingsDialog = true; dialog = false;"
            flat
            no-caps
            label="Settings"
          />
          <q-separator />
          <q-btn padding="md" @click="logout" flat no-caps color="negative" label="Sign Out" />
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
              <q-item-section avatar>
                <q-icon name="mode_night" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Dark Theme</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-toggle @update:model-value="changeTheme" v-model="darkTheme" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Notifications Dialog -->
    <q-dialog
      v-model="notifDialog"
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card flat>
        <q-toolbar>
          <q-btn v-close-popup no-caps flat icon="arrow_back" />
        </q-toolbar>
        <div class="text-h6 text-bold q-px-lg">Notifications</div>
        <q-card-section class="q-gutter-y-sm">
          <div v-show="!notifications || !notifications.length" class="text-center">
            <q-icon size="lg" color="secondary" name="fas fa-cloud-sun" />
            <div class="text-subtitle1 q-mt-sm text-grey">Everything is clear.</div>
          </div>
          <q-card
            flat
            v-for="(notif, i) in notifications"
            :key="i"
            :class="notif.unread ? 'bg-teal-gradient text-white' : ''"
          >
            <q-item>
              <q-item-section avatar>
                <q-avatar size="60px" v-if="notif.from.photoURL">
                  <img :src="notif.from.photoURL" alt="Avatar" />
                </q-avatar>
                <q-avatar
                  size="60px"
                  v-else
                  color="teal"
                  text-color="white"
                  class="text-bold"
                >{{ notif.from.displayName.charAt(0).toUpperCase() }}</q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-bold q-gutter-x-sm">
                  <span>{{ notif.from.displayName }}</span>
                  <span>&bull;</span>
                  <span class="text-body2">Mar 13</span>
                </q-item-label>
                <q-item-label
                  caption
                  @click="$router.push('/group/' + notif.groupId)"
                  :class="notif.unread ? 'text-white' : ''"
                >
                  invited you to join in
                  <span class="text-bold">{{ notif.group.name }}</span>
                </q-item-label>
              </q-item-section>

              <q-item-section side top :class="notif.unread ? 'text-white' : ''">
                <q-icon name="las la-ellipsis-h" />
              </q-item-section>
            </q-item>
            <div v-if="notif.type == 'group-invite'" class="q-pa-sm text-center bg-overlay">
              <q-btn
                @click="accept(notif)"
                class="q-mr-sm"
                padding="xs lg"
                rounded
                unelevated
                dense
                outline
                no-caps
                icon="las la-user-plus"
                label="Accept"
              />
              <q-btn
                @click="decline(notif)"
                padding="xs lg"
                rounded
                unelevated
                dense
                outline
                no-caps
                label="Decline"
              />
            </div>
          </q-card>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import EssentialLink from "components/EssentialLink.vue";
import {
  ref,
  computed,
  onBeforeMount,
} from "vue";
import { useQuasar } from "quasar";
import { useAuthStore } from "../stores/auth";
import { useNotifStore } from "../stores/notifs";
import { useCodeStore } from "../stores/invite-codes";

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

const $q = useQuasar(),
  authStore = useAuthStore(),
  notifStore = useNotifStore(),
  codeStore = useCodeStore(),
  leftDrawerOpen = ref(false),
  notifDialog = ref(false),
  settingsDialog = ref(false),
  dialog = ref(false),
  darkTheme = ref(false);

//Computed properties
const authUser = computed(() => authStore.getAuthProfile),
  notifications = computed(() => notifStore.notifications)

// Inivite
const accept = (notif) => codeStore.acceptInvite(notif),
  decline = (notif) => codeStore.declineInvite(notif),
  getNotif = () => notifStore.getNotifications(); // Get notifcations

const changeTheme = (value, evt) => {
  $q.dark.set(value);
};

// Log out Method
const logout = () => {
  authStore.logoutUser()
};

onBeforeMount(() => {
  getNotif();
});
</script>
