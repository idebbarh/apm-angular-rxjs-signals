import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { NgIf, NgFor, NgClass } from '@angular/common';
import { Product } from '../product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from '../product.service';
import { EMPTY, Subscription, catchError } from 'rxjs';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, ProductDetailComponent],
})
export class ProductListComponent implements OnInit, OnDestroy {
  pageTitle = 'Products';
  errorMessage = '';
  sub!: Subscription;

  //product service
  productService = inject(ProductService);

  // Products
  products: Product[] = [];

  // Selected product id to highlight the entry
  selectedProductId: number | undefined = undefined;

  onSelected(productId: number): void {
    this.selectedProductId = productId;
  }

  //hooks
  ngOnInit(): void {
    this.sub = this.productService.products$
      .pipe(
        catchError((error: string) => {
          this.errorMessage = error;
          return EMPTY;
        }),
      )
      .subscribe((products) => {
        this.products = products;
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
