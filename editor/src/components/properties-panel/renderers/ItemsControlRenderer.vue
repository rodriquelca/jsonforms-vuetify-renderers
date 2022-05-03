<template>
    <v-card class="mx-auto" outlined :key="key">
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
                        :key="key"
                        v-model="mainOption"
                        class="vpm-item-list caption"
                        label="Fill the items field with"
                        single-line
                        dense
                        :items="mainOptions"
                    ></v-combobox>
                </v-col>
            </v-row>
            <div
                v-if="
                    mainOption.value == 'advanced' ||
                    mainOption.value == 'dynamic'
                "
            >
                <v-combobox
                    v-model="dependencies"
                    :items="editorScopes"
                    :search-input.sync="dependenciesSearch"
                    hide-selected
                    label="This field depends of:"
                    multiple
                    persistent-hint
                    small-chips
                    class="vpm-item-list caption"
                >
                    <template v-slot:no-data>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>
                                    No results matching "<strong>{{
                                        dependenciesSearch
                                    }}</strong>
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </template>
                </v-combobox>
            </div>

            <v-container v-if="mainOption.value == 'static'">
                <list-options
                    :key="keys.static"
                    :options="items"
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
                <dynamic-items
                    :key="keys.dynamic"
                    ref="dynamic"
                    :data="request"
                >
                </dynamic-items>
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
                    :key="key"
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
import { defineComponent, inject, computed, ref } from '../../../util/vue';

import {
    rendererProps,
    useJsonFormsControl,
    RendererProps,
    JVariables,
} from '@jsonforms/vue2';
import { useVuetifyControl } from '@jsonforms/vue2-vuetify';
import ListOptions from '../../Settings/ListOptions.vue';
import DynamicItems from '../../Settings/DynamicItems.vue';
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
        keys: {
            static: 1,
            dynamic: 1,
        },
        key: 1,
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

        items: null,
        request: null,
        // ComboBox dependencies
        dependencies: [],
        dependenciesSearch: null,

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
    watch: {
        control: function (val) {
            this.setData(val.data);
        },
    },
    setup(props: RendererProps<ControlElement>) {
        let editorScopes = computed(() => {
            let store: any = inject('store');
            if (!store) return [];
            return store.getters['app/getScopesEditor'];
        });

        return {
            ...useVuetifyControl(
                useJsonFormsControl(props),
                (value) => value || undefined
            ),
            editorScopes,
        };
    },
    methods: {
        setData(data: any) {
            //Reset form
            if (!data || !data.source) {
                this.mainOption = this.mainOptions[0];
                this.resetStaticItems();
                this.resetDynamicItems();
                this.resetDependencies();
                return;
            }

            //Set the options without reset
            this.setMainOption(data.source);
            this.setStaticItems(data.items);
            this.setDynamicItems(data.request);
            this.setDependencies(data.dependencies);
        },
        resetDynamicItems() {
            this.keys.dynamic = this.keys.dynamic + 1;
            this.request = {
                url: '',
                method: 'GET',
                params: null,
                headers: null,
                body: null,
                output: {
                    path: '',
                    value: '',
                    label: '',
                },
            };
        },
        resetStaticItems() {
            this.keys.static = this.keys.static + 1;
            this.items = null;
        },
        /**
         * Set the main option::: Static options, Dynamic Options, Advanced use
         */
        setMainOption(opt: string) {
            switch (opt) {
                case 'static':
                    this.mainOption = this.mainOptions[0];
                    break;
                case 'advanced':
                    this.mainOption = this.mainOptions[2];
                    break;
                case 'dynamic':
                    this.mainOption = this.mainOptions[1];
                    break;
            }
        },
        setStaticItems(items: any) {
            if (_.isArray(items)) {
                this.keys.static = this.keys.static + 1;
                this.items = items;
            }
        },
        setDynamicItems(request: any) {
            this.request = request;
        },
        setDependencies(deps: any) {
            this.dependencies = deps;
        },
        resetDependencies() {
            this.dependencies = [];
        },
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
            this.handleChange('items.items', val);

            this.handleChange('options.source', 'advanced');
            this.handleChange('options.dependencies', this.dependencies);

            this.handleChange('items.source', 'advanced');
            this.handleChange('items.dependencies', this.dependencies);
        },
        onSaveJson() {
            let data = this.$refs['static'].getData();
            this.handleChange('options.source', 'static');
            this.handleChange('items.source', 'static');
            this.handleChange('options.items', data);
            this.handleChange('items.items', data);
        },
        processParams(data) {
            let values,
                url,
                params = this.convertArrayToObject(data.params);
            values = JVariables.removeBraces(params);
            url = new URLSearchParams(params).toString();
            _.forEach(values, (v) => {
                url = url.replaceAll(v, '${' + v + '}');
            });
            return url == '=' ? '' : '+`' + url + '`';
        },
        /**
         * Convert Array[{key, value}] to object{key1:value1}...
         * @param data
         */
        convertArrayToObject(data) {
            return Object.assign(
                {},
                ...data.map((p) => ({ [p.key]: p.value }))
            );
        },
        onSaveDynamic(items: any) {
            let url,
                functionItems,
                data = this.$refs['dynamic'].getData(),
                headers = this.convertArrayToObject(data.headers),
                body = this.convertArrayToObject(data.body);

            JVariables.replaceBraces(headers, '`${', '}');
            JVariables.replaceBraces(body, '${', '}');
            url = this.processParams(data);

            if (data.method == 'GET') {
                functionItems = `return fetch('${data.url}?'${url}, {
          method: '${data.method}',
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
            } else {
                functionItems = `return fetch('${data.url}?' ${url}, {
          method: '${data.method}',
          body: \`${JSON.stringify(body)}\`,
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
            this.handleChange('items.request', data);
            this.handleChange('options.source', 'dynamic');
            this.handleChange('items.source', 'dynamic');
            this.handleChange('options.items', functionItems);
            this.handleChange('items.items', functionItems);
            this.handleChange('options.dependencies', this.dependencies);
            this.handleChange('items.dependencies', this.dependencies);
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
