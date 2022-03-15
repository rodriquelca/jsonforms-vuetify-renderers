<template>
  <v-app>
    <default-app-bar />
    <default-view />
    <v-footer padless fixed>
      <!-- <v-system-bar color="normal" height="50"> -->
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon> mdi-cog-off </v-icon>
      </v-btn>
      <!-- <v-icon>mdi-wifi-strength-4</v-icon>
      <v-icon>mdi-signal-cellular-outline</v-icon>
      <v-icon>mdi-battery</v-icon> -->

      <!-- <span>ProcessMaker 2022 sdsd</span> -->
      <!-- </v-system-bar> -->
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
