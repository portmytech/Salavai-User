import { Component, Inject } from '@angular/core';
import { NavController, Events, AlertController, App } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { MyordersPage } from '../myorders/myorders';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { TncPage } from '../tnc/tnc';
import { LoginPage } from '../login/login';
import { TabsPage } from '../tabs/tabs';
import { Contact_usPage } from '../contact_us/contact_us';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';
import { Constants } from "../../models/constants.models";
import { UserResponse } from "../../models/user-response.models";
import { MyaddressPage } from '../myaddress/myaddress';
import { Settings } from '../../models/setting.models';
import { ManagelanguagePage } from '../managelanguage/managelanguage';
import { AppConfig, APP_CONFIG } from '../../app/app.config';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { Global } from '../../providers/global';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage {
  user: UserResponse;
  constructor(@Inject(APP_CONFIG) private config: AppConfig, private navCtrl: NavController, private events: Events, private translate: TranslateService,
    private alertCtrl: AlertController, private app: App, private global: Global, private inAppBrowser: InAppBrowser) {
    this.user = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
    this.setupAvtar();
    this.listenToLoginEvents();
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', (user) => {
      this.user = user;
      this.setupAvtar();
    });
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
  myorders() {
    this.navCtrl.push(MyordersPage);
  }
  myaddress() {
    this.navCtrl.push(MyaddressPage);
  }
  about() {
    this.navCtrl.push(AboutPage);
  }
  chat() {
    this.navCtrl.push(Contact_usPage);
    // let chatConfirmModal = this.modalCtrl.create(Contact_usPage);
    // chatConfirmModal.onDidDismiss(data => {
    //   if (data) this.navCtrl.push(ConversationPage);
    // });
    // chatConfirmModal.present();
  }
  contact() {
    let settings: Settings = JSON.parse(window.localStorage.getItem(Constants.SETTINGS));
    if (settings) {
      this.navCtrl.push(ContactPage, { settings: settings });
    }
  }
  tnc() {
    let settings: Settings = JSON.parse(window.localStorage.getItem(Constants.SETTINGS));
    if (settings) {
      this.navCtrl.push(TncPage, { settings: settings });
    }
  }

  signin() {
    this.navCtrl.push(LoginPage);
  }

  chooseLanguage() {
    this.navCtrl.push(ManagelanguagePage);
  }

  phonenumberPage() {
    this.translate.get(['logout', 'logout_message', 'no', 'yes']).subscribe(text => {
      let alert = this.alertCtrl.create({
        title: text['logout'],
        message: text['logout_message'],
        buttons: [{
          text: text['no'],
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: text['yes'],
          handler: () => {
            this.user = null;
            window.localStorage.removeItem(Constants.USER_KEY);
            window.localStorage.removeItem(Constants.USER_ADMIN_KEY);
            window.localStorage.removeItem(Constants.USER_API_KEY);
            window.localStorage.removeItem(Constants.SELECTED_ADDRESS);
            window.localStorage.removeItem(Constants.TEMP_OPEN_CART);
            this.global.clearCart();
            this.global.clearFavorites();
            this.global.clearSearchHistory();
            this.events.publish("user:login", null);
            this.app.getRootNav().setRoot(TabsPage);
          }
        }]
      });
      alert.present();
    })
  }

  actionNavHeader() {
    if (this.user) {
      this.navCtrl.push(ProfilePage);
    } else {
      this.navCtrl.push(LoginPage);
    }
  }
  developedBy() {
    const options: InAppBrowserOptions = {
      zoom: 'no'
    }
    const browser = this.inAppBrowser.create('https://verbosetechlabs.com/', '_system', options);
  }
}
