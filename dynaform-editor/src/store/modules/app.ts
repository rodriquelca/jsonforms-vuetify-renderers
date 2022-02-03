// Pathify
import { CategorizationService } from '@/api/categorizationService';
import { make } from 'vuex-pathify';
import { AppState } from './types';
import { RootState } from '../types';
import { ActionTree, Module, MutationTree } from 'vuex';
import { createAjv, extendedVuetifyRenderers } from '@jsonforms/vue2-vuetify';
import { DefaultPaletteService } from '@/api/paletteService';
const ajv = createAjv({ useDefaults: true });
import { withCloneTree, withCloneTrees } from '@/util/clone';
import {
  findByUUID,
  getRoot,
  isUUIDError,
  linkElements,
  linkSchemas,
  UUIDError,
} from '@/util/schemasUtil';
import { buildSchemaTree, SchemaElement } from '@/model/schema';
import {
  cleanUiSchemaLinks,
  EditorLayout,
  EditorUISchemaElement,
} from '@/model/uischema';

/** Removes the given UI element from its tree.
 *  If a SchemaElement is provided, the element to remove will be cleaned up from all linkedUISchemaElements fields in the schema.
 */
const removeUiElement = (
  elementToRemove: EditorUISchemaElement,
  schema?: SchemaElement,
  categorizationService?: CategorizationService
): true | UUIDError => {
  // remove links to UI element in the schema (if any)
  if (schema && elementToRemove.linkedSchemaElement) {
    const uuidToRemove = elementToRemove.uuid;
    if (!uuidToRemove) {
      return { id: 'noUUIDError', element: elementToRemove };
    }
    const schemaRoot = getRoot(schema);
    const linkedSchemaElement: SchemaElement = findByUUID(
      schemaRoot,
      elementToRemove.linkedSchemaElement
    );
    if (!isUUIDError(linkedSchemaElement)) {
      linkedSchemaElement.linkedUISchemaElements?.delete(uuidToRemove);
    }
  }

  // remove from parent
  if (elementToRemove.parent) {
    // - case: Layout
    if ((elementToRemove.parent as EditorLayout).elements) {
      const index = (elementToRemove.parent as EditorLayout).elements.indexOf(
        elementToRemove
      );
      if (index !== -1) {
        (elementToRemove.parent as EditorLayout).elements.splice(index, 1);
      }
    }
    // - case: element with detail
    if (elementToRemove.parent.options?.detail === elementToRemove) {
      delete elementToRemove.parent.options.detail;
      if (Object.keys(elementToRemove.parent.options).length === 0) {
        delete elementToRemove.parent.options;
      }
    }

    // TODO other cases
  }

  // - case: categorization/category element
  if (
    elementToRemove.type === 'Categorization' ||
    elementToRemove.type === 'Category'
  ) {
    // release the map entry memory
    categorizationService?.removeElement(elementToRemove);
  }

  return true;
};

const createUnscopedUiSchema = (state: AppState, payload: any) => {
  return withCloneTree(
    state.editor.uiSchema,
    payload.layoutUUID,
    state.editor.uiSchema,
    (newUiSchema) => {
      const newUIElement = payload.uiSchemaElement;
      newUIElement.parent = newUiSchema;
      (newUiSchema as EditorLayout).elements.splice(
        payload.index,
        0,
        newUIElement
      );
      // state.editor.uiSchema = getRoot(newUiSchema as EditorUISchemaElement);;
      return getRoot(newUiSchema as EditorUISchemaElement);
    }
  );
};

const state: AppState = {
  editor: {
    paletteElements: [],
    uiSchema: undefined,
    schema: undefined,
  },
  jsonforms: {
    readonly: false,
    validationMode: 'ValidateAndShow',
    config: {
      restrict: true,
      trim: false,
      showUnfocusedDescription: false,
      hideRequiredAsterisk: true,
    },
    renderers: extendedVuetifyRenderers,
    cells: extendedVuetifyRenderers,
    ajv,
    locale: 'en',
  },
  monaco: {
    schemaModel: undefined,
    uischemaModel: undefined,
    dataModel: undefined,
  },
};
// make all mutations
const mutations: MutationTree<AppState> = {
  ...make.mutations(state),
  SET_UI_SCHEMA: (state, value) => {
    state.editor.uiSchema = value;
  },
  SET_PALLETE_ELEMENTS: (state, value) =>
    (state.editor.paletteElements = value),
  REMOVE_UISCHEMA_ELEMENT: (state, elementUUID) => {
    const clone: any = withCloneTrees(
      state.editor.uiSchema,
      elementUUID,
      state.editor.schema,
      undefined,
      state,
      (elementToRemove, newSchema) => {
        if (!elementToRemove) {
          console.error('Could not remove ui element ', elementToRemove);
          return state;
        }
        const removeResult = removeUiElement(elementToRemove, newSchema);
        if (isUUIDError(removeResult)) {
          console.error('Could not remove ui element ', removeResult);
          return state;
        }
        // check whether the element to remove was the root element
        const uiSchemaToReturn = elementToRemove.parent
          ? getRoot(elementToRemove)
          : undefined;
        return {
          schema: newSchema,
          uiSchema: uiSchemaToReturn,
        };
      }
    );
    state.editor.uiSchema = clone.uiSchema;
  },
  ADD_UNSCOPED_ELEMENT_TO_LAYOUT: (state, payload) => {
    const clone = withCloneTree(
      state.editor.uiSchema,
      payload.layoutUUID,
      state.editor.uiSchema,
      (newUiSchema) => {
        const newUIElement = payload.uiSchemaElement;
        newUIElement.parent = newUiSchema;
        (newUiSchema as EditorLayout).elements.splice(
          payload.index,
          0,
          newUIElement
        );
        return getRoot(newUiSchema as EditorUISchemaElement);
      }
    );
    state.editor.uiSchema = clone;
  },
  ADD_SCOPED_ELEMENT_TO_LAYOUT: (state, payload) => {
    const clone: any = withCloneTrees(
      state.editor.uiSchema,
      payload.layoutUUID,
      state.editor.schema,
      payload.schemaUUID,
      state,
      (newUiSchema, newSchema) => {
        const newUIElement = payload.uiSchemaElement;
        // newUIElement.parent = newUiSchema;
        (newUiSchema as EditorLayout).elements.splice(
          payload.index,
          0,
          newUIElement
        );

        if (!newSchema || !linkElements(newUIElement, newSchema)) {
          console.error('Could not add new UI element', newUIElement);
          return state;
        }

        return {
          schema: getRoot(newSchema),
          uiSchema: getRoot(newUiSchema),
        };
      }
    );
    state.editor.uiSchema = clone.uiSchema;
  },
  SET_SCHEMA: (state, payload) => {
    const clone = withCloneTree(
      state.editor.uiSchema,
      undefined,
      state,
      (clonedUiSchema) => {
        return linkSchemas(
          buildSchemaTree(payload),
          cleanUiSchemaLinks(clonedUiSchema)
        );
      }
    );
    state.editor.schema = clone.schema;
  },
};

// const actions = make.actions(state);
const actions: ActionTree<AppState, RootState> = {
  // automatically create only `setItems()` action
  ...make.actions(state),

  // manually add load items action
  getPaletteElements({ commit }) {
    const paletteService = new DefaultPaletteService();
    const palleteElements = paletteService.getPaletteElements();
    commit('SET_PALLETE_ELEMENTS', palleteElements);
  },
  removeUiSchemaElement({ commit }, payload) {
    commit('REMOVE_UISCHEMA_ELEMENT', payload);
  },
  addScopedElementToLayout({ commit }, payload) {
    commit('ADD_SCOPED_ELEMENT_TO_LAYOUT', payload);
  },
  addUnscopedElementToLayout({ commit, state }, payload) {
    const clone = createUnscopedUiSchema(state, payload);
    commit('SET_UI_SCHEMA', clone);
    // commit ('ADD_UNSCOPED_ELEMENT_TO_LAYOUT', payload);
  },
  setSchema({ commit }, payload) {
    commit('SET_SCHEMA', payload);
  },
  setUiSchema({ commit }, payload) {
    commit('SET_UI_SCHEMA', payload);
  },
};

const getters = {};

const app: Module<AppState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

export default app;
