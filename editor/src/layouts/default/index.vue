<template>
  <v-app>
    <default-app-bar />
    <default-view />
    <v-footer padless fixed>
      <v-spacer></v-spacer>
      <div color="success">
        <v-icon color="success"> mdi-check-circle </v-icon>
        <span>Changes saved</span>
      </div>
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
