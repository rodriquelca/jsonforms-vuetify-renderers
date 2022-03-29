<template>
  <div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          large
          icon
          dark
          v-bind="attrs"
          v-on="on"
          @click.stop="dialog = !dialog"
        >
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
              v-if="
                resolvedSchema.resolved && resolvedSchema.error === undefined
              "
              :data="previewData"
              :key="key"
              :schema="useSchema"
              :uischema="useUiSchema"
              :renderers="renderers"
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
import { JsonSchema, JsonFormsI18nState } from '@jsonforms/core';
import { JsonForms, JsonFormsChangeEvent } from '@jsonforms/vue2';
import JsonRefs from 'json-refs';
import { createTranslator } from '../i18n';
import { useExportSchema, useExportUiSchema } from '../util';
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
  props: {
    locale: {
      required: false,
      type: String,
      default: 'en',
    },
  },
  data() {
    return {
      key: 1,
      dialog: false,
      data: store.get('app/data'),
      resolvedSchema: {
        schema: undefined,
        resolved: false,
        error: undefined,
      } as ResolvedSchema,
      i18n: {
        locale: this.locale,
        translate: createTranslator(this.locale),
      } as JsonFormsI18nState,
      renderers: extendedVuetifyRenderers,
      modeView: 12,
    };
  },
  watch: {
    locale(newLocale: string): void {
      this.i18n.locale = newLocale;
      this.i18n.translate = createTranslator(newLocale);
    },
  },
  computed: {
    useUiSchema: function () {
      return this.$store.get('app/editor@uiSchema');
    },
    useSchema: function () {
      return useExportSchema(this.$store.get('app/editor@schema'));
    },
    previewData: function () {
      return generateEmptyData(this.$store.get('app/editor@schema'), {});
    },
  },
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
  mounted() {
    this.resolveSchema(useExportSchema(this.$store.get('app/editor@schema')));
  },
  methods: {
    onClick() {
      this.key++;
    },
    onChange(event: JsonFormsChangeEvent): void {
      this.$store.set('app/data', event.data || {});
    },
    resolveSchema(schema?: JsonSchema): void {
      const resolvedSchema = this.resolvedSchema;
      resolvedSchema.schema = undefined;
      resolvedSchema.resolved = false;
      resolvedSchema.error = undefined;

      if (schema) {
        JsonRefs.resolveRefs(schema).then(
          function (res) {
            resolvedSchema.schema = res.resolved;
            resolvedSchema.resolved = true;
          },
          function (err: Error) {
            resolvedSchema.resolved = true;
            resolvedSchema.error = err.message;
          }
        );
      } else {
        // nothing to resolve
        resolvedSchema.resolved = true;
      }
    },
  },
};
</script>
