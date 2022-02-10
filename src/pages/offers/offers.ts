import { Component } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';
import { WordpressClient } from '../../providers/wordpress-client.service';
import { Coupon } from '../../models/coupon.models';
import { Subscription } from 'rxjs/Subscription';
import { Constants } from '../../models/constants.models';
import moment from 'moment';

@Component({
  selector: 'page-offers',
  templateUrl: 'offers.html'
})
export class OffersPage {
  private subscriptions: Array<Subscription> = [];
  private coupons = new Array<Coupon>();
  private loading = false;

  constructor(private toastCtrl: ToastController, private clipboard: Clipboard, public translate: TranslateService, private service: WordpressClient) {
    this.loadCoupons();
  }

  loadCoupons() {
    this.loading = true;
    let subscription: Subscription = this.service.coupons(window.localStorage.getItem(Constants.ADMIN_API_KEY)).subscribe(data => {
      let now = new Date();
      let newCoupons = new Array<Coupon>();
      for (let coupon of data) {
        if (coupon.date_expires && coupon.date_expires.length && now > moment(coupon.date_expires).toDate()) {
          continue;
        }
        if (coupon.usage_count && coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
          continue;
        }
        if (!coupon.description || !coupon.description.length) {
          coupon.description = 'Discount of ' + coupon.amount;
        }
        newCoupons.push(coupon);
      }
      this.loading = false;
      this.coupons = newCoupons;
    }, err => {
      this.loading = false;
    });
    this.subscriptions.push(subscription);
  }

  copyCode(code) {
    if (code) {
      this.clipboard.copy(code);
      this.translate.get('copied_code').subscribe(value => {
        this.showToast(value);
      });
    }
  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'top'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }
}
