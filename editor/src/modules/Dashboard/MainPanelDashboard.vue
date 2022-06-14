<template>
	<div class="text-center">
		<v-scroll-y-transition mode="out-in">
			<v-card class="pt-6 mx-auto" flat color="transparent">
				<v-card-text>
					<v-icon style="opacity: 0.7; font-size: 80px">mdi-drawing-box</v-icon>

					<h3 class="text-h5 mb-2 grey--text text--darken-2">
						Welcome to Json Forms
					</h3>
					<div class="grey--text mb-2">
						All your forms live here, You can create a form
					</div>

					<v-btn
						class="vpm-action-editor-btn"
						color="primary"
						elevation="0"
						plain
						small
						@click="showTemplates"
					>
						<v-icon class="me-1" small>mdi-square-edit-outline</v-icon>
						Create
					</v-btn>
				</v-card-text>
				<v-divider></v-divider>
			</v-card>
		</v-scroll-y-transition>
	</div>
</template>

<script lang="ts">
import _ from 'lodash';
import { computed, defineComponent, reactive, ref } from '@vue/composition-api';
import store from '../../store';

const MainPanelDashboard = defineComponent({
	name: 'MainPanelDashboard',
	components: {},
	computed: {},
	setup(props: any) {
		let key = ref(0);
		let showTemplates = () => {
			console.log('templates');
			let mainPanel = { id: 'main-dashboard-templates' };
			store.dispatch('viewManager/setAllViews', {
				mainPanel,
			});
		};
		return { key, showTemplates };
	},
	methods: {},
});
export default MainPanelDashboard;
</script>
<style>
.vpm-action-dashboard-btn {
	text-transform: initial;
	letter-spacing: normal;
}
</style>
