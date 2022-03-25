import schema from './schema.json';
import data from './data.json';
import { UISchemaElement, JsonSchema } from '@jsonforms/core';
import uischema from './uischema.json';
export const input: {
  schema: JsonSchema;
  uischema: UISchemaElement | undefined;
  data: any;
} = { schema, uischema, data };
