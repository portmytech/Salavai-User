import { Address } from "./address.models";
import { LineItem } from "./line-item.models";
import { KeyValue } from "./key-value.models";

export class Order {
	id: number;
	customer_id: number;
	order_key: string;
	number: string;
	currency: string;
	status: string;
	status_trans: string;
	date_created: string;
	payment_method: string;
	payment_method_title: string;
	transaction_id: string;
	time_pickup: string;
	time_delivery: string;
	time_complete: string;
	time_pickup_formatted: string;
	time_pickup_slot: string;
	time_delivery_formatted: string;
	time_delivery_slot: string;
	time_complete_formatted: string;
	total: number;
	total_html: string;
	discount_total: number;
	discount_total_html: string;
	total_tax: number;
	total_tax_html: string;
	shipping_total: number;
	shipping_total_html: string;
	prices_include_tax: boolean;
	billing: Address;
	shipping: Address;
	line_items: Array<LineItem>;
	meta_data: Array<KeyValue>;
	fee_lines: Array<{ name: string, total: string, tax_status: string }>;
}