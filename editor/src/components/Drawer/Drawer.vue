<template>
  <v-navigation-drawer
    :clipped-left="!$vuetify.rtl"
    :clipped-right="$vuetify.rtl"
    :right="$vuetify.rtl"
    permanent
    absolute
    class="vpm-floating"
  >
    <div class="fill-height d-flex flex-row mb-6" no-gutters>
      <div>
        <v-navigation-drawer
          dark
          mini-variant
          mini-variant-width="48"
          permanent
        >
          <v-list-item class="px-1">
            <v-list-item-avatar size="30">
              <v-img
                src="https://images.assetsdelivery.com/compings_v2/wikagraphic/wikagraphic2010/wikagraphic201027091.jpg"
              ></v-img>
            </v-list-item-avatar>
          </v-list-item>
          <v-divider></v-divider>

          <v-list dense nav>
            <v-list-item-group v-model="active" color="primary">
              <v-list-item v-for="item in itemsActivityBar" :key="item.title">
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item-action v-on="on" v-bind="attrs">
                      <v-icon small>{{ item.icon }}</v-icon>
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
      </div>
      <div class="vpm-subdrawer">
        <component
          v-bind:is="itemsSideBar[activeSideBar]['id']"
          ref="component"
        ></component>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { sync } from 'vuex-pathify';
import _ from 'lodash';
import PalletePanel from '../../views/editor/pallete-panel';
import PropertiesPanel from '../properties-panel/PropertiesPanel.vue';
import SideBarI18n from '../i18n/sideBarI18n.vue';
export default {
  name: 'DefaultDrawer',
  components: {
    PalletePanel,
    PropertiesPanel,
    SideBarI18n,
  },
  data() {
    return {
      active: 0,
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
    active(newValue) {
      //Update in store the active Activity Bar
      this.$store.dispatch('viewManager/setActiveActivityBar', newValue);
    },
  },
};
</script>
<style>
.vpm-container-fill-80 {
  padding-top: 80px;
}
.vpm-floating {
  position: fixed;
  top: 80px !important;
  z-index: 5;
  width: 18% !important;
}

.vpm-floating > .v-navigation-drawer__content {
  height: 100%;
  overflow-y: hidden !important;
  overflow-x: hidden !important;
}

.vpm-subdrawer {
  overflow-y: auto;
  padding-bottom: 100px;
  width: 100%;
}

.vpm-subdrawer::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  background-color: #f5f5f5;
}

.vpm-subdrawer::-webkit-scrollbar {
  width: 4px;
  background-color: #f5f5f5;
}

.vpm-subdrawer::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #fff;
}
</style>
