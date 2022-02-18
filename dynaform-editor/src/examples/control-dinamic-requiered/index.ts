import schema from './schema.json';
import uischema from './uischema.json';
import data from './data.json';
import { UISchemaElement, JsonSchema } from '@jsonforms/core';

export const input: {
  schema: JsonSchema;
  uischema: UISchemaElement | undefined;
  data: any;
} = { schema, uischema, data };
