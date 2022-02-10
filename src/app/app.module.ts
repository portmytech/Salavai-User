import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { MyaddressPage } from '../pages/myaddress/myaddress';
import { AboutPage } from '../pages/about/about';
import { AccountPage } from '../pages/account/account';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { MyordersPage } from '../pages/myorders/myorders';
import { NotificationPage } from '../pages/notification/notification';
import { OffersPage } from '../pages/offers/offers';
import { OrderconfirmedPage } from '../pages/orderconfirmed/orderconfirmed';
import { OrderslipPage } from '../pages/orderslip/orderslip';
import { ProfilePage } from '../pages/profile/profile';
import { RatePage } from '../pages/rate/rate';
import { SelectclothesPage } from '../pages/selectclothes/selectclothes';
import { SelectdatePage } from '../pages/selectdate/selectdate';
import { TabsPage } from '../pages/tabs/tabs';
import { TncPage } from '../pages/tnc/tnc';
import { LoginPage } from '../pages/login/login';
import { OtpPage } from '../pages/otp/otp';
import { PhonePage } from '../pages/phone/phone';
import { CreateaccountPage } from '../pages/createaccount/createaccount';
import { APP_CONFIG, BaseAppConfig } from "./app.config";
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { GooglePlus } from '@ionic-native/google-plus';
import { OneSignal } from '@ionic-native/onesignal';
import { Globalization } from '@ionic-native/globalization';
import { Device } from '@ionic-native/device';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Clipboard } from '@ionic-native/clipboard';
import { CodePage } from '../pages/code/code';
import { CallNumber } from '@ionic-native/call-number';
import { EmailComposer } from '@ionic-native/email-composer';
import { Geolocation } from '@ionic-native/geolocation';
import { Network } from '@ionic-native/network';
import { Connectivity } from '../providers/connectivity-service';
import { GoogleMaps } from '../providers/google-maps';
import { SelectareaPage } from '../pages/selectarea/selectarea';
import { Facebook } from '@ionic-native/facebook'
import { PasswordPage } from '../pages/password/password';
import { ManagelanguagePage } from '../pages/managelanguage/managelanguage';
import { Add_address_titlePage } from '../pages/add_address_title/add_address_title';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';
import { File } from '@ionic-native/file';
import { Contact_usPage } from '../pages/contact_us/contact_us';
import { ConversationPage } from '../pages/conversation/conversation';
import { SelectShippingPage } from '../pages/selectshipping/selectshipping';
import { WordpressClient } from '../providers/wordpress-client.service';
import { Global } from '../providers/global';
import { Vt_popupPage } from '../pages/vt_popup/vt_popup';
import { PaymentPage } from '../pages/payment/payment';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyaddressPage,
    LoginPage,
    PhonePage,
    CreateaccountPage,
    MyApp,
    AboutPage,
    AccountPage,
    ContactPage,
    HomePage,
    MyordersPage,
    NotificationPage,
    OffersPage,
    OrderconfirmedPage,
    OrderslipPage,
    OtpPage,
    PaymentPage,
    ProfilePage,
    RatePage,
    SelectclothesPage,
    SelectdatePage,
    TabsPage,
    TncPage,
    CodePage,
    SelectareaPage,
    PasswordPage,
    ManagelanguagePage,
    Contact_usPage,
    ConversationPage,
    Add_address_titlePage,
    SelectShippingPage,
    Vt_popupPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyaddressPage,
    LoginPage,
    PhonePage,
    CreateaccountPage,
    MyApp,
    AboutPage,
    AccountPage,
    ContactPage,
    HomePage,
    MyordersPage,
    NotificationPage,
    OffersPage,
    OrderconfirmedPage,
    OrderslipPage,
    OtpPage,
    PaymentPage,
    ProfilePage,
    RatePage,
    SelectclothesPage,
    SelectdatePage,
    TabsPage,
    TncPage,
    CodePage,
    SelectareaPage,
    PasswordPage,
    ManagelanguagePage,
    Contact_usPage,
    ConversationPage,
    Add_address_titlePage,
    SelectShippingPage,
    Vt_popupPage
  ],
  providers: [
    Device,
    OneSignal,
    StatusBar,
    SplashScreen,
    Clipboard,
    InAppBrowser,
    Globalization,
    CallNumber,
    EmailComposer,
    Geolocation,
    Network,
    Connectivity,
    GoogleMaps,
    GooglePlus,
    Facebook,
    ImagePicker,
    Crop,
    File,
    WordpressClient, Global,
    { provide: APP_CONFIG, useValue: BaseAppConfig },
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }