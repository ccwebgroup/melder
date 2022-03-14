<template>
  <q-page class="flex flex-center">
    <div class="q-pa-lg text-center">
      <img
        class="logo"
        alt="Melder Logo"
        src="~assets/melder-logo.svg"
        style="width: 120px"
      />
      <q-form @submit="login" class="q-gutter-y-md q-mt-md">
        <q-input
          dense
          rounded
          outlined
          v-model="credentials.email"
          type="email"
          placeholder="Email"
        />
        <q-input
          dense
          rounded
          outlined
          v-model="credentials.password"
          :type="isPwd ? 'password' : 'text'"
          placeholder="Password"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility' : 'visibility_off'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <q-btn
          @submit="login"
          type="submit"
          ripple
          flat
          color="primary"
          label="LOG IN"
          size="lg"
        />
      </q-form>

      <div class="q-mt-xl">
        <div class="text-body1">
          Need an account?
          <router-link class="router-link" to="/signup">
            <span class="text-h6 text-primary">Sign up</span>
          </router-link>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useStore } from "vuex";

const store = useStore();
const isPwd = ref(true);
const credentials = reactive({
  email: "",
  password: "",
});

// Log in User
const login = () => store.dispatch("auth/loginUser", credentials);
</script>
