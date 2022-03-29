// import { input as allOf } from './allOf';
// import { input as anyOf } from './anyOf';
// import { input as anyOfSimple } from './anyOf-simple';
// import { input as array } from './array';
// import { input as arrayRestrict } from './array-restrict';
// import { input as arrayWithReorder } from './array-with-reorder';
// import { input as basic } from './basic';
// import { input as categorization } from './categorization';
// import { input as categorizationStepper } from './categorization-stepper';
// import { input as categorizationStepperNav } from './categorization-stepper-nav';
import { input as control } from './control';
// import { input as controlOptions } from './control-options';
// import { input as enumExample } from './enum';
// import { input as enumInArray } from './enum-in-array';
// import { input as groupLayout } from './group-layout';
// import { input as horizontalLayout } from './horizontal-layout';
// import { input as listWithDetails } from './list-with-details';
// import { input as listWithDetailsAndReorder } from './list-with-details-and-reorder';
// import { input as listWithDetailsRestrict } from './list-with-details-restrict';
// import { input as login } from './login';
import { input as main } from './main';
// import { input as multiEnum } from './multi-enum';
// import { input as nestedArray } from './nested-array';
// import { input as nestedArrayRestrict } from './nested-array-restrict';
// import { input as nestedArrayWithReorder } from './nested-array-with-reorder';
// import { input as nestedLayout } from './nested-layout';
// import { input as noSchemas } from './no-schemas';
// import { input as noUISchema } from './no-ui-schema';
// import { input as object } from './object';
// import { input as oneOf } from './oneOf';
// import { input as oneOfRecursive } from './oneOf-recursive';
// import { input as radio } from './radio';
// import { input as radioGroup } from './radio-group';
// import { input as rootObject } from './root-object';
// import { input as rule } from './rule';
// import { input as verticalLayout } from './vertical-layout';
// import { input as huge } from './huge';
// import { input as ifThenElse } from './if-then-else';

// import { input as ruleMultiple } from './rule-multiple';
// import { input as suggest } from './suggest';
// import { input as multipleFile } from './multiple-file';
// import { input as grid } from './grid';
// import { input as variables } from './variables';
// import { input as subForm } from './sub-form';
// import { input as dependent } from './dependent';
// import { input as htmlViewer } from './html-viewer';

const items = [
  {
    id: 'main',
    title: 'Main',
    input: main,
  },
  {
    id: 'control',
    title: 'Control',
    input: control,
  },
];

export const examples = [
  {
    action: 'mdi-code-json',
    active: true,
    items,
    title: 'Main',
  },
];
