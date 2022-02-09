<template>
  <!-- <v-main> -->
  <v-container fill-height fluid>
    <v-tabs>
      <v-tabs-slider></v-tabs-slider>
      <v-tab class="primary--text">Palete </v-tab>

      <v-tab class="primary--text"> JSON Schema </v-tab>
      <v-tab class="primary--text"> UI Schema </v-tab>

      <v-tab-item>
        <!-- <draggable
          class="dragArea list-group"
          :list="paletteElements"
          :group="{ name: 'people', pull: 'clone', put: false }"
          :sort="false"
        >
          <div v-for="element in paletteElements" :key="element.type">
            <v-icon v-text="element.icon"></v-icon>

            <span v-text="element.label"></span>
          </div>
        </draggable> -->
        <h4>Controls</h4>
        <draggable
          class="dragArea list-group"
          :list="getChildrenToRender(schema)"
          :group="{ name: 'people', pull: 'clone', put: false }"
          :sort="false"
        >
          <div
            v-for="element in getChildrenToRender(schema)"
            :key="element.uuid"
          >
            <span v-text="getLabel(element)"></span>
          </div>
        </draggable>

        <v-treeview
          v-model="tree"
          :open="initiallyOpen"
          :items="paletteElements"
          activatable
          item-key="type"
          open-on-click
        >
          <template v-slot:prepend="{ item }">
            <draggable
              class="dragArea list-group"
              :list="[item]"
              :group="{ name: 'people', pull: 'clone', put: false }"
              :sort="false"
            >
              <!-- <v-icon v-if="item.icon" v-text="item.icon"></v-icon>
              <span v-text="item.label"></span> -->
              <div>
                <v-icon v-text="item.icon"></v-icon>

                <span v-text="item.label"></span>
              </div>
            </draggable>
          </template>
        </v-treeview>
      </v-tab-item>
      <v-tab-item> </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script lang="ts">
import draggable from 'vuedraggable';
import { sync } from 'vuex-pathify';
import {
  getChildren,
  getLabel,
  getPath,
  isArrayElement,
  isObjectElement,
  SchemaElement,
} from '../../../model/schema';

export default {
  name: 'PalletePanel',
  components: {
    draggable,
  },
  props: {
    schema: {
      type: [Object, Boolean],
    },
  },
  data() {
    return {
      // tabs: [],
      // list1: [
      //   { name: 'John', id: 1 },
      //   { name: 'Joao', id: 2 },
      //   { name: 'Jean', id: 3 },
      //   { name: 'Gerard', id: 4 },
      // ],
      initiallyOpen: ['public'],
      // files: {
      //   html: 'mdi-language-html5',
      //   js: 'mdi-nodejs',
      //   json: 'mdi-code-json',
      //   md: 'mdi-language-markdown',
      //   pdf: 'mdi-file-pdf',
      //   png: 'mdi-file-image',
      //   txt: 'mdi-file-document-outline',
      //   xls: 'mdi-file-excel',
      // },
      tree: [],
      // items: [
      //   {
      //     name: 'Controls',
      //     children: [
      //       {
      //         name: 'static',
      //         file: 'png',
      //       },
      //       {
      //         name: 'favicon.ico',
      //         file: 'png',
      //       },
      //       {
      //         name: 'index.html',
      //         file: 'html',
      //       },
      //     ],
      //   },
      // {
      //   name: '.gitignore',
      //   file: 'txt',
      // },
      // {
      //   name: 'babel.config.js',
      //   file: 'js',
      // },
      // {
      //   name: 'package.json',
      //   file: 'json',
      // },
      // {
      //   name: 'README.md',
      //   file: 'md',
      // },
      // {
      //   name: 'vue.config.js',
      //   file: 'js',
      // },
      // {
      //   name: 'yarn.lock',
      //   file: 'txt',
      // },
      // ],
    };
  },
  created: function () {
    this.$store.dispatch('app/getPaletteElements');
  },
  computed: {
    paletteElements: sync('app/editor@paletteElements'),
    editorSchema: sync('app/editor@schema'),
  },

  methods: {
    getChildrenToRender: function (schemaElement: SchemaElement) {
      let items: any[] = [];
      if (schemaElement) {
        schemaElement.properties.forEach((value: boolean, key: string) => {
          if (key === 'suggest') {
            value.options = {
              pmType: 'suggest',
              url: '',
            };
          }
          items.push(value);
        });
      }
      return items;
    },
    getLabel: function (schemaElement: SchemaElement) {
      return getLabel(schemaElement);
    },
  },
};
</script>
