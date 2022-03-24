<template>
  <v-card class="mx-auto" outlined>
    <v-container>
      <h4 class="pb-2">Items</h4>
      <v-row dense>
        <v-col cols="3">
          <span class="caption grey--text text--darken-2"
            >Fill the field with :
          </span>
        </v-col>
        <v-col cols="4">
          <v-combobox
            v-model="mainOption"
            class="vpm-item-list caption"
            label="Fill the items field with"
            single-line
            dense
            :items="mainOptions"
          ></v-combobox>
        </v-col>
      </v-row>

      <v-container v-if="mainOption.value == 'static'">
        <list-options
          ref="static"
          value="value"
          label="label"
          valueTitle="Value"
          labelTitle="Label"
          :hideFooter="false"
        />
        <v-row>
          <v-col>
            <v-btn
              x-small
              depressed
              color="primary"
              @click="onSaveJson"
              class="float-end"
            >
              Apply
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-if="mainOption.value == 'dynamic'">
        <dynamic-items ref="dynamic"> </dynamic-items>
        <v-row>
          <v-col>
            <v-btn
              x-small
              depressed
              color="primary"
              @click="onSaveDynamic"
              class="float-end"
            >
              Apply
            </v-btn>
          </v-col>
        </v-row>
      </v-container>

      <v-container v-if="mainOption.value == 'advanced'">
        <span class="caption">{{ messages.advanced }}</span>
        <monaco-editor
          class="pt-2"
          ref="monacoEditorItems"
          :theme="$vuetify.theme.dark ? 'vs-dark' : 'vs'"
          :language="language"
          height="100"
          :options="{ minimap: { enabled: false }, fontSize: 10 }"
          v-model="ruleSchema"
          :editorBeforeMount="editorBeforeMount"
        >
        </monaco-editor>
        <v-row>
          <v-col>
            <v-btn
              x-small
              depressed
              color="primary"
              @click="onSaveAdvanced"
              class="float-end"
            >
              Apply
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <div class="red--text text--lighten-1" :hidden="!invalidJson">
        {{ invalidJsonMessage }}
      </div>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { ControlElement, rankWith, scopeEndsWith } from '@jsonforms/core';
import MonacoEditor from '@/components/MonacoEditor.vue';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { defineComponent } from '@vue/composition-api';
import {
  rendererProps,
  useJsonFormsControl,
  RendererProps,
} from '@jsonforms/vue2';
import { useVuetifyControl } from '@jsonforms/vue2-vuetify';
import ListOptions from '../../../../components/Settings/ListOptions.vue';
import DynamicItems from '../../../../components/Settings/DynamicItems.vue';
import _ from 'lodash';

const controlRenderer = defineComponent({
  name: 'items-control-renderer',
  props: {
    ...rendererProps<ControlElement>(),
  },
  components: {
    MonacoEditor,
    DynamicItems,
    ListOptions,
  },
  data: () => ({
    mainOption: {
      text: 'Static items',
      value: 'static',
    },
    mainOptions: [
      {
        text: 'Static items',
        value: 'static',
      },
      {
        text: 'Dynamic items',
        value: 'dynamic',
      },
      {
        text: 'Advanced use',
        value: 'advanced',
      },
    ],

    language: 'javascript',
    type: 'static',
    ruleDescription: 'Load static or dynamic options',
    ruleSchema: undefined as monaco.editor.ITextModel,
    monacoHeight: '200',
    monacoWidth: '200',
    invalidJson: false,
    invalidJsonMessage: 'Not a valid rule JSON.',
    messages: {
      advanced:
        'The field accepts a JSON, normal function JS or promise function JS ',
    },
  }),
  mounted() {
    this.ruleSchema = monaco.editor.createModel('[]', this.language);
  },
  setup(props: RendererProps<ControlElement>) {
    return useVuetifyControl(
      useJsonFormsControl(props),
      (value) => value || undefined
    );
  },
  methods: {
    editorBeforeMount() {
      this.$refs['monacoEditorItems']._render();
    },
    onSaveAdvanced() {
      let val;
      try {
        val = JSON.parse(this.ruleSchema.getValue());
      } catch (e) {
        val = this.ruleSchema.getValue();
      }
      this.handleChange('options.items', val);
      this.handleChange('options.source', 'advanced');
    },
    onSaveJson() {
      let data = this.$refs['static'].getData();
      this.handleChange('options.source', 'static');
      this.handleChange('options.items', data);
    },
    onSaveDynamic(items: any) {
      let data = this.$refs['dynamic'].getData();
      let headers = Object.assign(
        {},
        ...data.headers.map((p) => ({ [p.key]: p.value }))
      );
      let params = Object.assign(
        {},
        ...data.params.map((p) => ({ [p.key]: p.value }))
      );
      let body = Object.assign(
        {},
        ...data.body.map((p) => ({ [p.key]: p.value }))
      );

      let functionItems;
      if (data.method == 'GET') {
        functionItems = `return fetch('${
          data.url
        }?'+ (new URLSearchParams(${JSON.stringify(params)})).toString(), {
          method: '${data.method}',
          headers:${JSON.stringify(headers)},
      })
        .then((res) => res.json())
        .then((res) => {
          return (_.map(res${
            data.output.path == '' ? '' : '.' + data.output.path
          },(i)=>{
            debugger;
            return {
              value:i${data.output.value == '' ? '' : '.' + data.output.value},
              label:i${data.output.label == '' ? '' : '.' + data.output.label}
            };
          } 
          ));
        });`;
      } else {
        functionItems = `return fetch('${
          data.url
        }?'+ (new URLSearchParams(${JSON.stringify(params)})).toString(), {
          method: '${data.method}',
          body: '${JSON.stringify(body)}',
          headers:${JSON.stringify(headers)},
      })
        .then((res) => res.json())
        .then((res) => {
          return (_.map(res${
            data.output.path == '' ? '' : '.' + data.output.path
          },(i)=>{
            return {
             value:i${data.output.value == '' ? '' : '.' + data.output.value},
              label:i${data.output.label == '' ? '' : '.' + data.output.label}
            };
          } 
          ));
        });`;
      }

      this.handleChange('options.request', data);
      this.handleChange('options.source', 'dynamic');
      this.handleChange('options.items', functionItems);
    },
  },
});

export default controlRenderer;

export const ItemsControlRenderer = {
  renderer: controlRenderer,
  tester: rankWith(100, scopeEndsWith('items')),
};
</script>

<style>
.vpm-switch > div > div > .v-label {
  font-size: 12px !important;
}

.vpm-radio-group > div > div > div > div > .v-label {
  font-size: 12px !important;
}
</style>
