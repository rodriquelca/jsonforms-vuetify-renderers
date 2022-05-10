<template>
  <div>
    <v-container>
      <monaco-editor
        :key="key"
        :theme="$vuetify.theme.dark ? 'vs-dark' : 'vs'"
        height="500"
        :options="{ minimap: { enabled: false }, fontSize: 11 }"
        :language="`json`"
        v-model="schema"
      ></monaco-editor>
    </v-container>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" text @click="saveContent" small outlined>
        Save</v-btn
      >
    </v-card-actions>
  </div>
</template>

<script lang="ts">
import { sync } from 'vuex-pathify';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import MonacoEditor from '@/components/MonacoEditor.vue';
export default {
  name: 'MainPanelI18n',
  components: { MonacoEditor },
  computed: {
    itemsMainPanel: sync('viewManager/mainPanel.items'),
    activeMainPanel: sync('viewManager/mainPanel.active'),
    locales: sync('locales'),
  },
  data: function () {
    return {
      key: 1,
      locale: 'en',
      schema: null,
    };
  },
  mounted() {
    this.schema = monaco.editor.createModel(
      JSON.stringify(this.locales[this.locale]['content'], null, '\t'),
      'json'
    );
    this.$store.watch((_state: any, getters: any) => {
      return getters['viewManager/getDataMainPanel']('main-panel-i18n');
    }, this.watchLocale);
  },
  methods: {
    saveContent() {
      this.$store.dispatch('locales/updateLanguage', {
        key: this.locales[this.locale].key,
        description: this.locales[this.locale].description,
        content: JSON.parse(this.schema.getValue()),
      });
    },
    watchLocale(n: any, o: any) {
      if (n.locale) {
        this.locale = n.locale;
        this.schema = monaco.editor.createModel(
          JSON.stringify(this.locales[this.locale]['content'], null, '\t'),
          'json'
        );
      }
    },
  },
};
</script>
