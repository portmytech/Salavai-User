import { WordpressClient } from './../../providers/wordpress-client.service';
import { Component } from '@angular/core';
import { Events, App, Platform, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { UserResponse } from "../../models/user-response.models";
import { Constants } from "../../models/constants.models";
import { Subscription } from "rxjs/Subscription";
import { AuthResponse } from "../../models/auth-response.models";
import { AuthCredential } from "../../models/auth-credential.models";
import { TranslateService } from '@ngx-translate/core';
import * as firebase from 'firebase/app';

@Component({
  selector: 'page-otp ',
  templateUrl: 'otp.html'
})
export class OtpPage {
  private recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  private loading: any;
  private loadingShown: boolean = false;
  private captchanotvarified: boolean = true;
  private result: any;
  private buttonDisabled: any = true;
  private otp = '';
  private component: any;
  private captchaVerified: boolean = false;
  private verfificationId: any;
  private timer: any;
  private minutes: number = 0;
  private seconds: number = 0;
  private totalSeconds: number = 0;
  private intervalCalled: boolean = false;
  private subscriptions: Array<Subscription> = [];
  private resendCode: boolean = false;
  private otpNotSent: boolean = true;
  private username: string;
  private password: string;
  private userid: string;

  constructor(private params: NavParams, private alertCtrl: AlertController,
    private loadingCtrl: LoadingController, private toastCtrl: ToastController,
    private navCtrl: NavController, private platform: Platform, private translate: TranslateService,
    private service: WordpressClient, private events: Events, private app: App) {
    this.username = this.params.get('username');
    this.password = this.params.get('password');
    this.userid = this.params.get('userid');
  }

  ionViewDidLoad() {
    if (!(this.platform.is('cordova'))) {
      this.makeCaptcha();
    }
    this.sendOTP();
  }

  sendOTP() {
    this.resendCode = false;
    this.otpNotSent = true;
    let phone = "+" + this.username;
    if (this.platform.is('cordova')) {
      this.sendOtpPhone(phone);
    } else {
      this.sendOtpBrowser(phone);
    }
    if (this.intervalCalled) {
      clearInterval(this.timer);
    }
  }

  createTimer() {
    this.intervalCalled = true;
    this.totalSeconds--;
    if (this.totalSeconds == 0) {
      this.otpNotSent = true;
      this.resendCode = true;
      clearInterval(this.timer);
    } else {
      this.seconds = (this.totalSeconds % 60);
      if (this.totalSeconds >= this.seconds) {
        this.minutes = (this.totalSeconds - this.seconds) / 60
      } else {
        this.minutes = 0;
      }
    }
  }

  createInterval() {
    this.totalSeconds = 120;
    this.createTimer();
    this.timer = setInterval(() => {
      this.createTimer();
    }, 1000);
  }

  sendOtpPhone(phone) {
    this.translate.get(["sending_otp", "otp_verified_auto", "otp_sent", "otp_fail"]).subscribe(values => {
      this.presentLoading(values["sending_otp"]);
      const component = this;
      (<any>window).FirebasePlugin.verifyPhoneNumber(phone, 60, function (credential) {
        console.log("verifyPhoneNumber", JSON.stringify(credential));
        component.verfificationId = credential.verificationId ? credential.verificationId : credential;
        // if instant verification is true use the code that we received from the firebase endpoint, otherwise ask user to input verificationCode:
        //var code = credential.instantVerification ? credential.code : inputField.value.toString();
        if (component.verfificationId) {
          if (credential.instantVerification && credential.code) {
            component.otp = credential.code;
            component.showToast(values["otp_verified_auto"]);
            component.verifyOtpPhone();
          } else {
            component.showToast(values["otp_sent"]);
            component.otpNotSent = false;
            component.createInterval();
          }
        }
        component.dismissLoading();
      }, function (error) {
        console.log("otp_send_fail", error);
        component.otpNotSent = true;
        component.resendCode = true;
        component.dismissLoading();
        component.showToast(values["otp_fail"]);
      });
    });
  }

  sendOtpBrowser(phone) {
    this.dismissLoading();
    const component = this;
    component.presentLoading("Sending OTP by SMS");
    console.log("In not cordova");
    firebase.auth().signInWithPhoneNumber(phone, this.recaptchaVerifier).then((confirmationResult) => {
      component.otpNotSent = false;
      component.result = confirmationResult;
      component.dismissLoading();
      component.showToast("OTP sent on your mobile");
      if (component.intervalCalled) {
        clearInterval(component.timer);
      }
      component.createInterval();
    }).catch(function (error) {
      component.resendCode = true;
      component.dismissLoading();
      if (error.message) {
        component.showToast(error.message);
      } else {
        component.showToast("SMS not sent");
      }
      console.log("SMS not sent " + JSON.stringify(error));
    });
  }

  verify() {
    if (this.otp && this.otp.length) {
      if (this.platform.is('cordova')) {
        this.verifyOtpPhone();
      } else {
        this.verifyOtpBrowser();
      }
    }
  }

  verifyOtpPhone() {
    this.translate.get(["verifying_otp", "otp_success", "otp_err1"]).subscribe(values => {
      const credential = firebase.auth.PhoneAuthProvider.credential(this.verfificationId, this.otp);
      this.presentLoading(values["verifying_otp"]);
      firebase.auth().signInAndRetrieveDataWithCredential(credential).then((info) => {
        console.log(JSON.stringify(info));
        this.dismissLoading();
        this.showToast(values["otp_success"]);
        this.signIn();
      }, (error) => {
        this.showToast(values["otp_err1"]);
        // if (error.message) {
        //   this.showToast(error.message);
        // } else {
        //   this.showToast(values["otp_err1"]);
        // }
        this.dismissLoading();
        console.log(JSON.stringify(error));
      })
    });
  }

  verifyOtpBrowser() {
    const component = this;
    component.presentLoading("Verifying OTP by SMS");
    component.result.confirm(this.otp).then(function (response) {
      component.dismissLoading();
      component.showToast("OTP verified");
      component.signIn();
    }).catch(function (error) {
      if (error.message) {
        component.showToast(error.message);
      } else {
        component.showToast("Unable to verify given otp");
      }
      component.dismissLoading();
    });
  }

  makeCaptcha() {
    const component = this;
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      // 'size': 'normal',
      'size': 'invisible',
      'callback': function (response) {
        component.captchanotvarified = true;
        console.log("captchanotvarified:--" + component.captchanotvarified);
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    });
    this.recaptchaVerifier.render();
  }

  private getUserIdFromToken(token: string): string {
    let decodedString: string = window.atob(token.split(".")[1]);
    return JSON.parse(decodedString).data.user.id;
  }

  private signIn() {
    this.translate.get(["just_a_moment", "something_wrong"]).subscribe(values => {
      this.presentLoading(values["just_a_moment"]);
      if (this.userid && this.userid.length) {
        this.getUser(this.userid);
      } else {
        this.subscriptions.push(this.service.getAuthToken(new AuthCredential(this.username, this.password)).subscribe(data => {
          let authResponse: AuthResponse = data;
          window.localStorage.setItem(Constants.USER_API_KEY, authResponse.token);
          this.getUser(this.getUserIdFromToken(authResponse.token));
        }, err => {
          console.log(err);
          this.dismissLoading();
          this.presentErrorAlert(values["something_wrong"]);
        }));
      }
    });
  }

  private getUser(userId: string) {
    this.translate.get("something_wrong").subscribe(value => {
      this.service.updateUser(window.localStorage.getItem(Constants.ADMIN_API_KEY), userId, { meta_data: [{ key: "otp_verified", value: "verified" }] }).subscribe(data => {
        console.log("updateUser", data);
        this.dismissLoading();
        let userResponse: UserResponse = data;
        window.localStorage.setItem(Constants.USER_KEY, JSON.stringify(userResponse));
        this.app.getRootNav().setRoot(TabsPage);
        this.events.publish('user:login', userResponse);
      }, err => {
        console.log("updateUser", err);
        this.dismissLoading();
        this.presentErrorAlert(value);
      })
    });
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

  private presentErrorAlert(msg: string) {
    let alert = this.alertCtrl.create({
      title: "Error",
      subTitle: msg,
      buttons: ["Dismiss"]
    });
    alert.present();
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
}
