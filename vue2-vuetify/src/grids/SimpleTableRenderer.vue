<template>
  <v-container justify-space-around align-content-center>
    test
    <v-row no-gutters>
      <v-simple-table class="array-container flex">
        <tbody>
          <tr :class="styles.arrayList.item">
            <td v-for="(element, index) in uischema.elements" :key="index">
              <!-- <dispatch-renderer
                :key="element.uuid"
                updateItemIndex
                :schema="useJsonForm.layout.value.schema"
                :uischema="element"
                :path="useJsonForm.layout.value.path"
                :enabled="useJsonForm.layout.value.enabled"
                :renderers="control.renderers"
                :cells="useJsonForm.layout.value.cells"
              /> -->
              test
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import {
  uiTypeIs,
  JsonFormsRendererRegistryEntry,
  Layout,
  rankWith,
} from '@jsonforms/core';
import { defineComponent } from '@vue/composition-api';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsLayout,
  RendererProps,
} from '@jsonforms/vue2';
import { useVuetifyLayout } from '../util';
import { VContainer, VRow, VCol } from 'vuetify/lib';
import _ from 'lodash';

const droppableRenderer = defineComponent({
  name: 'simple-table-renderer',
  components: {
    DispatchRenderer,
    VContainer,
    VRow,
    VCol,
  },

  props: {
    ...rendererProps<Layout>(),
  },
  setup(props: RendererProps<Layout>) {
    return {
      useJsonForm: useVuetifyLayout(useJsonFormsLayout(props)),
      enabledDrag: true,
      dragging: false,
    };
  },

  methods: {
    /**
     * Update Index in uischema
     */
    updateItemIndex(item: any) {
      const auxElement = this.uischema.elements.splice(item.oldIndex, 1);
      this.uischema.elements.splice(item.newIndex, 0, auxElement[0]);
    },
  },
});

export default droppableRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: droppableRenderer,
  tester: rankWith(70, uiTypeIs('TableLayout')),
};
</script>
<style scoped>
.dragArea {
  height: 80px;
}

.fixed-cell {
  width: 150px;
  height: 50px;
  padding-left: 0 !important;
  padding-right: 0 !important;
  text-align: center;
}

.fixed-cell-small {
  width: 50px;
  height: 50px;
  padding-left: 0 !important;
  padding-right: 0 !important;
  text-align: center;
}

.array-container tbody tr td {
  border-bottom: none !important;
}

.array-container tbody tr td .container {
  padding: 0;
  margin: 0;
}
</style>
