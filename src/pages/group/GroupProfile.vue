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
      <div v-show="!loading">
        <q-item>
          <q-item-section>
            <q-avatar size="100px" v-if="groupDetails.photoURL">
              <img :src="groupDetails.photoURL"
            /></q-avatar>
            <div v-else>
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
          <q-item-section side>
            <div class="q-gutter-md">
              <q-btn
                v-if="groupDetails.myRole.settings.all"
                @click="adminDialog = true"
                dense
                outline
                round
                icon="admin_panel_settings"
              />
              <q-btn
                v-if="
                  groupDetails.myRole.settings.all ||
                  groupDetails.myRole.settings.canAdd
                "
                @click="addMemberDialog = true"
                dense
                outline
                round
                icon="person_add"
              />
              <q-btn dense outline round icon="notifications_none" />
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
                >Delete Group Permanently</q-item-section
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
        <q-toolbar :class="$q.dark.isActive ? '' : 'text-dark'">
          <q-btn v-close-popup no-caps flat icon="arrow_back" />
        </q-toolbar>
        <div class="q-px-md">
          <div class="text-h6 text-bold">Invite</div>
          <q-list>
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="ti-key" />
              </q-item-section>
              <q-item-section class="text-subtitle1"
                >Get Invite Code</q-item-section
              >
            </q-item>
          </q-list>
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
        <q-card>
          <q-card-section v-show="!searching">
            <!-- Search Results -->
            <transition
              appear
              enter-active-class="animated fadeIn"
              leave-active-class="animated fadeOut"
            >
              <div>
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
                        >{{
                          user.displayName.charAt(0).toUpperCase()
                        }}</q-avatar
                      >
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-subtitle2">{{
                        user.displayName
                      }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-btn round flat icon="las la-user-plus" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </transition>
          </q-card-section>
          <q-inner-loading color="primary" :showing="searching" />
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
    <q-inner-loading :showing="loading" />
  </q-page>
</template>

<script setup>
import { onMounted, ref, computed, reactive, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const search = ref();
const store = useStore();
const route = useRoute();
const tab = ref("");
const loading = ref(true);
const searching = ref(false);
const currentGroup = reactive({
  id: "",
  name: "",
  description: "",
  photoURL: "",
});
const adminDialog = ref(false);
const addMemberDialog = ref(true);
const editDialog = ref(false);
const disableUpdate = ref(true);
const confirmDialog = ref(false);
const confirmDetails = reactive({
  email: "",
  password: "",
});

// Store State as a computed property
const searchResults = computed(() => store.state.user.searchResults);
const groupDetails = computed(() => store.state.group.groupDetails);

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
});
watch(searchResults, (value, oldValue) => {
  if (value) {
    setTimeout(() => {
      searching.value = false;
    }, 900);
  }
});

// Get People on Search
const getPeople = () => {
  store.dispatch("user/getPeopleOnSearch", search.value);
};

// Delete Group permanently
const confirmedDelete = () => {
  store.dispatch("user/reAuthenticateUser", {
    credential: confirmDetails,
    group_id: groupDetails.value.id,
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
  store.dispatch("group/updateGroupProfile", currentGroup);
};
// Get Group Details
const getDetails = () => {
  store.dispatch("group/viewGroupProfile", route.params.id);
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

onMounted(() => {
  showLoading();
  getDetails();
});
</script>
