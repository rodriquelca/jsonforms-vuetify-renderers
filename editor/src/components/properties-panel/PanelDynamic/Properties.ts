export const fieldProperties = {};

export default [
  {
    id: 'variable',
    type: 'text',
    name: 'Variable',
  },
  {
    id: 'placeholder',
    type: 'text',
    name: 'Placeholder',
  },
  {
    id: 'label',
    type: 'text',
    name: 'Label',
  },
  {
    id: 'description',
    type: 'textarea',
    name: 'Description',
  },
  {
    id: 'validation',
    type: 'text',
    name: 'Validation',
  },
  {
    id: 'validationMessage',
    type: 'text',
    name: 'Validation message',
  },
  {
    id: 'mask',
    type: 'text',
    name: 'Mask',
  },
  {
    id: 'maxLength',
    type: 'text',
    name: 'Max length',
  },
  {
    id: 'textTransform',
    type: 'dropdown',
    name: 'Text transform to',
    items: [
      {
        text: 'None',
        id: 'none',
      },
      {
        text: 'Lowercase',
        id: 'lowercase',
      },
      {
        text: 'Uppercase',
        id: 'uppercase',
      },
      {
        text: 'Capital Phrase',
        id: 'capital',
      },
      {
        text: 'Title case',
        id: 'title',
      },
    ],
  },
  {
    id: 'required',
    type: 'checkbox',
    name: 'Required',
  },
  {
    id: 'readOnly',
    type: 'checkbox',
    name: 'Read Only',
  },
  {
    id: 'multi',
    type: 'checkbox',
    name: 'Multi',
  },
  {
    id: 'trim',
    type: 'checkbox',
    name: 'Trim text',
  },
  {
    id: 'restrictMaxLength',
    type: 'checkbox',
    name: 'Restrict to max length',
  },
];
