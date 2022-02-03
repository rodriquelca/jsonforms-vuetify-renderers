<template>
  <v-container fill-height fluid>
    <v-row>
      <v-col cols="3">
        <PalletePanel :schema="editorSchema" />
      </v-col>
      <v-col cols="6">
        <EditorPanel
          :editorTabs="editorTabs"
          :editorRenderers="editorRenderers "
          :schema="useExportSchema() || false"
          :uischema="useExportUiSchema() || false"
        />
      </v-col>
      <v-col cols="3">
        <PropertiesPanel :propertyRenderers="propertyRenderers" />
      </v-col>
    </v-row>
  </v-container>
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
} from './properties-panel';
import {
  PropertiesService,
  PropertiesServiceImpl,
  PropertySchemasDecorator,
  PropertySchemasProvider,
} from './properties-panel/propertiesService';

import { sync } from 'vuex-pathify';
import {useExportSchema, useExportUiSchema} from '../../util'
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
    };
  },
  watch: {
    // whenever question changes, this function will run

    selection: {
      handler: (newValue, oldValue) => {
      },
      deep: true,
    },
  },

  mounted() {
    this.schemaService
      .getSchema()
      .then((schema) => this.$store.dispatch('app/setSchema', schema));
  },

  computed: {
    editorSchema: sync('app/editor@schema'),
    useUiSchema: sync('app/editor@uiSchema'),

  },
  methods: {
   useExportSchema(){
      return useExportSchema(this.$store.get('app/editor@schema'));
    },
    useExportUiSchema(){
      return this.$store.get('app/editor@uiSchema');
    }
  }
};
</script>
