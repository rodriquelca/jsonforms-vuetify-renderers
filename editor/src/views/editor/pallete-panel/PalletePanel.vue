<template>
  <div class="">
    <Templates @onClick="onClickTemplate" />
    <v-expansion-panels focusable multiple>
      <v-expansion-panel v-for="(group, i) in paletteElements" :key="i">
        <v-expansion-panel-header>{{ group.label }}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <!-- <v-card flat tile class="d-flex mb-6"> -->
          <draggable
            v-model="group.elements"
            :group="{ name: 'people', pull: 'clone', put: false }"
            :sort="false"
            tag="v-card"
            class="d-flex align-content-start flex-wrap"
          >
            <v-card
              v-for="(item, n) in group.elements"
              :key="n"
              outlined
              tile
              class="pa-4"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    color="blue-grey darken-2"
                    dark
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ item.icon }}
                  </v-icon>
                </template>
                <span>{{ item.label }}</span>
              </v-tooltip>
              <!-- <v-icon v-text="item.icon"></v-icon> -->
            </v-card>
          </draggable>
          <!-- </v-card> -->
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script lang="ts">
import Templates from '../../../components/Templates.vue';
import draggable from 'vuedraggable';
import { sync } from 'vuex-pathify';
import { getLabel, SchemaElement } from '../../../model/schema';
export default {
  name: 'PalletePanel',
  components: {
    draggable,
    Templates,
  },
  props: {
    schema: {
      type: [Object, Boolean],
    },
  },
  data() {
    return {
      tabs: [],
      list1: [
        { name: 'John', id: 1 },
        { name: 'Joao', id: 2 },
        { name: 'Jean', id: 3 },
        { name: 'Gerard', id: 4 },
      ],
    };
  },
  created: function () {
    this.$store.dispatch('app/getPaletteElements');
  },
  computed: {
    paletteElements: sync('app/editor@paletteElements'),
    editorSchema: sync('app/editor@schema'),
  },
  methods: {
    getLabel: function (schemaElement: SchemaElement) {
      return getLabel(schemaElement);
    },
    onClickTemplate: function (e) {
      console.log(e);
    },
  },
};
</script>

<style>
.list-group .v-list-item {
  cursor: grab;
}
.list-group .item {
  border-width: 0 0 1px;
  position: relative;
  display: block;
  padding: 0.75rem 1.25rem;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.125);
}
.v-list {
  height: 250px; /* or any height you want */
  overflow-y: auto;
}
</style>
