import {Injectable} from '@angular/core';
import {ObjectProfileView} from "../../../enum";

export const DEFAULT_VIEW = ObjectProfileView.CONSULT;

export interface IObjectProfile {
  view: ObjectProfileView[] | ObjectProfileView;
  type: any;
}

const objectProfiles: IObjectProfile[] = [];

export function ObjectProfile(config: IObjectProfile) {
  return (target: any) => {
    if (!Array.isArray(config.view)) {
      config.view = [config['view']];
    }
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
      const profile: IObjectProfile | undefined = objectProfiles
        .find(profile => (profile.view as ObjectProfileView[]).some(v => v === view) && profile.type.name === type);

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

    return cached?.component;
  }
}
