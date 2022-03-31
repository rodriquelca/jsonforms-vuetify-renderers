const actions = {
    addProperty: ({ commit }: any, data: any) => {
        commit('ADD_PROPERTY', data);
    },
    addLanguage: ({ commit }: any, data: any) => {
        commit('ADD_LANGUAGE', data);
    },
    updateLanguage: ({ commit }: any, data: any) => {
        commit('ADD_LANGUAGE', data);
    },
    updateProperty: ({ commit }: any, data: any) => {
        commit('UPDATE_PROPERTY', data);
    },
};
export default actions;
