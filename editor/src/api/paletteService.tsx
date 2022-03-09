import { EditorUISchemaElement } from '../model/uischema';
import {
  createCategorization,
  createLabel,
  createLayout,
} from '../util/generators/uiSchema';
import { createControl } from '../util/generators/schema'
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
      return {
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
      const control = createControl("string", { format: "date" });
      return {
        control,
        variable: "DatePicker"
      };
    },
  },

  {
    type: 'Control',
    label: 'Date Time Picker',
    icon: 'mdi-calendar-clock-outline',
    uiSchemaElementProvider: () => {
      const control = {
        "type": "string",
        "format": "date-time"
      };
      return {
        control,
        variable: "datetime"
      };
    },
  },
  {
    type: 'Control',
    label: 'Time Picker',
    icon: 'mdi-clock-outline',
    uiSchemaElementProvider: () => {
      const control = {
        "type": "string",
        "format": "time"
      };
      return {
        control,
        variable: "time"
      };
    },
  },

  {
    type: 'Control',
    label: 'File Upload',
    icon: 'mdi-file-upload',
    uiSchemaElementProvider: () => {
      const control = createControl("array", {
        items: {
          name: {
            "type": "string"
          },
          size: {
            "type": "string"
          },
          mimetype: {
            "type": "string"
          }
        }
      });
      return {
        control,
        variable: "multipleFile",
        uiOptions: {
          "multipleFile": true,
          "placeholder": "Select your files",
          "multiple": true,
          "accept": ".png",
          "maxFileSize": 70000
        }
      };
    }
  },
  {
    type: 'Control',
    label: 'Line Input',
    icon: 'mdi-crop-square',
    uiSchemaElementProvider: () => {
      const control = createControl("string");
      return {
        control,
        variable: "textField"
      };
    },
  },
  {
    type: 'Control',
    label: 'Text Area',
    icon: 'mdi-format-pilcrow',
    uiSchemaElementProvider: () => {
      const control = createControl("string");
      return {
        control,
        variable: "textArea",
        uiOptions: { multi: true }
      };
    },
  },
  {
    type: 'Control',
    label: 'Suggest',
    icon: 'mdi-text-box-search-outline',
    uiSchemaElementProvider: () => {
      const control = {
        type: "object",
        properties: {
          API: {
            type: "string"
          },
          Auth: {
            type: "string"
          },
          Category: {
            type: "string"
          },
          Cors: {
            type: "string"
          },
          Description: {
            type: "string"
          },
          HTTPS: {
            type: "boolean"
          },
          Link: {
            type: "string"
          }
        }
      }
      return {
        control,
        variable: "suggest",
        uiOptions: {
          "suggest": true,
          "url": "https://api.publicapis.org/entries",
          "query": "test",
          "placeholder": "Start typing to Search"
        }
      };
    },
  },
  {
    type: 'Control',
    label: 'Select List',
    icon: 'mdi-form-dropdown',
    uiSchemaElementProvider: () => {
      const control = {
        "type": "string",
        "oneOf": [
          {
            "const": "foo",
            "title": "Foo"
          },
          {
            "const": "bar",
            "title": "Bar"
          },
          {
            "const": "foobar",
            "title": "FooBar"
          }
        ]
      }
      return {
        control,
        variable: "dropdown"
      };
    },
  },
  {
    type: 'Control',
    label: 'Number',
    icon: 'mdi-numeric',
    uiSchemaElementProvider: () => {
      const control = {
        "type": "number"
      };
      return {
        control,
        variable: "number"
      };
    },
  },
  {
    type: 'Control',
    label: 'Integer',
    icon: 'mdi-counter',
    uiSchemaElementProvider: () => {
      const control = {
        "type": "integer"
      };
      return {
        control,
        variable: "integer"
      };
    },
  },
  {
    type: 'Control',
    label: 'Radio Group',
    icon: 'mdi-radiobox-marked',
    uiSchemaElementProvider: () => {
      const control = {
        "type": "string",
        "enum": [
          "One",
          "Two",
          "Three"
        ]
      };
      return {
        control,
        variable: "radioGroup",
        uiOptions: {
          "format": "radio"
        }
      };
    },
  },

];


const complexElements = [
  {
    type: 'Control',
    label: 'Grid',
    icon: 'mdi-checkbox-outline',
    uiSchemaElementProvider: () => {
      const control = {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "date": {
              "type": "string",
              "format": "date"
            },
            "message": {
              "type": "string",
              "maxLength": 5
            },
            "enum": {
              "type": "string",
              "enum": [
                "foo",
                "bar"
              ]
            }
          }
        },
        "minItems": 1,
        "maxItems": 15
      }

      return {
        control,
        variable: "grid",
        uiOptions: {
          "extendedType": "grid",
          "restrict": true,
          "pageSize": 5
        }
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
  },
  complex: {
    label: 'Complex',
    elements: complexElements
  }
}

export class DefaultPaletteService implements PaletteService {
  getPaletteElements = () => mainPalette;
}
