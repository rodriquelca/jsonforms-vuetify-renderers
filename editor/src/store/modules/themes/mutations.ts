import _ from 'lodash';
const mutations = {
  SET_ADD_THEME: (state: any, payload: any) => {
    state.themes.push(payload);
  },
  SET_ACTIVE_THEME: (state: any, payload: string) => {
    state.active = payload;
  },
};
export default mutations;
