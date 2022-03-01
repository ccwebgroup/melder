<template>
  <q-page>
    <q-toolbar class="text-dark">
      <q-btn to="/home" no-caps flat icon="arrow_back" />
    </q-toolbar>
    <q-item>
      <q-item-section>
        <q-avatar size="90px" class="bg-teal-4" />
        <q-item-label class="text-subtitle2 q-mt-sm">
          The Modern World
        </q-item-label>
      </q-item-section>

      <q-item-section side top>
        <q-item class="q-gutter-x-sm">
          <q-btn dense outline round color="grey" icon="person_add" />
          <q-btn dense outline round color="grey" icon="notifications_none" />
        </q-item>
        <q-item-label class="text-dark">
          <span class="text-bold q-mr-sm">1462</span>Members &bull;
          <span class="text-bold q-mr-sm">57</span>Updates
        </q-item-label>
      </q-item-section>
    </q-item>
    <div class="text-body2 q-px-sm">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi, pariatur
      vitae veniam nihil, molestias maiores dicta ad esse optio cupiditate
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

<script>
import { ref } from "vue";

export default {
  data() {
    return {
      tab: "",
    };
  },
};
</script>
