<template>
  <v-card class="mx-auto" elevation="0">
    <v-list class="" dense>
      <v-list-item link>
        <v-list-item-content>
          <v-list-item-title class="h6"> Translations </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item-group
        v-model="selectedItem"
        color="primary"
        class="pe-4 ps-4"
      >
        <v-list-item
          v-for="(item, i) in locales"
          :key="i"
          @click="selectLanguage(item)"
          class="vpm-sidebar-i18n-list"
        >
          <v-icon class="pe-2" v-text="'mdi-translate'" small></v-icon>
          <div
            class="caption"
            v-text="item.description + ' - ' + item.key"
          ></div>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <v-list dense>
      <v-list-item class="caption" dense
        >Add language <v-spacer></v-spacer>

        <v-btn icon>
          <v-icon @click="toogleNewLangDialog">mdi-plus</v-icon>
        </v-btn></v-list-item
      >
      <div v-if="newLanguageDialog">
        <v-list-item class="caption" dense>
          <v-text-field
            v-model="newLang"
            class="vpm-sidebar-i18n-text caption"
            dense
            label="Language"
          ></v-text-field>
        </v-list-item>
        <v-list-item class="caption" dense>
          <v-text-field
            v-model="newKeyLang"
            class="vpm-sidebar-i18n-text caption"
            dense
            label="Key"
          ></v-text-field>
        </v-list-item>
        <v-list-item class="caption float-end" dense>
          <v-btn outlined small color="primary" @click="newLanguage">
            Add
          </v-btn>
        </v-list-item>
      </div>
    </v-list>
  </v-card>
</template>

<script lang="ts">
export default {
  name: 'SideBarI18n',
  components: {},
  computed: {},
  data: function () {
    return {
      key: 1,
      selectedItem: 0,
      newLanguageDialog: false,
      locales: {},
      newLang: null,
      newKeyLang: null,
    };
  },
  mounted() {
    this.locales = this.$store.get('locales');
  },
  methods: {
    toogleNewLangDialog() {
      this.newLanguageDialog = !this.newLanguageDialog;
    },
    newLanguage() {
      this.locales[this.newKeyLang] = {
        key: this.newKeyLang,
        description: this.newLang,
        content: this.locales['en'].content,
      };
      this.$store.dispatch('locales/addLanguage', {
        key: this.newKeyLang,
        description: this.newLang,
        content: this.locales['en'].content,
      });
      this.toogleNewLangDialog();
    },
    selectLanguage(item) {
      this.locale = item.key;
      this.$store.dispatch('viewManager/setDataMainPanel', {
        id: 'main-panel-i18n',
        data: {
          locale: item.key,
        },
      });
    },
  },
};
</script>

<style>
.vpm-sidebar-i18n-text > div > div > div > .v-label {
  font-size: 12px !important;
}

.vpm-sidebar-i18n-list {
  border-bottom: 1px solid rgb(200 198 205) !important;
}
.text-h5 {
  color: white;
}
</style>
