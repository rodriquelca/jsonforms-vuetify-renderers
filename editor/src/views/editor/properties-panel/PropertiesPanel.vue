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
          :data="rulesData"
          :uischema="schemasCollection.get('rulesEditor').uiSchema"
          :schema="schemasCollection.get('rulesEditor').schema"
          @change="updateRulesEditorSetting"
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
        <!-- <json-forms
          v-else-if="schemasCollection"
          :renderers="renderers"
          :data="generalData"
          :uischema="schemasCollection.get('rules').uiSchema"
          :schema="schemasCollection.get('rules').schema"
          @change="updateRulesSetting"
        /> -->
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
      panel: [1, 2, 3, 4],
      generalData: undefined,
      rulesData: undefined,
      schemasCollection: undefined,
      hasRule: false,
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
      elements.forEach(function (value) {
        const field = value.properties;
        rules.push({
          condition: 'is',
          field: Object.keys(field)[0],
          value: field[Object.keys(field)[0]].const,
        });
      });
      this.rulesData = {
        effect: this.generalData['rule'].effect,
        allOrAny,
        rules,
      };
    },
  },
});
export default PropertiesPanel;
</script>
