import {Injectable, Type} from '@angular/core';
import {IModel} from "../../rest-api-client";

const classes: {[key: string]: any} = {};

export function Initializer(className: string, type : Type<IModel>) {
  return (target: any) => {
    classes[className] = type;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ModelInitializerService {
  constructor() { }

  getTypeByClassName(className: string): Type<IModel> {
    return classes[className];
  }
}
