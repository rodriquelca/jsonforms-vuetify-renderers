import _ from 'lodash';
import { scope, pathControlSchema } from '../utils/scope';
const mutations = {
  SET_SCOPE_OPTIONS: (state: any, payload: any) => {
    const clone = _.cloneDeep(state.editor.uiSchema);
    scope(clone, (obj: any, key: string, value: any) => {
      if (key == 'scope' && pathControlSchema(value) == payload.scope) {
        obj.options.items = payload.items;
      }
    });
    state.editor.uischemaModel = clone;
  },
  SET_SCOPE_OPTIONS_E: (state: any, payload: any) => {
    const clone = _.cloneDeep(state.editor.uiSchema);
    scope(clone, (obj: any, key: string, value: any) => {
      if (key == 'scope' && pathControlSchema(value) == payload.scope) {
        obj.options = payload.items;
      }
    });
    state.editor.uiSchema = clone;
  },
};
export default mutations;
