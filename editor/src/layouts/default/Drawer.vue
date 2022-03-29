<template>
  <v-navigation-drawer
    app
    clipped
    :clipped-left="!$vuetify.rtl"
    :clipped-right="$vuetify.rtl"
    :right="$vuetify.rtl"
    permanent
    width="240"
  >
    <PalletePanel :schema="editorSchema" />
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
