<template>
  <v-container>
    <h4>Properties</h4>
    <json-forms
      v-if="properties"
      :renderers="renderers"
      :data="data"
      :uischema="properties.uiSchema"
      :schema="properties.schema"
      @change="updateProperties"
    />
  </v-container>
</template>

<script lang="ts">
import { isEqual, omit } from 'lodash';
import { JsonForms, JsonFormsChangeEvent } from '@jsonforms/vue2';
import { defineComponent, inject, ref } from '../../../util/vue';
import { editorRendererProps, useJsonTest } from '../../../util/composition';
import { EditorUISchemaElement } from '../../../model/uischema';
import { tryFindByUUID } from '../../../util/schemasUtil';
import { generateDefaultUISchema } from '@jsonforms/core';
const PropertiesPanel = defineComponent({
  name: 'PropertiesPanel',
  props: {
    ...editorRendererProps(),
    propertiesService: {
      type: Object,
      required: false,
    },
  },
  components: {
    JsonForms,
  },
  data() {
    return {
      data: undefined,
      properties: undefined,
      uiElement: undefined,
    };
  },
  watch: {
    selection(newSelection) {
      this.uiElement = tryFindByUUID(this.uischema, this.selection);
      this.data = omit(this.uiElement, [
        'uuid',
        'parent',
        'elements',
        'linkedSchemaElement',
        'options.detail',
      ]);
      if (this.uiElement) {
        const linkedSchemaUUID = this.uiElement.linkedSchemaElement;
        const elementSchema =
          linkedSchemaUUID && this.schema
            ? tryFindByUUID(this.schema, linkedSchemaUUID)
            : undefined;
        this.properties = this.propertiesService.getProperties(
          this.uiElement,
          elementSchema
        );
      }
    },
  },
  methods: {
    updateProperties: function (event: JsonFormsChangeEvent) {
      if (this.uiElement && event.errors.length === 0) {
        this.$store.dispatch('app/updateUISchemaElement', {
          elementUUID: this.uiElement.uuid,
          changedProperties: event.data,
        });
      }
    },
  },
});
export default PropertiesPanel;
</script>
