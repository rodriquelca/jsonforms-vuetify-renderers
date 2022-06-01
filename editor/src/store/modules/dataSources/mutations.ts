import _ from 'lodash';
const mutations = {
  ADD_SIMPLE_LIST: (state: any, payload: any) => {
    state.lists.push(payload);
  },
  SET_SIMPLE_LISTS: (state: any, payload: any) => {
    state.lists = payload;
  },
};
export default mutations;
