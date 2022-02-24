<template>
  <div class="px-2">
    <v-tabs>
      <v-tabs-slider></v-tabs-slider>
      <v-tab class="primary--text"> Editor </v-tab>
      <v-tab v-for="(item, index) in editorTabs" :key="'tab' + index">
        {{ item.name }}
      </v-tab>

      <v-tab-item>
        <Editor
          :renderers="renderers"
          :schema="schema || false"
          :uischema="uischema"
          :selection="selection"
        />
      </v-tab-item>
      <v-tab-item v-for="(item, index) in editorTabs" :key="'content' + index">
        <component v-bind:is="item.component"></component>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script lang="ts">
import Editor from './Editor.vue';
import { defineComponent, ref } from '../../../util/vue';
import { editorRendererProps, useJsonTest } from '../../../util/composition';
const EditorPanel = defineComponent({
  name: 'EditorPanel',
  components: {
    Editor,
  },
  props: {
    ...editorRendererProps(),
  },
  setup(props) {
    return useJsonTest(props);
    //  return useVuetifyLayout(useJsonFormsLayout(props));
  },
  methods: {
    updateConfig: function (items) {
      alert('upadete config');
    },
  },
});
export default EditorPanel;
</script>
