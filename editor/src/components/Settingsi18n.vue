<template>
  <div class="vpm-settingsi18n">
    <v-tooltip bottom>
      <template v-slot:activator="{ on: onTooltip }">
        <v-btn large icon dark v-on="onTooltip">
          <v-icon size="30" @click="openDialog" color="primary"
            >mdi-translate</v-icon
          >
        </v-btn>
      </template>
      Translation
    </v-tooltip>

    <v-dialog v-model="dialog" width="900" height="500">
      <v-card dense>
        <v-card-title class="text-h5 primary lighten-1">
          Translation
        </v-card-title>

        <v-row no-gutters class="pt-4">
          <v-col cols="3">
            <v-list class="vpm-settingsi18n-list" dense>
              <v-list-item-group v-model="selectedItem" color="primary">
                <v-list-item
                  v-for="(item, i) in locales"
                  :key="i"
                  @click="selectLanguage(item)"
                >
                  <v-list-item-icon>
                    <v-icon class="" v-text="'mdi-translate'"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="item.description + ' - ' + item.key"
                    ></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <v-list dense>
              <v-list-item class="caption" dense
                >Add language <v-spacer></v-spacer>

                <v-btn icon>
                  <v-icon @click="toogleNewLangDialog">mdi-plus</v-icon>
                </v-btn></v-list-item
              >
              <div v-if="newLanguageDialog">
                <v-list-item class="caption" dense>
                  <v-text-field
                    v-model="newLang"
                    class="vpm-settingsi18n-text caption"
                    dense
                    label="Language"
                  ></v-text-field>
                </v-list-item>
                <v-list-item class="caption" dense>
                  <v-text-field
                    v-model="newKeyLang"
                    class="vpm-settingsi18n-text caption"
                    dense
                    label="Key"
                  ></v-text-field>
                </v-list-item>
                <v-list-item class="caption float-end" dense>
                  <v-btn outlined x-small color="primary" @click="newLanguage">
                    Add
                  </v-btn>
                </v-list-item>
              </div>
            </v-list>
          </v-col>
          <v-col cols="9">
            <monaco-editor
              :key="key"
              :theme="$vuetify.theme.dark ? 'vs-dark' : 'vs'"
              height="400"
              :options="{ minimap: { enabled: false }, fontSize: 11 }"
              :language="`json`"
              v-model="localeSchema"
            ></monaco-editor>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="saveContent" small outlined>
            Save</v-btn
          >
          <v-btn color="primary" text @click="dialog = !dialog" small outlined>
            close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import MonacoEditor from '@/components/MonacoEditor.vue';
import _ from 'lodash';
export default {
  name: 'Settingsi18n',
  components: { MonacoEditor },
  props: {
    schema: {
      type: [Object, Boolean],
    },
  },
  data() {
    return {
      key: 1,
      dialog: false,
      localeSchema: null,
      selectedItem: 0,
      locales: {},
      locale: 'en',
      newLang: null,
      newKeyLang: null,
      newLanguageDialog: false,
    };
  },
  methods: {
    openDialog() {
      this.dialog = !this.dialog;
      setTimeout(() => {
        this.key++;
        this.locales = this.$store.get('locales');
        this.localeSchema = monaco.editor.createModel(
          JSON.stringify(this.locales[this.locale]['content'], null, '\t'),
          'json'
        );
      }, 100);
    },
    toogleNewLangDialog() {
      this.newLanguageDialog = !this.newLanguageDialog;
    },
    newLanguage() {
      this.locales[this.newKeyLang] = {
        key: this.newKeyLang,
        description: this.newLang,
        content: this.locales['en'].content,
      };
      this.$store.dispatch('locales/addLanguage', {
        key: this.newKeyLang,
        description: this.newLang,
        content: this.locales['en'].content,
      });
      this.toogleNewLangDialog();
    },
    saveContent() {
      this.$store.dispatch('locales/updateLanguage', {
        key: this.locales[this.locale].key,
        description: this.locales[this.locale].description,
        content: JSON.parse(this.localeSchema.getValue()),
      });
    },
    selectLanguage(item) {
      this.locale = item.key;
      this.localeSchema = monaco.editor.createModel(
        JSON.stringify(this.locales[this.locale]['content'], null, '\t'),
        'json'
      );
    },
  },
};
</script>

<style>
.vpm-settingsi18n-text > div > div > div > .v-label {
  font-size: 12px !important;
}

.vpm-settingsi18n-list {
  height: auto !important;
}
.text-h5 {
  color: white;
}
</style>
