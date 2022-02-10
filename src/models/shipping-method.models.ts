export class ShippingMethod {
    order: number;
    title: string;
    method_id: string;
    method_title: string;
    method_description: string;
    enabled: boolean;
    settings: any; //settings.cost, settings.min_amount and settings.class_cost_
    costToShow: string;
    cost: number;
    id: number;
}