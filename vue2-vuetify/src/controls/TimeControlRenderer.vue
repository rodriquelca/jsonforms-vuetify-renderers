<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :isFocused="isFocused"
    :appliedOptions="appliedOptions"
  >
    <v-menu
      ref="menu"
      v-model="menu"
        :close-on-content-click="false"
        :nudge-right="40"
        :return-value.sync="time"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          type="time"
          v-model="dataTime"
          append-icon="mdi-clock-time-four-outline"
          :id="control.id + '-input'"
          :class="styles.control.input"
          :disabled="!control.enabled"
          :autofocus="appliedOptions.focus"
          :placeholder="appliedOptions.placeholder"
          :label="computedLabel"
          :hint="control.description"
          :persistent-hint="persistentHint()"
          :required="control.required"
          :error-messages="control.errors"
          @focus="isFocused = true"
          @blur="isFocused = false"

          readonly
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <v-time-picker
        v-if="menu"
        v-model="dataTime"
        format="ampm"
        @click:minute="$refs.menu.save(time)"
        :min="control.schema.minDate"
        :max="control.schema.maxDate"
        no-title
        scrollable
      >
      </v-time-picker>
    </v-menu>
  </control-wrapper>
</template>

<script lang="ts">
import {
  ControlElement,
  JsonFormsRendererRegistryEntry,
  rankWith,
  isTimeControl,
} from '@jsonforms/core';
import { defineComponent } from '../vue';
import {
  rendererProps,
  useJsonFormsControl,
  RendererProps,
} from '@jsonforms/vue2';
import { default as ControlWrapper } from './ControlWrapper.vue';
import { useVuetifyControl, parseDateTime } from '../util';
import { VTextField, VMenu, VTimePicker, VBtn } from 'vuetify/lib';

const controlRenderer = defineComponent({
  name: 'time-control-renderer',
  components: {
    ControlWrapper,
    VTextField,
    VMenu,
    VTimePicker,
    VBtn,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    return {
      ...useVuetifyControl(useJsonFormsControl(props)),
      menu: false,
      date: null,
    };
  },
  computed: {
    dataTime: {
      get(): string | null | undefined {
        const datetimeLocalFormat = 'HH:mm:ss';
        const saveFormat = this.appliedOptions.dateTimeSaveFormat ?? undefined;
        const value = this.control.data as string | undefined | null;

        const dateTime = parseDateTime(value, saveFormat);
        return dateTime ? dateTime.local().format(datetimeLocalFormat) : value;
      },
      set(value: string) {
        debugger;
        const datetimeLocalFormats = ['HH:mm:ss', 'hh:mm:ss', 'HH:mm'];
        const saveFormat = this.appliedOptions.dateTimeSaveFormat ?? 'HH:mm:ss';

        const dateTime = parseDateTime(value, datetimeLocalFormats);
        const result = dateTime ? dateTime.format(saveFormat) : value;

        this.onChange(result);
      },
    },
  },
  methods: {
    clearDate() {
      this.menu = false;
      this.dataTime = null;
    },
  },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(2, isTimeControl),
};
</script>
