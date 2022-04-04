<template>
  <v-card outlined :class="selectedStyle">
    <v-row
      @mouseover="hover = true"
      @mouseleave="hover = false"
      @click="onClick"
    >
      <v-col>
        <Icon :type="wrappedElement.type" class="px-4" />

        <p class="d-inline caption" v-if="ruleEffect">
          <span class="font-weight-bold">R</span>
          <span class="font-italic"> ({{ ruleEffect }})</span>
        </p>

        <div class="d-inline caption">
          {{ wrappedElement.scope }}
        </div>
      </v-col>

      <v-col cols="1">
        <v-btn
          class="mx-2"
          fab
          right
          absolute
          x-small
          v-if="hover"
          @click="onRemove"
        >
          <v-icon> mdi-delete </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <slot></slot>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { PropType } from 'vue';
import {
  EditorUISchemaElement,
  getUISchemaPath,
  hasChildren,
} from '../model/uischema';
import Icon from './Icon.vue';
import { sync } from 'vuex-pathify';
export default {
  name: 'EditorElement',
  props: {
    wrappedElement: {
      required: false,
      type: Object as PropType<EditorUISchemaElement>,
    },
  },
  components: {
    Icon,
  },
  inject: ['setSelection'],
  data() {
    return {
      hover: false,
    };
  },
  computed: {
    ruleEffect() {
      return this.wrappedElement.rule?.effect.toLocaleUpperCase();
    },
    selectedElement: sync('app/editor@selectedElement'),
    selectedStyle() {
      return this.selectedElement === this.wrappedElement.uuid
        ? 'selected'
        : '';
    },
  },

  methods: {
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

    onClick: function () {
      console.log('AQUI');
      this.selected = true;
      this.$store.set('app/editor@settings', true);
      this.$store.set('app/editor@selectedElement', this.wrappedElement.uuid);
    },
  },
};
</script>
<style scoped>
.selected {
  border: 2px dashed rgba(1, 91, 7, 0.982);
  min-height: 80px;
}
</style>
