<template>
  <v-card
    class="d-flex align-center justify-center pa-4 mx-auto"
    max-width="550"
    min-height="76"
    outlined
  >
    <div :class="`text-caption`">
      <draggable
        class="dragArea list-group"
        :list="list1"
        group="people"
        @change="handleChange"
      >
      </draggable>
      Drag and drop an element from the Palette to begin.
      <div class="list-group-item" v-for="element in list1" :key="element.type">
        {{ element.type }}
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import draggable from 'vuedraggable';
import { EditorUISchemaElement } from '../../../model/uischema';
import { createControl } from '../../../util/generators/uiSchema';
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
    handleChange(e: any) {
      console.log(e);
      if (e.added) {
        this.$store.dispatch('app/setSchema', {
          schema: {
            type: 'object',
            title: 'person',
            properties: {
              name: {
                type: 'string',
              },
            },
          },
        });
        const variable = 'textField';

        const property = e.added.element.uiSchemaElementProvider();
        console.log(property);

        this.$store.dispatch('app/setSchemaProperty', {
          property,
          variable,
        });
        // this.schema['properties'] = [];
        // this.schema.properties.push({
        //   name: varName,
        //   value: {
        //     type: 'primitive',
        //     schema: {
        //       type: 'string',
        //       minLength: 3,
        //     },
        //     uuid: '8d108d5a-5226-4020-adeb-85a64653726e',
        //     parent: '63a708f4-45d0-4bfc-9188-9ba756db63bd',
        //     linkedUISchemaElements: ['b71cb99e-1012-46b4-b8c4-65e247f483ef'],
        //   },
        // });

        // if (e.added.element.element && e.added.element.element.uuid) {
        //   const provider: EditorUISchemaElement = createControl(
        //     e.added.element.element,
        //     e.added.element.uiSchemaType
        //   );
        //   this.$store.dispatch('app/setUiSchema', { uiSchema: provider });
        // } else {

        // this.$store.dispatch('app/setSchema', { schema: provider });
        // this.$store.dispatch('app/setUiSchema', { uiSchema: provider });
        // }
      }
    },
  },
};
</script>
