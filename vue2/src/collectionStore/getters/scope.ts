const getters = {
  getDataModel: (state: any) => (scope: string) => {
    return state.data[scope];
  },
  getScopesEditor: (state: any) => {
    return Array.from(state.editor.schema.properties.keys());
  },
};
export default getters;
