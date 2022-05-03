<template>
  <v-card class="mx-auto" outlined>
    <v-container>
      <h5>Deep Change</h5>
      <span class="text--disabled text-caption">
        {{ ruleDescription }}
      </span>
      <monaco-editor
        ref="monacoEditorDeep"
        :theme="$vuetify.theme.dark ? 'vs-dark' : 'vs'"
        :language="language"
        height="50"
        :options="{ minimap: { enabled: false }, fontSize: 10 }"
        v-model="ruleSchema"
        :editorBeforeMount="editorBeforeMount"
      >
      </monaco-editor>

      <div class="red--text text--lighten-1" :hidden="!invalidJson">
        {{ invalidJsonMessage }}
      </div>
      <v-btn x-small depressed color="primary" @click="onClick"> Apply </v-btn>
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

const controlRenderer = defineComponent({
  name: 'deep-change-control-renderer',
  props: {
    ...rendererProps<ControlElement>(),
  },
  components: {
    MonacoEditor,
  },
  data: () => ({
    language: 'javascript',
    ruleDescription: 'Return elements for field.',
    ruleSchema: undefined as monaco.editor.ITextModel,
    monacoHeight: '200',
    monacoWidth: '200',
    invalidJson: false,
    invalidJsonMessage: 'Not a valid rule JSON.',
  }),
  mounted() {
    this.ruleSchema = monaco.editor.createModel(
      '//arguments {payload ::: obj with dependencies data} \nreturn [];',
      this.language
    );
  },
  setup(props: RendererProps<ControlElement>) {
    return useVuetifyControl(
      useJsonFormsControl(props),
      (value) => value || undefined
    );
  },
  methods: {
    editorBeforeMount() {
      this.$refs['monacoEditorDeep']._render();
    },
    onClick() {
      this.handleChange(
        'options.events.deepChange.body',
        this.ruleSchema.getValue()
      );
    },
  },
});

export default controlRenderer;

export const DeepChangeControlRenderer = {
  renderer: controlRenderer,
  tester: rankWith(100, scopeEndsWith('deepchange')),
};
</script>
