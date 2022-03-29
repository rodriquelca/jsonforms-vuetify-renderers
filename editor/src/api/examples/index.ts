import { input as control } from './control';
import { input as main } from './main';

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
