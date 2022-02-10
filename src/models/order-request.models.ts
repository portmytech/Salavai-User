import { Address } from "./address.models";
import { ShippingLine } from "./shipping-line.models";
import { KeyValue } from "./key-value.models";
import { LineItem } from "./line-item.models";

export class OrderRequest {
    payment_method: string;
    payment_method_title: string;
    customer_id: string;
    set_paid: boolean;
    billing: Address;
    shipping: Address;
    meta_data: Array<KeyValue>;
    line_items: Array<LineItem>;
    shipping_lines: Array<ShippingLine>;
    fee_lines: Array<{ name: string, total: string, tax_status: string }>;
}