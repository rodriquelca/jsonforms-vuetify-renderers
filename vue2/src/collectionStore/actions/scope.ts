const actions = {
  setScopeOptions: ({ commit }: any, data: any) => {
    commit('SET_SCOPE_OPTIONS', data);
  },
  setScopeOptionsE: ({ commit }: any, data: any) => {
    commit('SET_SCOPE_OPTIONS_E', data);
  },
};
export default actions;
