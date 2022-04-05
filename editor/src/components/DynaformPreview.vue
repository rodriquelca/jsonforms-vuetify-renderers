<template>
  <div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn large icon dark v-bind="attrs" v-on="on">
          <v-icon size="30" color="primary" @click="onClick">mdi-eye</v-icon>
        </v-btn>
      </template>
      Preview
    </v-tooltip>

    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon dark v-bind="attrs" v-on="on" @click="modeView = 4">
                <v-icon>mdi-cellphone</v-icon>
              </v-btn>
            </template>
            <span>Smartphone</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon dark v-bind="attrs" v-on="on" @click="modeView = 6">
                <v-icon>mdi-tablet-android</v-icon>
              </v-btn>
            </template>
            <span>Tablet</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon dark v-bind="attrs" v-on="on" @click="modeView = 12">
                <v-icon>mdi-monitor</v-icon>
              </v-btn>
            </template>
            <span>Desktop</span>
          </v-tooltip>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-col :cols="modeView">
          <v-card>
            <json-forms
              :data="data"
              :key="key"
              :schema="useSchema"
              :uischema="useUiSchema"
              :renderers="renderers"
              @change="onChange"
              :i18n="i18n"
              :cells="renderers"
            />
            <v-container>
              <v-row
                v-if="!resolvedSchema.resolved"
                class="fill-height"
                align-content="center"
                justify="center"
              >
                <v-col class="text-subtitle-1 text-center" cols="12">
                  Resolving Schema Refs
                </v-col>
                <v-col cols="6">
                  <v-progress-linear
                    indeterminate
                    rounded
                    height="6"
                  ></v-progress-linear>
                </v-col>
              </v-row>
              <v-row
                v-else-if="resolvedSchema.error !== undefined"
                class="fill-height"
                align-content="center"
                justify="center"
              >
                <v-col class="text-subtitle-1 text-center" cols="12">
                  <v-alert color="red" dark>
                    {{ resolvedSchema.error }}
                  </v-alert>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { ResolvedSchema } from '@/core/types';
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
  },
  props: {},
  data() {
    return {
      key: 1,
      dialog: false,
      data: this.$store.get('preview/data'),
      resolvedSchema: {
        schema: {},
        resolved: true,
        error: undefined,
      } as ResolvedSchema,
      locale: sync('preview/locale'),
      i18n: {
        locale: this.locale || 'en',
        translate: this.createTranslator(this.locale || 'en'),
      } as JsonFormsI18nState,
      renderers: extendedVuetifyRenderers,
      modeView: 12,
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
  },
  watch: {
    locale(nValue) {
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
    /**
     * On click in icon preview
     * Load the schemas and refresh the view
     */
    onClick() {
      this.copySchemasFromEditorToPreview();
      this.createTranslator(this.$store.get('app/jsonforms@locale'));
      this.dialog = !this.dialog;
      this.key++;
    },
    /**
     * Copy schemasfrom editor to preview
     */
    copySchemasFromEditorToPreview() {
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
    createTranslator() {
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
  },
};
</script>
