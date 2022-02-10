import { Variation } from "./variation.models";
import { Product } from "./product.models";

export class CartItem {
	quantity: number;
	pro: Product;
	vari: Variation;
}