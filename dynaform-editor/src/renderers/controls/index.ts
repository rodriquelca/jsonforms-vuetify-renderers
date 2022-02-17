
export { default as StringControlRenderer } from './StringControlRenderer.vue';
export { default as SuggestControlRenderer } from './SuggestControlRenderer.vue';


import { entry as stringControlRenderer } from './StringControlRenderer.vue';
import { entry as suggestControlRenderer } from './SuggestControlRenderer.vue';

export const controlRenderers = [
  stringControlRenderer
];
