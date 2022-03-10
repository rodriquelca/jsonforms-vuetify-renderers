import {
  composePaths,
  computeLabel,
  ControlElement,
  getFirstPrimitiveProp,
  isDescriptionHidden,
  JsonFormsSubStates,
  Resolve,
} from '@jsonforms/core';
import {
  RendererProps,
} from '@jsonforms/vue2';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import { useStyles } from '../styles';
import {
  computed, ComputedRef, inject, ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onActivated,
  onDeactivated,
  onErrorCaptured
} from '../vue';
import Vue from 'vue';
import Ajv from 'ajv';
import _ from "lodash";

const useControlAppliedOptions = <I extends { control: any }>(input: I) => {
  return computed(() =>
    merge(
      {},
      cloneDeep(input.control.value.config),
      cloneDeep(input.control.value.uischema.options)
    )
  );
};

const useComputedLabel = <I extends { control: any }>(
  input: I,
  appliedOptions: ComputedRef<any>
) => {
  return computed((): string => {
    return computeLabel(
      input.control.value.label,
      input.control.value.required,
      !!appliedOptions.value?.hideRequiredAsterisk
    );
  });
};

/**
 * Adds styles, isFocused, appliedOptions and onChange
 */
export const useVuetifyControl = <
  I extends { control: any; handleChange: any }
>(
  input: I,
  adaptValue: (target: any) => any = (v) => v
) => {
  const appliedOptions = useControlAppliedOptions(input);

  const isFocused = ref(false);
  const onChange = (value: any) => {
    input.handleChange(input.control.value.path, adaptValue(value));
  };

  const persistentHint = (): boolean => {
    return !isDescriptionHidden(
      input.control.value.visible,
      input.control.value.description,
      isFocused.value,
      !!appliedOptions.value?.showUnfocusedDescription
    );
  };

  const computedLabel = useComputedLabel(input, appliedOptions);

  const controlWrapper = computed(() => {
    const { id, description, errors, label, visible, required } =
      input.control.value;
    return { id, description, errors, label, visible, required };
  });

  const styles = useStyles(input.control.value.uischema);

  return {
    ...input,
    styles,
    isFocused,
    appliedOptions,
    controlWrapper,
    onChange,
    persistentHint,
    computedLabel,
  };
};

export const useTranslator = () => {
  const jsonforms = inject<JsonFormsSubStates>('jsonforms');

  if (!jsonforms) {
    throw new Error(
      "'jsonforms couldn't be injected. Are you within JSON Forms?"
    );
  }

  if (!jsonforms.i18n || !jsonforms.i18n.translate) {
    throw new Error(
      "'jsonforms i18n couldn't be injected. Are you within JSON Forms?"
    );
  }

  const translate = computed(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return jsonforms.i18n!.translate!;
  });

  return translate;
};

/**
 * Adds styles and appliedOptions
 */
export const useVuetifyLayout = <I extends { layout: any }>(input: I) => {
  const appliedOptions = computed(() =>
    merge(
      {},
      cloneDeep(input.layout.value.config),
      cloneDeep(input.layout.value.uischema.options)
    )
  );
  return {
    ...input,
    styles: useStyles(input.layout.value.uischema),
    appliedOptions,
  };
};

/**
 * Adds styles, appliedOptions and childUiSchema
 */
export const useVuetifyArrayControl = <I extends { control: any }>(
  input: I
) => {
  const appliedOptions = useControlAppliedOptions(input);

  const computedLabel = useComputedLabel(input, appliedOptions);

  const childLabelForIndex = (index: number) => {
    const childLabelProp =
      input.control.value.uischema.options?.childLabelProp ??
      getFirstPrimitiveProp(input.control.value.schema);
    if (!childLabelProp) {
      return `${index}`;
    }
    const labelValue = Resolve.data(
      input.control.value.data,
      composePaths(`${index}`, childLabelProp)
    );
    if (
      labelValue === undefined ||
      labelValue === null ||
      Number.isNaN(labelValue)
    ) {
      return '';
    }
    return `${labelValue}`;
  };
  return {
    ...input,
    styles: useStyles(input.control.value.uischema),
    appliedOptions,
    childLabelForIndex,
    computedLabel,
  };
};

/**
 * Adds styles and appliedOptions
 */
export const useVuetifyBasicControl = <I extends { control: any }>(
  input: I
) => {
  const appliedOptions = useControlAppliedOptions(input);

  return {
    ...input,
    styles: useStyles(input.control.value.uischema),
    appliedOptions,
  };
};

/**
 * Extracts Ajv from JSON Forms
 */
export const useAjv = () => {
  const jsonforms = inject<JsonFormsSubStates>('jsonforms');

  if (!jsonforms) {
    throw new Error(
      "'jsonforms' couldn't be injected. Are you within JSON Forms?"
    );
  }

  // should always exist
  return jsonforms.core?.ajv as Ajv;
};


/**
 * Adds styles, isFocused, appliedOptions and onChange
 */
export const useVuetifyControlExt = <
  I extends { control: any; handleChange: any }
>(
  props: RendererProps<ControlElement> | any,
  input: I,
  adaptValue: (target: any) => any = (v) => v
) => {
  const appliedOptions = useControlAppliedOptions(input);

  const isFocused = ref(false);
  const onChange = (value: any) => {
    input.handleChange(input.control.value.path, adaptValue(value));
  };

  const persistentHint = (): boolean => {
    return !isDescriptionHidden(
      input.control.value.visible,
      input.control.value.description,
      isFocused.value,
      !!appliedOptions.value?.showUnfocusedDescription
    );
  };

  const computedLabel = useComputedLabel(input, appliedOptions);

  const controlWrapper = computed(() => {
    const { id, description, errors, label, visible, required } =
      input.control.value;
    return { id, description, errors, label, visible, required };
  });

  const styles = useStyles(input.control.value.uischema);

  // Extension for dependents fields
  const indexc = pathControlSchema(props.uischema.scope);
  const store = inject<any>('store');
  const pmreactivex = inject<any>('pmreactivex');

  // CREATE FUNCTION
  let fnOnchange = new Function();
  if (props.uischema.options && props.uischema.options.onChange) {
    fnOnchange = new Function(props.uischema.options.onChange.arguments, props.uischema.options.onChange.body);
  }
  // CREATE FUNCTION DEEPCHANGE
  let deepChange = new Function();
  if (props.uischema.options && props.uischema.options.events && props.uischema.options.events.deepChange) {
    deepChange = new Function(props.uischema.options.events.deepChange.arguments, props.uischema.options.events.deepChange.body);
  }
  //Watch own value
  const unwatch = store?.watch((state: any) => {
    return state.app.data[indexc];
  }, (n: string, o: string) => {
    pmreactivex.emit(indexc, n);
    fnOnchange(store, n, o);
  });

  const dependencies = _.map(props.uischema.rule && props.uischema.rule.condition.conditions ? props.uischema.rule.condition.conditions : [], e => pathControlSchema(e.scope));
  pmreactivex.joinFork(dependencies, (payload: any) => {
    deepChange(_, payload).then((res: any) => {
      console.log("DEEP");
      let newArray = res || [];
      Vue.nextTick(() => {
        store.set("app/schemaModel@properties." + indexc + ".enum", newArray);
      });
    });
  }, indexc);

  onBeforeMount(() => {
  });
  onMounted(() => {
  });
  onBeforeUpdate(() => {
  });
  onUpdated(() => {
  });
  onBeforeUnmount(() => {
  });
  onUnmounted(() => {
    unwatch();
  });
  onActivated(() => {
  });
  onDeactivated(() => {
  });
  onErrorCaptured(() => {
  });
  return {
    ...input,
    styles,
    isFocused,
    appliedOptions,
    controlWrapper,
    onChange,
    persistentHint,
    computedLabel,
  };
};


const pathControlSchema = (input: string): string => {
  return input.split("/").pop() || "";
};
