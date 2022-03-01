<template>
  <q-page padding>
    <q-card flat>
      <q-card-section>
        <q-btn
          @click="dialog = true"
          no-caps
          unelevated
          outline
          rounded
          dense
          label="+ Schedule"
          style="width: 100px"
        />

        <!-- Dialog for Creating a Schedule -->
        <q-dialog
          v-model="dialog"
          maximized
          transition-show="slide-up"
          transition-hide="slide-down"
        >
          <q-card>
            <q-toolbar class="text-dark">
              <q-btn v-close-popup no-caps flat icon="arrow_back" />
            </q-toolbar>
            <q-card-section> </q-card-section>
          </q-card>
        </q-dialog>

        <q-list dense class="q-mt-md">
          <q-item dense>
            <q-item-section>
              <q-item-label class="text-subtitle2">Mar 8</q-item-label>
              <q-item-label caption>8:00 AM</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-subtitle2"
                >General Meeting</q-item-label
              >
            </q-item-section>
          </q-item>
          <q-separator />
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      dialog: true,
    };
  },
};
</script>
