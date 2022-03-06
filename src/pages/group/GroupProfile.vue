<template>
  <q-page>
    <q-toolbar class="text-dark">
      <q-btn @click="$router.go(-1)" no-caps flat icon="arrow_back" />
    </q-toolbar>
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <div v-show="!loading">
        <q-item v-if="groupDetails">
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
            <div class="q-gutter-sm">
              <q-btn
                v-if="groupDetails.myRole.role_settings.all"
                @click="adminDialog = true"
                dense
                outline
                round
                icon="admin_panel_settings"
              />
              <q-btn
                v-if="
                  groupDetails.myRole.role_settings.all ||
                  groupDetails.myRole.role_settings.canAdd
                "
                dense
                outline
                round
                icon="person_add"
              />.
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

    <!-- Dialogs -->
    <q-dialog
      v-model="adminDialog"
      maximized
      transition-show="slide-left"
      transition-hide="slide-right"
    >
      <q-card>
        <q-toolbar class="text-dark">
          <q-btn v-close-popup no-caps flat icon="arrow_back" />
        </q-toolbar>
        <q-card-section class="q-gutter-y-sm">
          <div class="text-h6 text-bold">Settings</div>
          <div class="row q-gutter-x-sm">
            <q-input dense readonly label="Invite Code" />
            <q-btn dense no-caps outline color="primary" label="Copy" />
          </div>
          <q-list>
            <q-item @click="editingMode(groupDetails)" clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="edit" />
              </q-item-section>
              <q-item-section class="text-subtitle1"
                >Edit Profile</q-item-section
              >
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions class="q-mt-md">
          <q-space />
          <q-btn
            no-caps
            rounded
            color="negative"
            label="Delete Group Permanently"
          />
        </q-card-actions>
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

    <!-- Loading design -->
    <q-inner-loading :showing="loading" />
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { onMounted, ref, computed, reactive, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const route = useRoute();
const tab = ref("");
const loading = ref(true);
const currentGroup = reactive({
  id: "",
  name: "",
  description: "",
  photoURL: "",
});
const adminDialog = ref(false);
const editDialog = ref(false);
const disableUpdate = ref(true);

// Watch changes on the input fields
watch(currentGroup, () => {
  disableUpdate.value = false;
});

// Store State as a computed property
const groupDetails = computed(() => store.state.group.groupDetails);

// Editing Profile
const editingMode = (group) => {
  currentGroup.id = group.id;
  currentGroup.name = group.name;
  currentGroup.description = group.description;
  editDialog.value = true;
};
const saveProfile = () => {
  store.dispatch("group/updateGroupProfile", currentGroup);
};

// Get Group Details
const getDetails = (id) => {
  store.dispatch("group/viewGroupProfile", id);
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
  getDetails(groupDetails.value.id);
});
</script>
