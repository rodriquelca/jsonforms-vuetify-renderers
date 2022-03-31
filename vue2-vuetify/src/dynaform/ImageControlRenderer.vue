<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <v-img
      :max-height="appliedOptions.height || 150"
      :max-width="appliedOptions.width || 150"
      :src="appliedOptions.image"
    ></v-img>
  </control-wrapper>
</template>

<script lang="ts">
import {
  ControlElement,
  JsonFormsRendererRegistryEntry,
  rankWith,
  uiTypeIs,
} from '@jsonforms/core';
import { defineComponent } from '../vue';
import {
  rendererProps,
  useJsonFormsControl,
  RendererProps,
} from '@jsonforms/vue2';
import { default as ControlWrapper } from '../controls/ControlWrapper.vue';
import { useVuetifyControl } from '../util';
import { DisabledIconFocus } from '../controls/directives';
import { VContainer, VImg } from 'vuetify/lib';

const controlRenderer = defineComponent({
  name: 'image-control-renderer',
  components: {
    ControlWrapper,
    VContainer,
    VImg,
  },
  directives: {
    DisabledIconFocus,
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
  // tester: rankWith(2, and(isStringControl, optionIs('isHtmlViewer', true))),
  tester: rankWith(9, uiTypeIs('Image')),
};
</script>
