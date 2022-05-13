<template>
  <v-app-bar dense elevation="0">
    <v-toolbar-title>Form title</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn
      class="vpm-action-editor-btn"
      color="secondary"
      plain
      small
      @click="onClickEditor"
    >
      <v-icon class="me-1" small>mdi-pencil-ruler</v-icon>
      Editor
    </v-btn>

    <v-btn
      color="primary"
      class="vpm-action-editor-btn"
      plain
      small
      @click="onClickPreviewBrowser"
    >
      <v-icon class="me-1" small>mdi-application-outline</v-icon>
      Web-app
    </v-btn>
    <v-btn color="warning" class="vpm-action-editor-btn" plain small>
      <v-icon class="me-1" small>mdi-cellphone</v-icon>
      Device
    </v-btn>
    <v-spacer></v-spacer>

    <v-btn icon x-small class="pa-5">
      <v-icon>mdi-download-box</v-icon>
    </v-btn>
    <v-divider class="mx-1" vertical></v-divider>
    <v-btn icon x-small class="pa-5">
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

    <v-menu left bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on" x-small class="pa-5">
          <v-icon>mdi-content-save</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item v-for="n in 5" :key="n" @click="() => {}">
          <v-list-item-title>Option {{ n }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script lang="ts">
//import { sync } from 'vuex-pathify';
import _ from 'lodash';
export default {
  name: 'ActionsBar',
  components: {},
  data() {
    return {};
  },
  computed: {},
  methods: {
    onClickEditor() {
      let mainPanel = { id: 'main-editor' },
        sideBar = { id: 'side-bar-pallete' };
      this.$store.dispatch('viewManager/setAllViews', {
        mainPanel,
        sideBar,
      });
    },
    onClickPreviewBrowser() {
      let mainPanel = { id: 'main-preview' },
        sideBar = { id: 'side-bar-preview' };
      this.$store.dispatch('viewManager/setAllViews', {
        mainPanel,
        sideBar,
      });
    },
  },
};
</script>
<style>
.vpm-action-editor-btn {
  text-transform: initial;
  letter-spacing: normal;
}
</style>
