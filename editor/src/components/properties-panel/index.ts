import PropertiesPanel from './PropertiesPanel.vue';

import { extendedEditorPropertiesRenderers } from './renderers';

export default PropertiesPanel;
export * from './schemaDecorators';
export * from './schemaProviders';

export const defaultPropertyRenderers = [...extendedEditorPropertiesRenderers];
