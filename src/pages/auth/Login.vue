<template>
  <q-page padding>
    <div class="q-pa-lg text-center">
      <img
        class="logo"
        alt="Melder Logo"
        src="~assets/melder-logo.svg"
        style="width: 120px"
      />
      <q-form class="q-gutter-md q-mt-md">
        <q-input placeholder="Email" />
        <q-input type="password" placeholder="Password" />
        <q-btn
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
          <router-link class="router-link" to="/auth/signup">
            <span class="text-h6 text-primary">Sign up</span>
          </router-link>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script></script>
