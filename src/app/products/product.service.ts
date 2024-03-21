import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  Observable,
  catchError,
  map,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { Product } from './product';
import { HttpErrorService } from '../utilities/http-error.service';
import { ReviewService } from '../reviews/review.service';
import { Review } from '../reviews/review';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsUrl = 'api/products';
  private http = inject(HttpClient);
  private httpErrorService = inject(HttpErrorService);
  private reviewService = inject(ReviewService);

  getProducts(): Observable<Product[]> {
    return this.http
      .get<Product[]>(this.productsUrl)
      .pipe(catchError(this.handleError()));
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.productsUrl}/${id}`).pipe(
      tap((product) => console.log(product.productName)),
      switchMap((product) => this.getProductWithReviews(product)),
      catchError(this.handleError()),
    );
  }

  getProductWithReviews(product: Product): Observable<Product> {
    if (product.hasReviews) {
      return this.http
        .get<Review[]>(this.reviewService.getReviewUrl(product.id))
        .pipe(map((reviews) => ({ ...product, reviews })));
    }

    return of(product);
  }

  private handleError() {
    return (error: HttpErrorResponse) => {
      const userFriendlyMessageError = this.httpErrorService.formatError(error);
      console.error(error);
      return throwError(() => userFriendlyMessageError);
    };
  }
}
