<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <v-container>testasdffasd</v-container>
  </control-wrapper>
</template>

<script lang="ts">
import {
  ControlElement,
  JsonFormsRendererRegistryEntry,
  rankWith,
  isStringControl,
  and,
  optionIs,
} from '@jsonforms/core';
import { defineComponent } from '@vue/composition-api';
import {
  rendererProps,
  useJsonFormsControl,
  RendererProps,
} from '@jsonforms/vue2';
// import { default as ControlWrapper } from '../controls/ControlWrapper.vue';
import { useVuetifyControl, ControlWrapper } from '@jsonforms/vue2-vuetify';

import { VContainer } from 'vuetify/lib';

const controlRenderer = defineComponent({
  name: 'html-viewer-control-renderer',
  components: {
    ControlWrapper,
    VContainer,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    return useVuetifyControl(
      useJsonFormsControl(props),
      (value) => value || undefined
    );
  },
  computed: {},
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(5, and(isStringControl, optionIs('isHtmlViewer', true))),
};
</script>
