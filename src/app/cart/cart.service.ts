import {
  Injectable,
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
  private TAX = 10.75;

  private cartItemsLocalStorageKey = 'cartItems';

  private writableCartProducts: WritableSignal<CartItem[]> = signal([]);

  readonly cartProducts = computed(() => this.writableCartProducts());

  readonly cartSubTotal = computed(() => {
    return this.cartProducts().reduce(
      (accSubTotal, item) => accSubTotal + item.quantity * item.product.price,
      0,
    );
  });

  readonly deliveryFee = computed(() => {
    return this.cartSubTotal() < 50 ? 5.99 : 0;
  });

  readonly tax = computed(() => {
    return this.getNumberPercentValue(this.cartSubTotal(), this.TAX);
  });

  readonly cartTotalPrice = computed(() => {
    return this.cartSubTotal() + this.tax() + this.deliveryFee();
  });

  readonly cartCount = computed(() => {
    return this.cartProducts().reduce(
      (accQnt, item) => accQnt + item.quantity,
      0,
    );
  });

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

  updateCartItem(item: CartItem) {
    this.writableCartProducts.update((cartItems) =>
      cartItems.map((it) => (it.product.id === item.product.id ? item : it)),
    );
  }

  removeFromCart(productId: number) {
    this.writableCartProducts.update((cartItems) =>
      cartItems.filter((item) => item.product.id !== productId),
    );
  }

  private getNumberPercentValue(number: number, percentValue: number): number {
    return Math.round((percentValue * number) / 100);
  }
}
