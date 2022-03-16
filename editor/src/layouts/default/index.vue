<template>
  <v-app>
    <default-app-bar />
    <default-view />
    <v-footer padless fixed>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon> mdi-cog-off </v-icon>
      </v-btn>
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
