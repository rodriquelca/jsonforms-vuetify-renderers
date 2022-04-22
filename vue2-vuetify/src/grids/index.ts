export { default as GridControlRenderer } from './GridControlRenderer.vue';
export { default as SimpleTableRenderer } from './SimpleTableRenderer.vue';
export { default as DataTableControlRenderer } from './DataTableControlRenderer.vue';

import { entry as gridControlRendererEntry } from './GridControlRenderer.vue';
import { entry as simpleTableRendererEntry } from './SimpleTableRenderer.vue';
import { entry as dataTableControlEntry } from './DataTableControlRenderer.vue';

export const gridRenderers = [gridControlRendererEntry, simpleTableRendererEntry, dataTableControlEntry];
