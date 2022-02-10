export class StripeRequest {
    payment_method: string;
    order_id: string;
    payment_token: string;

    constructor(payment_method: string, order_id: string, payment_token: string) {
        this.payment_method = payment_method;
        this.order_id = order_id;
        this.payment_token = payment_token;
    }
}