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
export const requiredDecorator: PropertySchemasDecorator = (
  schemas: PropertySchemas,
  uiElement: EditorUISchemaElement
) => {
  if (['Control'].includes(uiElement?.type)) {
    if (!schemas.schema.properties) {
      schemas.schema.properties = {};
    }
    assign(schemas.schema.properties, { required: { type: 'boolean' } });

    (schemas.uiSchema as Layout).elements.push(
      createPropertyControl('#/properties/required')
    );
  }
  return schemas;
};
export const readOnlyDecorator: PropertySchemasDecorator = (
  schemas: PropertySchemas,
  uiElement: EditorUISchemaElement
) => {
  if (['Control'].includes(uiElement?.type)) {
    if (!schemas.schema.properties) {
      schemas.schema.properties = {};
    }
    assign(schemas.schema.properties, { readOnly: { type: 'boolean' } });

    (schemas.uiSchema as Layout).elements.push(
      createPropertyControl('#/properties/readOnly')
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

export const ruleEditorDecorator: PropertySchemasDecorator = (
  schemas: PropertySchemas
) => {
  assign(schemas.schema.properties, {
    effect: {
      type: 'string',
      default: 'Show',
      enum: ['Show', 'Hide', 'Enable', 'Disable'],
    },
    allany: {
      type: 'string',
      enum: ['all', 'any'],
    },
    rules: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          field: {
            type: 'string',
            maxLength: 5,
            enum: ['foo', 'bar'],
          },
          condition: {
            type: 'string',
            maxLength: 5,
            enum: ['is'],
          },
          value: {
            type: 'string',
            enum: ['foo', 'bar'],
          },
        },
      },
    },
  });
  (schemas.uiSchema as Layout).elements.push({
    type: 'HorizontalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/effect',
      },
      {
        type: 'Label',
        text: 'this field when',
      },
    ],
  });
  (schemas.uiSchema as Layout).elements.push({
    type: 'HorizontalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/allany',
      },
      {
        type: 'Label',
        text: 'of the following rules match',
      },
    ],
  });
  (schemas.uiSchema as Layout).elements.push({
    type: 'Control',
    scope: '#/properties/rules',
    label: {
      text: 'Example Array',
      show: false,
    },
  });

  return schemas;
};

export const createPropertyControl = (
  controlScope: string
): ControlElement => ({
  type: 'Control',
  scope: controlScope,
});

const defaultDecoreators: PropertySchemasDecorator[] = [
  labelDecorator,
  multilineStringOptionDecorator,
  labelUIElementDecorator,
  urlDecorator,
  ruleDecorator,
];

// export const defaultSchemaDecoratorsCollection =new Map<string, PropertySchemasDecorator>(
//   "general", [
//     variableDecorator,
//     labelDecorator,
//     requiredDecorator,
//     readOnlyDecorator,
//   ]),
// };

export const defaultSchemaDecoratorsCollection = new Map<
  string,
  PropertySchemasDecorator[]
>([
  [
    'general',
    [variableDecorator, labelDecorator, requiredDecorator, readOnlyDecorator],
  ],
  ['rules', [ruleDecorator]],
  ['rulesEditor', [ruleEditorDecorator]],
]);
