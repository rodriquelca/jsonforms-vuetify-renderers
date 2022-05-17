import { RootState } from '@/store/types';
import { Module } from 'vuex';
import { make } from 'vuex-pathify';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';

export interface ViewManagerState {
  menuBar: any;
  sideBar: any;
  statusBar: any;
  activityBar: any;
  sidePanel: any;
  mainPanel: any;
  actionsBar: any;
}

const state: ViewManagerState = {
  // Menu Up
  menuBar: {},
  // Menu left
  activityBar: {
    active: 0,
    items: [
      {
        id: 'activity-pallete',
        title: 'Pallete Panel',
        icon: 'mdi-view-dashboard',
      },
      {
        id: 'activity-properties',
        title: 'Properties Panel',
        icon: 'mdi-pencil',
      },
      {
        id: 'activity-preview',
        title: 'Preview',
        icon: 'mdi-eye',
      },
      {
        id: 'activity-translations',
        title: 'Translation',
        icon: 'mdi-translate',
      },
    ],
  },
  //Panel bottom
  statusBar: {},
  // Panel properties
  sideBar: {
    active: 0,
    items: [
      {
        id: 'side-bar-pallete',
        component: 'pallete-panel',
      },
      {
        id: 'side-bar-properties',
        component: 'properties-panel',
      },
      {
        id: 'side-bar-translations',
        component: 'side-bar-i18n',
      },
      {
        id: 'side-bar-preview',
        component: 'side-bar-preview',
      },
    ],
  },
  sidePanel: {
    component: 'div',
  },
  mainPanel: {
    active: 0,
    items: [
      {
        id: 'main-editor',
        component: 'dynaform-editor',
        data: {},
      },
      {
        id: 'main-translations',
        component: 'main-panel-i18n',
        data: {
          locale: 'en',
        },
      },
      {
        id: 'main-preview',
        component: 'main-panel-dynaform-preview',
        data: {},
      },
    ],
  },
  actionsBar: {
    active: 0,
    items: [
      {
        id: 'actions-editor',
        component: 'actions-bar-editor',
        data: {},
      },
    ],
  },
};

const viewManager: Module<ViewManagerState, RootState> = {
  namespaced: true,
  state,
  ...{
    mutations: {
      ...make.mutations(state),
      ...mutations,
    },
  },
  ...{
    actions: {
      ...make.actions(state),
      ...actions,
    },
  },
  ...{
    getters: {
      ...make.getters(state),
      ...getters,
    },
  },
};

export default viewManager;
