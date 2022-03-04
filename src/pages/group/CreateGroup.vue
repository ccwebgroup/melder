<template>
  <q-page>
    <q-toolbar class="text-dark">
      <q-btn @click="$router.back()" no-caps flat icon="arrow_back" />
    </q-toolbar>
    <div class="text-center q-mx-md">
      <div class="text-h6 q-my-md">Create Group</div>
      <input
        @change="fileUploaded"
        type="file"
        id="fileInput"
        style="display: none"
      />
      <q-avatar @click="uploadFile" size="100px" font-size="52px" color="grey">
        <q-btn v-if="!group.photo" flat round icon="fas fa-camera" />
        <img v-else :src="group.photo" />
      </q-avatar>

      <div class="q-gutter-y-lg">
        <q-input v-model="group.name" placeholder="Group Name" />
        <q-input
          v-model="group.description"
          placeholder="Description (optional)"
          filled
          type="textarea"
        />
        <q-btn
          @click="createGroup"
          :disable="!group.name"
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
      <div class="text-subtitle1 q-mt-xl">Already have an invite code?</div>
      <q-input
        v-model="inviteCode"
        class="q-mt-md"
        rounded
        outlined
        placeholder="Type code here"
      />
      <q-btn
        :disable="!inviteCode"
        no-caps
        unelevated
        color="primary"
        class="q-mt-lg"
        label="Join Group"
      />
    </div>
  </q-page>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useStore } from "vuex";

const store = useStore();
const inviteCode = ref("");

const group = reactive({
  name: "",
  description: "",
  photo: "",
});

// Create Group
const createGroup = () => {
  store.dispatch("group/addGroup", group);
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
</script>
