import { Component } from '@angular/core';
import { NavController, AlertController, Loading, LoadingController, ToastController } from 'ionic-angular';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';
import { WordpressClient } from '../../providers/wordpress-client.service';
import { Global } from '../../providers/global';
import { Subscription } from "rxjs/Subscription";
import { UserResponse } from "../../models/user-response.models";
import { OrderslipPage } from '../orderslip/orderslip';
import { Constants } from "../../models/constants.models";
import { Currency } from "../../models/currency.models";
import { Order } from "../../models/order.models";
import { OrderUpdateRequest } from "../../models/order-update-request.models";
import { Settings } from '../../models/setting.models';
import { Helper } from '../../models/helper.models';

@Component({
  selector: 'page-myorders',
  templateUrl: 'myorders.html'
})
export class MyordersPage {
  private loading: Loading;
  private loadingShown: Boolean = false;
  private subscriptions: Array<Subscription> = [];
  private orders = new Array<Order>();
  private user: UserResponse;
  private pageNo: number = 1;
  private currencyIcon: string = '';
  private currencyText: string = '';
  private isLoading = true;

  constructor(public navCtrl: NavController, private toastCtrl: ToastController,
    private alertCtrl: AlertController, private loadingCtrl: LoadingController,
    public translate: TranslateService, private service: WordpressClient) {
    this.user = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
    let currency: Currency = JSON.parse(window.localStorage.getItem(Constants.CURRENCY));
    if (currency) {
      this.currencyText = currency.value;
      let iconText = currency.options[currency.value];
      this.currencyIcon = iconText.substring(iconText.lastIndexOf('(') + 1, iconText.length - 1);
    }
    this.translate.get('loading_orders').subscribe(value => {
      this.presentLoading(value);
      this.loadMyOrders();
    });
  }

  ionViewWillLeave() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.dismissLoading();
  }

  loadMyOrders() {
    let subscription: Subscription = this.service.myOrders(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(this.user.id), String(this.pageNo)).subscribe(data => {
      for (let order of data) {
        order.status_trans = this.translate.instant(order.status);
      }
      this.dismissLoading();
      this.orders = data;
      this.isLoading = false;
    }, err => {
      this.isLoading = false;
      this.dismissLoading();
    });
    this.subscriptions.push(subscription);
  }

  cancelOrder(order) {
    this.translate.get('cancelling_orders').subscribe(value => {
      this.presentLoading(value);
      this.subscriptions.push(this.service.updateOrder(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(order.id), new OrderUpdateRequest('cancelled')).subscribe(data => {
        let orderRes: Order = data;
        order.status = 'cancelled';
        /* for(let o of this.orders) {
          console.log(String(o.id) == String(orderRes.id));
          if(o.id == orderRes.id) {
            o = orderRes;
            console.log('here');
            this.orders = this.orders;
            break;
          }
        } */
        this.dismissLoading();
        // this.showToast('Order cancelled');
        this.translate.get('order_cancelled').subscribe(value => {
          this.showToast(value);
        });
      }, err => {
        console.log(err);
      }));
    });
  }

  doInfinite(infiniteScroll: any) {
    this.pageNo++;
    let subscription: Subscription = this.service.myOrders(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(this.user.id), String(this.pageNo)).subscribe(data => {
      let orders: Array<Order> = data;
      for (let order of data) {
        order.status_trans = this.translate.instant(order.status);
      }
      infiniteScroll.complete();
      this.isLoading = false;
    }, err => {
      infiniteScroll.complete();
      this.isLoading = false;
      console.log(err);
    });
    this.subscriptions.push(subscription);
  }

  orderDetail(value) {
    this.navCtrl.push(OrderslipPage, { data: value });
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
    this.translate.get(['error', 'dismiss']).subscribe(text => {
      let alert = this.alertCtrl.create({
        title: text['error'],
        subTitle: msg,
        buttons: [text['dismiss']]
      });
      alert.present();
    })
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
