<template>
    <v-container class="px-0 my-1" :fluid="true">
        <v-row no-gutters height="100%">
            <v-col cols="3"> </v-col>
            <v-col cols="9">
                <json-forms
                    :renderers="renderers"
                    :data="data"
                    :uischema="useExportUiSchema() || {}"
                    :schema="useExportSchema() || false"
                    height="500"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { JsonForms } from '@jsonforms/vue2';
import { defaultEditorRenderers } from '../../renderers';
import { useExportSchema } from '../../util';
import { createLayout } from '../../util/generators/uiSchema';
import { JReactivex as JReact, JFormE as JF } from '@jsonforms/vue2';

export default {
    name: 'DynaformEditor',
    props: {},
    components: {
        JsonForms,
    },
    data() {
        return {
            selection: '' as string,
            renderers: [],
            data: {},
        };
    },
    mounted() {
        this.renderers = defaultEditorRenderers;
        this.$store.dispatch('app/setSchema', {
            schema: {
                type: 'object',
                title: 'Dynaform',
                properties: {},
            },
        });
        this.$store.dispatch('app/setUiSchema', {
            uiSchema: createLayout('VerticalLayout'),
        });
    },
    methods: {
        useExportSchema() {
            return useExportSchema(this.$store.get('app/editor@schema'));
        },
        useExportUiSchema() {
            return this.$store.get('app/editor@uiSchema');
        },
    },
    provide() {
        return {
            store: this.$store,
            JReactivex: JReact,
            JForm: new JF({
                data: {
                    store: this.$store,
                },
            }),
        };
    },
};
</script>
