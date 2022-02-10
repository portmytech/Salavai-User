import { Component } from '@angular/core';
import { NavController, ModalController, ToastController, NavParams } from 'ionic-angular';
import { CartItem } from '../../models/cart-item.models';
import { Currency } from '../../models/currency.models';
import { Constants } from '../../models/constants.models';
import { Global } from '../../providers/global';
import { Coupon } from '../../models/coupon.models';
import { CodePage } from '../code/code';
import { UserResponse } from '../../models/user-response.models';
import { TranslateService } from '@ngx-translate/core';
import { LoginPage } from '../login/login';
import { MyaddressPage } from '../myaddress/myaddress';
import { Settings } from '../../models/setting.models';
import { Helper } from '../../models/helper.models';

@Component({
  selector: 'page-orderconfirmed',
  templateUrl: 'orderconfirmed.html'
})
export class OrderconfirmedPage {
  private currencyIcon: string;
  private currencyText: string;
  private cartItems: Array<CartItem>;
  private total_html: string;
  private coupon_amount_html: string;
  private coupon: Coupon;
  private title: string;
  private sum: number;
  private servicefee: number = 0;
  private cartTotal: number = 0;
  private serviceHtml: string;

  constructor(navParam: NavParams, private navCtrl: NavController, private global: Global,
    private modalCtrl: ModalController, private translate: TranslateService, private toastCtrl: ToastController) {
    let currency: Currency = JSON.parse(window.localStorage.getItem(Constants.CURRENCY));
    if (currency) {
      this.currencyText = currency.value;
      let iconText = currency.options[currency.value];
      this.currencyIcon = iconText.substring(iconText.lastIndexOf('(') + 1, iconText.length - 1);
    }
    window.localStorage.removeItem(Constants.SELECTED_COUPON);
    let settings = Helper.getSetting("laundry_appconfig_servicefee");
    if (settings && settings.length) {
      this.servicefee = Number(Number(settings).toFixed(2));
      if (this.currencyIcon) {
        this.serviceHtml = this.currencyIcon + " " + this.servicefee;
      } else if (this.currencyText) {
        this.serviceHtml = this.currencyText + " " + this.servicefee;
      }
    }
  }

  ionViewDidEnter() {
    this.cartItems = this.global.getCartItems();
    this.calculateTotal();
  }

  calculateTotal() {
    this.sum = 0;
    this.cartTotal = 0;
    for (let item of this.cartItems) {
      item.vari.total_price = Number(item.vari.sale_price) * item.quantity;
      if (this.currencyIcon) {
        item.vari.total_price_html = this.currencyIcon + " " + item.vari.total_price.toFixed(2);
      } else if (this.currencyText) {
        item.vari.total_price_html = this.currencyText + " " + item.vari.total_price.toFixed(2);
      }
      this.sum = this.sum + item.vari.total_price;
    }
    this.cartTotal = this.cartTotal + this.sum;
    this.sum = this.sum - (this.coupon ? this.coupon.discount_type == 'percent' ? (this.sum * Number(this.coupon.amount) / 100) : Number(this.coupon.amount) : 0);
    this.sum = Number(Number(this.sum + this.servicefee).toFixed(2));
    if (this.currencyIcon) {
      this.total_html = this.currencyIcon + " " + this.sum.toFixed(2);
    } else if (this.currencyText) {
      this.total_html = this.currencyText + " " + this.sum.toFixed(2);
    }
  }

  decrementProduct(ci: CartItem) {
    this.global.decrementCartItem(ci);
    this.cartItems = this.global.getCartItems();
    this.calculateTotal();
  }

  incrementProduct(ci: CartItem) {
    this.global.incrementCartItem(ci);
    this.cartItems = this.global.getCartItems();
    this.calculateTotal();
  }

  setCartItem(ci: CartItem) {
    if (!ci.quantity || String(ci.quantity) == "") return;
    this.global.setCartItem(ci);
    this.cartItems = this.global.getCartItems();
    this.calculateTotal();
  }

  codePage() {
    let modal = this.modalCtrl.create(CodePage);
    modal.onDidDismiss(() => {
      let coupon: Coupon = JSON.parse(window.localStorage.getItem(Constants.SELECTED_COUPON));
      if (coupon) {
        let allowed = true;
        if (coupon.discount_type == 'fixed_product') {
          allowed = false;
          for (let itemCA of coupon.product_ids) {
            for (let item of this.cartItems) {
              if (itemCA == item.pro.id) {
                allowed = true;
                break;
              }
            }
            if (allowed) { break; }
          }
        }
        if (!allowed) {
          this.translate.get('field_error_invalid_couponcodecart').subscribe(value => this.showToast(value));
        } else {
          if (this.cartTotal < Number(coupon.minimum_amount)) {
            this.translate.get('field_error_minimum_amount_coupon').subscribe(value => this.showToast(value + " " + coupon.minimum_amount));
            return;
          }
          if (Number(coupon.maximum_amount) > Number(coupon.minimum_amount) && this.cartTotal > Number(coupon.maximum_amount)) {
            this.translate.get('field_error_maximum_amount_coupon').subscribe(value => this.showToast(value + " " + coupon.maximum_amount));
            return;
          }
          this.coupon = coupon;
          this.coupon_amount_html = this.coupon.amount;
          if (this.coupon.discount_type == 'percent') {
            this.coupon_amount_html = this.coupon_amount_html + "%";
          } else {
            this.coupon_amount_html = this.currencyIcon + " " + this.coupon_amount_html;
          }
          this.calculateTotal();
        }
      }
    });
    modal.present();
  }

  removeCoupon() {
    this.coupon = null;
    this.calculateTotal();
    window.localStorage.removeItem(Constants.SELECTED_COUPON);
  }

  selectaddress() {
    let settings: Settings = JSON.parse(window.localStorage.getItem(Constants.SETTINGS));
    if (settings && settings.laundry_appconfig_minimumorder) {
      let minOrder = Number(settings.laundry_appconfig_minimumorder);
      if (this.sum < minOrder) {
        this.translate.get("min_order_value").subscribe(value => this.showToast(value + " " + minOrder));
        return;
      }
    }
    let user: UserResponse = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
    if (user != null) {
      this.navCtrl.push(MyaddressPage, { action: 'select' });
    } else {
      window.localStorage.setItem(Constants.TEMP_OPEN, Constants.TEMP_OPEN_CART);
      this.translate.get('auth_required').subscribe(value => this.showToast(value));
      this.navCtrl.push(LoginPage);
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
