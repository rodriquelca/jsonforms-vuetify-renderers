import { input as intro } from './intro';
import { input as control } from './control';
import { input as main } from './main';
import { input as leaveOfAbsenceRequestForm } from './leaveOfAbsenceRequestForm';

const items = [
  {
    id: 'intro',
    title: 'Intro',
    input: intro,
  },
  {
    id: 'leaveOfAbsenceRequestForm',
    title: 'Leave Of Absence Request Form',
    input: leaveOfAbsenceRequestForm,
  },
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
