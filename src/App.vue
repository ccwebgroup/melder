<template>
  <router-view />
</template>
<script>
import { defineComponent } from "vue";
import { mapActions } from "vuex";

export default defineComponent({
  name: "App",

  methods: {
    ...mapActions("auth", ["handleAuthStateChanged", "logoutUser"]),
  },

  created() {
    this.handleAuthStateChanged();
    // this.logoutUser();
  },
});
</script>
