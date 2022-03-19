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
          class="text-bold"
          @submit="login"
          type="submit"
          ripple
          rounded
          unelevated
          color="primary"
          label="LOG IN"
          style="width: 150px"
        />
      </q-form>

      <div class="q-mt-xl">
        <div class="text-body1">
          Need an account?
          <q-btn
            padding="none"
            no-caps
            to="/signup"
            class="text-bold text-subtitle2"
            ripple
            flat
            color="primary"
            label="Sign up"
          />
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
