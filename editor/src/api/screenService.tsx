import { EditorUISchemaElement } from '../model/uischema';
import {
  createCategorization,
  createLabel,
  createLayout,
} from '../util/generators/uiSchema';
import { createControl } from '../util/generators/schema'
import { examples } from './examples';
export interface scrennService {
  getScreenById(id:any): any;
}


const screens:any = {
      demo: {
        schema: examples[1].items[0].input.schema,
        uiSchema:examples[1].items[0].input.uischema
      },     
      shipping: {
        schema:examples[1].items[1].input.schema,
        uiSchema:examples[1].items[1].input.uischema,
      },
    };

export class DefaultScreenService implements scrennService {
  getScreenById = (id:any) => screens[id];
}
