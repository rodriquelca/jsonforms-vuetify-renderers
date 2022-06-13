<template>
	<v-card elevation="0" color="transparent" class="no-gutters">
		<template v-for="(property, index) in properties">
			<v-text-field
				v-if="property.type == 'text'"
				:key="index"
				dense
				:label="property.name"
				persistent-placeholder
				class="caption"
			></v-text-field>

			<v-textarea
				v-else-if="property.type == 'textarea'"
				:key="index"
				dense
				auto-grow
				rows="2"
				class="caption"
				persistent-placeholder
				:name="property.id"
				:label="property.name"
			></v-textarea>
			<v-combobox
				v-else-if="property.type == 'dropdown'"
				:key="index"
				:items="property.items"
				:label="property.name"
				outlined
				persistent-placeholder
				class="caption"
				dense
			></v-combobox>
			<v-checkbox
				:key="index"
				v-else-if="property.type == 'checkbox'"
				small
				dense
				filled
				no-gutters
				class="caption"
			>
				<template v-slot:label>
					<div class="caption">
						{{ property.name }}
					</div>
				</template>
			</v-checkbox>
		</template></v-card
	>
</template>

<script lang="ts">
//import { sync } from 'vuex-pathify';
import { defineComponent, ref } from '@vue/composition-api';
import properties from './Properties';
import _ from 'lodash';
const PropertiesPanelDynamic = defineComponent({
	name: 'PropertiesPanelDynamic',
	components: {},
	inject: ['bus'],
	setup(props: any, context: any) {
		let properties = ref([
			{
				id: 'variable',
				type: 'text',
				name: 'Variable',
			},
			{
				id: 'placeholder',
				type: 'text',
				name: 'Placeholder',
			},
			{
				id: 'label',
				type: 'text',
				name: 'Label',
			},
			{
				id: 'description',
				type: 'textarea',
				name: 'Description',
			},
			{
				id: 'validation',
				type: 'text',
				name: 'Validation',
			},
			{
				id: 'validationmessage',
				type: 'text',
				name: 'Validation message',
			},
			{
				id: 'mask',
				type: 'text',
				name: 'Mask',
			},
			{
				id: 'maxlength',
				type: 'text',
				name: 'Max length',
			},
			{
				id: 'textTransform',
				type: 'dropdown',
				name: 'Text transform to',
				items: [
					{
						text: 'None',
						id: 'none',
					},
					{
						text: 'Lowercase',
						id: 'lowercase',
					},
					{
						text: 'Uppercase',
						id: 'uppercase',
					},
					{
						text: 'Capital Phrase',
						id: 'capital',
					},
					{
						text: 'Title case',
						id: 'title',
					},
				],
			},
			{
				id: 'required',
				type: 'checkbox',
				name: 'Required',
			},
			{
				id: 'readonly',
				type: 'checkbox',
				name: 'Read Only',
			},
			{
				id: 'multi',
				type: 'checkbox',
				name: 'Multi',
			},
			{
				id: 'trim',
				type: 'checkbox',
				name: 'Trim text',
			},
			{
				id: 'restrictmaxlength',
				type: 'checkbox',
				name: 'Restrict to max length',
			},
		]);
		return { properties };
	},
	methods: {},
});
export default PropertiesPanelDynamic;
</script>
<style>
.vpm-action-editor-btn {
	text-transform: initial;
	letter-spacing: normal;
}
</style>
