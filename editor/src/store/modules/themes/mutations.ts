import _ from 'lodash';
const mutations = {
  SET_ADD_THEME: (state: any, payload: any) => {
    state.themes.push(payload);
  },
  SET_ACTIVE_THEME: (state: any, payload: string) => {
    state.active = payload;
  },
  SET_UPDATE_THEME: (state: any, payload: any) => {
    const themes = _.cloneDeep(state.themes);
    let customTheme = false;
    _.forEach(themes, (value, key) => {
      if (value.name === payload.name) {
        customTheme = true;
        state.active = payload.name;
        state.themes[key].light = payload.light;
        state.themes[key].fontFamily = payload.fontFamily;
      }
    });
    if (!customTheme) {
      state.themes.push(payload);
      state.active = payload.name;
    }
  },
};
export default mutations;
