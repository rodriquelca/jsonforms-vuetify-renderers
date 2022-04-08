<template>
  <v-card v-if="control.visible" :class="styles.arrayList.root" elevation="0">
    <v-card-title>
      <v-toolbar flat :class="styles.arrayList.toolbar">
        <v-toolbar-title :class="styles.arrayList.label">
          Grid Label: {{ computedLabel }}</v-toolbar-title
        >
        <validation-icon
          v-if="control.childErrors.length > 0"
          :errors="control.childErrors"
        />
        <v-spacer></v-spacer>

        <v-tooltip bottom>
          <template v-slot:activator="{ on: onTooltip }">
            <v-btn
              fab
              text
              elevation="0"
              small
              :aria-label="`Add to ${control.label}`"
              v-on="onTooltip"
              :class="styles.arrayList.addButton"
              :disabled="
                !control.enabled ||
                (appliedOptions.restrict &&
                  arraySchema !== undefined &&
                  arraySchema.maxItems !== undefined &&
                  control.data.length >= arraySchema.maxItems)
              "
              @click="addButtonClick"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          {{ `Add to ${control.label}` }}
        </v-tooltip>
      </v-toolbar>
    </v-card-title>
    <v-card-text>
      <v-container justify-space-around align-content-center>
        <v-row justify="center">
          <!-- <v-simple-table class="array-container flex"> -->
          <!-- <thead v-if="control.schema.type === 'object'">
              <tr>
                <th
                  v-for="(prop, index) in getValidColumnProps(control.schema)"
                  :key="`${control.path}-header-${index}`"
                  scope="col"
                >
                  {{ title(prop) }}
                </th>
                <th
                  v-if="control.enabled"
                  :class="
                    appliedOptions.showSortButtons
                      ? 'fixed-cell'
                      : 'fixed-cell-small'
                  "
                  scope="col"
                ></th>
              </tr>
            </thead> -->
          <!-- <tbody>
              <draggable
                :value="[]"
                group="people"
                @change="handleChange"
                :key="'draggable' + uischema.uuid"
                :sort="true"
                :disabled="!enabledDrag"
                @start="dragging = true"
                @end="dragging = false"
                tag="tr"
              >
                <td
                  v-for="propName in getValidColumnProps(control.schema)"
                  :key="composePaths(composePaths(control.path, 0), propName)"
                > -->
          <dispatch-renderer
            :schema="control.schema"
            :uischema="foundUISchema"
            :path="composePaths(control.path, 0)"
            :enabled="control.enabled"
            :renderers="control.renderers"
            :cells="control.cells"
          />
          <!-- </td>
              </draggable>
            </tbody>
          </v-simple-table> -->
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import {
  isObjectArray,
  JsonFormsRendererRegistryEntry,
  and,
  rankWith,
  composePaths,
  createDefaultValue,
  ControlElement,
  JsonSchema,
  Resolve,
  findUISchema,
  UISchemaElement,
  uiTypeIs,
} from '@jsonforms/core';
import startCase from 'lodash/startCase';
import { defineComponent } from '../../util/vue';
import {
  DispatchCell,
  DispatchRenderer,
  rendererProps,
  useJsonFormsArrayControl,
  RendererProps,
} from '@jsonforms/vue2';
import { useVuetifyArrayControl } from '@jsonforms/vue2-vuetify';
import {
  VCard,
  VCardTitle,
  VCardText,
  VRow,
  VCol,
  VContainer,
  VToolbar,
  VToolbarTitle,
  VTooltip,
  VIcon,
  VBtn,
  VAvatar,
  VSpacer,
  VSimpleTable,
} from 'vuetify/lib';
import { buildSchemaTree } from '../../model/schema';
import draggable from 'vuedraggable';
import { sync } from 'vuex-pathify';

const controlRenderer = defineComponent({
  name: 'droppable-grid-control-renderer',
  components: {
    DispatchCell,
    DispatchRenderer,
    VCard,
    VCardTitle,
    VCardText,
    VAvatar,
    VRow,
    VCol,
    VToolbar,
    VToolbarTitle,
    VTooltip,
    VIcon,
    VBtn,
    VSpacer,
    VContainer,
    VSimpleTable,
    draggable,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    return {
      ...useVuetifyArrayControl(useJsonFormsArrayControl(props)),
      ...{ enabledDrag: true, dragging: false },
    };
  },
  computed: {
    noData(): boolean {
      return !this.control.data || this.control.data.length === 0;
    },
    foundUISchema(): UISchemaElement {
      debugger;
      return findUISchema(
        this.control.uischemas,
        this.control.schema,
        this.control.uischema.scope,
        this.control.path,
        undefined,
        this.control.uischema
      );
    },
    arraySchema(): JsonSchema | undefined {
      return Resolve.schema(
        this.control.rootSchema,
        this.control.uischema.scope,
        this.control.rootSchema
      );
    },
    editorUiSchemaModel: sync('app/editor@uiSchema'),
    editorSchemaModel: sync('app/editor@schema'),
  },
  methods: {
    composePaths,
    createDefaultValue,
    handleChange(evt) {
      if (evt.added) {
        console.log(evt.added);
        if (
          evt.added.element &&
          (evt.added.element.type === 'Control' ||
            evt.added.element.type === 'RadioGroup' ||
            evt.added.element.type === 'Suggest' ||
            evt.added.element.type === 'CheckboxGroup' ||
            evt.added.element.type === 'Dropdown' ||
            evt.added.element.type === 'Image' ||
            evt.added.element.type === 'GridControl' ||
            evt.added.element.type === 'File')
        ) {
          //here update the schema
          debugger;
          const property = evt.added.element.uiSchemaElementProvider();
          const newElement = buildSchemaTree(property.control);
          const parent = this.editorSchemaModel.properties.get(
            this.control.path
          );
          this.$store.dispatch('app/addPropertyToSchema', {
            schemaElement: newElement,
            elementUUID: parent.items.uuid,
            indexOrProp: property.variable,
          });
        }
      }
    },
    addButtonClick() {
      this.addItem(
        this.control.path,
        createDefaultValue(this.control.schema)
      )();
    },
    moveUpClick(event: Event, toMove: number): void {
      event.stopPropagation();
      this.moveUp?.(this.control.path, toMove)();
    },
    moveDownClick(event: Event, toMove: number): void {
      event.stopPropagation();
      this.moveDown?.(this.control.path, toMove)();
    },
    removeItemsClick(event: Event, toDelete: number[]): void {
      event.stopPropagation();
      this.removeItems?.(this.control.path, toDelete)();
    },
    getValidColumnProps(scopedSchema: JsonSchema) {
      if (
        scopedSchema.type === 'object' &&
        typeof scopedSchema.properties === 'object'
      ) {
        return Object.keys(scopedSchema.properties).filter(
          (prop) => scopedSchema.properties![prop].type !== 'array'
        );
      }
      // primitives
      return [''];
    },
    title(prop: string) {
      return this.control.schema.properties?.[prop]?.title ?? startCase(prop);
    },
    resolveUiSchema(propName: string) {
      return this.control.schema.properties
        ? this.controlWithoutLabel(`#/properties/${propName}`)
        : this.controlWithoutLabel('#');
    },
    controlWithoutLabel(scope: string): ControlElement {
      return { type: 'Control', scope: scope, label: false };
    },
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(4, and(isObjectArray, uiTypeIs('GridControl'))),
};
</script>

<style scoped>
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
