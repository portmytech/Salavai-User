import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Order } from "../../models/order.models";
import { Currency } from '../../models/currency.models';
import { Constants } from '../../models/constants.models';
import { Helper } from '../../models/helper.models';

@Component({
  selector: 'page-orderslip',
  templateUrl: 'orderslip.html'
})
export class OrderslipPage {
  private order: Order;
  private orderProgress: number = 0;
  private servicefee: number = 0;
  private serviceHtml: string;

  constructor(private navCtrl: NavController, navParams: NavParams) {
    this.order = navParams.get('data');
    console.log(this.order);
    if (this.order.status.toLowerCase() == 'completed') {
      this.orderProgress = 3;
    } else if (this.order.status.toLowerCase() == 'processing') {
      this.orderProgress = 2;
    } else if (this.order.status.toLowerCase() == 'pending') {
      this.orderProgress = 1;
    }

    let hasServiceFee = false;
    let sf: string;
    if (this.order.fee_lines && this.order.fee_lines.length) {
      for (let fl of this.order.fee_lines) {
        if (fl.name.toLowerCase().includes("service")) {
          hasServiceFee = true;
          sf = fl.total;
          break;
        }
      }
    }
    if (hasServiceFee) {
      let currency: Currency = JSON.parse(window.localStorage.getItem(Constants.CURRENCY));
      if (currency) {
        let currencyText = currency.value;
        let iconText = currency.options[currency.value];
        let currencyIcon = iconText.substring(iconText.lastIndexOf('(') + 1, iconText.length - 1);

        if (!sf) sf = Helper.getSetting("laundry_appconfig_servicefee");

        if (sf && sf.length) {
          let servicefee = Number(Number(sf).toFixed(2));
          if (currencyIcon) {
            this.serviceHtml = currencyIcon + " " + servicefee;
          } else if (currencyText) {
            this.serviceHtml = currencyText + " " + servicefee;
          }
        }
      }
    }

  }

}
