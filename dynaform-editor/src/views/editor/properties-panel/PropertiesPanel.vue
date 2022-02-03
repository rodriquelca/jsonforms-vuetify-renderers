<template>
  <v-container> Properties section </v-container>
</template>

<script lang="ts">
import { JsonFormsRendererRegistryEntry } from '@jsonforms/core';
import { PropType } from 'vue';
export default {
  name: 'PropertiesPanel',
  // inject:['propertiesService'],
  props:{
    propertyRenderers: {
      type: Array as PropType <JsonFormsRendererRegistryEntry[]>,
      default: () => undefined
    }
  },
  mounted () {
    console.log(this);
  }
};
</script>
