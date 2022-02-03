import PropertiesPanel from './PropertiesPanel.vue';

import {extendedVuetifyRenderers } from '@jsonforms/vue2-vuetify';


export default PropertiesPanel;
export * from './schemaDecorators';
export * from './schemaProviders';

export const defaultPropertyRenderers = [
    ...extendedVuetifyRenderers
  ];
  