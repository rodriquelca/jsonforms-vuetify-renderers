<template>
	<v-list dense multiple>
		<v-list-group
			v-for="item in templates"
			:key="item.title"
			dense
			v-model="item.active"
			:prepend-icon="item.action"
		>
			<template v-slot:activator>
				<v-list-item-content>
					<v-list-item-title
						v-text="item.title"
						class="caption"
					></v-list-item-title>
				</v-list-item-content>
			</template>

			<v-list-item
				v-for="child in item.items"
				:key="child.title"
				link
				@click="onClickListItem(child)"
			>
				<v-list-item-content>
					<v-list-item-title
						class="caption"
						v-text="child.title"
					></v-list-item-title>
				</v-list-item-content>
				<v-list-item-icon>
					<v-icon @click="onClick(child)">mdi-eye</v-icon>
				</v-list-item-icon>
			</v-list-item>
		</v-list-group>
	</v-list>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { TemplateSchemaService } from '../../api/schemaService';
import _ from 'lodash';
const SideBarJsonForms = defineComponent({
	name: 'SideBarJsonForms',
	components: {},
	data: function () {
		return {};
	},
	setup() {
		let templates = ref(null as any);
		new TemplateSchemaService()
			.getTemplates()
			.then((res: any) => {
				templates.value = res;
			})
			.catch((err: any) => {
				console.log(err);
			});
		return {
			templates,
		};
	},

	methods: {
		onClickListItem(e) {
			this.selected = e.input;
			this.$store.dispatch('viewManager/setAllViews', {
				mainPanel: {
					id: 'main-json-forms',
					data: {
						reload: _.random(0, 10000),
						form: e.input,
					},
				},
			});

			this.picture = e.input.picture;
		},
		onClick: function (item) {
			this.selected.value = item;
			let activityBar = { id: '' },
				mainPanel = { id: '' },
				actionsBar = { id: '' },
				sideBar = { id: '' };
			this.$store.dispatch('app/setSchema', {
				schema: this.selected.schema,
			});
			this.$store.dispatch('app/setUiSchema', {
				uiSchema: this.selected.uischema,
			});

			this.$store.dispatch('locales/setSchema', {
				properties: _.keys(this.selected.schema.properties),
			});

			activityBar.id = 'activity-json-form-editor';
			sideBar.id = 'side-bar-pallete';
			mainPanel.id = 'main-editor';
			actionsBar.id = 'actions-editor';

			this.$store.dispatch('viewManager/setAllViews', {
				activityBar,
				sideBar,
				mainPanel,
				actionsBar,
			});
			this.$store.set('viewManager/activityBar.active', 1);
		},
	},
});
export default SideBarJsonForms;
</script>
