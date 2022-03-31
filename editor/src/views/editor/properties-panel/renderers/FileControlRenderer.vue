<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <v-file-input
      :placeholder="appliedOptions.placeholder"
      prepend-icon="mdi-paperclip"
      :clearable="false"
      :show-size="1000"
      v-model="files"
      :required="control.required"
      :error-messages="control.errors"
      @change="onChangeHandler"
    ></v-file-input>
  </control-wrapper>
</template>

<script lang="ts">
import {
  ControlElement,
  rankWith,
  JsonFormsRendererRegistryEntry,
  uiTypeIs,
} from '@jsonforms/core';
import { defineComponent } from '@vue/composition-api';
import {
  rendererProps,
  useJsonFormsControl,
  RendererProps,
} from '@jsonforms/vue2';
import { useVuetifyControl, ControlWrapper } from '@jsonforms/vue2-vuetify';
import {
  VCard,
  VFileInput,
  VListItem,
  VListItemAvatar,
  VIcon,
  VListItemContent,
  VListItemTitle,
  VListItemSubtitle,
  VProgressLinear,
  VListItemAction,
  VBtn,
} from 'vuetify/lib';
const controlRenderer = defineComponent({
  name: 'file-control-renderer',
  components: {
    ControlWrapper,
    VCard,
    VFileInput,
    VListItem,
    VListItemAvatar,
    VIcon,
    VListItemContent,
    VListItemTitle,
    VListItemSubtitle,
    VProgressLinear,
    VListItemAction,
    VBtn,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },

  setup(props: RendererProps<ControlElement>) {
    return {
      ...useVuetifyControl(
        useJsonFormsControl(props),
        (value) => value || undefined
      ),
      ...{ files: undefined as unknown as Blob },
    };
  },
  methods: {
    onChangeHandler(e: any) {
      if (e) {
        const reader = new FileReader();

        let rawImg;
        reader.onloadend = () => {
          rawImg = reader.result;
          this.onChange(rawImg);
        };
        reader.readAsDataURL(e);
      }
    },
  },
});
export default controlRenderer;
export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(1, uiTypeIs('File')),
};
</script>
