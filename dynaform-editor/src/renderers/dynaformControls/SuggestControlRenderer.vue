<template>
  <v-form>
    <v-container>
      
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
        @change="onChange"
      ></v-autocomplete>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import {
  ControlElement,
  rankWith,
  uiTypeIs
} from '@jsonforms/core';

import { defineComponent } from '@vue/composition-api';
import {
  rendererProps,
  useJsonFormsControl,
  RendererProps,
} from '@jsonforms/vue2';
import { useVuetifyControl } from '@jsonforms/vue2-vuetify';

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
  mounted() {
    //this.entries = [this.control.data];
  },

  setup(props: RendererProps<ControlElement>) {
    return useVuetifyControl(
      useJsonFormsControl(props),
      (value) => value || undefined
    );
  },
  computed: {
    items() {
      return this.entries.map((entry) => {
        const Description =
          entry.Description.length > this.descriptionLimit
            ? entry.Description.slice(0, this.descriptionLimit) + '...'
            : entry.Description;

        return Object.assign({}, entry, { Description });
      });
    },
  },

  watch: {
    search(val) {
      // Items have already been loaded
      // if (this.items.length > 0) return;

      // Items have already been requested
      if (this.isLoading) return;

      this.isLoading = true;

      // Lazily load input items
      // fetch('https://api.publicapis.org/entries')
      fetch(this.appliedOptions.url)
        .then((res) => res.json())
        .then((res) => {
          const { count, entries } = res;
          this.count = count;
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

export const SuggestControlRenderer = {
  renderer: controlRenderer,
  tester: rankWith(2, uiTypeIs('Suggest')),
};
</script>
