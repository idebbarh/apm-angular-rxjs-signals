import { Component, inject } from '@angular/core';

import { NgIf, NgFor, NgClass, AsyncPipe } from '@angular/common';
import { Product } from '../product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from '../product.service';
import { EMPTY, Observable, catchError } from 'rxjs';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, ProductDetailComponent, AsyncPipe],
})
export class ProductListComponent {
  pageTitle = 'Products';
  errorMessage = '';

  //product service
  productService = inject(ProductService);

  // Products
  readonly products$: Observable<Product[]> =
    this.productService.products$.pipe(
      catchError((error: string) => {
        this.errorMessage = error;
        return EMPTY;
      }),
    );

  // Selected product id to highlight the entry
  selectedProductId: number | undefined = undefined;

  onSelected(productId: number): void {
    this.selectedProductId = productId;
  }
}
