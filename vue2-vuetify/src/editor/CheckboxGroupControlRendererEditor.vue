<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <v-label :for="control.id + '-input'">{{ computedLabel }}</v-label>
    <v-radio-group
      :id="control.id + '-input'"
      :class="styles.control.input"
      :disabled="!control.enabled"
      :autofocus="appliedOptions.focus"
      :placeholder="appliedOptions.placeholder"
      :hint="control.description"
      :persistent-hint="persistentHint()"
      :required="control.required"
      :error-messages="control.errors"
      :value="control.data"
      @change="onChange"
      @focus="isFocused = true"
      @blur="isFocused = false"
    >
      <v-checkbox
        v-for="o in control.options"
        v-model="data"
        :key="o.value"
        :label="o.label"
        :value="o.value"
        @change="onChange"
      ></v-checkbox>
    </v-radio-group>
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
  useJsonFormsEnumControl,
  RendererProps,
} from '@jsonforms/vue2';
import { useVuetifyControl } from '../util';
import { default as ControlWrapper } from '../controls/ControlWrapper.vue';
import { VRadioGroup, VCheckbox, VLabel } from 'vuetify/lib';
import { reactive } from '@vue/composition-api';

const controlRenderer = defineComponent({
  name: 'checkbox-group-control-renderer-editor',
  components: {
    ControlWrapper,
    VRadioGroup,
    VCheckbox,
    VLabel,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    let input: any = useVuetifyControl(
      useJsonFormsEnumControl(props),
      (value) => {
        return value || undefined;
      }
    );
    input.data = reactive([]);
    return input;
  },
  methods: {},
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(2, uiTypeIs('CheckboxGroup')),
};
</script>
