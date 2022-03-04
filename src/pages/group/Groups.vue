<template>
  <q-page padding>
    <div class="q-mb-md q-gutter-x-md">
      <q-btn
        to="/group/create"
        dense
        no-caps
        unelevated
        rounded
        outline
        label="+ Create"
        style="width: 100px"
      />
      <q-btn
        no-caps
        dense
        unelevated
        rounded
        outline
        label="Invites"
        style="width: 100px"
      />
    </div>
    <div class="text-subtitle1 text-bold">Groups You Managed</div>
    <!-- Skeleton -->
    <div v-show="!groups_manage.length" v-for="(item, i) in 5" :key="i">
      <q-item>
        <q-item-section avatar>
          <q-skeleton type="QAvatar" />
        </q-item-section>

        <q-item-section>
          <q-item-label>
            <q-skeleton type="text" />
          </q-item-label>
          <q-item-label caption>
            <q-skeleton type="text" />
          </q-item-label>
        </q-item-section>
      </q-item>
    </div>
    <div v-if="groups_manage.length">
      <div
        @click="viewGroupProfile(group.id)"
        v-show="groups_manage"
        v-for="group in groups_manage"
        :key="group.id"
      >
        <q-item>
          <q-item-section avatar>
            <q-avatar v-if="group.photoURL">
              <img :src="group.photoURL"
            /></q-avatar>
            <div v-else>
              <q-avatar
                v-if="group.name"
                color="teal"
                text-color="white"
                class="text-bold"
                >{{ group.name.charAt(0).toUpperCase() }}</q-avatar
              >
            </div>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-subtitle2">
              {{ group.name }}
            </q-item-label>
            <q-item-label caption>
              <span>{{
                group.members.length == 0 ? 0 : group.members.length
              }}</span>
              Members
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";

const store = useStore();

// Get Groups Manage
const groups_manage = computed(() => store.state.group.groups_manage);
const getGroupsManage = () => {
  store.dispatch("group/getGroupsManage");
};

// Get Group Details
const viewGroupProfile = (id) => {
  store.dispatch("group/clearGroupDetails", id);
};

onMounted(() => {
  getGroupsManage();
});
</script>
