<template>
  <q-page v-if="groupDetails">
    <q-toolbar class="text-dark">
      <q-btn @click="$router.go(-1)" no-caps flat icon="arrow_back" />
    </q-toolbar>

    <q-item>
      <q-item-section>
        <q-avatar size="100px" v-if="groupDetails.photoURL">
          <img :src="groupDetails.photoURL"
        /></q-avatar>
        <div v-else>
          <q-avatar
            v-if="groupDetails.name"
            size="100px"
            color="teal"
            text-color="white"
            class="text-bold"
            >{{ groupDetails.name.charAt(0).toUpperCase() }}</q-avatar
          >
        </div>
      </q-item-section>

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
            <q-item @click="editDialog = true" clickable v-ripple>
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
      transition-show="slide-left"
      transition-hide="slide-right"
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
              <img v-else :src="groupDetails.photoURL" />
            </q-avatar>

            <div class="q-gutter-y-lg">
              <q-input v-model="currentGroup.name" />
              <q-input
                v-model="currentGroup.description"
                placeholder="Description (optional)"
                filled
                type="textarea"
              />
              <q-btn
                unelevated
                class="q-mb-md"
                dense
                style="width: 150px"
                color="primary"
                rounded
                no-caps
                label="Create"
              />
            </div>
          </div>
          {{ profile }}
        </q-card-section>

        <q-card-actions class="q-mt-md">
          <q-space />
          <q-btn flat size="lg" label="Cancel" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="text-subtitle2 text-bold q-px-md q-mb-sm">
      {{ groupDetails.name }}
    </div>
    <div class="text-body2 q-px-md">
      {{ groupDetails.description }}
      <div v-if="groupDetails.members" class="text-bold q-mt-md">
        {{ groupDetails.members.length == 0 ? 0 : groupDetails.members.length }}
        Members
      </div>
    </div>
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
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { onMounted, ref, computed, reactive, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const $q = useQuasar();
const store = useStore();
const route = useRoute();
const tab = ref("");
const currentGroup = reactive({
  name: "",
  description: "",
  photoURL: "",
});
const adminDialog = ref(true);
const editDialog = ref(true);
const groupDetails = computed(() => store.state.group.groupDetails);

const profile = computed(() => store.getters["groups/getProfile"]);

// watchEffect(() => {
//   () => store.getters["groups/getProfile"],
//     (term) => (currentGroup.name = term.name);
//   console.log(term);
// });

// Get Group Details
const getGroupDetails = (id) => {
  store.dispatch("group/viewGroupProfile", id);
  // if (groupDetails.value) {
  //   currentGroup.name = groupDetails.value.name;
  //   currentGroup.description = groupDetails.value.description;
  // }
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
      group.photo = e.target.result;
    };
    reader.readAsDataURL(file[0]);
  }
};

onMounted(() => {
  getGroupDetails(route.params.id);
});
</script>
