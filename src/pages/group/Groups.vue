<template>
  <q-page padding>
    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <div v-show="!loading">
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
        <div class="text-h6 text-bold">Groups You Managed</div>
        <div class="q-mt-sm" v-if="groups_manage">
          <div
            v-show="groups_manage"
            v-for="group in groups_manage"
            :key="group.id"
          >
            <q-item :to="'/group/' + group.id">
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

        <div
          v-if="!groups_manage"
          class="q-mt-md text-center"
          style="border: 3px dashed rgba(0, 128, 128, 0.37)"
        >
          <q-banner>
            <span class="text-sutitle1 text-teal">Nothing to display.</span>
            <template v-slot:action>
              <q-btn
                unelevated
                no-caps
                rounded
                color="primary"
                label="Create or join a group"
              />
            </template>
          </q-banner>
        </div>
      </div>
    </transition>

    <q-inner-loading :showing="loading" />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";

const store = useStore();
const loading = ref(true);

// Get Groups Manage
const groups_manage = computed(() => store.state.group.groups_manage);
const getGroupsManage = () => {
  store.dispatch("group/getGroupsManage");
};

// Get Group Details
const viewProfile = (id) => {
  store.dispatch("group/viewGroupProfile", id);
};

//Loading State
const showLoading = () => {
  setTimeout(() => {
    loading.value = false;
  }, 2000);
};

onMounted(() => {
  showLoading();
  getGroupsManage();
});
</script>
