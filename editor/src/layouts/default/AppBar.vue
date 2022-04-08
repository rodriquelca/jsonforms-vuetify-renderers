<template>
  <v-app-bar app elevation="0">
    <v-toolbar-title>
      <v-container fill-height fluid
        ><v-row align="center" justify="center">
          <v-col>
            <v-icon size="40" color="blue darken-2">mdi-code-json</v-icon>
          </v-col>
          <v-col>
            <v-list-item-title class="text-h6"> Dynaform </v-list-item-title>
            <v-list-item-subtitle class="text-caption">
              Editor
            </v-list-item-subtitle>
          </v-col>
        </v-row></v-container
      ></v-toolbar-title
    >
    <v-spacer expand></v-spacer>
    <v-toolbar-items>
      <v-container fill-height fluid justify-end
        ><v-row dense>
          <v-col><dynaform-preview /></v-col>
          <v-col><download-json /></v-col>
          <v-col><form-rules /></v-col>
          <v-col><Templates /></v-col>
          <v-col><Settingsi18n /></v-col>
          <v-col><settings /> </v-col>
          <v-col><theme-changer /> </v-col>
        </v-row>
      </v-container>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script lang="ts">
import { sync } from 'vuex-pathify';
import DynaformPreview from '@/components/DynaformPreview.vue';
import DownloadJson from '@/components/DownloadJson.vue';
import Settings from '@/components/Settings.vue';
import ThemeChanger from '@/components/ThemeChanger.vue';
import { AppStore } from '../store/modules/types';
import Templates from '@/components/Templates.vue';
import Settingsi18n from '@/components/Settingsi18n.vue';
import FormRules from '@/components/FormRules.vue';

export default {
  name: 'DefaultAppBar',
  components: {
    ThemeChanger,
    Settings,
    DownloadJson,
    DynaformPreview,
    Templates,
    Settingsi18n,
    FormRules,
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
