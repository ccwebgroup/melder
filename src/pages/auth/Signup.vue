<template>
  <q-page padding>
    <div class="q-mx-auto q-pa-lg text-center">
      <div class="q-my-md">
        <q-btn color="red" outline round icon="fab fa-google" />
      </div>
      <div class="text-subtitle2 q-mb-sm">or</div>
      <div class="text-h6">Sign up with email</div>
      <div class="q-gutter-y-md q-mt-lg">
        <q-input v-model="user.email" filled type="email">
          <template v-slot:before>
            <q-icon name="mail" />
          </template>
        </q-input>
        <div class="q-gutter-y-md q-mt-lg">
          <q-input
            v-model="user.password"
            :type="isPwd1 ? 'password' : 'text'"
            rounded
            outlined
            placeholder="Password"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd1 ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="isPwd1 = !isPwd1"
              />
            </template>
          </q-input>

          <q-input
            v-model="user.confirmPassword"
            :type="isPwd2 ? 'password' : 'text'"
            error-message="Password does not match."
            :error="!matched"
            rounded
            outlined
            placeholder="Confirm Password"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd2 ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="isPwd2 = !isPwd2"
              />
            </template>
          </q-input>
        </div>
        <q-separator class="q-mt-lg" />
        <q-input
          v-model="user.displayName"
          filled
          label="What should we call you?"
        />
        <q-btn
          @click="signup"
          :disable="
            !user.email || !user.password || !user.displayName || !matched
          "
          ripple
          rounded
          unelevated
          color="primary"
          label="SIGN UP"
          style="width: 150px"
        />
      </div>

      <div class="q-mt-xl">
        <div class="text-body1">
          Already have an account?
          <router-link class="router-link" to="/login">
            <span class="text-h6 text-primary">Log in</span>
          </router-link>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapActions } from "vuex";
import { reactive, ref, toRef, watch } from "vue";

export default {
  setup() {
    const matched = ref(true);
    const isPwd1 = ref(true);
    const isPwd2 = ref(true);
    const user = reactive({
      email: "",
      password: "",
      confirmPassword: "",
      displayName: "",
    });

    watch(user, () => {
      if (user.password === user.confirmPassword) {
        matched.value = true;
      } else {
        matched.value = false;
      }
    });

    return {
      matched,
      isPwd1,
      isPwd2,
      user,
    };
  },

  methods: {
    ...mapActions("auth", ["signUpUser"]),

    signup() {
      this.signUpUser(this.user);
    },
  },
};
</script>
