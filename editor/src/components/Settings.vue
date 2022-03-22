<template>
  <div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on: onTooltip }">
        <v-btn
          large
          icon
          dark
          @click.stop="
            settings = !settings;
            selectedElement = undefined;
          "
          v-on="onTooltip"
        >
          <v-icon size="30" color="primary">mdi-cog</v-icon>
        </v-btn>
      </template>
      Settings
    </v-tooltip>
    <v-navigation-drawer
      v-model="settings"
      :right="!$vuetify.rtl"
      app
      hide-overlay
      temporary
      width="300"
    >
      <v-toolbar flat>
        <v-toolbar-title>Settings</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon @click="settings = false">
            <v-icon>$close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-divider />
      <PropertiesPanel
        v-if="selectedElement"
        :renderers="propertyRenderers"
        :schema="editorSchema || false"
        :uischema="editorUischema || false"
        :propertiesService="propertiesService"
      />
      <CommonSettings v-else />

      <!-- <v-divider /> -->
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
import { sync } from 'vuex-pathify';

import {
  defaultSchemaDecorators,
  defaultSchemaProviders,
  defaultPropertyRenderers,
  schemaVariableDecorators,
  schemaRequiredDecorators,
  schemaDatePropertiesDecorators,
} from '../views/editor/properties-panel';
import PropertiesPanel from '../views/editor/properties-panel';
import {
  PropertiesServiceImpl,
  PropertySchemasDecorator,
  PropertySchemasProvider,
} from '../views/editor/properties-panel/propertiesService';
import CommonSettings from './CommonSettings.vue';
export default {
  name: 'Settings',
  components: {
    PropertiesPanel,
    CommonSettings,
  },
  computed: {
    validationMode: sync('app/jsonforms@validationMode'),
    hideRequiredAsterisk: sync('app/jsonforms@config.hideRequiredAsterisk'),
    showUnfocusedDescription: sync(
      'app/jsonforms@config.showUnfocusedDescription'
    ),
    restrict: sync('app/jsonforms@config.restrict'),
    readonly: sync('app/jsonforms@readonly'),
    locale: sync('app/jsonforms@locale'),
    settings: sync('app/editor@settings'),
    editorSchema: sync('app/editor@schema'),
    editorUischema: sync('app/editor@uiSchema'),
    selectedElement: sync('app/editor@selectedElement'),
  },

  data: function () {
    return {
      validationModes: [
        { text: 'Validate And Show', value: 'ValidateAndShow' },
        { text: 'Validate And Hide', value: 'ValidateAndHide' },
        { text: 'No Validation', value: 'NoValidation' },
      ],
      locales: [
        { text: 'English (en)', value: 'en' },
        { text: 'German (de)', value: 'de' },
      ],
      propertyRenderers: defaultPropertyRenderers,
      schemaDecorators: defaultSchemaDecorators,
      propertiesService: {},
    };
  },
  mounted() {
    const propertiesServiceProvider = (
      schemaProviders: PropertySchemasProvider[],
      schemaDecorators: PropertySchemasDecorator[],
      schemaVariableDecorators: PropertySchemasDecorator[],
      schemaRequiredDecorators: PropertySchemasDecorator[],
      schemaDatePropertiesDecorators: PropertySchemasDecorator[]
    ) =>
      new PropertiesServiceImpl(
        schemaProviders,
        schemaDecorators,
        schemaVariableDecorators,
        schemaRequiredDecorators,
        schemaDatePropertiesDecorators
      );
    this.propertiesService = propertiesServiceProvider(
      defaultSchemaProviders,
      defaultSchemaDecorators,
      schemaVariableDecorators,
      schemaRequiredDecorators,
      schemaDatePropertiesDecorators
    );
  },
};
</script>
