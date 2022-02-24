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
        :items="items"
        :loading="isLoading"
        :search-input.sync="search"
        hide-no-data
        item-text="Description"
        item-value="API"
        :label="computedLabel"
        :placeholder="appliedOptions.placeholder"
        prepend-icon="mdi-database-search"
        return-object
        :clearable="hover"
        @change="changeHandler"
      ></v-autocomplete>
    </v-hover>
  </control-wrapper>
</template>

<script lang="ts">
import {
  ControlElement,
  rankWith,
  uiTypeIs,
  JsonFormsRendererRegistryEntry,
} from '@jsonforms/core';
import { defineComponent } from '../vue';
import {
  rendererProps,
  RendererProps,
  useJsonFormsControl,
} from '@jsonforms/vue2';

import { default as ControlWrapper } from '../controls/ControlWrapper.vue';
import { useVuetifyControl } from '../util';
import { VHover, VAutocomplete } from 'vuetify/lib';

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
    return useVuetifyControl(
      useJsonFormsControl(props),
      (value) => value || undefined
    );
  },
  computed: {
    items(): any {
      return this.entries.map((entry: any) => {
        const Description =
          entry.Description.length > this.descriptionLimit
            ? entry.Description.slice(0, this.descriptionLimit) + '...'
            : entry.Description;
        return Object.assign({}, entry, { Description });
      });
    },
  },
  methods: {
    changeHandler(value: Array<any>): any {
      console.log('changeHandler');
      console.log(value);
    },
  },
  watch: {
    search() {
      // Items have already been loaded
      // if (this.items.length > 0) return;
      // Items have already been requested
      if (this.isLoading) return;
      this.isLoading = true;
      // Lazily load input items
      // fetch('https://api.publicapis.org/entries')
      fetch(this.appliedOptions.url)
        .then((res) => res.json())
        .then((res: any) => {
          const { entries } = res;
          this.entries = entries;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => (this.isLoading = false));
    },
  },
});
export default controlRenderer;
export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(1, uiTypeIs('Suggest')),
};
</script>
