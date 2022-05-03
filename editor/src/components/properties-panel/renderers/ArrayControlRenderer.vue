<template>
    <v-card v-if="control.visible" class="pa-0 ma-0">
        <v-card-title class="pa-0 ma-0">
            <v-toolbar flat :class="styles.arrayList.toolbar">
                <v-toolbar-title class="overline">{{
                    computedLabel
                }}</v-toolbar-title>
                <v-spacer></v-spacer>

                <v-tooltip bottom>
                    <template v-slot:activator="{ on: onTooltip }">
                        <v-btn
                            fab
                            text
                            elevation="0"
                            small
                            :aria-label="`Add to ${control.label}`"
                            v-on="onTooltip"
                            :class="styles.arrayList.addButton"
                            :disabled="
                                !control.enabled ||
                                (appliedOptions.restrict &&
                                    arraySchema !== undefined &&
                                    arraySchema.maxItems !== undefined &&
                                    control.data.length >= arraySchema.maxItems)
                            "
                            @click="addButtonClick"
                        >
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </template>
                    {{ `Add to ${control.label}` }}
                </v-tooltip>
            </v-toolbar>
        </v-card-title>
        <v-card-text class="pa-0 ma-0">
            <v-container class="pa-0 ma-0">
                <v-card :class="styles.arrayList.item">
                    <v-list-item
                        two-line
                        v-for="(element, index) in control.data"
                        :key="`${control.path}-${index}`"
                    >
                        <v-list-item-content>
                            <v-list-item-title class="text-h5 mb-1">
                                <v-container py-0>
                                    <v-row>
                                        <v-spacer></v-spacer>
                                        <v-col cols="3">
                                            <v-tooltip bottom>
                                                <template
                                                    v-slot:activator="{
                                                        on: onTooltip,
                                                    }"
                                                >
                                                    <v-btn
                                                        v-on="onTooltip"
                                                        fab
                                                        text
                                                        elevation="0"
                                                        small
                                                        class="
                                                            v-expansion-panel-header__icon
                                                        "
                                                        aria-label="Delete"
                                                        :class="
                                                            styles.arrayList
                                                                .itemDelete
                                                        "
                                                        :disabled="
                                                            !control.enabled ||
                                                            (appliedOptions.restrict &&
                                                                arraySchema !==
                                                                    undefined &&
                                                                arraySchema.minItems !==
                                                                    undefined &&
                                                                control.data
                                                                    .length <=
                                                                    arraySchema.minItems)
                                                        "
                                                        @click.native="
                                                            removeItemsClick(
                                                                $event,
                                                                [index]
                                                            )
                                                        "
                                                    >
                                                        <v-icon
                                                            class="notranslate"
                                                            >mdi-delete</v-icon
                                                        >
                                                    </v-btn>
                                                </template>
                                                Delete
                                            </v-tooltip>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                <dispatch-renderer
                                    :schema="control.schema"
                                    :uischema="foundUISchema"
                                    :path="
                                        composePaths(control.path, `${index}`)
                                    "
                                    :enabled="control.enabled"
                                    :renderers="control.renderers"
                                    :cells="control.cells"
                                />
                            </v-list-item-subtitle>
                            <v-divider class="pa-0 ma-0"></v-divider>
                        </v-list-item-content>
                    </v-list-item>
                </v-card>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import {
    JsonFormsRendererRegistryEntry,
    ControlElement,
    rankWith,
    isPrimitiveArrayControl,
    isObjectArrayControl,
    or,
    composePaths,
    createDefaultValue,
    UISchemaElement,
    findUISchema,
    Resolve,
    JsonSchema,
} from '@jsonforms/core';
import { defineComponent } from '../../../util/vue';
import {
    DispatchRenderer,
    rendererProps,
    useJsonFormsArrayControl,
    RendererProps,
} from '@jsonforms/vue2';
import { useVuetifyArrayControl } from '@jsonforms/vue2-vuetify';
import {
    VCard,
    VCardTitle,
    VCardText,
    VRow,
    VCol,
    VContainer,
    VToolbar,
    VToolbarTitle,
    VTooltip,
    VIcon,
    VBtn,
    VAvatar,
    VSpacer,
    VExpansionPanels,
    VExpansionPanel,
    VExpansionPanelHeader,
    VExpansionPanelContent,
    VTemplate,
    Vdivider,
} from 'vuetify/lib';
import { ErrorObject } from 'ajv';

const controlRenderer = defineComponent({
    name: 'array-layout-renderer',
    components: {
        DispatchRenderer,
        VCard,
        VCardTitle,
        VCardText,
        VAvatar,
        VRow,
        VCol,
        VToolbar,
        VToolbarTitle,
        VTooltip,
        VIcon,
        VBtn,
        VSpacer,
        VExpansionPanels,
        VExpansionPanel,
        VExpansionPanelHeader,
        VExpansionPanelContent,
        VContainer,
        VTemplate,
        Vdivider,
    },
    props: {
        ...rendererProps<ControlElement>(),
    },
    setup(props: RendererProps<ControlElement>) {
        return useVuetifyArrayControl(useJsonFormsArrayControl(props));
    },
    computed: {
        noData(): boolean {
            return !this.control.data || this.control.data.length === 0;
        },
        foundUISchema(): UISchemaElement {
            return findUISchema(
                this.control.uischemas,
                this.control.schema,
                this.control.uischema.scope,
                this.control.path,
                undefined,
                this.control.uischema,
                this.control.rootSchema
            );
        },
        arraySchema(): JsonSchema | undefined {
            return Resolve.schema(
                this.control.rootSchema,
                this.control.uischema.scope,
                this.control.rootSchema
            );
        },
    },
    methods: {
        composePaths,
        createDefaultValue,
        addButtonClick() {
            this.addItem(
                this.control.path,
                createDefaultValue(this.control.schema)
            )();
        },
        moveUpClick(event: Event, toMove: number): void {
            event.stopPropagation();
            this.moveUp?.(this.control.path, toMove)();
        },
        moveDownClick(event: Event, toMove: number): void {
            event.stopPropagation();
            this.moveDown?.(this.control.path, toMove)();
        },
        removeItemsClick(event: Event, toDelete: number[]): void {
            event.stopPropagation();
            this.removeItems?.(this.control.path, toDelete)();
        },
        childErrors(index: number): ErrorObject[] {
            return this.control.childErrors.filter((e) =>
                e.instancePath.startsWith(
                    this.composePaths(this.control.path, `${index}`)
                )
            );
        },
    },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
    renderer: controlRenderer,
    tester: rankWith(4, or(isObjectArrayControl, isPrimitiveArrayControl)),
};
</script>

<style scoped>
.notranslate {
    transform: none !important;
}
.v-label {
    font-size: 9px !important;
}
</style>
