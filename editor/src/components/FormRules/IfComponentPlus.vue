<template>
  <v-container>
    <v-row>
      <v-col cols="1">
        <div class="d-flex justify-end">
          <span class="subtitle-2">If</span>
          <v-icon size="30" color="primary"
            >mdi-arrow-down-bold-box-outline</v-icon
          >
        </div>
      </v-col>
      <v-col cols="11">
        <v-card outlined class="pa-3">
          <v-combobox
            v-model="model"
            :filter="filter"
            :hide-no-data="!search"
            :items="items"
            :search-input.sync="search"
            hide-selected
            label="Search for a field"
            multiple
            small-chips
            class="vpm-thencomp-combobox caption"
            @blur="onBlurAutocomplete"
          >
            <template v-slot:no-data>
              <v-list-item>
                <span class="caption">Create value : </span>
                <v-chip :color="`${colors[nonce - 1]} lighten-3`" label small>
                  {{ search }}
                </v-chip>
              </v-list-item>
            </template>
            <template v-slot:selection="{ attrs, item, parent, selected }">
              <v-badge
                :value="highlightSelectedItem(item)"
                :icon="highlightSelectedItem(item)"
                color="red"
                overlap
              >
                <v-chip
                  v-if="item === Object(item)"
                  v-bind="attrs"
                  :color="`${item.color} lighten-3`"
                  :input-value="selected"
                  label
                  small
                  @click="clickEditItem(item)"
                >
                  <span>
                    {{ item.text }}
                  </span>
                  <v-icon small @click="parent.selectItem(item)">
                    $delete
                  </v-icon>
                </v-chip>
              </v-badge>
            </template>
            <template v-slot:item="{ index, item }">
              <v-text-field
                v-if="editing === item"
                v-model="editing.text"
                autofocus
                flat
                background-color="transparent"
                hide-details
                solo
                @keyup.enter="edit(index, item)"
              ></v-text-field>
              <v-chip
                v-else
                :color="`${item.color} lighten-3`"
                dark
                label
                x-small
              >
                {{ item.text }}
              </v-chip>
              <v-spacer></v-spacer>
              <v-list-item-action @click.stop>
                <v-btn icon @click.stop.prevent="edit(index, item)">
                  <v-icon>{{
                    editing !== item ? 'mdi-pencil' : 'mdi-check'
                  }}</v-icon>
                </v-btn>
              </v-list-item-action>
            </template>
          </v-combobox>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import ChipCustom from './ChipCustom.vue';
import _ from 'lodash';
import Vue from 'vue';
export default {
  name: 'IfComponentPlus',
  components: {},
  data() {
    return {
      activator: null,
      attach: null,
      colors: ['green', 'purple', 'indigo', 'cyan', 'teal', 'orange'],
      editing: null,
      editingIndex: -1,
      items: [],
      nonce: 1,
      menu: false,
      model: [],
      x: 0,
      search: null,
      y: 0,

      fields: [
        { header: 'Select an option or create one' },
        {
          text: 'Field1',
          color: 'yellow',
          type: 'field',
        },
        {
          text: 'Field2',
          color: 'green',
          type: 'field',
        },
        {
          text: 'Field3',
          color: 'red',
          type: 'field',
        },
        {
          text: 'Field4',
          color: 'yellow',
          type: 'field',
        },
        {
          text: 'Field5',
          color: 'marron',
          type: 'field',
        },
      ],
      operators: [
        {
          text: '=',
          color: 'blue',
          type: 'operator',
        },
        {
          text: '!=',
          color: 'blue',
          type: 'operator',
        },
        {
          text: '<',
          color: 'blue',
          type: 'operator',
        },
        {
          text: '>',
          color: 'blue',
          type: 'operator',
        },
      ],
      empty: [{ header: 'Create a value' }],
      selectedItemEdit: null,
    };
  },
  watch: {
    model(val, prev) {
      if (val.length === prev.length) {
        return;
      }
      if (this.selectedItemEdit) {
        this.updateModelItem(val.pop(), this.selectedItemEdit);
      } else {
        if (val.length > prev.length) {
          if (val.length === prev.length) return;
          if (val.length == 1) {
            this.items = this.operators;
          }
          if (val.length == 2) {
            this.items = this.empty;
          }
          if (val.length == 3) {
            this.model = val.map((v) => {
              if (typeof v === 'string') {
                v = {
                  text: v,
                  color: 'grey',
                  type: 'value',
                };
                this.items.push(v);
                this.nonce++;
              }
              return v;
            });
          }
        } else {
          if (val.length == 0) {
            this.items = this.fields;
          }
          if (val.length == 1) {
            this.items = this.operators;
          }
          if (val.length == 2) {
            this.items = this.empty;
          }
        }
      }
    },
  },
  mounted() {
    this.items = this.fields;
  },
  methods: {
    edit(index, item) {
      let selectedItemEdit = this.selectedItemEdit;
      setTimeout(() => {
        this.selectedItemEdit = selectedItemEdit;
      }, 1000);
      if (!this.editing) {
        this.editing = item;
        this.editingIndex = index;
      } else {
        this.editing = null;
        this.editingIndex = -1;
      }
    },
    filter(item, queryText, itemText) {
      if (item.header) return false;
      const hasValue = (val) => (val != null ? val : '');
      const text = hasValue(itemText);
      const query = hasValue(queryText);
      return (
        text.toString().toLowerCase().indexOf(query.toString().toLowerCase()) >
        -1
      );
    },
    clickEditItem(item) {
      this.selectedItemEdit = item;
      switch (item.type) {
        case 'field':
          this.editItemField(item);
          break;
        case 'operator':
          this.editItemOperator(item);
          break;
        case 'value':
          this.editItemValue(item);
          break;
      }
    },
    updateModelItem(newItem, oldItem) {
      let clone = _.clone(this.model);
      let index = _.findIndex(clone, function (o) {
        return _.isEqual(o, oldItem);
      });

      if (index == 0) {
        clone = _.concat(newItem, _.slice(clone, index + 1, clone.length));
      } else {
        clone = _.concat(
          _.slice(clone, 0, index),
          newItem,
          _.slice(clone, index + 1, clone.length)
        );
      }
      this.selectedItemEdit = newItem;
      this.model = clone;
    },
    editItemField() {
      this.items = this.fields;
    },
    editItemOperator() {
      this.items = this.operators;
    },
    editItemValue(item) {
      this.items = [
        {
          text: 'Edit new value',
          color: 'grey',
          type: 'value',
        },
      ];
    },
    highlightSelectedItem(item) {
      return _.isEqual(item, this.selectedItemEdit) ? 'mdi-pencil' : null;
    },
    onBlurAutocomplete() {
      this.selectedItemEdit = null;
    },
  },
};
</script>
<style>
.vpm-ifcomp-dropdown > div > div > div > label {
  font-size: 12px !important;
}
</style>
