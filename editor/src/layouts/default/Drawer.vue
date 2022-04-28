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
                                src="https://www.theladders.com/s3proxy/company-photo.theladders.com/70039/3cb99fbc-d86c-4cc6-bf2a-8b5f9d9eac83.png"
                            ></v-img>
                        </v-list-item-avatar>
                    </v-list-item>
                    <v-divider></v-divider>

                    <v-list dense nav>
                        <v-list-item v-for="item in items" :key="item.title">
                            <v-list-item-action>
                                <v-icon small>{{ item.icon }}</v-icon>
                            </v-list-item-action>

                            <v-list-item-content>
                                <v-list-item-title>{{
                                    item.title
                                }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-navigation-drawer>
            </div>
            <div>
                <PalletePanel :schema="editorSchema" />
            </div>
        </div>
    </v-navigation-drawer>
</template>

<script lang="ts">
import { sync } from 'vuex-pathify';
import PalletePanel from '../../views/editor/pallete-panel';
export default {
    name: 'DefaultDrawer',
    components: {
        PalletePanel,
    },
    data() {
        return {
            examples: [],
            items: [
                { title: 'Designer', icon: 'mdi-view-dashboard' },
                { title: 'Properties', icon: 'mdi-forum' },
                { title: 'Themes', icon: 'mdi-forum' },
                { title: 'FormRules', icon: 'mdi-forum' },
                { title: 'Settings', icon: 'mdi-setting' },
            ],
            links: ['Home', 'Contacts', 'Settings'],
            mini: true,
        };
    },
    computed: {
        editorSchema: sync('app/editor@schema'),
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
    width: 24% !important;
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
