import { ControlElement, JsonSchema, Layout } from '@jsonforms/core';
import { assign } from 'lodash';

import { SchemaElement } from '../../../model';
import { EditorUISchemaElement } from '../../../model/uischema';
import { PropertySchemas, PropertySchemasDecorator } from './propertiesService';

export const multilineStringOptionDecorator: PropertySchemasDecorator = (
  schemas: PropertySchemas,
  uiElement: EditorUISchemaElement,
  schemaElement?: SchemaElement
) => {
  if (
    schemaElement?.schema.type === 'string' &&
    !schemaElement?.schema.format &&
    uiElement.type === 'Control'
  ) {
    addSchemaOptionsProperty(schemas.schema, {
      multi: { type: 'boolean' },
    });
    (schemas.uiSchema as Layout).elements.push(
      createPropertyControl('#/properties/options/properties/multi')
    );
  }
  return schemas;
};

export const labelUIElementDecorator: PropertySchemasDecorator = (
  schemas: PropertySchemas,
  uiElement: EditorUISchemaElement
) => {
  if (uiElement?.type === 'Label') {
    assign(schemas.schema.properties, { text: { type: 'string' } });

    (schemas.uiSchema as Layout).elements.push(
      createPropertyControl('#/properties/text')
    );
  }
  return schemas;
};

export const ruleDecorator: PropertySchemasDecorator = (
  schemas: PropertySchemas
) => {
  assign(schemas.schema.properties, {
    rule: {
      type: 'object',
    },
  });
  (schemas.uiSchema as Layout).elements.push(
    createPropertyControl('#/properties/rule')
  );
  return schemas;
};

export const variableDecorator: PropertySchemasDecorator = (
  schemas: PropertySchemas,
  uiElement: EditorUISchemaElement
) => {
  if (['Control'].includes(uiElement?.type)) {
    if (!schemas.schema.properties) {
      schemas.schema.properties = {};
    }
    assign(schemas.schema.properties, { variable: { type: 'string' } });

    (schemas.uiSchema as Layout).elements.push(
      createPropertyControl('#/properties/variable')
    );
  }
  return schemas;
};

export const labelDecorator: PropertySchemasDecorator = (
  schemas: PropertySchemas,
  uiElement: EditorUISchemaElement
) => {
  if (
    [
      'Group',
      'Control',
      'Suggest',
      'MultipleFile',
      'Categorization',
      'Category',
    ].includes(uiElement?.type)
  ) {
    if (!schemas.schema.properties) {
      schemas.schema.properties = {};
    }
    assign(schemas.schema.properties, { label: { type: 'string' } });

    (schemas.uiSchema as Layout).elements.push(
      createPropertyControl('#/properties/label')
    );
  }
  return schemas;
};

export const addSchemaOptionsProperty = (
  schema: JsonSchema,
  newOption: {
    [property: string]: JsonSchema;
  }
) => {
  if (!schema.properties) {
    schema.properties = {};
  }
  if (!schema.properties.options) {
    schema.properties.options = {
      type: 'object',
      properties: {},
    };
  }
  assign(schema.properties.options.properties, newOption);
};

export const urlDecorator: PropertySchemasDecorator = (
  schemas: PropertySchemas,
  uiElement: EditorUISchemaElement
) => {
  if (['Control'].includes(uiElement?.type) && uiElement.options?.suggest) {
    addSchemaOptionsProperty(schemas.schema, {
      url: { type: 'string' },
    });

    (schemas.uiSchema as Layout).elements.push(
      createPropertyControl('#/properties/options/properties/url')
    );
  }
  return schemas;
};

export const createPropertyControl = (
  controlScope: string
): ControlElement => ({
  type: 'Control',
  scope: controlScope,
});

export const defaultSchemaDecorators: PropertySchemasDecorator[] = [
  // variableDecorator,
  labelDecorator,
  multilineStringOptionDecorator,
  labelUIElementDecorator,
  urlDecorator,
  ruleDecorator,
];

export const schemaVariableDecorators: PropertySchemasDecorator[] = [
  variableDecorator,
];
