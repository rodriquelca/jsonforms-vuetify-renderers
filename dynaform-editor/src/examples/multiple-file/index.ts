import schema from './schema.json';
import uischema from './uischema.json';
import data from './data.json';
import { UISchemaElement, JsonSchema } from '@jsonforms/core';
console.log(data);
export const input: {
  schema: JsonSchema;
  uischema: UISchemaElement;
  data: any;
} = { schema, uischema, data };
