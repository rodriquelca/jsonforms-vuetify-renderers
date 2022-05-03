<template>
    <v-app>
        <default-app-bar />

        <div class="vpm-container-main">
            <default-drawer />

            <default-view />
        </div>
        <v-footer padless fixed>
            <v-spacer></v-spacer>
            <div color="success">
                <v-icon color="success"> mdi-check-circle </v-icon>
                <span>Changes saved</span>
            </div>
        </v-footer>
    </v-app>
</template>

<script lang="ts">
import AppBar from './AppBar.vue';
import View from './View.vue';
import Drawer from '../../components/Drawer/Drawer.vue';

export default {
    name: 'DefaultLayout',

    components: {
        DefaultAppBar: AppBar,
        DefaultView: View,
        DefaultDrawer: Drawer,
    },
};
</script>
<style>
.vpm-container-main {
    display: flex;
}
</style>
