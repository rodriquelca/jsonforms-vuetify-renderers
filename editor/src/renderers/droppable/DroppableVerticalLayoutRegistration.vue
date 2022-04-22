<template>
  <div>
    <draggable
      :class="draggableClass"
      :list="[]"
      group="people"
      @change="handleChange"
      :sort="true"
      :disabled="!enabledDrag"
      ghost-class="ghost"
      @start="dragging = true"
      @end="dragging = false"
    >
      <v-row
        v-for="(element, index) in uischema.elements"
        :key="`${useJsonForm.layout.value.path}-${index}`"
        no-gutters
        :class="{ 'not-draggable': !enabled }"
      >
        <v-col cols="12" :class="useJsonForm.styles.verticalLayout.item">
          <dispatch-renderer
            :key="element.uuid"
            updateItemIndex
            :schema="useJsonForm.layout.value.schema"
            :uischema="element"
            :path="useJsonForm.layout.value.path"
            :enabled="useJsonForm.layout.value.enabled"
            :renderers="customRenderers"
            :cells="useJsonForm.layout.value.cells"
          />
        </v-col>
      </v-row>
    </draggable>
  </div>
</template>

<script lang="ts">
import { sync } from 'vuex-pathify';
import { Uri } from 'monaco-editor/esm/vs/editor/editor.api';
import { getMonacoModelForUri } from '@/core/jsonSchemaValidation';
import { useExportUiSchema } from '../../util';
import draggable from 'vuedraggable';
import {
  uiTypeIs,
  Layout,
  rankWith,
  JsonFormsRendererRegistryEntry,
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
import { createControl, tryFindByUUID } from '@/util';
import { buildSchemaTree } from '../../model/schema';
import _ from 'lodash';

const droppableRenderer = defineComponent({
  name: 'dropable-vertical-layout-renderer',
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
    return {
      useJsonForm: useVuetifyLayout(useJsonFormsLayout(props)),
      enabledDrag: true,
      dragging: false,
    };
  },
  computed: {
    draggableClass(): string {
      return 'dragArea list-group';
    },
    customRenderers(): Array<any> {
      return (
        this.renderers && [...this.renderers, DroppableElementRegistration]
      );
    },
    editorUiSchemaModel: sync('app/editor@uiSchema'),
  },
  methods: {
    handleChange(evt: any) {
      if (evt.added) {
        if (
          evt.added.element &&
          (evt.added.element.type === 'Control' ||
            evt.added.element.type === 'RadioGroup' ||
            evt.added.element.type === 'Suggest' ||
            evt.added.element.type === 'CheckboxGroup' ||
            evt.added.element.type === 'Dropdown' ||
            evt.added.element.type === 'Image' ||
            evt.added.element.type === 'GridControl' ||
            evt.added.element.type === 'DataTableControl' ||
            evt.added.element.type === 'File')
        ) {
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
          const element = this.findElementSchema(
            this.$store.get('app/editor@schema'),
            schemaElement
          );
          this.$store.dispatch('locales/addProperty', {
            property: element.key,
          });
          schemaElement.options = property.uiOptions;
          const newUIElement = createControl(
            schemaElement,
            evt.added.element.type
          );
          this.$store.dispatch('app/addScopedElementToLayout', {
            uiSchemaElement: newUIElement,
            layoutUUID: this.uischema.uuid,
            index: evt.added.newIndex,
            schemaUUID: evt.added.element.uuid,
            schemaElement,
          });
        } else {
          let provider = evt.added.element.uiSchemaElementProvider();
          this.$store.dispatch('app/addUnscopedElementToLayout', {
            uiSchemaElement: provider,
            layoutUUID: this.uischema.uuid,
            index: evt.added.newIndex,
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
    findElementSchema(schemaGlobal, schemaLocal) {
      let ele;
      for (const [key, value] of schemaGlobal.properties) {
        if (_.isEqual(value, schemaLocal)) {
          ele = {
            key: key,
            value: value,
          };
        }
      }
      return ele;
    },
  },
});

export default droppableRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: droppableRenderer,
  tester: rankWith(45, uiTypeIs('VerticalLayout')),
};
</script>
