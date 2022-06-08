<template>
	<div>
		<v-img
			v-if="picture && picture != ''"
			:src="require('@/api/examples/' + picture)"
			max-height="600"
			max-width="550"
		/>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api';
import { sync } from 'vuex-pathify';
import { TemplateSchemaService } from '../../api/schemaService';
const MainPanelJsonForms = defineComponent({
	name: 'MainPanelJsonForms',
	components: {},
	data: function () {
		return {};
	},
	setup() {
		let itemsMainPanel: any = computed(sync('viewManager/mainPanel.items'));
		let activeMainPanel: any = computed(sync('viewManager/mainPanel.active'));
		let picture = ref(
			itemsMainPanel.value[activeMainPanel.value]['data']['form']
				? itemsMainPanel.value[activeMainPanel.value]['data']['form']['picture']
				: ''
		);

		return {
			picture,
			itemsMainPanel,
			activeMainPanel,
		};
	},

	methods: {},
});
export default MainPanelJsonForms;
</script>
