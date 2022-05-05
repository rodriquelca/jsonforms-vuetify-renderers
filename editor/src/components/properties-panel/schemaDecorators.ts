import { ControlElement, JsonSchema, Layout } from '@jsonforms/core';
import { assign } from 'lodash';

import { SchemaElement } from '../../model';
import { EditorUISchemaElement } from '../../model/uischema';
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

export const inputMask: PropertySchemasDecorator = (
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
      mask: { type: 'string' },
    });
    (schemas.uiSchema as Layout).elements.push(
      createPropertyControl('#/properties/options/properties/mask')
    );
  }
  return schemas;
};

export const validationDecorator: PropertySchemasDecorator = (
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
      validation: { type: 'string' },
      validationMessage: { type: 'string' },
    });
    (schemas.uiSchema as Layout).elements.push(
      createPropertyControl('#/properties/options/properties/validation'),
      createPropertyControl('#/properties/options/properties/validationMessage')
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
      options: {
        type: 'object',
      },
      items: {
        type: 'object',
      },
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
  if (
    [
      'Control',
      'Dropdown',
      'RadioGroup',
      'CheckboxGroup',
      'Suggest',
      'DataTableControl',
    ].includes(uiElement?.type)
  ) {
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
export const minDateDecorator: PropertySchemasDecorator = (
  schemas: PropertySchemas,
  uiElement: EditorUISchemaElement,
  schemaElement?: SchemaElement
) => {
  if (
    ['Control'].includes(uiElement?.type) &&
    schemaElement?.schema.format === 'date'
  ) {
    if (!schemas.schema.properties) {
      schemas.schema.properties = {};
    }
    assign(schemas.schema.properties, {
      minDate: { type: 'string', format: schemaElement.schema.format },
    });

    (schemas.uiSchema as Layout).elements.push(
      createPropertyControl('#/properties/minDate')
    );
  }
  return schemas;
};
export const maxDateDecorator: PropertySchemasDecorator = (
  schemas: PropertySchemas,
  uiElement: EditorUISchemaElement,
  schemaElement?: SchemaElement
) => {
  if (
    ['Control'].includes(uiElement?.type) &&
    schemaElement?.schema.format === 'date'
  ) {
    if (!schemas.schema.properties) {
      schemas.schema.properties = {};
    }
    assign(schemas.schema.properties, {
      maxDate: { type: 'string', format: schemaElement.schema.format },
    });

    (schemas.uiSchema as Layout).elements.push(
      createPropertyControl('#/properties/maxDate')
    );
  }
  return schemas;
};
export const defaultDateDecorator: PropertySchemasDecorator = (
  schemas: PropertySchemas,
  uiElement: EditorUISchemaElement,
  schemaElement?: SchemaElement
) => {
  if (
    ['Control'].includes(uiElement?.type) &&
    schemaElement?.schema.format === 'date'
  ) {
    if (!schemas.schema.properties) {
      schemas.schema.properties = {};
    }
    assign(schemas.schema.properties, {
      defaultDate: { type: 'string', format: schemaElement.schema.format },
    });

    (schemas.uiSchema as Layout).elements.push(
      createPropertyControl('#/properties/defaultDate')
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
      'CheckboxGroup',
      'RadioGroup',
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

export const ruleEditorDecorator: PropertySchemasDecorator = (
  schemas: PropertySchemas
) => {
  assign(schemas.schema.properties, {
    effect: {
      type: 'string',
      default: 'Show',
      enum: ['SHOW', 'HIDE', 'ENABLE', 'DISABLE'],
    },
    allOrAny: {
      type: 'string',
      enum: ['allOf', 'anyOf'],
    },
    rules: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          field: {
            type: 'string',
            enum: ['foo', 'bar'],
          },
          condition: {
            type: 'string',
            enum: ['is', 'is not', 'less than', 'greather than'],
          },
          value: {
            type: 'string',
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
        label: '',
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
        scope: '#/descriptionDecorator/allOrAny',
        label: '',
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
    label: 'Rules',
  });

  return schemas;
};

export const uploadImageDecorator: PropertySchemasDecorator = (
  schemas: PropertySchemas,
  uiElement: EditorUISchemaElement
) => {
  if (['Image'].includes(uiElement?.type)) {
    addSchemaOptionsProperty(schemas.schema, {
      image: { type: 'string' },
    });
    (schemas.uiSchema as Layout).elements.push({
      type: 'File',
      scope: '#/properties/options/properties/image',
      label: 'Upload Image',
    });
  }
  return schemas;
};
export const widthDecorator: PropertySchemasDecorator = (
  schemas: PropertySchemas,
  uiElement: EditorUISchemaElement
) => {
  if (['Image'].includes(uiElement?.type)) {
    addSchemaOptionsProperty(schemas.schema, {
      width: { type: 'number' },
    });
    (schemas.uiSchema as Layout).elements.push({
      type: 'Control',
      scope: '#/properties/options/properties/width',
      label: 'Width',
    });
  }
  return schemas;
};
export const heightDecorator: PropertySchemasDecorator = (
  schemas: PropertySchemas,
  uiElement: EditorUISchemaElement
) => {
  if (['Image'].includes(uiElement?.type)) {
    addSchemaOptionsProperty(schemas.schema, {
      height: { type: 'number' },
    });
    (schemas.uiSchema as Layout).elements.push({
      type: 'Control',
      scope: '#/properties/options/properties/height',
      label: 'Height',
    });
  }
  return schemas;
};
export const toggleDecorator: PropertySchemasDecorator = (
  schemas: PropertySchemas,
  uiElement: EditorUISchemaElement,
  schemaElement?: SchemaElement
) => {
  if (
    ['Control'].includes(uiElement?.type) &&
    schemaElement?.schema.type === 'boolean'
  ) {
    addSchemaOptionsProperty(schemas.schema, {
      toggle: { type: 'boolean' },
    });
    (schemas.uiSchema as Layout).elements.push({
      type: 'Control',
      scope: '#/properties/options/properties/toggle',
      label: 'Toggle View',
    });
  }
  return schemas;
};
export const descriptionDecorator: PropertySchemasDecorator = (
  schemas: PropertySchemas,
  uiElement: EditorUISchemaElement
) => {
  if (['Control'].includes(uiElement?.type)) {
    assign(schemas.schema.properties, { description: { type: 'string' } });
    (schemas.uiSchema as Layout).elements.push({
      type: 'Control',
      scope: '#/properties/description',
      label: 'Description',
      options: {
        multi: true,
      },
    });
  }
  return schemas;
};

export const maxLengthDecorator: PropertySchemasDecorator = (
  schemas: PropertySchemas,
  uiElement: EditorUISchemaElement,
  schemaElement?: SchemaElement
) => {
  if (schemaElement?.schema.type === 'string') {
    assign(schemas.schema.properties, { maxLength: { type: 'integer' } });
    (schemas.uiSchema as Layout).elements.push({
      type: 'Control',
      scope: '#/properties/maxLength',
      label: 'Max Length',
    });
  }
  return schemas;
};

export const trimDecorator: PropertySchemasDecorator = (
  schemas: PropertySchemas,
  uiElement: EditorUISchemaElement,
  schemaElement?: SchemaElement
) => {
  if (
    ['Control'].includes(uiElement?.type) &&
    schemaElement?.schema.type === 'string'
  ) {
    addSchemaOptionsProperty(schemas.schema, {
      trim: { type: 'boolean' },
    });
    (schemas.uiSchema as Layout).elements.push({
      type: 'Control',
      scope: '#/properties/options/properties/trim',
      label: 'Trim Text',
    });
  }
  return schemas;
};
export const restrictDecorator: PropertySchemasDecorator = (
  schemas: PropertySchemas,
  uiElement: EditorUISchemaElement,
  schemaElement?: SchemaElement
) => {
  if (
    ['Control'].includes(uiElement?.type) &&
    schemaElement?.schema.type === 'string'
  ) {
    addSchemaOptionsProperty(schemas.schema, {
      restrict: { type: 'boolean' },
    });
    (schemas.uiSchema as Layout).elements.push({
      type: 'Control',
      scope: '#/properties/options/properties/restrict',
      label: 'Restrict to Max Length',
    });
  }
  return schemas;
};

export const perPageDecorator: PropertySchemasDecorator = (
  schemas: PropertySchemas,
  uiElement: EditorUISchemaElement,
  schemaElement?: SchemaElement
) => {
  if (['DataTableControl'].includes(uiElement?.type)) {
    addSchemaOptionsProperty(schemas.schema, {
      perPage: {
        type: 'integer',
        enum: [5, 10, 15, 20, 50, 100],
      },
    });
    (schemas.uiSchema as Layout).elements.push({
      type: 'Control',
      scope: '#/properties/options/properties/perPage',
    });
  }
  return schemas;
};
export const placeholderDecorator: PropertySchemasDecorator = (
  schemas: PropertySchemas,
  uiElement: EditorUISchemaElement,
  schemaElement?: SchemaElement
) => {
  if (
    ['Control'].includes(uiElement?.type) &&
    schemaElement?.schema.type === 'string'
  ) {
    addSchemaOptionsProperty(schemas.schema, {
      placeholder: { type: 'string' },
    });
    (schemas.uiSchema as Layout).elements.push({
      type: 'Control',
      scope: '#/properties/options/properties/placeholder',
    });
  }
  return schemas;
};
export const textTransformToDecorator: PropertySchemasDecorator = (
  schemas: PropertySchemas,
  uiElement: EditorUISchemaElement,
  schemaElement?: SchemaElement
) => {
  if (
    ['Control'].includes(uiElement?.type) &&
    schemaElement?.schema.type === 'string'
  ) {
    addSchemaOptionsProperty(schemas.schema, {
      textTransformTo: {
        type: 'string',
        enum: [
          'none',
          'lowercase',
          'UPPERCASE',
          'Capital phrase',
          'Title Case',
        ],
      },
    });
    (schemas.uiSchema as Layout).elements.push({
      type: 'Control',
      scope: '#/properties/options/properties/textTransformTo',
    });
  }
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
  inputMask,
  labelUIElementDecorator,
  urlDecorator,
  OnChangeDecorator,
  ItemsDecorator,
];

export const defaultSchemaDecoratorsCollection = new Map<
  string,
  PropertySchemasDecorator[]
>([
  [
    'general',
    [
      variableDecorator,
      placeholderDecorator,
      labelDecorator,
      descriptionDecorator,
      textTransformToDecorator,
      requiredDecorator,
      readOnlyDecorator,
      multilineStringOptionDecorator,
      validationDecorator,
      inputMask,
      minDateDecorator,
      maxDateDecorator,
      defaultDateDecorator,
      uploadImageDecorator,
      widthDecorator,
      heightDecorator,
      toggleDecorator,
      maxLengthDecorator,
      trimDecorator,
      restrictDecorator,
      perPageDecorator,
    ],
  ],
  ['rulesEditor', [ruleEditorDecorator]],
  ['rulesAdvanced', [ruleDecorator]],
  ['advanced', [OnChangeDecorator, ItemsDecorator]],
]);
