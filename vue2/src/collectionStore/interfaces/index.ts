export interface NoUUIDError {
  id: 'noUUIDError';
  element: any;
}
export interface GetByUUIDError {
  id: 'getByUUIDError';
  root: any;
  uuid: string;
}
export type UUIDError = GetByUUIDError | NoUUIDError;

export interface Parentable<T> {
  parent?: T;
}

export interface Identifiable {
  uuid: string;
}

export interface TreeElement<T> extends Parentable<T>, Identifiable {}

/**
 * Returns an array starting with the current element followed by its parents
 */
export const getHierarchy = <T extends Parentable<T>>(
  element: T | undefined
): T[] => (!element ? [] : [element, ...getHierarchy(element.parent)]);
