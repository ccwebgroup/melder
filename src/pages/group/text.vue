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
      <div v-show="!loading" class="q-pa-md">
        <div class="text-h6 text-bold">Your Profile</div>
        <div class="row">
          <q-space />
          <q-btn
            @click="editingMode(authUser)"
            no-caps
            flat
            color="primary"
            size="15px"
            label="Edit Profile"
          />
        </div>
        <div class="text-center">
          <q-avatar size="100px" v-if="authUser.photoURL">
            <img src="https://cdn.quasar.dev/img/avatar.png"
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
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Rem neque
            nisi velit sun voluptatibus.
          </div>
          <!-- Address -->
          <div class="text-subtitle1 q-mt-md text-bold">Address</div>
          <div class="text-body2">So. Trozo, Brgy Buluangan, Scc</div>
          <!-- Social Links and Contacts -->
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

        <q-card-section>
          <div class="text-center q-mx-md">
            <!-- Hidden File input -->
            <input
              @change="fileUploaded"
              type="file"
              id="fileInput"
              style="display: none"
            />
            <!-- <q-avatar @click="uploadFile" size="100px">
              <q-icon v-if="!authUser.photoURL" name="fas fa-camera" />
              <img class="group_avatar" v-else :src="authUser.photoURL" />
            </q-avatar> -->
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Loading design -->
    <q-inner-loading :showing="loading" />
  </q-page>
</template>

<script setup>
import { computed, ref, onMounted, reactive } from "vue";
import { useStore } from "vuex";

const store = useStore();
const loading = ref(true);
const editDialog = ref(true);
const user = reactive({
  id: "",
  displayName: "",
  photoURL: "",
  email: "",
  password: "",
  bio: "",
  address: "",
  social_links: [{ username: "", link: "" }],
});
// Computued Properties
const authUser = computed(() => store.state.auth.authUser);

const editingMode = (authUser) => {
  user.id = authUser.uid;
  user.displayName = authUser.displayName;
  user.email = authUser.email;
  user.bio = authUser.bio ? authUser.bio : "";
  user.address = authUser.address ? authUser.address : "";
  editDialog.value = true;
};

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

//Loading State
const showLoading = () => {
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

onMounted(() => {
  showLoading();
});
</script>
