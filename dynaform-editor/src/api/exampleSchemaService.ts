/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
import { SchemaService } from './schemaService';

const exampleSchema = {
  type: 'object',
  title: 'Person',
  properties: {
    checkbox: {
      type: "boolean"
    },
    name: {
      type: 'string',
      minLength: 3,
    },
    suggest: {
      type: 'string',
      minLength: 3
    },
    multiplefile: {
      type: "array",
      items: {
        name: {
          type: "string"
        },
        size: {
          type: "string"
        },
        mimetype: {
          "type": "string"
        }
      }
    },
    date: {
      type: 'string',
      format: 'date',
    },
    personalData: {
      type: 'object',
      properties: {
        age: {
          type: 'integer',
          description: 'Please enter your age.',
        },
        height: {
          type: 'number',
        },
        drivingSkill: {
          type: 'number',
          maximum: 10,
          minimum: 1,
          default: 7,
        },
      },
      required: ['age', 'height'],
    },
    friends: {
      type: 'array',
      items: {
        type: 'object',
        title: 'Friend',
        properties: {
          name: {
            type: 'string',
          },
          isClose: {
            type: 'boolean',
          },
        },
      },
    },
    nationality: {
      type: 'string',
      enum: ['DE', 'IT', 'JP', 'US', 'RU', 'Other'],
    },
    occupation: {
      type: 'string',
    },
  },
};

const exampleUischema = undefined;

export class ExampleSchemaService implements SchemaService {
  getSchema = async () => exampleSchema;
  getUiSchema = async () => exampleUischema;
}
