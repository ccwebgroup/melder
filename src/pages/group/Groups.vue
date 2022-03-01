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
    <div v-show="loading" v-for="(item, i) in 5" :key="i">
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
    <div v-show="!loading" v-for="(group, i) in groups" :key="i">
      <q-item>
        <q-item-section avatar>
          <q-avatar size="60px" :color="group.avatar" />
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-subtitle2">
            {{ group.name }}
          </q-item-label>
          <q-item-label caption>
            <span>{{ group.members }}</span> Members
          </q-item-label>
        </q-item-section>
      </q-item>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      groups: [
        { name: "Kachinas", members: 44, avatar: "blue" },
        { name: "Tau Gamma", members: 354, avatar: "green" },
        { name: "Kabayan Party List", members: 254, avatar: "pink" },
        { name: "National Soldier", members: 54, avatar: "orange" },
      ],
    };
  },

  mounted() {
    console.log("Groups Component is mounted!");
    this.loading = false;
  },
};
</script>
