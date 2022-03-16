// Pathify
import { make } from 'vuex-pathify';
import { AppState } from './types';
import { RootState } from '../types';
import { Module } from 'vuex';
import { createAjv, extendedVuetifyRenderers } from '@jsonforms/vue2-vuetify';
import { CollectionStore } from '@jsonforms/vue2';

const ajv = createAjv({ useDefaults: true });

// Data
const state: AppState = {
  drawer: null,
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
  uischemaModel: {},
  schemaModel: {},
};

const mutations = {
  ...make.mutations(state),
  ...CollectionStore.mutations,
};

const actions = {
  ...make.actions(state),
  ...CollectionStore.actions,
};

const getters = { ...CollectionStore.getters };

const app: Module<AppState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

export default app;
