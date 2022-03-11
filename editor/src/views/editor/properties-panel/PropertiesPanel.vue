<template>
  <!-- <v-container>
    <h4>Properties</h4>
    
  </v-container> -->
  <v-expansion-panels accordion>
    <v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <div>
            <v-icon>mdi-application-variable</v-icon>
            <span> Variable </span>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <json-forms
            v-if="variableSettings"
            :renderers="renderers"
            :data="variableData"
            :uischema="variableSettings.uiSchema"
            :schema="variableSettings.schema"
            @change="updateVariableSettings"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel-header>
        <div>
          <v-icon> mdi-tune-vertical</v-icon>
          <span> Design </span>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <json-forms
          v-if="designProperties"
          :renderers="renderers"
          :data="data"
          :uischema="designProperties.uiSchema"
          :schema="designProperties.schema"
          @change="updateDesignProperties"
        />
        <!-- </v-card> -->
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-header>
        <div>
          <v-icon> mdi-cog</v-icon>
          <span> Settings </span>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content> Schema Settings </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import { isEqual, omit } from 'lodash';
import { JsonForms, JsonFormsChangeEvent } from '@jsonforms/vue2';
import { defineComponent, inject, ref } from '../../../util/vue';
import { editorRendererProps, useJsonTest } from '../../../util/composition';
import {
  EditorUISchemaElement,
  getVariableName,
} from '../../../model/uischema';
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
      designProperties: undefined,
      uiElement: undefined,
      variableSettings: undefined,
      variableData: undefined,
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
        'scope',
      ]);

      if (this.uiElement) {
        // design properties
        const linkedSchemaUUID = this.uiElement.linkedSchemaElement;
        const elementSchema =
          linkedSchemaUUID && this.schema
            ? tryFindByUUID(this.schema, linkedSchemaUUID)
            : undefined;
        this.designProperties = this.propertiesService.getDesignProperties(
          this.uiElement,
          elementSchema
        );
        // variable data
        if (this.uiElement.scope) {
          this.variableData = {
            variable: getVariableName(this.uiElement),
          };
          this.variableSettings = this.propertiesService.getVariableSettings(
            this.uiElement,
            elementSchema
          );
        }
      }
    },
  },
  methods: {
    updateDesignProperties: function (event: JsonFormsChangeEvent) {
      console.log('UPDATE DESIGN');
      if (this.uiElement && event.errors.length === 0) {
        this.$store.dispatch('app/updateUISchemaElement', {
          elementUUID: this.uiElement.uuid,
          changedProperties: event.data,
        });
      }
    },
    updateVariableSettings: function (event: JsonFormsChangeEvent) {
      if (this.uiElement && event.errors.length === 0) {
        this.$store.dispatch('app/updateSchemaVariable', {
          elementUUID: this.uiElement.uuid,
          newVariable: event.data.variable,
        });
      }
    },
  },
});
export default PropertiesPanel;
</script>
