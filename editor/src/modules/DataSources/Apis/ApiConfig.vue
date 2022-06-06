<template>
	<v-card elevation="0" class="flex" color="transparent">
		<v-card elevation="0" class="pt-2" color="transparent">
			<div
				tabindex="-1"
				class="v-stepper__step subtitle-2 v-stepper__step--active"
			>
				<span class="v-stepper__step__step">
					<v-icon color="primary"> mdi-plus-circle </v-icon>
				</span>
				<div v-if="mode == 'add'" class="v-stepper__label font-weight-bold">
					Create an API
					<small>Give the parameters</small>
				</div>

				<div v-else class="v-stepper__label font-weight-bold">
					Edit an API
					<small>{{ api.name }} {{ api.id }}</small>
				</div>

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
			</div>
			<div class="px-10">
				<v-row>
					<v-col>
						<v-text-field
							filled
							dense
							label="Api ID"
							persistent-placeholder
							class="caption"
							v-model="id"
							:rules="rules"
							prepend-icon="mdi-fingerprint"
						>
							<v-icon @click="autogenerateID" slot="append" color="warning">
								mdi-code-not-equal-variant
							</v-icon>
						</v-text-field>
					</v-col>
					<v-col>
						<v-text-field
							filled
							dense
							:rules="rules"
							v-model="name"
							persistent-placeholder
							label="Name"
							class="caption"
							prepend-icon="mdi-format-text-variant"
						>
						</v-text-field>
					</v-col>
				</v-row>

				<v-combobox
					v-model="dataInputVariables"
					hide-selected
					label="Data input variables"
					multiple
					filled
					persistent-placeholder
					small-chips
					dense
					class="caption"
					prepend-icon="mdi-download"
				>
					<template v-slot:no-data> </template>
					<template v-slot:selection="data">
						<v-chip
							class="caption"
							:key="JSON.stringify(data.item)"
							v-bind="data.attrs"
							label
							small
							:input-value="data.selected"
							:disabled="data.disabled"
							@click:close="data.parent.selectItem(data.item)"
						>
							<v-avatar
								class="accent white--text caption"
								left
								size="10"
								v-text="data.item.slice(0, 1).toUpperCase()"
							></v-avatar>
							{{ data.item }}
						</v-chip>
					</template>
				</v-combobox>
				<dynamic-items ref="requestRef" :data="request" />
			</div>
		</v-card>
	</v-card>
</template>

<script lang="ts">
import _ from 'lodash';
import DynamicItems from './DynamicItems.vue';
import { defineComponent, ref } from '@vue/composition-api';
const ApiConfig = defineComponent({
	name: 'ApiConfig',
	inject: ['bus'],
	props: ['data', 'mode'],
	components: { DynamicItems },
	setup(props: any, context: any) {
		//Get the data for API
		let api = ref(props.data);
		let id = ref(api.value.id);
		let name = ref(api.value.name);
		let request = ref(api.value.data);
		let requestRef = ref(null);
		let dataInputVariables = ref(api.value.data.dataInputVariables);
		let rules = ref([
			(value) => !!value || 'Required.',
			(value) => (value && value.length >= 3) || 'Min 3 characters',
		]);

		let save = () => {
			let dataRequest = requestRef.value.getData();
			let dt = {
				id: id.value,
				name: name.value,
				data: {
					url: dataRequest.url,
					method: dataRequest.method,
					params: convertArrayToObject(dataRequest.params),
					headers: convertArrayToObject(dataRequest.headers),
					body: convertArrayToObject(dataRequest.body),
					dataInputVariables: dataInputVariables.value,
					output: dataRequest.output,
				},
			};

			if (props.mode == 'add') {
				context.emit('addApi', dt);
			} else {
				context.emit('updateApi', dt);
			}
		};

		function convertArrayToObject(data) {
			return Object.assign({}, ...data.map((p) => ({ [p.key]: p.value })));
		}

		function autogenerateID() {
			this.id = Math.random().toString(36).substr(2, 10);
		}

		return {
			id,
			name,
			dataInputVariables,
			requestRef,
			request,
			save,
			rules,
			convertArrayToObject,
			autogenerateID,
			api,
		};
	},
});
export default ApiConfig;
</script>
<style>
.vpm-main-panel-ds-btn {
	text-transform: initial;
	letter-spacing: normal;
}
</style>
