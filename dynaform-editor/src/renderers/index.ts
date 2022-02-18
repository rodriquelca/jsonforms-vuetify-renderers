
import {extendedVuetifyRenderers } from '@jsonforms/vue2-vuetify';
import { layoutRenderers } from './layouts';
import { controlRenderers } from './controls';
import { arrayRenderers } from './array';
import { complexRenderers } from './complex';
import { droppableRenderers } from './droppable';
import { fileRenderers } from './files';

export const dynaformRenderers = [
  ...controlRenderers,
  ...layoutRenderers,
  ...arrayRenderers,
  ...complexRenderers,
  ...fileRenderers
];

export const extendedDynaformRenderers = [
  ...dynaformRenderers,
];
export const defaultEditorRenderers = [
  ...extendedDynaformRenderers,
  ...droppableRenderers
];
