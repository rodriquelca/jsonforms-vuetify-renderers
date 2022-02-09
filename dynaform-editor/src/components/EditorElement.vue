<template>
  <v-card outlined>
    <v-row
      @mouseover="hover = true"
      @mouseleave="hover = false"
      @click="onClick"
    >
      <v-col>
        <Icon :type="wrappedElement.type" />
        <div class="d-inline caption" v-if="ruleEffect">
          R ({{ ruleEffect }})
        </div>
        <v-divider vertical></v-divider>
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
          <v-icon dark> mdi-delete </v-icon>
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
  },
  methods: {
    onRemove: function () {
      if (!hasChildren(this.wrappedElement)) {
        this.$store.dispatch(
          'app/removeUiSchemaElement',
          this.wrappedElement.uuid
        );
      }
    },
    onClick: function () {
      this.setSelection(this.wrappedElement.uuid);
    },
  },
};
</script>
