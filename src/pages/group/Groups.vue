<template>
  <q-page padding>
    <div class="q-px-sm">
      <div class="q-mb-md q-gutter-x-md">
        <q-btn
          to="/group/create"
          dense
          no-caps
          unelevated
          rounded
          outline
          color="grey"
          label="+ Create"
          style="width: 120px"
        />
        <q-btn
          no-caps
          dense
          unelevated
          rounded
          outline
          color="grey"
          label="Invites"
          style="width: 120px"
        />
      </div>
      <div class="text-h6">Groups You Managed</div>
    </div>
    <q-card flat>
      <q-card-section class="q-px-none">
        <transition
          appear
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
        >
          <div v-show="!loading">
            <div
              v-show="!groups_manage.length"
              class="q-mt-md text-center text-body1 text-grey"
            >
              <q-icon size="lg" color="primary" name="las la-parachute-box" />
              <div class="text-body1">No groups yet.</div>
              <div>Create and invite people!</div>
            </div>
            <div v-for="group in groups_manage" :key="group.id">
              <q-item :to="'/group/' + group.id">
                <q-item-section avatar>
                  <q-avatar size="60px" v-if="group.photoURL">
                    <img :src="group.photoURL" />
                  </q-avatar>
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
                  <q-item-label class="text-subtitle2 text-bold">
                    {{ group.name }}
                  </q-item-label>
                  <q-item-label caption>
                    <span>{{ group.membersCount }}</span>
                    Members
                  </q-item-label>
                </q-item-section>
              </q-item>
            </div>
          </div>
        </transition>
      </q-card-section>

      <q-inner-loading :showing="loading">
        <q-spinner-ball size="50px" color="primary" />
      </q-inner-loading>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeMount } from "vue";
import { useGroupStore } from "../../stores/groups";

const groupStore = useGroupStore();
const loading = ref(true);

// Get Groups Manage
const groups_manage = computed(() => groupStore.groupsManage);

//Loading State
const showLoading = () => {
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

onMounted(() => {
  showLoading();
});

onBeforeMount(() => {
  groupStore.getGroupsManage();
});
</script>
