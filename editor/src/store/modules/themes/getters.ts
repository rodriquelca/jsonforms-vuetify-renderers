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
};
export default getters;
