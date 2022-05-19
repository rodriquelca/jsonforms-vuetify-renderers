<template>
  <div>
    <v-container v-if="view == 'editor'">
      <v-data-table :headers="headers" :items="dataTranslations">
        <template
          v-for="(slot, i) in headers"
          v-slot:[`item.${slot.value}`]="{ item }"
        >
          <v-text-field
            v-if="slot.value != 'name'"
            :key="i"
            dense
            single-line
            class="vpm-item-list caption"
            :label="slot.value"
            v-model="item[slot.value]"
          >
            {{ item[slot.value] }}</v-text-field
          >
          <v-btn
            v-else
            :key="i"
            color="gray"
            plain
            small
            class="vpm-action-editor-btn"
          >
            <v-icon color="warning" class="me-1" small
              >mdi-alphabetical-variant</v-icon
            >
            {{ item[slot.value] }}
          </v-btn>
        </template>
      </v-data-table>
    </v-container>
    <v-container v-else>
      <monaco-editor
        :theme="$vuetify.theme.dark ? 'vs-dark' : 'vs'"
        height="500"
        :options="{ minimap: { enabled: false }, fontSize: 11 }"
        :language="`json`"
        v-model="schema"
      ></monaco-editor>
    </v-container>
  </div>
</template>

<script lang="ts">
import { sync } from 'vuex-pathify';
import _ from 'lodash';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { defineComponent } from '@vue/composition-api';
import MonacoEditor from '@/components/MonacoEditor.vue';
const MainPanelI18n = defineComponent({
  name: 'MainPanelI18n',
  inject: ['bus'],
  components: { MonacoEditor },
  computed: {
    itemsMainPanel: sync('viewManager/mainPanel.items'),
    activeMainPanel: sync('viewManager/mainPanel.active'),
    view() {
      let res = 'editor';
      if (this.itemsMainPanel[this.activeMainPanel]['data']['view']) {
        res = this.itemsMainPanel[this.activeMainPanel]['data']['view'];
      }
      return res;
    },
    locales: sync('locales'),
    headers() {
      let name = [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'name',
        },
      ];

      let headers = _.map(this.locales, (v, k) => ({
        text: v.description,
        align: 'start',
        sortable: false,
        value: v.key,
      }));

      return name.concat(headers);
    },
    dataTranslations() {
      let result = [],
        keys = Object.keys(this.locales);
      //Create the initial values
      _.map(this.locales.en.content, (v, k) => {
        result.push({
          name: k,
          ['en']: v.label,
        });
      });
      //Create the others languages
      for (let e of result) {
        for (let k of keys) {
          if (k != 'en') {
            e[k] = this.locales[k].content[e.name].label;
          }
        }
      }
      return result;
    },
    locale() {
      let locale = 'en';
      if (this.itemsMainPanel[this.activeMainPanel]['data']['locale']) {
        locale = this.itemsMainPanel[this.activeMainPanel]['data']['locale'];
      }
      return locale;
    },
  },
  data: function () {
    return {
      schema: null,
    };
  },
  mounted() {
    this.bus.$on('translations::main-panel::save', this.saveContent);
    this.schema = monaco.editor.createModel(
      JSON.stringify(this.locales[this.locale]['content'], null, '\t'),
      'json'
    );
  },
  destroyed() {
    this.bus.$off('translations::main-panel::save');
  },
  methods: {
    saveContent() {
      if (this.view == 'json') {
        this.$store.dispatch('locales/updateLanguage', {
          key: this.locales[this.locale].key,
          description: this.locales[this.locale].description,
          content: JSON.parse(this.schema.getValue()),
        });
      } else {
        for (const [index, value] of this.dataTranslations.entries()) {
          for (let key in value) {
            if (key != 'name') {
              this.locales[key].content[value.name]['label'] = value[key];
            }
          }
        }
        this.$store.dispatch('locales/setAll', _.cloneDeep(this.locales));
      }
    },
  },
});
export default MainPanelI18n;
</script>
<style scoped>
.vpm-action-editor-btn {
  text-transform: initial;
  letter-spacing: normal;
}
</style>
