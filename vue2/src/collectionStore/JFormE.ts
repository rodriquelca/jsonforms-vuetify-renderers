import Vue from 'vue';
//Class JForm collection for helpers for New Dynaforms PM4
export default Vue.component('JFormE-Collection', {
  data() {
    let store: any;
    return {
      store,
    };
  },
  watch: {},
  methods: {
    setItems(scope: string, data: any) {
      this.store.dispatch('app/setScopeOptions', {
        scope: scope,
        items: data,
      });
    },
    setItemsE(scope: string, data: any) {
      this.store.dispatch('app/setScopeOptionsE', {
        scope: scope,
        items: data,
      });
    },
    setValue(scope: string, data: any) {
      this.store.set('app/data@' + scope, data);
    },
    setValueE(scope: string, data: any) {
      this.store.set('app/data@' + scope, data);
    },
    watchDataModel() {
      return new Function();
    },
  },
});
