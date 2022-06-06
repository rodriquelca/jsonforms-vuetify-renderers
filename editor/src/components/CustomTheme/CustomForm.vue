<template>
  <v-row>
    <v-col cols="6">
      <v-text-field
        v-model="marginTop"
        label="Margin Top"
        :rules="[rules.maxValue]"
        v-mask="inputMask"
        placeholder="0"
        persistent-placeholder
        @change="onChange"
      ></v-text-field>
    </v-col>
    <v-col cols="6">
      <v-text-field
        v-model="marginRight"
        label="Margin Right"
        :rules="[rules.maxValue]"
        v-mask="inputMask"
        placeholder="0"
        persistent-placeholder
        @change="onChange"
      ></v-text-field>
    </v-col>
    <v-col cols="6">
      <v-text-field
        v-model="marginBottom"
        label="Margin Bottom"
        :rules="[rules.maxValue]"
        v-mask="inputMask"
        placeholder="0"
        persistent-placeholder
        @change="onChange"
      ></v-text-field>
    </v-col>
    <v-col cols="6">
      <v-text-field
        v-model="marginLeft"
        label="Margin Left"
        :rules="[rules.maxValue]"
        v-mask="inputMask"
        placeholder="0"
        persistent-placeholder
        @change="onChange"
      ></v-text-field>
    </v-col>
    <v-col cols="12"><v-divider></v-divider></v-col>
    <v-col cols="6">
      <v-text-field
        v-model="paddingTop"
        label="Padding Top"
        placeholder="0"
        persistent-placeholder
        :rules="[rules.maxValue]"
        v-mask="inputMask"
        @change="margins"
      ></v-text-field>
    </v-col>
    <v-col cols="6">
      <v-text-field
        v-model="paddingRight"
        label="Padding Right"
        placeholder="0"
        persistent-placeholder
        :rules="[rules.maxValue]"
        v-mask="inputMask"
        @change="margins"
      ></v-text-field>
    </v-col>
    <v-col cols="6">
      <v-text-field
        v-model="paddingBottom"
        label="Padding Bottom"
        placeholder="0"
        persistent-placeholder
        :rules="[rules.maxValue]"
        v-mask="inputMask"
        @change="margins"
      ></v-text-field>
    </v-col>
    <v-col cols="6">
      <v-text-field
        v-model="paddingLeft"
        label="Padding Left"
        placeholder="0"
        persistent-placeholder
        :rules="[rules.maxValue]"
        v-mask="inputMask"
        @change="margins"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-model="background"
        label="Background image"
        placeholder="URL image"
        persistent-placeholder
        @change="setBackground"
      >
      </v-text-field>
    </v-col>
    <v-col cols="12">
      <v-text-field
        v-model="color"
        readonly
        label="Form background color"
        persistent-placeholder
        @change="setBackgroundColor"
      >
        <template v-slot:append>
          <v-menu
            v-model="menu"
            top
            nudge-bottom="105"
            nudge-left="16"
            :close-on-content-click="false"
          >
            <template v-slot:activator="{ on }">
              <div :style="swatchStyle()" v-on="on" />
            </template>
            <v-card>
              <v-card-text class="pa-0">
                <v-color-picker
                  v-model="color"
                  dot-size="25"
                  hide-inputs
                  hide-mode-switch
                  swatches-max-height="200"
                ></v-color-picker>
              </v-card-text>
            </v-card>
          </v-menu>
        </template>
      </v-text-field>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { mask } from '@titou10/v-mask';

const CustomForm = defineComponent({
  name: 'custom-form',
  directives: {
    mask,
  },
  setup() {
    let maxPixel = 400;
    return {
      maxPixel,
      background: '',
      marginLeft: '',
      marginTop: '',
      marginBottom: '',
      marginRight: '',
      paddingLeft: '',
      paddingTop: '',
      paddingBottom: '',
      paddingRight: '',
      rules: {
        maxValue: (val) => {
          return val <= maxPixel || 'Max margin is 100';
        },
      },
      errors: '',
      inputMask: '###',
      color: '#FFFFFFFF',
      menu: false,
    };
  },
  methods: {
    onChange(val: number) {
      if (val <= this.maxPixel) {
        this.$store.dispatch('themes/updatePaddings', {
          paddingLeft: this.marginLeft || 0,
          paddingTop: this.marginTop || 0,
          paddingBottom: this.marginBottom || 0,
          paddingRight: this.marginRight || 0,
        });
      }
    },
    margins(val: number) {
      if (val <= this.maxPixel) {
        this.$store.dispatch('themes/updateMargins', {
          left: this.paddingLeft || 0,
          top: this.paddingTop || 0,
          bottom: this.paddingBottom || 0,
          right: this.paddingRight || 0,
        });
      }
    },
    setBackground(img: string) {
      if (img !== '') {
        this.$store.dispatch('themes/updateBackground', {
          background: this.background,
        });
      }
    },
    setBackgroundColor(color: string) {
      this.$store.dispatch('themes/updateBackgroundColor', {
        color: this.color,
      });
    },
    swatchStyle(): Record<string, unknown> {
      const { color, menu } = this;
      return {
        backgroundColor: color,
        cursor: 'pointer',
        height: '21px',
        width: '21px',
        border: '1px solid',
        borderRadius: menu ? '50%' : '4px',
        transition: 'border-radius 200ms ease-in-out',
      };
    },
  },
});

export default CustomForm;
</script>
