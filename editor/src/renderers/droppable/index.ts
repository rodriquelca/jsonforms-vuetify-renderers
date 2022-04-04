import {
  JsonFormsRendererRegistryEntry,
  rankWith,
  isLayout,
} from '@jsonforms/core';

export { default as DroppableElement } from './DroppableElement.vue';
import { default as DroppableHorizontalLayoutRenderer } from './DroppableHorizontalLayoutRenderer.vue';
import { default as DroppableVerticalLayoutRegistration } from './DroppableVerticalLayoutRegistration.vue';

import { entry as droppableRenderer } from './DroppableElement.vue';
import { entry as droppableHorizontalLayoutRenderer } from './DroppableHorizontalLayoutRegistration.vue';
import { entry as droppableVerticalLayoutRenderer } from './DroppableVerticalLayoutRegistration.vue';
import { entry as droppableGroupRenderer } from './DroppableGroupRegistration.vue';
import { entry as droppableCategorizationRenderer } from './DroppableCategorizationRenderer.vue';
import { entry as DroppableCategoryRenderer } from './DroppableCategoryRenderer.vue';
import { entry as droppableGridRendererEntry } from './DroppableGridRenderer.vue';

export const droppableRenderers = [
  droppableRenderer,
  droppableHorizontalLayoutRenderer,
  droppableVerticalLayoutRenderer,
  droppableGroupRenderer,
  droppableCategorizationRenderer,
  DroppableCategoryRenderer,
  droppableGridRendererEntry
];
