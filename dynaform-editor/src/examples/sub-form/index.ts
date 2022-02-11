import schema from './schema.json';
import uischema from './uischema.json';
import data from './data.json';
import { JsonSchema, UISchemaElement } from '@jsonforms/core';

import subFormSchema from './subForm.json';
import $RefParser from '@apidevtools/json-schema-ref-parser';

const yourRemoteSchemaResolver = {
  order: 1,
  canRead: function (file: { url: string | string[] }) {
    return file.url.indexOf('subForm.json') !== -1;
  },
  read: function () {
    return JSON.stringify(subFormSchema);
  },
};
const refParserOptions = {
  dereference: {
    circular: false,
  },
  resolve: {
    definitions: yourRemoteSchemaResolver,
  },
};

const getSchema = async (): Promise<any> =>
  await $RefParser.dereference(schema, refParserOptions);

const newSchema: any = getSchema().then((response) => response);

export const input: {
  newSchema: JsonSchema;
  uischema: UISchemaElement;
  data: any;
} = { newSchema, uischema, data };
