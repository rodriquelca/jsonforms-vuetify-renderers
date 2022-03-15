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
          <v-icon size="30" color="primary">mdi-eye</v-icon>
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
          <v-spacer></v-spacer>
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card>
          <json-forms
            v-if="resolvedSchema.resolved && resolvedSchema.error === undefined"
            :data="{}"
            :schema="useSchema"
            :uischema="useUiSchema"
            :renderers="renderers"
            :cells="renderers"
          />
          <v-container v-else>
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
import { extendedVuetifyRenderers } from '@jsonforms/vue2-vuetify';
import { VariableBuilder } from './../util/mixutils.js';
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
      dialog: false,
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
      this.buildVariables(this.$store.get('app/editor@uiSchema'));
      return useExportUiSchema(this.$store.get('app/editor@uiSchema'));
    },
    useSchema: function () {
      return useExportSchema(this.$store.get('app/editor@schema'));
    },
  },
  mounted() {
    this.resolveSchema(useExportSchema(this.$store.get('app/editor@schema')));
  },
  methods: {
    onChange(event: JsonFormsChangeEvent): void {
      this.$emit('change', event);
    },
    buildVariables(json: JSON): void {
      let y = VariableBuilder.build(json);
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
