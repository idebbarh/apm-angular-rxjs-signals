import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  combineLatest,
  filter,
  map,
  of,
  switchMap,
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

  private selectedProductSubject = new BehaviorSubject<number | undefined>(
    undefined,
  );

  readonly selectedProduct$ = this.selectedProductSubject.asObservable();

  readonly products$ = this.http
    .get<Product[]>(this.productsUrl)
    .pipe(catchError(this.handleError()));

  // readonly product$ = this.selectedProduct$.pipe(
  //   filter(Boolean),
  //   switchMap((productId) => {
  //     return this.http.get<Product>(`${this.productsUrl}/${productId}`).pipe(
  //       switchMap((product) => this.getProductWithReviews(product)),
  //       catchError(this.handleError()),
  //     );
  //   }),
  // );

  readonly product$ = combineLatest([
    this.selectedProduct$,
    this.products$,
  ]).pipe(
    map(([productId, products]) => products.find((p) => p.id === productId)),
    filter(Boolean),
    switchMap((product) => this.getProductWithReviews(product)),
    catchError(this.handleError()),
  );

  getProductWithReviews(product: Product): Observable<Product> {
    if (product.hasReviews) {
      return this.http
        .get<Review[]>(this.reviewService.getReviewUrl(product.id))
        .pipe(map((reviews) => ({ ...product, reviews })));
    }

    return of(product);
  }

  selectProduct(productId: number) {
    this.selectedProductSubject.next(productId);
  }

  private handleError() {
    return (error: HttpErrorResponse) => {
      const userFriendlyMessageError = this.httpErrorService.formatError(error);
      console.error(error);
      return throwError(() => userFriendlyMessageError);
    };
  }
}
