<template>
  <v-dialog v-model="dialog" width="900">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
        Templates
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5 grey lighten-2">
        Select a Template
      </v-card-title>

      <v-card-text>
        <v-row no-gutters>
          <v-col cols="3">
            <v-navigation-drawer permanent>
              <v-list>
                <v-list-group
                  v-for="item in items"
                  :key="item.title"
                  v-model="item.active"
                  :prepend-icon="item.action"
                >
                  <template v-slot:activator>
                    <v-list-item-content>
                      <v-list-item-title
                        v-text="item.title"
                      ></v-list-item-title>
                    </v-list-item-content>
                  </template>

                  <v-list-item
                    v-for="child in item.items"
                    :key="child.title"
                    link
                    @click="onClickListItem(child)"
                  >
                    <v-list-item-content>
                      <v-list-item-title
                        v-text="child.title"
                      ></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-group>
              </v-list>
            </v-navigation-drawer>
          </v-col>
          <v-col> hola </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="onClick"> I accept </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { sync } from 'vuex-pathify';

export default {
  name: 'Templates',
  props: {
    schema: {
      type: [Object, Boolean],
    },
  },
  data() {
    return {
      dialog: false,
      files: {
        html: 'mdi-language-html5',
        js: 'mdi-nodejs',
        json: 'mdi-code-json',
        md: 'mdi-language-markdown',
        pdf: 'mdi-file-pdf',
        png: 'mdi-file-image',
        txt: 'mdi-file-document-outline',
        xls: 'mdi-file-excel',
      },
      items: [
        {
          action: 'mdi-silverware-fork-knife',
          active: true,
          items: [
            { title: 'Breakfast & brunch' },
            { title: 'New American' },
            { title: 'Sushi' },
          ],
          title: 'Dining',
        },
      ],
    };
  },
  methods: {
    onClickListItem(e) {
      console.log(e);
    },
    getActiveValue(value) {
      console.log(value);
    },
    onClick: function (e) {
      this.dialog = false;
      debugger;
      // this.$emit('onClick', 'hola mundo');
    },
  },
};
</script>

<style></style>
