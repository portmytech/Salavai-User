import { PhonePage } from './../phone/phone';
import { Component, Inject } from '@angular/core';
import { Platform, NavController, AlertController, Loading, LoadingController, ToastController, Events, ModalController, App } from 'ionic-angular';
import { WordpressClient } from '../../providers/wordpress-client.service';
import { Subscription } from "rxjs/Subscription";
import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';
import { CreateaccountPage } from '../createaccount/createaccount';
import { AuthCredential } from "../../models/auth-credential.models";
import { AuthResponse } from "../../models/auth-response.models";
import { UserResponse } from "../../models/user-response.models";
import { Constants } from "../../models/constants.models";
import { Address } from '../../models/address.models';
import { RegisterRequest } from "../../models/register-request.models";
import { RegisterResponse } from "../../models/register-response.models";
import { APP_CONFIG, AppConfig } from "../../app/app.config";
import { GooglePlus } from '@ionic-native/google-plus';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';
import { PasswordPage } from '../password/password';
import { Facebook } from '@ionic-native/facebook';
import firebase from 'firebase';
import { OtpPage } from '../otp/otp';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  private loading: Loading;
  private loadingShown: Boolean = false;
  //private authError = "";
  private countries: any;
  private countryCode: string;
  private registerRequest: RegisterRequest = new RegisterRequest('', '', '', '', '');

  private subscriptions: Array<Subscription> = [];
  private credentials: AuthCredential = new AuthCredential('', '');
  private registerRequestPasswordConfirm: string = '';
  private registerResponse: RegisterResponse;
  private socialDP: string;
  phone_hint: string;

  constructor(@Inject(APP_CONFIG) public config: AppConfig, public translate: TranslateService, private facebook: Facebook,
    private events: Events, private modalCtrl: ModalController, private toastCtrl: ToastController,
    public navCtrl: NavController, private service: WordpressClient, private loadingCtrl: LoadingController,
    private alertCtrl: AlertController, public google: GooglePlus, public platform: Platform, private app: App) {
    this.getCountries();
    this.changeHint();
  }

  getCountries() {
    this.service.getCountries().subscribe(data => this.countries = data, err => console.log(err))
  }

  changeHint() {
    this.credentials.username = "";
    if (this.countryCode && this.countryCode.length) {
      this.translate.get('phone_excluding').subscribe(value => this.phone_hint = (value + " (+" + this.countryCode + ")"));
    } else {
      this.translate.get('phone').subscribe(value => this.phone_hint = value);
    }
  }

  signIn() {
    //this.authError = "";
    this.translate.get(["field_empty_countrycode", "field_empty_both", "loading_sign_in"]).subscribe(values => {
      if (!this.countryCode || !this.countryCode.length) {
        this.showToast(values["field_empty_countrycode"]);
      } else if (this.credentials.username.length == 0 || this.credentials.password.length == 0) {
        this.showToast(values["field_empty_both"]);
      } else {
        this.presentLoading(values["loading_sign_in"]);
        let credentials = { username: this.countryCode + this.credentials.username, password: this.credentials.password };
        this.subscriptions.push(this.service.getAuthToken(credentials).subscribe(data => {
          this.dismissLoading();
          let authResponse: AuthResponse = data;
          window.localStorage.setItem(Constants.USER_API_KEY, authResponse.token);
          this.getUser(this.getUserIdFromToken(authResponse.token));
        }, err => {
          console.log("getAuthToken", err);
          this.dismissLoading();

          let keyToGet = "login_error";
          if (err.error && err.error.code) if (String(err.error.code).includes("username")) keyToGet = "invalid_username"; else if (String(err.error.code).includes("password")) keyToGet = "invalid_password";
          this.translate.get(keyToGet).subscribe(value => this.presentErrorAlert(value));
        }));
      }
    });
  }

  loginFB(): void {
    this.translate.get('loging_fb').subscribe(value => {
      this.presentLoading(value);
      if (this.platform.is('cordova')) {
        this.fbOnPhone();
      } else {
        this.fbOnBrowser();
      }
    });
  }

  loginGoogle(): void {
    this.translate.get('loging_google').subscribe(value => {
      this.presentLoading(value);
      if (this.platform.is('cordova')) {
        this.googleOnPhone();
      } else {
        this.googleOnBrowser();
      }
    });
  }

  googleOnPhone() {
    const provider = {
      'webClientId': this.config.firebaseConfig.webApplicationId,
      'offline': false,
      'scopes': 'profile email'
    };
    this.google.login(provider).then((res) => {
      this.socialDP = String(res.imageUrl).replace("s96-c", "s500-c");
      const googleCredential = firebase.auth.GoogleAuthProvider.credential(res.idToken);
      firebase.auth().signInAndRetrieveDataWithCredential(googleCredential).then((response) => {
        this.registerRequest.first_name = response.user.displayName;
        // this.registerRequest.first_name = this.getNames(response.user.displayName).first_name;
        // this.registerRequest.last_name = this.getNames(response.user.displayName).last_name;
        this.registerRequest.meta_data = [{ key: "avatar_url", value: this.socialDP ? this.socialDP : response.user.photoURL }];
        let profile = JSON.parse(JSON.stringify(response.additionalUserInfo.profile));
        this.registerRequest.email = profile.email;
        this.dismissLoading();
        this.translate.get('google_success_auth2').subscribe(value => {
          this.presentLoading(value);
        });
        console.log('response after firebase in the google:---' + JSON.stringify(profile));
        // this.presentLoading('Firebase authenticated google signup, creating user..');
        console.log('Firebase authenticated google signup, creating user..');
        this.checkUser();
      }, (err) => {
        console.log("Error in firebase auth after google login:-- ", JSON.stringify(err));
        this.dismissLoading();
        this.presentErrorAlert('google login err: ' + err);
      })
    }, (err) => {
      console.log("Error: in google access:-- ", JSON.stringify(err));
      this.dismissLoading();
      this.presentErrorAlert('google login err: ' + err);
    })
  }

  // getNames(displayName) {
  //   let obj = { first_name: '', last_name: '' };
  //   if (!displayName.length || displayName == "") {
  //     return obj;
  //   }
  //   var names = displayName.split(" ");
  //   obj.first_name = names[0];
  //   for (let i = 0; i < names.length; i++) {
  //     if (names[i] != obj.first_name && names[i] != "" && names[i].length > 0) {
  //       obj.last_name = names[i];
  //       break;
  //     }
  //   }
  //   return obj;
  // }

  googleOnBrowser() {
    try {
      console.log("In not cordova");
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('email');
      firebase.auth().signInWithPopup(provider).then((result) => {
        this.registerRequest.email = result.user.email;
        this.registerRequest.first_name = result.user.displayName;
        // this.registerRequest.first_name = this.getNames(result.user.displayName).first_name;
        // this.registerRequest.last_name = this.getNames(result.user.displayName).last_name;
        this.registerRequest.meta_data = [{ key: "avatar_url", value: result.user.photoURL }];
        console.log(this.registerRequest);
        this.dismissLoading();
        this.translate.get('google_success_auth2').subscribe(value => {
          this.presentLoading(value);
        });
        // this.presentLoading('Firebase authenticated google signup, creating user..');
        this.checkUser();
        console.log(result);
      }).catch((error) => {
        console.log(error);
        this.dismissLoading();
      });
    } catch (err) {
      this.dismissLoading();
      console.log(err);
    }
  }

  fbOnPhone() {
    this.facebook.login(["public_profile", 'email']).then(response => {
      this.socialDP = "https://graph.facebook.com/" + response.authResponse.userID + "/picture?height=500";
      const facebookCredential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
      firebase.auth().signInAndRetrieveDataWithCredential(facebookCredential).then((success) => {
        this.registerRequest.email = success.user.email;
        this.registerRequest.first_name = success.user.displayName;
        // this.registerRequest.first_name = this.getNames(success.user.displayName).first_name;
        // this.registerRequest.last_name = this.getNames(success.user.displayName).last_name;
        this.registerRequest.meta_data = [{ key: "avatar_url", value: this.socialDP ? this.socialDP : success.user.photoURL }];
        let profile = JSON.parse(JSON.stringify(success.additionalUserInfo.profile));
        this.registerRequest.email = profile.email;
        this.dismissLoading();
        this.translate.get('fb_success_auth2').subscribe(value => {
          this.presentLoading(value);
          this.checkUser();
        });
      }).catch((error) => {
        console.log("Error in firebase auth after fb login", JSON.stringify(error));
        this.showToast("Error in Facebook login");
        this.dismissLoading();
      });
    }).catch((error) => {
      console.log("Error in fb login", JSON.stringify(error));
      this.showToast("Error in Facebook login");
      this.dismissLoading();
    });
  }

  fbOnBrowser() {
    console.log("In not cordova");
    let provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('user_birthday');
    provider.addScope('user_friends');
    provider.addScope('email');
    provider.addScope('public_profile');
    firebase.auth().signInWithPopup(provider).then((result) => {
      this.registerRequest.email = result.user.email;
      this.registerRequest.first_name = result.user.displayName;
      // this.registerRequest.first_name = this.getNames(result.user.displayName).first_name;
      // this.registerRequest.last_name = this.getNames(result.user.displayName).last_name;
      this.registerRequest.meta_data = [{ key: "avatar_url", value: this.socialDP ? this.socialDP : result.user.photoURL }];
      this.dismissLoading();
      this.presentLoading('Firebase authenticated Facebook login, creating user..');
      this.checkUser();
    }).catch((error) => {
      console.log(error);
      this.dismissLoading();
      this.showToast("Facebook login unsuccessfull");
    });
  }

  checkUser() {
    this.dismissLoading();
    const component = this;
    component.translate.get('check_user').subscribe(value => {
      component.presentLoading(value);
    });
    firebase.auth().currentUser.getIdToken(false).then(function (idToken) {
      component.service.checkToken(window.localStorage.getItem(Constants.ADMIN_API_KEY), idToken).subscribe(data => {
        let authResponse = data;
        window.localStorage.setItem(Constants.USER_API_KEY, authResponse.token);
        component.dismissLoading();
        component.getUser(component.getUserIdFromToken(authResponse.token));
      }, err => {
        // if error code is 404, user not exists
        console.log("User not exist", err);
        component.dismissLoading();
        component.verifyPhone();
      });
    }).catch(function (error) {
      component.dismissLoading();
      console.log("error");
    });
  }

  verifyPhone() {
    this.app.getRootNav().setRoot(PhonePage, { registerRequest: this.registerRequest });
  }

  private getUser(userId: string) {
    if (this.socialDP && this.socialDP.length) {
      this.service.updateUser(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(userId), { meta_data: [{ key: "avatar_url", value: this.socialDP }] }).subscribe(data => {
        console.log("dpUpdated", data);
      }, err => {
        console.log(err);
      });
    }
    this.translate.get('fetch_user').subscribe(value => {
      this.presentLoading(value);
      this.subscriptions.push(this.service.getUser(window.localStorage.getItem(Constants.ADMIN_API_KEY), userId).subscribe(data => {
        this.dismissLoading();
        let userResponse: UserResponse = data;
        if (this.userOtpVerified(userResponse)) {
          if (this.socialDP && this.socialDP.length) {
            userResponse.avatar_url = this.socialDP;
          }
          window.localStorage.setItem(Constants.USER_KEY, JSON.stringify(userResponse));
          if (userResponse.billing && userResponse.billing.address_1 && userResponse.billing.address_1.length && userResponse.billing.address_2 && userResponse.billing.address_2.length) {
            userResponse.billing.id = 1;
            window.localStorage.setItem(Constants.SELECTED_ADDRESS, JSON.stringify(userResponse.billing));
            let addressList = new Array<Address>();
            addressList.push(userResponse.billing);
            window.localStorage.setItem(Constants.SELECTED_ADDRESS_LIST, JSON.stringify(addressList));
          }
          this.app.getRootNav().setRoot(TabsPage);
          this.events.publish('user:login', userResponse);
        } else {
          this.navCtrl.push(OtpPage, { username: userResponse.username, userid: String(userResponse.id) });
        }
      }, err => {
        console.log(err);
        this.dismissLoading();
        this.translate.get('login_error').subscribe(value => {
          this.presentLoading(value);
        });
      }));
    });
  }

  userOtpVerified(user): boolean {
    let toReturn = false;
    if (user && user.meta_data) {
      for (let meta of user.meta_data) {
        if (meta.key == "otp_verified" && meta.value && meta.value == "verified") {
          toReturn = true;
          break;
        }
      }
    }
    return toReturn;
  }

  private getUserIdFromToken(token: string): string {
    let decodedString: string = window.atob(token.split(".")[1]);
    return JSON.parse(decodedString).data.user.id;
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

  signupPage() {
    this.navCtrl.push(CreateaccountPage);
  }

  homePage() {
    this.navCtrl.setRoot(HomePage);
  }

  passwordPage() {
    this.navCtrl.push(PasswordPage);
  }

}
