import { Injectable, Inject } from '@angular/core';
import { Product } from "../models/product.models";
import { CartItem } from "../models/cart-item.models";
import { Constants } from '../models/constants.models';
import { Variation } from '../models/variation.models';


@Injectable()
export class Global {
	private favorites: Array<Product>;
	private cartItems: Array<CartItem>;
	private searchHistory: Array<string>;

	constructor() {
		let cartItems: Array<CartItem> = JSON.parse(window.localStorage.getItem(Constants.CART_ITEMS));
		if (cartItems != null) {
			this.cartItems = cartItems;
		} else {
			this.cartItems = new Array<CartItem>();
		}

		let history: Array<string> = JSON.parse(window.localStorage.getItem(Constants.SEARCH_HISTORY));
		if (history != null) {
			this.searchHistory = history;
		} else {
			this.searchHistory = new Array<string>();
		}

		let favProducts: Array<Product> = JSON.parse(window.localStorage.getItem(Constants.FAVORITE_PRODUCTS));
		if (favProducts != null) {
			this.favorites = favProducts;
		} else {
			this.favorites = new Array<Product>();
		}
	}

	updateCartItem(pro: Product) {
		let myMap = new Map<string, string>();
		if (pro.variationsSelected && pro.variationsSelected.length) {
			for (let vari of pro.variationsSelected) {
				for (let i = 0; i < this.cartItems.length; i++) {
					if (pro.id == this.cartItems[i].pro.id
						&&
						vari.id == this.cartItems[i].vari.id) {
						myMap.set((String(pro.id) + String(vari.id)), String(this.cartItems[i].quantity));
						break;
					}
				}
			}
		}
		if (pro.variationsAvailable && pro.variationsAvailable.length) {
			for (let vari of pro.variationsAvailable) {
				this.removeCartVariation(vari);
			}
		}
		if (pro.variationsSelected && pro.variationsSelected.length) {
			for (let vari of pro.variationsSelected) {
				this.addCartVariation(pro, vari, myMap.get(String(pro.id) + String(vari.id)));
			}
		}
	}

	addCartVariation(pro: Product, vari: Variation, quantity: string) {
		let cartItem = new CartItem();
		cartItem.vari = vari;
		cartItem.quantity = Number(quantity) ? Number(quantity) : 1;
		cartItem.pro = pro;
		this.cartItems.push(cartItem);
		window.localStorage.setItem(Constants.CART_ITEMS, JSON.stringify(this.cartItems));
	}

	removeCartVariation(pro: Variation) {
		let pos: number = -1;
		for (let i = 0; i < this.cartItems.length; i++) {
			if (pro.id == this.cartItems[i].vari.id) {
				pos = i;
				break;
			}
		}
		if (pos != -1) {
			this.cartItems.splice(pos, 1);
			window.localStorage.setItem(Constants.CART_ITEMS, JSON.stringify(this.cartItems));
		}
	}

	decrementCartItem(cartItem: CartItem) {
		let pos: number = -1;
		for (let i = 0; i < this.cartItems.length; i++) {
			if (cartItem.pro.id == this.cartItems[i].pro.id
				&&
				cartItem.vari.id == this.cartItems[i].vari.id) {
				pos = i;
				break;
			}
		}
		if (pos != -1) {
			if (this.cartItems[pos].quantity > 1) {
				this.cartItems[pos].quantity = this.cartItems[pos].quantity - 1;
			} else {
				this.cartItems.splice(pos, 1);
			}
			window.localStorage.setItem(Constants.CART_ITEMS, JSON.stringify(this.cartItems));
		}
	}

	incrementCartItem(cartItem: CartItem) {
		let pos: number = -1;
		for (let i = 0; i < this.cartItems.length; i++) {
			if (cartItem.pro.id == this.cartItems[i].pro.id
				&&
				cartItem.vari.id == this.cartItems[i].vari.id) {
				pos = i;
				break;
			}
		}
		if (pos != -1) {
			this.cartItems[pos].quantity = this.cartItems[pos].quantity + 1;
			window.localStorage.setItem(Constants.CART_ITEMS, JSON.stringify(this.cartItems));
		}
	}

	setCartItem(cartItem: CartItem) {
		let pos: number = -1;
		for (let i = 0; i < this.cartItems.length; i++) {
			if (cartItem.pro.id == this.cartItems[i].pro.id
				&&
				cartItem.vari.id == this.cartItems[i].vari.id) {
				pos = i;
				break;
			}
		}
		if (pos != -1) {
			this.cartItems[pos].quantity = cartItem.quantity;
			if (this.cartItems[pos].quantity <= 0) {
				this.cartItems.splice(pos, 1);
			}
			window.localStorage.setItem(Constants.CART_ITEMS, JSON.stringify(this.cartItems));
		}
	}

	clearFavorites(){
		this.favorites = new Array<Product>();
		window.localStorage.setItem(Constants.FAVORITE_PRODUCTS, JSON.stringify(this.favorites));
	}

	clearCart() {
		this.cartItems = new Array<CartItem>();
		window.localStorage.setItem(Constants.CART_ITEMS, JSON.stringify(this.cartItems));
	}

	clearSearchHistory() {
		this.searchHistory = new Array<string>();
		window.localStorage.setItem(Constants.SEARCH_HISTORY, JSON.stringify(this.searchHistory));
	}

	getSearchHistory() {
		return this.searchHistory;
	}

	getFavorites() {
		return this.favorites;
	}

	getCartItems() {
		return this.cartItems;
	}

	getCartItemsCount() {
		return this.cartItems.length;
	}
}