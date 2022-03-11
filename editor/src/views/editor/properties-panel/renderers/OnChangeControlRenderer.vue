<template>
  <div class="pm-card-property">
    <h5>On Change</h5>
    <span class="text--disabled text-caption">
      {{ ruleDescription }}
    </span>
    <monaco-editor
      ref="monacoEditorOnChange"
      :theme="$vuetify.theme.dark ? 'vs-dark' : 'vs'"
      :language="language"
      height="200"
      :options="{ minimap: { enabled: false }, fontSize: 10 }"
      v-model="ruleSchema"
      :editorBeforeMount="editorBeforeMount"
    >
    </monaco-editor>

    <div class="red--text text--lighten-1" :hidden="!invalidCode">
      {{ invalidCodeMessage }}
    </div>
    <v-btn x-small depressed color="primary" @click="onClick"> Apply </v-btn>
  </div>
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

const controlRenderer = defineComponent({
  name: 'on-change-control-renderer',
  props: {
    ...rendererProps<ControlElement>(),
  },
  components: {
    MonacoEditor,
  },
  data: () => ({
    language: 'javascript',
    ruleDescription: 'Change handler',
    ruleSchema: undefined as monaco.editor.ITextModel,
    monacoHeight: '200',
    monacoWidth: 'auto',
    invalidCode: false,
    invalidCodeMessage: 'Code invalid',
  }),
  mounted() {
    this.ruleSchema = monaco.editor.createModel('', this.language);
  },
  setup(props: RendererProps<ControlElement>) {
    return useVuetifyControl(
      useJsonFormsControl(props),
      (value) => value || undefined
    );
  },
  methods: {
    editorBeforeMount() {
      this.$refs['monacoEditorOnChange']._render();
    },
    onClick() {
      this.handleChange(
        'options.events.onChange.body',
        this.ruleSchema.getValue()
      );
    },
  },
});

export default controlRenderer;

export const OnChangeControlRenderer = {
  renderer: controlRenderer,
  tester: rankWith(100, scopeEndsWith('onchange')),
};
</script>

<style scoped>
.pm-card-property {
  padding: 5px;
  border: solid 1px rgb(231, 220, 220);
}
</style>
