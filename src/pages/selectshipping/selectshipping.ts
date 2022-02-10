import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Constants } from '../../models/constants.models';
import { SelectdatePage } from '../selectdate/selectdate';
import { ShippingMethod } from '../../models/shipping-method.models';

@Component({
  selector: 'page-selectshipping',
  templateUrl: 'selectshipping.html'
})
export class SelectShippingPage {
  private shippingMethods: Array<ShippingMethod>;
  private shippingMethodId = -1;
  private shippingMethod: ShippingMethod;

  constructor(private translate: TranslateService, navParams: NavParams,
    private navCtrl: NavController, private toastCtrl: ToastController) {
    this.shippingMethods = navParams.get('shipping_methods');
  }

  selectShipping(sm: ShippingMethod) {
    this.shippingMethod = sm;
    this.shippingMethodId = sm.id;
    console.log("sms", sm);
  }

  next() {
    if (this.shippingMethods && this.shippingMethods.length && !this.shippingMethod) {
      this.translate.get("shipping_select").subscribe(value => this.showToast(value));
    } else {
      window.localStorage.setItem(Constants.SELECTED_SHIPPING_METHOD, JSON.stringify(this.shippingMethod));
      this.navCtrl.push(SelectdatePage);
    }
  }

  private showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

}
