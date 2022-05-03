import { JsonSchema, UISchemaElement } from '@jsonforms/core';
import { maxBy } from 'lodash';

import { SchemaElement } from '../../model';
import { EditorUISchemaElement } from '../../model/uischema';

export interface PropertiesService {
  getProperties(
    uiElement: any,
    schemaElement: any
  ): Map<string, PropertySchemas> | undefined;
}

/**
 * Schemas describing the properties view of an editor element.
 */
export interface PropertySchemas {
  schema: JsonSchema;
  uiSchema?: UISchemaElement;
}

/**
 * Decorator for the PropertySchemas of an EditorUISchemaElement.
 */
export interface PropertySchemasDecorator {
  (
    schemas: PropertySchemas,
    uiElement: EditorUISchemaElement,
    schemaElement?: SchemaElement
  ): PropertySchemas;
}

/**
 * Constant that indicates that a tester is not capable of handling
 * an EditorUISchemaElement.
 */
export const NOT_APPLICABLE = -1;

/**
 * Returns a PropertySchemas object for an EditorUISchemaElement. The tester will return a ranking
 * or NOT_APPLICABLE if the provider cannot supply any schema for the given editor element. */
export interface PropertySchemasProvider {
  tester: (uiElement: EditorUISchemaElement) => number;
  getPropertiesSchemas: (
    uiElement: EditorUISchemaElement,
    schemaElement?: SchemaElement
  ) => PropertySchemas;
}
export class PropertiesServiceImpl implements PropertiesService {
  constructor(
    private schemaProviders: PropertySchemasProvider[],
    private schemaDecoratorsCollection: Map<string, PropertySchemasDecorator[]>
  ) { }
  getProperties = (
    uiElement: EditorUISchemaElement,
    schemaElement: SchemaElement | undefined
  ): Map<string, PropertySchemas> | undefined => {
    const provider = maxBy(this.schemaProviders, (p) => p.tester(uiElement));
    if (!provider || provider.tester(uiElement) === NOT_APPLICABLE) {
      return undefined;
    }
    const schemaDecoratorsMapping = new Map<string, PropertySchemas>();
    for (const [key, value] of this.schemaDecoratorsCollection) {
      const elementSchemas = provider.getPropertiesSchemas(
        uiElement,
        schemaElement
      );
      if (!elementSchemas) {
        return undefined;
      }
      // log(`Map key is:${key} and value is:${value}`);
      schemaDecoratorsMapping.set(
        key,
        value.reduce(
          (schemas, decorator) => decorator(schemas, uiElement, schemaElement),
          elementSchemas
        )
      );
    }

    return schemaDecoratorsMapping;
  };
}
