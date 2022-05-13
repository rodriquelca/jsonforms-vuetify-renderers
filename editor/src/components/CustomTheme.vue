<template>
  <div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn large icon dark v-bind="attrs" v-on="on">
          <v-icon size="30" @click="openDialog">mdi-draw</v-icon>
        </v-btn>
      </template>
      Custom Theme
    </v-tooltip>

    <v-dialog v-model="dialog" max-width="800px">
      <v-card>
        <v-card-title class="text-h5 primary lighten-1">
          <span>Custom Theme</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="customThemeName"
                  label="Name of the Theme"
                  required
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="6">
                <v-select
                  :items="selectFont"
                  label="Select Font"
                  v-model="fontFamily"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="12" md="6">
                <span>Color Primary</span>
                <v-text-field
                  v-model="color.primary"
                  hide-details
                  solo
                  readonly
                >
                  <template v-slot:append>
                    <v-menu
                      v-model="menu.primary"
                      top
                      nudge-bottom="105"
                      nudge-left="16"
                      :close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on }">
                        <div :style="switchStyle('primary')" v-on="on" />
                      </template>
                      <v-card>
                        <v-card-text class="pa-0">
                          <v-color-picker
                            v-model="color.primary"
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
              <v-col cols="12" sm="12" md="6">
                <span>Color secondary</span>
                <v-text-field
                  v-model="color.secondary"
                  readonly
                  hide-details
                  solo
                >
                  <template v-slot:append>
                    <v-menu
                      v-model="menu.secondary"
                      top
                      nudge-bottom="105"
                      nudge-left="16"
                      :close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on }">
                        <div :style="switchStyle('secondary')" v-on="on" />
                      </template>
                      <v-card>
                        <v-card-text class="pa-0">
                          <v-color-picker
                            v-model="color.secondary"
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
              <v-col cols="12" sm="12" md="6">
                <span>Color accent</span>
                <v-text-field v-model="color.accent" readonly hide-details solo>
                  <template v-slot:append>
                    <v-menu
                      v-model="menu.accent"
                      top
                      nudge-bottom="105"
                      nudge-left="16"
                      :close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on }">
                        <div :style="switchStyle('accent')" v-on="on" />
                      </template>
                      <v-card>
                        <v-card-text class="pa-0">
                          <v-color-picker
                            v-model="color.accent"
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
              <v-col cols="12" sm="12" md="6">
                <span>Color error</span>
                <v-text-field v-model="color.error" readonly hide-details solo>
                  <template v-slot:append>
                    <v-menu
                      v-model="menu.error"
                      top
                      nudge-bottom="105"
                      nudge-left="16"
                      :close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on }">
                        <div :style="switchStyle('error')" v-on="on" />
                      </template>
                      <v-card>
                        <v-card-text class="pa-0">
                          <v-color-picker
                            v-model="color.error"
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
              <v-col cols="12" sm="12" md="6">
                <span>Color info</span>
                <v-text-field v-model="color.info" readonly hide-details solo>
                  <template v-slot:append>
                    <v-menu
                      v-model="menu.info"
                      top
                      nudge-bottom="105"
                      nudge-left="16"
                      :close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on }">
                        <div :style="switchStyle('info')" v-on="on" />
                      </template>
                      <v-card>
                        <v-card-text class="pa-0">
                          <v-color-picker
                            v-model="color.info"
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
              <v-col cols="12" sm="12" md="6">
                <span>Color sucess</span>
                <v-text-field
                  v-model="color.success"
                  readonly
                  hide-details
                  solo
                >
                  <template v-slot:append>
                    <v-menu
                      v-model="menu.success"
                      top
                      nudge-bottom="105"
                      nudge-left="16"
                      :close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on }">
                        <div :style="switchStyle('success')" v-on="on" />
                      </template>
                      <v-card>
                        <v-card-text class="pa-0">
                          <v-color-picker
                            v-model="color.success"
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
              <v-col cols="12" sm="12" md="6">
                <span>Color warning</span>
                <v-text-field
                  v-model="color.warning"
                  readonly
                  hide-details
                  solo
                >
                  <template v-slot:append>
                    <v-menu
                      v-model="menu.warning"
                      top
                      nudge-bottom="105"
                      nudge-left="16"
                      :close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on }">
                        <div :style="switchStyle('warning')" v-on="on" />
                      </template>
                      <v-card>
                        <v-card-text class="pa-0">
                          <v-color-picker
                            v-model="color.warning"
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
          </v-container>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Close
            </v-btn>
            <v-btn color="blue darken-1" text @click="setCustom">
              Set Custom Theme
            </v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import _ from 'lodash';
const defaultTheme = {
  primary: '#1976D2',
  secondary: '#424242',
  accent: '#82B1FF',
  error: '#FF5252',
  info: '#2196F3',
  success: '#4CAF50',
  warning: '#FB8C00',
};
export default {
  name: 'custom-theme',
  data(): Record<string, unknown> {
    return {
      dialog: false,
      customThemeName: '',
      color: _.clone(defaultTheme),
      menu: {
        primary: false,
        secondary: false,
        accent: false,
        error: false,
        info: false,
        success: false,
        warning: false,
      },
      selectFont: [
        'Roboto',
        'Comic Neue',
        'Fira Code',
        'Inconsolata',
        'Oxygen',
        'Tapestry',
        'Ubuntu',
        'Water Brush',
      ],
      fontFamily: 'Roboto',
    };
  },
  computed: {},
  methods: {
    switchStyle(type: string): Record<string, unknown> {
      const { color, menu } = this;
      return {
        backgroundColor: color[type],
        cursor: 'pointer',
        height: '30px',
        width: '30px',
        borderRadius: menu[type] ? '50%' : '4px',
        transition: 'border-radius 200ms ease-in-out',
      };
    },
    openDialog(): void {
      this.dialog = true;
      this.customThemeName = '';
      this.color = _.clone(defaultTheme);
    },
    setCustom(): void {
      this.dialog = false;
      const name = this.customThemeName;
      const light = this.color;
      // Themes in dark mode is taking always from default theme.
      Object.keys(light).forEach((i) => {
        this.$vuetify.theme.themes.light[i] = light[i];
      });
      this.$vuetify.theme.currentTheme.name = name;
      this.saveTheme();
    },
    saveTheme(): void {
      this.dialog = false;
      this.$store.set('themes/addTheme', {
        name: this.customThemeName,
        light: _.clone(this.color),
        fontFamily: _.clone(this.fontFamily),
      });
      this.$store.set('themes/activeTheme', this.customThemeName);
    },
  },
};
</script>
<style>
.text-h5 {
  color: white;
}
</style>
