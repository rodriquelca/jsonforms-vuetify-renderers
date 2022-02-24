<template>
  <v-app>
    <default-app-bar />
    <default-view />
    <v-footer padless>
      <v-col class="lighten-0 py-4 text-right" cols="12">
        ProcessMaker 2022
      </v-col>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
export default {
  name: 'DefaultLayout',

  components: {
    DefaultAppBar: () => import('./AppBar'),
    DefaultView: () => import('./View'),
  },
};
</script>
