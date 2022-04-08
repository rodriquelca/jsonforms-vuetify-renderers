<template>
  <div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on: onTooltip }">
        <v-btn large icon dark v-on="onTooltip">
          <v-icon size="30" @click="openDialog" color="primary"
            >mdi-tune-vertical-variant</v-icon
          >
        </v-btn>
      </template>
      Form Rules
    </v-tooltip>

    <v-dialog v-model="dialog" width="1400" height="500">
      <v-card dense>
        <v-card-title class="">
          <span class="subtitle-1">Form Rules</span>
        </v-card-title>
        <v-container>
          <IfComponentPlus> </IfComponentPlus>
          <ThenComponent> </ThenComponent>
        </v-container>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text small outlined>Save</v-btn>
          <v-btn color="primary" text small outlined>Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import IfComponentPlus from './FormRules/IfComponentPlus.vue';
import ThenComponent from './FormRules/ThenComponent.vue';
export default {
  name: 'Settingsi18n',
  components: { ThenComponent, IfComponentPlus },
  props: {},
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    openDialog() {
      this.dialog = !this.dialog;
    },
  },
};
</script>

<style>
</style>
