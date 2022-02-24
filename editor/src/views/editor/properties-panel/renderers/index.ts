
import {extendedVuetifyRenderers } from '@jsonforms/vue2-vuetify';
import { JsonFormsRendererRegistryEntry } from '@jsonforms/core';
import  {RulesControlRenderer}  from './RulesControlRenderer.vue';
export const extendedEditorPropertiesRenderers: JsonFormsRendererRegistryEntry[] = [
  ...extendedVuetifyRenderers,
  RulesControlRenderer,
  ];