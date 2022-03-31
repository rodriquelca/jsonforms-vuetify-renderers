export { default as AutocompleteEnumControlRenderer } from './AutocompleteEnumControlRenderer.vue';
export { default as AutocompleteOneOfEnumControlRenderer } from './AutocompleteOneOfEnumControlRenderer.vue';
export { default as RatingControlRenderer } from './RatingControlRenderer.vue';

import { entry as autocompleteEnumControlRendererEntry } from './AutocompleteEnumControlRenderer.vue';
import { entry as autocompleteOneOfEnumControlRendererEntry } from './AutocompleteOneOfEnumControlRenderer.vue';
import { entry as ratingControlRendererEntry } from './RatingControlRenderer.vue';

export const extendedRenderers = [
  autocompleteEnumControlRendererEntry,
  autocompleteOneOfEnumControlRendererEntry,
  ratingControlRendererEntry,
];
