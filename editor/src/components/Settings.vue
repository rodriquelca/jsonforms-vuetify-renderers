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
            key++;
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
      width="30%"
    >
      <v-toolbar flat>
        <v-toolbar-title>Settings</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon @click="settings = false">
            <v-icon> mdi-cog</v-icon>
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
      <CommonSettings :key="key" v-else />

      <!-- <v-divider /> -->
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
import { sync } from 'vuex-pathify';

import {
  defaultSchemaDecoratorsCollection,
  defaultSchemaProviders,
  defaultPropertyRenderers,
} from '../views/editor/properties-panel';
import PropertiesPanel from '../views/editor/properties-panel';
import {
  PropertiesServiceImpl,
  PropertySchemasDecorator,
  PropertySchemasProvider,
} from '../views/editor/properties-panel/propertiesService';
import CommonSettings from './CommonSettings.vue';
import store from '../store';
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
      key: 1,
      editorSchemaReact: sync('app/editor@schema'),
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
      schemaDecoratorsCollection: defaultSchemaDecoratorsCollection,
      propertiesService: {},
    };
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
  },
  provide: () => {
    return {
      store: store,
    };
  },
};
</script>
