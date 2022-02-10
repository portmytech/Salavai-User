import { Component } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { Address } from '../../models/address.models';

@Component({
  selector: 'page-add_address_title',
  templateUrl: 'add_address_title.html'
})
export class Add_address_titlePage {
  private address: Address;

  constructor(navParam: NavParams, private viewCtrl: ViewController) {
    this.address = navParam.get("address");
    if (!this.address.type) this.address.type = 1;
  }

  cancel() {
    this.viewCtrl.dismiss(null);
  }

  save() {
    this.viewCtrl.dismiss(this.address);
  }
}
