<template>
  <v-navigation-drawer mini-variant mini-variant-width="48">
    <v-list dense nav>
      <v-list-item-group v-model="active">
        <v-list-item
          v-for="item in itemsActivityBar"
          :key="item.title"
          class="vpm-actbar-item"
        >
          <v-tooltip small right>
            <template v-slot:activator="{ on, attrs }">
              <v-list-item-action
                v-on="on"
                v-bind="attrs"
                class="vpm-actbar-item-icon"
              >
                <v-icon color="primary" small>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content v-on="on" v-bind="attrs">
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </template>
            <span>{{ item.title }}</span>
          </v-tooltip>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { sync } from 'vuex-pathify';
import _ from 'lodash';
export default {
  name: 'ActivityBar',
  components: {},
  data() {
    return {
      active: 0,
      mini: true,
    };
  },
  mounted() {
    //Load the active activity Bar
    this.active = this.activeActivityBar;
  },
  computed: {
    itemsActivityBar: sync('viewManager/activityBar.items'),
    activeActivityBar: sync('viewManager/activityBar.active'),
    itemsSideBar: sync('viewManager/sideBar.items'),
    activeSideBar: sync('viewManager/sideBar.active'),
  },
  watch: {
    active(newValue: string): void {
      let id = this.itemsActivityBar[newValue].id,
        activityBar = { id: '' },
        mainPanel = { id: '' },
        sideBar = { id: '' };
      switch (id) {
        case 'activity-pallete':
          activityBar.id = 'activity-pallete';
          sideBar.id = 'side-bar-pallete';
          mainPanel.id = 'main-editor';
          break;
        case 'activity-properties':
          activityBar.id = 'activity-properties';
          sideBar.id = 'side-bar-properties';
          mainPanel.id = 'main-editor';
          break;
        case 'activity-preview':
          activityBar.id = 'activity-preview';
          sideBar.id = 'side-bar-preview';
          mainPanel.id = 'main-preview';
          break;
        case 'activity-translations':
          activityBar.id = 'activity-translations';
          sideBar.id = 'side-bar-translations';
          mainPanel.id = 'main-translations';
          break;
      }

      this.$store.dispatch('viewManager/setAllViews', {
        activityBar,
        sideBar,
        mainPanel,
      });
    },
  },
};
</script>
<style>
.vpm-actbar-item {
  justify-content: inherit !important;
}
.vpm-actbar-item-icon:hover {
  transform: scale(1.4, 1.4);
}
.vpm-actbar-item-icon {
  transition: transform 350ms;
}
</style>
