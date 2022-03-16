<template>
  <div class="px-2">
    <v-tabs>
      <v-tabs-slider></v-tabs-slider>
      <v-tab class="primary--text" @click="updatePreview(-1)"> Editor </v-tab>
      <v-tab
        v-for="(item, index) in editorTabs"
        :key="'tab' + index"
        @click="updatePreview(index)"
      >
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
        <component
          v-if="tabIndex != -1"
          v-bind:is="item.component"
          ref="comp"
        ></component>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script lang="ts">
import Editor from './Editor.vue';
import { defineComponent, ref } from '../../../util/vue';
import { editorRendererProps } from '../../../util/composition';
const EditorPanel = defineComponent({
  name: 'EditorPanel',
  components: {
    Editor,
  },
  props: {
    ...editorRendererProps(),
  },
  setup(props) {
    let tabIndex = ref(-1);
    return { tabIndex };
  },
  methods: {
    updateConfig: function (items) {
      alert('upadete config');
    },
    updatePreview(index) {
      this.tabIndex = index;
    },
  },
});
export default EditorPanel;
</script>
