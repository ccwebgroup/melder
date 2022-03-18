<template>
  <q-page>
    <q-toolbar :class="$q.dark.isActive ? '' : 'text-dark'">
      <q-btn @click="$router.go(-1)" round flat icon="arrow_back" />
    </q-toolbar>

    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <div v-show="!loading" v-if="groupDetails">
        <q-item>
          <q-item-section>
            <q-avatar size="100px" v-show="groupDetails.photoURL">
              <img id="group_avatar" :src="groupDetails.photoURL" />
            </q-avatar>
            <div v-if="!groupDetails.photoURL">
              <q-avatar
                size="100px"
                color="teal"
                text-color="white"
                class="text-bold"
                >{{ groupDetails.name.charAt(0).toUpperCase() }}</q-avatar
              >
            </div>
          </q-item-section>

          <!-- Role Buttons -->
          <q-item-section v-if="groupDetails.hasRole" side>
            <div class="q-gutter-md">
              <q-btn
                v-show="groupDetails.hasRole.settings.all"
                @click="adminDialog = true"
                dense
                outline
                round
                icon="admin_panel_settings"
              />
              <q-btn
                v-show="
                  groupDetails.hasRole.settings.all ||
                  groupDetails.hasRole.settings.canAdd
                "
                @click="openAddMemberDialog"
                dense
                outline
                round
                icon="person_add"
              />
              <q-btn dense outline round icon="notifications_none" />
            </div>
          </q-item-section>
          <q-item-section v-else side>
            <div class="column q-gutter-y-sm">
              <q-btn
                unelevated
                dense
                class="bg-teal-gradient"
                padding="xs md"
                icon="las la-user-plus"
                label="Accept"
                no-caps
              />
              <q-btn
                dense
                outline
                rounded
                padding="xs lg"
                label="Decline"
                no-caps
              />
            </div>
          </q-item-section>
        </q-item>
        <div class="text-subtitle2 text-bold q-px-md q-mb-sm">
          {{ groupDetails.name }}
        </div>
        <div class="text-body2 q-px-md">
          <!-- Description is optional -->
          <div v-if="groupDetails.description">
            {{ groupDetails.description }}
          </div>
          <div v-if="groupDetails.members" class="text-bold q-mt-md">
            {{
              groupDetails.members.length == 0 ? 0 : groupDetails.members.length
            }}
            Members
          </div>
        </div>
        <!-- Tabs -->
        <q-tabs
          v-model="tab"
          dense
          no-caps
          class="q-mt-md q-mx-sm"
          indicator-color="primary"
        >
          <q-tab name="updates" label="Updates" />
          <q-tab name="people" label="People" />
          <q-tab name="files" label="Files" />
        </q-tabs>
      </div>
    </transition>

    <!-- Admin Dialog -->
    <q-dialog
      v-model="adminDialog"
      maximized
      transition-show="slide-left"
      transition-hide="slide-right"
    >
      <q-card>
        <q-toolbar :class="$q.dark.isActive ? '' : 'text-dark'">
          <q-btn v-close-popup no-caps flat icon="arrow_back" />
        </q-toolbar>
        <q-card-section class="q-gutter-y-sm">
          <div class="text-h6 text-bold">Settings</div>
          <q-list>
            <q-item @click="editingMode(groupDetails)" clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="ti-pencil-alt" />
              </q-item-section>
              <q-item-section class="text-subtitle1"
                >Edit Group Profile</q-item-section
              >
            </q-item>
            <q-item
              :class="$q.dark.isActive ? 'text-warning' : 'text-negative'"
              @click="confirmDialog = true"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon name="ti-trash" />
              </q-item-section>
              <q-item-section class="text-subtitle1"
                >Delete Group</q-item-section
              >
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Add Member Dialog -->
    <q-dialog
      v-model="addMemberDialog"
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <q-card class="fixed-top">
          <q-toolbar :class="$q.dark.isActive ? '' : 'text-dark'">
            <q-btn v-close-popup no-caps flat icon="arrow_back" />
          </q-toolbar>
          <div class="q-px-md q-mb-md">
            <div class="text-h6 text-bold q-mb-sm">Invite</div>
            <q-input
              v-model="search"
              debounce="500"
              dense
              rounded
              outlined
              type="search"
              placeholder="Search"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </q-card>

        <!-- Search Results -->
        <q-card>
          <q-card-section v-if="searchResults">
            <!-- Search Results -->
            <transition
              appear
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut"
            >
              <div>
                <div v-show="searchResults.length == 0" class="text-subtitle2">
                  Search not found.
                </div>
                <q-list dense>
                  <q-item v-for="user in searchResults" :key="user.id">
                    <q-item-section avatar>
                      <q-avatar v-if="user.photoURL">
                        <img :src="user.photoURL" alt="Avatar" />
                      </q-avatar>
                      <q-avatar
                        v-else
                        color="teal"
                        text-color="white"
                        class="text-bold"
                      >
                        {{ user.displayName.charAt(0).toUpperCase() }}
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-subtitle2">
                        {{ user.displayName }}
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-btn
                        v-if="!user.alreadyMember"
                        @click="invite(user.id)"
                        :disable="user.invited"
                        round
                        flat
                        :color="user.invited ? 'positive' : ''"
                        :icon="
                          user.invited
                            ? 'las la-user-check'
                            : 'las la-user-plus'
                        "
                      />
                      <q-icon v-else name="las la-check" color="positive" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </transition>
          </q-card-section>
          <q-inner-loading color="primary" :showing="searching" />
        </q-card>

        <q-card
          class="fixed-bottom q-py-md border-top-rounded bg-primary text-white"
        >
          <q-card-section>
            <div class="text-body1 q-mb-sm">Get invite code</div>
            <q-btn-group outline>
              <q-btn
                no-caps
                @click="copyCode(defaultInviteCode)"
                outline
                padding="md lg"
                :label="defaultInviteCode"
              />

              <q-btn-dropdown auto-close outline icon="settings">
                <q-list>
                  <q-item-label header class="text-subtitle1"
                    >Expiration</q-item-label
                  >
                  <q-item @click="setExpiration(false)" clickable>
                    <q-item-section avatar>
                      <q-avatar>
                        <q-icon name="las la-times-circle" />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-subtitle1"
                        >No Limit</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                  <q-item @click="setExpiration(7)" clickable>
                    <q-item-section avatar>
                      <q-avatar>
                        <q-icon name="las la-stopwatch" />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-subtitle1">7 Days</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item @click="setExpiration(1)" clickable>
                    <q-item-section avatar>
                      <q-avatar>
                        <q-icon name="las la-stopwatch" />
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-subtitle1">1 Day</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-btn-group>
          </q-card-section>
        </q-card>
      </q-card>
    </q-dialog>

    <!-- Edit Dialog -->
    <q-dialog
      v-model="editDialog"
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <q-toolbar class="text-dark">
          <q-btn v-close-popup no-caps flat icon="arrow_back" />
        </q-toolbar>
        <q-card-section class="q-gutter-y-sm">
          <div class="text-h6 text-bold">Group Profile</div>
          <div class="text-center q-mx-md">
            <input
              @change="fileUploaded"
              type="file"
              id="fileInput"
              style="display: none"
            />
            <q-avatar @click="uploadFile" size="100px">
              <q-icon v-if="!groupDetails.photoURL" name="fas fa-camera" />
              <img class="group_avatar" v-else :src="groupDetails.photoURL" />
            </q-avatar>
            <div>
              <q-btn
                @click="uploadFile"
                flat
                size="lg"
                no-caps
                label="Upload"
              />
            </div>

            <div class="q-gutter-y-lg">
              <q-input v-model="currentGroup.name" />
              <q-input
                v-model="currentGroup.description"
                placeholder="Description (optional)"
                filled
                type="textarea"
              />
              <q-btn
                @click="saveProfile"
                :disable="disableUpdate"
                unelevated
                class="q-mb-md"
                style="width: 150px"
                color="primary"
                rounded
                no-caps
                label="Update"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions class="q-mt-md">
          <q-space />
          <q-btn v-close-popup flat size="lg" label="Back" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Confirmation dialog before group deletion -->
    <q-dialog v-model="confirmDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Verify yourself</div>
        </q-card-section>
        <div
          class="q-pa-md text-subtitle2"
          :class="$q.dark.isActive ? 'text-warning' : 'text-negative'"
        >
          Please confirm all details to permanently delete group
        </div>

        <q-card-section class="q-pt-none q-gutter-y-sm">
          <q-input
            type="email"
            v-model="confirmDetails.email"
            autofocus
            label="Email"
          />
          <q-input
            type="password"
            v-model="confirmDetails.password"
            label="Password"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn @click="confirmedDelete" flat label="Confirm" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Loading design -->
    <q-inner-loading :showing="loading">
      <q-spinner-ball size="50px" color="primary" />
    </q-inner-loading>
  </q-page>
</template>

<script setup>
import { ref, computed, reactive, watch, onBeforeMount, onMounted } from "vue";
import { copyToClipboard } from "quasar";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
import { useGroupStore } from "../../stores/groups";
import { useAuthStore } from "../../stores/auth";
import { useCodeStore } from "../../stores/invite-codes";
const currentGroup = reactive({
  id: "",
  name: "",
  description: "",
  photoURL: "",
});
const confirmDetails = reactive({
  email: "",
  password: "",
});
const inviteCode = reactive({
  expiration: "",
  groupId: "",
});

const search = ref(),
  $q = useQuasar(),
  groupStore = useGroupStore(),
  authStore = useAuthStore(),
  codeStore = useCodeStore(),
  route = useRoute(),
  tab = ref(""),
  loading = ref(true),
  searching = ref(false),
  disableUpdate = ref(true);
// Dialogs
const adminDialog = ref(false),
  addMemberDialog = ref(false),
  editDialog = ref(false),
  confirmDialog = ref(false);

// Store State as a computed property
const searchResults = null;
const groupDetails = computed(() => groupStore.groupProfile);
const inviteCodes = computed(() => codeStore.inviteCodes);

// Watch changes on the input fields
watch(currentGroup, () => {
  disableUpdate.value = false;
});

// WATCH search input
watch(search, (value, oldValue) => {
  if (value) {
    searching.value = true;
    getPeople();
  }
  if (!value) {
    getPeople();
  }
});

/* watch(searchResults, (value, oldValue) => {
  if (value) {
    setTimeout(() => {
      searching.value = false;
    }, 700);
  }
}); */

const openAddMemberDialog = () => {
  if (!inviteCodes.value.length) {
    setExpiration(1);
  } else {
    defaultInviteCode.value = inviteCodes.value[0].id;
  }
  // store.dispatch("user/getPeopleOnSearch", {});
  addMemberDialog.value = true;
};

const somedate = {
  createdAt: "March 17, 2022 at 12:34:23 AM UTC+8",
  creatorId: "GKSCIjLrHMRwoU5h7awji0ZsCwp2",
  expiration: false,
  groupId: "2T7O0obZTcoMsUQbSdcO",
  id: "KilduqG9QUW41FvcyxH2",
};

// Get invite codes
const getCodes = () => {
  codeStore.getInviteCodes({
    groupId: route.params.id,
  });
};
const defaultInviteCode = ref();

// Set Invite Code Expiration
const setExpiration = async (expiration) => {
  // Check if code exist
  const index = inviteCodes.value.findIndex(
    (code) => code.expiration == expiration
  );
  console.log(index);
  if (index >= 0) {
    defaultInviteCode.value = inviteCodes.value[index].id;
  } else {
    let newCode = await codeStore.addInviteCode({
      expiration: expiration,
      groupId: route.params.id,
    });
    defaultInviteCode.value = newCode.id;
  }
};

// Copy invite code to clipboard
const copyCode = (code) => {
  copyToClipboard(code).then(() => {
    $q.notify({
      message: "Invite code copied",
      color: "positive",
    });
  });
};

// Invite User
const invite = (id) =>
  groupStore.sendGroupInvite({
    userId: id,
    groupId: groupDetails.value.id,
  });

// Get People on Search
const getPeople = () => {
  // no code yet
};

// Delete Group
const confirmedDelete = () => {
  authStore.reAuthenticateUser({
    credential: confirmDetails,
    groupId: groupDetails.value.id,
    groupDelete: true,
  });
  confirmDialog.value = false;
};

// Editing Profile
const editingMode = (group) => {
  currentGroup.id = group.id;
  currentGroup.name = group.name;
  currentGroup.description = group.description;
  editDialog.value = true;
  adminDialog.value = false;
};
const saveProfile = () => {
  groupStore.updateGroupProfile(currentGroup);
};

//Image Upload
const uploadFile = () => {
  document.getElementById("fileInput").click();
};
const fileUploaded = (e) => {
  let file = e.target.files;
  if (file && file[0]) {
    let reader = new FileReader();
    reader.onload = (e) => {
      let imageBase64 = e.target.result;
      document.querySelector(".group_avatar").src = imageBase64;
      currentGroup.photoURL = imageBase64;
    };
    reader.readAsDataURL(file[0]);
  }
};

//Loading State
const showLoading = () => {
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

onBeforeMount(() => {
  getCodes();
  groupStore.getGroupProfile(route.params.id);
  showLoading();
});
</script>
