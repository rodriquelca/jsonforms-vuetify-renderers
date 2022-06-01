<template>
	<v-list nav dense color="gray">
		<v-list-item-group v-model="selectedItem" color="primary">
			<v-list-item v-for="(item, i) in items" :key="i">
				<v-list-item-icon>
					<v-icon small v-text="item.icon"></v-icon>
				</v-list-item-icon>

				<v-list-item-content>
					<v-list-item-title
						small
						v-text="item.text"
						class="caption"
					></v-list-item-title>
				</v-list-item-content>
			</v-list-item>
		</v-list-item-group>
	</v-list>
</template>

<script lang="ts">
import _ from 'lodash';
import { sync } from 'vuex-pathify';
import { defineComponent } from '@vue/composition-api';
import languages from '../../api/languages';
const SideBarDataSources = defineComponent({
	name: 'SideBarDataSources',
	components: {},
	computed: {
		codes() {
			return _.map(this.iso.languages, (v, k) => ({
				text: `${v} - ${k}`,
				key: k,
				label: v,
			}));
		},
		locales: sync('locales'),
		itemsMainPanel: sync('viewManager/mainPanel.items'),
		activeMainPanel: sync('viewManager/mainPanel.active'),
		locale: {
			get() {
				return this.getDataMainPanel()['locale'];
			},
			set(value) {
				let data: any = {
					locale: value,
				};
				if (this.getDataMainPanel()['view'] == 'json') {
					data.reload = _.random(0, 1000000);
				}
				this.setDataMainPanel(data);
			},
		},
		selectedLocale: {
			get() {
				let en = Object.keys(this.locales),
					index = en.indexOf(this.locale);
				this.localesKeys = en;
				return index == -1 ? 0 : index;
			},
			set(value) {
				this.locale = this.localesKeys[value];
			},
		},
	},
	data() {
		return {
			key: 1,
			select: '',
			localesKeys: [],
			selectedItem: 0,
			items: [
				{ text: 'Simple Lists', icon: 'mdi-card' },
				{ text: 'Collections', icon: 'mdi-card-multiple' },
				{ text: 'APIs', icon: 'mdi-api' },
				{ text: 'Databases', icon: 'mdi-database' },
			],
		};
	},
	setup(props: any) {
		return {
			iso: languages,
		};
	},
	methods: {
		/**
		 * Add new language to store
		 */
		newLanguage() {
			this.locales[this.select.key] = {
				key: this.select.key,
				description: this.select.label,
				content: _.cloneDeep(this.locales['en'].content),
			};
			this.key++;
			this.setDataMainPanel({
				reload: _.random(0, 1000000),
			});
		},
		setDataMainPanel(data) {
			this.$store.dispatch('viewManager/setDataMainPanel', {
				id: 'main-translations',
				data,
			});
		},
		getDataMainPanel() {
			return this.$store.getters['viewManager/getDataMainPanelById'](
				'main-translations'
			);
		},
	},
});
export default SideBarDataSources;
</script>

<style>
.vpm-sidebar-i18n-title {
	text-transform: initial;
	letter-spacing: normal;
	font-size: 0.75rem;
	font-weight: 500;
}

.text-h5 {
	color: white;
}
</style>
