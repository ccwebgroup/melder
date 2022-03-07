<template>
  <q-page>
    <q-toolbar>
      <q-btn @click="$router.go(-1)" no-caps flat icon="arrow_back" />
    </q-toolbar>
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <div v-show="!loading" class="q-pa-md">
        <div class="row">
          <q-space />
          <q-btn
            @click="editingMode(authUser)"
            no-caps
            flat
            :color="$q.dark.isActive ? 'secondary' : 'primary'"
            size="15px"
            label="Edit Profile"
          />
        </div>
        <div class="text-center">
          <q-avatar size="100px" v-if="authUser.photoURL">
            <img id="profile_avatar" :src="authUser.photoURL"
          /></q-avatar>
          <q-avatar
            v-else
            size="100px"
            color="teal"
            text-color="white"
            class="text-bold"
            >{{ authUser.displayName.charAt(0).toUpperCase() }}</q-avatar
          >
          <div class="text-subtitle2 text-bold q-mt-sm">
            {{ authUser.displayName }}
          </div>
          <div class="text-caption">
            <q-icon name="email" class="q-mr-sm" /><span>{{
              authUser.email
            }}</span>
          </div>
        </div>

        <div>
          <!-- Bio -->
          <div class="text-subtitle1 text-bold">Bio</div>
          <div class="text-body2">
            {{ profile.bio }}
          </div>
          <!-- Address -->
          <div class="text-subtitle1 q-mt-md text-bold">Address</div>
          <div class="text-body2">{{ profile.address }}</div>

          <!-- Social Links and Contacts -->
          <div class="q-pa-md">
            <q-btn color="primary" icon="add" label="Add social link" />
          </div>
          <q-list>
            <q-item clickable>
              <q-item-section avatar
                ><q-icon name="ti-facebook"
              /></q-item-section>
              <q-item-section> Ronil Lim </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </transition>

    <!-- Edit Profile dialog -->
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

        <q-card-section>
          <div class="text-center q-mx-md">
            <!-- Hidden File input -->
            <input
              @change="fileUploaded"
              type="file"
              id="fileInput"
              style="display: none"
            />
            <q-avatar @click="uploadFile" color="grey-3" size="100px">
              <q-icon
                v-show="!authUser.photoURL && !user.photoURL"
                color="grey"
                name="fas fa-camera"
              />
              <img
                class="user_avatar"
                v-show="authUser.photoURL || user.photoURL"
                :src="authUser.photoURL"
              />
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
          </div>

          <!-- Textfields -->
          <div class="text-subtitle1 text-bold">Basic Info</div>
          <div class="q-gutter-y-md">
            <q-input v-model="user.displayName" label="Name" />
            <q-input v-model="user.email" type="email" label="Email" />
            <q-input
              outlined
              v-model="user.bio"
              type="textarea"
              counter
              maxlength="101"
              placeholder="Say something about yourself..."
            />
          </div>
          <div class="text-subtitle1 text-bold">Address</div>
          <q-input v-model="user.address" outlined label="Address" />
        </q-card-section>

        <q-card-actions>
          <q-btn
            unelevated
            :disable="disableUpdate"
            style="width: 150px"
            rounded
            no-caps
            label="Back"
            v-close-popup
          />
          <q-space />
          <q-btn
            @click="saveProfile"
            unelevated
            :disable="disableUpdate"
            style="width: 150px"
            color="primary"
            rounded
            no-caps
            label="Update"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Confirmation Dialog before changes on email and password -->
    <q-dialog v-model="confirmDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Verify yourself</div>
        </q-card-section>

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
          <q-btn @click="confirmdUpdate" flat label="Confirm" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Loading design -->
    <q-inner-loading :showing="loading" />
  </q-page>
</template>

<script setup>
import { computed, ref, onMounted, reactive, watch } from "vue";
import { useStore } from "vuex";

const store = useStore();
const loading = ref(true);
const editDialog = ref(false);
const confirmDialog = ref(false);
const disableUpdate = ref(true);
const user = reactive({
  id: "",
  displayName: "",
  photoURL: "",
  email: "",
  password: "",
  bio: "",
  address: "",
  social_links: [],
});

const confirmDetails = reactive({
  email: "",
  password: "",
});

// Computued Properties
const authUser = computed(() => store.state.auth.authUser);
const profile = computed(() => store.state.user.profile);

// Editing Profile
const editingMode = (authUser) => {
  user.id = authUser.uid;
  user.displayName = authUser.displayName;
  user.photoURL = authUser.photoURL;
  user.email = authUser.email;
  user.bio = profile.value.bio ? profile.value.bio : "";
  user.address = profile.value.address ? profile.value.address : "";
  editDialog.value = true;
};
const saveProfile = () => {
  if (user.email !== authUser.value.email) {
    confirmDialog.value = true;
    return;
  }
  store.dispatch("user/updateUserProfile", user);
};

const confirmdUpdate = () => {
  store.dispatch("user/reAuthenticateUser", {
    credential: confirmDetails,
    newDetails: user,
  });
  confirmDialog.value = false;
};

// Watch changes on the input fields
watch(user, () => {
  disableUpdate.value = false;
});

//Image File upload
const uploadFile = () => {
  document.getElementById("fileInput").click();
};
const fileUploaded = (e) => {
  let file = e.target.files;
  if (file && file[0]) {
    let reader = new FileReader();
    reader.onload = (e) => {
      let imageBase64 = e.target.result;
      document.querySelector(".user_avatar").src = imageBase64;
      user.photoURL = imageBase64;
    };
    reader.readAsDataURL(file[0]);
  }
};

// Set USer Profile
const getUser = (id) => {
  store.dispatch("user/getUserProfile", id);
};

//Loading State
const showLoading = () => {
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

onMounted(() => {
  showLoading();
  getUser(authUser.value.uid);
});
</script>
