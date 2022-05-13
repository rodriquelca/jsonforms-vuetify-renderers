<template>
  <json-forms
    :renderers="renderers"
    :data="data"
    :uischema="useExportUiSchema() || {}"
    :schema="useExportSchema() || false"
    height="500"
  />
</template>

<script lang="ts">
import { JsonForms } from '@jsonforms/vue2';
import { defaultEditorRenderers } from '../../renderers';
import { useExportSchema } from '../../util';
import { JReactivex as JReact, JFormE as JF } from '@jsonforms/vue2';

export default {
  name: 'DynaformEditor',
  props: {},
  components: {
    JsonForms,
  },
  data() {
    return {
      selection: '' as string,
      renderers: [],
      data: {},
    };
  },
  mounted() {
    this.renderers = defaultEditorRenderers;
  },
  methods: {
    useExportSchema() {
      return useExportSchema(this.$store.get('app/editor@schema'));
    },
    useExportUiSchema() {
      return this.$store.get('app/editor@uiSchema');
    },
  },
  provide() {
    return {
      store: this.$store,
      JReactivex: JReact,
      JForm: new JF({
        data: {
          store: this.$store,
        },
      }),
    };
  },
};
</script>
