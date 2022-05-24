import { assign } from 'lodash';
// Pathify
import { CategorizationService } from '../../api/categorizationService';
import { make, Payload } from 'vuex-pathify';
import { AppState } from './types';
import { RootState } from '../types';
import { Module } from 'vuex';
import { createAjv, extendedVuetifyRenderers } from '@jsonforms/vue2-vuetify';
import { DefaultPaletteService } from '../../api/paletteService';
const ajv = createAjv({ useDefaults: true });

import { withCloneTree, withCloneTrees } from '../../util/clone';
import {
  findByUUID,
  getRoot,
  isUUIDError,
  linkElements,
  linkSchemas,
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
import { v4 as uuid } from 'uuid';
import { unset } from 'lodash';
import { CollectionStore } from '@jsonforms/vue2';
import mutationsEditor from './editor/mutations';
import actionsEditor from './editor/actions';
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

const createScopedElementToTable = (state, payload) => {
  return withCloneTrees(
    state.editor.uiSchema,
    payload.layoutUUID,
    state.editor.schema,
    payload.schemaUUID,
    state,
    (newUiSchema, newSchema) => {
      const newUIElement = payload.uiSchemaElement;
      (newUiSchema as EditorLayout).options.detail.elements.splice(
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
      let counter = 0;
      for (const key of clonedSchema.properties.keys()) {
        if (key.includes(payload.indexOrProp)) {
          counter += 1;
        }
      }
      newElement.schema.i18n = `${payload.indexOrProp}_${counter}`;
      clonedSchema.properties?.set(
        `${payload.indexOrProp}_${counter}`,
        newElement
      );
      // return clonedSchema;
      return getRoot(clonedSchema as EditorUISchemaElement);
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
        linkedShemaElement.schema['i18n'] = payload.newVariable;
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
const updateSchemaRequired = (state, payload) => {
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
      return {
        schema: getRoot(newSchema),
        uiSchema: getRoot(newUiSchema),
      };
    }
  );
};
const updateSchemaReadOnly = (state, payload) => {
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
const updateSchemaMinDate = (state, payload) => {
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
      const linkedShemaElement: SchemaElement = findByUUID(
        newSchema,
        uiSchemaElement.linkedSchemaElement
      );
      assign(linkedShemaElement.schema, { minDate: payload.minDate });
      return {
        schema: getRoot(newSchema),
        uiSchema: getRoot(newUiSchema),
      };
    }
  );
};
const updateSchemaMaxDate = (state, payload) => {
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
      const linkedShemaElement: SchemaElement = findByUUID(
        newSchema,
        uiSchemaElement.linkedSchemaElement
      );
      assign(linkedShemaElement.schema, { maxDate: payload.maxDate });
      return {
        schema: getRoot(newSchema),
        uiSchema: getRoot(newUiSchema),
      };
    }
  );
};
const updateSchemaDefaultDate = (state, payload) => {
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
      const linkedShemaElement: SchemaElement = findByUUID(
        newSchema,
        uiSchemaElement.linkedSchemaElement
      );
      assign(linkedShemaElement.schema, { defaultDate: payload.defaultDate });
      return {
        schema: getRoot(newSchema),
        uiSchema: getRoot(newUiSchema),
      };
    }
  );
};
const updateSchemaElement = (state, payload) => {
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
      const linkedShemaElement: SchemaElement = findByUUID(
        newSchema,
        uiSchemaElement.linkedSchemaElement
      );
      assign(linkedShemaElement.schema, payload.changedProperties);
      return {
        schema: getRoot(newSchema),
        uiSchema: getRoot(newUiSchema),
      };
    }
  );
};
const duplicateElement = (state, payload) => {
  return withCloneTrees(
    state.editor.uiSchema,
    payload.parent.uuid,
    state.editor.schema,
    payload.linkedSchemaElement,
    state,
    (newUiSchema, newSchema) => {
      const variable = getVariableName(payload);
      let counter = 0;
      for (const key of newSchema.parent.properties.keys()) {
        if (key.includes(variable)) {
          counter += 1;
        }
      }
      const schemauuid = uuid();
      newSchema.schema.i18n = `${variable}_${counter}`;
      newSchema.parent.properties?.set(`${variable}_${counter}`, {
        options: newSchema.options,
        parent: newSchema.parent,
        schema: newSchema.schema,
        type: newSchema.type,
        uuid: schemauuid,
      });
      const shemaElement: SchemaElement = findByUUID(newSchema, schemauuid);
      const newUIElement = {
        options: payload.options,
        parent: newUiSchema,
        scope: `#${getScope(shemaElement)}`,
        type: payload.type,
        uuid: uuid(),
      };

      if (!shemaElement || !linkElements(newUIElement, shemaElement)) {
        console.error('Could not add new UI element', newUIElement);
        return state;
      }

      const index = _.findIndex(newUiSchema.elements, function (element) {
        return element.uuid === payload.uuid;
      });

      (newUiSchema as EditorLayout).elements.splice(index + 1, 0, newUIElement);
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
    element: {
      selected: '',
      edit: 0,
    },
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
  data: {},
  monaco: {
    schemaModel: undefined,
    uischemaModel: undefined,
    dataModel: undefined,
    dataVariables: undefined
  }
};
// make all mutations
const mutations = {
  ...make.mutations(state),
  ...CollectionStore.mutations,
  ...mutationsEditor,
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
        if (!elementToRemove || (elementToRemove && !elementToRemove.parent)) {
          console.error('Could not remove ui element ', elementToRemove);
          return state.editor;
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
  ...actionsEditor,
  // manually add load items action
  getPaletteElements({ commit }) {
    const paletteService = new DefaultPaletteService();
    const palleteElements = paletteService.getPaletteElements();
    commit('SET_PALLETE_ELEMENTS', palleteElements);
  },
  removeUiSchemaElement({ commit }, payload) {
    commit('REMOVE_UISCHEMA_ELEMENT', payload);
  },
  duplicateElement({ commit }, payload) {
    const clone = duplicateElement(state, payload);
    commit('SET_SCHEMA', clone.schema);
    commit('SET_UI_SCHEMA', clone.uiSchema);
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

  addScopedElementToTable({ commit, state }, payload) {
    const clone = createScopedElementToTable(state, payload);
    commit('SET_UI_SCHEMA', clone.uiSchema);
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
  updateSchemaRequired({ commit, state }, payload) {
    const clone = updateSchemaRequired(state, payload);
    commit('SET_SCHEMA', clone.schema);
  },
  updateSchemaReadOnly({ commit, state }, payload) {
    const clone = updateSchemaReadOnly(state, payload);
    commit('SET_SCHEMA', clone.schema);
  },
  updateSchemaMinDate({ commit, state }, payload) {
    const clone = updateSchemaMinDate(state, payload);
    commit('SET_SCHEMA', clone.schema);
  },
  updateSchemaMaxDate({ commit, state }, payload) {
    const clone = updateSchemaMaxDate(state, payload);
    commit('SET_SCHEMA', clone.schema);
  },
  updateSchemaDefaultDate({ commit, state }, payload) {
    const clone = updateSchemaDefaultDate(state, payload);
    commit('SET_SCHEMA', clone.schema);
  },
  updateUISchemaElementOption({ commit, state }, payload) {
    const clone = updateUISchemaElementOption(state, payload);
    commit('SET_UI_SCHEMA', clone);
  },
  updateSchemaElement({ commit, state }, payload) {
    const clone = updateSchemaElement(state, payload);
    commit('SET_SCHEMA', clone.schema);
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
