
import _ from 'lodash';
const mutations = {
    ADD_PROPERTY: (state: any, payload: any) => {
        _.map(state, (value, key) => {
            value["content"][payload.property] = {
                label: null,
                description: null
            }
        });
    },
    ADD_LANGUAGE: (state: any, payload: any) => {
        state[payload.key] = payload;
    },
    UPDATE_PROPERTY: (state: any, payload: any) => {
        _.map(state, (value, key) => {
            _.map(value.content, (val, property, obj) => {
                if (property == payload.oldProperty) {
                    obj[payload.newProperty] = obj[payload.oldProperty];
                    delete obj[payload.oldProperty];
                }
            });
        });
    }
};
export default mutations;
