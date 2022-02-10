import { NavController, MenuController, NavParams, ToastController, Modal, Loading, LoadingController, ModalController, Events } from 'ionic-angular';
import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from '../../providers/google-maps';
import { Constants } from '../../models/constants.models';
import { MyLocation } from '../../models/my-location.models';
import { Address } from '../../models/address.models';
import { UserResponse } from '../../models/user-response.models';
import { Subscription } from 'rxjs/Subscription';
import { Add_address_titlePage } from '../add_address_title/add_address_title';
import { TranslateService } from '@ngx-translate/core';
import { } from '@types/googlemaps';

@Component({
  selector: 'page-selectarea',
  templateUrl: 'selectarea.html'
})
export class SelectareaPage {
  @ViewChild('map') private mapElement: ElementRef;
  @ViewChild('pleaseConnect') private pleaseConnect: ElementRef;
  private latitude: number;
  private longitude: number;
  private autocompleteService: any;
  private placesService: any;
  private query: string = '';
  private places: any = [];
  private searchDisabled: boolean;
  private saveDisabled: boolean;
  private initialized: boolean;
  private location: MyLocation;
  private marker: google.maps.Marker;
  private address: Address;
  private modalPresented = false;
  private addressSaveModal: Modal;
  private subscriptions: Array<Subscription> = [];
  private loading: Loading;
  private loadingShown = false;

  constructor(private navCtrl: NavController, private menuCtrl: MenuController, private loadingCtrl: LoadingController,
    private modalCtrl: ModalController, navparam: NavParams,
    private zone: NgZone, private maps: GoogleMaps, private translate: TranslateService,
    private geolocation: Geolocation, private toastCtrl: ToastController, private events: Events) {
    this.menuCtrl.enable(false, 'myMenu');
    this.searchDisabled = true;
    this.saveDisabled = true;
    this.address = navparam.get("address");
  }

  ionViewWillLeave() {
    if (this.addressSaveModal) this.addressSaveModal.dismiss();
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.dismissLoading();
  }

  ionViewDidLoad(): void {
    if (!this.initialized) {
      let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then(() => {
        this.autocompleteService = new google.maps.places.AutocompleteService();
        this.placesService = new google.maps.places.PlacesService(this.maps.map);
        this.searchDisabled = false;
        this.maps.map.addListener('click', (event) => {
          if (event && event.latLng) {
            this.onMapClick(new google.maps.LatLng(event.latLng.lat(), event.latLng.lng()));
          }
        });
        this.initialized = true;
        if (this.address && this.address.address_2) {
          let address2split = this.address.address_2.split(",");
          if (address2split && address2split.length >= 2 && Number(address2split[0]) && Number(address2split[1])) {
            this.location = new MyLocation();
            this.location.name = this.address.address_1;
            this.location.lat = address2split[0];
            this.location.lng = address2split[1];
            this.location.postal_code = this.address.postcode;
            this.onMapClick(new google.maps.LatLng(Number(address2split[0]), Number(address2split[1])));
          } else {
            this.detect();
          }
        } else {
          this.detect();
        }
      }).catch(err => {
        console.log(err);
        this.close();
      });
      mapLoaded.catch(err => {
        console.log(err);
        this.close();
      });
    }
  }

  onMapClick(pos: google.maps.LatLng) {
    if (pos) {
      if (!this.marker) {
        this.marker = new google.maps.Marker({ position: pos, map: this.maps.map });
        this.marker.setClickable(true);
        this.marker.addListener('click', (event) => {
          console.log("markerevent", event);
          this.showToast(this.location.name);
        });
      }
      else {
        this.marker.setPosition(pos);
      }
      this.maps.map.panTo(pos);

      let geocoder = new google.maps.Geocoder();
      let request = { location: pos };
      geocoder.geocode(request, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
          console.log("geocode", results[0]);
          this.saveDisabled = false;
          this.location = new MyLocation();
          this.location.name = results[0].formatted_address;
          this.location.lat = String(pos.lat());
          this.location.lng = String(pos.lng());
          this.location.postal_code = this.getAddressComponents("postal_code", results[0].address_components);
          let keyToFind = "administrative_area_level_1";
          for (let i = 1; i <= 10; i++) {
            let administrative_area = this.getAddressComponents(("administrative_area_level_" + i), results[0].address_components);
            if (administrative_area && administrative_area.length == 2) {
              keyToFind = ("administrative_area_level_" + i);
              break;
            }
          }
          console.log("keyToFind", keyToFind);
          this.location.state = this.getAddressComponents(keyToFind, results[0].address_components);
          this.location.country = this.getAddressComponents("country", results[0].address_components);
          console.log("gen", this.location);
          this.showToast(this.location.name);
        }
      });
    }
  }

  selectPlace(place) {
    this.query = place.description;
    setTimeout(() => {
      console.log(this.query);
    }, 2000);
    this.places = [];
    let myLocation = new MyLocation();
    myLocation.name = place.name;
    this.placesService.getDetails({ placeId: place.place_id }, (details) => {
      this.zone.run(() => {
        this.onMapClick(new google.maps.LatLng(Number(details.geometry.location.lat()), Number(details.geometry.location.lng())));
        // myLocation.name = (details.formatted_address && details.formatted_address.length) ? details.formatted_address : details.name;
        // myLocation.lat = details.geometry.location.lat();
        // myLocation.lng = details.geometry.location.lng();
        // myLocation.postal_code = this.getAddressComponents("postal_code", details.address_components);
        // myLocation.locality = this.getAddressComponents("locality", details.address_components);
        // myLocation.state = this.getAddressComponents("administrative_area_level_1", details.address_components);
        // myLocation.country = this.getAddressComponents("country", details.address_components);
        // this.saveDisabled = false;
        // let lc = { lat: myLocation.lat, lng: myLocation.lng };
        // this.maps.map.setCenter(lc);
        // this.location = myLocation;
        // let pos = new google.maps.LatLng(Number(lc.lat), Number(lc.lng));
        // if (!this.marker)
        //   this.marker = new google.maps.Marker({ position: pos, map: this.maps.map });
        // else
        //   this.marker.setPosition(pos);
        // this.maps.map.panTo(pos);
      });
    });
  }

  getAddressComponents(what: string, addressComponents: Array<{ long_name: string, short_name: string, types: Array<string> }>): string {
    let toReturn = "";
    if (addressComponents && addressComponents.length) {
      for (let ac of addressComponents) {
        if (toReturn.length) break;
        if (ac.types && ac.types.length) {
          for (let t of ac.types) {
            if (t == what) {
              toReturn = ac.short_name;
              break;
            }
          }
        }
      }
    }
    return toReturn;
  }

  searchPlace() {
    this.saveDisabled = true;
    if (this.query.length > 0 && !this.searchDisabled) {
      let config = {
        //types: ['geocode'],
        input: this.query
      }
      this.autocompleteService.getPlacePredictions(config, (predictions, status) => {
        if (status == google.maps.places.PlacesServiceStatus.OK && predictions) {
          this.places = [];
          predictions.forEach((prediction) => {
            this.places.push(prediction);
          });
        }
      });
    } else {
      this.places = [];
    }
  }

  detect() {
    this.geolocation.getCurrentPosition().then((position) => {
      this.onMapClick(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
    }).catch((err) => {
      console.log("getCurrentPosition", err);
      this.showToast("Location detection failed");
    });
  }

  save() {
    if (this.location) {
      let addresses = JSON.parse(window.localStorage.getItem(Constants.SELECTED_ADDRESS_LIST));
      if (!addresses) addresses = new Array<Address>();
      if (!this.address) {
        this.address = new Address();
        this.address.id = -1;
        let user: UserResponse = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
        if (user != null) {
          this.address.first_name = user.first_name;
          //this.address.last_name = user.last_name;
          this.address.email = user.email;
          this.address.phone = user.username;
        }
      }

      this.address.address_1 = this.location.name;
      this.address.address_2 = this.location.lat + "," + this.location.lng;
      this.address.state = this.location.state;
      this.address.country = this.location.country;
      this.address.postcode = this.location.postal_code;
      window.localStorage.setItem(Constants.KEY_LOCATION, JSON.stringify(this.location));

      this.addressSaveModal = this.modalCtrl.create(Add_address_titlePage, { address: this.address });
      this.addressSaveModal.present();
      this.addressSaveModal.onDidDismiss(data => {
        this.modalPresented = false;
        if (data) {
          this.address = data;

          if (this.address.id == -1) {
            this.address.id = addresses.length + 1;
            addresses.push(this.address);
          } else {
            let index = -1;
            for (let i = 0; i < addresses.length; i++) {
              if (this.address.id == addresses[i].id) {
                index = i;
                break;
              }
            }
            if (index != -1) {
              addresses[index] = this.address;
            }
          }
          if (addresses.length == 1) window.localStorage.setItem(Constants.SELECTED_ADDRESS, JSON.stringify(this.address));
          window.localStorage.setItem(Constants.SELECTED_ADDRESS_LIST, JSON.stringify(addresses));
          this.events.publish('address:saved');
          this.close();
        }
      });
      this.modalPresented = true;
    } else {
      this.translate.get("select_location").subscribe(value => this.showToast(value));
    }
  }

  close() {
    console.log("saved", this.location);
    this.navCtrl.pop();
  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
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

}