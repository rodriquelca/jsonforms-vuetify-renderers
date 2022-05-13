<template>
  <component
    v-bind:is="itemsSideBar[activeSideBar]['component']"
    ref="component"
  ></component>
</template>

<script lang="ts">
import { sync } from 'vuex-pathify';
import _ from 'lodash';
import PalletePanel from '../../../views/editor/pallete-panel';
import PropertiesPanel from '../../properties-panel/PropertiesPanel.vue';
import SideBarI18n from '../../i18n/sideBarI18n.vue';
export default {
  name: 'SideBar',
  components: {
    PalletePanel,
    PropertiesPanel,
    SideBarI18n,
  },
  data() {
    return {};
  },
  computed: {
    itemsSideBar: sync('viewManager/sideBar.items'),
    activeSideBar: sync('viewManager/sideBar.active'),
  },
};
</script>
<style>
</style>
