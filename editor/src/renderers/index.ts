import { extendedVuetifyRenderers } from '@jsonforms/vue2-vuetify';

import { droppableRenderers } from './droppable';

import { entry as htmlViewerControlRendererEntry } from './HtmlViewerControlRenderer.vue';

export const defaultEditorRenderers = [
  ...extendedVuetifyRenderers,
  ...droppableRenderers,
  htmlViewerControlRendererEntry,
];
