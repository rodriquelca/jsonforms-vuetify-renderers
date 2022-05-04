import { RootState } from '@/store/types';
import { Module } from 'vuex';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import defaultThemes from './defaultThemes.json';

export interface ThemeState {
  themes: any;
}
const state: ThemeState = {
  themes: defaultThemes,
};
const themes: Module<ThemeState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

export default themes;
