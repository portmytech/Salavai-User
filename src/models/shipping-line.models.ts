export class ShippingLine {
  method_id: string;
  method_title: string;
  total: string;

  constructor(method_id: string, method_title: string, total: string) {
    this.method_id = method_id;
    this.method_title = method_title;
    this.total = total;
  }
}