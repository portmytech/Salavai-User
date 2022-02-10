import { Component } from '@angular/core';
import { NavController, Loading, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { Address } from '../../models/address.models';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';
import { WordpressClient } from '../../providers/wordpress-client.service';
import { Constants } from '../../models/constants.models';
import { UserResponse } from '../../models/user-response.models';
import { SelectareaPage } from '../selectarea/selectarea';
import { SelectdatePage } from '../selectdate/selectdate';
import { ShippingZoneLocation } from '../../models/shipping-zone-location.models';
import { Currency } from '../../models/currency.models';
import { SelectShippingPage } from '../selectshipping/selectshipping';

@Component({
  selector: 'page-myaddress',
  templateUrl: 'myaddress.html'
})
export class MyaddressPage {
  private addresses = new Array<Address>();
  private select: boolean;
  private loading: Loading;
  private loadingShown: Boolean = false;
  private subscriptions: Array<Subscription> = [];
  private selectedAddressId: number;
  private currencyIcon: string = '';
  private currencyText: string = '';

  constructor(private translate: TranslateService, navParams: NavParams,
    private navCtrl: NavController, private toastCtrl: ToastController, private service: WordpressClient,
    private loadingCtrl: LoadingController, private alertCtrl: AlertController) {
    this.select = (navParams.get('action') != null);
    let currency: Currency = JSON.parse(window.localStorage.getItem(Constants.CURRENCY));
    if (currency) {
      this.currencyText = currency.value;
      let iconText = currency.options[currency.value];
      this.currencyIcon = iconText.substring(iconText.lastIndexOf('(') + 1, iconText.length - 1);
    }
  }

  ionViewDidEnter() {
    let addresses = JSON.parse(window.localStorage.getItem(Constants.SELECTED_ADDRESS_LIST));
    if (addresses != null) {
      for (let ad of addresses) if (!ad.type) ad.type = 1;
      this.addresses = addresses;
    }
  }

  addressNew() {
    this.navCtrl.push(SelectareaPage);
    // this.diagnostic.isLocationEnabled().then((isAvailable) => {
    //   if (isAvailable) {
    //     this.navCtrl.push(SelectareaPage);
    //   } else {
    //     this.alertLocationServices();
    //   }
    // }).catch((e) => {
    //   console.error(e);
    //   this.alertLocationServices();
    // });
  }

  alertLocationServices() {
    this.translate.get(['location_services_title', 'location_services_message', 'okay']).subscribe(text => {
      let alert = this.alertCtrl.create({
        title: text['location_services_title'],
        subTitle: text['location_services_message'],
        buttons: [{
          text: text['okay'],
          role: 'cancel',
          handler: () => {
            console.log('okay clicked');
          }
        }]
      });
      alert.present();
    })
  }

  onAddressChangeHandler(event) {
    setTimeout(() => {
      for (let ad of this.addresses) if (ad.id == event) { this.addressEditSelect(ad); break; }
    }, 100);
  }

  addressEditSelect(address) {
    if (this.select) {
      let user: UserResponse = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
      user.billing = address;
      user.shipping = address;
      user.first_name = address.first_name;
      //user.last_name = address.last_name;
      window.localStorage.setItem(Constants.USER_KEY, JSON.stringify(user));
      window.localStorage.setItem(Constants.SELECTED_ADDRESS, JSON.stringify(address));

      this.translate.get('just_a_moment').subscribe(value => {
        this.presentLoading(value);
        this.subscriptions.push(this.service.updateUser(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(user.id), user).subscribe(data => {
          this.dismissLoading();
          this.addressSelected(address);
        }, err => {
          console.log(err);
          this.dismissLoading();
          this.addressSelected(address);
        }));
      });
    } else {
      this.navCtrl.push(SelectareaPage, { address: address });
      // this.diagnostic.isLocationEnabled().then((isAvailable) => {
      //   if (isAvailable) {
      //     this.navCtrl.push(SelectareaPage, { address: address });
      //   } else {
      //     this.alertLocationServices();
      //   }
      // }).catch((e) => {
      //   console.error(e);
      //   this.alertLocationServices();
      // });
    }
  }

  addressSelected(address) {
    let shippingZoneLocation = this.matchZone(address);
    console.log('szl match', shippingZoneLocation);
    if (shippingZoneLocation) {
      this.translate.get('fetch_shipping_methods').subscribe(value => {
        this.presentLoading(value);
        this.subscriptions.push(this.service.shippingZoneMethods(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(shippingZoneLocation.zoneId)).subscribe(data => {
          for (let d of data) d.costToShow = this.currencyIcon + ' ' + d.cost;
          this.dismissLoading();
          this.navCtrl.push(data && data.length ? SelectShippingPage : SelectdatePage, { shipping_methods: data });
        }, err => {
          this.dismissLoading();
          console.log('ErrShippingZoneLocation', err);
          this.navCtrl.push(SelectdatePage);
        }));
      });
    } else {
      this.navCtrl.push(SelectdatePage);
    }
  }

  matchZone(address): ShippingZoneLocation {
    let matched: ShippingZoneLocation;
    let shippingZoneLocations: Array<ShippingZoneLocation> = JSON.parse(window.localStorage.getItem(Constants.SHIPPING_ZONE_LOCATIONS));
    if (shippingZoneLocations) {
      for (let szl of shippingZoneLocations) {
        if (szl.type == "postcode") {
          if (szl.code.toLocaleLowerCase().includes(address.postcode.toLocaleLowerCase()) || address.postcode.toLocaleLowerCase().includes(szl.code.toLocaleLowerCase())) {
            matched = szl;
            break;
          }
          if (szl.code.toLocaleLowerCase().includes(".")) {
            let code = szl.code.split(".");
            if (code && code.length >= 4) {
              let min = code[0];
              let max = code[3].trim();
              if (Number(address.postcode) >= Number(min) && Number(address.postcode) <= Number(max)) {
                matched = szl;
                break;
              }
            }
          }
        }
      }
      if (!matched && address.country && address.state) {
        for (let szl of shippingZoneLocations) {
          if (szl.code == (address.country + ":" + address.state)) {
            matched = szl;
            break;
          }
        }
      }
      if (!matched && address.country) {
        for (let szl of shippingZoneLocations) {
          if (szl.code == address.country) {
            matched = szl;
            break;
          }
        }
      }
    }
    return matched;
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
