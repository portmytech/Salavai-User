import { Component, Inject } from '@angular/core';
import { NavController, Loading, App, ToastController, LoadingController, AlertController, NavParams } from 'ionic-angular';
import { WordpressClient } from '../../providers/wordpress-client.service';
import { TabsPage } from '../tabs/tabs';
import { Subscription } from 'rxjs/Subscription';
import { PaymentGateway } from '../../models/payment-gateway.models';
import { CartItem } from '../../models/cart-item.models';
import { Address } from '../../models/address.models';
import { OrderRequest } from '../../models/order-request.models';
import { UserResponse } from '../../models/user-response.models';
import { Coupon } from '../../models/coupon.models';
import { Constants } from '../../models/constants.models';
import { Currency } from '../../models/currency.models';
import { Global } from '../../providers/global';
import { TranslateService } from '@ngx-translate/core';
import { OrderUpdateRequest } from '../../models/order-update-request.models';
import { KeyValue } from '../../models/key-value.models';
import { CardInfo } from '../../models/card-info.models';
import { StripeRequest } from '../../models/stripe-request.models';
import { ShippingMethod } from '../../models/shipping-method.models';
import { ShippingLine } from '../../models/shipping-line.models';
import { APP_CONFIG, AppConfig } from '../../app/app.config';
import { LineItem } from '../../models/line-item.models';
import { sha512 } from 'js-sha512';
import { InAppBrowserOptions, InAppBrowser } from '@ionic-native/in-app-browser';
import { Helper } from '../../models/helper.models';
import { Order } from '../../models/order.models';

@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html'
})
export class PaymentPage {
  private loading: Loading;
  private loadingShown: Boolean = false;
  private placedPagePushed: Boolean = false;
  private paymentDone: Boolean = false;
  private paymentFailAlerted: Boolean = false;
  private subscriptions: Array<Subscription> = [];
  private paymentGateways = new Array<PaymentGateway>();
  private cartItems: Array<CartItem>;
  private selectedPaymentGateway;
  private selectedPaymentGatewayId;
  private selectedAddress: Address;
  private orderRequest: OrderRequest;
  private orderResponse: Order;
  private user: UserResponse;
  private total = 0;
  private couponApplied = false;
  //private totalItems = 0;
  private shippingChargeGlobal: number;
  private deliveryPayble: string = '0';
  private currencyIcon: string = '';
  private currencyText: string = '';
  private totalToShow: string = '';
  private coupon: Coupon;
  private pickupTime: number;
  private deliveryTime: number;
  private cardInfo = new CardInfo();
  private stripeCardIdToken: any;
  private servicefee: number = 0;
  private serviceHtml: string;
  private deliverySlot: string;
  private pickupSlot: string;
  private shippingMethod: ShippingMethod;

  constructor(@Inject(APP_CONFIG) private config: AppConfig, navParam: NavParams,
    public navCtrl: NavController, private app: App, private global: Global,
    private iab: InAppBrowser,
    public translate: TranslateService, private toastCtrl: ToastController, private service: WordpressClient,
    private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
    this.pickupTime = navParam.get("pickupTime");
    this.deliveryTime = navParam.get("deliveryTime");
    this.pickupSlot = navParam.get("pickupSlot");
    this.deliverySlot = navParam.get("deliverySlot");
    let currency: Currency = JSON.parse(window.localStorage.getItem(Constants.CURRENCY));
    if (currency) {
      this.currencyText = currency.value;
      let iconText = currency.options[currency.value];
      this.currencyIcon = iconText.substring(iconText.lastIndexOf('(') + 1, iconText.length - 1);
    }

    let paymentGateways = JSON.parse(window.localStorage.getItem(Constants.PAYMENT_GATEWAYS));
    this.selectedAddress = JSON.parse(window.localStorage.getItem(Constants.SELECTED_ADDRESS));
    this.shippingMethod = JSON.parse(window.localStorage.getItem(Constants.SELECTED_SHIPPING_METHOD));
    let savedCardInfo: CardInfo = JSON.parse(window.localStorage.getItem(Constants.CARD_INFO));
    if (savedCardInfo) {
      this.cardInfo.name = savedCardInfo.name;
      this.cardInfo.number = savedCardInfo.number;
      this.cardInfo.expMonth = savedCardInfo.expMonth;
      this.cardInfo.expYear = savedCardInfo.expYear;
    }
    if (paymentGateways != null) {
      for (let pg of paymentGateways) {
        if (pg.enabled && this.paymentImplemented(pg.id)) {
          this.paymentGateways.push(pg);
        }
      }
    }

    let settings = Helper.getSetting("laundry_appconfig_servicefee");
    if (settings && settings.length) {
      this.servicefee = Number(Number(settings).toFixed(2));
      if (this.currencyIcon) {
        this.serviceHtml = this.currencyIcon + " " + this.servicefee;
      } else if (this.currencyText) {
        this.serviceHtml = this.currencyText + " " + this.servicefee;
      }
    }

    this.cartItems = this.global.getCartItems();
    this.coupon = JSON.parse(window.localStorage.getItem(Constants.SELECTED_COUPON));
    this.calculateTotal();
  }

  calculateTotal() {
    let sum: number = 0;
    for (let item of this.cartItems) {
      item.vari.total_price = Number(item.vari.sale_price) * item.quantity;
      if (this.currencyIcon) {
        item.vari.total_price_html = this.currencyIcon + " " + item.vari.total_price.toFixed(2);
      } else if (this.currencyText) {
        item.vari.total_price_html = this.currencyText + " " + item.vari.total_price.toFixed(2);
      }
      sum = sum + item.vari.total_price;
    }
    //this.totalItems = sum; 
    this.total = sum - (this.coupon ? this.coupon.discount_type == 'percent' ? (sum * Number(this.coupon.amount) / 100) : Number(this.coupon.amount) : 0);
    this.total = Number(this.total + this.servicefee + Number(this.shippingMethod ? this.shippingMethod.cost : 0));
    this.totalToShow = this.currencyIcon + " " + this.total.toFixed(2);
  }

  paymentImplemented(id: string) {
    return id === "cod";
  }

  paymentMethod(paymentGateway) {
    this.selectedPaymentGatewayId = paymentGateway.id;
    this.selectedPaymentGateway = paymentGateway;
  }

  placeOrder() {
    if (this.selectedPaymentGateway == null) {
      this.translate.get('field_error_payment_method').subscribe(value => {
        this.showToast(value);
      });
    } else if (this.selectedPaymentGateway.id.includes('stripe') && !this.cardInfo.areFieldsFilled()) {
      this.showToast('Fill valid card details');
    } else {
      if (this.selectedPaymentGateway.id.includes('stripe') && this.stripeCardIdToken == null) {
        this.generateStripeCardIdToken();
        return;
      }
      this.orderRequest = new OrderRequest();
      this.orderRequest.payment_method = this.selectedPaymentGateway.id;
      this.orderRequest.payment_method_title = this.selectedPaymentGateway.title;
      this.orderRequest.set_paid = false;
      this.orderRequest.billing = this.selectedAddress;
      let shippingAddress: Address = JSON.parse(window.localStorage.getItem(Constants.SELECTED_ADDRESS_SHIPPING));
      this.orderRequest.shipping = shippingAddress ? shippingAddress : this.selectedAddress;
      this.user = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
      this.orderRequest.customer_id = String(this.user.id);

      this.orderRequest.meta_data = new Array<KeyValue>();
      this.orderRequest.meta_data.push(new KeyValue("time_pickup", String(this.pickupTime)));
      this.orderRequest.meta_data.push(new KeyValue("time_delivery", String(this.deliveryTime)));
      this.orderRequest.meta_data.push(new KeyValue("time_pickup_slot", String(this.pickupSlot)));
      this.orderRequest.meta_data.push(new KeyValue("time_delivery_slot", String(this.deliverySlot)));
      if (this.servicefee && this.servicefee > 0) {
        this.orderRequest.meta_data.push(new KeyValue("service_fee", String(this.servicefee)));
        this.orderRequest.fee_lines = new Array();
        this.orderRequest.fee_lines.push({ name: "Service Fee", total: String(this.servicefee), tax_status: "none" });
      }

      if (this.shippingMethod) {
        this.orderRequest.shipping_lines = new Array<ShippingLine>();
        this.orderRequest.shipping_lines.push(new ShippingLine(this.shippingMethod.method_id, this.shippingMethod.method_title, String(this.shippingMethod.cost)));
      }


      this.orderRequest.line_items = new Array<LineItem>();
      for (let ci of this.cartItems) {
        let li = new LineItem();
        li.product_id = ci.pro.id;
        li.variation_id = ci.vari.id;
        li.quantity = ci.quantity;
        this.orderRequest.line_items.push(li);
      }

      this.translate.get('order_creating').subscribe(value => {
        this.presentLoading(value);
        console.log('order_request', this.orderRequest);
        let subscription: Subscription = this.service.createOrder(window.localStorage.getItem(Constants.ADMIN_API_KEY), this.orderRequest).subscribe(data => {
          this.orderResponse = data;
          let coupon: Coupon = JSON.parse(window.localStorage.getItem(Constants.SELECTED_COUPON));
          if (coupon) {
            let couponSubs: Subscription = this.service.applyCouponCode(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(this.orderResponse.id), coupon.code).subscribe(data => {
              this.orderResponse = data;
              this.couponApplied = true;
              window.localStorage.removeItem(Constants.SELECTED_COUPON);
              this.translate.get('confirm_order_coupon_applied').subscribe(value => {
                this.showToast(value);
              });
              this.orderPlaced();
            }, err => {
              console.log(err);
              this.dismissLoading();
            });
            this.subscriptions.push(couponSubs);
          } else {
            this.orderPlaced();
          }
        }, err => {
          this.dismissLoading();
          this.translate.get('order_failed').subscribe(value => {
            this.showToast(value);
          });
          this.app.getRootNav().setRoot(TabsPage);
        });
        this.subscriptions.push(subscription);
      });
    }
  }

  generateStripeCardIdToken() {
    // this.presentLoading('Verifying card details');
    // this.stripe.setPublishableKey(this.config.stripeKey);
    // this.stripe.createCardToken(this.cardInfo as StripeCardTokenParams).then(token => {
    //   this.stripeCardIdToken = token;
    //   this.dismissLoading();
    //   window.localStorage.setItem(Constants.CARD_INFO, JSON.stringify(this.cardInfo));
    //   this.placeOrder();
    // }).catch(error => {
    //   this.dismissLoading();
    //   this.presentErrorAlert(error);
    //   this.showToast('Invalid card details');
    //   console.error(error);
    // });
  }

  initStripe() {
    this.presentLoading('Making payment');
    let subscription: Subscription = this.service.stripePayment(new StripeRequest("stripe", String(this.orderResponse.id), this.stripeCardIdToken.id)).subscribe(data => {
      this.dismissLoading();
      console.log(data);
      this.paymentSuccess();
    }, err => {
      this.dismissLoading();
      console.log(err);
      this.paymentFailure();
    });
    this.subscriptions.push(subscription);
  }

  orderPlaced() {
    this.dismissLoading();
    this.translate.get('order_placed').subscribe(value => {
      this.showToast(value);
    });
    if (this.selectedPaymentGateway.id === "cod") {
      this.clearCart();
      this.app.getRootNav().setRoot(TabsPage);
    } else if (this.selectedPaymentGateway.id === "pumcp" || this.selectedPaymentGateway.id.includes("payu")) {
      this.initPayUMoney();
    }
    // else if (this.selectedPaymentGateway.id.includes("pal")) {
    //   this.initPayPal();
    // }
    else if (this.selectedPaymentGateway.id.includes("stripe")) {
      this.initStripe();
    } else {
      this.translate.get('order_placed_cod').subscribe(value => {
        this.showToast(value);
      });
      this.clearCart();
      this.app.getRootNav().setRoot(TabsPage);
    }
  }

  // initPayPal() {
  //   this.payPal.init({ PayPalEnvironmentProduction: this.config.paypalProduction, PayPalEnvironmentSandbox: this.config.paypalSandbox }).then(() => {
  //     // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
  //     this.payPal.prepareToRender(this.config.paypalProduction ? 'PayPalEnvironmentProduction' : 'PayPalEnvironmentSandbox', new PayPalConfiguration({
  //       // Only needed if you get an "Internal Service Error" after PayPal login!
  //       //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
  //     })).then(() => {
  //       let currency: Currency = JSON.parse(window.localStorage.getItem(Constants.CURRENCY));
  //       let payment = new PayPalPayment(String(this.total), currency.value, 'Description', 'sale');
  //       this.payPal.renderSinglePaymentUI(payment).then(() => {
  //         this.paymentSuccess();
  //         // Successfully paid
  //       }, () => {
  //         this.paymentFailure();
  //         // Error or render dialog closed without being successful
  //       });
  //     }, () => {
  //       // Error in configuration
  //     });
  //   }, () => {
  //     // Error in initialization, maybe PayPal isn't supported or something else
  //   });
  // }

  initPayUMoney() {
    let name = this.user.first_name && this.user.first_name.length ? this.user.first_name : this.user.username;
    let mobile = this.user.username;
    let email = this.user.email;
    let bookingId = String(Math.floor(Math.random() * (99 - 10 + 1) + 10)) + String(this.orderResponse.id);
    let productinfo = this.orderResponse.order_key;
    let salt = this.config.payuSalt;
    let key = this.config.payuKey;
    let amt = this.total;
    let string = key + '|' + bookingId + '|' + amt + '|' + productinfo + '|' + name + '|' + email + '|||||||||||' + salt;
    let encrypttext = sha512(string);

    //let url = "payumoney/payuBiz.html?amt=" + amt + "&name=" + name + "&mobileNo=" + mobile + "&email=" + email + "&bookingId=" + bookingId + "&productinfo=" + productinfo + "&salt=" + salt + "&key=" + key;
    let url = "payumoney/payuBiz.html?amt=" + amt + "&name=" + name + "&mobileNo=" + mobile + "&email=" + email + "&bookingId=" + bookingId + "&productinfo=" + productinfo + "&hash=" + encrypttext + "&salt=" + salt + "&key=" + key;

    console.log("payuurl", url);
    let options: InAppBrowserOptions = {
      location: 'yes',
      clearcache: 'yes',
      zoom: 'yes',
      toolbar: 'no',
      closebuttoncaption: 'back'
    };
    const browser: any = this.iab.create(url, '_blank', options);
    browser.on('loadstop').subscribe(event => {
      browser.executeScript({
        file: "payumoney/payumoneyPaymentGateway.js"
      });

      if (event.url == "http://localhost/success.php") {
        this.paymentSuccess();
        browser.close();
      }
      if (event.url == "http://localhost/failure.php") {
        this.paymentFailure();
        browser.close();
      }
    });
    browser.on('exit').subscribe(event => {
      if (!this.paymentDone && !this.paymentFailAlerted) {
        this.paymentFailure();
      }
    });
    browser.on('loaderror').subscribe(event => {
      this.showToast('something_went_wrong');
      this.paymentFailure();
    });
  }

  paymentFailure() {
    this.paymentFailAlerted = true;
    this.subscriptions.push(this.service.updateOrder(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(this.orderResponse.id), new OrderUpdateRequest('cancelled')).subscribe(data => {
    }, err => {
      console.log(err);
    }));


    this.translate.get(['payment_fail_title', 'payment_fail_message', 'ok']).subscribe(res => {
      let alert = this.alertCtrl.create({
        title: res.payment_fail_title,
        message: res.payment_fail_message,
        buttons: [{
          text: res.ok,
          role: 'cancel',
          handler: () => {
            this.done();
            console.log('Okay clicked');
          }
        }]
      });
      alert.present();
    });
  }

  paymentSuccess() {
    this.paymentDone = true;
    this.clearCart();
    this.translate.get('just_a_moment').subscribe(value => {
      this.presentLoading(value);
      this.subscriptions.push(this.service.updateOrder(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(this.orderResponse.id), { set_paid: true }).subscribe(data => {
        this.done();
      }, err => {
        this.done();
        this.paymentSuccess();
        console.log(err);
      }));
    });
  }

  done() {
    if (!this.placedPagePushed) {
      this.placedPagePushed = true;
      this.dismissLoading();
      this.app.getRootNav().setRoot(this.paymentFailAlerted ? TabsPage : TabsPage);
    }
  }

  private presentLoading(message: string) {
    this.loading = this.loadingCtrl.create({
      content: message
    });

    this.loading.onDidDismiss(() => { });

    this.loading.present();
    this.loadingShown = true;
  }

  private dismissLoading() {
    if (this.loadingShown) {
      this.loadingShown = false;
      this.loading.dismiss();
    }
  }

  private presentErrorAlert(msg: string) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

  clearCart() {
    this.global.clearCart();
  }

}
