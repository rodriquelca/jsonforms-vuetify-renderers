const actions = {
  addSimpleList: ({ commit }: any, data: any) => {
    const dt = {
      id: data.id,
      name: data.name,
      type: 'list',
      schema: [
        {
          id: 'id',
          type: 'string',
          name: 'Id',
        },
        {
          id: 'value',
          type: 'string',
          name: 'Value',
        },
      ],
      data: [],
    };
    commit('ADD_SIMPLE_LIST', dt);
  },
  setSimpleLists: ({ commit }: any, data: any) => {
    commit('SET_SIMPLE_LISTS', data);
  },
};
export default actions;
