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
                        <v-list-item-group
                            v-model="panel.active"
                            :color="panel.color"
                        >
                            <v-list-item
                                v-for="item in panel.items"
                                :key="item.title"
                            >
                                <v-tooltip right>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-list-item-action
                                            v-on="on"
                                            v-bind="attrs"
                                        >
                                            <v-icon small>{{
                                                item.icon
                                            }}</v-icon>
                                        </v-list-item-action>

                                        <v-list-item-content
                                            v-on="on"
                                            v-bind="attrs"
                                        >
                                            <v-list-item-title>{{
                                                item.title
                                            }}</v-list-item-title>
                                        </v-list-item-content>
                                    </template>
                                    <span>{{ item.title }}</span>
                                </v-tooltip>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                </v-navigation-drawer>
            </div>
            <div>
                <component
                    v-bind:is="panel.items[panel.active]['component']"
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
export default {
    name: 'DefaultDrawer',
    components: {
        PalletePanel,
        PropertiesPanel,
    },
    data() {
        return {
            panel: {
                active: 0,
                color: 'primary',
                items: [
                    {
                        title: 'Pallete Panel',
                        icon: 'mdi-view-dashboard',
                        component: 'pallete-panel',
                    },
                    {
                        title: 'Properties Panel',
                        icon: 'mdi-pencil',
                        component: 'properties-panel',
                    },
                ],
            },
        };
    },
    computed: {
        selectedElement: sync('app/editor@element'),
    },
    watch: {
        /**
         * Open the properties-panel for edit
         */
        selectedElement(newSelection, oldSelection) {
            if (newSelection.edit != oldSelection.edit) {
                this.panel.active = 1;
            }
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

.v-navigation-drawer__content::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    background-color: #f5f5f5;
}

.v-navigation-drawer__content::-webkit-scrollbar {
    width: 4px;
    background-color: #f5f5f5;
}

.v-navigation-drawer__content::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #fff;
}
</style>
