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
        <div v-else-if="schemasCollection">
          <v-switch
            v-model="showAdvancedRule"
            :label="`Advanced: ${showAdvancedRule.toString()}`"
          ></v-switch>
          <json-forms
            v-if="!showAdvancedRule"
            :renderers="renderers"
            :data="rulesData"
            :uischema="schemasCollection.get('rulesEditor').uiSchema"
            :schema="schemasCollection.get('rulesEditor').schema"
            @change="updateRulesEditorSetting"
          />

          <json-forms
            v-if="showAdvancedRule"
            :renderers="renderers"
            :data="generalData"
            :uischema="schemasCollection.get('rulesAdvanced').uiSchema"
            :schema="schemasCollection.get('rulesAdvanced').schema"
            @change="updateRulesSetting"
          />
        </div>
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
        <json-forms
          v-if="schemasCollection"
          :renderers="renderers"
          :data="generalData"
          :uischema="schemasCollection.get('advanced').uiSchema"
          :schema="schemasCollection.get('advanced').schema"
          @change="updateAdvancedSetting"
        />
      </v-expansion-panel-content>
    </v-expansion-panel>
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
import _ from 'lodash';
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
      showAdvancedRule: false,
      panel: [0, 1, 2, 3, 4],
      generalData: {},
      rulesData: undefined,
      schemasCollection: undefined,
      hasRule: false,
      uiElement: null,
    };
  },
  mounted() {
    this.setSelection(this.selectedElement);
  },
  watch: {
    selectedElement(newSelection) {
      this.setSelection(newSelection);
    },
  },
  computed: {
    selectedElement: sync('app/editor@selectedElement'),
    schemaPropertiesLive: sync('app/editor@selectedElement'),
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
        if (elementSchema) {
          this.generalData['required'] =
            this.schema.schema.required &&
            this.schema.schema.required.includes(
              getVariableName(this.uiElement)
            );
          if (elementSchema.schema.description) {
            this.generalData['description'] = elementSchema.schema.description
              ? elementSchema.schema.description
              : '';
          }
          if (elementSchema.schema.maxLength) {
            this.generalData['maxLength'] = elementSchema.schema.maxLength
              ? elementSchema.schema.maxLength
              : '';
          }
          (this.generalData['readOnly'] = elementSchema.schema.readOnly
            ? elementSchema.schema.readOnly
            : false),
            (this.schemasCollection = this.propertiesService.getProperties(
              this.uiElement,
              elementSchema
            ));
        }
        // rule property
        if (this.generalData['rule']) {
          this.populateFieldEnum();
          this.setRulesData();
          this.hasRule = true;
        } else {
          this.rulesData = undefined;
          this.hasRule = false;
        }

        this.generalData['items'] = this.generalData['options'];
      }
    },
    updateGeneralSettings: function (event: JsonFormsChangeEvent) {
      const elementSchema = this.findElementSchema();
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
          this.$store.dispatch('locales/updateProperty', {
            oldProperty: elementSchema ? elementSchema.key : '',
            newProperty: event.data.variable,
          });
          this.generalData['variable'] = event.data.variable;
        }
        // required
        if (
          typeof event.data.required !== 'undefined' &&
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
          typeof event.data.readOnly !== 'undefined' &&
          this.generalData['readOnly'] !== event.data.readOnly
        ) {
          this.$store.dispatch('app/updateSchemaReadOnly', {
            elementUUID: this.uiElement.uuid,
            readOnly: event.data.readOnly,
          });

          this.generalData['readOnly'] = event.data.readOnly;
        }
        //Properties for datePicker
        if (event.data.minDate) {
          this.$store.dispatch('app/updateSchemaMinDate', {
            elementUUID: this.uiElement.uuid,
            minDate: event.data.minDate,
          });
          this.generalData['minDate'] = event.data.minDate;
        }
        if (event.data.maxDate) {
          this.$store.dispatch('app/updateSchemaMaxDate', {
            elementUUID: this.uiElement.uuid,
            maxDate: event.data.maxDate,
          });
          this.generalData['maxDate'] = event.data.maxDate;
        }
        if (event.data.defaultDate) {
          this.$store.dispatch('app/updateSchemaDefaultDate', {
            elementUUID: this.uiElement.uuid,
            defaultDate: event.data.defaultDate,
          });
          this.generalData['defaultDate'] = event.data.defaultDate;
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
        // options
        if (
          event.data.options &&
          this.generalData['options'] !== event.data.options
        ) {
          this.$store.dispatch('app/updateUISchemaElement', {
            elementUUID: this.uiElement.uuid,
            changedProperties: { options: event.data.options },
          });
          this.generalData['options'] = event.data.options;
        }
        // description
        if (
          event.data.description &&
          this.generalData['description'] !== event.data.description
        ) {
          this.$store.dispatch('app/updateSchemaElement', {
            elementUUID: this.uiElement.uuid,
            changedProperties: { description: event.data.description },
          });
          this.generalData['description'] = event.data.description;
        }
        // maxLength
        if (
          event.data.maxLength &&
          this.generalData['maxLength'] !== event.data.maxLength
        ) {
          this.$store.dispatch('app/updateSchemaElement', {
            elementUUID: this.uiElement.uuid,
            changedProperties: { maxLength: event.data.maxLength },
          });
          this.generalData['maxLength'] = event.data.maxLength;
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
          this.setRulesData();
        }
      }
    },
    updateAdvancedSetting: function (event: JsonFormsChangeEvent) {
      if (this.uiElement && event.errors.length === 0) {
        if (
          event.data.options &&
          this.generalData['options'] !== event.data.options
        ) {
          this.$store.dispatch('app/updateUISchemaElement', {
            elementUUID: this.uiElement.uuid,
            changedProperties: { options: event.data.options },
          });
          this.generalData['options'] = event.data.options;
        }
      }
    },
    updateRulesEditorSetting: function (event: JsonFormsChangeEvent) {
      if (
        event.data &&
        event.data.rules &&
        event.data.effect &&
        event.data.allOrAny
      ) {
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
          this.$store.dispatch('app/updateUISchemaElement', {
            elementUUID: this.uiElement.uuid,
            changedProperties: { rule: rules.length > 0 ? rule : undefined },
          });

          this.generalData['rule'] = rule;
          this.hasRule = rules.length > 0 ? true : false;
        } else {
          this.hasRule = false;
        }
      }
    },
    isValidRule: (rule: any) => {
      return !rule || (rule.effect && rule.condition);
    },
    addRuleHandler: function (event: JsonFormsChangeEvent) {
      this.hasRule = !this.hasRule;

      this.populateFieldEnum();
      this.createDefaultRule();
    },
    /**
     * Populate field control with enum options
     *
     */
    populateFieldEnum: function () {
      const keys = Array.from(this.schema.properties.keys());
      this.schemasCollection.get(
        'rulesEditor'
      ).schema.properties.rules.items.properties.field.enum = keys;
    },

    createDefaultRule: function () {
      const keys = Array.from(this.schema.properties.keys());
      const rules = [
        {
          condition: 'is',
          field: keys[0],
          value: '',
        },
      ];
      this.rulesData = {
        rules,
        allOrAny: 'allOf',
        effect: 'HIDE',
      };
    },
    setRulesData: function () {
      let rules = [];
      if (!this.generalData['rule']) {
        return false;
      }
      const schema = this.generalData['rule'].condition.schema;
      const allOrAny = Object.keys(schema)[0];
      const elements = schema[allOrAny];
      if (elements.length) {
        elements.forEach(function (value) {
          if (value.properties) {
            const field = value.properties;
            rules.push({
              condition: 'is',
              field: Object.keys(field)[0],
              value: field[Object.keys(field)[0]].const,
            });
          }
        });
        if (rules.length > 0) {
          this.rulesData = {
            effect: this.generalData['rule'].effect,
            allOrAny,
            rules,
          };
        } else {
          this.showAdvancedRule = true;
        }
      } else {
        this.showAdvancedRule = true;
      }
    },
    findElementSchema() {
      const linkedSchemaUUID = this.uiElement.linkedSchemaElement;
      const elementSchema =
        linkedSchemaUUID && this.schema
          ? tryFindByUUID(this.schema, linkedSchemaUUID)
          : undefined;
      let ele;
      for (const [key, value] of this.schema.properties) {
        if (_.isEqual(value, elementSchema)) {
          ele = {
            key: key,
            value: value,
          };
        }
      }
      return ele;
    },
  },
});
export default PropertiesPanel;
</script>
