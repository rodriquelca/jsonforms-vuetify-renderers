<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <v-container>
      <div class="text-h6 font-weight-regular grey--text">
        {{ message }}
        test

        <dispatch-renderer
          :visible="control.visible"
          :enabled="control.enabled"
          :schema="control.schema"
          :uischema="detailUiSchema"
          :path="control.path"
          :renderers="customRenderers"
          :cells="control.cells"
        />
      </div>
    </v-container>
  </control-wrapper>
</template>

<script lang="ts">
import {
  ControlElement,
  JsonFormsRendererRegistryEntry,
  rankWith,
  uiTypeIs,
  UISchemaElement,
  findUISchema,
  GroupLayout,
} from '@jsonforms/core';
import { vuetifyRenderers } from '@jsonforms/vue2-vuetify';
import { defineComponent } from '@vue/composition-api';
import isEmpty from 'lodash/isEmpty';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsControl,
  RendererProps,
} from '@jsonforms/vue2';
import { useVuetifyControl, ControlWrapper } from '@jsonforms/vue2-vuetify';

import { VContainer } from 'vuetify/lib';
import Editor from '@tinymce/tinymce-vue';

const controlRenderer = defineComponent({
  name: 'form-control-renderer',
  components: {
    DispatchRenderer,
    ControlWrapper,
    VContainer,
    Editor,
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
      ...{
        message: 'Select screen to nest',
      },
    };
  },
  mounted() {
    // this.renderers = vuetifyRenderers;
  },
  computed: {
    customRenderers(): Array<any> {
      // const renderers = this.control.renderers?.filter((r) => {
      //   console.log(r);
      // });
      return vuetifyRenderers;
    },
    detailUiSchema(): UISchemaElement {
      const result = findUISchema(
        this.control.uischemas,
        this.control.schema,
        this.control.uischema.scope,
        this.control.path,
        'Group',
        this.control.uischema,
        this.control.rootSchema
      );

      if (isEmpty(this.control.path)) {
        result.type = 'VerticalLayout';
      } else {
        (result as GroupLayout).label = this.control.label;
      }

      return result;
    },
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(11, uiTypeIs('Form')),
};
</script>
