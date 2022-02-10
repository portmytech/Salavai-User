export class Coupon {
    id: number;
    code: string;
    amount: string;
    date_expires: string;
    description: string;
    minimum_amount: string;
    maximum_amount: string;
    discount_type: string; //Options: percent, fixed_cart and fixed_product.
    usage_count: number;
    usage_limit: number;
    individual_use: boolean;
    product_ids: Array<number>;
    excluded_product_ids: Array<number>;
}