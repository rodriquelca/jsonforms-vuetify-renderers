<template>
  <v-card
    v-if="layout.visible"
    :class="`pa-0 ${styles.group.root}`"
    elevation="2"
  >
    <v-card-title v-if="layout.uischema.label" :class="styles.group.label">{{
      layout.uischema.label
    }}</v-card-title>
<v-container justify-space-around align-content-center>
    <v-row justify="center" no-gutters>
      <v-col
          v-for="(element, index) in layout.uischema.elements"
          :key="`${layout.path}-${index}`"
          :class="styles.group.item"
          no-gutters
        >
        <dispatch-renderer
        :schema="layout.schema"
        :uischema="element"
        :path="layout.path"
        :enabled="layout.enabled"
        :renderers="layout.renderers"
        :cells="layout.cells"
      />
      </v-col>
    </v-row>
</v-container>
  </v-card>
</template>

<script lang="ts">
import {
  JsonFormsRendererRegistryEntry,
  Layout,
  rankWith,
  and,
  isLayout,
  uiTypeIs,
} from '@jsonforms/core';
import { defineComponent } from '../vue';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsLayout,
  RendererProps,
} from '@jsonforms/vue2';
import { VContainer, VRow, VCol } from 'vuetify/lib';
import { useVuetifyLayout } from '../util';
import { VCard, VCardTitle, VCardText } from 'vuetify/lib';

const layoutRenderer = defineComponent({
  name: 'group-renderer',
  components: {
    DispatchRenderer,
    VCard,
    VCardTitle,
    VCardText,
    VContainer,
    VRow,
    VCol,
  },
  props: {
    ...rendererProps<Layout>(),
  },
  setup(props: RendererProps<Layout>) {
    console.log(useVuetifyLayout(useJsonFormsLayout(props)));
    return useVuetifyLayout(useJsonFormsLayout(props));
  },
});

export default layoutRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: layoutRenderer,
  tester: rankWith(2, and(isLayout, uiTypeIs('Group'))),
};
</script>
