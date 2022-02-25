<template>
  <v-app-bar app>
    <v-toolbar-title>
      <v-container fill-height fluid
        ><v-row align="center" justify="center">
          <v-col>
            <v-icon size="64" color="blue darken-2">mdi-code-json</v-icon>
          </v-col>
          <v-col>JSON Dynaform Editor</v-col>
        </v-row></v-container
      ></v-toolbar-title
    >
    <v-spacer expand></v-spacer>
    <v-toolbar-items>
      <v-container fill-height fluid justify-end
        ><v-row dense>
          <v-col><download-json /></v-col>
          <v-col><settings /> </v-col>
          <v-col><theme-changer /> </v-col>
        </v-row>
      </v-container>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script lang="ts">
import { sync } from 'vuex-pathify';
import DownloadJson from '@/components/DownloadJson.vue';
import Settings from '@/components/Settings.vue';
import ThemeChanger from '@/components/ThemeChanger.vue';
import { AppStore } from '../store/modules/types';

export default {
  name: 'DefaultAppBar',
  components: {
    ThemeChanger,
    Settings,
    DownloadJson,
  },
  computed: {
    app: sync<AppStore>('app/'),
  },
  data() {
    return {
      activeTab: 0,
    };
  },
};
</script>
