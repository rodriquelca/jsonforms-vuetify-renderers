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
    <v-list-item>
      <v-list-item-icon>
        <!-- <v-img
          :src="require('@/assets/vuetify.svg')"
          max-height="64"
          max-width="64"
        /> -->
        <v-icon size="64" color="blue darken-2">mdi-code-json</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title class="text-h6"> Dynaform </v-list-item-title>
        <v-list-item-subtitle> Editor </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>
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
