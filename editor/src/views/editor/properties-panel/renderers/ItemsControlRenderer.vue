<template>
  <v-card class="mx-auto" outlined>
    <v-container>
      <h5>Items</h5>
      <span class="text--disabled text-caption">
        {{ ruleDescription }}
      </span>
      <monaco-editor
        ref="monacoEditorItems"
        :theme="$vuetify.theme.dark ? 'vs-dark' : 'vs'"
        :language="language"
        height="100"
        :options="{ minimap: { enabled: false }, fontSize: 10 }"
        v-model="ruleSchema"
        :editorBeforeMount="editorBeforeMount"
      >
      </monaco-editor>
      <list-options @onSave="onSaveJson"> </list-options>

      <div class="red--text text--lighten-1" :hidden="!invalidJson">
        {{ invalidJsonMessage }}
      </div>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { ControlElement, rankWith, scopeEndsWith } from '@jsonforms/core';
import MonacoEditor from '@/components/MonacoEditor.vue';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { defineComponent } from '@vue/composition-api';
import {
  rendererProps,
  useJsonFormsControl,
  RendererProps,
} from '@jsonforms/vue2';
import { useVuetifyControl } from '@jsonforms/vue2-vuetify';
import ListOptions from '../../../../components/Settings/ListOptions.vue';

const controlRenderer = defineComponent({
  name: 'items-control-renderer',
  props: {
    ...rendererProps<ControlElement>(),
  },
  components: {
    MonacoEditor,
    ListOptions,
  },
  data: () => ({
    language: 'javascript',
    ruleDescription: 'JSON',
    ruleSchema: undefined as monaco.editor.ITextModel,
    monacoHeight: '200',
    monacoWidth: '200',
    invalidJson: false,
    invalidJsonMessage: 'Not a valid rule JSON.',
  }),
  mounted() {
    this.ruleSchema = monaco.editor.createModel('[]', this.language);
  },
  setup(props: RendererProps<ControlElement>) {
    return useVuetifyControl(
      useJsonFormsControl(props),
      (value) => value || undefined
    );
  },
  methods: {
    editorBeforeMount() {
      this.$refs['monacoEditorItems']._render();
    },
    onClick() {
      let val;
      try {
        val = JSON.parse(this.ruleSchema.getValue());
      } catch (e) {
        val = this.ruleSchema.getValue();
      }
      this.handleChange('options.items', val);
    },
    onSaveJson(items: any) {
      this.handleChange('options.items', items);
    },
  },
});

export default controlRenderer;

export const ItemsControlRenderer = {
  renderer: controlRenderer,
  tester: rankWith(100, scopeEndsWith('items')),
};
</script>
