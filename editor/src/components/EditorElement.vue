<template>
    <v-card outlined :class="selectedStyle" @click="onClick">
        <div class="d-block">
            <Icon :type="wrappedElement.type" class="pr-1" />
            <span class="d-inline caption" v-if="ruleEffect">
                <span class="font-weight-bold">R</span>
                <span class="font-italic"> ({{ ruleEffect }})</span>
            </span>

            <div class="d-inline caption font-weight-bold v-opacity">
                {{
                    wrappedElement.scope
                        ? wrappedElement.scope.split('/').pop()
                        : ''
                }}
            </div>

            <v-btn
                fab
                x-small
                v-if="hover"
                @click="onRemove"
                class="float-right"
            >
                <v-icon> mdi-delete </v-icon>
            </v-btn>
            <v-btn
                fab
                x-small
                v-if="hover"
                @click="onRemove"
                class="float-right"
            >
                <v-icon> mdi-pencil-outline </v-icon>
            </v-btn>
        </div>

        <div class="d-block pt-2">
            <slot></slot>
        </div>
    </v-card>
</template>

<script lang="ts">
import { PropType } from 'vue';
import {
    EditorUISchemaElement,
    getUISchemaPath,
    hasChildren,
} from '../model/uischema';
import Icon from './Icon.vue';
import { sync } from 'vuex-pathify';
export default {
    name: 'EditorElement',
    props: {
        wrappedElement: {
            required: false,
            type: Object as PropType<EditorUISchemaElement>,
        },
    },
    components: {
        Icon,
    },
    data() {
        return {
            hover: false,
        };
    },
    computed: {
        ruleEffect() {
            return this.wrappedElement.rule?.effect.toLocaleUpperCase();
        },
        selectedElement: sync('app/editor@selectedElement'),
        selectedStyle() {
            return this.selectedElement === this.wrappedElement.uuid
                ? 'selected pa-2'
                : 'pa-2';
        },
    },
    watch: {
        selectedElement() {
            if (this.selectedElement === this.wrappedElement.uuid) {
                this.hover = true;
            } else {
                this.hover = false;
            }
        },
    },

    methods: {
        onRemove: function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (!hasChildren(this.wrappedElement)) {
                this.$store.dispatch(
                    'app/removeUiSchemaElement',
                    this.wrappedElement.uuid
                );
            }
        },
        onClick: function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            this.selected = true;
            this.$store.set('app/editor@settings', true);
            this.$store.set(
                'app/editor@selectedElement',
                this.wrappedElement.uuid
            );
            this.hover = true;
        },
    },
};
</script>
<style scoped>
.selected {
    border: 2px solid rgba(53, 225, 144, 0.982);
}
.v-opacity {
    opacity: 0.9;
}
</style>
