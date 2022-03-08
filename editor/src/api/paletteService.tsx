import { EditorUISchemaElement } from '../model/uischema';
import {
  createCategorization,
  createLabel,
  createLayout,
} from '../util/generators/uiSchema';
import {createControl} from '../util/generators/schema'
export interface PaletteService {
  getPaletteElements(): PaletteElement[];
}

export interface PaletteElement {
  type: string;
  label: string;
  icon: string;
  uiSchemaElementProvider: () => EditorUISchemaElement;
}

const paletteElements: PaletteElement[] = [
  {
    type: 'HorizontalLayout',
    label: 'Horizontal Layout',
    icon: 'mdi-arrow-left-right',
    uiSchemaElementProvider: () => createLayout('HorizontalLayout'),
  } as PaletteElement,
  {
    type: 'VerticalLayout',
    label: 'Vertical Layout',
    icon: 'mdi-arrow-up-down',
    uiSchemaElementProvider: () => createLayout('VerticalLayout'),
  },
  {
    type: 'Group',
    label: 'Group',
    icon: 'mdi-focus-field',
    uiSchemaElementProvider: () => createLayout('Group'),
  },
  {
    type: 'Label',
    label: 'Label',
    icon: 'mdi-format-text',
    uiSchemaElementProvider: () => createLabel(),
  },
  {
    type: 'Categorization',
    label: 'Categorization',
    icon: 'mdi-tab',
    uiSchemaElementProvider: () => createCategorization(),
  },
];
const controlElements = [
  {
    type: 'Control',
    label: 'Checkbox',
    icon: 'mdi-checkbox-outline',
    uiSchemaElementProvider: () => {
      const control = createControl("boolean");
      return  {
        control,
        variable: "checkbox"
      };
    },
  },
  {
    type: 'Control',
    label: 'Date Picker',
    icon: 'mdi-calendar-month',
    uiSchemaElementProvider: () => {
      const control = createControl("string", {format: "date"});
      return  {
        control,
        variable: "DatePicker"
      };
    },
  },
  {
    type: 'Control',
    label: 'File Upload',
    icon: 'mdi-file-upload',
    uiSchemaElementProvider: () => createLabel(),
  },
  {
    type: 'Control',
    label: 'Line Input',
    icon: 'mdi-crop-square',
    uiSchemaElementProvider: () => {
      const control = createControl("string");
      return  {
        control,
        variable: "textField"
      };
    },
  },
]
const mainPalette = {
  containers: {
    label: 'Layouts & Others',
    elements: paletteElements
  },
  controls: {
    label: 'Controls',
    elements: controlElements
  }
}

export class DefaultPaletteService implements PaletteService {
  getPaletteElements = () => mainPalette;
}
