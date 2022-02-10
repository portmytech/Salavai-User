import { Component } from '@angular/core';
import { NavParams, NavController, AlertController, Loading, LoadingController, ToastController, Select } from 'ionic-angular';
import { OrderconfirmedPage } from '../orderconfirmed/orderconfirmed';
import { Category } from "../../models/category.models";
import { Product } from "../../models/product.models";
import { Constants } from "../../models/constants.models";
import { Currency } from "../../models/currency.models";
import { WordpressClient } from '../../providers/wordpress-client.service';
import { Global } from '../../providers/global';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';
import { Subscription } from "rxjs/Subscription";
import { CartItem } from '../../models/cart-item.models';
import { Image } from '../../models/image.models';
import { Variation } from '../../models/variation.models';

@Component({
  selector: 'page-selectclothes',
  templateUrl: 'selectclothes.html'
})
export class SelectclothesPage {
  private subscriptions: Array<Subscription> = [];
  private categoryParent: Category;
  private loading: Loading;
  private loadingShown: Boolean = false;
  private currencyIcon: string;
  private currencyText: string;
  private products = new Array<Array<Product>>();
  private productsPage: Array<number>;
  private cartItems = new Array<CartItem>();
  private selectedCategoryIdx: number = 0;
  private categoriesSub: Array<Category>;
  private pageCategoryRefreshed = 1;
  private categoriesRefreshed = new Array<Category>();
  private total_html: string;

  constructor(private translate: TranslateService, private loadingCtrl: LoadingController,
    private service: WordpressClient, private alertCtrl: AlertController, private navCtrl: NavController,
    private toastCtrl: ToastController, private global: Global, private navParams: NavParams) {
    let currency: Currency = JSON.parse(window.localStorage.getItem(Constants.CURRENCY));
    if (currency) {
      this.currencyText = currency.value;
      let iconText = currency.options[currency.value];
      this.currencyIcon = iconText.substring(iconText.lastIndexOf('(') + 1, iconText.length - 1);
    }
    this.categoryParent = this.navParams.get("cat");
    this.categoriesSub = JSON.parse(window.localStorage.getItem(Constants.PRODUCT_CATEGORIES + this.categoryParent.id));
    this.refreshSubCats();

    if (this.categoriesSub && this.categoriesSub.length) {
      this.productsPage = new Array<number>();
      for (let i = 0; i < this.categoriesSub.length; i++) {
        this.productsPage.push(1);
      }
      this.loadProducts(0);
    } else {
      this.translate.get('loading_categories').subscribe(value => {
        this.presentLoading(value);
      });
    }
  }

  ionViewDidEnter() {
    this.cartItems = this.global.getCartItems();
    if (this.products && this.products.length) {
      for (let pros of this.products) {
        if (pros && pros.length) {
          for (let pro of pros) {
            let variationsSelected = new Array<Variation>();
            for (let ci of this.cartItems) {
              if (ci.pro.id == pro.id) {
                variationsSelected.push(ci.vari);
              }
            }
            pro.variationsSelected = variationsSelected;
          }
        }
      }
    }
    this.calculateTotal();
  }

  calculateTotal() {
    let sum: number = 0;
    for (let item of this.cartItems) {
      item.vari.total_price = Number(item.vari.sale_price) * item.quantity;
      if (this.currencyIcon) {
        item.vari.total_price_html = this.currencyIcon + " " + item.vari.total_price.toFixed(2);
      } else if (this.currencyText) {
        item.vari.total_price_html = this.currencyText + " " + item.vari.total_price.toFixed(2);
      }
      sum = sum + item.vari.total_price;
    }
    sum = Number(sum.toFixed(2));
    if (this.currencyIcon) {
      this.total_html = this.currencyIcon + " " + sum.toFixed(2);
    } else if (this.currencyText) {
      this.total_html = this.currencyText + " " + sum.toFixed(2);
    }
  }

  refreshSubCats() {
    let subscription: Subscription = this.service.categoriesWithParentId(window.localStorage.getItem(Constants.ADMIN_API_KEY), this.categoryParent.id, String(this.pageCategoryRefreshed)).subscribe(data => {
      let categories: Array<Category> = data;
      if (categories.length == 0) {
        this.dismissLoading();
        window.localStorage.setItem(Constants.PRODUCT_CATEGORIES + this.categoryParent.id, JSON.stringify(this.categoriesRefreshed));
        console.log('sub categories refreshed');
        if (!this.categoriesRefreshed.length) {
          this.categoriesRefreshed.push(this.categoryParent);
        }
        if (!this.categoriesSub || !this.categoriesSub.length) {
          this.categoriesSub = this.categoriesRefreshed;
          this.productsPage = new Array<number>();
          for (let i = 0; i < this.categoriesSub.length; i++) {
            this.productsPage.push(1);
          }
          this.loadProducts(0);
        }
      } else {
        this.categoriesRefreshed = this.categoriesRefreshed.concat(categories);
        this.pageCategoryRefreshed++;
        this.refreshSubCats();
      }
    }, err => {
      this.dismissLoading();
      console.log('categories setup error', err);
    });
    this.subscriptions.push(subscription);
  }

  ionViewWillLeave() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.dismissLoading();
  }

  variationCompare(a: Variation, b: Variation) {
    return a.id === b.id;
  }

  variationChanged(pro: Product) {
    this.global.updateCartItem(pro);
    this.calculateTotal();
  }

  openVariations(index: number, pro: Product) {
    if (pro.variationsAvailable && pro.variationsAvailable.length) {
      setTimeout(() => {
        document.getElementById('mySelect' + index).click();
      }, 300);
    } else {
      this.translate.get('just_a_moment').subscribe(value => {
        this.presentLoading(value);
        this.subscriptions.push(this.service.productVariations(window.localStorage.getItem(Constants.ADMIN_API_KEY), pro.id).subscribe(data => {
          let variations: Array<Variation> = data;
          for (let vari of variations) {
            let variAttris = '';
            for (let i = 0; i < vari.attributes.length; i++) {
              let attri = vari.attributes[i].option + (i < vari.attributes.length - 1 ? ', ' : '');
              variAttris = variAttris + attri;
            }

            vari.name = variAttris;
            vari.images = new Array<Image>();
            vari.images.push(vari.image);

            if (!vari.sale_price) {
              vari.sale_price = vari.regular_price;
            }
            if (this.currencyIcon) {
              vari.regular_price_html = this.currencyIcon + " " + vari.regular_price;
              vari.sale_price_html = this.currencyIcon + " " + vari.sale_price;
            } else if (this.currencyText) {
              vari.regular_price_html = this.currencyText + " " + vari.regular_price;
              vari.sale_price_html = this.currencyText + " " + vari.sale_price;
            }
          }
          pro.variationsAvailable = variations;
          pro.variationsSelected = new Array<Variation>();
          for (let vari of pro.variationsAvailable) {
            for (let ci of this.cartItems) {
              if (vari.id == ci.vari.id) {
                pro.variationsSelected.push(vari);
                break;
              }
            }
          }
          pro.variationsAvailable = pro.variationsAvailable;
          pro.variationsSelected = pro.variationsSelected;
          this.dismissLoading();
          if (pro.variationsAvailable && pro.variationsAvailable.length) {
            setTimeout(() => {
              document.getElementById('mySelect' + index).click();
            }, 300);
          } else {
            this.translate.get('no_variation').subscribe(value => {
              this.showToast(value);
            });
          }
        }, err => {
          this.dismissLoading();
        }));
      });
    }
  }

  loadProducts(catIndex: number) {
    if (!this.products[catIndex] || !this.products[catIndex].length) {
      this.translate.get("just_a_moment").subscribe((res: string) => {
        this.presentLoading(res);
      });

      this.productsPage[catIndex] = 1;

      let subscription: Subscription = this.service.productsByCategory(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(this.categoriesSub[catIndex].id), String(this.productsPage[catIndex])).subscribe(data => {
        this.dismissLoading();
        let response: Array<Product> = data;
        let products = new Array<Product>();
        for (let pro of response) {
          //if (pro.type == 'grouped' || pro.type == 'external' || !pro.purchasable)
          if (pro.type == 'grouped' || pro.type == 'external')
            continue;
          if (!pro.sale_price) {
            pro.sale_price = pro.regular_price;
          }
          if (this.currencyIcon) {
            pro.regular_price_html = this.currencyIcon + " " + pro.regular_price;
            pro.sale_price_html = this.currencyIcon + " " + pro.sale_price;
          } else if (this.currencyText) {
            pro.regular_price_html = this.currencyText + " " + pro.regular_price;
            pro.sale_price_html = this.currencyText + " " + pro.sale_price;
          }
          pro.variationsSelected = new Array<Variation>();
          for (let ci of this.cartItems) {
            if (ci.pro.id == pro.id) {
              pro.variationsSelected.push(ci.vari);
              break;
            }
          }
          products.push(pro);
        }
        this.products[catIndex] = products;
      }, err => {
        console.log(err);
        this.dismissLoading();
      });
      this.subscriptions.push(subscription);
    }
  }

  doInfinite(infiniteScroll: any) {
    this.productsPage[this.selectedCategoryIdx]++;
    let page = this.productsPage[this.selectedCategoryIdx];
    let subscription: Subscription = this.service.productsByCategory(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(this.categoriesSub[this.selectedCategoryIdx].id), String(page)).subscribe(data => {
      let response: Array<Product> = data;
      if (!response || !response.length) {
        this.productsPage[this.selectedCategoryIdx]--;
      }
      for (let pro of response) {
        if (!pro.purchasable || pro.type == 'grouped' || pro.type == 'external')
          continue;
        if (!pro.sale_price) {
          pro.sale_price = pro.regular_price;
        }
        if (this.currencyIcon) {
          pro.regular_price_html = this.currencyIcon + " " + pro.regular_price;
          pro.sale_price_html = this.currencyIcon + " " + pro.sale_price;
        } else if (this.currencyText) {
          pro.regular_price_html = this.currencyText + " " + pro.regular_price;
          pro.sale_price_html = this.currencyText + " " + pro.sale_price;
        }
        pro.variationsSelected = new Array<Variation>();
        for (let ci of this.cartItems) {
          if (ci.pro.id == pro.id) {
            pro.variationsSelected.push(ci.vari);
            break;
          }
        }
        this.products[this.selectedCategoryIdx].push(pro);
      }
      infiniteScroll.complete();
    }, err => {
      this.productsPage[this.selectedCategoryIdx]--;
      infiniteScroll.complete();
      console.log(err);
    });
    this.subscriptions.push(subscription);
  }

  reviewOrder() {
    if (this.cartItems && this.cartItems.length) {
      this.navCtrl.push(OrderconfirmedPage, { review: true });
    } else {
      this.translate.get('empty_cart').subscribe(value => {
        this.showToast(value);
      });
    }
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

  private presentErrorAlert(msg: string) {
    this.translate.get(['error', 'dismiss']).subscribe(text => {
      let alert = this.alertCtrl.create({
        title: text['error'],
        subTitle: msg,
        buttons: [text['dismiss']]
      });
      alert.present();
    })
  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'top'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }
}
