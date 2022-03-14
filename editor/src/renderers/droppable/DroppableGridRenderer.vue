<template>
  <v-card elevation="2">
    <v-card-title :class="styles.group.label"> test: </v-card-title>
    <v-card-text :class="styles.horizontalLayout.item">
      <v-container class grey lighten-5>
        <v-row no-gutters>
          <draggable
            :class="draggableClass"
            :value="[]"
            group="people"
            @change="handleChange"
            :key="'draggable' + uischema.uuid"
            :sort="true"
            :disabled="!enabledDrag"
            ghost-class="ghost"
            @start="dragging = true"
            @end="dragging = false"
          >
            <v-col
              v-for="(element, index) in uischema.elements"
              :key="`${useJsonForm.layout.value.path}-${index}`"
              no-gutters
              :class="{ 'not-draggable': !enabled }"
            >
              <dispatch-renderer
                :key="element.uuid"
                :schema="useJsonForm.layout.value.schema"
                :uischema="element"
                :path="useJsonForm.layout.value.path"
                :enabled="useJsonForm.layout.value.enabled"
                :renderers="customRenderers"
                :cells="useJsonForm.layout.value.cells"
              />
            </v-col>
          </draggable>
          <!-- </div> -->
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { sync } from 'vuex-pathify';
import { Uri } from 'monaco-editor/esm/vs/editor/editor.api';
import { buildSchemaTree } from '../../model/schema';
import { getMonacoModelForUri } from '@/core/jsonSchemaValidation';
import { useExportUiSchema } from '../../util';
import draggable from 'vuedraggable';
import {
  Layout,
  JsonFormsRendererRegistryEntry,
  rankWith,
  and,
  isObjectArrayControl,
  optionIs,
  ControlElement,
} from '@jsonforms/core';
import { defineComponent } from '@vue/composition-api';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsArrayControl,
  useJsonFormsLayout,
  RendererProps,
  UnknownRenderer,
} from '@jsonforms/vue2';
import { useVuetifyArrayControl, useVuetifyLayout } from '@jsonforms/vue2-vuetify';
import {
  VCard,
  VCardTitle,
  VCardText,
  VContainer,
  VRow,
  VCol,
} from 'vuetify/lib';
import { entry as droppableHorizontalLayoutRenderer } from './DroppableHorizontalLayoutRegistration.vue';
//import { createControl, tryFindByUUID } from '@util';
import { entry as DroppableElementRegistration } from './DroppableElement.vue';
import { tryFindByUUID } from '../../util/schemasUtil';
import { createControl } from '../../util/generators/uiSchema';
const controlRenderer = defineComponent({
  name: 'droppable-grid-renderer',
  components: {
    DispatchRenderer,
    VCard,
    VCardTitle,
    VCardText,
    VContainer,
    VRow,
    VCol,
    draggable,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  computed: {
    determinedRenderer(): any {
      const renderer = droppableHorizontalLayoutRenderer;
      console.log(renderer);
      if (renderer === undefined) {
        return UnknownRenderer;
      } else {
        return renderer.renderer;
      }
    },
    draggableClass(): string {
      return 'dragArea row ' + this.styles.horizontalLayout.item;
    },
    customRenderers(): Array<any> {
      debugger;
      console.log(this.renderer);
      return (
        this.renderers && [...this.renderers, DroppableElementRegistration]
      );
    },
    editorUiSchemaModel: sync('app/editor@uiSchema'),
  },
  setup(props: RendererProps<ControlElement>) {
    //console.log(useVuetifyArrayControl(useJsonFormsArrayControl(props)),);
    return {
      ...useVuetifyArrayControl(useJsonFormsArrayControl(props)),
      useJsonForm: useVuetifyArrayControl(useJsonFormsArrayControl(props)),
      page: 1,
      enabledDrag: true,
      dragging: false,
    };
  },
  methods: {
    handleChange(evt) {
      debugger;
      if (evt.added) {
        if (evt.added.element && evt.added.element.type === 'Control') {
          //here update the schema
          const property = evt.added.element.uiSchemaElementProvider();
          const newElement = buildSchemaTree(property.control);
          this.$store.dispatch('app/addPropertyToGrid', {
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
          this.$store.dispatch('app/addElementToGrid', {
            uiSchemaElement: newUIElement,
            layoutUUID: this.uischema.uuid,
            index: evt.added.newIndex,
            schemaUUID: 0,
            schemaElement,
          });
        }
      }
      if (evt.moved) {
        this.updateItemIndex(evt.moved);
      }
    },
    /**
     * Update Index in uischema
     */
    updateItemIndex(item: any) {
      const auxElement = this.uischema.elements.splice(item.oldIndex, 1);
      this.uischema.elements.splice(item.newIndex, 0, auxElement[0]);
      this.setEditorUiSchema(this.editorUiSchemaModel);
    },
    /**
     * Update uiSchema in app/editor
     */
    setEditorUiSchema(schemaModel): void {
      const modelUri = Uri.parse('json://core/specification/uischema.json');
      getMonacoModelForUri(
        modelUri,
        JSON.stringify(useExportUiSchema(schemaModel), null, 2)
      );
    },
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(
    46,
    and(isObjectArrayControl, optionIs('extendedType', 'grid'))
  ),
};
</script>
