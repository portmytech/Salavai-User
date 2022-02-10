import { Component, ViewChild } from '@angular/core';
import { Tabs, Events, Platform } from 'ionic-angular';
import { AccountPage } from '../account/account';
import { OffersPage } from '../offers/offers';
import { HomePage } from '../home/home';
import { OrderconfirmedPage } from '../orderconfirmed/orderconfirmed';
import { Subscription } from 'rxjs/Subscription';
import { OneSignal } from '@ionic-native/onesignal';
import { WordpressClient } from '../../providers/wordpress-client.service';
import { UserResponse } from '../../models/user-response.models';
import { Constants } from '../../models/constants.models';
import { TimeSlot } from '../../models/time-slot.models';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('myTabs') tabRef: Tabs;
  tab1Root = HomePage;
  tab2Root = OrderconfirmedPage;
  tab3Root = OffersPage;
  tab4Root = AccountPage;
  private subscriptions: Array<Subscription> = [];

  constructor(oneSignal: OneSignal, platform: Platform, private service: WordpressClient, events: Events) {
    events.subscribe('tab:to', (to) => {
      this.tabRef.select(to);
    });
    if (platform.is('cordova')) {
      let userMe: UserResponse = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
      if (userMe) {
        oneSignal.getIds().then((id) => {
          if (id && id.userId) {
            let subscription: Subscription = service.registerForPushNotification(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(userMe.id), id.userId).subscribe(data => {
              console.log(data);
            }, err => {
              console.log(err);
            });
            this.subscriptions.push(subscription);
          }
        });
      }
    }
    this.refreshSettings();
    this.loadSlots();
  }

  ionViewWillLeave() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  refreshSettings() {
    let subscription: Subscription = this.service.settings().subscribe(data => {
      window.localStorage.setItem(Constants.SETTINGS, JSON.stringify(data));
      console.log('setting setup success');
    }, err => {
      console.log('setting setup error', err);
    });
    this.subscriptions.push(subscription);
  }

  loadSlots() {
    let subscription: Subscription = this.service.timeslots().subscribe(data => {
      let slots: Array<TimeSlot> = data;
      window.localStorage.setItem(Constants.TIME_SLOTS, JSON.stringify(slots));
      console.log('timeslot setup success');
    }, err => {
      console.log('timeslot setup error');
    });
    this.subscriptions.push(subscription);
  }

}
