import {
  Injectable,
  OnInit,
  WritableSignal,
  computed,
  effect,
  signal,
} from '@angular/core';
import { Product } from '../products/product';
import { CartItem } from './cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItemsLocalStorageKey = 'cartItems';
  private writableCartProducts: WritableSignal<CartItem[]> = signal([]);
  readonly cartProducts = computed(() => this.writableCartProducts());

  constructor() {
    const cartItems = localStorage.getItem(this.cartItemsLocalStorageKey);
    if (cartItems) {
      const parsedCartItems: CartItem[] = JSON.parse(cartItems);
      this.writableCartProducts.set(parsedCartItems);
    }

    effect(() => {
      const cartItems = this.cartProducts();
      localStorage.setItem(
        this.cartItemsLocalStorageKey,
        JSON.stringify(cartItems),
      );
    });
  }

  addToCart(product: Product) {
    this.writableCartProducts.update((cartItems) => [
      ...cartItems.filter((item) => item.product.id !== product.id),
      {
        quantity:
          (cartItems.find((item) => item.product.id === product.id)?.quantity ??
            0) + 1,
        product,
      },
    ]);
  }
}
