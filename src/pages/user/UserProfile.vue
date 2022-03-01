<template>
  <q-page>
    <q-toolbar class="text-dark">
      <q-btn to="/home" no-caps flat icon="arrow_back" />
    </q-toolbar>
    <div class="q-ml-auto" style="max-width: 100px">
      <q-btn
        @click="dialog = true"
        dense
        unelevated
        outline
        rounded
        no-caps
        icon="edit"
        label="Edit"
        style="width: 90px"
      />
    </div>

    <!-- Edit Profile Dialog -->
    <q-dialog
      v-model="dialog"
      transition-show="slide-up"
      transition-hide="slide-down"
      seamless
      maximized
    >
      <q-card>
        <q-toolbar class="text-dark">
          <q-btn v-close-popup no-caps flat icon="arrow_back" />
        </q-toolbar>
        <q-card-section class="text-center">
          <div>
            <q-avatar size="90px" class="bg-teal-4" />
          </div>
          <q-btn dense flat no-caps label="Upload" />
        </q-card-section>

        <q-card-section>
          <div class="text-subtitle1 text-bold">Basic Information</div>
          <q-input label="Name" v-model="user.name" />
          <q-input label="Email" v-model="user.email" type="email" />
          <q-input label="Address" v-model="user.address" />
          <q-input label="Mobile No." v-model="user.mobile" />

          <div class="text-subtitle1 text-bold q-mt-md">Change Password</div>
          <div class="q-pa-md q-gutter-y-sm">
            <q-input
              dense
              rounded
              outlined
              type="password"
              label="New Password"
            />
            <q-input
              dense
              rounded
              outlined
              type="password"
              label="Confirm Password"
            />
          </div>
        </q-card-section>

        <q-card-actions>
          <q-btn dense no-caps flat v-close-popup>Back</q-btn>
          <q-space />
          <q-btn
            dense
            unelevated
            no-caps
            rounded
            color="primary"
            style="width: 80px"
            >Update</q-btn
          >
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="q-mx-auto" style="max-width: 100px">
      <q-avatar size="90px" class="bg-teal-4" />
    </div>
    <q-item class="text-center">
      <q-item-section>
        <q-item-label class="text-subtitle2 q-mt-sm">
          Johnny Deep
        </q-item-label>
        <q-item-label>
          <q-icon name="email" />
          johjohn@gmail.com
        </q-item-label>
      </q-item-section>

      <!-- <q-item-section side top>
        <q-item class="q-gutter-x-sm">
          <q-btn dense outline round color="grey" icon="person_add" />
          <q-btn dense outline round color="grey" icon="notifications_none" />
        </q-item>
        <q-item-label class="text-dark">
          <span class="text-bold q-mr-sm">1462</span>Members &bull;
          <span class="text-bold q-mr-sm">57</span>Updates
        </q-item-label>
      </q-item-section> -->
    </q-item>
    <div class="q-pa-md">
      <div class="text-subtitle2">Groups Managed</div>
      <q-list>
        <q-item>
          <q-item-section avatar>
            <q-avatar size="60px" color="orange" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-subtitle2">Goreed Society</q-item-label>
            <q-item-label caption>12321 Members</q-item-label>
          </q-item-section>
          <q-item-section></q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar>
            <q-avatar size="60px" color="cyan" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-subtitle2">Filasd Society</q-item-label>
            <q-item-label caption>12321 Members</q-item-label>
          </q-item-section>
          <q-item-section></q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar>
            <q-avatar size="60px" color="purple" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-subtitle2">Kachinas Society</q-item-label>
            <q-item-label caption>12321 Members</q-item-label>
          </q-item-section>
          <q-item-section></q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      user: {
        name: "Johnny Deep",
        email: "johnny@gmail.com",
        address: "Beach St, South California",
        mobile: "+6399693437",
      },
    };
  },
};
</script>
