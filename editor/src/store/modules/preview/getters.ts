import _ from "lodash";
const getters = {
    getDataModel: (state: any) => (scope: string) => {
        return state.data[scope];
    },
};
export default getters;
