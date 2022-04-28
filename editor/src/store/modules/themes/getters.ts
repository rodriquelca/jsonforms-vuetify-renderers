import _ from 'lodash';
const getters = {
  getSummaryThemes: (state: any) => () => {
    return _.map(state.themes, (value, key) => {
      return {
        name: value.name,
        light: value.light,
      };
    });
  },
};
export default getters;
