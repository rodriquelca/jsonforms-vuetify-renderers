<template>
  <div>
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn large icon dark v-bind="attrs" v-on="on">
          <v-icon size="30" color="primary">mdi-eye</v-icon>
        </v-btn>
      </template>

      <v-list dense>
        <v-list-item
          link
          v-for="(item, index) in items"
          :key="index"
          @click="onClickMenu(item)"
        >
          <v-icon class="pe-2" small v-text="item.icon"></v-icon>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <component
          v-bind:is="component"
          v-if="dialog"
          type="iPhone8"
          background="#444"
          :autoscale="false"
          picker
          border
        >
          <v-toolbar dark color="primary" dense>
            <v-btn icon dark @click="dialog = false">
              <v-icon>mdi-arrow-u-left-top-bold</v-icon>
            </v-btn>
          </v-toolbar>

          <json-forms
            class="pa-5"
            :data="data"
            :key="key"
            :schema="useSchema"
            :uischema="useUiSchema"
            :renderers="renderers"
            @change="onChange"
            :i18n="i18n"
            :cells="renderers"
            v-bind:style="getCurrentFont"
          />
        </component>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Device from 'vue-device';
import { JsonFormsI18nState } from '@jsonforms/core';
import { JsonForms, JsonFormsChangeEvent } from '@jsonforms/vue2';
import { useExportSchema } from '../util';
import { generateEmptyData } from '../model';
import { extendedVuetifyRenderers } from '@jsonforms/vue2-vuetify';
import _ from 'lodash';
import store from '../store';
import { JReactivex as JReact, JForm as JF } from '@jsonforms/vue2';
import { sync } from 'vuex-pathify';
export default {
  name: 'dymaform-preview',
  components: {
    JsonForms,
    Device,
  },
  props: {},
  data() {
    return {
      key: 1,
      items: [
        { title: 'Mobile', icon: 'mdi-cellphone', component: 'device' },
        { title: 'Browser', icon: 'mdi-application-outline', component: 'div' },
      ],
      dialog: false,
      component: 'div',
      data: this.$store.get('preview/data'),
      locale: sync('preview/locale'),
      i18n: {
        locale: this.locale || 'en',
        translate: this.createTranslator(this.locale || 'en'),
      } as JsonFormsI18nState,
      renderers: extendedVuetifyRenderers,
    };
  },
  computed: {
    useUiSchema: sync('preview/uiSchema'),
    useSchema: function () {
      return useExportSchema(this.$store.get('preview/schema'));
    },
    previewData: function () {
      return generateEmptyData(this.$store.get('preview@schema'), {});
    },
    getCurrentFont(): any {
      return {
        'font-family': this.$store.getters['themes/getFontFamilyTheme'],
      };
    },
  },
  watch: {
    locale(nValue: string): void {
      this.i18n.locale = nValue;
      this.i18n.translate = this.createTranslator(nValue || 'en');
    },
  },
  /**
   * Provide services for JSONFORM
   */
  provide: () => {
    return {
      store: store,
      JReactivex: JReact,
      JForm: new JF({
        data: {
          store: store,
        },
      }),
    };
  },
  methods: {
    getFont(): string {
      return this.$store.getters['themes/getFontFamilyTheme'];
    },
    /**
     * Copy schemasfrom editor to preview
     */
    copySchemasFromEditorToPreview(): void {
      this.$store.dispatch(
        'preview/setSchema',
        this.$store.get('app/editor@schema')
      );
      this.$store.dispatch(
        'preview/setUiSchema',
        this.$store.get('app/editor@uiSchema')
      );
      this.$store.dispatch(
        'preview/setLocale',
        this.$store.get('app/jsonforms@locale')
      );
    },
    /**
     * Create translator for JSON FORMS based in store locale
     */
    createTranslator(): any {
      let i18n = this.$store.get('locales');
      const store = this.$store;
      return (
        key: string,
        defaultMessage: string | undefined
      ): string | undefined => {
        let locale = store.get('preview/locale');
        return (
          _.get(
            locale === 'en' ? i18n['en']['content'] : i18n[locale]['content'],
            key
          ) ?? defaultMessage
        );
      };
    },
    /**
     * On change JSON FORM save the data in store
     */
    onChange(event: JsonFormsChangeEvent): void {
      this.$store.set('preview/data', event.data || {});
    },
    /**
     * On click in icon preview
     * Load the schemas and refresh the view
     */
    onClickMenu(item): void {
      this.component = item.component ? item.component : 'div';
      this.copySchemasFromEditorToPreview();
      this.createTranslator(this.$store.get('app/jsonforms@locale'));
      this.dialog = !this.dialog;
      this.key++;
    },
  },
};
</script>
