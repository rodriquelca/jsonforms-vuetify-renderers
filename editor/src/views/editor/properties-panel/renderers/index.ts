import { extendedVuetifyRenderers } from '@jsonforms/vue2-vuetify';
import { JsonFormsRendererRegistryEntry } from '@jsonforms/core';
import { RulesControlRenderer } from './RulesControlRenderer.vue';
import { DeepChangeControlRenderer } from './DeepChangeControlRenderer.vue';
import { OnChangeControlRenderer } from './OnChangeControlRenderer.vue';
import { ItemsControlRenderer } from './ItemsControlRenderer.vue';
import { entry as arraControlRendererEntry } from './ArrayControlRenderer.vue';
import { entry as fileControlRendererEntry } from './FileControlRenderer.vue';
export const extendedEditorPropertiesRenderers: JsonFormsRendererRegistryEntry[] =
  [
    ...extendedVuetifyRenderers,
    RulesControlRenderer,
    DeepChangeControlRenderer,
    OnChangeControlRenderer,
    ItemsControlRenderer,
    arraControlRendererEntry,
    fileControlRendererEntry,
  ];
