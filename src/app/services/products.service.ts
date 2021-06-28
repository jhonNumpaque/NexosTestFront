import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import {  throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

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

  public sendRequestForGettingProducts() {
    return this.httpClient.get<Product[]>(environment.base_url + "/products").pipe(retry(2), catchError(this.handleError));
  }

  public sendRequestForGettingProductById(id: number) {
    return this.httpClient.get<Product>(environment.base_url + "/products/" + id).pipe(retry(2), catchError(this.handleError));
  }

  public sendRequestForSaveProduct(product: any) {
    return this.httpClient.post(environment.base_url + "/products", product).pipe(retry(2), catchError(this.handleError));
  }

  public sendRequestForUpdateProduct(product: any, id: number) {
    return this.httpClient.put(environment.base_url + "/products/" + id, product).pipe(retry(2), catchError(this.handleError));
  }

  public sendRequestForDeletingProductById(id: number) {
    return this.httpClient.delete(environment.base_url + "/products/" + id).pipe(retry(2), catchError(this.handleError));
  }
}
