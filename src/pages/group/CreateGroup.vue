<template>
  <q-page>
    <q-toolbar class="text-dark">
      <q-btn @click="$router.back()" no-caps flat icon="arrow_back" />
    </q-toolbar>
    <div class="text-center q-mx-md">
      <div class="text-h6 q-my-md">Create Group</div>
      <q-avatar size="100px" font-size="52px" color="grey">
        <q-btn flat round icon="fas fa-camera" />
      </q-avatar>

      <div class="q-gutter-y-lg">
        <q-input placeholder="Group Name" />
        <q-input placeholder="Description (optional)" filled type="textarea" />
        <q-btn
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
      <q-input class="q-mt-md" rounded outlined placeholder="Type code here" />
      <q-btn
        no-caps
        unelevated
        color="primary"
        class="q-mt-lg"
        label="Join Group"
      />
    </div>
  </q-page>
</template>
