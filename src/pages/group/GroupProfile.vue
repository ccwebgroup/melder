<template>
  <q-page>
    <q-toolbar class="text-dark">
      <q-btn to="/home" no-caps flat icon="arrow_back" />
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
      <q-item-section side top>
        <q-item class="q-gutter-x-sm">
          <q-btn dense outline round color="grey" icon="person_add" />
          <q-btn dense outline round color="grey" icon="notifications_none" />
        </q-item>
        <q-item-label class="text-dark">
          <span class="text-bold q-mr-sm">{{
            groupDetails.members ? groupDetails.members : 0
          }}</span
          >Members &bull;
          <span class="text-bold q-mr-sm">
            {{ groupDetails.updates ? groupDetails.updates : 0 }}</span
          >Updates
        </q-item-label>
      </q-item-section>
    </q-item>
    <div class="text-subtitle2 text-bold q-px-md">
      {{ groupDetails.name }}
    </div>

    <div class="text-body2 q-px-sm">
      {{ groupDetails.description }}
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
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const route = useRoute();
const tab = ref("");
const groupDetails = computed(() => store.state.group.groupDetails);

// Get Group Details
const getGroupDetails = (id) => {
  store.dispatch("group/viewGroupProfile", id);
};

onMounted(() => {
  getGroupDetails(route.params.id);
});
</script>
