<template>
  <v-container class="px-0 my-1" :fluid="true">
    <v-row no-gutters height="100%">
      <!-- <v-col cols="2">
        <PalletePanel :schema="editorSchema" />
      </v-col> -->
      <v-col>
        <EditorPanel
          :editorTabs="editorTabs"
          :renderers="editorRenderers"
          :schema="useExportSchema() || false"
          :uischema="useExportUiSchema() || false"
          :selection="selection"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import PalletePanel from './pallete-panel';
import EditorPanel from './editor-panel';
import DynaformPreview from '../../components/DynaformPreview.vue';
import { defaultEditorRenderers } from '../../renderers';
import { ExampleSchemaService } from '../../api/exampleSchemaService';

import { sync } from 'vuex-pathify';
import { useExportSchema, useExportUiSchema } from '../../util';
import { createLayout } from '../../util/generators/uiSchema';
export default {
  name: 'EditorView',
  props: {},
  components: {
    // PalletePanel,
    EditorPanel,
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
      schemaService: new ExampleSchemaService(),
      propertiesService: {},
    };
  },

  mounted() {
    this.$store.dispatch('app/setSchema', {
      schema: {
        type: 'object',
        title: 'Dynaform',
        properties: {},
      },
    });
    this.$store.dispatch('app/setUiSchema', {
      uiSchema: createLayout('VerticalLayout'),
    });
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
    };
  },
};
</script>
