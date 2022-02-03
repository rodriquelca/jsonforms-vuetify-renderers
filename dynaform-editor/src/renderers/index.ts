
// import {extendedVuetifyRenderers } from '@jsonforms/vue2-vuetify';
import {extendedDynaformRenderers} from "./dynaformControls"
import { JsonFormsRendererRegistryEntry } from '@jsonforms/core';
import  {DroppableHorizontalLayoutRegistration}  from './DroppableHorizontalLayoutRegistration.vue';
import  {DroppableVerticalLayoutRegistration}  from './DroppableVerticalLayoutRegistration.vue';
import {DroppableElementRegistration} from './DroppableElement.vue'
export const defaultEditorRenderers: JsonFormsRendererRegistryEntry[] = [
  ...extendedDynaformRenderers,
    DroppableHorizontalLayoutRegistration,
    DroppableVerticalLayoutRegistration,
    DroppableElementRegistration
  ];