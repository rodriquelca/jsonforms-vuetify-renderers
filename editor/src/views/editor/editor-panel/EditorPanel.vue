<template>
  <div class="px-2">
    <Editor
      :renderers="renderers"
      :schema="schema || false"
      :uischema="uischema"
      :selection="selection"
    />
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
