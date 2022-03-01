<template>
  <q-page>
    <q-tabs v-model="tab" indicator-color="primary" active-color="primary">
      <q-tab name="shared" label="Shared" />
      <q-tab name="personal" label="Personal" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="shared">
        <q-list>
          <div v-for="(file, i) in shared_files" :key="i">
            <q-item>
              <q-item-section avatar>
                <q-avatar :color="file.group.avatar" />
              </q-item-section>
              <q-item-section avatar style="margin-left: -35px" class="q-mt-md">
                <q-avatar size="25px" color="grey-4" :icon="file.file_type" />
              </q-item-section>
              <q-item-section>
                <q-item-label lines="1" class="text-subtitle2">{{
                  file.file_name
                }}</q-item-label>
                <q-item-label caption
                  >{{ file.group.name }} &bull; Feb 6</q-item-label
                >
              </q-item-section>

              <q-item-section side>
                <q-icon name="more_vert" />
              </q-item-section>
            </q-item>
          </div>
        </q-list>
      </q-tab-panel>

      <q-tab-panel name="personal">
        <q-list>
          <div v-for="(file, i) in personal_files" :key="i">
            <q-item>
              <q-item-section avatar>
                <q-avatar color="grey-3" :icon="file.file_type" />
              </q-item-section>
              <q-item-section>
                <q-item-label lines="1" class="text-subtitle2">{{
                  file.file_name
                }}</q-item-label>
                <q-item-label caption
                  >{{
                    file.file_type == "folder" ? "Created" : "Uploaded"
                  }}
                  &bull; Feb 6</q-item-label
                >
              </q-item-section>

              <q-item-section side>
                <q-icon name="more_vert" />
              </q-item-section>
            </q-item>
          </div>
        </q-list>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      tab: "shared",
      shared_files: [
        {
          upload_date: "",
          file_type: "folder",
          file_name: "Project Letters",
          group: { name: "Alpha Muks", avatar: "pink" },
          uploader: "",
        },
        {
          upload_date: "",
          file_type: "article",
          file_name: "Project Letters",
          group: { name: "Alpha Muks", avatar: "blue" },
          uploader: "",
        },
        {
          upload_date: "",
          file_type: "folder",
          file_name: "Note Letters",
          group: { name: "Alpha Muks", avatar: "green" },
          uploader: "",
        },
        {
          upload_date: "",
          file_type: "audio_file",
          file_name: "Sing A SOng",
          group: { name: "Alpha Muks", avatar: "cyan" },
          uploader: "",
        },
      ],

      personal_files: [
        {
          upload_date: "",
          file_type: "folder",
          file_name: "Project Letters",
        },
        {
          upload_date: "",
          file_type: "picture_as_pdf",
          file_name: "Project Letters",
        },
        {
          upload_date: "",
          file_type: "folder",
          file_name: "Project Letters",
        },
        {
          upload_date: "",
          file_type: "article",
          file_name: "Project Letters",
        },
      ],
    };
  },
};
</script>
