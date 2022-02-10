import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Settings } from '../../models/setting.models';

@Component({
  selector: 'page-tnc',
  templateUrl: 'tnc.html'
})
export class TncPage {
  private settings: Settings;

  constructor(navParam: NavParams, public navCtrl: NavController) {
    this.settings = navParam.get("settings");
  }
}
