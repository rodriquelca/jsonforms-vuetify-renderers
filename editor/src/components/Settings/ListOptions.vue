<template>
  <div>
    <v-data-table :headers="headers" :items="items">
      <template v-slot:item.value="{ item }">
        <v-text-field
          dense
          single-line
          class="vpm-item-list caption"
          label="Value"
          v-model="item.value"
          >{{ item.value }}</v-text-field
        >
      </template>

      <template v-slot:item.actions="{ item, index }">
        <v-icon class="h6" color="teal" @click="addItem(item, index)"
          >mdi-plus-circle</v-icon
        >
        <v-icon class="h6" color="red" @click="removeItem(item, index)"
          >mdi-minus-circle</v-icon
        >
      </template>

      <template v-slot:item.label="{ item }">
        <v-text-field
          dense
          single-line
          class="vpm-item-list caption"
          label="Label"
          v-model="item.label"
          >{{ item.value }}</v-text-field
        >
      </template>
    </v-data-table>
    <v-btn x-small depressed color="primary" @click="onSave"> Apply </v-btn>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
export default {
  name: 'ListOptions',
  components: {},
  computed: {},
  data() {
    return {
      slots: ['value', 'label'],
      headers: [
        { text: 'Value', value: 'value', sortable: false },
        { text: 'Label', value: 'label', sortable: false },
        { text: '', value: 'actions', sortable: false },
      ],
      items: [
        {
          value: '',
          label: '',
        },
      ],
    };
  },
  methods: {
    addItem(item: any, index: any) {
      let clone = _.clone(this.items);
      clone = _.concat(
        _.slice(clone, 0, index + 1),
        { value: '', label: '' },
        _.slice(clone, index + 1, clone.length)
      );
      this.items = clone;
    },
    removeItem(item: any, index: any) {
      let clone = _.clone(this.items);
      clone = _.concat(
        _.slice(clone, 0, index),
        _.slice(clone, index + 1, clone.length)
      );
      this.items = clone;
    },
    onSave() {
      this.$emit('onSave', _.clone(this.items));
    },
  },
};
</script>
<style>
.vpm-item-list > div > div > div > .v-label {
  font-size: 12px !important;
}
</style>
