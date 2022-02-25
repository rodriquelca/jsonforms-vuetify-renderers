<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-img
          :src="require('@/assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>

      <v-col cols="12" class="text-center">
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to JSON DynaForms Vue 2 Vuetify
        </h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
export default {
  name: 'HomeView',
};
</script>
