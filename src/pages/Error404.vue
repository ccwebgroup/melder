<template>
  <q-card flat>
    <q-card-section class="text-center q-pa-lg">
      <q-img
        style="width: 200px; margin-top: 120px"
        src="~assets/towing_re_cqhj.svg"
      />
      <div class="text-h6 q-mt-sm">
        This page isn't available. Sorry about that.
      </div>
    </q-card-section>
    <q-card-actions align="center">
      <q-btn
        to="/"
        class="text-bold"
        unelevated
        outline
        no-caps
        label="Go to Home page. "
      >
        <q-avatar size="30px" class="q-ml-sm">
          <img src="~assets/melder-logo.svg" /> </q-avatar
      ></q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Error404",
});
</script>
