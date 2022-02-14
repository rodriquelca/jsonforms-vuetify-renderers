
import {extendedVuetifyRenderers } from '@jsonforms/vue2-vuetify';
import  {entry as SuggestControlRenderer}  from './SuggestControlRenderer.vue';
import  {entry as MultipleFileControlRenderer}  from './MultipleFileControlRenderer.vue';
import  {entry as StringControlRenderer}  from './StringControlRenderer.vue';

export const extendedDynaformRenderers = [
  ...extendedVuetifyRenderers,
  SuggestControlRenderer,
  MultipleFileControlRenderer,
  StringControlRenderer
];
