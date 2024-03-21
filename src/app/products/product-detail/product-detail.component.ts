import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';

import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { EMPTY, Subscription, catchError, finalize, tap } from 'rxjs';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe],
})
export class ProductDetailComponent implements OnChanges, OnDestroy {
  // Just enough here for the template to compile
  @Input({ required: true }) productId!: number;
  errorMessage = '';
  sub!: Subscription;

  //product service
  productService = inject(ProductService);

  // Product to display
  product: Product | null = null;

  // Set the page title
  pageTitle = this.product
    ? `Product Detail for: ${this.product.productName}`
    : 'Product Detail';

  addToCart(product: Product) {}

  //hooks
  ngOnChanges(changes: SimpleChanges): void {
    const sid = changes['productId'];

    if (this.sub) {
      this.sub.unsubscribe();
    }

    if (sid) {
      const id = sid.currentValue;
      this.sub = this.productService
        .getProduct(id)
        .pipe(
          catchError((error: string) => {
            this.errorMessage = error;
            return EMPTY;
          }),
        )
        .subscribe((product) => (this.product = product));
    }
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }
}
