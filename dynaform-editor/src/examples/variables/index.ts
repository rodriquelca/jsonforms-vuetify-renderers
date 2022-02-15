import schema from './schema.json';
import uischema from './uischema.json';
import data from './data.json';
import vars from './vars.json';
import { UISchemaElement, JsonSchema } from '@jsonforms/core';

export const input: {
  schema: JsonSchema;
  uischema: UISchemaElement;
  data: any;
  vars: any;
} = { schema, uischema, data, vars };
