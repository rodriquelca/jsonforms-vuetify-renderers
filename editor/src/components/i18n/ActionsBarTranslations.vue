<template>
  <v-app-bar dense flat outline>
    <v-list-item-title class="h5"> Translations</v-list-item-title>
    <v-spacer></v-spacer>
    <v-btn
      color="primary"
      class="vpm-action-editor-btn"
      plain
      small
      @click="changeView('editor')"
    >
      <v-icon class="me-1" small>mdi-table</v-icon>
      Editor
    </v-btn>
    <v-btn
      class="vpm-action-editor-btn"
      color="secondary"
      plain
      small
      @click="changeView('json')"
    >
      <v-icon class="me-1" small>mdi-pencil-ruler</v-icon>
      JSON
    </v-btn>
    <v-divider class="mx-1" vertical></v-divider>
    <v-spacer></v-spacer>
    <v-btn icon x-small class="pa-5" @click.stop.prevent="saveTranslations">
      <v-icon>mdi-content-save</v-icon>
    </v-btn>

    <v-menu left bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on" x-small class="pa-5">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item v-for="n in 5" :key="n" @click="() => {}">
          <v-list-item-title>Option {{ n }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import _ from 'lodash';
const ActionsBarTranslations = defineComponent({
  name: 'ActionsBarTranslations',
  components: {},
  data() {
    return {};
  },
  computed: {},
  inject: ['bus'],
  methods: {
    saveTranslations() {
      this.bus.$emit('translations::main-panel::save', {});
    },
    changeView(v) {
      this.$store.dispatch('viewManager/setDataMainPanel', {
        id: 'main-translations',
        data: {
          reload: _.random(0, 1000000),
          view: v,
        },
      });
    },
  },
});
export default ActionsBarTranslations;
</script>
<style>
.vpm-action-editor-btn {
  text-transform: initial;
  letter-spacing: normal;
}
</style>
