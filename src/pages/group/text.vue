 <q-item>
      <q-item-section>
        <q-avatar size="100px" v-if="groupDetails.photoURL">
          <img :src="groupDetails.photoURL"
        /></q-avatar>
        <div v-else>
          <q-avatar
            v-if="groupDetails.name"
            size="100px"
            color="teal"
            text-color="white"
            class="text-bold"
            >{{ groupDetails.name.charAt(0).toUpperCase() }}</q-avatar
          >
        </div>
      </q-item-section>
      <q-item-section side top>
        <!-- Group Buttons -->
        <q-item class="q-gutter-x-sm">
          <div v-if="groupDetails.myRole.functions.all">
            <q-btn
              dense
              outline
              round
              color="grey"
              icon="admin_panel_settings"
            />
          </div>
          <div
            v-if="
              groupDetails.myRole.functions.all ||
              groupDetails.myRole.functions.canAdd
            "
          >
            <q-btn dense outline round color="grey" icon="person_add" />
          </div>
          <q-btn dense outline round color="grey" icon="notifications_none" />
        </q-item>
      </q-item-section>

      <!-- Dialogs -->
      <q-dialog
        v-model="adminDialog"
        maximized
        transition-show="slide-right"
        transition-hide="slide-left"
      >
        <q-card>
          <q-card-section>
            <div class="text-subtitle2">Settings</div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-item>
    <div class="text-subtitle2 text-bold q-px-md q-mb-sm">
      {{ groupDetails.name }}
    </div>

    <div class="text-body2 q-px-md">
      {{ groupDetails.description }}

      <div v-if="groupDetails.members" class="text-bold q-mt-md">
        {{ groupDetails.members.length == 0 ? 0 : groupDetails.members.length }}
        Members
      </div>
    </div>

    <q-tabs
      v-model="tab"
      dense
      no-caps
      class="q-mt-md q-mx-sm"
      indicator-color="primary"
    >
      <q-tab name="updates" label="Updates" />
      <q-tab name="people" label="People" />
      <q-tab name="files" label="Files" />
    </q-tabs>
