const actions = {
    setActiveActivityBar: ({ commit }: any, data: any) => {
        commit('SET_ACTIVE_ACTIVITY_BAR', data);
    },
    setDataMainPanel: ({ commit }: any, data: any) => {
        commit('SET_DATA_MAIN_PANEL', data);
    },
};
export default actions;
