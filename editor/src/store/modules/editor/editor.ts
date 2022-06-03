import { RootState } from '@/store/types';
import { Module } from 'vuex';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import { make } from 'vuex-pathify';

export interface EditorState {
    locale: string;
    data: any;
    uiSchema: any;
    schema: any;
}

const state: EditorState = {
    locale: 'en',
    data: {},
    uiSchema: {},
    schema: {},
};

const editor: Module<EditorState, RootState> = {
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

export default editor;
