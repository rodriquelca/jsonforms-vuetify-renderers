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
  uiTypeIs
} from '@jsonforms/core';
import { Emitter } from 'mitt';
import { defineComponent, inject } from '@vue/composition-api';
import {
  rendererProps,
  useJsonFormsControl,
  RendererProps,
} from '@jsonforms/vue2';
import { useVuetifyControl } from '@jsonforms/vue2-vuetify';
// type ValidateFunc = () => number;
// type Emits<EventType extends string | symbol, T> = {
//   on(type: EventType, handler: (arg: T) => void): void
//   off(type: EventType, handler: (arg: T) => void): void
//   emit(type: EventType, arg: T): void
// }
// type Emitter = Emits<'myevent', ValidateFunc>
type Events = {
  test: string, 
  value: number
}

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
    const emitter = inject("emitter") as Emitter<Events>;   // Inject `emitter`
    emitter.on("myevent", (value) => {   // *Listen* for event
      console.log("myevent received!", `value: ${value}`);
    });
    emitter.emit("myevent", 100);
    return useVuetifyControl(
      useJsonFormsControl(props),
      (value) => value || undefined
    );
  },
  computed: {
    items():any {
      return this.entries.map((entry) => {
        const Description =
          entry.Description.length > this.descriptionLimit 
            ? entry.Description.slice(0, this.descriptionLimit) + '...'
            : entry.Description;

        return Object.assign({}, entry, { Description });
      });
    },
  },
  methods: {
    changeHandler(value: Array<any>): any{
      console.log('changeHandler');
      console.log(value);


    }
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
