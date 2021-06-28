import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import {  throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Role } from '../models/role';
@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private httpClient: HttpClient) { }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  public sendRequestForGettingRoles() {
    return this.httpClient.get<Role[]>(environment.base_url + "/roles").pipe(retry(2), catchError(this.handleError));
  }

  public sendRequestForSaveRole(role: Role) {
    return this.httpClient.post(environment.base_url + "/roles", role).pipe(retry(2), catchError(this.handleError));
  }

  public sendRequestForGettingRole(id: number) {
    return this.httpClient.get<Role>(environment.base_url + "/roles/" + id).pipe(retry(2), catchError(this.handleError));
  }
}
