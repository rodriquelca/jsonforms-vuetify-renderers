import _ from 'lodash';
const mutations = {
  SET_ADD_THEME: (state: any, payload: any) => {
    state.themes.push(payload);
  },
};
export default mutations;
