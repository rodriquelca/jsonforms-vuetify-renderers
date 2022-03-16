import { assign, remove } from 'lodash';
// Pathify

import { CategorizationService } from '../../api/categorizationService';
import { make, Payload } from 'vuex-pathify';
import { AppState } from './types';
import { RootState } from '../types';
import { Module } from 'vuex';
import { createAjv, extendedVuetifyRenderers } from '@jsonforms/vue2-vuetify';
import {
  DefaultPaletteService,
  PaletteService,
} from '../../api/paletteService';
import { createControl } from '../../util/generators/uiSchema';
const ajv = createAjv({ useDefaults: true });

import { withCloneTree, withCloneTrees } from '../../util/clone';
import {
  findByUUID,
  getRoot,
  isEditorControl,
  isEditorLayout,
  isUUIDError,
  linkElements,
  linkSchemas,
  traverse,
  UUIDError,
} from '../../util/schemasUtil';
import {
  buildSchemaTree,
  cleanLinkedElements,
  SchemaElement,
  getScope,
} from '../../model/schema';
import {
  buildEditorUiSchemaTree,
  cleanUiSchemaLinks,
  EditorLayout,
  EditorUISchemaElement,
  getVariableName,
} from '../../model/uischema';

import { CollectionStore } from '@jsonforms/vue2';
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

const createSchema = (state, payload) => {
  return withCloneTree(
    state.editor.schema,
    undefined,
    state.editor,
    (clonedSchema) => {
      return linkSchemas(
        buildSchemaTree(payload.schema),
        cleanUiSchemaLinks(clonedSchema)
      );
    }
  );
};

const createUiSchema = (state, payload) => {
  return withCloneTree(
    state.editor.schema,
    undefined,
    state.editor,
    (clonedSchema) => {
      return linkSchemas(
        cleanLinkedElements(clonedSchema),
        buildEditorUiSchemaTree(payload.uiSchema)
      );
    }
  );
};
const createUnscopedUiSchema = (state, payload) => {
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
const createScopedElementToLayout = (state, payload) => {
  return withCloneTrees(
    state.editor.uiSchema,
    payload.layoutUUID,
    state.editor.schema,
    payload.schemaUUID,
    state,
    (newUiSchema, newSchema) => {
      const newUIElement = payload.uiSchemaElement;
      newUIElement.parent = newUiSchema;
      (newUiSchema as EditorLayout).elements.splice(
        payload.index,
        0,
        newUIElement
      );

      if (!newSchema || !linkElements(newUIElement, payload.schemaElement)) {
        console.error('Could not add new UI element', newUIElement);
        return state;
      }

      return {
        schema: getRoot(newSchema),
        uiSchema: getRoot(newUiSchema),
      };
    }
  );
};

const addPropertyToSchema = (state, payload) => {
  return withCloneTree(
    state.editor.schema,
    payload.elementUUID,
    state.editor,
    (clonedSchema) => {
      const newElement = payload.schemaElement;
      newElement.parent = clonedSchema;
      clonedSchema.properties?.set(`${payload.indexOrProp}`, newElement);
      return clonedSchema;
    }
  );
};
const updateUISchemaElement = (state, payload) => {
  return withCloneTree(
    state.editor.uiSchema,
    payload.elementUUID,
    state.editor.uiSchema,
    (newUiSchema) => {
      // options.detail is not part of the editable properties
      const optionsDetail = newUiSchema.options?.detail;
      assign(newUiSchema, payload.changedProperties);
      if (optionsDetail && !newUiSchema.options?.detail) {
        newUiSchema.options = newUiSchema.options || {};
        newUiSchema.options.detail = optionsDetail;
      }
      return getRoot(newUiSchema as EditorUISchemaElement);
    }
  );
};
const updateUISchemaElementOption = (state, payload) => {
  return withCloneTree(
    state.editor.uiSchema,
    payload.elementUUID,
    state.editor.uiSchema,
    (newUiSchema) => {
      newUiSchema.options = newUiSchema.options || {};
      assign(newUiSchema.options, payload.changedProperties);
      return getRoot(newUiSchema as EditorUISchemaElement);
    }
  );
};

const updateSchemaVariable = (state, payload) => {
  return withCloneTrees(
    state.editor.uiSchema,
    undefined,
    state.editor.schema,
    undefined,
    state,
    (newUiSchema, newSchema) => {
      const uiSchemaElement: SchemaElement = findByUUID(
        newUiSchema,
        payload.elementUUID
      );
      const oldVariable = getVariableName(uiSchemaElement);
      if (uiSchemaElement && oldVariable !== payload.newVariable) {
        const linkedShemaElement: SchemaElement = findByUUID(
          newSchema,
          uiSchemaElement.linkedSchemaElement
        );
        if (
          linkedShemaElement &&
          linkedShemaElement.parent &&
          linkedShemaElement.parent.properties
        ) {
          linkedShemaElement.parent.properties.delete(oldVariable);
          linkedShemaElement.parent.properties.set(
            `${payload.newVariable}`,
            linkedShemaElement
          );
        }
        uiSchemaElement.scope = `#${getScope(linkedShemaElement)}`;
      }
      return {
        schema: getRoot(newSchema),
        uiSchema: getRoot(newUiSchema),
      };
    }
  );
};
const updateSchemaProperties = (state, payload) => {
  return withCloneTrees(
    state.editor.uiSchema,
    undefined,
    state.editor.schema,
    undefined,
    state,
    (newUiSchema, newSchema) => {
      const uiSchemaElement: SchemaElement = findByUUID(
        newUiSchema,
        payload.elementUUID
      );
      const currentVariable = getVariableName(uiSchemaElement);
      // require procedure
      newSchema.schema.required = newSchema.schema.required
        ? newSchema.schema.required
        : [];
      if (payload.required) {
        if (!newSchema.schema.required.includes(currentVariable)) {
          newSchema.schema.required.push(currentVariable);
        }
      } else {
        const index = newSchema.schema.required.indexOf(currentVariable);
        if (index !== -1) {
          newSchema.schema.required.splice(index, 1);
        }
      }
      //readOnly
      const linkedShemaElement: SchemaElement = findByUUID(
        newSchema,
        uiSchemaElement.linkedSchemaElement
      );
      assign(linkedShemaElement.schema, { readOnly: payload.readOnly });
      return {
        schema: getRoot(newSchema),
        uiSchema: getRoot(newUiSchema),
      };
    }
  );
};

const state: AppState = {
  editor: {
    paletteElements: [],
    uiSchema: undefined,
    schema: undefined,
    settings: false,
    selectedElement: '',
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
    dataVariables: undefined,
  },
  data: {},
  schemaModel: {},
  uischemaModel: {},
};
// make all mutations
const mutations = {
  ...make.mutations(state),
  ...CollectionStore.mutations,
  SET_SCHEMA: (state, value) => {
    state.editor.schema = value;
  },
  SET_UI_SCHEMA: (state, value) => {
    state.editor.uiSchema = value;
  },
  SET_PALLETE_ELEMENTS: (state, value) =>
    (state.editor.paletteElements = value),
  REMOVE_UISCHEMA_ELEMENT: (state, elementUUID) => {
    const clone = withCloneTrees(
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
        const removeResult = removeUiElement(
          elementToRemove,
          newSchema,
          state.categorizationService
        );
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
};
// const actions = make.actions(state);
const actions = {
  // automatically create only `setItems()` action
  ...make.actions(state),
  ...CollectionStore.actions,
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
    const clone = createScopedElementToLayout(state, payload);
    commit('SET_UI_SCHEMA', clone.uiSchema);
  },
  addPropertyToSchema({ commit }, payload) {
    const clone = addPropertyToSchema(state, payload);
    commit('SET_SCHEMA', clone);
  },

  addUnscopedElementToLayout({ commit, state }, payload) {
    const clone = createUnscopedUiSchema(state, payload);
    commit('SET_UI_SCHEMA', clone);
  },
  setSchema({ commit }, payload) {
    const clone = createSchema(state, payload);
    commit('SET_SCHEMA', clone.schema);
  },
  setUiSchema({ commit }, payload) {
    const clone = createUiSchema(state, payload);
    commit('SET_UI_SCHEMA', clone.uiSchema);
  },
  updateUISchemaElement({ commit, state }, payload) {
    const clone = updateUISchemaElement(state, payload);
    commit('SET_UI_SCHEMA', clone);
  },
  updateSchemaVariable({ commit, state }, payload) {
    const clone = updateSchemaVariable(state, payload);
    commit('SET_SCHEMA', clone.schema);
    commit('SET_UI_SCHEMA', clone.uiSchema);
  },
  updateSchemaProperties({ commit, state }, payload) {
    const clone = updateSchemaProperties(state, payload);
    commit('SET_SCHEMA', clone.schema);
    commit('SET_UI_SCHEMA', clone.uiSchema);
  },
  updateUISchemaElementOption({ commit, state }, payload) {
    const clone = updateUISchemaElementOption(state, payload);
    commit('SET_UI_SCHEMA', clone);
  },
};

const getters = {
  ...CollectionStore.getters,
};

const app: Module<AppState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

export default app;
