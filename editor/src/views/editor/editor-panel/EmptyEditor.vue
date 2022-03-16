<template>
  <v-card
    class="d-flex align-center justify-center px-10 mx-auto"
    min-height="76"
    height="auto"
    outlined
  >
    <div :class="`text-caption`">
      <span> Drag and drop an element from the Palette to begin. </span>
      <draggable
        class="dragAreaItem list-group"
        :list="list1"
        group="people"
        @change="handleChange"
      >
      </draggable>
      <div class="list-group-item" v-for="element in list1" :key="element.type">
        {{ element.type }}
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import draggable from 'vuedraggable';
import { EditorUISchemaElement } from '../../../model/uischema';
import { createControl, tryFindByUUID } from '@/util';
import { buildSchemaTree } from '../../../model/schema';
export default {
  name: 'EmptyEditor',
  components: {
    draggable,
  },
  data() {
    return {
      list1: [],
    };
  },
  methods: {
    handleChange(evt: any) {
      if (evt.added) {
        this.$store.dispatch('app/setSchema', {
          schema: {
            type: 'object',
            title: 'person',
            properties: {},
          },
        });
        debugger;
        if (evt.added.element && evt.added.element.type === 'Control') {
          //here update the schema
          const property = evt.added.element.uiSchemaElementProvider();
          const newElement = buildSchemaTree(property.control);

          this.$store.dispatch('app/addPropertyToSchema', {
            schemaElement: newElement,
            elementUUID: undefined,
            indexOrProp: property.variable,
          });
          debugger;

          //Here uischema
          const schemaElement = tryFindByUUID(
            this.$store.get('app/editor@schema'),
            newElement.uuid
          );
          schemaElement.options = property.uiOptions;
          const newUIElement = createControl(schemaElement, 'Control');
          this.$store.dispatch('app/setUiSchema', { uiSchema: newUIElement });
        } else {
          const provider = evt.added.element.uiSchemaElementProvider();
          this.$store.dispatch('app/setUiSchema', { uiSchema: provider });
        }
      }
    },
  },
};
</script>

<style>
.dragArea,
.dragAreaItem {
  width: 100%;
  min-height: 50px;
}
</style>
