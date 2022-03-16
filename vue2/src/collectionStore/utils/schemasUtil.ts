/**
 * ---------------------------------------------------------------------
 * Copyright (c) 2021 EclipseSource Munich
 * Licensed under MIT
 * https://github.com/eclipsesource/jsonforms-editor/blob/master/LICENSE
 * ---------------------------------------------------------------------
 */
//import { isControl, isLayout, UISchemaElement } from '@jsonforms/core';
//import { get } from 'lodash';
import {
  NoUUIDError,
  GetByUUIDError,
  UUIDError,
  Parentable,
} from '../interfaces';

export const isNoUUIDError = <T>(
  result: T | NoUUIDError
): result is NoUUIDError => (result as NoUUIDError)?.id === 'noUUIDError';

export const isGetByUUIDError = <T>(
  result: T | GetByUUIDError
): result is GetByUUIDError =>
  (result as GetByUUIDError)?.id === 'getByUUIDError';

export const isUUIDError = <T>(result: T | UUIDError): result is UUIDError =>
  isNoUUIDError(result) || isGetByUUIDError(result);

export const getRoot = <T extends Parentable<T>>(
  element: T | undefined
): T | undefined => {
  if (element?.parent) {
    return getRoot(element.parent);
  }
  return element;
};

export const findByUUID = (element: any, uuid: string): any => {
  const root = getRoot(element);
  const result = doFindByUUID(root, uuid);
  if (!result) {
    return {
      id: 'getByUUIDError',
      root: root,
      uuid: uuid,
    };
  }
  return result;
};

export const tryFindByUUID = <T>(
  element: T,
  uuid: string | undefined
): T | undefined => {
  if (!uuid || !element) return undefined;
  const findResult = findByUUID(element, uuid);
  return isUUIDError(findResult) ? undefined : findResult;
};

const doFindByUUID = (root: any, uuid: string): any | UUIDError => {
  if (!uuid) {
    return {
      id: 'noUUIDError',
    };
  }
  if (root && root.uuid === uuid) {
    return root;
  }
  if (!root) {
    return undefined;
  }
  const entries = root instanceof Map ? root.entries() : Object.entries(root);
  for (const [key, value] of Array.from(entries)) {
    if (value && value.uuid === uuid) {
      return value;
    }
    if (typeof value === 'object' && key !== 'parent') {
      const result = doFindByUUID(value, uuid);
      if (result) {
        return result;
      }
    }
    // some mappings are 'reversed'
    if (typeof key === 'object') {
      const result = doFindByUUID(key, uuid);
      if (result) {
        return result;
      }
    }
  }
  return undefined;
};

/*
const getSchemaElementFromScope = (
  schema: SchemaElement,
  scope: string
): SchemaElement | GetPathError | undefined => {
  const schemaRoot = getRoot(schema);
  const validSegment = (pathSegment: string) =>
    pathSegment !== '#' && pathSegment !== undefined && pathSegment !== '';
  const validPathSegments = scope.split('/').filter(validSegment);
  return getFromPath(schemaRoot, validPathSegments);
};
*/
