
import { JsonSchema } from '@jsonforms/core';
import { EditorUISchemaElement } from '../model/uischema';
import {SchemaElement, buildSchemaTree} from '../model/schema'
import {
  createCategorization,
  createLabel,
  createLayout,
  createControl
} from '../util/generators/uiSchema';

export interface PaletteService {
  getPaletteElements(): PaletteElement[];
  getPaletteElementsTree(): PalleteTree[];
}

export interface PaletteElement {
  type: string;
  label: string;
  icon: string;
  uiSchemaElementProvider: () => EditorUISchemaElement;
}
export interface PaletteControlElement {
  type: string;
  label: string;
  icon: string;
  uiSchemaElementProvider: (schemaElement:SchemaElement ) => EditorUISchemaElement;

}

export interface PalleteTree {
  label: string;
  icon: string;
  children: PaletteElement[] | PaletteControlElement[]
}

const paletteElements: PaletteElement[] = [
  {
    type: 'HorizontalLayout',
    label: 'Horizontal Layout',
    icon: 'mdi-arrow-expand-horizontal',
    uiSchemaElementProvider: () => createLayout('HorizontalLayout'),
  } as PaletteElement,
  {
    type: 'VerticalLayout',
    label: 'Vertical Layout',
    icon: 'mdi-arrow-expand-vertical',
    uiSchemaElementProvider: () => createLayout('VerticalLayout'),
  },
  {
    type: 'Group',
    label: 'Group',
    icon: 'mdi-group',
    uiSchemaElementProvider: () => createLayout('Group'),
  },
  {
    type: 'Label',
    label: 'Label',
    icon: 'mdi-format-letter-case-lower',
    uiSchemaElementProvider: () => createLabel(),
  },
  {
    type: 'Categorization',
    label: 'Categorization',
    icon: 'mdi-tab',
    uiSchemaElementProvider: () => createCategorization(),
  },
];
const controlElements: PaletteControlElement[] =[
  {
    type: 'Control',
    label: 'textfield',
    icon: '',
    uiSchemaElementProvider: (schema:SchemaElement) => createControl(schema),
  },
];
const palleteTree: PalleteTree[] = [
  {
    label: "Containers",
    icon: '',
    children: paletteElements
  },
  {
    label: "Controls",
    icon: '',
    children: controlElements
  }
];
export class DefaultPaletteService implements PaletteService {
  getPaletteElements = () => paletteElements;
  getPaletteElementsTree = () => palleteTree;
}
