<template>
  <v-expansion-panels v-model="panel" accordion multiple>
    <v-expansion-panel
      class="caption"
      v-for="(group, i) in paletteElements"
      :key="i"
    >
      <v-expansion-panel-header class="caption">{{
        group.label
      }}</v-expansion-panel-header>
      <v-expansion-panel-content elevation="0">
        <div class="vpm-drawer d-flex flex-column">
          <draggable
            v-model="group.elements"
            :group="{
              name: 'people',
              pull: 'clone',
              put: false,
            }"
            :sort="false"
            class="flex-wrap"
            elevation="0"
          >
            <div
              v-for="(item, n) in group.elements"
              :key="n"
              class="pa-1 vpm-drawer-item-list"
            >
              <v-card
                class="d-flex pa-1"
                flat
                :hover="true"
                color="transparent"
              >
                <v-icon
                  small
                  color="accent"
                  class="pe-3 vpm-pallete-icon"
                  v-text="item.icon"
                ></v-icon>

                <v-list-item-title
                  class="vpm-drawer-list-title caption"
                  v-text="item.label"
                ></v-list-item-title>
              </v-card>
            </div>
          </draggable>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import draggable from 'vuedraggable';
import { sync } from 'vuex-pathify';
import { getLabel, SchemaElement } from '../../model/schema';
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
      panel: [0, 1, 2, 3],
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
.vpm-drawer-list-title {
  cursor: pointer;
  font-weight: 500 !important;
  color: #747a80;
}

.theme--light.v-expansion-panels .v-expansion-panel {
  background-color: #f5f5f5;
  color: rgba(0, 0, 0, 0.87);
}

.v-application .blue-grey--text.text--darken-2 {
  color: #1976d2 !important;
  caret-color: #e7eef1 !important;
}
.vpm-drawer-icon {
  margin-right: 5px !important;
}

.vpm-drawer-item-list {
  font-weight: 500;
  transition: transform 400ms;
}

.vpm-drawer-item-list:hover {
  background: linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05));
  transform: scale(1.05, 1.05);
}

.vpm-pallete-icon::before {
  font-weight: 600;
}
</style>
