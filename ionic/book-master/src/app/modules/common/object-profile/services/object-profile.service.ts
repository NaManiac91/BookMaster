import {Injectable} from '@angular/core';
import {IModel} from "../../../shared/rest-api-client";

export enum ObjectProfileView {
  Consult,
  Create,
  Edit,
  List
}

export const DEFAULT_VIEW = ObjectProfileView.Consult;

export interface IObjectProfile {
  view: ObjectProfileView;
  type: any;
}

export interface IProfileComponent {
  object: IModel;
}

const objectProfiles: IObjectProfile[] = [];

export function ObjectProfile(config: IObjectProfile) {
  return (target: any) => {
    const profile = Object.assign({
      view: DEFAULT_VIEW
    }, config, {
      component: target
    });
    objectProfiles.push(profile)
  };
}

@Injectable({
  providedIn: 'root'
})
export class ObjectProfileService {
  cache: { [key: string]: any } = {};

  constructor() { }

  getObjectProfile(type: string, view: ObjectProfileView): any {
    let cached = this.cache[type] && this.cache[type][view] ? this.cache[type][view] : null;
    if (!cached) {
      const profile: IObjectProfile | undefined = objectProfiles.find(profile => profile.view === view && profile.type.name === type);

      if (!profile) {
        console.log('Object Profile not found');
      } else {
        if (!this.cache[type]) {
          this.cache[type] = {}
        }
        this.cache[type][view] = {};
        cached = this.cache[type][view] = profile;
      }
    }

    return cached.component;
  }
}
