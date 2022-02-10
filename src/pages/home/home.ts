import { Component, Inject } from '@angular/core';
import { NavController, AlertController, Loading, LoadingController, ToastController, MenuController, ModalController, Events, Platform } from 'ionic-angular';
import { SelectclothesPage } from '../selectclothes/selectclothes';
import { MyordersPage } from '../myorders/myorders';
import { Category } from "../../models/category.models";
import { OrderslipPage } from '../orderslip/orderslip';
import { LoginPage } from '../login/login';
import { Currency } from "../../models/currency.models";
import { Order } from "../../models/order.models";
import { Constants } from "../../models/constants.models";
import { UserResponse } from "../../models/user-response.models";
import { Banner } from '../../models/banner.models';
import { AppConfig, APP_CONFIG } from '../../app/app.config';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';
import { WordpressClient } from '../../providers/wordpress-client.service';
import { Subscription } from "rxjs/Subscription";
import { OrderconfirmedPage } from '../orderconfirmed/orderconfirmed';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private loading: Loading;
  private loadingShown: Boolean = false;
  private subscriptions: Array<Subscription> = [];
  private orders = new Array<Order>();
  private ordersLoading: boolean;
  private user: UserResponse;
  private pageNo: number = 1;
  private currencyIcon: string = '';
  private currencyText: string = '';
  private banners = new Array<Banner>();
  private categoriesAll = new Array<Category>();
  private appTitle;

  constructor(@Inject(APP_CONFIG) private config: AppConfig, private toastCtrl: ToastController, private alertCtrl: AlertController, 
  private loadingCtrl: LoadingController, public translate: TranslateService, 
  private events: Events, private service: WordpressClient, public modalCtrl: ModalController, 
  public navCtrl: NavController, public menu: MenuController,public inAppBrowser: InAppBrowser) {
    this.appTitle = config.appName;
    events.subscribe('category:setup', () => {
      this.setupCategories();
    });
    let currency: Currency = JSON.parse(window.localStorage.getItem(Constants.CURRENCY));
    if (currency) {
      this.currencyText = currency.value;
      let iconText = currency.options[currency.value];
      this.currencyIcon = iconText.substring(iconText.lastIndexOf('(') + 1, iconText.length - 1);
    }
    this.setupCategories();
    this.loadBanners();

    let toOpen: string = window.localStorage.getItem(Constants.TEMP_OPEN);
    let user = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
    if (user && toOpen && toOpen.length) {
      if (toOpen == Constants.TEMP_OPEN_CART) {
        this.navCtrl.push(OrderconfirmedPage);
      }
      window.localStorage.removeItem(Constants.TEMP_OPEN);
      window.localStorage.removeItem(Constants.TEMP_OPEN_CART);
    }
  }

  ionViewWillLeave() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.dismissLoading();
  }

  ionViewDidLoad() {
    this.user = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
    if (this.user) {
      this.loadMyOrders();
    }
  }

  loadBanners() {
    let savedBanners: Array<Banner> = JSON.parse(window.localStorage.getItem('banners'));
    if (savedBanners && savedBanners.length) {
      this.banners = savedBanners;
    }
    this.subscriptions.push(this.service.banners(window.localStorage.getItem(Constants.ADMIN_API_KEY)).subscribe(data => {
      this.banners = data;
      window.localStorage.setItem('banners', JSON.stringify(this.banners));
    }, err => {
      console.log(err);
    }));
  }

  setupCategories() {
    let categories: Array<Category> = JSON.parse(window.localStorage.getItem(Constants.PRODUCT_CATEGORIES_PARENT));
    this.categoriesAll = categories;
  }

  loadMyOrders() {
    this.ordersLoading = true;
    let subscription: Subscription = this.service.myOrders(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(this.user.id), String(this.pageNo)).subscribe(data => {
      this.ordersLoading = false;
      let newOrder = new Array<Order>();
      for (let order of data) {
        if (order.status == 'completed' || order.status == 'refunded' || order.status == 'failed' || order.status == 'cancelled') {
          continue;
        }
        order.status_trans = this.translate.instant(order.status);
        newOrder.push(order);
      }
      this.dismissLoading();
      this.orders = newOrder;
    }, err => {
      this.ordersLoading = false;
      this.dismissLoading();
    });
    this.subscriptions.push(subscription);
  }

  selectclothes(value) {
    this.navCtrl.push(SelectclothesPage, { cat: value });
  }

  orderDetail(value) {
    this.navCtrl.push(OrderslipPage, { data: value });
  }

  myOrders() {
    this.navCtrl.push(MyordersPage);
  }

  login() {
    this.navCtrl.push(LoginPage);
  }

  order() {
    this.translate.get('select_service').subscribe(value => this.showToast(value));
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
    this.translate.get(['error', 'dismiss'])
      .subscribe(text => {
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

  offers() {
    this.events.publish('tab:to', 2);
  }
  buyThisApp(){
    this.translate.get('opening_WhatsApp').subscribe(text => {
      this.presentLoading(text);
      this.service.getWhatsappDetails().subscribe((res) => {
        this.dismissLoading();
        return this.inAppBrowser.create(res['link'], '_system');
      }, (err) => {
        console.log("Error rating:", JSON.stringify(err));
        this.dismissLoading();
      });
    });
  }
}
