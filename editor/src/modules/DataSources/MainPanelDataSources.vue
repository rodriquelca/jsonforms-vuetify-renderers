<template>
	<div>
		<v-stepper v-model="e6" vertical elevation="0">
			<v-stepper-step :complete="e6 > 1" step="1" class="subtitle-2">
				Create a Collection
				<small>Give the collection an ID</small>
			</v-stepper-step>

			<v-stepper-content step="1">
				<v-card elevation="0" color="" class="">
					<v-text-field
						outlined
						dense
						placeholder="Collection ID"
						class="caption"
					>
						<v-icon slot="prepend" small right> mdi-fingerprint </v-icon>
					</v-text-field>
				</v-card>

				<v-btn
					color="primary"
					plain
					small
					@click="e6 = 2"
					class="vpm-main-panel-ds-btn"
				>
					<v-icon>mdi-arrow-down-bold</v-icon>
					Continue
				</v-btn>
			</v-stepper-content>

			<v-stepper-step :complete="e6 > 2" step="2" class="subtitle-2">
				Add the first record
				<small>Autogenerate an ID and add fields</small>
			</v-stepper-step>

			<v-stepper-content step="2">
				<v-card elevation="0">
					<v-text-field dense outlined placeholder="Record ID" class="caption">
						<v-icon slot="prepend" small right> mdi-fingerprint </v-icon>
					</v-text-field>

					<div class="font-weight-bold caption">Add Fields</div>
					<v-timeline align-top dense class="caption">
						<v-timeline-item
							v-for="(field, index) in fields"
							:key="index"
							:color="field.color"
							small
							dense
						>
							<div v-if="field.diff == 'field'">
								<div class="d-flex flex-row no-gutters">
									<div class="d-inline-flex">
										<v-text-field
											outlined
											dense
											placeholder="Field"
											class="caption"
											v-model="field.field"
										></v-text-field>
									</div>
									<div class="d-inline-flex">
										<v-text-field
											outlined
											dense
											placeholder="Type"
											class="caption"
											v-model="field.type"
										>
											<v-icon slot="prepend" color="primary" small right>
												mdi-equal-box
											</v-icon></v-text-field
										>
									</div>
									<div class="d-inline-flex">
										<v-text-field
											outlined
											dense
											placeholder="Field"
											class="caption"
											v-model="field.value"
										>
											<v-icon slot="prepend" color="primary" small right>
												mdi-slash-forward-box
											</v-icon>
										</v-text-field>
									</div>
									<div class="d-inline-flex">
										<v-btn
											color="error"
											plain
											small
											class="vpm-main-panel-ds-btn pt-2"
											@click="removeField(index)"
										>
											<v-icon>mdi-delete</v-icon>
										</v-btn>
									</div>
								</div>
							</div>

							<div v-else>
								<v-btn
									color="primary"
									plain
									small
									class="vpm-main-panel-ds-btn-plus"
									@click="addField"
								>
									<v-icon>mdi-plus-circle</v-icon>
									Add field
								</v-btn>
							</div>
						</v-timeline-item>
					</v-timeline>
				</v-card>
				<v-card elevation="0" class="float-end">
					<v-btn
						color="error"
						plain
						small
						text
						class="vpm-main-panel-ds-btn"
						@click="e6 = 1"
					>
						<v-icon>mdi-arrow-up-bold</v-icon>
						Return
					</v-btn>
					<v-btn
						color="primary"
						plain
						small
						@click="e6 = 2"
						class="vpm-main-panel-ds-btn"
					>
						<v-icon>mdi-content-save</v-icon>
						Save
					</v-btn>
				</v-card>
			</v-stepper-content>
		</v-stepper>
	</div>
</template>

<script lang="ts">
import { sync } from 'vuex-pathify';
import _ from 'lodash';
import { computed, defineComponent, ref } from '@vue/composition-api';

import store from '../../store';
const MainPanelDataSources = defineComponent({
	name: 'MainPanelDataSources',
	inject: ['bus'],
	components: {},
	computed: {},
	data: function () {
		return {
			e6: 1,
			reveal: false,
			fields: [
				{
					color: 'warning',
					diff: 'field',
					field: '',
					type: '',
					value: '',
				},
				{
					color: 'primary',
					diff: 'add',
					field: '',
					type: '',
					value: '',
				},
			],
		};
	},
	methods: {
		addField() {
			this.fields.pop();
			this.fields = this.fields.concat([
				{
					color: 'warning',
					diff: 'field',
					field: '',
					type: '',
					value: '',
				},
				{
					color: 'primary',
					diff: 'add',
					field: '',
					type: '',
					value: '',
				},
			]);
		},
		removeField(index) {
			let clone = _.clone(this.fields);
			clone = _.concat(
				_.slice(clone, 0, index),
				_.slice(clone, index + 1, clone.length)
			);
			this.fields = clone;
		},
	},
	setup(props: any) {
		let collections = computed(sync('dataSources/collections'));
		let idCollection = ref(''); //list-add-table
		return { collections, idCollection };
	},
});
export default MainPanelDataSources;
</script>
<style>
.vpm-main-panel-ds-btn {
	text-transform: initial;
	letter-spacing: normal;
}
.vpm-main-panel-ds-btn-plus {
	text-transform: initial;
	letter-spacing: normal;
	padding: 0px !important;
}
.v-card--reveal {
	bottom: 0;
	opacity: 1 !important;
}
</style>
