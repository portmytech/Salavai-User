import { Product } from "./product.models";

export class LineItem {
	id: number;
	product_id: number;
	variation_id: number;
	quantity: number;
	subtotal: number;
	subtotal_tax: number;
	subtotal_html: string;
	total_html: string;
	total: number;
	total_tax: number;
	price: number;
	price_html: string;
	sku: string;
	name: string;
	image: string;
	product: Product;
}