<template>
  <v-card outlined :class="selectedStyle" @click="click">
    <div
      class="d-block"
      @mouseover.stop.prevent.self="hover = true"
      @mouseleave.self="hover = false"
    >
      <v-icon small>{{ computedIcon }}</v-icon>
      <span class="d-inline caption" v-if="ruleEffect">
        <span class="font-weight-bold">R</span>
        <span class="font-italic"> ({{ ruleEffect }})</span>
      </span>

      <div class="d-inline caption font-weight-bold v-opacity">
        {{ wrappedElement.scope ? wrappedElement.scope.split('/').pop() : '' }}
      </div>
      <v-tooltip top v-if="hover" :color="moveColor">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            fab
            x-small
            class="float-right"
            :color="moveColor"
            @mouseover="moveColor = 'teal lighten-2'"
            @mouseleave="moveColor = undefined"
          >
            <v-icon> mdi-arrow-all </v-icon>
          </v-btn>
        </template>
        <span>Move</span>
      </v-tooltip>
      <v-tooltip top v-if="hover" :color="removeColor">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            fab
            x-small
            v-if="hover"
            @click="onRemove"
            class="float-right"
            :color="removeColor"
            @mouseover="removeColor = 'red lighten-2'"
            @mouseleave="removeColor = undefined"
          >
            <v-icon> mdi-delete </v-icon>
          </v-btn>
        </template>
        <span>Delete</span>
      </v-tooltip>

      <v-tooltip top v-if="hover" :color="editColor">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            fab
            x-small
            @click="onEdit"
            class="float-right"
            :color="editColor"
            @mouseover="editColor = 'green lighten-2'"
            @mouseleave="editColor = undefined"
          >
            <v-icon> mdi-pencil-outline </v-icon>
          </v-btn>
        </template>
        <span>Edit</span>
      </v-tooltip>
      <v-tooltip top v-if="hover" :color="duplicateColor">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            v-on="on"
            fab
            x-small
            @click="onDuplicate"
            class="float-right"
            :color="duplicateColor"
            @mouseover="duplicateColor = 'brown lighten-2'"
            @mouseleave="duplicateColor = undefined"
          >
            <v-icon> mdi-content-copy </v-icon>
          </v-btn>
        </template>
        <span>Duplicate</span>
      </v-tooltip>
    </div>

    <div class="d-block pt-2">
      <slot></slot>
    </div>
  </v-card>
</template>

<script lang="ts">
import { PropType } from 'vue';
import _ from 'lodash';
import {
  EditorUISchemaElement,
  getUISchemaPath,
  hasChildren,
} from '../model/uischema';
import { sync } from 'vuex-pathify';
import { tryFindByUUID } from '@/util';
export default {
  name: 'EditorElement',
  props: {
    wrappedElement: {
      required: false,
      type: Object as PropType<EditorUISchemaElement>,
    },
  },
  data() {
    return {
      hover: false,
      editColor: undefined,
      removeColor: undefined,
      moveColor: undefined,
      duplicateColor: undefined,
    };
  },
  computed: {
    ruleEffect() {
      return this.wrappedElement.rule?.effect.toLocaleUpperCase();
    },
    activeElement: sync('app/editor@element'),
    editorSchema: sync('app/editor@schema'),
    computedIcon() {
      const schemaElement = tryFindByUUID(
        this.editorSchema,
        this.wrappedElement.linkedSchemaElement
      );
      switch (this.wrappedElement.type) {
        case 'HorizontalLayout':
          return 'mdi-arrow-left-right';
        case 'VerticalLayout':
          return 'mdi-arrow-up-down';
        case 'Group':
          return 'mdi-focus-field';
        case 'Categorization':
          return 'mdi-tab';
        case 'Label':
          return 'mdi-format-text';
        case 'Control':
          if (
            schemaElement &&
            schemaElement.schema &&
            schemaElement.schema.type === 'boolean'
          ) {
            return 'mdi-checkbox-outline';
          }
          if (
            schemaElement &&
            schemaElement.schema &&
            schemaElement.schema.format === 'date'
          ) {
            return 'mdi-calendar-month';
          }
          if (
            schemaElement &&
            schemaElement.schema &&
            schemaElement.schema.format === 'date-time'
          ) {
            return 'mdi-calendar-clock-outline';
          }
          if (
            schemaElement &&
            schemaElement.schema &&
            schemaElement.schema.format === 'time'
          ) {
            return 'mdi-clock-outline';
          }
          if (
            schemaElement &&
            schemaElement.schema &&
            schemaElement.schema.format == 'time'
          ) {
            return 'mdi-clock-outline';
          }
          if (
            this.wrappedElement &&
            this.wrappedElement.options &&
            this.wrappedElement.options.multipleFile
          ) {
            return 'mdi-cloud-upload-outline';
          }
          if (
            this.wrappedElement &&
            this.wrappedElement.options &&
            this.wrappedElement.options.multi
          ) {
            return 'mdi-format-pilcrow';
          }
          if (
            this.wrappedElement &&
            this.wrappedElement.options &&
            this.wrappedElement.options.isHtmlViewer
          ) {
            return 'mdi-pencil-ruler';
          }
          if (
            schemaElement &&
            schemaElement.schema &&
            schemaElement.schema.oneOf
          ) {
            return 'mdi-form-dropdown';
          }
          if (
            schemaElement &&
            schemaElement.schema &&
            schemaElement.schema.type === 'number'
          ) {
            return 'mdi-numeric';
          }
          if (
            schemaElement &&
            schemaElement.schema &&
            schemaElement.schema.type === 'integer'
          ) {
            return 'mdi-counter';
          }

          return 'mdi-crop-square';
        case 'Suggest':
          return 'mdi-text-box-search-outline';
        case 'RadioGroup':
          return 'mdi-radiobox-marked';
        case 'Dropdown':
          return 'mdi-form-dropdown';
        case 'CheckboxGroup':
          return 'mdi-checkbox-outline';
        case 'Image':
          return 'mdi-image-outline';
        case 'DataTableControl':
          return 'mdi-grid';

        default:
          return 'mdi-checkbox-blank-badge-outline';
      }
    },
    selectedStyle() {
      return this.activeElement.selected === this.wrappedElement.uuid
        ? 'selected pa-2'
        : 'pa-2 vpm-editor-element';
    },
  },
  watch: {
    activeElement() {
      if (this.activeElement.selected === this.wrappedElement.uuid) {
        this.hover = true;
      } else {
        this.hover = false;
      }
    },
  },

  methods: {
    onDuplicate: function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (
        !hasChildren(this.wrappedElement) &&
        this.wrappedElement.linkedSchemaElement
      ) {
        this.$store.dispatch('app/duplicateElement', this.wrappedElement);
      } //TODO Duplicated unescoped
    },
    onRemove: function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (!hasChildren(this.wrappedElement)) {
        this.$store.dispatch(
          'app/removeUiSchemaElement',
          this.wrappedElement.uuid
        );
      }
    },
    onEdit: function (e) {
      if (!hasChildren(this.wrappedElement)) {
        this.$store.set('app/editor@element', {
          selected: this.wrappedElement.uuid,
          edit: _.random(0, 100000),
        });
        this.hover = true;
      }
    },
    click: function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      let activityBar = { id: 'activity-properties' },
        sideBar = { id: 'side-bar-properties' },
        mainPanel: { id: 'main-editor' };
      this.$store.set('app/editor@element', {
        selected: this.wrappedElement.uuid,
      });
      this.hover = true;
      this.$store.dispatch('viewManager/setAllViews', {
        activityBar,
        sideBar,
        mainPanel,
      });
    },
  },
};
</script>
<style scoped>
.selected {
  border: 2px solid rgb(48 201 173 / 98%);
}
</style>
