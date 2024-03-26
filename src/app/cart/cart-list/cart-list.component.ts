import { Component, Signal, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { CartItem } from '../cart';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { CartService } from '../cart.service';
import { CartTotalComponent } from '../cart-total/cart-total.component';

@Component({
  selector: 'sw-cart-list',
  standalone: true,
  imports: [CartItemComponent, NgFor, NgIf, CartTotalComponent],
  templateUrl: 'cart-list.component.html',
})
export class CartListComponent {
  // Just enough here for the template to compile
  pageTitle = 'Cart';
  cartService = inject(CartService);
  cartItems: Signal<CartItem[]> = this.cartService.cartProducts;
}
