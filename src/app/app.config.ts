import { InjectionToken } from "@angular/core";

export let APP_CONFIG = new InjectionToken<AppConfig>("app.config");

export interface FirebaseConfig {
  apiKey: string,
  authDomain: string,
  databaseURL: string,
  projectId: string,
  storageBucket: string,
  messagingSenderId: string,
  webApplicationId: string
}

export interface AppConfig {
  appName: string;
  apiBase: string;
  consumerKey: string;
  consumerSecret: string;
  adminUsername: string;
  adminPassword: string;
  googleApiKey: string;
  oneSignalAppId: string;
  oneSignalGPSenderId: string;
  paypalSandbox: string;
  paypalProduction: string;
  payuSalt: string;
  payuKey: string;
  stripeKey: string;
  availableLanguages: Array<any>;
  firebaseConfig: FirebaseConfig;
  demoMode: boolean;
}

export const BaseAppConfig: AppConfig = {
  appName: "YourAppName",
  apiBase: "https://yourapibase.com/",
  consumerKey: "ck_YOUR_WOOCOMMERE_CONSUMER_KEY",
  consumerSecret: "ck_YOUR_WOOCOMMERE_CONSUMER_SECRET",
  adminUsername: "",
  adminPassword: "",
  googleApiKey: "YourGoogleApiKey",
  oneSignalAppId: "YourOneSignalAppId",
  oneSignalGPSenderId: "",
  paypalSandbox: "",
  paypalProduction: "",
  payuSalt: "YourPayUSalt",
  payuKey: "YourPayUKey",
  stripeKey: "YourStripeKey",
  availableLanguages: [{
    code: 'en',
    name: 'English'
  }, {
    code: 'ar',
    name: 'عربى'
  }, {
    code: 'fr',
    name: 'français'
  }, {
    code: 'es',
    name: 'Española'
  }, {
    code: 'id',
    name: 'bahasa Indonesia'
  }, {
    code: 'pt',
    name: 'português'
  }, {
    code: 'tr',
    name: 'Türk'
  }, {
    code: 'it',
    name: 'Italiana'
  }, {
    code: 'sw',
    name: 'Kiswahili'
  }, {
    code: 'hi',
    name: 'हिन्दी'
  }, {
    code: 'gu',
    name: 'ગુજરાતી'
  }],
  demoMode: false,
  firebaseConfig: {
    webApplicationId: "",
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
  }
};