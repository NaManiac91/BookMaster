import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Service} from "../../shared/rest-api-client";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly api = 'api/admin/';
  constructor(private httpClient: HttpClient) { }

  createService(service: Service): Observable<any> {
    return this.httpClient.post(this.api + 'createService', service);
  }
}
