import { Component, Inject } from '@angular/core';
import { Events, App, Platform, NavController, NavParams, AlertController, LoadingController, ToastController, ViewController } from 'ionic-angular';
import firebase from 'firebase';
import { Constants } from "../../models/constants.models";
import { OtpPage } from '../../pages/otp/otp';
import { RegisterRequest } from "../../models/register-request.models";
import { RegisterResponse } from "../../models/register-response.models";
import { WordpressClient } from '../../providers/wordpress-client.service';
import { Subscription } from "rxjs/Subscription";
import { APP_CONFIG, AppConfig } from "../../app/app.config";
import { TranslateService } from '../../../node_modules/@ngx-translate/core';

@Component({
  selector: 'page-phone',
  templateUrl: 'phone.html'
})
export class PhonePage {
  public recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  phoneNumber: any;
  loading: any;
  loadingShown: boolean = false;
  captchanotvarified: boolean = true;
  result: any;
  verfificationId: any;
  otpNotsent: boolean = false;
  private countries: any;
  private countryCode: string;
  private registerRequest: RegisterRequest = new RegisterRequest('', '', '', '', '');
  private subscriptions: Array<Subscription> = [];
  private registerResponse: RegisterResponse;
  phone_hint: string;

  constructor(@Inject(APP_CONFIG) private config: AppConfig, private navCtrl: NavController, private alertCtrl: AlertController,
    private loadingCtrl: LoadingController, private toastCtrl: ToastController, navParam: NavParams,
    private platform: Platform, private app: App,
    private service: WordpressClient, private translate: TranslateService) {
    this.getCountries();
    this.changeHint();
    this.registerRequest = navParam.get("registerRequest");
  }

  getCountries() {
    this.service.getCountries().subscribe(data => this.countries = data, err => console.log(err))
  }

  changeHint() {
    this.registerRequest.username = "";
    if (this.countryCode && this.countryCode.length) {
      this.translate.get('phone_excluding').subscribe(value => this.phone_hint = (value + " (+" + this.countryCode + ")"));
    } else {
      this.translate.get('phone').subscribe(value => this.phone_hint = value);
    }
  }

  createUser() {
    if (!this.countryCode || !this.countryCode.length) {
      this.translate.get("select_country").subscribe(value => this.showToast(value));
      return;
    }
    if (!this.registerRequest.username || !this.registerRequest.username.length) {
      this.translate.get("field_error_phone").subscribe(value => this.showToast(value));
      return;
    }
    this.translate.get(['otp_alert_msg', 'no', 'yes', 'check_phone', 'mobile_exist']).subscribe(text => {
      let alert = this.alertCtrl.create({
        title: "+" + this.countryCode + this.registerRequest.username,
        message: text['otp_alert_msg'],
        buttons: [{
          text: text['no'],
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }, {
          text: text['yes'],
          handler: () => {
            this.presentLoading(text['check_phone']);
            this.registerRequest.password = Math.random().toString(36).slice(-6);
            this.subscriptions.push(this.service.createUser(window.localStorage.getItem(Constants.ADMIN_API_KEY), this.countryCode, this.registerRequest).subscribe(data => {
              let haveImgToUpdate = false;
              if (this.registerRequest && this.registerRequest.meta_data) {
                for (let meta of this.registerRequest.meta_data) {
                  if (meta.key == "avatar_url" && meta.value && meta.value.length) {
                    haveImgToUpdate = true;
                    break;
                  }
                }
              }
              if (haveImgToUpdate) {
                this.service.updateUser(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(data.id), { meta_data: this.registerRequest.meta_data }).subscribe(data => {
                  console.log("dpUpdated", data);
                }, err => {
                  console.log(err);
                });
              }
              this.dismissLoading();
              this.registerResponse = data;
              this.app.getRootNav().push(OtpPage, { username: this.countryCode + this.registerRequest.username, password: this.registerRequest.password });
            }, err => {
              console.log(err);
              this.showToast(text['mobile_exist']);
              this.dismissLoading();
            }));
          }
        }]
      });
      alert.present();
    });
  }

  makeExitAlert() {
    const alert = this.alertCtrl.create({
      title: 'App termination',
      message: 'Do you want to close the app?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Application exit prevented!');
        }
      }, {
        text: 'Close App',
        handler: () => {
          this.platform.exitApp(); // Close this application
        }
      }]
    });
    alert.present();
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