
import _ from 'lodash';
import { scope, pathControlSchema } from './../../utils/scope';
const mutations = {
    SET_SCOPE_RULES: (state: any, payload: any) => {
        const clone = _.cloneDeep(state.editor.uiSchema);
        scope(clone, (obj: any, key: string, value: any) => {
            if (key == 'scope' && pathControlSchema(value) == payload.scope) {
                obj.rule = payload.rule;
            }
        });
        state.editor.uiSchema = clone;
    },
};
export default mutations;
