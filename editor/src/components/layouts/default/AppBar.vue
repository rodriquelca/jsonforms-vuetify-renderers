<template>
  <v-app-bar dark app color="primary" elevation="0">
    <v-toolbar-title>
      <v-container fill-height fluid
        ><v-row align="center" justify="center">
          <v-col>
            <v-toolbar-title>JSON Forms 2.0</v-toolbar-title>
          </v-col>
        </v-row></v-container
      ></v-toolbar-title
    >
    <v-spacer expand></v-spacer>
    <v-toolbar-items>
      <v-container fill-height fluid justify-end
        ><v-row dense>
          <v-col><custom-theme /></v-col>
          <v-col><dynaform-preview /></v-col>
          <v-col><Templates /></v-col>
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
import Settings from '@/components/Settings.vue';
import ThemeChanger from '@/components/ThemeChanger.vue';
import { AppStore } from '../store/modules/types';
import Templates from '@/components/Templates.vue';
import CustomTheme from '../../CustomTheme.vue';

export default {
  name: 'DefaultAppBar',
  components: {
    ThemeChanger,
    Settings,
    DynaformPreview,
    Templates,
    CustomTheme,
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
