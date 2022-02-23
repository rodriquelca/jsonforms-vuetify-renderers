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
        @change="changeHandler"
      ></v-autocomplete>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import {
  ControlElement,
  rankWith,
  uiTypeIs,
  JsonFormsRendererRegistryEntry,
} from '@jsonforms/core';
import { defineComponent } from '@vue/composition-api';
import {
  rendererProps,
  RendererProps,
  useJsonFormsControl,
} from '@jsonforms/vue2';
import { useVuetifyControl } from '../util';
// type ValidateFunc = () => number;
// type Emits<EventType extends string | symbol, T> = {
//   on(type: EventType, handler: (arg: T) => void): void
//   off(type: EventType, handler: (arg: T) => void): void
//   emit(type: EventType, arg: T): void
// }
// type Emitter = Emits<'myevent', ValidateFunc>

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
  tester: rankWith(2, uiTypeIs('Suggest')),
};
</script>
