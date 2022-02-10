import { Component, Inject } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Settings } from '../../models/setting.models';
import { APP_CONFIG, AppConfig } from '../../app/app.config';
import { CallNumber } from '@ionic-native/call-number';
import { EmailComposer } from '@ionic-native/email-composer';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  private settings: Settings;

  constructor(@Inject(APP_CONFIG) private config: AppConfig, navParam: NavParams, public navCtrl: NavController, private callNumber: CallNumber, private emailComposer: EmailComposer) {
    this.settings = navParam.get("settings");
  }

  dial() {
    this.callNumber.callNumber(this.settings.laundry_appconfig_mobilenumber, true).then(res => console.log('Launched dialer!', res)).catch(err => console.log('Error launching dialer', err));
  }

  navigate() {
    window.open("geo:lat,lon?q=" + this.settings.laundry_appconfig_address, "_system");
  }

  mail() {
    let email = {
      to: this.settings.laundry_appconfig_email,
      subject: this.config.appName,
      body: '',
      isHtml: true
    };
    this.emailComposer.open(email);
  }

}
