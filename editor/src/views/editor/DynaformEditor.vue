<template>
  <!-- <v-container fill-height fluid>
    TODOO -->
  <div class="px-2 my-8" height="100%">
    <v-row>
      <v-col cols="3">
        <PalletePanel :schema="editorSchema" />
      </v-col>
      <v-divider vertical></v-divider>
      <v-col cols="6">
        <EditorPanel
          :editorTabs="editorTabs"
          :renderers="editorRenderers"
          :schema="useExportSchema() || false"
          :uischema="useExportUiSchema() || false"
          :selection="selection"
        />
      </v-col>
      <v-divider vertical></v-divider>
      <v-col cols="3">
        <PropertiesPanel
          :renderers="propertyRenderers"
          :selection="selection"
          :schema="editorSchema || false"
          :uischema="editorUischema || false"
          :propertiesService="propertiesService"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import PalletePanel from './pallete-panel';
import EditorPanel from './editor-panel';
import PropertiesPanel from './properties-panel';
import DynaformPreview from '../../components/DynaformPreview.vue';
import { defaultEditorRenderers } from '../../renderers';
import { ExampleSchemaService } from '../../api/exampleSchemaService';
import { SelectedElement } from './../../selection';
import {
  defaultSchemaDecorators,
  defaultSchemaProviders,
  defaultPropertyRenderers,
  schemaVariableDecorators,
} from './properties-panel';
import {
  PropertiesService,
  PropertiesServiceImpl,
  PropertySchemasDecorator,
  PropertySchemasProvider,
} from './properties-panel/propertiesService';

import { sync } from 'vuex-pathify';
import { useExportSchema, useExportUiSchema } from '../../util';
import store from './../../store';
import pmreactivex from './../../util/pmreactivex';

export default {
  name: 'EditorView',
  props: {},
  components: {
    PalletePanel,
    EditorPanel,
    PropertiesPanel,
  },
  data() {
    return {
      selection: '' as string,
      editorTabs: [
        {
          name: 'Preview',
          component: DynaformPreview,
        },
      ],
      editorRenderers: defaultEditorRenderers,
      propertyRenderers: defaultPropertyRenderers,

      schemaService: new ExampleSchemaService(),
      schemaDecorators: defaultSchemaDecorators,
      propertiesService: {},
    };
  },
  watch: {
    // whenever question changes, this function will run
  },

  mounted() {
    this.schemaService
      .getSchema()
      .then((schema) => this.$store.dispatch('app/setSchema', { schema }));
    const propertiesServiceProvider = (
      schemaProviders: PropertySchemasProvider[],
      schemaDecorators: PropertySchemasDecorator[],
      schemaVariableDecorators: PropertySchemasDecorator[]
    ) =>
      new PropertiesServiceImpl(
        schemaProviders,
        schemaDecorators,
        schemaVariableDecorators
      );

    this.propertiesService = propertiesServiceProvider(
      defaultSchemaProviders,
      defaultSchemaDecorators,
      schemaVariableDecorators
    );
  },

  computed: {
    editorSchema: sync('app/editor@schema'),
    editorUischema: sync('app/editor@uiSchema'),
  },
  methods: {
    useExportSchema() {
      return useExportSchema(this.$store.get('app/editor@schema'));
    },
    useExportUiSchema() {
      return this.$store.get('app/editor@uiSchema');
    },
    setSelection(data) {
      this.selection = data;
    },
  },
  provide: function () {
    return {
      setSelection: this.setSelection,
      selection: this.selection,
      store: store,
      pmreactivex: pmreactivex,
    };
  },
};
</script>
