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
  appName: "Salavai",
  apiBase: "https://salavai.in/",
  consumerKey: "ck_3629a8c783789e4ab628eb2edaea1f7ede36915a",
  consumerSecret: "cs_157d8f9dcc3e8bb7dac00ca7e8480002eddbf7a7",
  adminUsername: "salavai",
  adminPassword: "Portmytech@2",
  googleApiKey: "AIzaSyD9RV-GIK711UAGnfTxI9InW0HcdU4MkhU",
  oneSignalAppId: "3f82f3f9-54cb-41b9-8105-9fa9e5fa7482",
  oneSignalGPSenderId: "799007738070",
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
    webApplicationId: "799007738070-hkfujefi6tdl5gsj0usemc3mfiks1p1i.apps.googleusercontent.com",
    apiKey: "AIzaSyBQWDty_s9mC_6XBlKJowa3QpJhalfDGnU",
    authDomain: "indian-film-tv-a3727.firebaseapp.com",
    databaseURL: "https://indian-film-tv-a3727-default-rtdb.firebaseio.com",
    projectId: "indian-film-tv-a3727",
    storageBucket: "indian-film-tv-a3727.appspot.com",
    messagingSenderId: "799007738070"
  }
};