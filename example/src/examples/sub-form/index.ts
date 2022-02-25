import schema from './schema.json';
import uischema from './uischema.json';
import data from './data.json';
import { JsonSchema, UISchemaElement } from '@jsonforms/core';

import subFormSchema from './subForm/subForm.json';
import subFormSchemaUI from './subForm/subformuischema.json';
import $RefParser from '@apidevtools/json-schema-ref-parser';

const schemaResolver = {
  order: 1,
  canRead: function (file: { url: string | string[] }) {
    return file.url.indexOf('subForm/subForm.json') !== -1;
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
    definitions: schemaResolver,
  },
};

const schemaUIResolver = {
  order: 1,
  canRead: function (file: { url: string | string[] }) {
    return file.url.indexOf('subForm/subformuischema.json') !== -1;
  },
  read: function () {
    return JSON.stringify(subFormSchemaUI);
  },
};
const refUIParserOptions = {
  dereference: {
    circular: false,
  },
  resolve: {
    definitions: schemaUIResolver,
  },
};

const getSchema = async (): Promise<any> => {
  const [newSchema] = await Promise.all([
    $RefParser.dereference(schema, refParserOptions),
    $RefParser.dereference(uischema, refUIParserOptions),
  ]);
  return newSchema;
};

const newSchema: any = getSchema().then((response) => response);

export const input: {
  schema: JsonSchema;
  uischema: UISchemaElement;
  data: any;
} = { newSchema, uischema, data };
