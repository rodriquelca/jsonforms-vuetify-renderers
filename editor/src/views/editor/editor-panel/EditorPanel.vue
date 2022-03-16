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
import { editorRendererProps } from '../../../util/composition';
import { JReactivex as JReact, JFormE as JF } from '@jsonforms/vue2';
import store from './../../../store';
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
  provide: function () {
    return {
      store: store,
      JReactivex: JReact,
      JForm: new JF({
        data: {
          store: store,
        },
      }),
    };
  },
});
export default EditorPanel;
</script>
