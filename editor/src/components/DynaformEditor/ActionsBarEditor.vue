<template>
  <v-app-bar dense elevation="0">
    <template v-for="(action, index) in actions">
      <v-toolbar-title :key="index" v-if="action.type === 'title'">{{
        action.title
      }}</v-toolbar-title>
      <v-spacer :key="index" v-else-if="action.type === 'spacer'"></v-spacer>
      <v-btn
        :key="index"
        v-else-if="action.type === 'button-flat'"
        :class="action.class"
        :color="action.color"
        plain
        small
        @click="action.handler"
      >
        <v-icon class="me-1" small>{{ action.icon }}</v-icon>
        {{ action.title }}
      </v-btn>

      <v-btn
        :key="index"
        v-else-if="action.type == 'button-icon'"
        icon
        x-small
        class="pa-5"
        @click="action.handler"
      >
        <v-icon>{{ action.icon }}</v-icon>
      </v-btn>
      <v-divider
        :key="index"
        v-else-if="action.type == 'divider'"
        class="mx-1"
        vertical
      ></v-divider>
    </template>
    <v-menu left bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on" x-small class="pa-5">
          <v-icon>mdi-dots-vertical</v-icon>
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
  inject: ['bus'],
  data() {
    return {
      actions: [
        {
          title: 'Form Title',
          type: 'title',
        },
        {
          type: 'spacer',
        },
        {
          type: 'button-flat',
          color: 'secondary',
          class: 'vpm-action-editor-btn',
          icon: 'mdi-pencil-ruler',
          handler: this.onClickEditor,
          title: 'Editor',
        },
        {
          type: 'button-flat',
          color: 'primary',
          class: 'vpm-action-editor-btn',
          icon: 'mdi-application-outline',
          handler: this.onClickPreviewBrowser,
          title: 'Browser',
        },
        {
          type: 'button-flat',
          color: 'warning',
          class: 'vpm-action-editor-btn',
          icon: 'mdi-cellphone',
          handler: this.onClickTranslations,
          title: 'Device',
        },
        {
          type: 'spacer',
        },
        {
          type: 'button-icon',
          color: 'secondary',
          class: '',
          icon: 'mdi-translate',
          handler: this.onClickTranslations,
          title: 'Translate',
        },
        {
          type: 'button-icon',
          color: 'secondary',
          class: '',
          icon: 'mdi-download-box',
          handler: () => {
            return;
          },
          title: '',
        },
        {
          type: 'divider',
        },
        {
          type: 'button-icon',
          color: 'warning',
          class: '',
          icon: 'mdi-content-save',
          handler: this.contentSave,
          title: '',
        },
      ],
    };
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
    onClickTranslations() {
      let mainPanel = { id: 'main-translations' },
        sideBar = { id: 'side-bar-translations' };
      this.$store.dispatch('viewManager/setAllViews', {
        mainPanel,
        sideBar,
      });
    },
    contentSave() {
      this.bus.$emit('translations::main-panel::save', {});
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
