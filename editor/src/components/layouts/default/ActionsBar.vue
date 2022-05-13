<template>
  <v-card no-gutters height="100%" width="100%">
    <component v-bind:is="itemsActionsBar[activeActionsBar]['component']" />
  </v-card>
</template>

<script lang="ts">
import { sync } from 'vuex-pathify';
import ActionsBarEditor from './../../DynaformEditor/ActionsBarEditor.vue';
export default {
  name: 'ActionsBar',
  props: {},
  components: { ActionsBarEditor },
  data() {
    return {
      data: {},
    };
  },
  computed: {
    itemsActionsBar: sync('viewManager/actionsBar.items'),
    activeActionsBar: sync('viewManager/actionsBar.active'),
  },
  methods: {},
};
</script>
