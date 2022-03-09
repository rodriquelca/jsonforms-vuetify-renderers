<template>
  <!-- <div> -->
  <v-container class="grey lighten-5">
    <v-row no-gutters>
      <draggable
        :class="draggableClass"
        :value="[]"
        group="people"
        @change="handleChange"
        :key="'draggable' + uischema.uuid"
      >
        <v-col
          v-for="(element, index) in uischema.elements"
          :key="`${layout.path}-${index}`"
        >
          <dispatch-renderer
            :key="element.uuid"
            :schema="schema"
            :uischema="element"
            :path="path"
            :enabled="enabled"
            :renderers="customRenderers"
            :cells="cells"
          />
        </v-col>
      </draggable>
      <!-- </div> -->
    </v-row>
  </v-container>
</template>
<script lang="ts">
import draggable from 'vuedraggable';
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
import { useVuetifyLayout } from '@jsonforms/vue2-vuetify';
import { VContainer, VRow, VCol } from 'vuetify/lib';
import { entry as DroppableElementRegistration } from './DroppableElement.vue';
import { EditorUISchemaElement } from '@/model';
import { createControl, tryFindByUUID } from '@/util';
import { buildSchemaTree } from '../../model/schema';

const droppableRenderer = defineComponent({
  name: 'droppable-horizontal-layout-renderer',
  components: {
    DispatchRenderer,
    VContainer,
    VRow,
    VCol,
    draggable,
  },

  props: {
    ...rendererProps<Layout>(),
  },
  setup(props: RendererProps<Layout>) {
    return useVuetifyLayout(useJsonFormsLayout(props));
  },
  computed: {
    draggableClass(): string {
      return 'dragArea row ' + this.styles.horizontalLayout.item;
    },
    customRenderers(): Array<any> {
      return (
        this.renderers && [...this.renderers, DroppableElementRegistration]
      );
    },
  },
  methods: {
    handleChange(evt) {
      if (evt.added) {
        if (evt.added.element && evt.added.element.type === 'Control') {
          //here update the schema
          const property = evt.added.element.uiSchemaElementProvider();
          const newElement = buildSchemaTree(property.control);
          this.$store.dispatch('app/addPropertyToSchema', {
            schemaElement: newElement,
            elementUUID: this.schema.uuid,
            indexOrProp: property.variable,
          });

          //Here uischema
          const schemaElement = tryFindByUUID(
            this.$store.get('app/editor@schema'),
            newElement.uuid
          );
          schemaElement.options = property.uiOptions;
          const newUIElement = createControl(schemaElement, 'Control');
          this.$store.dispatch('app/addScopedElementToLayout', {
            uiSchemaElement: newUIElement,
            layoutUUID: this.uischema.uuid,
            index: 0,
            schemaUUID: evt.added.element.uuid,
          });
        } else {
          let provider = evt.added.element.uiSchemaElementProvider();
          this.$store.dispatch('app/addUnscopedElementToLayout', {
            uiSchemaElement: provider,
            layoutUUID: this.uischema.uuid,
            index: 0,
          });
        }
      }
    },
  },
});

export default droppableRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: droppableRenderer,
  tester: rankWith(45, uiTypeIs('HorizontalLayout')),
};
</script>
<style scoped>
.test {
  background: #e5e5e5;
  height: 100%;
}
.dragArea {
  border: 1px dashed #000;
  min-height: 80px;
  content: 'Drag Controls';
}
</style>
