<template>
	<v-stepper v-model="e6" vertical elevation="0" class="flex">
		<v-stepper-step :complete="e6 > 1" step="1" class="subtitle-2">
			Create a Simple List
			<small>Give the Simple List an ID and a name</small>
		</v-stepper-step>

		<v-stepper-content step="1">
			<v-card elevation="0" color="" class="">
				<v-text-field
					outlined
					dense
					placeholder="Simple List ID"
					class="caption"
					v-model="id"
					:rules="rules"
					prepend-icon="mdi-fingerprint"
				>
					<v-icon @click="autogenerateID" slot="append" color="warning">
						mdi-code-not-equal-variant
					</v-icon>
				</v-text-field>
				<v-text-field
					outlined
					dense
					:rules="rules"
					v-model="name"
					placeholder="Name"
					class="caption"
					prepend-icon="mdi-format-text-variant"
				>
				</v-text-field>
			</v-card>
			<v-btn
				color="primary"
				plain
				small
				@click="save"
				class="vpm-main-panel-ds-btn float-end"
			>
				<v-icon small class="px-1">mdi-content-save</v-icon>
				Save
			</v-btn>
		</v-stepper-content>
	</v-stepper>
</template>

<script lang="ts">
import _ from 'lodash';
import { defineComponent, ref } from '@vue/composition-api';

import store from '../../../store';
const MainPanelDataSources = defineComponent({
	name: 'MainPanelDataSources',
	inject: ['bus'],
	components: {},
	computed: {},
	data: function () {
		return {
			e6: 1,
			rules: [
				(value) => !!value || 'Required.',
				(value) => (value && value.length >= 3) || 'Min 3 characters',
			],
		};
	},
	methods: {
		autogenerateID() {
			this.id = Math.random().toString(36).substr(2, 10);
		},
		save() {
			store.dispatch('dataSources/addSimpleList', {
				id: this.id,
				name: this.name,
			});
		},
	},
	setup(props: any) {
		let id = ref('');
		let name = ref('');
		return { id, name };
	},
});
export default MainPanelDataSources;
</script>
<style>
.vpm-main-panel-ds-btn {
	text-transform: initial;
	letter-spacing: normal;
}
</style>
