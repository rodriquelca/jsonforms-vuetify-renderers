import { extendedVuetifyRenderers } from '@jsonforms/vue2-vuetify';

import { droppableRenderers } from './droppable';

export const defaultEditorRenderers = [
  ...extendedVuetifyRenderers,
  ...droppableRenderers,
];
