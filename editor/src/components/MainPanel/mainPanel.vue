<template>
  <v-container class="ps-9 my-1" :fluid="true">
    <v-row no-gutters height="100%">
      <v-col cols="2"> </v-col>
      <v-col cols="10">
        <component v-bind:is="itemsMainPanel[activeMainPanel]['id']" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { sync } from 'vuex-pathify';
import { createLayout } from '../../util';
import DynaformEditor from '../../views/editor';
import MainPanelI18n from '../i18n/mainPanelI18n.vue';
export default {
  name: 'mainPanel',
  props: {},
  components: { DynaformEditor, MainPanelI18n },
  data() {
    return {
      data: {},
    };
  },
  mounted() {
    this.$store.dispatch('app/setSchema', {
      schema: {
        type: 'object',
        title: 'Dynaform',
        properties: {},
      },
    });
    this.$store.dispatch('app/setUiSchema', {
      uiSchema: createLayout('VerticalLayout'),
    });
  },
  computed: {
    itemsMainPanel: sync('viewManager/mainPanel.items'),
    activeMainPanel: sync('viewManager/mainPanel.active'),
  },
  methods: {},
};
</script>
