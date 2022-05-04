<template>
    <v-card outlined :class="selectedStyle" @click="click">
        <div
            class="d-block"
            @mouseover.stop.prevent.self="hover = true"
            @mouseleave.self="hover = false"
        >
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
            <v-btn fab x-small v-if="hover" @click="onEdit" class="float-right">
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
import _ from 'lodash';
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
        activeElement: sync('app/editor@element'),
        selectedStyle() {
            return this.activeElement.selected === this.wrappedElement.uuid
                ? 'selected pa-2'
                : 'pa-2';
        },
    },
    watch: {
        activeElement() {
            if (this.activeElement.selected === this.wrappedElement.uuid) {
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
        onEdit: function (e) {
            if (!hasChildren(this.wrappedElement)) {
                this.$store.set('app/editor@element', {
                    selected: this.wrappedElement.uuid,
                    edit: _.random(0, 100000),
                });
                this.hover = true;
            }
        },
        click: function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            this.$store.set('app/editor@element', {
                selected: this.wrappedElement.uuid,
                edit: _.random(0, 100000),
            });
            this.hover = true;
        },
    },
};
</script>
<style scoped>
.selected {
    border: 2px solid rgb(48 201 173 / 98%);
}
.v-opacity {
    opacity: 0.9;
}
</style>
