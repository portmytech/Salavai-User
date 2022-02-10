import { Component, Inject, ViewChild } from '@angular/core';
import { Platform, Events, ToastController, App, ModalController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '../../node_modules/@ngx-translate/core';
import { WordpressClient } from '../providers/wordpress-client.service';
import { Subscription } from "rxjs/Subscription";
import { AuthResponse } from "../models/auth-response.models";
import { AuthCredential } from "../models/auth-credential.models";
import { Constants } from "../models/constants.models";
import { AppConfig, APP_CONFIG } from './app.config';
import { UserResponse } from "../models/user-response.models";
import { Category } from "../models/category.models";
import { PaymentGateway } from "../models/payment-gateway.models";
import { Currency } from "../models/currency.models";
import { OneSignal } from '@ionic-native/onesignal';
import { ShippingZone } from '../models/shipping-zone.models';
import { ShippingZoneLocation } from '../models/shipping-zone-location.models';
import { TabsPage } from '../pages/tabs/tabs';
import firebase from 'firebase';
import { Vt_popupPage } from '../pages/vt_popup/vt_popup';
import { ManagelanguagePage } from '../pages/managelanguage/managelanguage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  private subscriptions: Array<Subscription> = [];
  private user: UserResponse;
  private userAdmin: UserResponse;
  rtlSide: string = "left";

  constructor(@Inject(APP_CONFIG) private config: AppConfig, private app: App,
    private oneSignal: OneSignal, events: Events, private toastCtrl: ToastController,
    private service: WordpressClient, private platform: Platform, private translate: TranslateService,
    private statusBar: StatusBar, private splashScreen: SplashScreen, private modalCtrl: ModalController) {
    let superAuth = "";
    if (config.apiBase && config.apiBase.startsWith('https') && config.consumerKey && config.consumerKey.length && config.consumerSecret && config.consumerSecret.length) {
      superAuth = ("Basic " + btoa(config.consumerKey + ":" + config.consumerSecret));
      window.localStorage.setItem(Constants.ADMIN_API_KEY, superAuth);
      this.onSuperAuthSetup(superAuth);
    } else if (config.apiBase && config.apiBase.startsWith('http:') && config.adminUsername && config.adminUsername.length && config.adminPassword && config.adminPassword.length) {
      let subscription: Subscription = service.getAuthToken(new AuthCredential(config.adminUsername, config.adminPassword)).subscribe(data => {
        let authResponse: AuthResponse = data;
        superAuth = ("Bearer " + authResponse.token);
        window.localStorage.setItem(Constants.ADMIN_API_KEY, superAuth);
        this.onSuperAuthSetup(superAuth);
      }, err => {
        console.log('auth setup error', err);
      });
      this.subscriptions.push(subscription);
    } else {
      console.log('auth setup error');
    }

    events.subscribe('language:selection', (language) => {
      this.globalize(language);
      if (this.user) this.updateUserLanguage(language);
    });
    events.subscribe('user:login', (user) => {
      this.user = user;
      this.setupAvtar();
      if (this.platform.is("cordova") && this.user) {
        this.updatePlayerId();
        this.updateUserLanguage(window.localStorage.getItem(Constants.KEY_DEFAULT_LANGUAGE));
      }
    });
    this.initializeApp();
    if (this.config.demoMode) {
      setTimeout(() => {
        let modal = modalCtrl.create(Vt_popupPage);
        modal.onDidDismiss((data) => { });
        modal.present();
      }, 15000)
    }
  }

  onSuperAuthSetup(superAuth) {
    console.log('auth setup success: ' + superAuth);
    this.loadParentCategories();
    this.loadPaymentGateways();
    this.loadCurrency();
    this.loadShipping();
  }

  loadShipping() {
    // let selectedShippingMethod: ShippingMethod = JSON.parse(window.localStorage.getItem(Constants.SELECTED_SHIPPING_METHOD));
    // if (selectedShippingMethod) {
    //   console.log('selectedShippingMethod', selectedShippingMethod);
    //   let subscription1: Subscription = this.service.shippingMethod(window.localStorage.getItem(Constants.ADMIN_API_KEY), selectedShippingMethod.method_id).subscribe(data => {
    //     window.localStorage.setItem(Constants.SELECTED_SHIPPING_METHOD, JSON.stringify(data));
    //   }, err => {
    //     console.log('ErrShippingmethod', err);
    //   });
    //   this.subscriptions.push(subscription1);
    // }
    let subscription2: Subscription = this.service.shippingZones(window.localStorage.getItem(Constants.ADMIN_API_KEY)).subscribe(data => {
      let shippingZones: Array<ShippingZone> = data;
      console.log('shippingZones', shippingZones);
      let shippingZoneLocations = new Array<ShippingZoneLocation>();
      let timesReturned = 0;
      for (let sz of shippingZones) {
        let subscription3: Subscription = this.service.shippingZoneLocations(window.localStorage.getItem(Constants.ADMIN_API_KEY), sz.id).subscribe(data => {
          shippingZoneLocations = shippingZoneLocations.concat(data);
          timesReturned = timesReturned + 1;
          if (timesReturned == shippingZones.length) {
            window.localStorage.setItem(Constants.SHIPPING_ZONE_LOCATIONS, JSON.stringify(shippingZoneLocations));
            console.log('shippingZoneLocations', shippingZoneLocations);
            console.log('shippingZoneLocations setup done');
          }
        }, err => {
          timesReturned = timesReturned + 1;
          if (timesReturned == shippingZones.length) {
            console.log('ErrShippingZoneLocation', err);
          }
        });
        this.subscriptions.push(subscription3);
      }
    }, err => {
      console.log('ErrShippingZone', err);
    });
    this.subscriptions.push(subscription2);
  }

  loadCurrency() {
    let subscription: Subscription = this.service.currencies(window.localStorage.getItem(Constants.ADMIN_API_KEY)).subscribe(data => {
      let currency: Currency = data;
      window.localStorage.setItem(Constants.CURRENCY, JSON.stringify(currency));
      console.log('currency setup success');
    }, err => {
      console.log('currency setup error');
    });
    this.subscriptions.push(subscription);
  }

  loadPaymentGateways() {
    let subscription: Subscription = this.service.paymentGateways(window.localStorage.getItem(Constants.ADMIN_API_KEY)).subscribe(data => {
      let paymentGateway: Array<PaymentGateway> = data;
      window.localStorage.setItem(Constants.PAYMENT_GATEWAYS, JSON.stringify(paymentGateway));
      console.log('pgs setup', data);
    }, err => {
      console.log('categories setup error');
    });
    this.subscriptions.push(subscription);
  }

  loadParentCategories() {
    let subscription: Subscription = this.service.categoriesWithParentId(window.localStorage.getItem(Constants.ADMIN_API_KEY), '0', '1').subscribe(data => {
      let categories: Array<Category> = data;
      window.localStorage.setItem(Constants.PRODUCT_CATEGORIES_PARENT, JSON.stringify(categories));
      console.log('categories setup success');
      this.walkThroughOrHome();
    }, err => {
      console.log('categories setup error', err);
      if (window.localStorage.getItem(Constants.PRODUCT_CATEGORIES_PARENT) == null) {
        this.showToast("App setup failed, retry after some time.");
      }
    });
    this.subscriptions.push(subscription);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.show();
      firebase.initializeApp({
        apiKey: this.config.firebaseConfig.apiKey,
        authDomain: this.config.firebaseConfig.authDomain,
        databaseURL: this.config.firebaseConfig.databaseURL,
        projectId: this.config.firebaseConfig.projectId,
        storageBucket: this.config.firebaseConfig.storageBucket,
        messagingSenderId: this.config.firebaseConfig.messagingSenderId
      });
      if (this.platform.is('cordova')) this.initOneSignal();
      this.user = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
      this.setupAvtar();
      setTimeout(() => {
        let categories: Array<Category> = JSON.parse(window.localStorage.getItem(Constants.PRODUCT_CATEGORIES_PARENT));
        if (categories && categories.length) {
          this.walkThroughOrHome();
        }
        if (this.platform.is("cordova") && this.user) {
          this.updatePlayerId();
          this.updateUserLanguage(window.localStorage.getItem(Constants.KEY_DEFAULT_LANGUAGE));
        }
        //after basic init
        const component = this;
        firebase.database().ref(Constants.REF_ADMIN_USER).on("value", function (snap) {
          console.log("REF_ADMIN_USER", snap.val());
          component.userAdmin = snap.val();
          window.localStorage.setItem(Constants.USER_ADMIN_KEY, JSON.stringify(component.userAdmin));
        });
      }, 3000);

      let defaultLang = window.localStorage.getItem(Constants.KEY_DEFAULT_LANGUAGE);
      this.globalize(defaultLang);
    });
  }

  walkThroughOrHome() {
    this.splashScreen.hide();
    if (!this.app.getRootNav().getActive() || !(this.app.getRootNav().getActive().instance instanceof TabsPage))
      this.app.getRootNav().setRoot(this.config.demoMode ? ManagelanguagePage : TabsPage);
  }

  setupAvtar() {
    if (this.user && this.user.avatar_url && (this.user.avatar_url.includes("gravatar.com") || this.user.avatar_url.includes("avatar"))) this.user.avatar_url = null;
    if (this.user && this.user.meta_data) {
      for (let meta of this.user.meta_data) {
        if (meta.key == "avatar_url" && meta.value && meta.value.length) {
          this.user.avatar_url = meta.value;
          break;
        }
      }
    }
  }

  updatePlayerId() {
    this.oneSignal.getIds().then((id) => {
      if (id && id.userId) {
        firebase.database().ref(Constants.REF_USERS_FCM_IDS).child((this.user.id + "customer")).set(id.userId);
        this.subscriptions.push(this.service.registerForPushNotification(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(this.user.id), id.userId).subscribe(data => console.log(data), err => console.log(err)));
      }
    });
  }

  updateUserLanguage(language) {
    let langToUpdate = language && language.length ? language : this.config.availableLanguages[0].code;
    this.service.updateUser(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(this.user.id), { meta_data: [{ key: "language", value: langToUpdate }] }).subscribe(data => {
      console.log("updateUser", data);
    }, err => {
      console.log("updateUser", err);
    });
  }

  globalize(languagePriority) {
    this.translate.setDefaultLang("en");
    let defaultLangCode = this.config.availableLanguages[0].code;
    this.translate.use(languagePriority && languagePriority.length ? languagePriority : defaultLangCode);
    this.setDirectionAccordingly(languagePriority && languagePriority.length ? languagePriority : defaultLangCode);
    window.localStorage.setItem(Constants.KEY_LOCALE, languagePriority && languagePriority.length ? languagePriority : defaultLangCode);
  }

  setDirectionAccordingly(lang: string) {
    switch (lang) {
      case 'ar': {
        this.platform.setDir('ltr', false);
        this.platform.setDir('rtl', true);
        this.rtlSide = "right";
        break;
      }
      default: {
        this.platform.setDir('rtl', false);
        this.platform.setDir('ltr', true);
        this.rtlSide = "left";
        break;
      }
    }
  }

  getSideOfCurLang() {
    this.rtlSide = this.platform.dir() === 'rtl' ? "right" : "left";
    return this.rtlSide;
  }

  getSuitableLanguage(language) {
    window.localStorage.setItem("locale", language);
    language = language.substring(0, 2).toLowerCase();
    console.log('check for: ' + language);
    return this.config.availableLanguages.some(x => x.code == language) ? language : 'en';
  }

  initOneSignal() {
    this.oneSignal.startInit(this.config.oneSignalAppId, this.config.oneSignalGPSenderId);
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
    this.oneSignal.handleNotificationReceived().subscribe((data) => {
      // do something when notification is received
      console.log(data);
    });
    this.oneSignal.handleNotificationOpened().subscribe((data) => {
      // do something when a notification is opened
    });
    this.oneSignal.endInit();
  }

  showToast(message: string) {
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
