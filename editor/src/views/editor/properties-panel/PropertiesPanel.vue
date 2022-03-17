<template>
  <v-expansion-panels v-model="panel" multiple no-gutters>
    <v-expansion-panel>
      <v-expansion-panel-header>
        <div>
          <v-icon>mdi-share-variant-outline</v-icon>
          <span> Rules Editor</span>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-btn block color="primary" v-if="!hasRule" @click="addRuleHandler">
          <v-icon>mdi-plus</v-icon>Add Rule
        </v-btn>
        <json-forms
          v-else-if="schemasCollection"
          :renderers="renderers"
          :data="generalData"
          :uischema="schemasCollection.get('rulesEditor').uiSchema"
          :schema="schemasCollection.get('rulesEditor').schema"
          @change="updateRulesEditorSetting"
        />
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-header>
        <div>
          <v-icon>mdi-share-variant-outline</v-icon>
          <span> Rules</span>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-btn
          block
          color="primary"
          v-if="!hasRule"
          @click="hasRule = !hasRule"
        >
          <v-icon>mdi-plus</v-icon>Add Rule
        </v-btn>
        <json-forms
          v-else-if="schemasCollection"
          :renderers="renderers"
          :data="generalData"
          :uischema="schemasCollection.get('rules').uiSchema"
          :schema="schemasCollection.get('rules').schema"
          @change="updateRulesSetting"
        />
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-header>
        <div>
          <v-icon>mdi-variable</v-icon>
          <span> General</span>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <json-forms
          v-if="schemasCollection"
          :renderers="renderers"
          :data="generalData"
          :uischema="schemasCollection.get('general').uiSchema"
          :schema="schemasCollection.get('general').schema"
          @change="updateGeneralSettings"
        />
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-header>
        <div>
          <v-icon> mdi-tune-vertical</v-icon>
          <span> Advanced </span>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <!-- <json-forms
          v-if="designProperties"
          :renderers="renderers"
          :data="dataElement"
          :uischema="designProperties.uiSchema"
          :schema="designProperties.schema"
          @change="updateDesignProperties"
        /> -->
      </v-expansion-panel-content>
    </v-expansion-panel>
    <!-- <v-expansion-panel>
      <v-expansion-panel-header>
        <div>
          <v-icon> mdi-cog</v-icon>
          <span> Settings </span>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content> Schema Settings </v-expansion-panel-content>
    </v-expansion-panel> -->
  </v-expansion-panels>
</template>

<script lang="ts">
import { sync } from 'vuex-pathify';
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
      panel: [1, 2],
      generalData: undefined,
      schemasCollection: undefined,
      hasRule: false,
    };
  },
  mounted() {
    console.log('mounted');
    this.setSelection(this.selectedElement);
  },
  watch: {
    selectedElement(newSelection) {
      this.setSelection(newSelection);
    },
  },
  computed: {
    selectedElement: sync('app/editor@selectedElement'),
  },

  methods: {
    setSelection: function (newSelection) {
      this.uiElement = tryFindByUUID(this.uischema, newSelection);
      this.generalData = omit(this.uiElement, [
        'uuid',
        'parent',
        'elements',
        'linkedSchemaElement',
        'options.detail',
        'scope',
        'type',
      ]);

      if (this.uiElement) {
        // design properties
        const linkedSchemaUUID = this.uiElement.linkedSchemaElement;
        const elementSchema =
          linkedSchemaUUID && this.schema
            ? tryFindByUUID(this.schema, linkedSchemaUUID)
            : undefined;

        this.generalData['variable'] = getVariableName(this.uiElement);
        this.generalData['required'] =
          this.schema.schema.required &&
          this.schema.schema.required.includes(getVariableName(this.uiElement));
        (this.generalData['readOnly'] = elementSchema.schema.readOnly
          ? elementSchema.schema.readOnly
          : false),
          (this.schemasCollection = this.propertiesService.getProperties(
            this.uiElement,
            elementSchema
          ));
      }
    },
    updateGeneralSettings: function (event: JsonFormsChangeEvent) {
      // variable
      if (this.uiElement && event.errors.length === 0) {
        if (
          event.data.variable &&
          this.generalData['variable'] !== event.data.variable
        ) {
          this.$store.dispatch('app/updateSchemaVariable', {
            elementUUID: this.uiElement.uuid,
            newVariable: event.data.variable,
          });
          this.generalData['variable'] = event.data.variable;
        }
        // required
        if (
          event.data.required &&
          this.generalData['required'] !== event.data.required
        ) {
          this.$store.dispatch('app/updateSchemaRequired', {
            elementUUID: this.uiElement.uuid,
            required: event.data.required,
          });

          this.generalData['required'] = event.data.required;
        }
        // readOnly
        if (
          event.data.readOnly &&
          this.generalData['readOnly'] !== event.data.readOnly
        ) {
          this.$store.dispatch('app/updateSchemaReadOnly', {
            elementUUID: this.uiElement.uuid,
            readOnly: event.data.readOnly,
          });

          this.generalData['readOnly'] = event.data.readOnly;
        }
        // label
        if (
          event.data.label &&
          this.generalData['label'] !== event.data.label
        ) {
          this.$store.dispatch('app/updateUISchemaElement', {
            elementUUID: this.uiElement.uuid,
            changedProperties: { label: event.data.label },
          });
          this.generalData['label'] = event.data.label;
        }
      }
    },
    updateRulesSetting: function (event: JsonFormsChangeEvent) {
      if (this.uiElement && event.errors.length === 0) {
        if (event.data.rule && this.generalData['rule'] !== event.data.rule) {
          this.$store.dispatch('app/updateUISchemaElement', {
            elementUUID: this.uiElement.uuid,
            changedProperties: event.data,
          });
          this.generalData['rule'] = event.data.rule;
        }
      }
    },
    updateRulesEditorSetting: function (event: JsonFormsChangeEvent) {
      // console.log(event);
      let rule = {
        effect: event.data.effect,
        condition: {
          scope: '#',
          schema: {},
        },
      };
      let rules = [];
      event.data.rules.forEach(function (value) {
        let properties = {};
        properties[value.field] = { const: value.value };
        rules.push({
          type: 'object',
          properties,
        });
      });

      rule.condition.schema[event.data.allOrAny] = rules;
      if (this.isValidRule(rule)) {
        // this.setInvalidJson(false);
        // this.handleChange('rule', rule);
        this.$store.dispatch('app/updateUISchemaElement', {
          elementUUID: this.uiElement.uuid,
          changedProperties: { rule: rule },
        });
        this.generalData['rule'] = rule;
      } else {
        // this.setInvalidJson(true);
        console.error('invalud rule');
      }
      // console.log(rule);
    },
    isValidRule: (rule: any) => {
      return !rule || (rule.effect && rule.condition);
    },
    addRuleHandler: function (event: JsonFormsChangeEvent) {
      this.hasRule = !this.hasRule;
      let keys = Array.from(this.schema.properties.keys());
      this.schemasCollection.get(
        'rulesEditor'
      ).schema.properties.rules.items.properties.field.enum = keys;

      this.generalData['rules'] = [
        {
          condition: 'is',
          field: keys[0],
          value: '',
        },
      ];

      this.generalData['allOrAny'] = 'allOf';
      this.generalData['effect'] = 'HIDE';
      console.log(this.generalData);
    },
  },
});
export default PropertiesPanel;
</script>
