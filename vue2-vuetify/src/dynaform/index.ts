export { default as SuggestControlRenderer } from './SuggestControlRenderer.vue';
export { default as DropdownControlRenderer } from './DropdownControlRenderer.vue';


import { entry as suggestControlRendererEntry } from './SuggestControlRenderer.vue';
import { entry as dropdownControlRendererEntry } from './DropdownControlRenderer.vue';

export const dynaformRenderers = [suggestControlRendererEntry, dropdownControlRendererEntry];
