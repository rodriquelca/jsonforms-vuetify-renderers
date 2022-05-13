<template>
  <div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on: onTooltip }">
        <v-btn large icon dark @click.stop="dialog = !dialog" v-on="onTooltip">
          <v-icon size="30">mdi-folder-table-outline</v-icon>
        </v-btn>
      </template>
      Templates
    </v-tooltip>
    <v-dialog v-model="dialog" width="900" @click:outside="closeModal">
      <v-card>
        <v-card-title class="text-h5 primary lighten-1">
          Select a Template
        </v-card-title>

        <v-card-text>
          <v-row no-gutters>
            <v-col cols="3">
              <v-list v-if="templates">
                <v-list-group
                  v-for="item in templates"
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
                        class="listTitleTemplate"
                        v-text="child.title"
                      ></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-group>
              </v-list>
            </v-col>
            <v-col>
              <v-img
                v-if="picture"
                :src="require('@/api/examples/' + picture)"
                max-height="600"
                max-width="550"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="onClick"> I accept </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { sync } from 'vuex-pathify';
import _ from 'lodash';
import { TemplateSchemaService } from '../api/schemaService';
export default {
  name: 'Template',

  props: {
    schema: {
      type: [Object, Boolean],
    },
  },
  data() {
    return {
      picture: undefined,
      drawer: true,
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

      templates: undefined,
      selected: undefined,
    };
  },
  mounted() {
    new TemplateSchemaService()
      .getTemplates()
      .then((res: any) => {
        this.templates = res;
      })
      .catch((err: any) => {
        console.log(err);
      });
  },

  methods: {
    onClickListItem(e) {
      this.selected = e.input;
      this.picture = e.input.picture;
    },

    onClick: function (e) {
      let schema = this.$store.get('app/editor@schema');
      this.dialog = false;

      this.$store.dispatch('app/setSchema', {
        schema: this.selected.schema,
      });
      this.$store.dispatch('app/setUiSchema', {
        uiSchema: this.selected.uischema,
      });

      this.$store.dispatch('locales/setSchema', {
        properties: _.keys(this.selected.schema.properties),
      });

      //Todo data
    },
    closeModal: function (e) {
      this.picture = undefined;
    },
  },
};
</script>

<style scoped>
.listTitleTemplate {
  white-space: pre-wrap;
}
.text-h5 {
  color: white;
}
</style>
