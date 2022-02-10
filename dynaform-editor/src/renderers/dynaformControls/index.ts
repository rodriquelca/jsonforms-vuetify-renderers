
import {extendedVuetifyRenderers } from '@jsonforms/vue2-vuetify';
import { JsonFormsRendererRegistryEntry } from '@jsonforms/core';
import  {SuggestControlRenderer}  from './SuggestControlRenderer.vue';
import  {MultipleFileControlRenderer}  from './MultipleFileControlRenderer.vue';
export const extendedDynaformRenderers: JsonFormsRendererRegistryEntry[] = [
  ...extendedVuetifyRenderers,
  SuggestControlRenderer,
  MultipleFileControlRenderer,
  ];