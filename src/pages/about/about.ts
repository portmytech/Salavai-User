import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Category } from '../../models/category.models';
import { Constants } from '../../models/constants.models';
import { SelectclothesPage } from '../selectclothes/selectclothes';
import { Settings } from '../../models/setting.models';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  private categoriesAll: Array<Category>;
  private settings: Settings;

  constructor(public navCtrl: NavController) {
    this.settings = JSON.parse(window.localStorage.getItem(Constants.SETTINGS));
    this.categoriesAll = JSON.parse(window.localStorage.getItem(Constants.PRODUCT_CATEGORIES_PARENT));
  }

  selectclothes(value) {
    this.navCtrl.push(SelectclothesPage, { cat: value });
  }

}
