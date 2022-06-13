<template>
	<v-expansion-panels
		v-model="panel"
		multiple
		no-gutters
		dense
		class="caption"
		:key="selectedElement.edit"
	>
		<v-expansion-panel>
			<v-expansion-panel-header>
				<div>
					<span class="caption font-weight-bold"> General</span>
					<v-icon small class="px-2">mdi-card</v-icon>
				</div>
			</v-expansion-panel-header>
			<v-expansion-panel-content>
				<PropertiesPanelDynamic />
				<json-forms
					v-if="schemasCollection"
					:renderers="renderers"
					:data="generalData"
					:uischema="schemasCollection.get('general').uiSchema"
					:schema="schemasCollection.get('general').schema"
					@change="updateGeneralSettings"
				/>
			</v-expansion-panel-content>
		</v-expansion-panel>
	</v-expansion-panels>
</template>

<script lang="ts">
import PropertiesPanelDynamic from './PanelDynamic/PanelDynamic.vue';
import {
	defaultSchemaDecoratorsCollection,
	defaultSchemaProviders,
	defaultPropertyRenderers,
} from '.';
import { sync } from 'vuex-pathify';
import { omit } from 'lodash';
import { JsonForms, JsonFormsChangeEvent } from '@jsonforms/vue2';
import { defineComponent } from '../../util/vue';
import { getVariableName } from '../../model/uischema';
import { tryFindByUUID } from '../../util/schemasUtil';

import {
	PropertiesServiceImpl,
	PropertySchemasDecorator,
	PropertySchemasProvider,
} from './propertiesService';
import _ from 'lodash';
const PropertiesPanel = defineComponent({
	name: 'PropertiesPanel',
	props: {},
	components: {
		JsonForms,
		PropertiesPanelDynamic,
	},
	data() {
		return {
			showAdvancedRule: false,
			panel: [0, 1, 2, 3, 4],
			generalData: {},
			schemasCollection: undefined,
			hasRule: false,
			uiElement: null,
			renderers: defaultPropertyRenderers,
			propertiesService: null,
		};
	},
	computed: {
		schema: sync('app/editor@schema'),
		uischema: sync('app/editor@uiSchema'),
		selectedElement: sync('app/editor@element'),
		schemaPropertiesLive: sync('app/editor@selectedElement'),
	},
	mounted() {
		const propertiesServiceProvider = (
			schemaProviders: PropertySchemasProvider[],
			schemaDecorators: PropertySchemasDecorator[]
		) => new PropertiesServiceImpl(schemaProviders, schemaDecorators);
		this.propertiesService = propertiesServiceProvider(
			defaultSchemaProviders,
			defaultSchemaDecoratorsCollection
		);
		this.setSelection(this.selectedElement.selected);
	},
	watch: {
		selectedElement(newSelection, oldSelection) {
			this.setSelection(newSelection.selected);
		},
	},
	methods: {
		setSelection: function (newSelection) {
			this.uiElement = tryFindByUUID(this.uischema, newSelection);
			this.generalData = omit(this.uiElement, [
				'uuid',
				'parent',
				'elements',
				'linkedSchemaElement',
				'options.detail',
				'scope',
				'type',
			]);

			if (this.uiElement) {
				// design properties
				const linkedSchemaUUID = this.uiElement.linkedSchemaElement;
				const elementSchema =
					linkedSchemaUUID && this.schema
						? tryFindByUUID(this.schema, linkedSchemaUUID)
						: undefined;

				this.generalData['variable'] = getVariableName(this.uiElement);
				if (elementSchema) {
					this.generalData['required'] =
						this.schema.schema.required &&
						this.schema.schema.required.includes(
							getVariableName(this.uiElement)
						);
					if (elementSchema.schema.description) {
						this.generalData['description'] = elementSchema.schema.description
							? elementSchema.schema.description
							: '';
					}
					if (elementSchema.schema.maxLength) {
						this.generalData['maxLength'] = elementSchema.schema.maxLength
							? elementSchema.schema.maxLength
							: '';
					}
					(this.generalData['readOnly'] = elementSchema.schema.readOnly
						? elementSchema.schema.readOnly
						: false),
						(this.schemasCollection = this.propertiesService.getProperties(
							this.uiElement,
							elementSchema
						));
				}
				this.generalData['items'] = this.generalData['options'];
			}
		},
		updateGeneralSettings: function (event: JsonFormsChangeEvent) {
			const elementSchema = this.findElementSchema();
			// variable
			if (this.uiElement && event.errors.length === 0) {
				if (
					event.data.variable &&
					this.generalData['variable'] !== event.data.variable
				) {
					this.$store.dispatch('app/updateSchemaVariable', {
						elementUUID: this.uiElement.uuid,
						newVariable: event.data.variable,
					});
					this.$store.dispatch('locales/updateProperty', {
						oldProperty: elementSchema ? elementSchema.key : '',
						newProperty: event.data.variable,
					});
					this.generalData['variable'] = event.data.variable;
				}
				// required
				if (
					typeof event.data.required !== 'undefined' &&
					this.generalData['required'] !== event.data.required
				) {
					this.$store.dispatch('app/updateSchemaRequired', {
						elementUUID: this.uiElement.uuid,
						required: event.data.required,
					});

					this.generalData['required'] = event.data.required;
				}
				// readOnly
				if (
					typeof event.data.readOnly !== 'undefined' &&
					this.generalData['readOnly'] !== event.data.readOnly
				) {
					this.$store.dispatch('app/updateSchemaReadOnly', {
						elementUUID: this.uiElement.uuid,
						readOnly: event.data.readOnly,
					});

					this.generalData['readOnly'] = event.data.readOnly;
				}
				//Properties for datePicker
				if (event.data.minDate) {
					this.$store.dispatch('app/updateSchemaMinDate', {
						elementUUID: this.uiElement.uuid,
						minDate: event.data.minDate,
					});
					this.generalData['minDate'] = event.data.minDate;
				}
				if (event.data.maxDate) {
					this.$store.dispatch('app/updateSchemaMaxDate', {
						elementUUID: this.uiElement.uuid,
						maxDate: event.data.maxDate,
					});
					this.generalData['maxDate'] = event.data.maxDate;
				}
				if (event.data.defaultDate) {
					this.$store.dispatch('app/updateSchemaDefaultDate', {
						elementUUID: this.uiElement.uuid,
						defaultDate: event.data.defaultDate,
					});
					this.generalData['defaultDate'] = event.data.defaultDate;
				}
				// label
				if (
					event.data.label &&
					this.generalData['label'] !== event.data.label
				) {
					this.$store.dispatch('app/updateUISchemaElement', {
						elementUUID: this.uiElement.uuid,
						changedProperties: { label: event.data.label },
					});
					this.generalData['label'] = event.data.label;
				}
				// options
				if (
					event.data.options &&
					this.generalData['options'] !== event.data.options
				) {
					this.$store.dispatch('app/updateUISchemaElement', {
						elementUUID: this.uiElement.uuid,
						changedProperties: { options: event.data.options },
					});
					this.generalData['options'] = event.data.options;
				}
				// description
				if (
					event.data.description &&
					this.generalData['description'] !== event.data.description
				) {
					this.$store.dispatch('app/updateSchemaElement', {
						elementUUID: this.uiElement.uuid,
						changedProperties: {
							description: event.data.description,
						},
					});
					this.generalData['description'] = event.data.description;
				}
				// maxLength
				if (
					event.data.maxLength &&
					this.generalData['maxLength'] !== event.data.maxLength
				) {
					this.$store.dispatch('app/updateSchemaElement', {
						elementUUID: this.uiElement.uuid,
						changedProperties: { maxLength: event.data.maxLength },
					});
					this.generalData['maxLength'] = event.data.maxLength;
				}
			}
		},
		/**
		 * Populate field control with enum options
		 *
		 */
		populateFieldEnum: function () {
			const keys = Array.from(this.schema.properties.keys());
			this.schemasCollection.get(
				'rulesEditor'
			).schema.properties.rules.items.properties.field.enum = keys;
		},
		findElementSchema() {
			const linkedSchemaUUID = this.uiElement.linkedSchemaElement;
			const elementSchema =
				linkedSchemaUUID && this.schema
					? tryFindByUUID(this.schema, linkedSchemaUUID)
					: undefined;
			let ele;
			for (const [key, value] of this.schema.properties) {
				if (_.isEqual(value, elementSchema)) {
					ele = {
						key: key,
						value: value,
					};
				}
			}
			return ele;
		},
	},
});
export default PropertiesPanel;
</script>
