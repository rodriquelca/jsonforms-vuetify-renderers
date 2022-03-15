<template>
  <div class="">
    <!-- <v-tabs> -->
    <!-- <v-tabs-slider></v-tabs-slider>
      <v-tab class="primary--text">Palette </v-tab> -->

    <!-- <v-tab-item> -->
    <v-list-group v-for="(group, j) in paletteElements" :key="j">
      <template v-slot:activator>
        <v-list-item-content>
          <v-list-item-title v-text="group.label"></v-list-item-title>
        </v-list-item-content>
      </template>
      <v-list dense>
        <draggable
          class="dragArea list-group"
          :list="group.elements"
          :group="{ name: 'people', pull: 'clone', put: false }"
          :sort="false"
        >
          <template v-for="(item, i) in group.elements">
            <v-list-item :key="i">
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.label"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </draggable>
      </v-list>
    </v-list-group>
    <!-- </v-tab-item> -->
    <!-- </v-tabs> -->
  </div>
</template>

<script lang="ts">
import draggable from 'vuedraggable';
import { sync } from 'vuex-pathify';
import { getLabel, SchemaElement } from '../../../model/schema';
export default {
  name: 'PalletePanel',
  components: {
    draggable,
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
