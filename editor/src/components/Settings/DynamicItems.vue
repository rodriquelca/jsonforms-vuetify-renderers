<template>
  <div>
    <v-row>
      <v-col cols="9">
        <v-text-field
          dense
          v-model="url"
          class="vpm-item-list caption"
          label="URL"
        ></v-text-field>
      </v-col>
      <v-col cols="3">
        <v-combobox
          v-model="method"
          class="vpm-item-list caption"
          label="Method"
          dense
          :items="methodItems"
        ></v-combobox>
      </v-col>
    </v-row>
    <tabs-dynamic-items ref="tabs-dynamic"></tabs-dynamic-items>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
import TabsDynamicItems from './TabsDynamicItems.vue';
export default {
  name: 'DynamicItems',
  components: { TabsDynamicItems },
  computed: {},
  data() {
    return {
      method: 'GET',
      url: '',
      methodItems: ['POST', 'GET', 'PUT'],
    };
  },
  methods: {
    getData() {
      let data = this.$refs['tabs-dynamic'].getData();
      return {
        method: this.method,
        url: this.url,
        ...data,
      };
    },
  },
};
</script>
<style>
.vpm-item-list > div > div > div > .v-label {
  font-size: 12px !important;
}

.vpm-prop-tabs-bar > .v-tabs-bar {
  border-radius: inherit;
  height: 20px;
}
</style>
