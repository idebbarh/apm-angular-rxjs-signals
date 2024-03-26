import {
  Component,
  Input,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CartItem } from '../cart';
import { CartService } from '../cart.service';

@Component({
  selector: 'sw-cart-item',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, NgFor, NgIf],
  templateUrl: './cart-item.component.html',
})
export class CartItemComponent {
  @Input({ required: true }) set cartItem(ci: CartItem) {
    this.item.set(ci);
  }

  item: WritableSignal<CartItem | undefined> = signal(undefined);

  cartService = inject(CartService);
  // Quantity available (hard-coded to 8)
  // Mapped to an array from 1-8
  qtyArr = computed(() => {
    const item = this.item();
    return item && item.product.quantityInStock
      ? new Array(item.product.quantityInStock)
          .fill(0)
          .map((_, index) => index + 1)
      : [];
  });

  // Calculate the extended price
  exPrice = computed(() => {
    const item = this.item();
    return item ? item.quantity * item.product.price : 0;
  });

  onQuantitySelected(quantity: string): void {
    const item = this.item();
    if (!item) return;

    const newItem: CartItem = {
      ...item,
      quantity: parseInt(quantity),
      product: { ...item.product },
    };

    this.cartService.updateCartItem(newItem);
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }
}
