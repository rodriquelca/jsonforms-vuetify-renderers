import _ from "lodash";
const getters = {
    getDataMainPanel: (state: any) => (id: string) => {
        return state.mainPanel.items[state.mainPanel.active]["data"];
    },
};
export default getters;
