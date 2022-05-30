/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import _ from 'lodash';
const getters = {
  getSummaryThemes: (state: any) => {
    return _.map(state.themes, (value, key) => {
      return {
        name: value.name,
        light: value.light,
      };
    });
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getFontFamilyTheme: (state: any) => {
    let fontFamily = '';
    _.forEach(state.themes, (value) => {
      if (state.active === value.name) {
        fontFamily = value.fontFamily;
      }
    });
    return fontFamily;
  },
  getThemeSelected: (state: any) => {
    const defaultTheme = state.themes[0].light;
    let theme = {};
    const themes = _.cloneDeep(state.themes);
    let mergeLight;
    _.forEach(themes, (value) => {
      if (state.active === value.name) {
        mergeLight = _.merge(_.cloneDeep(defaultTheme), value.light);
        theme = {
          name: value.name,
          light: mergeLight,
          fontFamily: value.fontFamily,
        };
      }
    });
    return theme;
  },
  getPaddings: (state: any) => {
    return state.customForm.paddings;
  },
  getMargins: (state: any) => {
    return state.customForm.margins;
  },
  getBackground: (state: any) => {
    return state.customForm.background;
  },
  getBackgroundColor: (state: any) => {
    return state.customForm.backgroundColor;
  },
};
export default getters;
