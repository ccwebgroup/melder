<template>
  <q-page>
    <q-card flat>
      <q-toolbar class="text-dar">
        <q-btn @click="$router.back()" no-caps flat icon="arrow_back" />

        <div class="text-h6">Create Group</div>
      </q-toolbar>
      <q-card-section class="flex flex-center">
        <input
          @change="fileUploaded"
          type="file"
          id="fileInput"
          style="display: none"
        />
        <q-avatar
          @click="uploadFile"
          size="100px"
          font-size="52px"
          color="grey"
        >
          <q-btn v-if="!group.photo" flat round icon="fas fa-camera" />
          <img v-else :src="group.photo" />
        </q-avatar>
      </q-card-section>
      <div class="text-subtitle1 text-center">Upload</div>
      <q-card-section class="q-py-none q-gutter-y-sm">
        <q-input v-model="group.name" placeholder="Group Name" />
        <q-input
          rows="5"
          v-model="group.description"
          placeholder="Description (optional)"
          filled
          type="textarea"
        />

        <q-toggle label="Private" v-model="group.private" />
      </q-card-section>
      <q-card-actions align="center">
        <q-btn
          @click="createGroup"
          :disable="!group.name"
          unelevated
          class="q-mb-sm"
          dense
          padding="sm"
          style="width: 150px"
          color="primary"
          rounded
          no-caps
          label="Create"
        />
      </q-card-actions>
    </q-card>

    <q-card square flat class="bg-blue-gradient text-white">
      <q-card-section>
        <div class="text-subtitle1 text-center">
          Already have an invite code?
        </div>
        <q-input
          color="white"
          dark
          dense
          v-model="inviteCode"
          class="q-mt-sm"
          rounded
          outlined
          placeholder="Type code here"
        />
      </q-card-section>
      <q-card-actions align="right" class="q-pb-md">
        <q-btn
          :disable="!inviteCode"
          unelevated
          dense
          style="width: 150px"
          rounded
          no-caps
          label="Join Group"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useGroupStore } from "../../stores/groups";
import { useRouter } from "vue-router";

const router = useRouter();
const groupStore = useGroupStore();
const inviteCode = ref("");

const group = reactive({
  name: "",
  description: "",
  photo: "",
  private: false,
});

// Create Group
const createGroup = async () => {
  const groupId = await groupStore.addGroup(group);
  router.push("/group/" + groupId);
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
