
import {extendedVuetifyRenderers } from '@jsonforms/vue2-vuetify';
import { layoutRenderers } from './layouts';
import { controlRenderers } from './controls';
import { arrayRenderers } from './array';
import { complexRenderers } from './complex';
import { droppableRenderers } from './droppable';

export const dynaformRenderers = [
  ...controlRenderers,
  ...layoutRenderers,
  ...arrayRenderers,
  ...complexRenderers
];

export const extendedDynaformRenderers = [
  ...dynaformRenderers,
];
export const defaultEditorRenderers = [
  ...extendedDynaformRenderers,
  // ...droppableRenderers
];

// import {*} from "./controls"
// import { JsonFormsRendererRegistryEntry } from '@jsonforms/core';
// import  {DroppableHorizontalLayoutRegistration}  from './DroppableHorizontalLayoutRegistration.vue';
// import  {DroppableVerticalLayoutRegistration}  from './DroppableVerticalLayoutRegistration.vue';
// import {DroppableElementRegistration} from './DroppableElement.vue'
// export const defaultEditorRenderers: JsonFormsRendererRegistryEntry[] = [
//   ...extendedDynaformRenderers,
//     DroppableHorizontalLayoutRegistration,
//     DroppableVerticalLayoutRegistration,
//     DroppableElementRegistration
//   ];