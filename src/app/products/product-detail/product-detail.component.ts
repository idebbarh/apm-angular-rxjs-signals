import { Component, inject } from '@angular/core';

import { NgIf, NgFor, CurrencyPipe, AsyncPipe } from '@angular/common';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { EMPTY, Subscription, catchError, map } from 'rxjs';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe, AsyncPipe],
})
export class ProductDetailComponent {
  // Just enough here for the template to compile
  errorMessage = '';
  sub!: Subscription;

  //product service
  productService = inject(ProductService);

  product$ = this.productService.product$.pipe(
    catchError((error: string) => {
      this.errorMessage = error;
      return EMPTY;
    }),

    map((product) =>
      product
        ? {
            ...product,
            pageTitle: `Product Detail for: ${product.productName}`,
          }
        : product,
    ),
  );

  addToCart(product: Product) {}
}
