<template>
  <v-file-input
    v-model="computedData"
    color="deep-purple accent-4"
    counter
    :label="computedLabel"
    multiple
    :placeholder="appliedOptions.placeholder"
    prepend-icon="mdi-paperclip"
    outlined
    :show-size="1000"
    :rules="rules"
    :accept="appliedOptions.accept"
  >
    <template v-slot:selection="{ index, text }">
      <v-chip v-if="index < 2" color="deep-purple accent-4" dark label small>
        {{ text }}
      </v-chip>

      <span
        v-else-if="index === 2"
        class="text-overline grey--text text--darken-3 mx-2"
      >
        +{{ computedData.length - 2 }} File(s)
      </span>
    </template>
  </v-file-input>
</template>

<script lang="ts">
import { ControlElement, rankWith, uiTypeIs } from '@jsonforms/core';
import { cloneDeepWith } from 'lodash';
import { defineComponent } from '@vue/composition-api';
import {
  rendererProps,
  useJsonFormsControl,
  RendererProps,
} from '@jsonforms/vue2';
import { useVuetifyControl } from '@jsonforms/vue2-vuetify';

const controlRenderer = defineComponent({
  name: 'multiple-file-control-renderer',
  props: {
    ...rendererProps<ControlElement>(),
  },
  data: () => ({}),
  setup(props: RendererProps<ControlElement>) {
    return useVuetifyControl(
      useJsonFormsControl(props),
      (value) => value || undefined
    );
  },

  computed: {
    rules() {
      return [
        (files) =>
          !files ||
          !files.some((file) => file.size > this.appliedOptions.maxFileSize) ||
          'Avatar size should be less than 2 MB!',
      ];
    },
    computedData: {
      get() {
        const newFiles: Array<any> = this.control.data ? this.control.data.map((file: any) => {
          return {
            name: file.name,
            size: file.size,
            type: file.mimetype,
          };
        }): []
        return newFiles;
      },
      set(files: Array<any>) {
        const newFiles: Array<any> = files.map((file: any) => {
          //TODO upload the file service
          return {
            name: file.name,
            size: file.size,
            mimetype: file.type,
          };
        });

        this.onChange(newFiles);
      },
    },
  },
});

export default controlRenderer;

export const MultipleFileControlRenderer = {
  renderer: controlRenderer,
  tester: rankWith(3, uiTypeIs('MultipleFile')),
};
</script>
