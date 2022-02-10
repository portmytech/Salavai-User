import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-rate',
  templateUrl: 'rate.html'
})
export class RatePage {

  constructor(public navCtrl: NavController) {

  }
  
  tabs(){
   this.navCtrl.setRoot(TabsPage);
  }
}
