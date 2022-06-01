<template>
	<v-card no-gutters height="100%" width="100%">
		<component
			:key="itemsMainPanel[activeMainPanel]['data']['reload']"
			v-bind:is="itemsMainPanel[activeMainPanel]['component']"
		/>
	</v-card>
</template>

<script lang="ts">
import { sync } from 'vuex-pathify';
import { createLayout } from '../../util';
import DynaformEditor from '../DynaformEditor/DynaformEditor.vue';
import MainPanelI18n from '../i18n/mainPanelI18n.vue';
import MainPanelDynaformPreview from '../DynaformPreview/mainPanelDynaformPreview.vue';
import MainPanelSchemaEditor from '../SchemaEditor/mainPanelSchemaEditor.vue';
import MainPanelFormRules from '../FormRules/MainPanelFormRules.vue';
import MainPanelDataSourcesS from '../../modules/DataSources/MainPanelDataSources.vue';
import MainPanelDataSources from '../../modules/DataSources/MainPanelDataSourcesSimpleList.vue';

import CustomTheme from '../CustomTheme.vue';
export default {
	name: 'mainPanel',
	props: {},
	components: {
		DynaformEditor,
		MainPanelI18n,
		MainPanelDynaformPreview,
		MainPanelSchemaEditor,
		MainPanelFormRules,
		CustomTheme,
		MainPanelDataSources,
	},
	data() {
		return {
			data: {},
		};
	},
	mounted() {
		this.$store.dispatch('app/setSchema', {
			schema: {
				type: 'object',
				title: 'Dynaform',
				properties: {},
			},
		});
		this.$store.dispatch('app/setUiSchema', {
			uiSchema: createLayout('VerticalLayout'),
		});
	},
	computed: {
		itemsMainPanel: sync('viewManager/mainPanel.items'),
		activeMainPanel: sync('viewManager/mainPanel.active'),
	},
	methods: {},
};
</script>
