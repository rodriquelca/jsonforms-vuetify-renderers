import { extendedVuetifyRenderersEditor } from '@jsonforms/vue2-vuetify';

import { droppableRenderers } from './droppable';

import { entry as htmlViewerControlRendererEntry } from './HtmlViewerControlRenderer.vue';
import { entry as formControlRendererEntry } from './FormControlRenderer.vue';

export const defaultEditorRenderers = [
  ...extendedVuetifyRenderersEditor,
  ...droppableRenderers,
  htmlViewerControlRendererEntry,
  formControlRendererEntry,
];
