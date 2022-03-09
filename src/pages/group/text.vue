<template>
  <q-item>
    <q-item-section>
      <q-avatar size="100px" v-if="groupDetails.photoURL">
        <img :src="groupDetails.photoURL"
      /></q-avatar>
      <div v-else>
        <q-avatar
          size="100px"
          color="teal"
          text-color="white"
          class="text-bold"
          >{{ groupDetails.name.charAt(0).toUpperCase() }}</q-avatar
        >
      </div>
    </q-item-section>
    <!-- Role Buttons -->
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
  <div class="text-subtitle2 text-bold q-px-md q-mb-sm">
    {{ groupDetails.name }}
  </div>
  <div class="text-body2 q-px-md">
    <!-- Description is optional -->
    <div v-if="groupDetails.description">
      {{ groupDetails.description }}
    </div>
    <div v-if="groupDetails.members" class="text-bold q-mt-md">
      {{ groupDetails.members.length == 0 ? 0 : groupDetails.members.length }}
      Members
    </div>
  </div>
  <!-- Tabs -->
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
</template>
