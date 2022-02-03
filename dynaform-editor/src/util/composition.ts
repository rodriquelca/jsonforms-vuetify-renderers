import {
  JsonSchema,
  UISchemaElement,
  JsonFormsRendererRegistryEntry,
  JsonFormsCellRendererRegistryEntry,
} from '@jsonforms/core';
import { CompType } from './vue';

/**
 * Constructs a props declaration for Vue components which can be used
 * for registered renderers and cells. These are typically used in combination
 * with one of the provided bindings, e.g. 'useJsonFormsControl'.
 *
 * Use the generic type parameter when using a specialized binding, e.g.
 * `rendererProps<Layout>()` in combination with `useJsonFormsLayout` or
 * `rendererProps<ControlElement>()` in combination with `useJsonFormsControl`.
 */
export const editorRendererProps = <U = UISchemaElement>() => ({
  editorTabs: {
    required: false as false,
    type: Array,
  },
  schema: {
    required: true as true,
    type: [Object, Boolean] as CompType<
      JsonSchema,
      [ObjectConstructor, BooleanConstructor]
    >,
  },
  uischema: {
    required: true as true,
    type: [Object, Boolean] as CompType<U, [ObjectConstructor,BooleanConstructor]>,
  },
  selection: {
    required: false as false,
    type: String,
    default: undefined,
  },
  editorRenderers: {
    required: false,
    type: Array as CompType<JsonFormsRendererRegistryEntry[], ArrayConstructor>,
    default: undefined,
  },
  cells: {
    required: false,
    type: Array as CompType<
      JsonFormsCellRendererRegistryEntry[],
      ArrayConstructor
    >,
    default: undefined,
  },
});

export interface RendererProps<U = UISchemaElement> {
  schema: JsonSchema;
  uischema: U;
  path: string;
  enabled?: boolean;
  renderers?: JsonFormsRendererRegistryEntry[];
  cells?: JsonFormsCellRendererRegistryEntry[];
  selection?:string;
}
export const useJsonTest =  (props: RendererProps) => {
  const test = {
      direction: "row"

  };
  return test;
};