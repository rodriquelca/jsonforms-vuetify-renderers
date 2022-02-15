<template>
  <div>
    <json-forms
      v-if="resolvedSchema.resolved && resolvedSchema.error === undefined"
      :data="{}"
      :schema="resolvedSchema.schema"
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
  </div>
</template>

<script lang="ts">
import { ResolvedSchema } from '@/core/types';
import { JsonSchema, JsonFormsI18nState } from '@jsonforms/core';
import { JsonForms, JsonFormsChangeEvent } from '@jsonforms/vue2';
import JsonRefs from 'json-refs';
import { createTranslator } from '../i18n';
import { useExportSchema, useExportUiSchema } from '../util';
import { extendedDynaformRenderers } from '../renderers/dynaformControls';
import {VariableBuilder} from "./../util/mixutils.js";
import { sync } from 'vuex-pathify';
import _ from 'lodash';
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
      resolvedSchema: {
        schema: undefined,
        resolved: false,
        error: undefined,
      } as ResolvedSchema,
      i18n: {
        locale: this.locale,
        translate: createTranslator(this.locale),
      } as JsonFormsI18nState,
      renderers: extendedDynaformRenderers,
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
      console.log(y);
    },
    findVariables(j:JSON, str: string) {
      /*let json = {
        'var1': 'Variable1',
        'var2': 'Variable2',
        'var3': 'Variable3',
        'var4': 'Variable4',
        'var5': 'Variable5',
        'var6': 'Variable6',
        'var7': 'Variable7',
      };

      let res = str.match(/@@[A-Za-z0-9]+/g);
      res?.forEach((el: string) => {
        let r:string = el.replace('@@', '') ;
        if(_.has(json, r)){
          j[str] =  
        }
        

      });*/
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
