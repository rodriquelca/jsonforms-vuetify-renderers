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

export const ItemsDecorator: PropertySchemasDecorator = (
  schemas: PropertySchemas,
  uiElement: EditorUISchemaElement
) => {
  if (
    ['Control', 'Dropdown', 'RadioGroup', 'CheckboxGroup', 'Suggest'].includes(
      uiElement?.type
    )
  ) {
    if (!schemas.schema.properties) {
      schemas.schema.properties = {};
    }
    assign(schemas.schema.properties, {
      options: {},
    });

    (schemas.uiSchema as Layout).elements.push(
      createPropertyControl('#/properties/items')
    );
  }
  return schemas;
};

export const OnChangeDecorator: PropertySchemasDecorator = (
  schemas: PropertySchemas,
  uiElement: EditorUISchemaElement
) => {
  if (
    ['Control', 'Dropdown', 'RadioGroup', 'CheckboxGroup', 'Suggest'].includes(
      uiElement?.type
    )
  ) {
    if (!schemas.schema.properties) {
      schemas.schema.properties = {};
    }
    assign(schemas.schema.properties, {
      options: {
        events: {
          onChange: {
            arguments: '',
            body: '',
          },
        },
      },
    });

    (schemas.uiSchema as Layout).elements.push(
      createPropertyControl('#/properties/onchange')
    );
  }
  return schemas;
};

export const variableDecorator: PropertySchemasDecorator = (
  schemas: PropertySchemas,
  uiElement: EditorUISchemaElement
) => {
  if (['Control', 'Dropdown'].includes(uiElement?.type)) {
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
  if (['Control', 'Dropdown'].includes(uiElement?.type)) {
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
  if (['Control', 'Dropdown'].includes(uiElement?.type)) {
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
      'Dropdown',
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
  if (
    ['Control', 'Dropdown'].includes(uiElement?.type) &&
    uiElement.options?.suggest
  ) {
    addSchemaOptionsProperty(schemas.schema, {
      url: { type: 'string' },
    });

    (schemas.uiSchema as Layout).elements.push(
      createPropertyControl('#/properties/options/properties/url')
    );
  }
  return schemas;
};

export const minDateDecorator: PropertySchemasDecorator = (
  schemas: PropertySchemas,
  uiElement: EditorUISchemaElement
) => {
  if (['Control'].includes(uiElement?.type)) {
    if (!schemas.schema.properties) {
      schemas.schema.properties = {};
    }
    assign(schemas.schema.properties, {
      minDate: { type: 'string', format: 'date' },
    });

    (schemas.uiSchema as Layout).elements.push(
      createPropertyControl('#/properties/minDate')
    );
  }
  return schemas;
};
export const maxDateDecorator: PropertySchemasDecorator = (
  schemas: PropertySchemas,
  uiElement: EditorUISchemaElement
) => {
  if (['Control'].includes(uiElement?.type)) {
    if (!schemas.schema.properties) {
      schemas.schema.properties = {};
    }
    assign(schemas.schema.properties, {
      maxDate: { type: 'string', format: 'date' },
    });

    (schemas.uiSchema as Layout).elements.push(
      createPropertyControl('#/properties/maxDate')
    );
  }
  return schemas;
};
export const defaultDateDecorator: PropertySchemasDecorator = (
  schemas: PropertySchemas,
  uiElement: EditorUISchemaElement
) => {
  if (['Control'].includes(uiElement?.type)) {
    if (!schemas.schema.properties) {
      schemas.schema.properties = {};
    }
    assign(schemas.schema.properties, {
      defaultDate: { type: 'string', format: 'date' },
    });

    (schemas.uiSchema as Layout).elements.push(
      createPropertyControl('#/properties/defaultDate')
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
  OnChangeDecorator,
  ItemsDecorator,
];

export const schemaVariableDecorators: PropertySchemasDecorator[] = [
  variableDecorator,
];

export const schemaRequiredDecorators: PropertySchemasDecorator[] = [
  requiredDecorator,
  readOnlyDecorator,
];

export const schemaDatePropertiesDecorators: PropertySchemasDecorator[] = [
  minDateDecorator,
  maxDateDecorator,
  defaultDateDecorator,
];
