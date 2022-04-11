<template>
  <v-container>
    <v-row>
      <v-col cols="1">
        <div class="d-flex justify-end">
          <span class="subtitle-2"> Then</span>
          <v-icon size="30" color="primary">mdi-circle-slice-8</v-icon>
        </div>
      </v-col>
      <v-col cols="11">
        <v-card outlined class="pa-3">
          <v-row>
            <v-col cols="2">
              <v-combobox
                v-model="select"
                :items="items"
                label="Search for an action"
                outlined
                dense
                class="vpm-thencomp-combobox caption"
              >
              </v-combobox>
            </v-col>
            <v-col cols="10">
              <v-combobox
                v-model="field"
                :items="fields"
                label="Search for a field"
                small-chips
                dense
                multiple
                class="vpm-thencomp-combobox"
              >
                <template v-slot:selection="data">
                  <v-chip
                    label
                    small
                    :key="JSON.stringify(data.item)"
                    :color="`blue-grey lighten-5`"
                    v-bind="data.attrs"
                    :input-value="data.selected"
                    :disabled="data.disabled"
                    @click:close="data.parent.selectItem(data.item)"
                  >
                    <span class="pr-2">
                      {{ data.item }}
                    </span>
                    <v-icon small @click="data.parent.selectItem(data.item)">
                      $delete
                    </v-icon>
                  </v-chip>
                </template>
              </v-combobox>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
export default {
  name: 'ThenComponent',
  data() {
    return {
      select: 'Show',
      items: ['Show', 'Hide', 'Enable', 'Disable'],

      field: [],
      fields: ['Field1', 'Field2', 'Field3', 'Field4'],
    };
  },
  watch: {},
  methods: {},
};
</script>
<style>
.vpm-thencomp-combobox > div > div > div > label {
  font-size: 12px !important;
}
</style>
