<template>
  <q-page>
    <div v-for="(update, i) in updates" :key="i" class="q-mb-sm">
      <q-item>
        <q-item-section avatar>
          <q-avatar :color="update.group_avatar" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-subtitle2">{{
            update.group_name
          }}</q-item-label>
          <q-item-label caption
            >@<span>{{ update.author }}</span>
            <span class="text-bold q-mx-sm">&bull;</span>
            <span>6 days</span>
          </q-item-label>
        </q-item-section>

        <!-- <div class="q-mr-sm text-caption">
          {{ relativeDate(update.date) }}
        </div> -->
      </q-item>
      <div :class="'bg-' + update.image">
        <q-img />
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn @click="dialog = true" fab icon="add" color="primary" />
    </q-page-sticky>

    <!-- New Update Dialog -->
    <q-dialog
      seamless
      v-model="dialog"
      maximized
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card>
        <q-toolbar class="text-dark">
          <q-btn v-close-popup no-caps flat icon="arrow_back" />
        </q-toolbar>
        <q-card-section>
          <q-input
            v-model="update.content"
            borderless
            type="textarea"
            placeholder="What's on your mind?"
          />
        </q-card-section>

        <q-separator />
        <q-list>
          <q-item>
            <q-item-section avatar>
              <q-icon name="image" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-subtitle2">Media</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item>
            <q-item-section avatar>
              <q-icon name="poll" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-subtitle2">Poll</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-card-actions>
          <q-space />
          <q-btn
            :disable="!update.content"
            unelevated
            rounded
            color="primary"
            label="Post"
            dense
            style="width: 80px"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      updates: [
        {
          date: Date.now(),
          author: "Macario Sakay",
          group_avatar: "pink",
          group_name: "Butterfly Society",
          image: "orange",
          conent: "",
        },
        {
          date: Date.now(),
          author: "Impong Kabyo",
          group_avatar: "blue",
          group_name: "Butterfly Society",
          image: "green",
          conent: "",
        },
        {
          date: Date.now(),
          author: "John Doe",
          group_avatar: "brown",
          group_name: "Butterfly Society",
          image: "cyan",
          conent: "",
        },
        {
          date: Date.now(),
          author: "Digong Sakay",
          group_avatar: "teal",
          group_name: "Butterfly Society",
          image: "purple",
          conent: "",
        },
        {
          date: Date.now(),
          author: "Putin Marcos",
          group_avatar: "red",
          group_name: "Butterfly Society",
          image: "orange",
          conent: "",
        },
        {
          date: Date.now(),
          author: "Endrong Lopez",
          group_avatar: "green",
          group_name: "Butterfly Society",
          image: "pink",
          conent: "",
        },
      ],

      update: {
        content: "",
      },
    };
  },

  methods: {
    relativeDate(timestamp) {
      return qDate.formatDate(timestamp, "ddd MMMM D, YYYY | h:mm a");
    },
  },

  mounted() {
    console.log("Updates compnent is mounted!");
  },
};
</script>
