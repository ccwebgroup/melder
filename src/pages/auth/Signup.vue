<template>
  <q-page padding>
    <div class="q-mx-auto q-pa-lg text-center">
      <div class="text-h6">Sign up with email</div>
      <div class="q-gutter-y-md q-mt-lg">
        <q-input filled placeholder="Email" />
        <div class="q-gutter-y-md q-mt-lg">
          <q-input type="password" rounded outlined placeholder="Password" />
          <q-input
            type="password"
            rounded
            outlined
            placeholder="Confirm Password"
          />
        </div>
        <q-separator class="q-mt-lg" />
        <q-input filled label="What should we call you?" />
        <q-btn
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
          <router-link class="router-link" to="/auth/login">
            <span class="text-h6 text-primary">Log in</span>
          </router-link>
        </div>
      </div>
    </div>
  </q-page>
</template>
