<template>
  <div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          large
          icon
          dark
          @click.stop="dialog = !dialog"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon size="30" color="primary">mdi-download-box</v-icon>
        </v-btn>
      </template>
      Download Json
    </v-tooltip>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <template>
            <v-tabs v-model="tab" align-with-title>
              <v-tabs-slider color="yellow"></v-tabs-slider>
              <v-tab :key="0"> Schema </v-tab>
              <v-tab :key="1"> UI Schema </v-tab>
            </v-tabs>
          </template>
          <v-toolbar-items>
            <v-btn dark text @click="dialog = false"> Save </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-tabs-items v-model="tab">
          <v-tab-item :key="0">
            <v-card>
              <v-card-title>
                <v-toolbar flat>
                  <v-toolbar-title>Schema</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on: onTooltip }">
                      <v-btn icon @click="dialog = false" v-on="onTooltip">
                        <v-icon>mdi-reload</v-icon>
                      </v-btn>
                    </template>
                    {{ `Reload Example Schema` }}
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on: onTooltip }">
                      <v-btn icon @click="dialog = false" v-on="onTooltip">
                        <v-icon>mdi-content-save</v-icon>
                      </v-btn>
                    </template>
                    {{ `Apply Change To Example Schema` }}
                  </v-tooltip>
                </v-toolbar>
              </v-card-title>
              <v-divider class="mx-4"></v-divider>
              <monaco-editor
                :theme="$vuetify.theme.dark ? 'vs-dark' : 'vs'"
                height="500"
                :language="`json`"
                v-model="schemaDesigner.schemaEditor"
              ></monaco-editor>
            </v-card>
          </v-tab-item>
          <v-tab-item :key="1">
            <v-card>
              <v-card-title>
                <v-toolbar flat>
                  <v-toolbar-title>UI Schema</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on: onTooltip }">
                      <v-btn icon @click="dialog = false" v-on="onTooltip">
                        <v-icon>mdi-reload</v-icon>
                      </v-btn>
                    </template>
                    {{ `Reload Example UI Schema` }}
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on: onTooltip }">
                      <v-btn icon @click="dialog = false" v-on="onTooltip">
                        <v-icon>mdi-content-save</v-icon>
                      </v-btn>
                    </template>
                    {{ `Apply Change To Example UI Schema` }}
                  </v-tooltip>
                </v-toolbar>
              </v-card-title>
              <v-divider class="mx-4"></v-divider>
              <monaco-editor
                :theme="$vuetify.theme.dark ? 'vs-dark' : 'vs'"
                height="500"
                language="json"
                v-model="schemaDesigner.uiSchemaEditor"
              ></monaco-editor>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { sync } from 'vuex-pathify';

import MonacoEditor from '@/components/MonacoEditor.vue';
import { Uri, monaco } from 'monaco-editor/esm/vs/editor/editor.api';
import { getMonacoModelForUri } from '@/core/jsonSchemaValidation';
import { useExportSchema, useExportUiSchema } from '../util';

export default {
  name: 'DownloadJson',
  components: {
    MonacoEditor,
  },
  data: function () {
    return {
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      tab: null,
      schemaDesigner: {
        schemaEditor: undefined as monaco.editor.ITextModel,
        uiSchemaEditor: undefined as monaco.editor.ITextModel,
      },
    };
  },
  computed: {
    renderers: sync('app/jsonforms@renderers'),
    cells: sync('app/jsonforms@cells'),
    config: sync('app/jsonforms@config'),
    validationMode: sync('app/jsonforms@validationMode'),
    ajv: sync('app/jsonforms@ajv'),
    readonly: sync('app/jsonforms@readonly'),
    monacoSchemaModel: sync('app/editor@schema'),
    monacoUiSchemaModel: sync('app/editor@uiSchema'),
    monacoDataModel: sync('app/monaco@dataModel'),
    locale: sync('app/jsonforms@locale'),
  },
  mounted(): void {
    this.setMonacoUiSchema(this.monacoUiSchemaModel);
    this.setMonacoSchema(this.monacoSchemaModel);
  },
  watch: {
    monacoUiSchemaModel(): void {
      this.setMonacoUiSchema(this.monacoUiSchemaModel);
    },
    monacoSchemaModel(): void {
      console.log('schema change');
    },
  },
  methods: {
    setMonacoUiSchema(schemaModel): void {
      debugger;
      const modelUri = Uri.parse('json://core/specification/uischema.json');
      this.schemaDesigner.uiSchemaEditor = getMonacoModelForUri(
        modelUri,
        JSON.stringify(useExportUiSchema(schemaModel))
      );
    },
    setMonacoSchema(schemaModel): void {
      debugger;
      const modelUri = Uri.parse('json://core/specification/schema.json');
      this.schemaDesigner.schemaEditor = getMonacoModelForUri(
        modelUri,
        JSON.stringify(useExportSchema(schemaModel))
      );
    },
  },
};
</script>
