import { EditorUISchemaElement } from '../model/uischema';
import {
  createCategorization,
  createLabel,
  createLayout,
} from '../util/generators/uiSchema';
import { createControl } from '../util/generators/schema'
export interface scrennService {
  getScreenById(id:any): any;
}



const screens:any = {
      address: {
        schema: {
          type: 'object',
          title: 'Address',
          properties: {
            street_address: {
              type: 'string',
            },
            city: {
              type: 'string',
            },
            state: {
              type: 'string',
            },
          },
          required: ['street_address', 'city', 'state'],
        },
        uiSchema:{
                type: 'VerticalLayout',
                elements: [
                  {
                    type: 'HorizontalLayout',
                    elements: [
                      {
                        type: 'Control',
                        scope: '#/properties/city',
                        label: 'city',
                      },
                      {
                        type: 'Control',
                        scope: '#/properties/state',
                        label: 'State',
                      },
                    ],
                  },
                ],
        }
      },
      
      
     
      user: {
        schema:{
          type: 'object',
          title: 'User',
          properties: {
            name: {
              type: 'string',
            },
            mail: {
              type: 'string',
            },
          },
          required: ['name', 'mail'],
        },
        uiSchema:{
          type: 'VerticalLayout',
              elements: [
                {
                  type: 'HorizontalLayout',
                  elements: [
                    {
                      type: 'Control',
                      scope: '#/properties/name',
                      label: 'Name',
                    },
                    {
                      type: 'Control',
                      scope: '#/properties/mail',
                      label: 'Mail',
                    },
                  ],
                },
              ],
        }
       
      },
    };

export class DefaultScreenService implements scrennService {
  getScreenById = (id:any) => screens[id];
}
