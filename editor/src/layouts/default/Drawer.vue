<template>
  <v-navigation-drawer
    :clipped-left="!$vuetify.rtl"
    :clipped-right="$vuetify.rtl"
    :right="$vuetify.rtl"
    permanent
    class="vpm-floating"
  >
    <v-divider></v-divider>
    <div>
      <PalletePanel :schema="editorSchema" />
    </div>

    <v-divider></v-divider>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { sync } from 'vuex-pathify';
import PalletePanel from '../../views/editor/pallete-panel';
export default {
  name: 'DefaultDrawer',
  components: {
    PalletePanel,
  },
  data() {
    return {
      examples: [],
    };
  },
  computed: {
    editorSchema: sync('app/editor@schema'),
  },
};
</script>
<style>
.vpm-container-fill-80 {
  padding-top: 80px;
}
.vpm-floating {
  position: fixed;
  top: 80px !important;
  height: auto !important;
  z-index: 5;
  width: 16% !important;
}
</style>
