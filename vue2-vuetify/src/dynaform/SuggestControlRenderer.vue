<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <v-hover v-slot="{ hover }">
      <v-autocomplete
        :value="control.data"
        :items="controlBuilder.items"
        :loading="isLoading"
        hide-no-data
        :search-input.sync="search"
        item-text="label"
        item-value="value"
        :label="computedLabel"
        :placeholder="appliedOptions.placeholder"
        prepend-icon="mdi-database-search"
        return-object
        :clearable="hover"
        @input="onChange"
      ></v-autocomplete>
    </v-hover>
  </control-wrapper>
</template>

<script lang="ts">
import {
  ControlElement,
  rankWith,
  JsonFormsRendererRegistryEntry,
  uiTypeIs,
} from '@jsonforms/core';
import { defineComponent } from '../vue';
import {
  rendererProps,
  RendererProps,
  useJsonFormsControl,
} from '@jsonforms/vue2';

import { default as ControlWrapper } from '../controls/ControlWrapper.vue';
import { useVuetifyControlExt } from '../composition';
import { VHover, VAutocomplete } from 'vuetify/lib';
import { isFunction } from 'lodash';
import _ from 'lodash';

const controlRenderer = defineComponent({
  name: 'suggest-control-renderer',
  props: {
    ...rendererProps<ControlElement>(),
  },
  data: () => ({
    descriptionLimit: 60,
    entries: [],
    isLoading: false,
    model: null,
    search: null,
  }),

  components: {
    ControlWrapper,
    VAutocomplete,
    VHover,
  },
  setup(props: RendererProps<ControlElement>) {
    return useVuetifyControlExt(
      props,
      useJsonFormsControl(props),
      (value) => value || undefined
    );
  },
  computed: {},
  methods: {},
  watch: {
    search(query) {
      if (this.isLoading) return;
      let prom, clonePayload;
      //Verify if the controlBuilder.itemsbuilder is a function
      if (isFunction(this.controlBuilder.itemsBuilder)) {
        this.isLoading = true;
        clonePayload = {
          ..._.clone(this.controlBuilder.payload),
          ...{ [this.controlBuilder.scope]: query },
        };
        prom = this.controlBuilder.itemsBuilder(_, clonePayload);
        if (Boolean(prom && typeof prom.then === 'function')) {
          prom
            .then((res: any) => {
              this.controlBuilder.items = res;
            })
            .catch((err: any) => {
              console.error(err);
            })
            .finally(() => (this.isLoading = false));
        } else {
          this.controlBuilder.items = prom;
          this.isLoading = false;
        }
      }
    },
  },
});
export default controlRenderer;
export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(9, uiTypeIs('Suggest')),
};
</script>
