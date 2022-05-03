<template>
  <!-- <container> -->
  <v-card class="mx-auto" outlined>
    <v-container>
      <h5>Rules</h5>
      <span class="text--disabled text-caption" x-small>
        {{ ruleDescription }}
      </span>

      <monaco-editor
        :theme="$vuetify.theme.dark ? 'vs-dark' : 'vs'"
        :language="`json`"
        height="200"
        :options="{ minimap: { enabled: false }, fontSize: 10 }"
        v-model="ruleSchema"
        :editorBeforeMount="registerValidations"
      >
      </monaco-editor>
      <div class="red--text text--lighten-1" :hidden="!invalidJson">
        {{ invalidJsonMessage }}
      </div>
      <v-btn depressed color="primary" @click="onClick" x-small> Apply </v-btn>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import {
  ControlElement,
  JsonFormsRendererRegistryEntry,
  rankWith,
  scopeEndsWith,
  isStringControl,
} from '@jsonforms/core';
import MonacoEditor from '@/components/MonacoEditor.vue';
import { Uri, monaco } from 'monaco-editor/esm/vs/editor/editor.api';
import {
  configureJsonSchemaValidation,
  configureUISchemaValidation,
  configureDataValidation,
  EditorApi,
  getMonacoModelForUri,
} from '@/core/jsonSchemaValidation';
import { defineComponent } from '@vue/composition-api';
import {
  rendererProps,
  useJsonFormsControl,
  RendererProps,
} from '@jsonforms/vue2';
import { useVuetifyControl } from '@jsonforms/vue2-vuetify';
import { sync } from 'vuex-pathify';

const isValidRule = (rule: any) => {
  return !rule || (rule.effect && rule.condition);
};
const controlRenderer = defineComponent({
  name: 'rules-control-renderer',
  props: {
    ...rendererProps<ControlElement>(),
  },
  components: {
    MonacoEditor,
  },
  data: () => ({
    ruleDescription: 'Define conditions and effects',
    ruleSchema: undefined as monaco.editor.ITextModel,
    monacoHeight: '200',
    monacoWidth: '200',
    invalidJson: false,
    invalidJsonMessage: 'Not a valid rule JSON.',
  }),
  mounted() {
    this.setMonacoSchema({
      test: 'test',
    });
  },

  setup(props: RendererProps<ControlElement>) {
    return useVuetifyControl(
      useJsonFormsControl(props),
      (value) => value || undefined
    );
  },
  watch: {
    control: function (val) {
      this.setMonacoSchema(val.data);
    },
  },
  methods: {
    setMonacoSchema(ruleJson) {
      const modelUri = Uri.parse('json://core/specification/rules.json');
      this.ruleSchema = getMonacoModelForUri(
        modelUri,
        JSON.stringify(ruleJson, null, 2)
      );
    },
    registerValidations(editor: EditorApi) {
      configureJsonSchemaValidation(editor, ['*.schema.json']);
      configureUISchemaValidation(editor, ['*.uischema.json', '*.rule.json']);
    },
    setInvalidJson(value) {
      this.invalidJson = value;
    },

    onClick() {
      try {
        // this.handleChange('rule', JSON.parse(this.ruleSchema.getValue()));
        const rule = JSON.parse(this.ruleSchema.getValue());
        if (isValidRule(rule)) {
          this.setInvalidJson(false);
          this.handleChange('rule', rule);
        } else {
          this.setInvalidJson(true);
        }
      } catch (error) {
        this.setInvalidJson(true);
      }
    },
  },
});

export default controlRenderer;

export const RulesControlRenderer = {
  renderer: controlRenderer,
  tester: rankWith(100, scopeEndsWith('rule')),
};
</script>
