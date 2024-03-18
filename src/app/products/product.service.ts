import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Product } from './product';
import { HttpErrorService } from '../utilities/http-error.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsUrl = 'api/products';
  private http = inject(HttpClient);
  private httpErrorService = inject(HttpErrorService);

  getProducts(): Observable<Product[]> {
    return this.http
      .get<Product[]>(this.productsUrl)
      .pipe(catchError(this.handleError()));
  }

  getProduct(id: number): Observable<Product> {
    return this.http
      .get<Product>(`${this.productsUrl}/${id}`)
      .pipe(catchError(this.handleError()));
  }

  private handleError() {
    return (error: HttpErrorResponse) => {
      const userFriendlyMessageError = this.httpErrorService.formatError(error);
      console.error(error);
      return throwError(() => userFriendlyMessageError);
    };
  }
}
