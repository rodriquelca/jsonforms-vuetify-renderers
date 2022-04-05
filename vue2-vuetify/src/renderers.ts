import { additionalRenderers } from './additional';
import { arrayRenderers } from './array';
import { complexRenderers } from './complex';
import { controlRenderers } from './controls';
import { extendedRenderers } from './extended';
import { layoutRenderers } from './layouts';
import { dynaformRenderers } from './dynaform';
import { editorRenderers } from './editor';
import { filesRenderers } from './files';
import { gridRenderers } from './grids';

export const vuetifyRenderers = [
  ...additionalRenderers,
  ...arrayRenderers,
  ...complexRenderers,
  ...controlRenderers,
  ...layoutRenderers,
];

export const extendedVuetifyRenderers = [
  ...extendedRenderers,
  ...vuetifyRenderers,
  ...dynaformRenderers,
  ...filesRenderers,
  ...gridRenderers,
];

export const extendedVuetifyRenderersEditor = [
  ...extendedRenderers,
  ...vuetifyRenderers,
  ...editorRenderers,
  ...filesRenderers,
  ...gridRenderers,
];
