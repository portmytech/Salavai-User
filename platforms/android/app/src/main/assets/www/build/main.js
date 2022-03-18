webpackJsonp([0],{

/***/ 125:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthCredential; });
var AuthCredential = /** @class */ (function () {
    function AuthCredential(username, password) {
        this.username = username;
        this.password = password;
    }
    return AuthCredential;
}());

//# sourceMappingURL=auth-credential.models.js.map

/***/ }),

/***/ 131:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyordersPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__node_modules_ngx_translate_core__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_wordpress_client_service__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__orderslip_orderslip__ = __webpack_require__(132);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__models_order_update_request_models__ = __webpack_require__(378);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var MyordersPage = /** @class */ (function () {
    function MyordersPage(navCtrl, toastCtrl, alertCtrl, loadingCtrl, translate, service) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.translate = translate;
        this.service = service;
        this.loadingShown = false;
        this.subscriptions = [];
        this.orders = new Array();
        this.pageNo = 1;
        this.currencyIcon = '';
        this.currencyText = '';
        this.isLoading = true;
        this.user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].USER_KEY));
        var currency = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].CURRENCY));
        if (currency) {
            this.currencyText = currency.value;
            var iconText = currency.options[currency.value];
            this.currencyIcon = iconText.substring(iconText.lastIndexOf('(') + 1, iconText.length - 1);
        }
        this.translate.get('loading_orders').subscribe(function (value) {
            _this.presentLoading(value);
            _this.loadMyOrders();
        });
    }
    MyordersPage.prototype.ionViewWillLeave = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        this.dismissLoading();
    };
    MyordersPage.prototype.loadMyOrders = function () {
        var _this = this;
        var subscription = this.service.myOrders(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(this.user.id), String(this.pageNo)).subscribe(function (data) {
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var order = data_1[_i];
                order.status_trans = _this.translate.instant(order.status);
            }
            _this.dismissLoading();
            _this.orders = data;
            _this.isLoading = false;
        }, function (err) {
            _this.isLoading = false;
            _this.dismissLoading();
        });
        this.subscriptions.push(subscription);
    };
    MyordersPage.prototype.cancelOrder = function (order) {
        var _this = this;
        this.translate.get('cancelling_orders').subscribe(function (value) {
            _this.presentLoading(value);
            _this.subscriptions.push(_this.service.updateOrder(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(order.id), new __WEBPACK_IMPORTED_MODULE_6__models_order_update_request_models__["a" /* OrderUpdateRequest */]('cancelled')).subscribe(function (data) {
                var orderRes = data;
                order.status = 'cancelled';
                /* for(let o of this.orders) {
                  console.log(String(o.id) == String(orderRes.id));
                  if(o.id == orderRes.id) {
                    o = orderRes;
                    console.log('here');
                    this.orders = this.orders;
                    break;
                  }
                } */
                _this.dismissLoading();
                // this.showToast('Order cancelled');
                _this.translate.get('order_cancelled').subscribe(function (value) {
                    _this.showToast(value);
                });
            }, function (err) {
                console.log(err);
            }));
        });
    };
    MyordersPage.prototype.doInfinite = function (infiniteScroll) {
        var _this = this;
        this.pageNo++;
        var subscription = this.service.myOrders(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(this.user.id), String(this.pageNo)).subscribe(function (data) {
            var orders = data;
            for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
                var order = data_2[_i];
                order.status_trans = _this.translate.instant(order.status);
            }
            infiniteScroll.complete();
            _this.isLoading = false;
        }, function (err) {
            infiniteScroll.complete();
            _this.isLoading = false;
            console.log(err);
        });
        this.subscriptions.push(subscription);
    };
    MyordersPage.prototype.orderDetail = function (value) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__orderslip_orderslip__["a" /* OrderslipPage */], { data: value });
    };
    MyordersPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    MyordersPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    MyordersPage.prototype.presentErrorAlert = function (msg) {
        var _this = this;
        this.translate.get(['error', 'dismiss']).subscribe(function (text) {
            var alert = _this.alertCtrl.create({
                title: text['error'],
                subTitle: msg,
                buttons: [text['dismiss']]
            });
            alert.present();
        });
    };
    MyordersPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 2000,
            position: 'top'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    MyordersPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-myorders',template:/*ion-inline-start:"D:\PTH\Laundry Shop\Salavai-User\src\pages\myorders\myorders.html"*/'<ion-header>\n	<ion-navbar>\n		<ion-title>{{"my_orders" | translate}}</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content class="bg-light">\n	<div class="empty-view animate__animated animate__zoomIn" style="--animate-duration: .3s;" *ngIf="!isLoading && (!orders || !orders.length)">\n		<div style="text-align:center">\n			<img src="assets/imgs/empty_cart.png" alt="no offers" />\n			<span style="color:#9E9E9E; font-weight:bold; display: block;">{{"empty_orders" | translate}}</span>\n		</div>\n	</div>\n	<ion-list no-lines>\n		<ion-item class="animate__animated animate__fadeInUp" *ngFor="let order of orders" (click)="orderDetail(order)">\n			<ion-avatar item-start [ngSwitch]="order.status">\n				<img src="assets/imgs/confirmed.png" *ngSwitchDefault>\n				<img src="assets/imgs/inporcess.png" *ngSwitchCase="\'processing\'">\n				<img src="assets/imgs/dispatched.png" *ngSwitchCase="\'pickedup\'">\n				<img src="assets/imgs/delivered.png" *ngSwitchCase="\'completed\'">\n			</ion-avatar>\n			<h2 class="d-flex">\n				<span>{{"order_n" | translate}}: {{order.id}}</span>\n				<small class="end" text-end [innerHTML]="order.total_html"></small>\n			</h2>\n			<p class="d-flex">\n				<span>{{order.status_trans}}</span>\n				<small class="end" text-end>{{order.date_created}}</small></p>\n		</ion-item>\n	</ion-list>\n	<ion-infinite-scroll (ionInfinite)="doInfinite($event)">\n		<ion-infinite-scroll-content></ion-infinite-scroll-content>\n	</ion-infinite-scroll>\n</ion-content>'/*ion-inline-end:"D:\PTH\Laundry Shop\Salavai-User\src\pages\myorders\myorders.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_2__node_modules_ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_3__providers_wordpress_client_service__["a" /* WordpressClient */]])
    ], MyordersPage);
    return MyordersPage;
}());

//# sourceMappingURL=myorders.js.map

/***/ }),

/***/ 132:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrderslipPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_helper_models__ = __webpack_require__(42);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var OrderslipPage = /** @class */ (function () {
    function OrderslipPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.orderProgress = 0;
        this.servicefee = 0;
        this.order = navParams.get('data');
        console.log(this.order);
        if (this.order.status.toLowerCase() == 'completed') {
            this.orderProgress = 3;
        }
        else if (this.order.status.toLowerCase() == 'processing') {
            this.orderProgress = 2;
        }
        else if (this.order.status.toLowerCase() == 'pending') {
            this.orderProgress = 1;
        }
        var hasServiceFee = false;
        var sf;
        if (this.order.fee_lines && this.order.fee_lines.length) {
            for (var _i = 0, _a = this.order.fee_lines; _i < _a.length; _i++) {
                var fl = _a[_i];
                if (fl.name.toLowerCase().includes("service")) {
                    hasServiceFee = true;
                    sf = fl.total;
                    break;
                }
            }
        }
        if (hasServiceFee) {
            var currency = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].CURRENCY));
            if (currency) {
                var currencyText = currency.value;
                var iconText = currency.options[currency.value];
                var currencyIcon = iconText.substring(iconText.lastIndexOf('(') + 1, iconText.length - 1);
                if (!sf)
                    sf = __WEBPACK_IMPORTED_MODULE_3__models_helper_models__["a" /* Helper */].getSetting("laundry_appconfig_servicefee");
                if (sf && sf.length) {
                    var servicefee = Number(Number(sf).toFixed(2));
                    if (currencyIcon) {
                        this.serviceHtml = currencyIcon + " " + servicefee;
                    }
                    else if (currencyText) {
                        this.serviceHtml = currencyText + " " + servicefee;
                    }
                }
            }
        }
    }
    OrderslipPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-orderslip',template:/*ion-inline-start:"D:\PTH\Laundry Shop\Salavai-User\src\pages\orderslip\orderslip.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>\n            <p class="header">{{"order_n" | translate}} {{order.id}}<small>{{order.date_created}}</small></p>\n        </ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="bg-light">\n    <div class="order-head animate__animated animate__fadeInUp">\n        <ion-row>\n            <ion-col style="max-width: 110px;" [ngSwitch]="order.status">\n                <img src="assets/imgs/confirmed.png" *ngSwitchDefault>\n                <img src="assets/imgs/inporcess.png" *ngSwitchCase="\'processing\'">\n                <img src="assets/imgs/dispatched.png" *ngSwitchCase="\'pickedup\'">\n                <img src="assets/imgs/delivered.png" *ngSwitchCase="\'completed\'">\n            </ion-col>\n            <ion-col>\n                <p>{{"order_status"|translate}}<strong>{{order.status_trans}}</strong></p>\n            </ion-col>\n        </ion-row>\n    </div>\n    \n    <div class="order-address animate__animated animate__fadeInUp">\n        <ion-row>\n            <ion-col col-6>\n                <p class="animate__animated animate__fadeInUp">{{"picked_time" | translate}}</p>\n                <h3 class="animate__animated animate__fadeInUp">{{order.time_pickup_formatted}}</h3>\n                <h4 class="animate__animated animate__fadeInUp">{{order.time_pickup_slot}}</h4>\n            </ion-col>\n            <ion-col col-6>\n                <p class="animate__animated animate__fadeInUp">{{"deliver_time" | translate}}</p>\n                <h3 class="animate__animated animate__fadeInUp">{{order.time_delivery_formatted}}</h3>\n                <h4 class="animate__animated animate__fadeInUp">{{order.time_delivery_slot}}</h4>\n            </ion-col>\n            <ion-col col-12>\n                <p class="animate__animated animate__fadeInUp">{{"deliver_nfo" | translate}}</p>\n                <h3 class="animate__animated animate__fadeInUp">{{order.shipping.address_1}}</h3>\n            </ion-col>\n        </ion-row>\n    </div>\n\n\n    <div class="all-orders animate__animated animate__fadeInUp">\n        <p class="order-header">{{"order_items" | translate}}</p>\n        <div>\n            <ion-label class="animate__animated animate__fadeInUp" *ngFor="let line of order.line_items">\n                <span class="items">{{line.quantity}}</span>\n                <span class="cross">x</span>\n                <span class="name" [innerHTML]="line.name"></span>\n                <span class="amount" [innerHTML]="line.total_html"></span>\n            </ion-label>\n        </div>\n    </div>\n</ion-content>\n\n<ion-footer no-border class="animate__animated animate__fadeInUp" style="--animate-duration: .4s;">\n    <div class="price-section">\n        <ion-label class="animate__animated animate__fadeInUp" *ngIf="order.discount_total_html && order.discount_total_html.length" class="total-amount-black d-flex">\n            {{"discount" | translate}}\n            <span [innerHTML]="order.discount_total_html" class="end"></span>\n        </ion-label>\n        <ion-label class="animate__animated animate__fadeInUp" *ngIf="serviceHtml && serviceHtml.length" class="total-amount-black d-flex">\n            {{"service_fee" | translate}}\n            <span [innerHTML]="serviceHtml" class="end"></span>\n        </ion-label>\n        <ion-label class="animate__animated animate__fadeInUp" *ngIf="order.shipping_total_html && order.shipping_total_html.length" class="total-amount-black d-flex">\n            {{"shipping_fee" | translate}}\n            <span [innerHTML]="order.shipping_total_html" class="end"></span>\n        </ion-label>\n        <ion-label class="total-amount d-flex animate__animated animate__fadeInUp">\n            {{"total_amount" | translate}}\n            <span [innerHTML]="order.total_html" class="end"></span>\n        </ion-label>\n    </div>\n</ion-footer>'/*ion-inline-end:"D:\PTH\Laundry Shop\Salavai-User\src\pages\orderslip\orderslip.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavParams */]])
    ], OrderslipPage);
    return OrderslipPage;
}());

//# sourceMappingURL=orderslip.js.map

/***/ }),

/***/ 133:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SelectclothesPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__orderconfirmed_orderconfirmed__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_wordpress_client_service__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_global__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__node_modules_ngx_translate_core__ = __webpack_require__(11);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var SelectclothesPage = /** @class */ (function () {
    function SelectclothesPage(translate, loadingCtrl, service, alertCtrl, navCtrl, toastCtrl, global, navParams) {
        var _this = this;
        this.translate = translate;
        this.loadingCtrl = loadingCtrl;
        this.service = service;
        this.alertCtrl = alertCtrl;
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.global = global;
        this.navParams = navParams;
        this.subscriptions = [];
        this.loadingShown = false;
        this.products = new Array();
        this.cartItems = new Array();
        this.selectedCategoryIdx = 0;
        this.pageCategoryRefreshed = 1;
        this.categoriesRefreshed = new Array();
        var currency = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].CURRENCY));
        if (currency) {
            this.currencyText = currency.value;
            var iconText = currency.options[currency.value];
            this.currencyIcon = iconText.substring(iconText.lastIndexOf('(') + 1, iconText.length - 1);
        }
        this.categoryParent = this.navParams.get("cat");
        this.categoriesSub = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].PRODUCT_CATEGORIES + this.categoryParent.id));
        this.refreshSubCats();
        if (this.categoriesSub && this.categoriesSub.length) {
            this.productsPage = new Array();
            for (var i = 0; i < this.categoriesSub.length; i++) {
                this.productsPage.push(1);
            }
            this.loadProducts(0);
        }
        else {
            this.translate.get('loading_categories').subscribe(function (value) {
                _this.presentLoading(value);
            });
        }
    }
    SelectclothesPage.prototype.ionViewDidEnter = function () {
        this.cartItems = this.global.getCartItems();
        if (this.products && this.products.length) {
            for (var _i = 0, _a = this.products; _i < _a.length; _i++) {
                var pros = _a[_i];
                if (pros && pros.length) {
                    for (var _b = 0, pros_1 = pros; _b < pros_1.length; _b++) {
                        var pro = pros_1[_b];
                        var variationsSelected = new Array();
                        for (var _c = 0, _d = this.cartItems; _c < _d.length; _c++) {
                            var ci = _d[_c];
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
    };
    SelectclothesPage.prototype.calculateTotal = function () {
        var sum = 0;
        for (var _i = 0, _a = this.cartItems; _i < _a.length; _i++) {
            var item = _a[_i];
            item.vari.total_price = Number(item.vari.sale_price) * item.quantity;
            if (this.currencyIcon) {
                item.vari.total_price_html = this.currencyIcon + " " + item.vari.total_price.toFixed(2);
            }
            else if (this.currencyText) {
                item.vari.total_price_html = this.currencyText + " " + item.vari.total_price.toFixed(2);
            }
            sum = sum + item.vari.total_price;
        }
        sum = Number(sum.toFixed(2));
        if (this.currencyIcon) {
            this.total_html = this.currencyIcon + " " + sum.toFixed(2);
        }
        else if (this.currencyText) {
            this.total_html = this.currencyText + " " + sum.toFixed(2);
        }
    };
    SelectclothesPage.prototype.refreshSubCats = function () {
        var _this = this;
        var subscription = this.service.categoriesWithParentId(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), this.categoryParent.id, String(this.pageCategoryRefreshed)).subscribe(function (data) {
            var categories = data;
            if (categories.length == 0) {
                _this.dismissLoading();
                window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].PRODUCT_CATEGORIES + _this.categoryParent.id, JSON.stringify(_this.categoriesRefreshed));
                console.log('sub categories refreshed');
                if (!_this.categoriesRefreshed.length) {
                    _this.categoriesRefreshed.push(_this.categoryParent);
                }
                if (!_this.categoriesSub || !_this.categoriesSub.length) {
                    _this.categoriesSub = _this.categoriesRefreshed;
                    _this.productsPage = new Array();
                    for (var i = 0; i < _this.categoriesSub.length; i++) {
                        _this.productsPage.push(1);
                    }
                    _this.loadProducts(0);
                }
            }
            else {
                _this.categoriesRefreshed = _this.categoriesRefreshed.concat(categories);
                _this.pageCategoryRefreshed++;
                _this.refreshSubCats();
            }
        }, function (err) {
            _this.dismissLoading();
            console.log('categories setup error', err);
        });
        this.subscriptions.push(subscription);
    };
    SelectclothesPage.prototype.ionViewWillLeave = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        this.dismissLoading();
    };
    SelectclothesPage.prototype.variationCompare = function (a, b) {
        return a.id === b.id;
    };
    SelectclothesPage.prototype.variationChanged = function (pro) {
        this.global.updateCartItem(pro);
        this.calculateTotal();
    };
    SelectclothesPage.prototype.openVariations = function (index, pro) {
        var _this = this;
        if (pro.variationsAvailable && pro.variationsAvailable.length) {
            setTimeout(function () {
                document.getElementById('mySelect' + index).click();
            }, 300);
        }
        else {
            this.translate.get('just_a_moment').subscribe(function (value) {
                _this.presentLoading(value);
                _this.subscriptions.push(_this.service.productVariations(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), pro.id).subscribe(function (data) {
                    var variations = data;
                    for (var _i = 0, variations_1 = variations; _i < variations_1.length; _i++) {
                        var vari = variations_1[_i];
                        var variAttris = '';
                        for (var i = 0; i < vari.attributes.length; i++) {
                            var attri = vari.attributes[i].option + (i < vari.attributes.length - 1 ? ', ' : '');
                            variAttris = variAttris + attri;
                        }
                        vari.name = variAttris;
                        vari.images = new Array();
                        vari.images.push(vari.image);
                        if (!vari.sale_price) {
                            vari.sale_price = vari.regular_price;
                        }
                        if (_this.currencyIcon) {
                            vari.regular_price_html = _this.currencyIcon + " " + vari.regular_price;
                            vari.sale_price_html = _this.currencyIcon + " " + vari.sale_price;
                        }
                        else if (_this.currencyText) {
                            vari.regular_price_html = _this.currencyText + " " + vari.regular_price;
                            vari.sale_price_html = _this.currencyText + " " + vari.sale_price;
                        }
                    }
                    pro.variationsAvailable = variations;
                    pro.variationsSelected = new Array();
                    for (var _a = 0, _b = pro.variationsAvailable; _a < _b.length; _a++) {
                        var vari = _b[_a];
                        for (var _c = 0, _d = _this.cartItems; _c < _d.length; _c++) {
                            var ci = _d[_c];
                            if (vari.id == ci.vari.id) {
                                pro.variationsSelected.push(vari);
                                break;
                            }
                        }
                    }
                    pro.variationsAvailable = pro.variationsAvailable;
                    pro.variationsSelected = pro.variationsSelected;
                    _this.dismissLoading();
                    if (pro.variationsAvailable && pro.variationsAvailable.length) {
                        setTimeout(function () {
                            document.getElementById('mySelect' + index).click();
                        }, 300);
                    }
                    else {
                        _this.translate.get('no_variation').subscribe(function (value) {
                            _this.showToast(value);
                        });
                    }
                }, function (err) {
                    _this.dismissLoading();
                }));
            });
        }
    };
    SelectclothesPage.prototype.loadProducts = function (catIndex) {
        var _this = this;
        if (!this.products[catIndex] || !this.products[catIndex].length) {
            this.translate.get("just_a_moment").subscribe(function (res) {
                _this.presentLoading(res);
            });
            this.productsPage[catIndex] = 1;
            var subscription = this.service.productsByCategory(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(this.categoriesSub[catIndex].id), String(this.productsPage[catIndex])).subscribe(function (data) {
                _this.dismissLoading();
                var response = data;
                var products = new Array();
                for (var _i = 0, response_1 = response; _i < response_1.length; _i++) {
                    var pro = response_1[_i];
                    //if (pro.type == 'grouped' || pro.type == 'external' || !pro.purchasable)
                    if (pro.type == 'grouped' || pro.type == 'external')
                        continue;
                    if (!pro.sale_price) {
                        pro.sale_price = pro.regular_price;
                    }
                    if (_this.currencyIcon) {
                        pro.regular_price_html = _this.currencyIcon + " " + pro.regular_price;
                        pro.sale_price_html = _this.currencyIcon + " " + pro.sale_price;
                    }
                    else if (_this.currencyText) {
                        pro.regular_price_html = _this.currencyText + " " + pro.regular_price;
                        pro.sale_price_html = _this.currencyText + " " + pro.sale_price;
                    }
                    pro.variationsSelected = new Array();
                    for (var _a = 0, _b = _this.cartItems; _a < _b.length; _a++) {
                        var ci = _b[_a];
                        if (ci.pro.id == pro.id) {
                            pro.variationsSelected.push(ci.vari);
                            break;
                        }
                    }
                    products.push(pro);
                }
                _this.products[catIndex] = products;
            }, function (err) {
                console.log(err);
                _this.dismissLoading();
            });
            this.subscriptions.push(subscription);
        }
    };
    SelectclothesPage.prototype.doInfinite = function (infiniteScroll) {
        var _this = this;
        this.productsPage[this.selectedCategoryIdx]++;
        var page = this.productsPage[this.selectedCategoryIdx];
        var subscription = this.service.productsByCategory(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(this.categoriesSub[this.selectedCategoryIdx].id), String(page)).subscribe(function (data) {
            var response = data;
            if (!response || !response.length) {
                _this.productsPage[_this.selectedCategoryIdx]--;
            }
            for (var _i = 0, response_2 = response; _i < response_2.length; _i++) {
                var pro = response_2[_i];
                if (!pro.purchasable || pro.type == 'grouped' || pro.type == 'external')
                    continue;
                if (!pro.sale_price) {
                    pro.sale_price = pro.regular_price;
                }
                if (_this.currencyIcon) {
                    pro.regular_price_html = _this.currencyIcon + " " + pro.regular_price;
                    pro.sale_price_html = _this.currencyIcon + " " + pro.sale_price;
                }
                else if (_this.currencyText) {
                    pro.regular_price_html = _this.currencyText + " " + pro.regular_price;
                    pro.sale_price_html = _this.currencyText + " " + pro.sale_price;
                }
                pro.variationsSelected = new Array();
                for (var _a = 0, _b = _this.cartItems; _a < _b.length; _a++) {
                    var ci = _b[_a];
                    if (ci.pro.id == pro.id) {
                        pro.variationsSelected.push(ci.vari);
                        break;
                    }
                }
                _this.products[_this.selectedCategoryIdx].push(pro);
            }
            infiniteScroll.complete();
        }, function (err) {
            _this.productsPage[_this.selectedCategoryIdx]--;
            infiniteScroll.complete();
            console.log(err);
        });
        this.subscriptions.push(subscription);
    };
    SelectclothesPage.prototype.reviewOrder = function () {
        var _this = this;
        if (this.cartItems && this.cartItems.length) {
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__orderconfirmed_orderconfirmed__["a" /* OrderconfirmedPage */], { review: true });
        }
        else {
            this.translate.get('empty_cart').subscribe(function (value) {
                _this.showToast(value);
            });
        }
    };
    SelectclothesPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    SelectclothesPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    SelectclothesPage.prototype.presentErrorAlert = function (msg) {
        var _this = this;
        this.translate.get(['error', 'dismiss']).subscribe(function (text) {
            var alert = _this.alertCtrl.create({
                title: text['error'],
                subTitle: msg,
                buttons: [text['dismiss']]
            });
            alert.present();
        });
    };
    SelectclothesPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 2000,
            position: 'top'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    SelectclothesPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-selectclothes',template:/*ion-inline-start:"D:\PTH\Laundry Shop\Salavai-User\src\pages\selectclothes\selectclothes.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{"select_clothes" | translate}}</ion-title>\n    </ion-navbar>\n    <ion-segment *ngIf="categoriesSub && categoriesSub.length" class="bg-green animate__animated animate__fadeInDown" style="--animate-duration: .3s;" [(ngModel)]="selectedCategoryIdx">\n        <ion-segment-button *ngFor="let cat of categoriesSub; let i = index" [value]="i" [innerHTML]="cat.name" (click)="loadProducts(i)"></ion-segment-button>\n    </ion-segment>\n</ion-header>\n\n<ion-content class="bg-light">\n    <div class="empty-view animate__animated animate__zoomIn" style="--animate-duration: .2s;" *ngIf="!loadingShown && (!products[selectedCategoryIdx] || !products[selectedCategoryIdx].length)">\n        <div style="text-align:center">\n            <img src="assets/imgs/empty_cart.png" alt="no offers" />\n            <span style="color:#9E9E9E; font-weight:bold; display: block;">{{"empty_products" | translate}}</span>\n        </div>\n    </div>\n    <div *ngIf="products[selectedCategoryIdx] && products[selectedCategoryIdx].length" style="margin-top: 8px;" class="cloth-list">\n        <ion-list no-lines>\n            <ion-item class="animate__animated animate__fadeInUp" *ngFor="let product of products[selectedCategoryIdx]; let i = index;">\n                <ion-avatar item-start>\n                    <img src="assets/imgs/t-shirt.jpg" *ngIf="!(product.images && product.images.length && product.images[0].src)">\n                    <img [src]="product.images[0].src" *ngIf="product.images && product.images.length && product.images[0].src">\n                </ion-avatar>\n                <ion-label>\n                    <h3>{{product.name}}</h3>\n                </ion-label>\n                <ion-select [id]="\'mySelect\'+i" [(ngModel)]="product.variationsSelected" [compareWith]="variationCompare" class="select-wash" cancelText="{{\'cancel\' | translate}}" okText="{{\'okay\' | translate}}" multiple="true" (ionChange)="variationChanged(product)">\n                    <ion-option *ngFor="let vari of product.variationsAvailable; let i = index" [value]="vari">\n                        {{vari.name}}\n                        <span [innerHTML]="vari.sale_price_html"></span>\n                    </ion-option>\n                </ion-select>\n                <ion-note class="modify_cart" *ngIf="product.variationsSelected && product.variationsSelected.length" item-end (click)="openVariations(i, product)">\n                    {{"modify_cart" | translate}}\n                </ion-note>\n                <ion-note *ngIf="!product.variationsSelected || !product.variationsSelected.length" item-end (click)="openVariations(i, product)">\n                    {{"add_cart" | translate}}\n                </ion-note>\n            </ion-item>\n        </ion-list>\n        <ion-infinite-scroll (ionInfinite)="doInfinite($event)">\n            <ion-infinite-scroll-content></ion-infinite-scroll-content>\n        </ion-infinite-scroll>\n    </div>\n</ion-content>\n\n<ion-footer class="animate__animated animate__fadeInUp" style="--animate-duration: .4s;">\n    <ion-toolbar>\n        <div class="fixed-bootom" (click)="reviewOrder()">\n            <ion-row>\n                <ion-col col-4 class="cost">{{"total" | translate}} <span [innerHTML]="total_html"></span> </ion-col>\n                <ion-col col-4 class="small " text-center>{{cartItems.length}} {{"items" | translate}}</ion-col>\n                <ion-col col-4 class="next" text-end>{{"next" | translate}}\n                    <ion-icon name="ios-arrow-forward-outline"></ion-icon>\n                </ion-col>\n            </ion-row>\n        </div>\n    </ion-toolbar>\n</ion-footer>'/*ion-inline-end:"D:\PTH\Laundry Shop\Salavai-User\src\pages\selectclothes\selectclothes.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_6__node_modules_ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_4__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */], __WEBPACK_IMPORTED_MODULE_5__providers_global__["a" /* Global */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavParams */]])
    ], SelectclothesPage);
    return SelectclothesPage;
}());

//# sourceMappingURL=selectclothes.js.map

/***/ }),

/***/ 134:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__selectclothes_selectclothes__ = __webpack_require__(133);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__myorders_myorders__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__orderslip_orderslip__ = __webpack_require__(132);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__login_login__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__app_app_config__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__node_modules_ngx_translate_core__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__providers_wordpress_client_service__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__orderconfirmed_orderconfirmed__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ionic_native_in_app_browser__ = __webpack_require__(71);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};












var HomePage = /** @class */ (function () {
    function HomePage(config, toastCtrl, alertCtrl, loadingCtrl, translate, events, service, modalCtrl, navCtrl, menu, inAppBrowser) {
        var _this = this;
        this.config = config;
        this.toastCtrl = toastCtrl;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.translate = translate;
        this.events = events;
        this.service = service;
        this.modalCtrl = modalCtrl;
        this.navCtrl = navCtrl;
        this.menu = menu;
        this.inAppBrowser = inAppBrowser;
        this.loadingShown = false;
        this.subscriptions = [];
        this.orders = new Array();
        this.pageNo = 1;
        this.currencyIcon = '';
        this.currencyText = '';
        this.banners = new Array();
        this.categoriesAll = new Array();
        this.appTitle = config.appName;
        events.subscribe('category:setup', function () {
            _this.setupCategories();
        });
        var currency = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_6__models_constants_models__["a" /* Constants */].CURRENCY));
        if (currency) {
            this.currencyText = currency.value;
            var iconText = currency.options[currency.value];
            this.currencyIcon = iconText.substring(iconText.lastIndexOf('(') + 1, iconText.length - 1);
        }
        this.setupCategories();
        this.loadBanners();
        var toOpen = window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_6__models_constants_models__["a" /* Constants */].TEMP_OPEN);
        var user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_6__models_constants_models__["a" /* Constants */].USER_KEY));
        if (user && toOpen && toOpen.length) {
            if (toOpen == __WEBPACK_IMPORTED_MODULE_6__models_constants_models__["a" /* Constants */].TEMP_OPEN_CART) {
                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_10__orderconfirmed_orderconfirmed__["a" /* OrderconfirmedPage */]);
            }
            window.localStorage.removeItem(__WEBPACK_IMPORTED_MODULE_6__models_constants_models__["a" /* Constants */].TEMP_OPEN);
            window.localStorage.removeItem(__WEBPACK_IMPORTED_MODULE_6__models_constants_models__["a" /* Constants */].TEMP_OPEN_CART);
        }
    }
    HomePage.prototype.ionViewWillLeave = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        this.dismissLoading();
    };
    HomePage.prototype.ionViewDidLoad = function () {
        this.user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_6__models_constants_models__["a" /* Constants */].USER_KEY));
        if (this.user) {
            this.loadMyOrders();
        }
    };
    HomePage.prototype.loadBanners = function () {
        var _this = this;
        var savedBanners = JSON.parse(window.localStorage.getItem('banners'));
        if (savedBanners && savedBanners.length) {
            this.banners = savedBanners;
        }
        this.subscriptions.push(this.service.banners(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_6__models_constants_models__["a" /* Constants */].ADMIN_API_KEY)).subscribe(function (data) {
            _this.banners = data;
            window.localStorage.setItem('banners', JSON.stringify(_this.banners));
        }, function (err) {
            console.log(err);
        }));
    };
    HomePage.prototype.setupCategories = function () {
        var categories = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_6__models_constants_models__["a" /* Constants */].PRODUCT_CATEGORIES_PARENT));
        this.categoriesAll = categories;
    };
    HomePage.prototype.loadMyOrders = function () {
        var _this = this;
        this.ordersLoading = true;
        var subscription = this.service.myOrders(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_6__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(this.user.id), String(this.pageNo)).subscribe(function (data) {
            _this.ordersLoading = false;
            var newOrder = new Array();
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var order = data_1[_i];
                if (order.status == 'completed' || order.status == 'refunded' || order.status == 'failed' || order.status == 'cancelled') {
                    continue;
                }
                order.status_trans = _this.translate.instant(order.status);
                newOrder.push(order);
            }
            _this.dismissLoading();
            _this.orders = newOrder;
        }, function (err) {
            _this.ordersLoading = false;
            _this.dismissLoading();
        });
        this.subscriptions.push(subscription);
    };
    HomePage.prototype.selectclothes = function (value) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__selectclothes_selectclothes__["a" /* SelectclothesPage */], { cat: value });
    };
    HomePage.prototype.orderDetail = function (value) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__orderslip_orderslip__["a" /* OrderslipPage */], { data: value });
    };
    HomePage.prototype.myOrders = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__myorders_myorders__["a" /* MyordersPage */]);
    };
    HomePage.prototype.login = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__login_login__["a" /* LoginPage */]);
    };
    HomePage.prototype.order = function () {
        var _this = this;
        this.translate.get('select_service').subscribe(function (value) { return _this.showToast(value); });
    };
    HomePage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    HomePage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    HomePage.prototype.presentErrorAlert = function (msg) {
        var _this = this;
        this.translate.get(['error', 'dismiss'])
            .subscribe(function (text) {
            var alert = _this.alertCtrl.create({
                title: text['error'],
                subTitle: msg,
                buttons: [text['dismiss']]
            });
            alert.present();
        });
    };
    HomePage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 2000,
            position: 'top'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    HomePage.prototype.offers = function () {
        this.events.publish('tab:to', 2);
    };
    HomePage.prototype.buyThisApp = function () {
        var _this = this;
        this.translate.get('opening_WhatsApp').subscribe(function (text) {
            _this.presentLoading(text);
            _this.service.getWhatsappDetails().subscribe(function (res) {
                _this.dismissLoading();
                return _this.inAppBrowser.create(res['link'], '_system');
            }, function (err) {
                console.log("Error rating:", JSON.stringify(err));
                _this.dismissLoading();
            });
        });
    };
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"D:\PTH\Laundry Shop\Salavai-User\src\pages\home\home.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>\n            {{config.appName}}\n        </ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="bg-light">\n    <ion-slides *ngIf="banners && banners.length" pager autoplay="2000" loop="true" dir="ltr" (click)="offers()">\n        <ion-slide *ngFor="let slide of banners">\n            <img [src]="slide.img_src" class="slide-image" />\n        </ion-slide>\n    </ion-slides>\n\n    <p padding-left padding-right class="heading animate__animated animate__fadeInUp">{{"services" | translate}}</p>\n    <ion-scroll scrollX style="height:185px;white-space: nowrap;">\n        <div class="scroll-item animate__animated animate__zoomIn" *ngFor="let cat of categoriesAll" (click)="selectclothes(cat)">\n            <div class="item-box">\n                <div class="img_box center_img">\n                    <img *ngIf="cat.image != null" data-src="{{cat.image.src}}" class="crop_img">\n                    <img *ngIf="cat.image == null" src="assets/imgs/logo.png" class="crop_img">\n                </div>\n                <h5 [innerHTML]="cat.name"></h5>\n                <p [innerHTML]="cat.description"></p>\n            </div>\n        </div>\n    </ion-scroll>\n\n    <p *ngIf="!ordersLoading && !orders.length" padding-left padding-right class="heading animate__animated animate__fadeInUp" style="--animate-duration: .3s !important;">\n        {{"no_active_order" | translate}}\n    </p>\n    <p *ngIf="!ordersLoading && orders.length" padding-left padding-right class="heading animate__animated animate__fadeInUp">\n        {{"ur_active_order" | translate}} ({{orders.length}})<span (click)="myOrders()">\n            {{"all_orders"| translate}}\n        </span>\n    </p> \n\n    <div *ngIf="orders && orders.length" padding-left padding-right class="order-list">\n        <ion-list no-lines>\n            <ion-item class="animate__animated animate__fadeInUp" *ngFor="let order of orders" (click)="orderDetail(order)">\n                <ion-avatar [ngSwitch]="order.status" item-start>\n                    <img src="assets/imgs/confirmed.png" *ngSwitchDefault>\n                    <img src="assets/imgs/inporcess.png" *ngSwitchCase="\'processing\'">\n                    <img src="assets/imgs/dispatched.png" *ngSwitchCase="\'pickedup\'">\n                    <img src="assets/imgs/delivered.png" *ngSwitchCase="\'completed\'">\n                </ion-avatar>\n                <h2>{{"order_n" | translate}}: {{order.id}}</h2>\n                <p>{{order.status_trans}}</p>\n                <ion-note item-end>\n                    <p [innerHTML]="order.total_html"></p>\n                    <small>{{order.date_created}}</small>\n                </ion-note>\n            </ion-item>\n        </ion-list>\n    </div>\n\n    <div class="placeholder animate__animated animate__zoomIn" style="--animate-duration: .3s !important;" margin *ngIf="!user && !ordersLoading" (click)="login()">\n        <div class="icon-box">\n            <div class="box">\n                <ion-icon name="md-person-add"></ion-icon>\n            </div>\n        </div>\n        <div class="text-box">\n            <h3>\n                <span>{{"login_to_view_order" | translate}}</span>\n                <span></span>\n            </h3>\n        </div>\n    </div>\n    <div class="placeholder animate__animated animate__zoomIn" style="--animate-duration: .3s !important;" margin *ngIf="user && !ordersLoading && !orders.length" (click)="order()">\n        <div class="icon-box">\n            <div class="box">\n                <ion-icon name="md-add"></ion-icon>\n            </div>\n        </div>\n        <div class="text-box">\n            <h3>\n                <span>{{"empty_orders" | translate}}</span>\n                <span class="link">{{"order_now" | translate}}</span>\n            </h3>\n        </div>\n    </div>\n</ion-content>\n<div *ngIf="config.demoMode" class="buy-this-app-class animate__animated animate__zoomIn" style="--animate-duration: .3s !important;">\n    <button ion-button class="button-size" (click)="buyThisApp()" round>\n        <ion-icon name="md-cart" class="text-white"></ion-icon> &nbsp;\n        {{\'buy_this_app\' | translate}}\n    </button>\n</div>'/*ion-inline-end:"D:\PTH\Laundry Shop\Salavai-User\src\pages\home\home.html"*/
        }),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_7__app_app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_8__node_modules_ngx_translate_core__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */], __WEBPACK_IMPORTED_MODULE_9__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* MenuController */], __WEBPACK_IMPORTED_MODULE_11__ionic_native_in_app_browser__["a" /* InAppBrowser */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 135:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyaddressPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ngx_translate_core__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_wordpress_client_service__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__selectarea_selectarea__ = __webpack_require__(387);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__selectdate_selectdate__ = __webpack_require__(136);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__selectshipping_selectshipping__ = __webpack_require__(394);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var MyaddressPage = /** @class */ (function () {
    function MyaddressPage(translate, navParams, navCtrl, toastCtrl, service, loadingCtrl, alertCtrl) {
        this.translate = translate;
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.service = service;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.addresses = new Array();
        this.loadingShown = false;
        this.subscriptions = [];
        this.currencyIcon = '';
        this.currencyText = '';
        this.select = (navParams.get('action') != null);
        var currency = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].CURRENCY));
        if (currency) {
            this.currencyText = currency.value;
            var iconText = currency.options[currency.value];
            this.currencyIcon = iconText.substring(iconText.lastIndexOf('(') + 1, iconText.length - 1);
        }
    }
    MyaddressPage.prototype.ionViewDidEnter = function () {
        var addresses = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].SELECTED_ADDRESS_LIST));
        if (addresses != null) {
            for (var _i = 0, addresses_1 = addresses; _i < addresses_1.length; _i++) {
                var ad = addresses_1[_i];
                if (!ad.type)
                    ad.type = 1;
            }
            this.addresses = addresses;
        }
    };
    MyaddressPage.prototype.addressNew = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__selectarea_selectarea__["a" /* SelectareaPage */]);
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
    };
    MyaddressPage.prototype.alertLocationServices = function () {
        var _this = this;
        this.translate.get(['location_services_title', 'location_services_message', 'okay']).subscribe(function (text) {
            var alert = _this.alertCtrl.create({
                title: text['location_services_title'],
                subTitle: text['location_services_message'],
                buttons: [{
                        text: text['okay'],
                        role: 'cancel',
                        handler: function () {
                            console.log('okay clicked');
                        }
                    }]
            });
            alert.present();
        });
    };
    MyaddressPage.prototype.onAddressChangeHandler = function (event) {
        var _this = this;
        setTimeout(function () {
            for (var _i = 0, _a = _this.addresses; _i < _a.length; _i++) {
                var ad = _a[_i];
                if (ad.id == event) {
                    _this.addressEditSelect(ad);
                    break;
                }
            }
        }, 100);
    };
    MyaddressPage.prototype.addressEditSelect = function (address) {
        var _this = this;
        if (this.select) {
            var user_1 = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].USER_KEY));
            user_1.billing = address;
            user_1.shipping = address;
            user_1.first_name = address.first_name;
            //user.last_name = address.last_name;
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].USER_KEY, JSON.stringify(user_1));
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].SELECTED_ADDRESS, JSON.stringify(address));
            this.translate.get('just_a_moment').subscribe(function (value) {
                _this.presentLoading(value);
                _this.subscriptions.push(_this.service.updateUser(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(user_1.id), user_1).subscribe(function (data) {
                    _this.dismissLoading();
                    _this.addressSelected(address);
                }, function (err) {
                    console.log(err);
                    _this.dismissLoading();
                    _this.addressSelected(address);
                }));
            });
        }
        else {
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__selectarea_selectarea__["a" /* SelectareaPage */], { address: address });
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
    };
    MyaddressPage.prototype.addressSelected = function (address) {
        var _this = this;
        var shippingZoneLocation = this.matchZone(address);
        console.log('szl match', shippingZoneLocation);
        if (shippingZoneLocation) {
            this.translate.get('fetch_shipping_methods').subscribe(function (value) {
                _this.presentLoading(value);
                _this.subscriptions.push(_this.service.shippingZoneMethods(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(shippingZoneLocation.zoneId)).subscribe(function (data) {
                    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                        var d = data_1[_i];
                        d.costToShow = _this.currencyIcon + ' ' + d.cost;
                    }
                    _this.dismissLoading();
                    _this.navCtrl.push(data && data.length ? __WEBPACK_IMPORTED_MODULE_7__selectshipping_selectshipping__["a" /* SelectShippingPage */] : __WEBPACK_IMPORTED_MODULE_6__selectdate_selectdate__["a" /* SelectdatePage */], { shipping_methods: data });
                }, function (err) {
                    _this.dismissLoading();
                    console.log('ErrShippingZoneLocation', err);
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__selectdate_selectdate__["a" /* SelectdatePage */]);
                }));
            });
        }
        else {
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__selectdate_selectdate__["a" /* SelectdatePage */]);
        }
    };
    MyaddressPage.prototype.matchZone = function (address) {
        var matched;
        var shippingZoneLocations = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].SHIPPING_ZONE_LOCATIONS));
        if (shippingZoneLocations) {
            for (var _i = 0, shippingZoneLocations_1 = shippingZoneLocations; _i < shippingZoneLocations_1.length; _i++) {
                var szl = shippingZoneLocations_1[_i];
                if (szl.type == "postcode") {
                    if (szl.code.toLocaleLowerCase().includes(address.postcode.toLocaleLowerCase()) || address.postcode.toLocaleLowerCase().includes(szl.code.toLocaleLowerCase())) {
                        matched = szl;
                        break;
                    }
                    if (szl.code.toLocaleLowerCase().includes(".")) {
                        var code = szl.code.split(".");
                        if (code && code.length >= 4) {
                            var min = code[0];
                            var max = code[3].trim();
                            if (Number(address.postcode) >= Number(min) && Number(address.postcode) <= Number(max)) {
                                matched = szl;
                                break;
                            }
                        }
                    }
                }
            }
            if (!matched && address.country && address.state) {
                for (var _a = 0, shippingZoneLocations_2 = shippingZoneLocations; _a < shippingZoneLocations_2.length; _a++) {
                    var szl = shippingZoneLocations_2[_a];
                    if (szl.code == (address.country + ":" + address.state)) {
                        matched = szl;
                        break;
                    }
                }
            }
            if (!matched && address.country) {
                for (var _b = 0, shippingZoneLocations_3 = shippingZoneLocations; _b < shippingZoneLocations_3.length; _b++) {
                    var szl = shippingZoneLocations_3[_b];
                    if (szl.code == address.country) {
                        matched = szl;
                        break;
                    }
                }
            }
        }
        return matched;
    };
    MyaddressPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    MyaddressPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    MyaddressPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    MyaddressPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-myaddress',template:/*ion-inline-start:"D:\PTH\Laundry Shop\Salavai-User\src\pages\myaddress\myaddress.html"*/'<ion-header>\n	<ion-navbar>\n		<ion-title>{{\'my_address\' | translate}}</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content class="bg-light">\n	<div class="empty-view animate__animated animate__zoomIn" style="--animate-duration: .2s;" *ngIf="!addresses || !addresses.length">\n		<div style="text-align:center">\n			<img src="assets/imgs/location_active.png" alt="no offers" />\n			<span style="color:#9E9E9E; font-weight:bold; display: block;">{{"address_empty" | translate}}</span>\n		</div>\n	</div>\n\n	<ion-list no-lines radio-group [(ngModel)]="selectedAddressId" (ionChange)="onAddressChangeHandler($event)">\n		<h2 class="animate__animated animate__fadeInUp" *ngIf="addresses && addresses.length">{{\'saved_addresses\' | translate}}</h2>\n		<ion-item class="animate__animated animate__fadeInUp" *ngFor="let address of addresses">\n			<ion-label>\n				<div class="img_box">\n					<img *ngIf="address.type == 1" src="assets/imgs/ic_home_active.png">\n					<img *ngIf="address.type == 1" src="assets/imgs/ic_home.png">\n					<h3 *ngIf="address.type == 1">{{"address_type_home" | translate}}</h3>\n					<img *ngIf="address.type == 2" src="assets/imgs/ic_office.png">\n					<img *ngIf="address.type == 2" src="assets/imgs/ic_office_active.png">\n					<h3 *ngIf="address.type == 2">{{"address_type_office" | translate}}</h3>\n					<img *ngIf="address.type == 3" src="assets/imgs/location.png">\n					<img *ngIf="address.type == 3" src="assets/imgs/ic_otherlocatio_active.png">\n					<h3 *ngIf="address.type == 3">{{"address_type_other" | translate}}</h3>\n				</div>\n				<p>{{address.address_1}}</p>\n			</ion-label>\n			<ion-radio value="{{address.id}}"></ion-radio>\n		</ion-item>\n	</ion-list>\n\n</ion-content>\n<ion-footer no-border>\n	<button ion-button block outline (click)="addressNew()" class="bg-white add_new_location animate__animated animate__fadeInUp" style="--animate-duration: .4s;">\n		<ion-icon name="md-add" icon-start></ion-icon>\n		{{\'add_new_location\' | translate}}\n	</button>\n</ion-footer>'/*ion-inline-end:"D:\PTH\Laundry Shop\Salavai-User\src\pages\myaddress\myaddress.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */], __WEBPACK_IMPORTED_MODULE_3__providers_wordpress_client_service__["a" /* WordpressClient */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], MyaddressPage);
    return MyaddressPage;
}());

//# sourceMappingURL=myaddress.js.map

/***/ }),

/***/ 136:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SelectdatePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__payment_payment__ = __webpack_require__(393);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ngx_translate_core__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_moment__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var SelectdatePage = /** @class */ (function () {
    function SelectdatePage(navCtrl, toastCtrl, translate) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.translate = translate;
        this.dnt = "pick";
        this.dates = [];
        this.datePickupSelectedIndex = -1;
        this.timePickupSelectedIndex = -1;
        this.dateDeliverySelectedIndex = -1;
        this.timeDeliverySelectedIndex = -1;
        this.translate.get(['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']).subscribe(function (res) {
            _this.weekDaysTrans = new Array();
            _this.weekDaysTrans.push(res.sun);
            _this.weekDaysTrans.push(res.mon);
            _this.weekDaysTrans.push(res.tue);
            _this.weekDaysTrans.push(res.wed);
            _this.weekDaysTrans.push(res.thu);
            _this.weekDaysTrans.push(res.fri);
            _this.weekDaysTrans.push(res.sat);
        });
        this.translate.get(['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']).subscribe(function (res) {
            _this.monthsTrans = new Array();
            _this.monthsTrans.push(res.jan);
            _this.monthsTrans.push(res.feb);
            _this.monthsTrans.push(res.mar);
            _this.monthsTrans.push(res.apr);
            _this.monthsTrans.push(res.may);
            _this.monthsTrans.push(res.jun);
            _this.monthsTrans.push(res.jul);
            _this.monthsTrans.push(res.aug);
            _this.monthsTrans.push(res.sep);
            _this.monthsTrans.push(res.oct);
            _this.monthsTrans.push(res.nov);
            _this.monthsTrans.push(res.dec);
        });
        this.translate.get((this.dnt == "pick") ? "select_pickdate" : "select_deliverydate").subscribe(function (value) { return _this.selectionDateHeading = value; });
        this.translate.get((this.dnt == "pick") ? "select_picktime" : "select_deliverytime").subscribe(function (value) { return _this.selectionTimeHeading = value; });
        for (var i = 0; i < 14; i++) {
            var d = new Date();
            d.setDate(d.getDate() + i);
            this.dates.push(d);
        }
        this.setupAvailability();
        this.selectpickDate(0);
    }
    SelectdatePage.prototype.onSegmentChange = function () {
        var _this = this;
        this.translate.get((this.dnt == "pick") ? "select_pickdate" : "select_deliverydate").subscribe(function (value) { return _this.selectionDateHeading = value; });
        this.translate.get((this.dnt == "pick") ? "select_picktime" : "select_deliverytime").subscribe(function (value) { return _this.selectionTimeHeading = value; });
        var indexToShow = this.dnt == "pick" ? this.datePickupSelectedIndex : this.dateDeliverySelectedIndex;
        this.selectDate((indexToShow && indexToShow > -1) ? indexToShow : 0);
        if (this.dnt != "pick") {
            setTimeout(function () { return _this.selectDate(_this.dates[_this.datePickupSelectedIndex + 1] ? _this.datePickupSelectedIndex + 1 : _this.dates.length - 1); }, 100);
        }
    };
    SelectdatePage.prototype.selectDate = function (index) {
        console.log(index);
        if (this.dnt == "pick") {
            if (this.datePickupSelectedIndex != index) {
                this.timePickupSelectedIndex = -1;
                this.pickupDateTime = null;
            }
            this.selectpickDate(index);
        }
        else {
            if (this.dateDeliverySelectedIndex != index) {
                this.timeDeliverySelectedIndex = -1;
                this.deliveryDateTime = null;
            }
            this.selectDeliverytDate(index);
        }
    };
    SelectdatePage.prototype.selectTime = function (index) {
        if (this.dnt == "pick") {
            this.selectpickTime(index);
            this.markPickupDateTime();
        }
        else {
            this.selectDeliveryTime(index);
            this.markDeliveryDateTime();
        }
    };
    SelectdatePage.prototype.isTimeSelected = function (index) {
        if (this.dnt == "pick") {
            return this.timePickupSelectedIndex == index;
        }
        else {
            return this.timeDeliverySelectedIndex == index;
        }
    };
    SelectdatePage.prototype.isDateSelected = function (index) {
        if (this.dnt == "pick") {
            return this.datePickupSelectedIndex == index;
        }
        else {
            return this.dateDeliverySelectedIndex == index;
        }
    };
    SelectdatePage.prototype.setupAvailability = function () {
        this.availabilityTimes = new Array();
        for (var i = 0; i < 14; i++) {
            this.availabilityTimes.push(new Array());
        }
        var timeSlots = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].TIME_SLOTS));
        for (var _i = 0, timeSlots_1 = timeSlots; _i < timeSlots_1.length; _i++) {
            var ts = timeSlots_1[_i];
            ts.time_text = ts.start_time.substr(0, ts.start_time.lastIndexOf(":")) + " - " + ts.end_time.substr(0, ts.end_time.lastIndexOf(":"));
            var dayCaps = String(ts.day).toUpperCase();
            switch (dayCaps) {
                case "SUN": {
                    this.availabilityTimes[0].push(ts);
                    this.availabilityTimes[7].push(ts);
                    break;
                }
                case "MON": {
                    this.availabilityTimes[1].push(ts);
                    this.availabilityTimes[8].push(ts);
                    break;
                }
                case "TUE": {
                    this.availabilityTimes[2].push(ts);
                    this.availabilityTimes[9].push(ts);
                    break;
                }
                case "WED": {
                    this.availabilityTimes[3].push(ts);
                    this.availabilityTimes[10].push(ts);
                    break;
                }
                case "THU": {
                    this.availabilityTimes[4].push(ts);
                    this.availabilityTimes[11].push(ts);
                    break;
                }
                case "FRI": {
                    this.availabilityTimes[5].push(ts);
                    this.availabilityTimes[12].push(ts);
                    break;
                }
                case "SAT": {
                    this.availabilityTimes[6].push(ts);
                    this.availabilityTimes[13].push(ts);
                    break;
                }
            }
        }
        console.log(this.availabilityTimes);
    };
    SelectdatePage.prototype.selectpickDate = function (index) {
        this.datePickupSelectedIndex = index;
        // let nowTime = new Date().getTime();
        // let toShow = new Array<TimeSlot>();
        // for (let tc of this.availabilityTimes[this.dates[this.datePickupSelectedIndex].getDay()]) {
        //   let pickupTime = moment(moment(this.dates[this.datePickupSelectedIndex]).format("YYYY-MM-DD") + ' ' + tc.start_time).valueOf();
        //   if (nowTime <= pickupTime)
        //     toShow.push(tc);
        // }
        // this.times = toShow;
        this.times = this.availabilityTimes[this.dates[this.datePickupSelectedIndex].getDay()];
    };
    SelectdatePage.prototype.selectpickTime = function (index) {
        this.timePickupSelectedIndex = index;
    };
    SelectdatePage.prototype.selectDeliverytDate = function (index) {
        this.dateDeliverySelectedIndex = index;
        // let nowTime = new Date().getTime();
        // let toShow = new Array<TimeSlot>();
        // for (let tc of this.availabilityTimes[this.dates[this.dateDeliverySelectedIndex].getDay()]) {
        //   let deliveryTime = moment(moment(this.dates[this.dateDeliverySelectedIndex]).format("YYYY-MM-DD") + ' ' + tc.start_time).valueOf();
        //   if (nowTime <= deliveryTime)
        //     toShow.push(tc);
        // }
        // this.times = toShow;
        this.times = this.availabilityTimes[this.dates[this.dateDeliverySelectedIndex].getDay()];
    };
    SelectdatePage.prototype.selectDeliveryTime = function (index) {
        this.timeDeliverySelectedIndex = index;
    };
    SelectdatePage.prototype.markPickupDateTime = function () {
        if (this.dates[this.datePickupSelectedIndex] && this.times[this.timePickupSelectedIndex]) {
            this.pickupDateTime = __WEBPACK_IMPORTED_MODULE_5_moment___default()(__WEBPACK_IMPORTED_MODULE_5_moment___default()(this.dates[this.datePickupSelectedIndex]).format("YYYY-MM-DD") + ' ' + this.times[this.timePickupSelectedIndex].start_time).toDate();
            this.pickupSlot = this.times[this.timePickupSelectedIndex].time_text;
        }
    };
    SelectdatePage.prototype.markDeliveryDateTime = function () {
        if (this.dates[this.dateDeliverySelectedIndex] && this.times[this.timeDeliverySelectedIndex]) {
            this.deliveryDateTime = __WEBPACK_IMPORTED_MODULE_5_moment___default()(__WEBPACK_IMPORTED_MODULE_5_moment___default()(this.dates[this.dateDeliverySelectedIndex]).format("YYYY-MM-DD") + ' ' + this.times[this.timeDeliverySelectedIndex].start_time).toDate();
            this.deliverySlot = this.times[this.timeDeliverySelectedIndex].time_text;
        }
    };
    SelectdatePage.prototype.payment = function () {
        var _this = this;
        if (!this.pickupDateTime) {
            this.translate.get('select_pickup_time').subscribe(function (value) { return _this.showToast(value); });
        }
        else if (!this.deliveryDateTime) {
            this.dnt = "delivery";
            this.translate.get('select_delivery_time').subscribe(function (value) { return _this.showToast(value); });
        }
        else {
            var nowTime = new Date();
            if (this.pickupDateTime < nowTime) {
                this.translate.get('pickup_time_passed').subscribe(function (value) { return _this.showToast(value); });
            }
            else if (this.deliveryDateTime < nowTime) {
                this.translate.get('delivery_time_passed').subscribe(function (value) { return _this.showToast(value); });
            }
            else if (this.deliveryDateTime <= this.pickupDateTime) {
                this.translate.get('pickup_time_greater').subscribe(function (value) { return _this.showToast(value); });
            }
            else {
                this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__payment_payment__["a" /* PaymentPage */], { pickupTime: this.pickupDateTime.getTime(), pickupSlot: this.pickupSlot, deliveryTime: this.deliveryDateTime.getTime(), deliverySlot: this.deliverySlot });
            }
        }
    };
    SelectdatePage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 2000,
            position: 'top'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    SelectdatePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-selectdate',template:/*ion-inline-start:"D:\PTH\Laundry Shop\Salavai-User\src\pages\selectdate\selectdate.html"*/'<ion-header>\n	<ion-navbar>\n		<ion-title>{{"select_datetime" | translate}}</ion-title>\n	</ion-navbar>\n	<ion-toolbar no-border-top class="select-tab">\n		<ion-segment [(ngModel)]="dnt" (ionChange)="onSegmentChange()">\n			<ion-segment-button value="pick">\n				<span class="pick"></span> {{"pickup" | translate}}\n			</ion-segment-button>\n			<ion-segment-button value="delivery">\n				<span class="delivery"></span> {{"delivery" | translate}}\n			</ion-segment-button>\n		</ion-segment>\n	</ion-toolbar>\n</ion-header>\n\n<ion-content class="bg-light">\n	<div class="empty-view animate__animated animate__zoomIn" style="--animate-duration: .25s;" *ngIf="!times || !times.length">\n		<div style="text-align:center">\n			<img src="assets/imgs/empty_notification.png" alt="no offers" />\n			<span *ngIf="dnt == \'pick\'" style="color:#9E9E9E; font-weight:bold; display: block;">\n				{{"empty_time_slots" | translate}} {{ weekDaysTrans[dates[datePickupSelectedIndex].getDay()]}}, {{dates[datePickupSelectedIndex].getDate()}} {{ monthsTrans[dates[datePickupSelectedIndex].getMonth()]}}\n			</span>\n			<span *ngIf="dnt != \'pick\'" style="color:#9E9E9E; font-weight:bold; display: block;">\n				{{"empty_time_slots" | translate}} {{ weekDaysTrans[dates[dateDeliverySelectedIndex].getDay()]}}, {{dates[dateDeliverySelectedIndex].getDate()}} {{ monthsTrans[dates[dateDeliverySelectedIndex].getMonth()]}}\n			</span>\n		</div>\n	</div>\n\n	<ion-list no-lines>\n		<div *ngIf="weekDaysTrans && monthsTrans" class="select-day">\n			<p class="heading animate__animated animate__fadeInUp" style="--animate-duration: .3s;">{{selectionDateHeading}}</p>\n			<ion-scroll class="animate__animated animate__fadeInUp" style="--animate-duration: .4s;" scrollX style="height:38px;white-space: nowrap;">\n				<div class="scroll-item animate__animated animate__zoomIn" *ngFor="let item of dates;let i=index">\n					<div class="date-box" [ngClass]="{\'active\':isDateSelected(i)}" (click)="selectDate(i)">\n						{{ weekDaysTrans[item.getDay()]}}, {{item.getDate()}} {{ monthsTrans[item.getMonth()]}}\n					</div>\n				</div>\n			</ion-scroll>\n		</div>\n		<div *ngIf="times && times.length" class="select-time">\n			<p class="heading animate__animated animate__fadeInUp" style="--animate-duration: .3s;">{{selectionTimeHeading}}</p>\n			<ion-row  no-padding>\n				<ion-col class="animate__animated animate__zoomIn" col-6 no-padding *ngFor="let item of times;let j=index">\n					<h6 [ngClass]="{\'active\':isTimeSelected(j)}" (click)="selectTime(j)"><span>{{item.time_text}}</span></h6>\n				</ion-col>\n			</ion-row>\n		</div>\n	</ion-list>\n</ion-content>\n<ion-footer class="animate__animated animate__fadeInUp" style="--animate-duration: .4s;"> \n	<div class="fixed-bootom" (click)="payment()">\n		<ion-row>\n			<ion-col class="next">{{"next" | translate}}\n				<ion-icon name="ios-arrow-forward-outline"></ion-icon>\n			</ion-col>\n		</ion-row>\n	</div>\n</ion-footer>'/*ion-inline-end:"D:\PTH\Laundry Shop\Salavai-User\src\pages\selectdate\selectdate.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */], __WEBPACK_IMPORTED_MODULE_3__ngx_translate_core__["c" /* TranslateService */]])
    ], SelectdatePage);
    return SelectdatePage;
}());

//# sourceMappingURL=selectdate.js.map

/***/ }),

/***/ 137:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ManagelanguagePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__tabs_tabs__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_app_config__ = __webpack_require__(18);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};





var ManagelanguagePage = /** @class */ (function () {
    function ManagelanguagePage(config, events, app) {
        this.config = config;
        this.events = events;
        this.app = app;
        this.defaultLanguageCode = this.config.availableLanguages[0].code;
        var defaultLang = window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].KEY_DEFAULT_LANGUAGE);
        if (defaultLang)
            this.defaultLanguageCode = defaultLang;
    }
    ManagelanguagePage.prototype.onLanguageClick = function (language) {
        this.defaultLanguageCode = language.code;
    };
    ManagelanguagePage.prototype.languageConfirm = function () {
        this.events.publish('language:selection', this.defaultLanguageCode);
        window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].KEY_DEFAULT_LANGUAGE, this.defaultLanguageCode);
        this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_3__tabs_tabs__["a" /* TabsPage */]);
    };
    ManagelanguagePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-managelanguage',template:/*ion-inline-start:"D:\PTH\Laundry Shop\Salavai-User\src\pages\managelanguage\managelanguage.html"*/'<ion-header>\n	<ion-navbar>\n		<ion-title>{{\'change_language\' | translate}}</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content class="bg-light">\n	<ion-list no-lines>\n		<ion-item class="animate__animated animate__fadeInUp" *ngFor="let language of config.availableLanguages" (click)="onLanguageClick(language)">\n			<h3 class="d-flex">{{language.name}}\n            	<ion-icon class="end" *ngIf="defaultLanguageCode == language.code" name="md-globe"></ion-icon>\n            </h3>\n		</ion-item>\n	</ion-list>\n</ion-content>\n\n<ion-footer no-border class="animate__animated animate__fadeInUp" style="--animate-duration: .4s;"> \n	<button ion-button full no-margin class="btn-orange btn" (click)="languageConfirm()">\n		{{"save" | translate}}\n	</button>\n</ion-footer>'/*ion-inline-end:"D:\PTH\Laundry Shop\Salavai-User\src\pages\managelanguage\managelanguage.html"*/
        }),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_4__app_app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */]])
    ], ManagelanguagePage);
    return ManagelanguagePage;
}());

//# sourceMappingURL=managelanguage.js.map

/***/ }),

/***/ 149:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 149;

/***/ }),

/***/ 16:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WordpressClient; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__(124);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_from__ = __webpack_require__(477);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_from___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_from__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_of__ = __webpack_require__(484);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_of___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_of__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_concatMap__ = __webpack_require__(485);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_concatMap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_concatMap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__app_app_config__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__models_register_request_models__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__models_constants_models__ = __webpack_require__(9);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};










var WordpressClient = /** @class */ (function () {
    function WordpressClient(config, http) {
        this.config = config;
        this.http = http;
        this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    }
    WordpressClient.prototype.convertToParams = function (data) {
        var p = [];
        for (var key in data) {
            p.push(key + '=' + encodeURIComponent(data[key]));
        }
        return p.join('&');
    };
    WordpressClient.prototype.checkToken = function (adminToken, idToken) {
        var data = this.convertToParams({ token: idToken });
        var httpOptions = {
            headers: new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({
                'Content-Type': 'application/json',
                // 'Content-Type':  'application/x-www-form-urlencoded',
                'Authorization': adminToken
            })
        };
        var token = this.http.post(this.config.apiBase + 'wp-json/mobile-ecommerce/v1/jwt/token/firebase', { token: idToken }, httpOptions);
        return token.concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.getCountries = function () {
        return this.http.get('./assets/json/countries.json').concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.getUser = function (adminToken, userId) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .get(this.config.apiBase + 'wp-json/wc/v3/customers/' + userId, { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.updateUser = function (adminToken, userId, userUpdateRequest) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http.put(this.config.apiBase + 'wp-json/wc/v3/customers/' + userId, JSON.stringify(userUpdateRequest), { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.createUser = function (adminToken, countryCode, credentials) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        var rr = new __WEBPACK_IMPORTED_MODULE_7__models_register_request_models__["a" /* RegisterRequest */](credentials.email, countryCode + credentials.username, credentials.password, credentials.first_name, credentials.last_name);
        rr.meta_data = credentials.meta_data;
        return this.http.post(this.config.apiBase + 'wp-json/wp/v2/users', JSON.stringify(rr), { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.getAuthToken = function (credentials) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json' });
        return this.http.post(this.config.apiBase + 'wp-json/mobile-ecommerce/v1/jwt/token', JSON.stringify(credentials), { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.resetPassword = function (userName) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json' });
        return this.http.post(this.config.apiBase + 'wp-json/mobile-ecommerce/v1/password/forgot', JSON.stringify({ user_login: userName }), { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.createOrder = function (adminToken, createOrder) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .post(this.config.apiBase + 'wp-json/wc/v3/orders', JSON.stringify(createOrder), { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.myOrders = function (adminToken, customer_id, pageNo) {
        var _this = this;
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http.get(this.config.apiBase + 'wp-json/wc/v3/orders' + '?customer=' + customer_id + '&page=' + pageNo, { headers: myHeaders }).concatMap(function (data) {
            var currencyIcon = '';
            var currencyText = '';
            var currency = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_9__models_constants_models__["a" /* Constants */].CURRENCY));
            if (currency) {
                currencyText = currency.value;
                var iconText = currency.options[currency.value];
                currencyIcon = iconText.substring(iconText.lastIndexOf('(') + 1, iconText.length - 1);
            }
            var lc = _this.getLocale();
            for (var i = 0; i < data.length; i++) {
                var order = data[i];
                order.date_created = _this.formatDate(order.date_created, lc);
                order.total_html = currencyIcon + " " + Number(order.total).toFixed(2);
                if (Number(order.discount_total) && Number(order.discount_total) > 0)
                    order.discount_total_html = currencyIcon + ' ' + order.discount_total;
                if (Number(order.total_tax) && Number(order.total_tax) > 0)
                    order.total_tax_html = currencyIcon + ' ' + order.total_tax;
                if (Number(order.shipping_total) && Number(order.shipping_total) > 0)
                    order.shipping_total_html = currencyIcon + ' ' + order.shipping_total;
                if (order.line_items && order.line_items.length) {
                    for (var _i = 0, _a = order.line_items; _i < _a.length; _i++) {
                        var line = _a[_i];
                        line.price_html = currencyIcon + ' ' + Number(line.price).toFixed(2);
                        line.total_html = currencyIcon + ' ' + Number(line.total).toFixed(2);
                        line.subtotal_html = currencyIcon + ' ' + Number(line.subtotal).toFixed(2);
                    }
                }
                for (var _b = 0, _c = order.meta_data; _b < _c.length; _b++) {
                    var keyValue = _c[_b];
                    if (keyValue.key == "time_pickup") {
                        order.time_pickup = keyValue.value;
                        order.time_pickup_formatted = _this.formatDateMillis(Number(order.time_pickup), lc);
                    }
                    else if (keyValue.key == "time_delivery") {
                        order.time_delivery = keyValue.value;
                        order.time_delivery_formatted = _this.formatDateMillis(Number(order.time_delivery), lc);
                    }
                    else if (keyValue.key == "time_complete") {
                        order.time_complete = keyValue.value;
                        order.time_complete_formatted = _this.formatDateTimeMillis(Number(order.time_complete), lc);
                    }
                    else if (keyValue.key == "time_pickup_slot") {
                        order.time_pickup_slot = keyValue.value;
                    }
                    else if (keyValue.key == "time_delivery_slot") {
                        order.time_delivery_slot = keyValue.value;
                    }
                }
            }
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.updateOrder = function (adminToken, orderId, orderUpdateRequest) {
        var _this = this;
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .put(this.config.apiBase + 'wp-json/wc/v3/orders/' + orderId, JSON.stringify(orderUpdateRequest), { headers: myHeaders })
            .concatMap(function (data) {
            var lc = _this.getLocale();
            var order = data;
            order.date_created = _this.formatDate(order.date_created, lc);
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.shippingLines = function (adminToken) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .get(this.config.apiBase + 'wp-json/wc/v3/shipping_methods', { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.getCouponByCode = function (adminToken, cCode) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .get(this.config.apiBase + 'wp-json/wc/v3/coupons?code=' + cCode, { headers: myHeaders })
            .concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.coupons = function (adminToken) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http.get(this.config.apiBase + 'wp-json/wc/v3/coupons?per_page=20', { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.applyCouponCode = function (adminToken, orderId, cCode) {
        var _this = this;
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http
            .get(this.config.apiBase + 'wp-json/mobile-ecommerce/v1/coupon/order/' + orderId + '/apply-coupon?code=' + cCode, { headers: myHeaders })
            .concatMap(function (data) {
            var lc = _this.getLocale();
            var order = data;
            order.date_created = _this.formatDate(order.date_created, lc);
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.categoriesWithParentId = function (adminToken, parentId, pageNo) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http.get(this.config.apiBase + 'wp-json/wc/v3/products/categories/?order=desc&_embed&orderby=count&parent=' + parentId + '&page=' + pageNo, { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.categories = function (adminToken, pageNo) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http.get(this.config.apiBase + 'wp-json/wc/v3/products/categories/?per_page=20&order=desc&orderby=count&page=' + pageNo + '&_embed', { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.productVariations = function (adminToken, productId) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http.get(this.config.apiBase + 'wp-json/wc/v3/products/' + productId + '/variations', { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.productsReviews = function (adminToken, productId) {
        var _this = this;
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http.get(this.config.apiBase + 'wp-json/wc/v3/products/' + productId + '/reviews', { headers: myHeaders }).concatMap(function (data) {
            var lc = _this.getLocale();
            for (var i = 0; i < data.length; i++) {
                var review = data[i];
                review.date_created = _this.formatDate(review.date_created, lc);
            }
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.banners = function (adminToken) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http.get(this.config.apiBase + 'wp-json/mobile-ecommerce/v1/banners/list', { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.shippingZones = function (adminToken) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http.get(this.config.apiBase + 'wp-json/wc/v3/shipping/zones', { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.shippingZoneLocations = function (adminToken, zoneId) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http.get(this.config.apiBase + 'wp-json/wc/v3/shipping/zones/' + zoneId + '/locations', { headers: myHeaders }).concatMap(function (data) {
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var zl = data_1[_i];
                zl.zoneId = zoneId;
            }
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.shippingZoneMethods = function (adminToken, zoneId) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http.get(this.config.apiBase + 'wp-json/wc/v2/shipping/zones/' + zoneId + '/methods', { headers: myHeaders }).concatMap(function (data) {
            for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
                var sm = data_2[_i];
                if (sm.settings && sm.settings.cost && sm.settings.cost.value && sm.settings.cost.value.length) {
                    sm.cost = Number(sm.settings.cost.value);
                }
                else if (sm.settings && sm.settings.min_amount && sm.settings.min_amount.value && sm.settings.min_amount.value.length) {
                    sm.cost = Number(sm.settings.min_amount.value);
                }
                else {
                    sm.cost = -1;
                }
            }
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.shippingMethod = function (adminToken, methodId) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http.get(this.config.apiBase + 'wp-json/wc/v3/shipping_methods/' + methodId, { headers: myHeaders }).concatMap(function (sm) {
            if (sm.settings && sm.settings.cost && sm.settings.cost.value && sm.settings.cost.value.length) {
                sm.cost = Number(sm.settings.cost.value);
            }
            else if (sm.settings && sm.settings.min_amount && sm.settings.min_amount.value && sm.settings.min_amount.value.length) {
                sm.cost = Number(sm.settings.min_amount.value);
            }
            else {
                sm.cost = -1;
            }
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(sm);
        });
    };
    WordpressClient.prototype.productsAll = function (adminToken, pageNo) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http.get(this.config.apiBase + 'wp-json/wc/v3/products' + '?per_page=20&page=' + pageNo + '&_embed', { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.productById = function (adminToken, proId) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http.get(this.config.apiBase + 'wp-json/wc/v3/products/' + proId, { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.productsByQuery = function (adminToken, query, pageNo) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http.get(this.config.apiBase + 'wp-json/wc/v3/products' + '?search=' + query + '&per_page=20&page=' + pageNo + '&_embed', { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.productsByCategory = function (adminToken, catId, pageNo) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http.get(this.config.apiBase + 'wp-json/wc/v3/products' + '?category=' + catId + '&per_page=20&page=' + pageNo + '&_embed', { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.currencies = function (adminToken) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http.get(this.config.apiBase + 'wp-json/wc/v3/settings/general/woocommerce_currency', { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.timeslots = function () {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json' });
        return this.http.get(this.config.apiBase + 'wp-json/laundry/v1/slots/list', { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.settings = function () {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json' });
        return this.http.get(this.config.apiBase + 'wp-json/laundry/v1/settings/list', { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.stripePayment = function (request) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json' });
        return this.http.post(this.config.apiBase + 'wp-json/mobile-ecommerce/v1/stripe/payment', JSON.stringify(request), { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.paymentGateways = function (adminToken) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http.get(this.config.apiBase + 'wp-json/wc/v3/payment_gateways', { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.registerForPushNotification = function (adminToken, userId, playerId) {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Content-Type': 'application/json', 'Authorization': adminToken });
        return this.http.post(this.config.apiBase + 'wp-json/mobile-ecommerce/v1/notification/register/' + userId, JSON.stringify({ 'player_id': playerId }), { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient.prototype.getLocale = function () {
        var sl = window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_9__models_constants_models__["a" /* Constants */].KEY_LOCALE);
        return sl && sl.length ? sl : "en";
    };
    WordpressClient.prototype.formatDate = function (dateString, locale) {
        return __WEBPACK_IMPORTED_MODULE_8_moment___default()(dateString).locale(locale).format("DD MMM YYYY");
    };
    WordpressClient.prototype.formatDateMillis = function (millis, locale) {
        return __WEBPACK_IMPORTED_MODULE_8_moment___default()(millis).locale(locale).format("DD MMM YYYY");
    };
    WordpressClient.prototype.formatDateTimeMillis = function (millis, locale) {
        return __WEBPACK_IMPORTED_MODULE_8_moment___default()(millis).locale(locale).format("DD MMM, HH:mm");
    };
    WordpressClient.prototype.getWhatsappDetails = function () {
        var myHeaders = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({ 'Accept': 'application/json', 'Content-Type': 'application/json' });
        return this.http.get('https://dashboard.vtlabs.dev/whatsapp.php?product_name=laundry', { headers: myHeaders }).concatMap(function (data) {
            return __WEBPACK_IMPORTED_MODULE_5_rxjs_Observable__["Observable"].of(data);
        });
    };
    WordpressClient = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_6__app_app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["a" /* HttpClient */]])
    ], WordpressClient);
    return WordpressClient;
}());

//# sourceMappingURL=wordpress-client.service.js.map

/***/ }),

/***/ 18:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return APP_CONFIG; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return BaseAppConfig; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);

var APP_CONFIG = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* InjectionToken */]("app.config");
var BaseAppConfig = {
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
//# sourceMappingURL=app.config.js.map

/***/ }),

/***/ 193:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 193;

/***/ }),

/***/ 34:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__account_account__ = __webpack_require__(373);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__offers_offers__ = __webpack_require__(401);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__home_home__ = __webpack_require__(134);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__orderconfirmed_orderconfirmed__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_onesignal__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_wordpress_client_service__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__models_constants_models__ = __webpack_require__(9);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var TabsPage = /** @class */ (function () {
    function TabsPage(oneSignal, platform, service, events) {
        var _this = this;
        this.service = service;
        this.tab1Root = __WEBPACK_IMPORTED_MODULE_4__home_home__["a" /* HomePage */];
        this.tab2Root = __WEBPACK_IMPORTED_MODULE_5__orderconfirmed_orderconfirmed__["a" /* OrderconfirmedPage */];
        this.tab3Root = __WEBPACK_IMPORTED_MODULE_3__offers_offers__["a" /* OffersPage */];
        this.tab4Root = __WEBPACK_IMPORTED_MODULE_2__account_account__["a" /* AccountPage */];
        this.subscriptions = [];
        events.subscribe('tab:to', function (to) {
            _this.tabRef.select(to);
        });
        if (platform.is('cordova')) {
            var userMe_1 = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].USER_KEY));
            if (userMe_1) {
                oneSignal.getIds().then(function (id) {
                    if (id && id.userId) {
                        var subscription = service.registerForPushNotification(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(userMe_1.id), id.userId).subscribe(function (data) {
                            console.log(data);
                        }, function (err) {
                            console.log(err);
                        });
                        _this.subscriptions.push(subscription);
                    }
                });
            }
        }
        this.refreshSettings();
        this.loadSlots();
    }
    TabsPage.prototype.ionViewWillLeave = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
    };
    TabsPage.prototype.refreshSettings = function () {
        var subscription = this.service.settings().subscribe(function (data) {
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].SETTINGS, JSON.stringify(data));
            console.log('setting setup success');
        }, function (err) {
            console.log('setting setup error', err);
        });
        this.subscriptions.push(subscription);
    };
    TabsPage.prototype.loadSlots = function () {
        var subscription = this.service.timeslots().subscribe(function (data) {
            var slots = data;
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].TIME_SLOTS, JSON.stringify(slots));
            console.log('timeslot setup success');
        }, function (err) {
            console.log('timeslot setup error');
        });
        this.subscriptions.push(subscription);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('myTabs'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["n" /* Tabs */])
    ], TabsPage.prototype, "tabRef", void 0);
    TabsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"D:\PTH\Laundry Shop\Salavai-User\src\pages\tabs\tabs.html"*/'<ion-tabs #myTabs name="myTabsNav" selectedIndex="0">\n  <ion-tab [root]="tab1Root" tabTitle="" tabIcon="md-home" tabsHideOnSubPages="true"></ion-tab>\n  <ion-tab [root]="tab2Root" tabTitle="" tabIcon="md-cart" tabsHideOnSubPages="true"></ion-tab>\n  <ion-tab [root]="tab3Root" tabTitle="" tabIcon="md-pricetag" tabsHideOnSubPages="true"></ion-tab>\n  <ion-tab [root]="tab4Root" tabTitle="" tabIcon="md-menu" tabsHideOnSubPages="true"></ion-tab>\n</ion-tabs>'/*ion-inline-end:"D:\PTH\Laundry Shop\Salavai-User\src\pages\tabs\tabs.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_6__ionic_native_onesignal__["a" /* OneSignal */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* Platform */], __WEBPACK_IMPORTED_MODULE_7__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */]])
    ], TabsPage);
    return TabsPage;
}());

//# sourceMappingURL=tabs.js.map

/***/ }),

/***/ 373:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AccountPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__profile_profile__ = __webpack_require__(374);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__myorders_myorders__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__about_about__ = __webpack_require__(379);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__contact_contact__ = __webpack_require__(395);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__tnc_tnc__ = __webpack_require__(398);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__login_login__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__tabs_tabs__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__contact_us_contact_us__ = __webpack_require__(399);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__node_modules_ngx_translate_core__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__myaddress_myaddress__ = __webpack_require__(135);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__managelanguage_managelanguage__ = __webpack_require__(137);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__app_app_config__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__ionic_native_in_app_browser__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__providers_global__ = __webpack_require__(52);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};

















var AccountPage = /** @class */ (function () {
    function AccountPage(config, navCtrl, events, translate, alertCtrl, app, global, inAppBrowser) {
        this.config = config;
        this.navCtrl = navCtrl;
        this.events = events;
        this.translate = translate;
        this.alertCtrl = alertCtrl;
        this.app = app;
        this.global = global;
        this.inAppBrowser = inAppBrowser;
        this.user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_11__models_constants_models__["a" /* Constants */].USER_KEY));
        this.setupAvtar();
        this.listenToLoginEvents();
    }
    AccountPage.prototype.listenToLoginEvents = function () {
        var _this = this;
        this.events.subscribe('user:login', function (user) {
            _this.user = user;
            _this.setupAvtar();
        });
    };
    AccountPage.prototype.setupAvtar = function () {
        if (this.user && this.user.avatar_url && (this.user.avatar_url.includes("gravatar.com") || this.user.avatar_url.includes("avatar")))
            this.user.avatar_url = null;
        if (this.user && this.user.meta_data) {
            for (var _i = 0, _a = this.user.meta_data; _i < _a.length; _i++) {
                var meta = _a[_i];
                if (meta.key == "avatar_url" && meta.value && meta.value.length) {
                    this.user.avatar_url = meta.value;
                    break;
                }
            }
        }
    };
    AccountPage.prototype.myorders = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__myorders_myorders__["a" /* MyordersPage */]);
    };
    AccountPage.prototype.myaddress = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_12__myaddress_myaddress__["a" /* MyaddressPage */]);
    };
    AccountPage.prototype.about = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__about_about__["a" /* AboutPage */]);
    };
    AccountPage.prototype.chat = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_9__contact_us_contact_us__["a" /* Contact_usPage */]);
        // let chatConfirmModal = this.modalCtrl.create(Contact_usPage);
        // chatConfirmModal.onDidDismiss(data => {
        //   if (data) this.navCtrl.push(ConversationPage);
        // });
        // chatConfirmModal.present();
    };
    AccountPage.prototype.contact = function () {
        var settings = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_11__models_constants_models__["a" /* Constants */].SETTINGS));
        if (settings) {
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__contact_contact__["a" /* ContactPage */], { settings: settings });
        }
    };
    AccountPage.prototype.tnc = function () {
        var settings = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_11__models_constants_models__["a" /* Constants */].SETTINGS));
        if (settings) {
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__tnc_tnc__["a" /* TncPage */], { settings: settings });
        }
    };
    AccountPage.prototype.signin = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__login_login__["a" /* LoginPage */]);
    };
    AccountPage.prototype.chooseLanguage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_13__managelanguage_managelanguage__["a" /* ManagelanguagePage */]);
    };
    AccountPage.prototype.phonenumberPage = function () {
        var _this = this;
        this.translate.get(['logout', 'logout_message', 'no', 'yes']).subscribe(function (text) {
            var alert = _this.alertCtrl.create({
                title: text['logout'],
                message: text['logout_message'],
                buttons: [{
                        text: text['no'],
                        role: 'cancel',
                        handler: function () {
                            console.log('Cancel clicked');
                        }
                    },
                    {
                        text: text['yes'],
                        handler: function () {
                            _this.user = null;
                            window.localStorage.removeItem(__WEBPACK_IMPORTED_MODULE_11__models_constants_models__["a" /* Constants */].USER_KEY);
                            window.localStorage.removeItem(__WEBPACK_IMPORTED_MODULE_11__models_constants_models__["a" /* Constants */].USER_ADMIN_KEY);
                            window.localStorage.removeItem(__WEBPACK_IMPORTED_MODULE_11__models_constants_models__["a" /* Constants */].USER_API_KEY);
                            window.localStorage.removeItem(__WEBPACK_IMPORTED_MODULE_11__models_constants_models__["a" /* Constants */].SELECTED_ADDRESS);
                            window.localStorage.removeItem(__WEBPACK_IMPORTED_MODULE_11__models_constants_models__["a" /* Constants */].TEMP_OPEN_CART);
                            _this.global.clearCart();
                            _this.global.clearFavorites();
                            _this.global.clearSearchHistory();
                            _this.events.publish("user:login", null);
                            _this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_8__tabs_tabs__["a" /* TabsPage */]);
                        }
                    }]
            });
            alert.present();
        });
    };
    AccountPage.prototype.actionNavHeader = function () {
        if (this.user) {
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__profile_profile__["a" /* ProfilePage */]);
        }
        else {
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__login_login__["a" /* LoginPage */]);
        }
    };
    AccountPage.prototype.developedBy = function () {
        var options = {
            zoom: 'no'
        };
        var browser = this.inAppBrowser.create('https://verbosetechlabs.com/', '_system', options);
    };
    AccountPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-account',template:/*ion-inline-start:"D:\PTH\Laundry Shop\Salavai-User\src\pages\account\account.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{"more" | translate}}</ion-title>\n    </ion-navbar>\n\n    <div class="order-head d-flex" (click)="actionNavHeader()">\n        <div class="img_box center_img">\n            <img *ngIf="user && user.avatar_url && user.avatar_url" [src]="user.avatar_url" class="crop_img">\n            <img *ngIf="!(user && user.avatar_url && user.avatar_url)" src="assets/imgs/logo.png" class="crop_img">\n        </div>\n\n        <div class="text_box" *ngIf="user">\n            <p>{{user.first_name}}\n                <span class="d-flex">+{{user.username}}\n                    <ion-icon class="zmdi zmdi-chevron-right end" text-end></ion-icon>\n                </span>\n            </p>\n        </div>\n\n        <div class="text_box" *ngIf="!user">\n            <p>{{\'hey\' | translate}} {{\'guest\' | translate}}</p>\n        </div>\n    </div>\n</ion-header>\n\n<ion-content class="bg-light">\n    <ion-list no-lines>\n        <ion-item class="animate__animated animate__fadeInUp" (click)="myorders()" *ngIf="user">\n            <ion-icon class="zmdi zmdi-storage" text-start item-start></ion-icon>\n            {{"my_orders" | translate}}\n        </ion-item>\n        <ion-item class="animate__animated animate__fadeInUp" (click)="myaddress()" *ngIf="user">\n            <ion-icon class="zmdi zmdi-pin" text-start item-start></ion-icon>\n            {{"my_address" | translate}}\n        </ion-item>\n        <ion-item class="animate__animated animate__fadeInUp" (click)="about()">\n            <ion-icon class="zmdi zmdi-city-alt" text-start item-start></ion-icon>\n            {{"faq" | translate}}\n        </ion-item>\n        <ion-item class="animate__animated animate__fadeInUp" (click)="contact()">\n            <ion-icon class="zmdi zmdi-email" text-start item-start></ion-icon>\n            {{"contact_us" | translate}}\n        </ion-item>\n\n        <ion-item class="animate__animated animate__fadeInUp" (click)="chat()">\n            <ion-icon class="zmdi zmdi-comment-more" text-start item-start></ion-icon>\n            {{"chat_with_us" | translate}}\n        </ion-item>\n        <ion-item class="animate__animated animate__fadeInUp" (click)="tnc()">\n            <ion-icon class="zmdi zmdi-assignment-alert" text-start item-start></ion-icon>\n            {{"tns" | translate}}\n        </ion-item>\n        <ion-item class="animate__animated animate__fadeInUp" (click)="chooseLanguage()">\n            <ion-icon class="zmdi zmdi-globe" text-start item-start></ion-icon>\n            {{"change_language" | translate}}\n        </ion-item>\n        <ion-item class="animate__animated animate__fadeInUp" (click)="phonenumberPage()" *ngIf="user">\n            <ion-icon class="zmdi zmdi-open-in-new" text-start item-start></ion-icon>\n            {{"logout" | translate}}\n        </ion-item>\n        <ion-item class="animate__animated animate__fadeInUp" (click)="signin()" *ngIf="!user">\n            <ion-icon class="zmdi zmdi-open-in-new" text-start item-start></ion-icon>\n            {{"login" | translate}}\n        </ion-item>\n    </ion-list>\n</ion-content>\n\n<ion-footer no-border class="animate__animated animate__fadeInUp" style="--animate-duration: .4s;">\n    <div class="div-logo" *ngIf="config.demoMode" (click)="developedBy()">\n        <h4 class="text-white-dev">{{\'developed_by\' | translate}}</h4>\n        <img class="img-logo" src="assets/imgs/VT_black_logo.png" alt="">\n    </div>\n</ion-footer>'/*ion-inline-end:"D:\PTH\Laundry Shop\Salavai-User\src\pages\account\account.html"*/
        }),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_14__app_app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */], __WEBPACK_IMPORTED_MODULE_10__node_modules_ngx_translate_core__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */], __WEBPACK_IMPORTED_MODULE_16__providers_global__["a" /* Global */], __WEBPACK_IMPORTED_MODULE_15__ionic_native_in_app_browser__["a" /* InAppBrowser */]])
    ], AccountPage);
    return AccountPage;
}());

//# sourceMappingURL=account.js.map

/***/ }),

/***/ 374:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProfilePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_file__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_image_picker__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_crop__ = __webpack_require__(128);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_firebase__ = __webpack_require__(375);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_wordpress_client_service__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ngx_translate_core__ = __webpack_require__(11);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var ProfilePage = /** @class */ (function () {
    function ProfilePage(navCtrl, events, imagePicker, toastCtrl, file, _firebase, cropService, platform, loadingCtrl, translate, alertCtrl, service) {
        this.navCtrl = navCtrl;
        this.events = events;
        this.imagePicker = imagePicker;
        this.toastCtrl = toastCtrl;
        this.file = file;
        this._firebase = _firebase;
        this.cropService = cropService;
        this.platform = platform;
        this.loadingCtrl = loadingCtrl;
        this.translate = translate;
        this.alertCtrl = alertCtrl;
        this.service = service;
        this.account = "profile";
        this.progress = false;
        this.loadingShown = false;
        this.user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].USER_KEY));
        this.usernameToShow = "+" + this.user.username;
        this.setupAvtar();
    }
    ProfilePage.prototype.setupAvtar = function () {
        if (this.user && this.user.avatar_url && (this.user.avatar_url.includes("gravatar.com") || this.user.avatar_url.includes("avatar")))
            this.user.avatar_url = null;
        if (this.user && this.user.meta_data) {
            for (var _i = 0, _a = this.user.meta_data; _i < _a.length; _i++) {
                var meta = _a[_i];
                if (meta.key == "avatar_url" && meta.value && meta.value.length) {
                    this.user.avatar_url = meta.value;
                    break;
                }
            }
        }
    };
    ProfilePage.prototype.openAction = function () {
        var _this = this;
        this.platform.ready().then(function () {
            if (_this.platform.is("cordova")) {
                _this.imagePicker.getPictures({
                    maximumImagesCount: 1,
                }).then(function (results) {
                    if (results && results[0]) {
                        _this.reduceImages(results).then(function () {
                            console.log('cropped_images');
                        });
                    }
                }, function (err) {
                    console.log("getPictures", JSON.stringify(err));
                });
            }
        });
    };
    ProfilePage.prototype.reduceImages = function (selected_pictures) {
        var _this = this;
        return selected_pictures.reduce(function (promise, item) {
            return promise.then(function (result) {
                return _this.cropService.crop(item, { quality: 100 }).then(function (cropped_image) {
                    _this.resolveUri(cropped_image);
                });
            });
        }, Promise.resolve());
    };
    ProfilePage.prototype.resolveUri = function (uri) {
        var _this = this;
        console.log('uri: ' + uri);
        if (this.platform.is("android") && uri.startsWith('content://') && uri.indexOf('/storage/') != -1) {
            uri = "file://" + uri.substring(uri.indexOf("/storage/"), uri.length);
            console.log('file: ' + uri);
        }
        this.file.resolveLocalFilesystemUrl(uri).then(function (entry) {
            console.log(entry);
            var fileEntry = entry;
            fileEntry.file(function (success) {
                var mimeType = success.type;
                console.log(mimeType);
                var dirPath = entry.nativeURL;
                _this.upload(dirPath, entry.name, mimeType);
            }, function (error) {
                console.log(error);
            });
        });
    };
    ProfilePage.prototype.upload = function (path, name, mime) {
        var _this = this;
        console.log('original: ' + path);
        var dirPathSegments = path.split('/');
        dirPathSegments.pop();
        path = dirPathSegments.join('/');
        console.log('dir: ' + path);
        this.file.readAsArrayBuffer(path, name).then(function (buffer) {
            _this.translate.get(["uploading_image", "image_uploaded"]).subscribe(function (value) {
                _this.presentLoading(value["uploading_image"]);
                _this.progress = true;
                _this._firebase.uploadBlob(new Blob([buffer], { type: mime })).then(function (url) {
                    _this.progress = false;
                    _this.user.avatar_url = String(url);
                    window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].USER_KEY, JSON.stringify(_this.user));
                    _this.service.updateUser(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(_this.user.id), { meta_data: [{ key: "avatar_url", value: String(url) }] }).subscribe(function (data) {
                        console.log("dpUpdated", data);
                        _this.dismissLoading();
                        _this.showToast(value["image_uploaded"]);
                        _this.events.publish("user:login", data);
                        _this.navCtrl.pop();
                    }, function (err) {
                        console.log(err);
                        _this.dismissLoading();
                        _this.navCtrl.pop();
                    });
                    console.log("Url is", url);
                }).catch(function (err) {
                    _this.progress = false;
                    _this.dismissLoading();
                    _this.showToast(JSON.stringify(err));
                    console.log(err);
                });
            });
        }).catch(function (err) {
            _this.dismissLoading();
            _this.showToast(JSON.stringify(err));
            console.log(err);
        });
    };
    ProfilePage.prototype.updateInfo = function () {
        var _this = this;
        if (!this.user.first_name || this.user.first_name.length < 3) {
            this.translate.get('field_error_name_full').subscribe(function (value) { return _this.showToast(value); });
        }
        else {
            this.translate.get(["just_a_moment", "updated"]).subscribe(function (values) {
                _this.presentLoading(values["just_a_moment"]);
                _this.service.updateUser(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(_this.user.id), { first_name: _this.user.first_name, email: _this.user.email }).subscribe(function (data) {
                    console.log("updateUser", data);
                    _this.dismissLoading();
                    _this.showToast(values["updated"]);
                    window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].USER_KEY, JSON.stringify(data));
                    _this.events.publish("user:login", data);
                    _this.navCtrl.pop();
                }, function (err) {
                    console.log(err);
                    _this.dismissLoading();
                    _this.navCtrl.pop();
                });
            });
        }
    };
    ProfilePage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    ProfilePage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    ProfilePage.prototype.presentErrorAlert = function (msg) {
        var _this = this;
        this.translate.get(['error', 'dismiss']).subscribe(function (text) {
            var alert = _this.alertCtrl.create({
                title: text['error'],
                subTitle: msg,
                buttons: [text['dismiss']]
            });
            alert.present();
        });
    };
    ProfilePage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 2000,
            position: 'top'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    ProfilePage.prototype.isReadonly = function () {
        return true;
    };
    ProfilePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-profile',template:/*ion-inline-start:"D:\PTH\Laundry Shop\Salavai-User\src\pages\profile\profile.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{"profile" | translate}}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n    <div class="profile_img center_img animate__animated animate__zoomIn" style="--animate-duration: .3s;" (click)="openAction()">\n        <img *ngIf="user && user.avatar_url && user.avatar_url" [src]="user.avatar_url" class="crop_img">\n        <ion-icon *ngIf="!(user && user.avatar_url && user.avatar_url)" class="zmdi zmdi-camera"></ion-icon>\n    </div>\n\n    <ion-list no-lines class="form">\n        <ion-item class="animate__animated animate__fadeInUp">\n            <ion-icon name="md-person" item-start></ion-icon>\n            <ion-label floating>{{"address_name" | translate}}</ion-label>\n            <ion-input [(ngModel)]="user.first_name"></ion-input>\n        </ion-item>\n        <ion-item class="animate__animated animate__fadeInUp">\n            <ion-icon name="md-phone-portrait" item-start></ion-icon>\n            <ion-label floating>{{"phone" | translate}}</ion-label>\n            <ion-input disabled="true" [readonly]="isReadonly()" [(ngModel)]="usernameToShow"></ion-input>\n        </ion-item>\n        <ion-item class="animate__animated animate__fadeInUp">\n            <ion-icon name="md-mail" item-start></ion-icon>\n            <ion-label floating>{{"email" | translate}}</ion-label>\n            <ion-input disabled="true" [readonly]="isReadonly()" [(ngModel)]="user.email"></ion-input>\n        </ion-item>\n    </ion-list>\n\n\n</ion-content>\n\n<ion-footer no-border class="animate__animated animate__fadeInUp">\n    <button ion-button full *ngIf="user" (click)="updateInfo()">\n        {{"update" | translate}}\n    </button>\n</ion-footer>'/*ion-inline-end:"D:\PTH\Laundry Shop\Salavai-User\src\pages\profile\profile.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_6__providers_firebase__["a" /* FirebaseClient */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */], __WEBPACK_IMPORTED_MODULE_4__ionic_native_image_picker__["a" /* ImagePicker */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_file__["a" /* File */], __WEBPACK_IMPORTED_MODULE_6__providers_firebase__["a" /* FirebaseClient */], __WEBPACK_IMPORTED_MODULE_5__ionic_native_crop__["a" /* Crop */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* Platform */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_8__ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_7__providers_wordpress_client_service__["a" /* WordpressClient */]])
    ], ProfilePage);
    return ProfilePage;
}());

//# sourceMappingURL=profile.js.map

/***/ }),

/***/ 375:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FirebaseClient; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_firebase__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_firebase__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var FirebaseClient = /** @class */ (function () {
    function FirebaseClient() {
    }
    FirebaseClient.prototype.uploadBlob = function (blob) {
        return new Promise(function (resolve, reject) {
            var storageRef = __WEBPACK_IMPORTED_MODULE_1_firebase__["storage"]().ref();
            console.log("blobingat", storageRef);
            storageRef.child(new Date().toString()).put(blob).then(function (snapshot) {
                console.log(snapshot);
                __WEBPACK_IMPORTED_MODULE_1_firebase__["storage"]().ref(snapshot.metadata.fullPath).getDownloadURL().then(function (url) { return resolve(url); }).catch(function (err) { return reject(err); });
            }, function (err) {
                console.log("err", err);
                reject(err);
            });
        });
    };
    FirebaseClient.prototype.uploadFile = function (file) {
        return new Promise(function (resolve, reject) {
            var storageRef = __WEBPACK_IMPORTED_MODULE_1_firebase__["storage"]().ref();
            storageRef.child(new Date().toString()).put(file).then(function (snapshot) {
                console.log(snapshot);
                __WEBPACK_IMPORTED_MODULE_1_firebase__["storage"]().ref(snapshot.metadata.fullPath).getDownloadURL().then(function (url) { return resolve(url); }).catch(function (err) { return reject(err); });
            }, function (err) {
                reject(err);
            });
        });
    };
    FirebaseClient.prototype.uploadImage = function (imageURI) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var storageRef = __WEBPACK_IMPORTED_MODULE_1_firebase__["storage"]().ref();
            var imageRef = storageRef.child('image').child('imageName');
            _this.encodeImageUri(imageURI, function (image64) {
                imageRef.putString(image64, 'data_url').then(function (snapshot) {
                    resolve(snapshot.downloadURL);
                }, function (err) {
                    reject(err);
                });
            });
        });
    };
    FirebaseClient.prototype.encodeImageUri = function (imageUri, callback) {
        var c = document.createElement('canvas');
        var ctx = c.getContext("2d");
        var img = new Image();
        img.onload = function () {
            var aux = this;
            c.width = aux.width;
            c.height = aux.height;
            ctx.drawImage(img, 0, 0);
            var dataURL = c.toDataURL("image/jpeg");
            callback(dataURL);
        };
        img.src = imageUri;
    };
    FirebaseClient = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])()
    ], FirebaseClient);
    return FirebaseClient;
}());

//# sourceMappingURL=firebase.js.map

/***/ }),

/***/ 378:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrderUpdateRequest; });
var OrderUpdateRequest = /** @class */ (function () {
    function OrderUpdateRequest(status) {
        this.status = status;
    }
    return OrderUpdateRequest;
}());

//# sourceMappingURL=order-update-request.models.js.map

/***/ }),

/***/ 379:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AboutPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__selectclothes_selectclothes__ = __webpack_require__(133);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AboutPage = /** @class */ (function () {
    function AboutPage(navCtrl) {
        this.navCtrl = navCtrl;
        this.settings = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].SETTINGS));
        this.categoriesAll = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].PRODUCT_CATEGORIES_PARENT));
    }
    AboutPage.prototype.selectclothes = function (value) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__selectclothes_selectclothes__["a" /* SelectclothesPage */], { cat: value });
    };
    AboutPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-about',template:/*ion-inline-start:"D:\PTH\Laundry Shop\Salavai-User\src\pages\about\about.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>\n            {{"faq" | translate}}\n        </ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content>\n    <div *ngIf="settings" padding-left padding-right padding-top>\n        <div class="logo animate__animated animate__zoomIn" style="--animate-duration: .3s;" text-center>\n            <img src="assets/imgs/logo.png">\n        </div>\n        <h2 class="animate__animated animate__fadeInUp">{{"faq" | translate}}</h2>\n        <p class="animate__animated animate__fadeInUp" [innerHTML]="settings.laundry_appconfig_faq"></p>\n    </div>\n    \n    <div *ngIf="categoriesAll && categoriesAll.length" class="services" padding-top padding-bottom>\n        <p padding-left padding-right>{{"our_service" | translate}}</p>\n        <ion-scroll scrollX="true">\n            <div class="item_box animate__animated animate__zoomIn" *ngFor="let cat of categoriesAll" (click)="selectclothes(cat)">\n                <div class="img_box center_img">\n                    <img *ngIf="cat.image != null" data-src="{{cat.image.src}}" class="crop_img">\n                    <img *ngIf="cat.image == null" src="assets/imgs/logo.png" class="crop_img">\n                </div>\n                <p [innerHTML]="cat.name"></p>\n            </div>\n        </ion-scroll>\n    </div>\n</ion-content>'/*ion-inline-end:"D:\PTH\Laundry Shop\Salavai-User\src\pages\about\about.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */]])
    ], AboutPage);
    return AboutPage;
}());

//# sourceMappingURL=about.js.map

/***/ }),

/***/ 380:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CodePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_wordpress_client_service__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_moment__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var CodePage = /** @class */ (function () {
    function CodePage(translate, service, loadingCtrl, toastCtrl, viewCtrl) {
        this.translate = translate;
        this.service = service;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.viewCtrl = viewCtrl;
        this.cCode = "";
        this.loadingShown = false;
        this.subscriptions = [];
    }
    CodePage.prototype.ionViewWillLeave = function () {
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        this.dismissLoading();
    };
    CodePage.prototype.checkCode = function () {
        var _this = this;
        if (!this.cCode.length) {
            this.translate.get('field_error_couponcode').subscribe(function (value) {
                _this.showToast(value);
            });
        }
        else {
            this.translate.get('just_a_moment').subscribe(function (value) {
                _this.presentLoading(value);
                _this.subscriptions.push(_this.service.getCouponByCode(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), _this.cCode).subscribe(function (data) {
                    _this.dismissLoading();
                    var coupons = data;
                    if (!coupons.length) {
                        _this.translate.get('field_error_invalid_couponcode').subscribe(function (value) {
                            _this.showToast(value);
                        });
                    }
                    else if (__WEBPACK_IMPORTED_MODULE_5_moment___default()().valueOf() > __WEBPACK_IMPORTED_MODULE_5_moment___default()(coupons[0].date_expires).valueOf()) {
                        _this.translate.get('cpn_expire').subscribe(function (value) {
                            _this.showToast(value);
                        });
                    }
                    else {
                        window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].SELECTED_COUPON, JSON.stringify(coupons[0]));
                        _this.dismiss();
                    }
                }, function (err) {
                    console.log("getCouponByCode", err);
                    _this.dismissLoading();
                    _this.translate.get('field_error_invalid_couponcode').subscribe(function (value) {
                        _this.showToast(value);
                    });
                }));
            });
        }
    };
    CodePage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    CodePage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    CodePage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    CodePage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 2000,
            position: 'top'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    CodePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-code ',template:/*ion-inline-start:"D:\PTH\Laundry Shop\Salavai-User\src\pages\code\code.html"*/'<ion-content class="bg-light">\n    <div class="code animate__animated animate__zoomIn" style="--animate-duration: .3s;">\n        <h2 class="animate__animated animate__fadeInUp" style="--animate-duration: .4s;">\n            {{"coupon_code" | translate}}\n        </h2>\n        <ion-list no-lines class="form">\n            <ion-item class="animate__animated animate__fadeInUp" style="--animate-duration: .45s;">\n                <ion-input type="text" value="" [(ngModel)]="cCode" placeholder="{{\'enter_prom_code\' | translate}}">\n                </ion-input>\n            </ion-item>\n        </ion-list>\n        <ion-row class="animate__animated animate__fadeInUp" style="--animate-duration: .5s;">\n            <ion-col col-6>\n                <button ion-button block clear class="bg-thime btn-round btn-text" (click)="dismiss()">\n                    {{"cancel" | translate}}\n                </button>\n            </ion-col>\n            <ion-col col-6>\n                <button ion-button block class="bg-thime btn-round btn-text" (click)="checkCode()">\n                    {{"submit" | translate}}\n                </button>\n            </ion-col>\n        </ion-row>\n    </div>\n</ion-content>'/*ion-inline-end:"D:\PTH\Laundry Shop\Salavai-User\src\pages\code\code.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_2__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ViewController */]])
    ], CodePage);
    return CodePage;
}());

//# sourceMappingURL=code.js.map

/***/ }),

/***/ 381:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PhonePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pages_otp_otp__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_register_request_models__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_wordpress_client_service__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__app_app_config__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__node_modules_ngx_translate_core__ = __webpack_require__(11);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};








var PhonePage = /** @class */ (function () {
    function PhonePage(config, navCtrl, alertCtrl, loadingCtrl, toastCtrl, navParam, platform, app, service, translate) {
        this.config = config;
        this.navCtrl = navCtrl;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.platform = platform;
        this.app = app;
        this.service = service;
        this.translate = translate;
        this.loadingShown = false;
        this.captchanotvarified = true;
        this.otpNotsent = false;
        this.registerRequest = new __WEBPACK_IMPORTED_MODULE_4__models_register_request_models__["a" /* RegisterRequest */]('', '', '', '', '');
        this.subscriptions = [];
        this.getCountries();
        this.changeHint();
        this.registerRequest = navParam.get("registerRequest");
    }
    PhonePage.prototype.getCountries = function () {
        var _this = this;
        this.service.getCountries().subscribe(function (data) { return _this.countries = data; }, function (err) { return console.log(err); });
    };
    PhonePage.prototype.changeHint = function () {
        var _this = this;
        this.registerRequest.username = "";
        if (this.countryCode && this.countryCode.length) {
            this.translate.get('phone_excluding').subscribe(function (value) { return _this.phone_hint = (value + " (+" + _this.countryCode + ")"); });
        }
        else {
            this.translate.get('phone').subscribe(function (value) { return _this.phone_hint = value; });
        }
    };
    PhonePage.prototype.createUser = function () {
        var _this = this;
        if (!this.countryCode || !this.countryCode.length) {
            this.translate.get("select_country").subscribe(function (value) { return _this.showToast(value); });
            return;
        }
        if (!this.registerRequest.username || !this.registerRequest.username.length) {
            this.translate.get("field_error_phone").subscribe(function (value) { return _this.showToast(value); });
            return;
        }
        this.translate.get(['otp_alert_msg', 'no', 'yes', 'check_phone', 'mobile_exist']).subscribe(function (text) {
            var alert = _this.alertCtrl.create({
                title: "+" + _this.countryCode + _this.registerRequest.username,
                message: text['otp_alert_msg'],
                buttons: [{
                        text: text['no'],
                        role: 'cancel',
                        handler: function () {
                            console.log('Cancel clicked');
                        }
                    }, {
                        text: text['yes'],
                        handler: function () {
                            _this.presentLoading(text['check_phone']);
                            _this.registerRequest.password = Math.random().toString(36).slice(-6);
                            _this.subscriptions.push(_this.service.createUser(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), _this.countryCode, _this.registerRequest).subscribe(function (data) {
                                var haveImgToUpdate = false;
                                if (_this.registerRequest && _this.registerRequest.meta_data) {
                                    for (var _i = 0, _a = _this.registerRequest.meta_data; _i < _a.length; _i++) {
                                        var meta = _a[_i];
                                        if (meta.key == "avatar_url" && meta.value && meta.value.length) {
                                            haveImgToUpdate = true;
                                            break;
                                        }
                                    }
                                }
                                if (haveImgToUpdate) {
                                    _this.service.updateUser(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(data.id), { meta_data: _this.registerRequest.meta_data }).subscribe(function (data) {
                                        console.log("dpUpdated", data);
                                    }, function (err) {
                                        console.log(err);
                                    });
                                }
                                _this.dismissLoading();
                                _this.registerResponse = data;
                                _this.app.getRootNav().push(__WEBPACK_IMPORTED_MODULE_3__pages_otp_otp__["a" /* OtpPage */], { username: _this.countryCode + _this.registerRequest.username, password: _this.registerRequest.password });
                            }, function (err) {
                                console.log(err);
                                _this.showToast(text['mobile_exist']);
                                _this.dismissLoading();
                            }));
                        }
                    }]
            });
            alert.present();
        });
    };
    PhonePage.prototype.makeExitAlert = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'App termination',
            message: 'Do you want to close the app?',
            buttons: [{
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log('Application exit prevented!');
                    }
                }, {
                    text: 'Close App',
                    handler: function () {
                        _this.platform.exitApp(); // Close this application
                    }
                }]
        });
        alert.present();
    };
    PhonePage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    PhonePage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    PhonePage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    PhonePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-phone',template:/*ion-inline-start:"D:\PTH\Laundry Shop\Salavai-User\src\pages\phone\phone.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title text-center>{{config.appName}}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content padding-top padding-left padding-right>\n    <div class="logo_box">\n        <img src="assets/imgs/logo.png">\n    </div>\n    <p text-center>{{\'enter_phone_text\' | translate}} <br />{{\'enter_phone_text1\' | translate}}</p>\n    <ion-list no-lines class="form">\n        <ion-item>\n            <ion-icon name="md-globe" item-start></ion-icon>\n            <ion-label floating>{{\'address_country\' | translate}}</ion-label>\n            <ion-select [(ngModel)]="countryCode" cancelText="{{\'cancel\' | translate}}" okText="{{\'okay\' | translate}}" multiple="false" (ionChange)="changeHint()">\n                <ion-option [value]="country.callingCodes[0]" *ngFor="let country of countries">{{country.name}}\n                </ion-option>\n            </ion-select>\n\n        </ion-item>\n\n        <ion-item>\n            <ion-icon name="md-phone-portrait" item-start></ion-icon>\n            <ion-label floating>{{phone_hint}}</ion-label>\n            <ion-input type="tel" [(ngModel)]="registerRequest.username">\n            </ion-input>\n        </ion-item>\n    </ion-list>\n    <button ion-button block class="bg-thime btn-round btn-text" (click)="createUser()">\n        {{\'Continue\' | translate}}\n    </button>\n</ion-content>'/*ion-inline-end:"D:\PTH\Laundry Shop\Salavai-User\src\pages\phone\phone.html"*/
        }),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_6__app_app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* Platform */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_5__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_7__node_modules_ngx_translate_core__["c" /* TranslateService */]])
    ], PhonePage);
    return PhonePage;
}());

//# sourceMappingURL=phone.js.map

/***/ }),

/***/ 383:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CreateaccountPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_wordpress_client_service__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_register_request_models__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_otp_otp__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__app_app_config__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__node_modules_ngx_translate_core__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_file__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_native_image_picker__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_native_crop__ = __webpack_require__(128);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__providers_firebase__ = __webpack_require__(375);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};












var CreateaccountPage = /** @class */ (function () {
    function CreateaccountPage(config, events, toastCtrl, navCtrl, service, app, imagePicker, loadingCtrl, alertCtrl, cropService, platform, modalCtrl, translate, file, _firebase) {
        this.config = config;
        this.events = events;
        this.toastCtrl = toastCtrl;
        this.navCtrl = navCtrl;
        this.service = service;
        this.app = app;
        this.imagePicker = imagePicker;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.cropService = cropService;
        this.platform = platform;
        this.modalCtrl = modalCtrl;
        this.translate = translate;
        this.file = file;
        this._firebase = _firebase;
        this.loadingShown = false;
        this.subscriptions = [];
        this.registerRequest = new __WEBPACK_IMPORTED_MODULE_3__models_register_request_models__["a" /* RegisterRequest */]('', '', '', '', '');
        this.registerRequestPasswordConfirm = '';
        this.progress = false;
        this.getCountries();
        this.changeHint();
    }
    CreateaccountPage.prototype.getCountries = function () {
        var _this = this;
        this.service.getCountries().subscribe(function (data) { return _this.countries = data; }, function (err) { return console.log(err); });
    };
    CreateaccountPage.prototype.changeHint = function () {
        var _this = this;
        this.registerRequest.username = "";
        if (this.countryCode && this.countryCode.length) {
            this.translate.get('phone_excluding').subscribe(function (value) { return _this.phone_hint = (value + " (+" + _this.countryCode + ")"); });
        }
        else {
            this.translate.get('phone').subscribe(function (value) { return _this.phone_hint = value; });
        }
    };
    CreateaccountPage.prototype.openAction1 = function () {
        var _this = this;
        this.platform.ready().then(function () {
            if (_this.platform.is("cordova")) {
                _this.imagePicker.getPictures({
                    maximumImagesCount: 1,
                }).then(function (results) {
                    if (results && results[0]) {
                        _this.reduceImages(results).then(function () {
                            console.log('cropped_images');
                        });
                    }
                }, function (err) {
                    console.log("getPictures", JSON.stringify(err));
                });
            }
        });
    };
    CreateaccountPage.prototype.reduceImages = function (selected_pictures) {
        var _this = this;
        return selected_pictures.reduce(function (promise, item) {
            return promise.then(function (result) {
                return _this.cropService.crop(item, { quality: 100 }).then(function (cropped_image) {
                    _this.resolveUri(cropped_image);
                });
            });
        }, Promise.resolve());
    };
    CreateaccountPage.prototype.resolveUri = function (uri) {
        var _this = this;
        console.log('uri: ' + uri);
        if (this.platform.is("android") && uri.startsWith('content://') && uri.indexOf('/storage/') != -1) {
            uri = "file://" + uri.substring(uri.indexOf("/storage/"), uri.length);
            console.log('file: ' + uri);
        }
        this.file.resolveLocalFilesystemUrl(uri).then(function (entry) {
            console.log(entry);
            var fileEntry = entry;
            fileEntry.file(function (success) {
                var mimeType = success.type;
                console.log(mimeType);
                var dirPath = entry.nativeURL;
                _this.upload(dirPath, entry.name, mimeType);
            }, function (error) {
                console.log(error);
            });
        });
    };
    CreateaccountPage.prototype.upload = function (path, name, mime) {
        var _this = this;
        console.log('original: ' + path);
        var dirPathSegments = path.split('/');
        dirPathSegments.pop();
        path = dirPathSegments.join('/');
        console.log('dir: ' + path);
        this.file.readAsArrayBuffer(path, name).then(function (buffer) {
            _this.presentLoading("Uploading image");
            _this.progress = true;
            _this._firebase.uploadBlob(new Blob([buffer], { type: mime })).then(function (url) {
                _this.progress = false;
                _this.dismissLoading();
                _this.showToast("Image uploaded");
                console.log("Url is", url);
                _this.imageUrl = String(url);
            }).catch(function (err) {
                _this.progress = false;
                _this.dismissLoading();
                _this.showToast(JSON.stringify(err));
                console.log(err);
            });
        }).catch(function (err) {
            _this.dismissLoading();
            _this.showToast(JSON.stringify(err));
            console.log(err);
        });
    };
    CreateaccountPage.prototype.register = function () {
        var _this = this;
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        // if (!this.imageUrl || !this.imageUrl.length) {
        // 	this.translate.get('field_error_image').subscribe(value => this.showToast(value));
        // } else
        if (this.registerRequest.first_name == "" || !this.registerRequest.first_name.length) {
            this.translate.get('field_error_name_full').subscribe(function (value) { return _this.showToast(value); });
        }
        else if (!this.countryCode || !this.countryCode.length) {
            this.translate.get('field_error_country').subscribe(function (value) { return _this.showToast(value); });
        }
        else if (!this.registerRequest.username.length) {
            this.translate.get('field_error_phone_valid').subscribe(function (value) { return _this.showToast(value); });
        }
        else if (this.registerRequest.email.length <= 5 || !reg.test(this.registerRequest.email)) {
            this.translate.get('field_error_email').subscribe(function (value) { return _this.showToast(value); });
        }
        else if (this.registerRequest.password.length < 6) {
            this.translate.get('field_error_password').subscribe(function (value) { return _this.showToast(value); });
        }
        else {
            this.translate.get(["loading_sign_up", "invalid_credentials_register", "signup_success"]).subscribe(function (values) {
                _this.presentLoading(values["loading_sign_up"]);
                _this.subscriptions.push(_this.service.createUser(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), _this.countryCode, _this.registerRequest).subscribe(function (data) {
                    _this.dismissLoading();
                    _this.registerResponse = data;
                    _this.showToast(values["signup_success"]);
                    if (_this.imageUrl && _this.imageUrl.length) {
                        _this.service.updateUser(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(_this.registerResponse.id), { meta_data: [{ key: "avatar_url", value: _this.imageUrl }] }).subscribe(function (data) { return console.log("dpUpdated", data); }, function (err) { return console.log(err); });
                    }
                    _this.app.getRootNav().push(__WEBPACK_IMPORTED_MODULE_5__pages_otp_otp__["a" /* OtpPage */], { username: _this.countryCode + _this.registerRequest.username, password: _this.registerRequest.password });
                    // Now we are veryfying the mobile no. first.
                    // let registerResponse: RegisterResponse = data;
                    // this.signIn(String(registerResponse.id), this.registerRequest.username, this.registerRequest.password);
                }, function (err) {
                    console.log("createUser", err);
                    _this.dismissLoading();
                    _this.presentErrorAlert(values["invalid_credentials_register"]);
                }));
            });
        }
    };
    CreateaccountPage.prototype.signinPage = function () {
        this.navCtrl.pop();
    };
    CreateaccountPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({ content: message });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    CreateaccountPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    CreateaccountPage.prototype.presentErrorAlert = function (msg) {
        var _this = this;
        this.translate.get(['error', 'dismiss']).subscribe(function (text) {
            var alert = _this.alertCtrl.create({
                title: text['error'],
                subTitle: msg,
                buttons: [text['dismiss']]
            });
            alert.present();
        });
    };
    CreateaccountPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 2000,
            position: 'top'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    CreateaccountPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-createaccount',template:/*ion-inline-start:"D:\PTH\Laundry Shop\Salavai-User\src\pages\createaccount\createaccount.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{"register" | translate}}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content padding-top padding-left padding-right>\n    <div class="profile_img center_img animate__animated animate__zoomIn" style="--animate-duration: .3s;" (click)="openAction1()">\n        <img *ngIf="imageUrl && imageUrl.length" [src]="imageUrl" class="crop_img">\n        <ion-icon *ngIf="!imageUrl || !imageUrl.length" class="zmdi zmdi-camera"></ion-icon>\n    </div>\n\n    <ion-list no-lines class="form">\n        <ion-item class="animate__animated animate__fadeInUp">\n            <ion-icon name="md-person" item-start></ion-icon>\n            <ion-label floating>{{\'address_name\' | translate}}</ion-label>\n            <ion-input type="text" text-right [(ngModel)]="registerRequest.first_name"></ion-input>\n        </ion-item>\n        <!-- <ion-item class="animate__animated animate__fadeInUp">\n			<ion-icon name="md-person" item-start></ion-icon>\n			<ion-label floating>{{\'address_last_name\' | translate}}</ion-label>\n			<ion-input type="text" text-right placeholder="" [(ngModel)]="registerRequest.last_name"></ion-input>\n		</ion-item> -->\n        <ion-item class="animate__animated animate__fadeInUp">\n            <ion-icon name="md-globe" item-start></ion-icon>\n            <ion-label floating>{{\'address_country\' | translate}}</ion-label>\n            <ion-select [(ngModel)]="countryCode" placeholder="" multiple="false" cancelText="{{\'cancel\' | translate}}" okText="{{\'okay\' | translate}}" (ionChange)="changeHint()">\n                <ion-option [value]="country.callingCodes[0]" *ngFor="let country of countries">{{country.name}}\n                </ion-option>\n            </ion-select>\n        </ion-item>\n        <ion-item class="animate__animated animate__fadeInUp">\n            <ion-icon name="md-phone-portrait" item-start></ion-icon>\n            <ion-label floating>{{phone_hint}}</ion-label>\n            <ion-input type="tel" text-right placeholder="" [(ngModel)]="registerRequest.username"></ion-input>\n        </ion-item>\n        <ion-item class="animate__animated animate__fadeInUp">\n            <ion-icon name="md-mail" item-start></ion-icon>\n            <ion-label floating>{{\'email\' | translate}}</ion-label>\n            <ion-input type="email" text-right placeholder="" [(ngModel)]="registerRequest.email"></ion-input>\n        </ion-item>\n        <ion-item class="animate__animated animate__fadeInUp">\n            <ion-icon name="md-lock" item-start></ion-icon>\n            <ion-label floating>{{\'password\' | translate}}</ion-label>\n            <ion-input type="password" text-right placeholder="" [(ngModel)]="registerRequest.password"></ion-input>\n        </ion-item>\n        <!-- <ion-item class="animate__animated animate__fadeInUp">\n			<ion-icon name="md-lock" item-start></ion-icon>\n			<ion-label floating>{{\'c2_password\' | translate}}</ion-label>\n			<ion-input type="password" text-right placeholder="" [(ngModel)]="registerRequestPasswordConfirm">\n			</ion-input>\n		</ion-item> -->\n    </ion-list>\n\n</ion-content>\n\n<ion-footer no-border padding-left padding-right class="animate__animated animate__fadeInUp" style="--animate-duration: .4s;">\n    <button ion-button block (click)="register()">{{"register" | translate}}</button>\n</ion-footer>'/*ion-inline-end:"D:\PTH\Laundry Shop\Salavai-User\src\pages\createaccount\createaccount.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_11__providers_firebase__["a" /* FirebaseClient */]]
        }),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_6__app_app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */], __WEBPACK_IMPORTED_MODULE_9__ionic_native_image_picker__["a" /* ImagePicker */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_10__ionic_native_crop__["a" /* Crop */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* ModalController */], __WEBPACK_IMPORTED_MODULE_7__node_modules_ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_8__ionic_native_file__["a" /* File */], __WEBPACK_IMPORTED_MODULE_11__providers_firebase__["a" /* FirebaseClient */]])
    ], CreateaccountPage);
    return CreateaccountPage;
}());

//# sourceMappingURL=createaccount.js.map

/***/ }),

/***/ 385:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PasswordPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_wordpress_client_service__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ngx_translate_core__ = __webpack_require__(11);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var PasswordPage = /** @class */ (function () {
    function PasswordPage(translate, toastCtrl, navCtrl, service, loadingCtrl) {
        this.translate = translate;
        this.toastCtrl = toastCtrl;
        this.navCtrl = navCtrl;
        this.service = service;
        this.loadingCtrl = loadingCtrl;
        this.loadingShown = false;
        this.subscriptions = [];
    }
    PasswordPage.prototype.resetPassword = function () {
        var _this = this;
        if (this.userLogin && this.userLogin.length) {
            this.translate.get('loading_password_reset').subscribe(function (value) {
                _this.presentLoading(value);
                var subscription = _this.service.resetPassword(_this.userLogin).subscribe(function (data) {
                    _this.dismissLoading();
                    _this.navCtrl.pop();
                }, function (err) {
                    _this.dismissLoading();
                    _this.navCtrl.pop();
                });
                _this.subscriptions.push(subscription);
            });
        }
        else {
            this.translate.get('field_error_email').subscribe(function (value) { return _this.showToast(value); });
        }
    };
    PasswordPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    PasswordPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    PasswordPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    PasswordPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-password',template:/*ion-inline-start:"D:\PTH\Laundry Shop\Salavai-User\src\pages\password\password.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{\'forgot_password\' | translate}}</ion-title>\n    </ion-navbar>\n</ion-header>\n<ion-content padding>\n    <p class="animate__animated animate__fadeInUp" style="--animate-duration: .3s !important;" text-center>{{"reset_password_box1" | translate}}<br>{{"reset_password3" | translate}}</p>\n    <ion-list no-lines class="form">\n        <ion-item class="animate__animated animate__fadeInUp" style="--animate-duration: .35s !important;">\n            <ion-icon name="md-mail" item-start></ion-icon>\n            <ion-label floating>{{"reset_password_box1" | translate}}</ion-label>\n            <ion-input type="email" text-right [(ngModel)]="userLogin"></ion-input>\n        </ion-item>\n    </ion-list>\n    <button ion-button block class="animate__animated animate__fadeInUp" style="--animate-duration: .4s !important;" (click)="resetPassword()">{{"submit" | translate}}</button>\n</ion-content>'/*ion-inline-end:"D:\PTH\Laundry Shop\Salavai-User\src\pages\password\password.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */]])
    ], PasswordPage);
    return PasswordPage;
}());

//# sourceMappingURL=password.js.map

/***/ }),

/***/ 387:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SelectareaPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__ = __webpack_require__(388);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_google_maps__ = __webpack_require__(389);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_my_location_models__ = __webpack_require__(499);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__models_address_models__ = __webpack_require__(500);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__add_address_title_add_address_title__ = __webpack_require__(392);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ngx_translate_core__ = __webpack_require__(11);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var SelectareaPage = /** @class */ (function () {
    function SelectareaPage(navCtrl, menuCtrl, loadingCtrl, modalCtrl, navparam, zone, maps, translate, geolocation, toastCtrl, events) {
        this.navCtrl = navCtrl;
        this.menuCtrl = menuCtrl;
        this.loadingCtrl = loadingCtrl;
        this.modalCtrl = modalCtrl;
        this.zone = zone;
        this.maps = maps;
        this.translate = translate;
        this.geolocation = geolocation;
        this.toastCtrl = toastCtrl;
        this.events = events;
        this.query = '';
        this.places = [];
        this.modalPresented = false;
        this.subscriptions = [];
        this.loadingShown = false;
        this.menuCtrl.enable(false, 'myMenu');
        this.searchDisabled = true;
        this.saveDisabled = true;
        this.address = navparam.get("address");
    }
    SelectareaPage.prototype.ionViewWillLeave = function () {
        if (this.addressSaveModal)
            this.addressSaveModal.dismiss();
        this.subscriptions.forEach(function (subscription) {
            subscription.unsubscribe();
        });
        this.dismissLoading();
    };
    SelectareaPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        if (!this.initialized) {
            var mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then(function () {
                _this.autocompleteService = new google.maps.places.AutocompleteService();
                _this.placesService = new google.maps.places.PlacesService(_this.maps.map);
                _this.searchDisabled = false;
                _this.maps.map.addListener('click', function (event) {
                    if (event && event.latLng) {
                        _this.onMapClick(new google.maps.LatLng(event.latLng.lat(), event.latLng.lng()));
                    }
                });
                _this.initialized = true;
                if (_this.address && _this.address.address_2) {
                    var address2split = _this.address.address_2.split(",");
                    if (address2split && address2split.length >= 2 && Number(address2split[0]) && Number(address2split[1])) {
                        _this.location = new __WEBPACK_IMPORTED_MODULE_5__models_my_location_models__["a" /* MyLocation */]();
                        _this.location.name = _this.address.address_1;
                        _this.location.lat = address2split[0];
                        _this.location.lng = address2split[1];
                        _this.location.postal_code = _this.address.postcode;
                        _this.onMapClick(new google.maps.LatLng(Number(address2split[0]), Number(address2split[1])));
                    }
                    else {
                        _this.detect();
                    }
                }
                else {
                    _this.detect();
                }
            }).catch(function (err) {
                console.log(err);
                _this.close();
            });
            mapLoaded.catch(function (err) {
                console.log(err);
                _this.close();
            });
        }
    };
    SelectareaPage.prototype.onMapClick = function (pos) {
        var _this = this;
        if (pos) {
            if (!this.marker) {
                this.marker = new google.maps.Marker({ position: pos, map: this.maps.map });
                this.marker.setClickable(true);
                this.marker.addListener('click', function (event) {
                    console.log("markerevent", event);
                    _this.showToast(_this.location.name);
                });
            }
            else {
                this.marker.setPosition(pos);
            }
            this.maps.map.panTo(pos);
            var geocoder = new google.maps.Geocoder();
            var request = { location: pos };
            geocoder.geocode(request, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
                    console.log("geocode", results[0]);
                    _this.saveDisabled = false;
                    _this.location = new __WEBPACK_IMPORTED_MODULE_5__models_my_location_models__["a" /* MyLocation */]();
                    _this.location.name = results[0].formatted_address;
                    _this.location.lat = String(pos.lat());
                    _this.location.lng = String(pos.lng());
                    _this.location.postal_code = _this.getAddressComponents("postal_code", results[0].address_components);
                    var keyToFind = "administrative_area_level_1";
                    for (var i = 1; i <= 10; i++) {
                        var administrative_area = _this.getAddressComponents(("administrative_area_level_" + i), results[0].address_components);
                        if (administrative_area && administrative_area.length == 2) {
                            keyToFind = ("administrative_area_level_" + i);
                            break;
                        }
                    }
                    console.log("keyToFind", keyToFind);
                    _this.location.state = _this.getAddressComponents(keyToFind, results[0].address_components);
                    _this.location.country = _this.getAddressComponents("country", results[0].address_components);
                    console.log("gen", _this.location);
                    _this.showToast(_this.location.name);
                }
            });
        }
    };
    SelectareaPage.prototype.selectPlace = function (place) {
        var _this = this;
        this.query = place.description;
        setTimeout(function () {
            console.log(_this.query);
        }, 2000);
        this.places = [];
        var myLocation = new __WEBPACK_IMPORTED_MODULE_5__models_my_location_models__["a" /* MyLocation */]();
        myLocation.name = place.name;
        this.placesService.getDetails({ placeId: place.place_id }, function (details) {
            _this.zone.run(function () {
                _this.onMapClick(new google.maps.LatLng(Number(details.geometry.location.lat()), Number(details.geometry.location.lng())));
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
    };
    SelectareaPage.prototype.getAddressComponents = function (what, addressComponents) {
        var toReturn = "";
        if (addressComponents && addressComponents.length) {
            for (var _i = 0, addressComponents_1 = addressComponents; _i < addressComponents_1.length; _i++) {
                var ac = addressComponents_1[_i];
                if (toReturn.length)
                    break;
                if (ac.types && ac.types.length) {
                    for (var _a = 0, _b = ac.types; _a < _b.length; _a++) {
                        var t = _b[_a];
                        if (t == what) {
                            toReturn = ac.short_name;
                            break;
                        }
                    }
                }
            }
        }
        return toReturn;
    };
    SelectareaPage.prototype.searchPlace = function () {
        var _this = this;
        this.saveDisabled = true;
        if (this.query.length > 0 && !this.searchDisabled) {
            var config = {
                //types: ['geocode'],
                input: this.query
            };
            this.autocompleteService.getPlacePredictions(config, function (predictions, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK && predictions) {
                    _this.places = [];
                    predictions.forEach(function (prediction) {
                        _this.places.push(prediction);
                    });
                }
            });
        }
        else {
            this.places = [];
        }
    };
    SelectareaPage.prototype.detect = function () {
        var _this = this;
        this.geolocation.getCurrentPosition().then(function (position) {
            _this.onMapClick(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
        }).catch(function (err) {
            console.log("getCurrentPosition", err);
            _this.showToast("Location detection failed");
        });
    };
    SelectareaPage.prototype.save = function () {
        var _this = this;
        if (this.location) {
            var addresses_1 = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].SELECTED_ADDRESS_LIST));
            if (!addresses_1)
                addresses_1 = new Array();
            if (!this.address) {
                this.address = new __WEBPACK_IMPORTED_MODULE_6__models_address_models__["a" /* Address */]();
                this.address.id = -1;
                var user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].USER_KEY));
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
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].KEY_LOCATION, JSON.stringify(this.location));
            this.addressSaveModal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_7__add_address_title_add_address_title__["a" /* Add_address_titlePage */], { address: this.address });
            this.addressSaveModal.present();
            this.addressSaveModal.onDidDismiss(function (data) {
                _this.modalPresented = false;
                if (data) {
                    _this.address = data;
                    if (_this.address.id == -1) {
                        _this.address.id = addresses_1.length + 1;
                        addresses_1.push(_this.address);
                    }
                    else {
                        var index = -1;
                        for (var i = 0; i < addresses_1.length; i++) {
                            if (_this.address.id == addresses_1[i].id) {
                                index = i;
                                break;
                            }
                        }
                        if (index != -1) {
                            addresses_1[index] = _this.address;
                        }
                    }
                    if (addresses_1.length == 1)
                        window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].SELECTED_ADDRESS, JSON.stringify(_this.address));
                    window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].SELECTED_ADDRESS_LIST, JSON.stringify(addresses_1));
                    _this.events.publish('address:saved');
                    _this.close();
                }
            });
            this.modalPresented = true;
        }
        else {
            this.translate.get("select_location").subscribe(function (value) { return _this.showToast(value); });
        }
    };
    SelectareaPage.prototype.close = function () {
        console.log("saved", this.location);
        this.navCtrl.pop();
    };
    SelectareaPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 2000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    SelectareaPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    SelectareaPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["_8" /* ViewChild */])('map'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1__angular_core__["t" /* ElementRef */])
    ], SelectareaPage.prototype, "mapElement", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["_8" /* ViewChild */])('pleaseConnect'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1__angular_core__["t" /* ElementRef */])
    ], SelectareaPage.prototype, "pleaseConnect", void 0);
    SelectareaPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["m" /* Component */])({
            selector: 'page-selectarea',template:/*ion-inline-start:"D:\PTH\Laundry Shop\Salavai-User\src\pages\selectarea\selectarea.html"*/'<ion-header>\n	<ion-navbar color="primary">\n		<ion-title>\n			<span (click)="close()">{{\'cancel\' | translate}}</span>\n			<button [disabled]="modalPresented" ion-button class="end" (click)="save()">\n				{{\'continue\' | translate}}\n			</button>\n		</ion-title>\n	</ion-navbar>\n\n	<ion-toolbar class="animate__animated animate__slideInDown" style="--animate-duration: .5s;"> \n		<ion-row>\n			<ion-col col-11>\n				<ion-searchbar [(ngModel)]="query" (ionInput)="searchPlace()"\n					placeholder="{{\'search_location\' | translate}}"></ion-searchbar>\n			</ion-col>\n			<ion-col col-1>\n				<ion-icon name="md-locate" (click)="detect()"></ion-icon>\n			</ion-col>\n		</ion-row>\n	</ion-toolbar>\n\n\n	<ion-list>\n		<ion-item class="animate__animated animate__fadeInUp" *ngFor="let place of places" (click)="selectPlace(place)">{{place.description}}</ion-item>\n	</ion-list>\n\n</ion-header>\n\n<ion-content>\n	<div #pleaseConnect id="please-connect">\n		<!-- <p>{{\'please_connect_to_the_internet\' | translate}}</p> -->\n	</div>\n	<div #map id="map">\n		<ion-spinner></ion-spinner>\n	</div>\n</ion-content>'/*ion-inline-end:"D:\PTH\Laundry Shop\Salavai-User\src\pages\selectarea\selectarea.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0_ionic_angular__["k" /* NavController */], __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["h" /* MenuController */], __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["g" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["i" /* ModalController */], __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["l" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1__angular_core__["M" /* NgZone */], __WEBPACK_IMPORTED_MODULE_3__providers_google_maps__["a" /* GoogleMaps */], __WEBPACK_IMPORTED_MODULE_8__ngx_translate_core__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["o" /* ToastController */], __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["c" /* Events */]])
    ], SelectareaPage);
    return SelectareaPage;
}());

//# sourceMappingURL=selectarea.js.map

/***/ }),

/***/ 389:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GoogleMaps; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__connectivity_service__ = __webpack_require__(390);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_config__ = __webpack_require__(18);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};



var GoogleMaps = /** @class */ (function () {
    function GoogleMaps(config, connectivityService) {
        this.config = config;
        this.connectivityService = connectivityService;
        this.mapInitialised = false;
    }
    GoogleMaps.prototype.init = function (mapElement, pleaseConnect) {
        this.mapElement = mapElement;
        this.pleaseConnect = pleaseConnect;
        return this.loadGoogleMaps();
    };
    GoogleMaps.prototype.loadGoogleMaps = function () {
        var _this = this;
        return new Promise(function (resolve) {
            if (typeof google == "undefined" || typeof google.maps == "undefined") {
                console.log("Google maps JavaScript needs to be loaded.");
                _this.disableMap();
                if (_this.connectivityService.isOnline()) {
                    window['mapInit'] = function () {
                        _this.initMap().then(function () {
                            resolve(true);
                        });
                        _this.enableMap();
                    };
                    var script = document.createElement("script");
                    script.id = "googleMaps";
                    if (_this.config.googleApiKey) {
                        script.src = 'http://maps.google.com/maps/api/js?key=' + _this.config.googleApiKey + '&callback=mapInit&libraries=places';
                    }
                    else {
                        script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
                    }
                    document.body.appendChild(script);
                }
            }
            else {
                if (_this.connectivityService.isOnline()) {
                    _this.initMap();
                    _this.enableMap();
                }
                else {
                    _this.disableMap();
                }
                resolve(true);
            }
            _this.addConnectivityListeners();
        });
    };
    GoogleMaps.prototype.initMap = function () {
        var _this = this;
        this.mapInitialised = true;
        return new Promise(function (resolve) {
            var latLng = new google.maps.LatLng(41.8719, 12.5674);
            var mapOptions = {
                center: latLng,
                zoom: 9,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            _this.map = new google.maps.Map(_this.mapElement, mapOptions);
            resolve(true);
        });
    };
    GoogleMaps.prototype.disableMap = function () {
        if (this.pleaseConnect) {
            this.pleaseConnect.style.display = "block";
        }
    };
    GoogleMaps.prototype.enableMap = function () {
        if (this.pleaseConnect) {
            this.pleaseConnect.style.display = "none";
        }
    };
    GoogleMaps.prototype.addConnectivityListeners = function () {
        var _this = this;
        this.connectivityService.watchOnline().subscribe(function () {
            setTimeout(function () {
                if (typeof google == "undefined" || typeof google.maps == "undefined") {
                    _this.loadGoogleMaps();
                }
                else {
                    if (!_this.mapInitialised) {
                        _this.initMap();
                    }
                    _this.enableMap();
                }
            }, 2000);
        });
        this.connectivityService.watchOffline().subscribe(function () {
            _this.disableMap();
        });
    };
    GoogleMaps = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_2__app_app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_1__connectivity_service__["a" /* Connectivity */]])
    ], GoogleMaps);
    return GoogleMaps;
}());

//# sourceMappingURL=google-maps.js.map

/***/ }),

/***/ 390:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Connectivity; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_network__ = __webpack_require__(391);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(5);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var Connectivity = /** @class */ (function () {
    function Connectivity(platform, network) {
        this.platform = platform;
        this.network = network;
        this.onDevice = this.platform.is('cordova');
    }
    Connectivity.prototype.isOnline = function () {
        if (this.onDevice && this.network.type) {
            return this.network.type != 'none';
        }
        else {
            return navigator.onLine;
        }
    };
    Connectivity.prototype.isOffline = function () {
        if (this.onDevice && this.network.type) {
            return this.network.type == 'none';
        }
        else {
            return !navigator.onLine;
        }
    };
    Connectivity.prototype.watchOnline = function () {
        return this.network.onConnect();
    };
    Connectivity.prototype.watchOffline = function () {
        return this.network.onDisconnect();
    };
    Connectivity = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["m" /* Platform */], __WEBPACK_IMPORTED_MODULE_1__ionic_native_network__["a" /* Network */]])
    ], Connectivity);
    return Connectivity;
}());

//# sourceMappingURL=connectivity-service.js.map

/***/ }),

/***/ 392:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Add_address_titlePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var Add_address_titlePage = /** @class */ (function () {
    function Add_address_titlePage(navParam, viewCtrl) {
        this.viewCtrl = viewCtrl;
        this.address = navParam.get("address");
        if (!this.address.type)
            this.address.type = 1;
    }
    Add_address_titlePage.prototype.cancel = function () {
        this.viewCtrl.dismiss(null);
    };
    Add_address_titlePage.prototype.save = function () {
        this.viewCtrl.dismiss(this.address);
    };
    Add_address_titlePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-add_address_title',template:/*ion-inline-start:"D:\PTH\Laundry Shop\Salavai-User\src\pages\add_address_title\add_address_title.html"*/'<ion-content (click)="cancel()">\n    \n</ion-content>\n\n<ion-footer no-border>\n    <ion-icon name="md-close" text-end class="close_btn" (click)="cancel()"></ion-icon>\n    <div class="form">\n        <ion-list no-lines>\n            <h3 class="animate__animated animate__fadeInUp" style="--animate-duration: .25s;">{{"select_address_type" | translate}}</h3>\n            <ion-row class="radio_group animate__animated animate__fadeInUp" style="--animate-duration: .3s;" radio-group [(ngModel)]="address.type">\n                <ion-col class="animate__animated animate__fadeInUp" style="--animate-duration: .45s;" col-4>\n                    <ion-item>\n                        <ion-label>\n                            <div class="img_box">\n                                <img src="assets/imgs/ic_home_active.png">\n                                <img src="assets/imgs/ic_home.png">\n                            </div>\n                            <h2>{{"address_type_home" | translate}}</h2>\n                        </ion-label>\n                        <ion-radio value="1"></ion-radio>\n                    </ion-item>\n                </ion-col>\n                <ion-col class="animate__animated animate__fadeInUp" style="--animate-duration: .5s;" col-4>\n                    <ion-item>\n                        <ion-label>\n                            <div class="img_box">\n                                <img src="assets/imgs/ic_office.png">\n                                <img src="assets/imgs/ic_office_active.png">\n                            </div>\n                            <h2>{{"address_type_office" | translate}}</h2>\n                        </ion-label>\n                        <ion-radio value="2"></ion-radio>\n                    </ion-item>\n                </ion-col>\n                <ion-col class="animate__animated animate__fadeInUp" style="--animate-duration: .55s;" col-4>\n                    <ion-item>\n                        <ion-label>\n                            <div class="img_box">\n                                <img src="assets/imgs/location.png">\n                                <img src="assets/imgs/ic_otherlocatio_active.png">\n                            </div>\n                            <h2>{{"address_type_other" | translate}}</h2>\n                        </ion-label>\n                        <ion-radio value="3"></ion-radio>\n                    </ion-item>\n                </ion-col>\n            </ion-row>\n            <ion-item class="animate__animated animate__fadeInUp" style="--animate-duration: .45s;">\n                <ion-label floating>{{"address_details" | translate}}</ion-label>\n                <ion-input type="text" [(ngModel)]="address.address_1"></ion-input>\n            </ion-item>\n        </ion-list>\n\n    </div>\n    <button ion-button full no-margin class="btn-orange btn animate__animated animate__fadeInUp" style="--animate-duration: .5s;" (click)="save()">\n        {{"save" | translate}}\n    </button>\n</ion-footer>'/*ion-inline-end:"D:\PTH\Laundry Shop\Salavai-User\src\pages\add_address_title\add_address_title.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ViewController */]])
    ], Add_address_titlePage);
    return Add_address_titlePage;
}());

//# sourceMappingURL=add_address_title.js.map

/***/ }),

/***/ 393:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PaymentPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_wordpress_client_service__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__tabs_tabs__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_order_request_models__ = __webpack_require__(501);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_global__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ngx_translate_core__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__models_order_update_request_models__ = __webpack_require__(378);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__models_key_value_models__ = __webpack_require__(502);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__models_card_info_models__ = __webpack_require__(503);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__models_stripe_request_models__ = __webpack_require__(504);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__models_shipping_line_models__ = __webpack_require__(505);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__app_app_config__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__models_line_item_models__ = __webpack_require__(506);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_js_sha512__ = __webpack_require__(507);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_js_sha512___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15_js_sha512__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__ionic_native_in_app_browser__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__models_helper_models__ = __webpack_require__(42);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};


















var PaymentPage = /** @class */ (function () {
    function PaymentPage(config, navParam, navCtrl, app, global, iab, translate, toastCtrl, service, loadingCtrl, alertCtrl) {
        this.config = config;
        this.navCtrl = navCtrl;
        this.app = app;
        this.global = global;
        this.iab = iab;
        this.translate = translate;
        this.toastCtrl = toastCtrl;
        this.service = service;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.loadingShown = false;
        this.placedPagePushed = false;
        this.paymentDone = false;
        this.paymentFailAlerted = false;
        this.subscriptions = [];
        this.paymentGateways = new Array();
        this.total = 0;
        this.couponApplied = false;
        this.deliveryPayble = '0';
        this.currencyIcon = '';
        this.currencyText = '';
        this.totalToShow = '';
        this.cardInfo = new __WEBPACK_IMPORTED_MODULE_10__models_card_info_models__["a" /* CardInfo */]();
        this.servicefee = 0;
        this.pickupTime = navParam.get("pickupTime");
        this.deliveryTime = navParam.get("deliveryTime");
        this.pickupSlot = navParam.get("pickupSlot");
        this.deliverySlot = navParam.get("deliverySlot");
        var currency = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].CURRENCY));
        if (currency) {
            this.currencyText = currency.value;
            var iconText = currency.options[currency.value];
            this.currencyIcon = iconText.substring(iconText.lastIndexOf('(') + 1, iconText.length - 1);
        }
        var paymentGateways = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].PAYMENT_GATEWAYS));
        this.selectedAddress = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].SELECTED_ADDRESS));
        this.shippingMethod = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].SELECTED_SHIPPING_METHOD));
        var savedCardInfo = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].CARD_INFO));
        if (savedCardInfo) {
            this.cardInfo.name = savedCardInfo.name;
            this.cardInfo.number = savedCardInfo.number;
            this.cardInfo.expMonth = savedCardInfo.expMonth;
            this.cardInfo.expYear = savedCardInfo.expYear;
        }
        if (paymentGateways != null) {
            for (var _i = 0, paymentGateways_1 = paymentGateways; _i < paymentGateways_1.length; _i++) {
                var pg = paymentGateways_1[_i];
                if (pg.enabled && this.paymentImplemented(pg.id)) {
                    this.paymentGateways.push(pg);
                }
            }
        }
        var settings = __WEBPACK_IMPORTED_MODULE_17__models_helper_models__["a" /* Helper */].getSetting("laundry_appconfig_servicefee");
        if (settings && settings.length) {
            this.servicefee = Number(Number(settings).toFixed(2));
            if (this.currencyIcon) {
                this.serviceHtml = this.currencyIcon + " " + this.servicefee;
            }
            else if (this.currencyText) {
                this.serviceHtml = this.currencyText + " " + this.servicefee;
            }
        }
        this.cartItems = this.global.getCartItems();
        this.coupon = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].SELECTED_COUPON));
        this.calculateTotal();
    }
    PaymentPage.prototype.calculateTotal = function () {
        var sum = 0;
        for (var _i = 0, _a = this.cartItems; _i < _a.length; _i++) {
            var item = _a[_i];
            item.vari.total_price = Number(item.vari.sale_price) * item.quantity;
            if (this.currencyIcon) {
                item.vari.total_price_html = this.currencyIcon + " " + item.vari.total_price.toFixed(2);
            }
            else if (this.currencyText) {
                item.vari.total_price_html = this.currencyText + " " + item.vari.total_price.toFixed(2);
            }
            sum = sum + item.vari.total_price;
        }
        //this.totalItems = sum; 
        this.total = sum - (this.coupon ? this.coupon.discount_type == 'percent' ? (sum * Number(this.coupon.amount) / 100) : Number(this.coupon.amount) : 0);
        this.total = Number(this.total + this.servicefee + Number(this.shippingMethod ? this.shippingMethod.cost : 0));
        this.totalToShow = this.currencyIcon + " " + this.total.toFixed(2);
    };
    PaymentPage.prototype.paymentImplemented = function (id) {
        return id === "cod";
    };
    PaymentPage.prototype.paymentMethod = function (paymentGateway) {
        this.selectedPaymentGatewayId = paymentGateway.id;
        this.selectedPaymentGateway = paymentGateway;
    };
    PaymentPage.prototype.placeOrder = function () {
        var _this = this;
        if (this.selectedPaymentGateway == null) {
            this.translate.get('field_error_payment_method').subscribe(function (value) {
                _this.showToast(value);
            });
        }
        else if (this.selectedPaymentGateway.id.includes('stripe') && !this.cardInfo.areFieldsFilled()) {
            this.showToast('Fill valid card details');
        }
        else {
            if (this.selectedPaymentGateway.id.includes('stripe') && this.stripeCardIdToken == null) {
                this.generateStripeCardIdToken();
                return;
            }
            this.orderRequest = new __WEBPACK_IMPORTED_MODULE_4__models_order_request_models__["a" /* OrderRequest */]();
            this.orderRequest.payment_method = this.selectedPaymentGateway.id;
            this.orderRequest.payment_method_title = this.selectedPaymentGateway.title;
            this.orderRequest.set_paid = false;
            this.orderRequest.billing = this.selectedAddress;
            var shippingAddress = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].SELECTED_ADDRESS_SHIPPING));
            this.orderRequest.shipping = shippingAddress ? shippingAddress : this.selectedAddress;
            this.user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].USER_KEY));
            this.orderRequest.customer_id = String(this.user.id);
            this.orderRequest.meta_data = new Array();
            this.orderRequest.meta_data.push(new __WEBPACK_IMPORTED_MODULE_9__models_key_value_models__["a" /* KeyValue */]("time_pickup", String(this.pickupTime)));
            this.orderRequest.meta_data.push(new __WEBPACK_IMPORTED_MODULE_9__models_key_value_models__["a" /* KeyValue */]("time_delivery", String(this.deliveryTime)));
            this.orderRequest.meta_data.push(new __WEBPACK_IMPORTED_MODULE_9__models_key_value_models__["a" /* KeyValue */]("time_pickup_slot", String(this.pickupSlot)));
            this.orderRequest.meta_data.push(new __WEBPACK_IMPORTED_MODULE_9__models_key_value_models__["a" /* KeyValue */]("time_delivery_slot", String(this.deliverySlot)));
            if (this.servicefee && this.servicefee > 0) {
                this.orderRequest.meta_data.push(new __WEBPACK_IMPORTED_MODULE_9__models_key_value_models__["a" /* KeyValue */]("service_fee", String(this.servicefee)));
                this.orderRequest.fee_lines = new Array();
                this.orderRequest.fee_lines.push({ name: "Service Fee", total: String(this.servicefee), tax_status: "none" });
            }
            if (this.shippingMethod) {
                this.orderRequest.shipping_lines = new Array();
                this.orderRequest.shipping_lines.push(new __WEBPACK_IMPORTED_MODULE_12__models_shipping_line_models__["a" /* ShippingLine */](this.shippingMethod.method_id, this.shippingMethod.method_title, String(this.shippingMethod.cost)));
            }
            this.orderRequest.line_items = new Array();
            for (var _i = 0, _a = this.cartItems; _i < _a.length; _i++) {
                var ci = _a[_i];
                var li = new __WEBPACK_IMPORTED_MODULE_14__models_line_item_models__["a" /* LineItem */]();
                li.product_id = ci.pro.id;
                li.variation_id = ci.vari.id;
                li.quantity = ci.quantity;
                this.orderRequest.line_items.push(li);
            }
            this.translate.get('order_creating').subscribe(function (value) {
                _this.presentLoading(value);
                console.log('order_request', _this.orderRequest);
                var subscription = _this.service.createOrder(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), _this.orderRequest).subscribe(function (data) {
                    _this.orderResponse = data;
                    var coupon = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].SELECTED_COUPON));
                    if (coupon) {
                        var couponSubs = _this.service.applyCouponCode(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(_this.orderResponse.id), coupon.code).subscribe(function (data) {
                            _this.orderResponse = data;
                            _this.couponApplied = true;
                            window.localStorage.removeItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].SELECTED_COUPON);
                            _this.translate.get('confirm_order_coupon_applied').subscribe(function (value) {
                                _this.showToast(value);
                            });
                            _this.orderPlaced();
                        }, function (err) {
                            console.log(err);
                            _this.dismissLoading();
                        });
                        _this.subscriptions.push(couponSubs);
                    }
                    else {
                        _this.orderPlaced();
                    }
                }, function (err) {
                    _this.dismissLoading();
                    _this.translate.get('order_failed').subscribe(function (value) {
                        _this.showToast(value);
                    });
                    _this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_3__tabs_tabs__["a" /* TabsPage */]);
                });
                _this.subscriptions.push(subscription);
            });
        }
    };
    PaymentPage.prototype.generateStripeCardIdToken = function () {
        // this.presentLoading('Verifying card details');
        // this.stripe.setPublishableKey(this.config.stripeKey);
        // this.stripe.createCardToken(this.cardInfo as StripeCardTokenParams).then(token => {
        //   this.stripeCardIdToken = token;
        //   this.dismissLoading();
        //   window.localStorage.setItem(Constants.CARD_INFO, JSON.stringify(this.cardInfo));
        //   this.placeOrder();
        // }).catch(error => {
        //   this.dismissLoading();
        //   this.presentErrorAlert(error);
        //   this.showToast('Invalid card details');
        //   console.error(error);
        // });
    };
    PaymentPage.prototype.initStripe = function () {
        var _this = this;
        this.presentLoading('Making payment');
        var subscription = this.service.stripePayment(new __WEBPACK_IMPORTED_MODULE_11__models_stripe_request_models__["a" /* StripeRequest */]("stripe", String(this.orderResponse.id), this.stripeCardIdToken.id)).subscribe(function (data) {
            _this.dismissLoading();
            console.log(data);
            _this.paymentSuccess();
        }, function (err) {
            _this.dismissLoading();
            console.log(err);
            _this.paymentFailure();
        });
        this.subscriptions.push(subscription);
    };
    PaymentPage.prototype.orderPlaced = function () {
        var _this = this;
        this.dismissLoading();
        this.translate.get('order_placed').subscribe(function (value) {
            _this.showToast(value);
        });
        if (this.selectedPaymentGateway.id === "cod") {
            this.clearCart();
            this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_3__tabs_tabs__["a" /* TabsPage */]);
        }
        else if (this.selectedPaymentGateway.id === "pumcp" || this.selectedPaymentGateway.id.includes("payu")) {
            this.initPayUMoney();
        }
        else if (this.selectedPaymentGateway.id.includes("stripe")) {
            this.initStripe();
        }
        else {
            this.translate.get('order_placed_cod').subscribe(function (value) {
                _this.showToast(value);
            });
            this.clearCart();
            this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_3__tabs_tabs__["a" /* TabsPage */]);
        }
    };
    // initPayPal() {
    //   this.payPal.init({ PayPalEnvironmentProduction: this.config.paypalProduction, PayPalEnvironmentSandbox: this.config.paypalSandbox }).then(() => {
    //     // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
    //     this.payPal.prepareToRender(this.config.paypalProduction ? 'PayPalEnvironmentProduction' : 'PayPalEnvironmentSandbox', new PayPalConfiguration({
    //       // Only needed if you get an "Internal Service Error" after PayPal login!
    //       //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
    //     })).then(() => {
    //       let currency: Currency = JSON.parse(window.localStorage.getItem(Constants.CURRENCY));
    //       let payment = new PayPalPayment(String(this.total), currency.value, 'Description', 'sale');
    //       this.payPal.renderSinglePaymentUI(payment).then(() => {
    //         this.paymentSuccess();
    //         // Successfully paid
    //       }, () => {
    //         this.paymentFailure();
    //         // Error or render dialog closed without being successful
    //       });
    //     }, () => {
    //       // Error in configuration
    //     });
    //   }, () => {
    //     // Error in initialization, maybe PayPal isn't supported or something else
    //   });
    // }
    PaymentPage.prototype.initPayUMoney = function () {
        var _this = this;
        var name = this.user.first_name && this.user.first_name.length ? this.user.first_name : this.user.username;
        var mobile = this.user.username;
        var email = this.user.email;
        var bookingId = String(Math.floor(Math.random() * (99 - 10 + 1) + 10)) + String(this.orderResponse.id);
        var productinfo = this.orderResponse.order_key;
        var salt = this.config.payuSalt;
        var key = this.config.payuKey;
        var amt = this.total;
        var string = key + '|' + bookingId + '|' + amt + '|' + productinfo + '|' + name + '|' + email + '|||||||||||' + salt;
        var encrypttext = Object(__WEBPACK_IMPORTED_MODULE_15_js_sha512__["sha512"])(string);
        //let url = "payumoney/payuBiz.html?amt=" + amt + "&name=" + name + "&mobileNo=" + mobile + "&email=" + email + "&bookingId=" + bookingId + "&productinfo=" + productinfo + "&salt=" + salt + "&key=" + key;
        var url = "payumoney/payuBiz.html?amt=" + amt + "&name=" + name + "&mobileNo=" + mobile + "&email=" + email + "&bookingId=" + bookingId + "&productinfo=" + productinfo + "&hash=" + encrypttext + "&salt=" + salt + "&key=" + key;
        console.log("payuurl", url);
        var options = {
            location: 'yes',
            clearcache: 'yes',
            zoom: 'yes',
            toolbar: 'no',
            closebuttoncaption: 'back'
        };
        var browser = this.iab.create(url, '_blank', options);
        browser.on('loadstop').subscribe(function (event) {
            browser.executeScript({
                file: "payumoney/payumoneyPaymentGateway.js"
            });
            if (event.url == "http://localhost/success.php") {
                _this.paymentSuccess();
                browser.close();
            }
            if (event.url == "http://localhost/failure.php") {
                _this.paymentFailure();
                browser.close();
            }
        });
        browser.on('exit').subscribe(function (event) {
            if (!_this.paymentDone && !_this.paymentFailAlerted) {
                _this.paymentFailure();
            }
        });
        browser.on('loaderror').subscribe(function (event) {
            _this.showToast('something_went_wrong');
            _this.paymentFailure();
        });
    };
    PaymentPage.prototype.paymentFailure = function () {
        var _this = this;
        this.paymentFailAlerted = true;
        this.subscriptions.push(this.service.updateOrder(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(this.orderResponse.id), new __WEBPACK_IMPORTED_MODULE_8__models_order_update_request_models__["a" /* OrderUpdateRequest */]('cancelled')).subscribe(function (data) {
        }, function (err) {
            console.log(err);
        }));
        this.translate.get(['payment_fail_title', 'payment_fail_message', 'ok']).subscribe(function (res) {
            var alert = _this.alertCtrl.create({
                title: res.payment_fail_title,
                message: res.payment_fail_message,
                buttons: [{
                        text: res.ok,
                        role: 'cancel',
                        handler: function () {
                            _this.done();
                            console.log('Okay clicked');
                        }
                    }]
            });
            alert.present();
        });
    };
    PaymentPage.prototype.paymentSuccess = function () {
        var _this = this;
        this.paymentDone = true;
        this.clearCart();
        this.translate.get('just_a_moment').subscribe(function (value) {
            _this.presentLoading(value);
            _this.subscriptions.push(_this.service.updateOrder(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(_this.orderResponse.id), { set_paid: true }).subscribe(function (data) {
                _this.done();
            }, function (err) {
                _this.done();
                _this.paymentSuccess();
                console.log(err);
            }));
        });
    };
    PaymentPage.prototype.done = function () {
        if (!this.placedPagePushed) {
            this.placedPagePushed = true;
            this.dismissLoading();
            this.app.getRootNav().setRoot(this.paymentFailAlerted ? __WEBPACK_IMPORTED_MODULE_3__tabs_tabs__["a" /* TabsPage */] : __WEBPACK_IMPORTED_MODULE_3__tabs_tabs__["a" /* TabsPage */]);
        }
    };
    PaymentPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    PaymentPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    PaymentPage.prototype.presentErrorAlert = function (msg) {
        var alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: msg,
            buttons: ['Dismiss']
        });
        alert.present();
    };
    PaymentPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'top'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    PaymentPage.prototype.clearCart = function () {
        this.global.clearCart();
    };
    PaymentPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-payment',template:/*ion-inline-start:"D:\PTH\Laundry Shop\Salavai-User\src\pages\payment\payment.html"*/'<ion-header>\n	<ion-navbar>\n		<ion-title>{{"payment" | translate}}</ion-title>\n	</ion-navbar>\n</ion-header>\n\n\n<ion-content class="bg-light">\n	<p padding-left padding-right class="heading animate__animated animate__fadeInUp">{{"select_method" | translate}}\n	</p>\n\n	<ion-list no-lines radio-group [(ngModel)]="selectedPaymentGatewayId">\n		<ion-item class="animate__animated animate__fadeInUp" *ngFor="let item of paymentGateways">\n			<ion-radio value="{{item.id}}" (ionSelect)="paymentMethod(item)" item-start></ion-radio>\n			<ion-label>\n				<h2 [innerHTML]="item.title"></h2>\n			</ion-label>\n		</ion-item>\n	</ion-list>\n\n\n	<ion-card *ngIf="selectedPaymentGateway && selectedPaymentGateway.id.includes(\'stripe\')">\n		<div class="card_header">\n			<h2>{{\'card_info\' | translate}}</h2>\n		</div>\n\n		<div class="form">\n			<ion-list>\n				<ion-item class="animate__animated animate__fadeInUp">\n					<ion-input type="number" placeholder="{{\'card_number\' | translate}}" [(ngModel)]="cardInfo.number">\n					</ion-input>\n				</ion-item>\n				<ion-item class="animate__animated animate__fadeInUp">\n					<ion-input type="text" placeholder="{{\'card_name\' | translate}}" [(ngModel)]="cardInfo.name">\n					</ion-input>\n				</ion-item>\n				<ion-row class="animate__animated animate__fadeInUp">\n					<ion-col col-4 class="animate__animated animate__fadeInUp">\n						<div class="d-flex mr-5">\n							<ion-item>\n								<ion-input type="number" placeholder="{{\'card_month\' | translate}}"\n									[(ngModel)]="cardInfo.expMonth">\n								</ion-input>\n							</ion-item>\n						</div>\n					</ion-col>\n\n					<ion-col col-4 class="animate__animated animate__fadeInUp">\n						<ion-item>\n							<ion-input type="number" placeholder="{{\'card_year\' | translate}}"\n								[(ngModel)]="cardInfo.expYear">\n							</ion-input>\n						</ion-item>\n					</ion-col>\n\n					<ion-col col-4 class="animate__animated animate__fadeInUp">\n						<ion-item>\n							<ion-input type="number" placeholder="{{\'card_cvv\' | translate}}"\n								[(ngModel)]="cardInfo.cvc">\n							</ion-input>\n						</ion-item>\n					</ion-col>\n				</ion-row>\n\n				<ion-item class="animate__animated animate__fadeInUp" *ngIf="paymentResponse && paymentResponse.length">\n					<ion-label text-right>{{paymentResponse}}</ion-label>\n				</ion-item>\n			</ion-list>\n		</div>\n	</ion-card>\n</ion-content>\n<ion-footer no-border class="animate__animated animate__fadeInUp" style="--animate-duration: .4s;">\n	<div class="fixed-bootom" (click)="placeOrder()">\n		<ion-row>\n			<ion-col class="cost" col-8>\n				{{"amount_payable" | translate}}\n				<span [innerHTML]="totalToShow"></span>\n			</ion-col>\n			<ion-col class="next">\n				{{"confirm_pay" | translate}}\n				<ion-icon name="ios-arrow-forward-outline"></ion-icon>\n			</ion-col>\n		</ion-row>\n	</div>\n</ion-footer>'/*ion-inline-end:"D:\PTH\Laundry Shop\Salavai-User\src\pages\payment\payment.html"*/
        }),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_13__app_app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */], __WEBPACK_IMPORTED_MODULE_6__providers_global__["a" /* Global */],
            __WEBPACK_IMPORTED_MODULE_16__ionic_native_in_app_browser__["a" /* InAppBrowser */],
            __WEBPACK_IMPORTED_MODULE_7__ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */], __WEBPACK_IMPORTED_MODULE_2__providers_wordpress_client_service__["a" /* WordpressClient */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], PaymentPage);
    return PaymentPage;
}());

//# sourceMappingURL=payment.js.map

/***/ }),

/***/ 394:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SelectShippingPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ngx_translate_core__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__selectdate_selectdate__ = __webpack_require__(136);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var SelectShippingPage = /** @class */ (function () {
    function SelectShippingPage(translate, navParams, navCtrl, toastCtrl) {
        this.translate = translate;
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.shippingMethodId = -1;
        this.shippingMethods = navParams.get('shipping_methods');
    }
    SelectShippingPage.prototype.selectShipping = function (sm) {
        this.shippingMethod = sm;
        this.shippingMethodId = sm.id;
        console.log("sms", sm);
    };
    SelectShippingPage.prototype.next = function () {
        var _this = this;
        if (this.shippingMethods && this.shippingMethods.length && !this.shippingMethod) {
            this.translate.get("shipping_select").subscribe(function (value) { return _this.showToast(value); });
        }
        else {
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].SELECTED_SHIPPING_METHOD, JSON.stringify(this.shippingMethod));
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__selectdate_selectdate__["a" /* SelectdatePage */]);
        }
    };
    SelectShippingPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    SelectShippingPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-selectshipping',template:/*ion-inline-start:"D:\PTH\Laundry Shop\Salavai-User\src\pages\selectshipping\selectshipping.html"*/'<ion-header>\n	<ion-navbar>\n		<ion-title>{{\'shipping_methods\' | translate}}</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content class="bg-light">\n	<ion-list no-lines radio-group [(ngModel)]="shippingMethodId" name="case" required>\n		<h2 class="animate__animated animate__fadeInUp">{{\'shipping_select\' | translate}}</h2>\n		<ion-item class="animate__animated animate__fadeInUp" *ngFor="let shipping of shippingMethods">\n			<ion-radio value="{{shipping.id}}" item-start (ionSelect)="selectShipping(shipping)"></ion-radio>\n			<ion-label>\n				<h2>{{shipping.title}}</h2>\n				<p></p>\n			</ion-label>\n			<h3 text-end item-end [innerHTML]="shipping.costToShow"></h3>\n		</ion-item>\n	</ion-list>\n</ion-content>\n<ion-footer no-border class="animate__animated animate__fadeInUp" style="--animate-duration: .4s;">\n	<button ion-button block outline (click)="next()" class="bg-white add_new_location">\n		<!-- <ion-icon name="md-add" icon-start></ion-icon> -->\n		{{\'continue\' | translate}}\n	</button>\n</ion-footer>'/*ion-inline-end:"D:\PTH\Laundry Shop\Salavai-User\src\pages\selectshipping\selectshipping.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */]])
    ], SelectShippingPage);
    return SelectShippingPage;
}());

//# sourceMappingURL=selectshipping.js.map

/***/ }),

/***/ 395:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ContactPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_config__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_call_number__ = __webpack_require__(396);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_email_composer__ = __webpack_require__(397);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};





var ContactPage = /** @class */ (function () {
    function ContactPage(config, navParam, navCtrl, callNumber, emailComposer) {
        this.config = config;
        this.navCtrl = navCtrl;
        this.callNumber = callNumber;
        this.emailComposer = emailComposer;
        this.settings = navParam.get("settings");
    }
    ContactPage.prototype.dial = function () {
        this.callNumber.callNumber(this.settings.laundry_appconfig_mobilenumber, true).then(function (res) { return console.log('Launched dialer!', res); }).catch(function (err) { return console.log('Error launching dialer', err); });
    };
    ContactPage.prototype.navigate = function () {
        window.open("geo:lat,lon?q=" + this.settings.laundry_appconfig_address, "_system");
    };
    ContactPage.prototype.mail = function () {
        var email = {
            to: this.settings.laundry_appconfig_email,
            subject: this.config.appName,
            body: '',
            isHtml: true
        };
        this.emailComposer.open(email);
    };
    ContactPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-contact',template:/*ion-inline-start:"D:\PTH\Laundry Shop\Salavai-User\src\pages\contact\contact.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>\n            {{"contact" | translate}}\n        </ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="bg-light">\n    <ion-list no-lines>\n        <ion-item class="animate__animated animate__fadeInUp">\n            <p>{{"call_us" | translate}}</p>\n            <h2>{{settings.laundry_appconfig_mobilenumber}}</h2>\n            <ion-avatar item-end (click)="dial()">\n                <ion-icon name="md-call"></ion-icon>\n            </ion-avatar>\n        </ion-item>\n        <ion-item class="animate__animated animate__fadeInUp">\n            <p>{{"email_us" | translate}}</p>\n            <h2>{{settings.laundry_appconfig_email}}</h2>\n            <ion-avatar item-end>\n                <ion-icon name="md-mail" (click)="mail()"></ion-icon>\n            </ion-avatar>\n        </ion-item>\n        <ion-item class="animate__animated animate__fadeInUp">\n            <p>{{"reach_us" | translate}}</p>\n            <h2>{{settings.laundry_appconfig_address}}</h2>\n            <ion-avatar item-end *ngIf="settings && settings.laundry_appconfig_address && settings.laundry_appconfig_address.length">\n                <ion-icon name="md-navigate" (click)="navigate()"></ion-icon>\n            </ion-avatar>\n        </ion-item>\n    </ion-list>\n</ion-content>\n<!--\n <div *ngIf="settings && settings.laundry_appconfig_address && settings.laundry_appconfig_address.length" class="map">\n        <ion-icon name="md-navigate" (click)="navigate()"></ion-icon>\n         <img src="assets/imgs/map-img.png"> \n    </div>-->\n'/*ion-inline-end:"D:\PTH\Laundry Shop\Salavai-User\src\pages\contact\contact.html"*/
        }),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_2__app_app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_call_number__["a" /* CallNumber */], __WEBPACK_IMPORTED_MODULE_4__ionic_native_email_composer__["a" /* EmailComposer */]])
    ], ContactPage);
    return ContactPage;
}());

//# sourceMappingURL=contact.js.map

/***/ }),

/***/ 398:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TncPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var TncPage = /** @class */ (function () {
    function TncPage(navParam, navCtrl) {
        this.navCtrl = navCtrl;
        this.settings = navParam.get("settings");
    }
    TncPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-tnc',template:/*ion-inline-start:"D:\PTH\Laundry Shop\Salavai-User\src\pages\tnc\tnc.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{"tnc" | translate}}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content>\n    <div padding-left padding-right padding-top>\n        <div class="logo animate__animated animate__zoomIn" style="--animate-duration: .3s;" text-center>\n            <img src="assets/imgs/logo.png">\n        </div>\n\n        <h2 class="animate__animated animate__fadeInUp">{{"tnc_use" | translate}}</h2>\n        <p class="animate__animated animate__fadeInUp" [innerHTML]="settings.laundry_appconfig_terms"></p>\n    </div>\n</ion-content>'/*ion-inline-end:"D:\PTH\Laundry Shop\Salavai-User\src\pages\tnc\tnc.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */]])
    ], TncPage);
    return TncPage;
}());

//# sourceMappingURL=tnc.js.map

/***/ }),

/***/ 399:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Contact_usPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__conversation_conversation__ = __webpack_require__(400);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_chat_models__ = __webpack_require__(510);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_app_config__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ngx_translate_core__ = __webpack_require__(11);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};







var Contact_usPage = /** @class */ (function () {
    function Contact_usPage(config, translate, navCtrl, toastCtrl) {
        this.config = config;
        this.translate = translate;
        this.navCtrl = navCtrl;
        this.toastCtrl = toastCtrl;
        this.user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].USER_KEY));
        this.userAdmin = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_3__models_constants_models__["a" /* Constants */].USER_ADMIN_KEY));
    }
    Contact_usPage.prototype.conversation = function () {
        var _this = this;
        this.navCtrl.pop();
        if (!this.user) {
            this.translate.get("auth_required").subscribe(function (value) { return _this.showToast(value); });
        }
        if (this.user && this.userAdmin) {
            var chat = new __WEBPACK_IMPORTED_MODULE_4__models_chat_models__["a" /* Chat */]();
            chat.chatId = this.userAdmin.id + "admin";
            chat.chatImage = (this.userAdmin.avatar_url && this.userAdmin.avatar_url.length) ? this.userAdmin.avatar_url : "assets/imgs/empty_dp.png";
            chat.chatName = this.config.appName;
            chat.chatStatus = this.config.appName;
            chat.myId = this.user.id + "customer";
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__conversation_conversation__["a" /* ConversationPage */], { chat: chat });
        }
    };
    Contact_usPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 2000,
            position: 'top'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    Contact_usPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-contact_us',template:/*ion-inline-start:"D:\PTH\Laundry Shop\Salavai-User\src\pages\contact_us\contact_us.html"*/'<ion-header class="bg-white">\n    <ion-navbar>\n        <ion-title text-center>\n            {{\'chat_with_us\' | translate}}\n        </ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content fullscreen="true">\n    <div class="banner">\n        <img src="assets/imgs/contact_us_img.png">\n    </div>\n    <div class="container">\n        <h1 class="animate__animated animate__fadeInUp" tyle="--animate-duration: .3s;">{{\'we_love_to_hear\' | translate}}<br>{{\'from_you\' | translate}} </h1>\n        <h2 class="animate__animated animate__fadeInUp" tyle="--animate-duration: .35s;">{{\'let_us_know_query_feedback\' | translate}}</h2>\n    </div>\n</ion-content>\n<ion-footer no-border  class="animate__animated animate__fadeInUp" style="--animate-duration: .4s;">\n    <button ion-button full class="btn green-shadow" (click)="conversation(true)">\n        {{\'chat_now\' | translate}}\n    </button>\n</ion-footer>'/*ion-inline-end:"D:\PTH\Laundry Shop\Salavai-User\src\pages\contact_us\contact_us.html"*/
        }),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_5__app_app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_6__ngx_translate_core__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */]])
    ], Contact_usPage);
    return Contact_usPage;
}());

//# sourceMappingURL=contact_us.js.map

/***/ }),

/***/ 400:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConversationPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models_message_models__ = __webpack_require__(509);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ngx_translate_core__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_onesignal__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__models_helper_models__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__app_app_config__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_firebase_app__ = __webpack_require__(382);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_firebase_app___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_firebase_app__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};









var ConversationPage = /** @class */ (function () {
    function ConversationPage(config, navParam, toastCtrl, oneSignal, translate) {
        var _this = this;
        this.config = config;
        this.toastCtrl = toastCtrl;
        this.oneSignal = oneSignal;
        this.translate = translate;
        this.messages = new Array();
        this.chat = navParam.get('chat');
        this.userMe = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].USER_KEY));
        this.chatChild = __WEBPACK_IMPORTED_MODULE_6__models_helper_models__["a" /* Helper */].getChatChild(this.chat.myId, this.chat.chatId);
        var component = this;
        this.inboxRef = __WEBPACK_IMPORTED_MODULE_8_firebase_app__["database"]().ref(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].REF_INBOX);
        this.chatRef = __WEBPACK_IMPORTED_MODULE_8_firebase_app__["database"]().ref(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].REF_CHAT);
        this.chatRef.child(this.chatChild).limitToLast(20).on("child_added", function (snapshot, prevChildKey) {
            var newMessage = snapshot.val();
            if (newMessage) {
                newMessage.timeDiff = __WEBPACK_IMPORTED_MODULE_6__models_helper_models__["a" /* Helper */].formatMillisDateTime(Number(newMessage.dateTimeStamp), __WEBPACK_IMPORTED_MODULE_6__models_helper_models__["a" /* Helper */].getLocale());
                component.addMessage(newMessage);
                component.markDelivered();
                component.scrollList();
            }
        }, function (error) {
            console.error("child_added", error);
        });
        __WEBPACK_IMPORTED_MODULE_8_firebase_app__["database"]().ref(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].REF_USERS_FCM_IDS).child(this.chat.chatId).once("value", function (snap) {
            component.userPlayerId = snap.val();
        });
        this.translate.get("just_a_moment").subscribe(function (value) {
            _this.showToast(value);
        });
    }
    ConversationPage.prototype.ionViewDidEnter = function () {
        this.scrollList();
    };
    ConversationPage.prototype.scrollList = function () {
        this.content.scrollToBottom(300); //300ms animation speed
    };
    ConversationPage.prototype.notifyMessage = function (msg) {
        var _this = this;
        this.translate.get(['new_msg', 'new_msg_from']).subscribe(function (value) {
            _this.oneSignal.postNotification({
                include_player_ids: [_this.userPlayerId],
                headings: { en: value['new_msg'] },
                contents: { en: (value['new_msg_from'] + " " + _this.config.appName) },
                data: { msg: msg }
            }).then(function (res) { return console.log(res); }).catch(function (err) { return console.log(err); });
        });
    };
    ConversationPage.prototype.markDelivered = function () {
        if (this.messages && this.messages.length) {
            if (this.messages[this.messages.length - 1].senderId != this.chat.myId) {
                this.messages[this.messages.length - 1].delivered = true;
                this.chatRef.child(this.chatChild).child(this.messages[this.messages.length - 1].id).child("delivered").set(true);
            }
            // else {
            //   let messagesPendingToNotify = new Array<Message>();
            //   if (!this.messages[this.messages.length - 1].delivered) {
            //     messagesPendingToNotify.push(this.messages[this.messages.length - 1]);
            //     this.messages[this.messages.length - 1].delivered = true;
            //   }
            //   if (messagesPendingToNotify.length && this.userPlayerId) {
            //     this.notifyMessages(messagesPendingToNotify);
            //   }
            // }
        }
    };
    ConversationPage.prototype.addMessage = function (msg) {
        this.messages = this.messages.concat(msg);
        //this.storage.set(Constants.KEY_MESSAGES + this.chatChild, this.messages);
        if (this.chat && msg) {
            var isMeSender = msg.senderId == this.chat.myId;
            this.chat.chatImage = isMeSender ? msg.recipientImage : msg.senderImage;
            this.chat.chatName = isMeSender ? msg.recipientName : msg.senderName;
            this.chat.chatStatus = isMeSender ? msg.recipientStatus : msg.senderStatus;
        }
    };
    ConversationPage.prototype.send = function () {
        var _this = this;
        if (this.newMessageText && this.newMessageText.trim().length) {
            var toSend_1 = new __WEBPACK_IMPORTED_MODULE_1__models_message_models__["a" /* Message */]();
            toSend_1.chatId = this.chatChild;
            toSend_1.body = this.newMessageText;
            toSend_1.dateTimeStamp = String(new Date().getTime());
            toSend_1.delivered = false;
            toSend_1.sent = true;
            toSend_1.recipientId = this.chat.chatId;
            toSend_1.recipientImage = this.chat.chatImage;
            toSend_1.recipientName = this.chat.chatName;
            toSend_1.recipientStatus = this.chat.chatStatus;
            toSend_1.senderId = this.chat.myId;
            toSend_1.senderName = this.userMe.first_name;
            toSend_1.senderImage = (this.userMe.avatar_url && this.userMe.avatar_url.length) ? this.userMe.avatar_url : "assets/imgs/empty_dp.png";
            toSend_1.senderStatus = this.config.appName;
            toSend_1.id = this.chatRef.child(this.chatChild).push().key;
            this.chatRef.child(this.chatChild).child(toSend_1.id).set(toSend_1).then(function (res) {
                _this.inboxRef.child(toSend_1.recipientId).child(toSend_1.senderId).set(toSend_1);
                _this.inboxRef.child(toSend_1.senderId).child(toSend_1.recipientId).set(toSend_1);
                _this.newMessageText = '';
                _this.notifyMessage(toSend_1);
            });
        }
        else {
            this.translate.get("type_message").subscribe(function (value) { return _this.showToast(value); });
        }
    };
    ConversationPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 2000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('content'),
        __metadata("design:type", Object)
    ], ConversationPage.prototype, "content", void 0);
    ConversationPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-conversation',template:/*ion-inline-start:"D:\PTH\Laundry Shop\Salavai-User\src\pages\conversation\conversation.html"*/'<ion-header class="bg-white">\n    <ion-navbar>\n        <button ion-button menuToggle>\n            <ion-icon name="menu"></ion-icon>\n        </button>\n        <ion-title>\n            {{\'customer_care\' | translate}}\n        </ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content #content class="bg-light">\n    <div class="chat_container d-flex">\n        <div *ngFor="let msg of messages" [ngClass]="(chat.myId == msg.senderId) ? \'chat_box d-flex send animate__animated animate__zoomIn\' : \'chat_box d-flex received animate__animated animate__zoomIn\'" style="--animate-duration: .5s;">\n            <div class="chat">\n                <h2>{{msg.body}}</h2>\n                <p>{{msg.timeDiff}}</p>\n            </div>\n        </div>\n    </div>\n</ion-content>\n\n<ion-footer no-border class="animate__animated animate__fadeInUp" style="--animate-duration: .4s;">\n    <ion-list class="" no-lines>\n        <div class="d-flex input_field">\n            <ion-item>\n                <ion-textarea type="text" rows="1" [(ngModel)]="newMessageText" placeholder="{{\'type_message\' | translate}}"></ion-textarea>\n            </ion-item>\n            <h3 (click)="send()" class="end">\n                <ion-icon name="md-send" text-start></ion-icon>\n            </h3>\n        </div>\n    </ion-list>\n</ion-footer>'/*ion-inline-end:"D:\PTH\Laundry Shop\Salavai-User\src\pages\conversation\conversation.html"*/
        }),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_7__app_app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["l" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["o" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_4__ionic_native_onesignal__["a" /* OneSignal */], __WEBPACK_IMPORTED_MODULE_3__ngx_translate_core__["c" /* TranslateService */]])
    ], ConversationPage);
    return ConversationPage;
}());

//# sourceMappingURL=conversation.js.map

/***/ }),

/***/ 401:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OffersPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_clipboard__ = __webpack_require__(402);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__node_modules_ngx_translate_core__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_wordpress_client_service__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_moment__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var OffersPage = /** @class */ (function () {
    function OffersPage(toastCtrl, clipboard, translate, service) {
        this.toastCtrl = toastCtrl;
        this.clipboard = clipboard;
        this.translate = translate;
        this.service = service;
        this.subscriptions = [];
        this.coupons = new Array();
        this.loading = false;
        this.loadCoupons();
    }
    OffersPage.prototype.loadCoupons = function () {
        var _this = this;
        this.loading = true;
        var subscription = this.service.coupons(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_5__models_constants_models__["a" /* Constants */].ADMIN_API_KEY)).subscribe(function (data) {
            var now = new Date();
            var newCoupons = new Array();
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var coupon = data_1[_i];
                if (coupon.date_expires && coupon.date_expires.length && now > __WEBPACK_IMPORTED_MODULE_6_moment___default()(coupon.date_expires).toDate()) {
                    continue;
                }
                if (coupon.usage_count && coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
                    continue;
                }
                if (!coupon.description || !coupon.description.length) {
                    coupon.description = 'Discount of ' + coupon.amount;
                }
                newCoupons.push(coupon);
            }
            _this.loading = false;
            _this.coupons = newCoupons;
        }, function (err) {
            _this.loading = false;
        });
        this.subscriptions.push(subscription);
    };
    OffersPage.prototype.copyCode = function (code) {
        var _this = this;
        if (code) {
            this.clipboard.copy(code);
            this.translate.get('copied_code').subscribe(function (value) {
                _this.showToast(value);
            });
        }
    };
    OffersPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 2000,
            position: 'top'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    OffersPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-offers',template:/*ion-inline-start:"D:\PTH\Laundry Shop\Salavai-User\src\pages\offers\offers.html"*/'<ion-header>\n	<ion-navbar>\n		<ion-title>{{"offers" | translate}} <span text-end>{{"copy_code" | translate}}</span></ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content class="bg-light">\n	<div class="empty-view animate__animated animate__zoomInUp" style="--animate-duration: .2s;" *ngIf="!loading && !coupons.length">\n		<div style="text-align:center">\n			<img src="assets/imgs/empty_coupon.png" alt="no offers" />\n			<span style="color:#9E9E9E; font-weight:bold;">{{"empty_text_offers" | translate}}</span>\n		</div>\n	</div>\n	<ion-list no-lines *ngIf="!loading && coupons.length">\n		<ion-item class="animate__animated animate__fadeInUp" *ngFor="let item of coupons">\n			<h2>{{item.description}}</h2>\n			<div class="copy" (click)="copyCode(item.code)">\n				<span>{{item.code}}</span>\n			</div>\n		</ion-item>\n	</ion-list>\n</ion-content>'/*ion-inline-end:"D:\PTH\Laundry Shop\Salavai-User\src\pages\offers\offers.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_clipboard__["a" /* Clipboard */], __WEBPACK_IMPORTED_MODULE_3__node_modules_ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_4__providers_wordpress_client_service__["a" /* WordpressClient */]])
    ], OffersPage);
    return OffersPage;
}());

//# sourceMappingURL=offers.js.map

/***/ }),

/***/ 403:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Vt_popupPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http__ = __webpack_require__(124);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(24);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var Vt_popupPage = /** @class */ (function () {
    function Vt_popupPage(navCtrl, modalCtrl, viewCtrl, formBuilder, http, loadingCtrl, toastCtrl) {
        this.navCtrl = navCtrl;
        this.modalCtrl = modalCtrl;
        this.viewCtrl = viewCtrl;
        this.formBuilder = formBuilder;
        this.http = http;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
    }
    Vt_popupPage.prototype.ngOnInit = function () {
        this.subscribeForm = this.formBuilder.group({
            email_Id: ['', __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].maxLength(70), __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'), __WEBPACK_IMPORTED_MODULE_3__angular_forms__["f" /* Validators */].required])]
        });
    };
    Vt_popupPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    Vt_popupPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    Vt_popupPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    Vt_popupPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 1500,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    Vt_popupPage.prototype.onSubscribe = function () {
        var _this = this;
        if (!this.subscribeForm.valid) {
            return this.showToast('Please provide your Email.');
        }
        this.presentLoading('Sending...');
        var req = {
            "email": this.subscribeForm.value.email_Id,
            "source": "opus_application_Quickwash"
        };
        this.http.post("https://dashboard.vtlabs.dev/api/subscribe", req).subscribe(function (res) {
            _this.showToast('Submitted successfully.');
            _this.viewCtrl.dismiss();
            _this.dismissLoading();
        });
    };
    Vt_popupPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-vt_popup',template:/*ion-inline-start:"D:\PTH\Laundry Shop\Salavai-User\src\pages\vt_popup\vt_popup.html"*/'<ion-content>\n    <div class="cloes_btn" text-end>\n        <ion-icon name="md-close" (click)="dismiss()"></ion-icon>\n    </div>\n\n    <ion-card>\n        <div class="img_box">\n            <img src="https://opuslabs.nyc3.digitaloceanspaces.com/AAFixItems/Other/popup_img_head.png">\n        </div>\n\n        <div class="text_box">\n            <h2>Stay in touch.</h2>\n            <p>Stay connected for Future <br>updates and new products.</p>\n        </div>\n        <ion-list no-lines [formGroup]="subscribeForm">\n\n            <ion-item>\n                <ion-input type="email" placeholder="Enter your email address" formControlName="email_Id"></ion-input>\n            </ion-item>\n\n            <button ion-button block (click)="onSubscribe()">Subscribe Now</button>\n        </ion-list>\n    </ion-card>\n</ion-content>'/*ion-inline-end:"D:\PTH\Laundry Shop\Salavai-User\src\pages\vt_popup\vt_popup.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* ModalController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["p" /* ViewController */], __WEBPACK_IMPORTED_MODULE_3__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["a" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */]])
    ], Vt_popupPage);
    return Vt_popupPage;
}());

//# sourceMappingURL=vt_popup.js.map

/***/ }),

/***/ 404:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(405);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(418);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 418:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export createTranslateLoader */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_component__ = __webpack_require__(458);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_myaddress_myaddress__ = __webpack_require__(135);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_about_about__ = __webpack_require__(379);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_account_account__ = __webpack_require__(373);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_contact_contact__ = __webpack_require__(395);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_home_home__ = __webpack_require__(134);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_myorders_myorders__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_notification_notification__ = __webpack_require__(511);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_offers_offers__ = __webpack_require__(401);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_orderconfirmed_orderconfirmed__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_orderslip_orderslip__ = __webpack_require__(132);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_profile_profile__ = __webpack_require__(374);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_rate_rate__ = __webpack_require__(512);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_selectclothes_selectclothes__ = __webpack_require__(133);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__pages_selectdate_selectdate__ = __webpack_require__(136);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__pages_tabs_tabs__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__pages_tnc_tnc__ = __webpack_require__(398);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__pages_login_login__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__pages_otp_otp__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__pages_phone_phone__ = __webpack_require__(381);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__pages_createaccount_createaccount__ = __webpack_require__(383);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__app_config__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__ngx_translate_core__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__ngx_translate_http_loader__ = __webpack_require__(513);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__angular_common_http__ = __webpack_require__(124);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__ionic_native_in_app_browser__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__ionic_native_google_plus__ = __webpack_require__(384);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__ionic_native_onesignal__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__ionic_native_globalization__ = __webpack_require__(515);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__ionic_native_device__ = __webpack_require__(516);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__ionic_native_status_bar__ = __webpack_require__(233);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__ionic_native_splash_screen__ = __webpack_require__(235);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__ionic_native_clipboard__ = __webpack_require__(402);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__pages_code_code__ = __webpack_require__(380);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__ionic_native_call_number__ = __webpack_require__(396);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__ionic_native_email_composer__ = __webpack_require__(397);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__ionic_native_geolocation__ = __webpack_require__(388);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__ionic_native_network__ = __webpack_require__(391);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__providers_connectivity_service__ = __webpack_require__(390);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__providers_google_maps__ = __webpack_require__(389);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43__pages_selectarea_selectarea__ = __webpack_require__(387);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44__ionic_native_facebook__ = __webpack_require__(386);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45__pages_password_password__ = __webpack_require__(385);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46__pages_managelanguage_managelanguage__ = __webpack_require__(137);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_47__pages_add_address_title_add_address_title__ = __webpack_require__(392);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_48__ionic_native_image_picker__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_49__ionic_native_crop__ = __webpack_require__(128);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_50__ionic_native_file__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_51__pages_contact_us_contact_us__ = __webpack_require__(399);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_52__pages_conversation_conversation__ = __webpack_require__(400);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_53__pages_selectshipping_selectshipping__ = __webpack_require__(394);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_54__providers_wordpress_client_service__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_55__providers_global__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_56__pages_vt_popup_vt_popup__ = __webpack_require__(403);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_57__pages_payment_payment__ = __webpack_require__(393);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


























































function createTranslateLoader(http) {
    return new __WEBPACK_IMPORTED_MODULE_26__ngx_translate_http_loader__["a" /* TranslateHttpLoader */](http, './assets/i18n/', '.json');
}
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_4__pages_myaddress_myaddress__["a" /* MyaddressPage */],
                __WEBPACK_IMPORTED_MODULE_20__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_22__pages_phone_phone__["a" /* PhonePage */],
                __WEBPACK_IMPORTED_MODULE_23__pages_createaccount_createaccount__["a" /* CreateaccountPage */],
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_5__pages_about_about__["a" /* AboutPage */],
                __WEBPACK_IMPORTED_MODULE_6__pages_account_account__["a" /* AccountPage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_contact_contact__["a" /* ContactPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_myorders_myorders__["a" /* MyordersPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_notification_notification__["a" /* NotificationPage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_offers_offers__["a" /* OffersPage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_orderconfirmed_orderconfirmed__["a" /* OrderconfirmedPage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_orderslip_orderslip__["a" /* OrderslipPage */],
                __WEBPACK_IMPORTED_MODULE_21__pages_otp_otp__["a" /* OtpPage */],
                __WEBPACK_IMPORTED_MODULE_57__pages_payment_payment__["a" /* PaymentPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_profile_profile__["a" /* ProfilePage */],
                __WEBPACK_IMPORTED_MODULE_15__pages_rate_rate__["a" /* RatePage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_selectclothes_selectclothes__["a" /* SelectclothesPage */],
                __WEBPACK_IMPORTED_MODULE_17__pages_selectdate_selectdate__["a" /* SelectdatePage */],
                __WEBPACK_IMPORTED_MODULE_18__pages_tabs_tabs__["a" /* TabsPage */],
                __WEBPACK_IMPORTED_MODULE_19__pages_tnc_tnc__["a" /* TncPage */],
                __WEBPACK_IMPORTED_MODULE_36__pages_code_code__["a" /* CodePage */],
                __WEBPACK_IMPORTED_MODULE_43__pages_selectarea_selectarea__["a" /* SelectareaPage */],
                __WEBPACK_IMPORTED_MODULE_45__pages_password_password__["a" /* PasswordPage */],
                __WEBPACK_IMPORTED_MODULE_46__pages_managelanguage_managelanguage__["a" /* ManagelanguagePage */],
                __WEBPACK_IMPORTED_MODULE_51__pages_contact_us_contact_us__["a" /* Contact_usPage */],
                __WEBPACK_IMPORTED_MODULE_52__pages_conversation_conversation__["a" /* ConversationPage */],
                __WEBPACK_IMPORTED_MODULE_47__pages_add_address_title_add_address_title__["a" /* Add_address_titlePage */],
                __WEBPACK_IMPORTED_MODULE_53__pages_selectshipping_selectshipping__["a" /* SelectShippingPage */],
                __WEBPACK_IMPORTED_MODULE_56__pages_vt_popup_vt_popup__["a" /* Vt_popupPage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_27__angular_common_http__["b" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["f" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */], {}, {
                    links: []
                }),
                __WEBPACK_IMPORTED_MODULE_25__ngx_translate_core__["b" /* TranslateModule */].forRoot({
                    loader: {
                        provide: __WEBPACK_IMPORTED_MODULE_25__ngx_translate_core__["a" /* TranslateLoader */],
                        useFactory: createTranslateLoader,
                        deps: [__WEBPACK_IMPORTED_MODULE_27__angular_common_http__["a" /* HttpClient */]]
                    }
                })
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_4__pages_myaddress_myaddress__["a" /* MyaddressPage */],
                __WEBPACK_IMPORTED_MODULE_20__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_22__pages_phone_phone__["a" /* PhonePage */],
                __WEBPACK_IMPORTED_MODULE_23__pages_createaccount_createaccount__["a" /* CreateaccountPage */],
                __WEBPACK_IMPORTED_MODULE_3__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_5__pages_about_about__["a" /* AboutPage */],
                __WEBPACK_IMPORTED_MODULE_6__pages_account_account__["a" /* AccountPage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_contact_contact__["a" /* ContactPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_myorders_myorders__["a" /* MyordersPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_notification_notification__["a" /* NotificationPage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_offers_offers__["a" /* OffersPage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_orderconfirmed_orderconfirmed__["a" /* OrderconfirmedPage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_orderslip_orderslip__["a" /* OrderslipPage */],
                __WEBPACK_IMPORTED_MODULE_21__pages_otp_otp__["a" /* OtpPage */],
                __WEBPACK_IMPORTED_MODULE_57__pages_payment_payment__["a" /* PaymentPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_profile_profile__["a" /* ProfilePage */],
                __WEBPACK_IMPORTED_MODULE_15__pages_rate_rate__["a" /* RatePage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_selectclothes_selectclothes__["a" /* SelectclothesPage */],
                __WEBPACK_IMPORTED_MODULE_17__pages_selectdate_selectdate__["a" /* SelectdatePage */],
                __WEBPACK_IMPORTED_MODULE_18__pages_tabs_tabs__["a" /* TabsPage */],
                __WEBPACK_IMPORTED_MODULE_19__pages_tnc_tnc__["a" /* TncPage */],
                __WEBPACK_IMPORTED_MODULE_36__pages_code_code__["a" /* CodePage */],
                __WEBPACK_IMPORTED_MODULE_43__pages_selectarea_selectarea__["a" /* SelectareaPage */],
                __WEBPACK_IMPORTED_MODULE_45__pages_password_password__["a" /* PasswordPage */],
                __WEBPACK_IMPORTED_MODULE_46__pages_managelanguage_managelanguage__["a" /* ManagelanguagePage */],
                __WEBPACK_IMPORTED_MODULE_51__pages_contact_us_contact_us__["a" /* Contact_usPage */],
                __WEBPACK_IMPORTED_MODULE_52__pages_conversation_conversation__["a" /* ConversationPage */],
                __WEBPACK_IMPORTED_MODULE_47__pages_add_address_title_add_address_title__["a" /* Add_address_titlePage */],
                __WEBPACK_IMPORTED_MODULE_53__pages_selectshipping_selectshipping__["a" /* SelectShippingPage */],
                __WEBPACK_IMPORTED_MODULE_56__pages_vt_popup_vt_popup__["a" /* Vt_popupPage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_32__ionic_native_device__["a" /* Device */],
                __WEBPACK_IMPORTED_MODULE_30__ionic_native_onesignal__["a" /* OneSignal */],
                __WEBPACK_IMPORTED_MODULE_33__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_34__ionic_native_splash_screen__["a" /* SplashScreen */],
                __WEBPACK_IMPORTED_MODULE_35__ionic_native_clipboard__["a" /* Clipboard */],
                __WEBPACK_IMPORTED_MODULE_28__ionic_native_in_app_browser__["a" /* InAppBrowser */],
                __WEBPACK_IMPORTED_MODULE_31__ionic_native_globalization__["a" /* Globalization */],
                __WEBPACK_IMPORTED_MODULE_37__ionic_native_call_number__["a" /* CallNumber */],
                __WEBPACK_IMPORTED_MODULE_38__ionic_native_email_composer__["a" /* EmailComposer */],
                __WEBPACK_IMPORTED_MODULE_39__ionic_native_geolocation__["a" /* Geolocation */],
                __WEBPACK_IMPORTED_MODULE_40__ionic_native_network__["a" /* Network */],
                __WEBPACK_IMPORTED_MODULE_41__providers_connectivity_service__["a" /* Connectivity */],
                __WEBPACK_IMPORTED_MODULE_42__providers_google_maps__["a" /* GoogleMaps */],
                __WEBPACK_IMPORTED_MODULE_29__ionic_native_google_plus__["a" /* GooglePlus */],
                __WEBPACK_IMPORTED_MODULE_44__ionic_native_facebook__["a" /* Facebook */],
                __WEBPACK_IMPORTED_MODULE_48__ionic_native_image_picker__["a" /* ImagePicker */],
                __WEBPACK_IMPORTED_MODULE_49__ionic_native_crop__["a" /* Crop */],
                __WEBPACK_IMPORTED_MODULE_50__ionic_native_file__["a" /* File */],
                __WEBPACK_IMPORTED_MODULE_54__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_55__providers_global__["a" /* Global */],
                { provide: __WEBPACK_IMPORTED_MODULE_24__app_config__["a" /* APP_CONFIG */], useValue: __WEBPACK_IMPORTED_MODULE_24__app_config__["b" /* BaseAppConfig */] },
                { provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["e" /* IonicErrorHandler */] }
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 42:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Helper; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_moment__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_moment__);


var Helper = /** @class */ (function () {
    function Helper() {
    }
    Helper.getSetting = function (key) {
        var toReturn = null;
        var settings = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_0__constants_models__["a" /* Constants */].SETTINGS));
        if (settings && settings[key])
            return settings[key];
        else
            return toReturn;
    };
    Helper.extractUserIdFromError = function (err) {
        if (err && err.error && err.error.text) {
            var errText = String(err.error.text);
            var usersIndex = errText.indexOf("/users/");
            if (usersIndex != -1) {
                errText = errText.substring(usersIndex + "/users/".length, errText.length);
                var qIndex = errText.indexOf("\"");
                if (qIndex != -1) {
                    return Number(errText.substring(0, qIndex));
                }
                else {
                    return -1;
                }
            }
            else {
                return -1;
            }
        }
        else {
            return -1;
        }
    };
    Helper.extractOrderIdFromError = function (err) {
        if (err && err.error && err.error.text) {
            var errText = String(err.error.text);
            var usersIndex = errText.indexOf("/orders/");
            if (usersIndex != -1) {
                errText = errText.substring(usersIndex + "/orders/".length, errText.length);
                var qIndex = errText.indexOf("\"");
                if (qIndex != -1) {
                    return Number(errText.substring(0, qIndex));
                }
                else {
                    return -1;
                }
            }
            else {
                return -1;
            }
        }
        else {
            return -1;
        }
    };
    Helper.getLocale = function () {
        var sl = window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_0__constants_models__["a" /* Constants */].KEY_LOCALE);
        return sl && sl.length ? sl : "en";
    };
    Helper.formatTimestampDateTime = function (timestamp, locale) {
        return __WEBPACK_IMPORTED_MODULE_1_moment___default()(timestamp).locale(locale).format("DD MMM, HH:mm");
    };
    Helper.formatTimestampDate = function (timestamp, locale) {
        return __WEBPACK_IMPORTED_MODULE_1_moment___default()(timestamp).locale(locale).format("DD MMM YYYY");
    };
    //
    Helper.getChatChild = function (userId, myId) {
        //example: userId="9" and myId="5" -->> chat child = "5-9"
        var values = [userId, myId];
        values.sort(function (one, two) { return (one > two ? -1 : 1); });
        return values[0] + "-" + values[1];
    };
    Helper.formatMillisDateTime = function (millis, locale) {
        //return moment(millis).locale(locale).format("ddd, MMM D, h:mm");
        return __WEBPACK_IMPORTED_MODULE_1_moment___default()(millis).locale(locale).format("DD MMM, HH:mm");
    };
    // static formatTimestampDateTime(timestamp: string, locale: string): string {
    //     return moment(timestamp).locale(locale).format("ddd, MMM D, h:mm");
    // }
    Helper.formatMillisDate = function (millis, locale) {
        return __WEBPACK_IMPORTED_MODULE_1_moment___default()(millis).locale(locale).format("DD MMM YYYY");
    };
    // static formatTimestampDate(timestamp: string, locale: string): string {
    //     return moment(timestamp).locale(locale).format("DD MMM YYYY");
    // }
    Helper.formatMillisTime = function (millis, locale) {
        return __WEBPACK_IMPORTED_MODULE_1_moment___default()(millis).locale(locale).format("h:mm");
    };
    Helper.formatTimestampTime = function (timestamp, locale) {
        return __WEBPACK_IMPORTED_MODULE_1_moment___default()(timestamp).locale(locale).format("h:mm");
    };
    return Helper;
}());

//# sourceMappingURL=helper.models.js.map

/***/ }),

/***/ 458:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(233);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(235);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__node_modules_ngx_translate_core__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_wordpress_client_service__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__models_auth_credential_models__ = __webpack_require__(125);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__app_config__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_native_onesignal__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_tabs_tabs__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_firebase__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_vt_popup_vt_popup__ = __webpack_require__(403);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_managelanguage_managelanguage__ = __webpack_require__(137);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};














var MyApp = /** @class */ (function () {
    function MyApp(config, app, oneSignal, events, toastCtrl, service, platform, translate, statusBar, splashScreen, modalCtrl) {
        var _this = this;
        this.config = config;
        this.app = app;
        this.oneSignal = oneSignal;
        this.toastCtrl = toastCtrl;
        this.service = service;
        this.platform = platform;
        this.translate = translate;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.modalCtrl = modalCtrl;
        this.subscriptions = [];
        this.rtlSide = "left";
        var superAuth = "";
        if (config.apiBase && config.apiBase.startsWith('https') && config.consumerKey && config.consumerKey.length && config.consumerSecret && config.consumerSecret.length) {
            superAuth = ("Basic " + btoa(config.consumerKey + ":" + config.consumerSecret));
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].ADMIN_API_KEY, superAuth);
            this.onSuperAuthSetup(superAuth);
        }
        else if (config.apiBase && config.apiBase.startsWith('http:') && config.adminUsername && config.adminUsername.length && config.adminPassword && config.adminPassword.length) {
            var subscription = service.getAuthToken(new __WEBPACK_IMPORTED_MODULE_6__models_auth_credential_models__["a" /* AuthCredential */](config.adminUsername, config.adminPassword)).subscribe(function (data) {
                var authResponse = data;
                superAuth = ("Bearer " + authResponse.token);
                window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].ADMIN_API_KEY, superAuth);
                _this.onSuperAuthSetup(superAuth);
            }, function (err) {
                console.log('auth setup error', err);
            });
            this.subscriptions.push(subscription);
        }
        else {
            console.log('auth setup error');
        }
        events.subscribe('language:selection', function (language) {
            _this.globalize(language);
            if (_this.user)
                _this.updateUserLanguage(language);
        });
        events.subscribe('user:login', function (user) {
            _this.user = user;
            _this.setupAvtar();
            if (_this.platform.is("cordova") && _this.user) {
                _this.updatePlayerId();
                _this.updateUserLanguage(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].KEY_DEFAULT_LANGUAGE));
            }
        });
        this.initializeApp();
        if (this.config.demoMode) {
            setTimeout(function () {
                var modal = modalCtrl.create(__WEBPACK_IMPORTED_MODULE_12__pages_vt_popup_vt_popup__["a" /* Vt_popupPage */]);
                modal.onDidDismiss(function (data) { });
                modal.present();
            }, 15000);
        }
    }
    MyApp.prototype.onSuperAuthSetup = function (superAuth) {
        console.log('auth setup success: ' + superAuth);
        this.loadParentCategories();
        this.loadPaymentGateways();
        this.loadCurrency();
        this.loadShipping();
    };
    MyApp.prototype.loadShipping = function () {
        var _this = this;
        // let selectedShippingMethod: ShippingMethod = JSON.parse(window.localStorage.getItem(Constants.SELECTED_SHIPPING_METHOD));
        // if (selectedShippingMethod) {
        //   console.log('selectedShippingMethod', selectedShippingMethod);
        //   let subscription1: Subscription = this.service.shippingMethod(window.localStorage.getItem(Constants.ADMIN_API_KEY), selectedShippingMethod.method_id).subscribe(data => {
        //     window.localStorage.setItem(Constants.SELECTED_SHIPPING_METHOD, JSON.stringify(data));
        //   }, err => {
        //     console.log('ErrShippingmethod', err);
        //   });
        //   this.subscriptions.push(subscription1);
        // }
        var subscription2 = this.service.shippingZones(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].ADMIN_API_KEY)).subscribe(function (data) {
            var shippingZones = data;
            console.log('shippingZones', shippingZones);
            var shippingZoneLocations = new Array();
            var timesReturned = 0;
            for (var _i = 0, shippingZones_1 = shippingZones; _i < shippingZones_1.length; _i++) {
                var sz = shippingZones_1[_i];
                var subscription3 = _this.service.shippingZoneLocations(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), sz.id).subscribe(function (data) {
                    shippingZoneLocations = shippingZoneLocations.concat(data);
                    timesReturned = timesReturned + 1;
                    if (timesReturned == shippingZones.length) {
                        window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].SHIPPING_ZONE_LOCATIONS, JSON.stringify(shippingZoneLocations));
                        console.log('shippingZoneLocations', shippingZoneLocations);
                        console.log('shippingZoneLocations setup done');
                    }
                }, function (err) {
                    timesReturned = timesReturned + 1;
                    if (timesReturned == shippingZones.length) {
                        console.log('ErrShippingZoneLocation', err);
                    }
                });
                _this.subscriptions.push(subscription3);
            }
        }, function (err) {
            console.log('ErrShippingZone', err);
        });
        this.subscriptions.push(subscription2);
    };
    MyApp.prototype.loadCurrency = function () {
        var subscription = this.service.currencies(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].ADMIN_API_KEY)).subscribe(function (data) {
            var currency = data;
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].CURRENCY, JSON.stringify(currency));
            console.log('currency setup success');
        }, function (err) {
            console.log('currency setup error');
        });
        this.subscriptions.push(subscription);
    };
    MyApp.prototype.loadPaymentGateways = function () {
        var subscription = this.service.paymentGateways(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].ADMIN_API_KEY)).subscribe(function (data) {
            var paymentGateway = data;
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].PAYMENT_GATEWAYS, JSON.stringify(paymentGateway));
            console.log('pgs setup', data);
        }, function (err) {
            console.log('categories setup error');
        });
        this.subscriptions.push(subscription);
    };
    MyApp.prototype.loadParentCategories = function () {
        var _this = this;
        var subscription = this.service.categoriesWithParentId(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), '0', '1').subscribe(function (data) {
            var categories = data;
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].PRODUCT_CATEGORIES_PARENT, JSON.stringify(categories));
            console.log('categories setup success');
            _this.walkThroughOrHome();
        }, function (err) {
            console.log('categories setup error', err);
            if (window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].PRODUCT_CATEGORIES_PARENT) == null) {
                _this.showToast("App setup failed, retry after some time.");
            }
        });
        this.subscriptions.push(subscription);
    };
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            _this.statusBar.styleDefault();
            _this.splashScreen.show();
            __WEBPACK_IMPORTED_MODULE_11_firebase___default.a.initializeApp({
                apiKey: _this.config.firebaseConfig.apiKey,
                authDomain: _this.config.firebaseConfig.authDomain,
                databaseURL: _this.config.firebaseConfig.databaseURL,
                projectId: _this.config.firebaseConfig.projectId,
                storageBucket: _this.config.firebaseConfig.storageBucket,
                messagingSenderId: _this.config.firebaseConfig.messagingSenderId
            });
            if (_this.platform.is('cordova'))
                _this.initOneSignal();
            _this.user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].USER_KEY));
            _this.setupAvtar();
            setTimeout(function () {
                var categories = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].PRODUCT_CATEGORIES_PARENT));
                if (categories && categories.length) {
                    _this.walkThroughOrHome();
                }
                if (_this.platform.is("cordova") && _this.user) {
                    _this.updatePlayerId();
                    _this.updateUserLanguage(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].KEY_DEFAULT_LANGUAGE));
                }
                //after basic init
                var component = _this;
                __WEBPACK_IMPORTED_MODULE_11_firebase___default.a.database().ref(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].REF_ADMIN_USER).on("value", function (snap) {
                    console.log("REF_ADMIN_USER", snap.val());
                    component.userAdmin = snap.val();
                    window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].USER_ADMIN_KEY, JSON.stringify(component.userAdmin));
                });
            }, 3000);
            var defaultLang = window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].KEY_DEFAULT_LANGUAGE);
            _this.globalize(defaultLang);
        });
    };
    MyApp.prototype.walkThroughOrHome = function () {
        this.splashScreen.hide();
        if (!this.app.getRootNav().getActive() || !(this.app.getRootNav().getActive().instance instanceof __WEBPACK_IMPORTED_MODULE_10__pages_tabs_tabs__["a" /* TabsPage */]))
            this.app.getRootNav().setRoot(this.config.demoMode ? __WEBPACK_IMPORTED_MODULE_13__pages_managelanguage_managelanguage__["a" /* ManagelanguagePage */] : __WEBPACK_IMPORTED_MODULE_10__pages_tabs_tabs__["a" /* TabsPage */]);
    };
    MyApp.prototype.setupAvtar = function () {
        if (this.user && this.user.avatar_url && (this.user.avatar_url.includes("gravatar.com") || this.user.avatar_url.includes("avatar")))
            this.user.avatar_url = null;
        if (this.user && this.user.meta_data) {
            for (var _i = 0, _a = this.user.meta_data; _i < _a.length; _i++) {
                var meta = _a[_i];
                if (meta.key == "avatar_url" && meta.value && meta.value.length) {
                    this.user.avatar_url = meta.value;
                    break;
                }
            }
        }
    };
    MyApp.prototype.updatePlayerId = function () {
        var _this = this;
        this.oneSignal.getIds().then(function (id) {
            if (id && id.userId) {
                __WEBPACK_IMPORTED_MODULE_11_firebase___default.a.database().ref(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].REF_USERS_FCM_IDS).child((_this.user.id + "customer")).set(id.userId);
                _this.subscriptions.push(_this.service.registerForPushNotification(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(_this.user.id), id.userId).subscribe(function (data) { return console.log(data); }, function (err) { return console.log(err); }));
            }
        });
    };
    MyApp.prototype.updateUserLanguage = function (language) {
        var langToUpdate = language && language.length ? language : this.config.availableLanguages[0].code;
        this.service.updateUser(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(this.user.id), { meta_data: [{ key: "language", value: langToUpdate }] }).subscribe(function (data) {
            console.log("updateUser", data);
        }, function (err) {
            console.log("updateUser", err);
        });
    };
    MyApp.prototype.globalize = function (languagePriority) {
        this.translate.setDefaultLang("en");
        var defaultLangCode = this.config.availableLanguages[0].code;
        this.translate.use(languagePriority && languagePriority.length ? languagePriority : defaultLangCode);
        this.setDirectionAccordingly(languagePriority && languagePriority.length ? languagePriority : defaultLangCode);
        window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_7__models_constants_models__["a" /* Constants */].KEY_LOCALE, languagePriority && languagePriority.length ? languagePriority : defaultLangCode);
    };
    MyApp.prototype.setDirectionAccordingly = function (lang) {
        switch (lang) {
            case 'ar': {
                this.platform.setDir('ltr', false);
                this.platform.setDir('rtl', true);
                this.rtlSide = "right";
                break;
            }
            default: {
                this.platform.setDir('rtl', false);
                this.platform.setDir('ltr', true);
                this.rtlSide = "left";
                break;
            }
        }
    };
    MyApp.prototype.getSideOfCurLang = function () {
        this.rtlSide = this.platform.dir() === 'rtl' ? "right" : "left";
        return this.rtlSide;
    };
    MyApp.prototype.getSuitableLanguage = function (language) {
        window.localStorage.setItem("locale", language);
        language = language.substring(0, 2).toLowerCase();
        console.log('check for: ' + language);
        return this.config.availableLanguages.some(function (x) { return x.code == language; }) ? language : 'en';
    };
    MyApp.prototype.initOneSignal = function () {
        this.oneSignal.startInit(this.config.oneSignalAppId, this.config.oneSignalGPSenderId);
        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
        this.oneSignal.handleNotificationReceived().subscribe(function (data) {
            // do something when notification is received
            console.log(data);
        });
        this.oneSignal.handleNotificationOpened().subscribe(function (data) {
            // do something when a notification is opened
        });
        this.oneSignal.endInit();
    };
    MyApp.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* Nav */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* Nav */])
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"D:\PTH\Laundry Shop\Salavai-User\src\app\app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n'/*ion-inline-end:"D:\PTH\Laundry Shop\Salavai-User\src\app\app.html"*/
        }),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_8__app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
            __WEBPACK_IMPORTED_MODULE_9__ionic_native_onesignal__["a" /* OneSignal */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Events */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_5__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* Platform */], __WEBPACK_IMPORTED_MODULE_4__node_modules_ngx_translate_core__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* ModalController */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 487:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": 238,
	"./af.js": 238,
	"./ar": 239,
	"./ar-dz": 240,
	"./ar-dz.js": 240,
	"./ar-kw": 241,
	"./ar-kw.js": 241,
	"./ar-ly": 242,
	"./ar-ly.js": 242,
	"./ar-ma": 243,
	"./ar-ma.js": 243,
	"./ar-sa": 244,
	"./ar-sa.js": 244,
	"./ar-tn": 245,
	"./ar-tn.js": 245,
	"./ar.js": 239,
	"./az": 246,
	"./az.js": 246,
	"./be": 247,
	"./be.js": 247,
	"./bg": 248,
	"./bg.js": 248,
	"./bm": 249,
	"./bm.js": 249,
	"./bn": 250,
	"./bn-bd": 251,
	"./bn-bd.js": 251,
	"./bn.js": 250,
	"./bo": 252,
	"./bo.js": 252,
	"./br": 253,
	"./br.js": 253,
	"./bs": 254,
	"./bs.js": 254,
	"./ca": 255,
	"./ca.js": 255,
	"./cs": 256,
	"./cs.js": 256,
	"./cv": 257,
	"./cv.js": 257,
	"./cy": 258,
	"./cy.js": 258,
	"./da": 259,
	"./da.js": 259,
	"./de": 260,
	"./de-at": 261,
	"./de-at.js": 261,
	"./de-ch": 262,
	"./de-ch.js": 262,
	"./de.js": 260,
	"./dv": 263,
	"./dv.js": 263,
	"./el": 264,
	"./el.js": 264,
	"./en-au": 265,
	"./en-au.js": 265,
	"./en-ca": 266,
	"./en-ca.js": 266,
	"./en-gb": 267,
	"./en-gb.js": 267,
	"./en-ie": 268,
	"./en-ie.js": 268,
	"./en-il": 269,
	"./en-il.js": 269,
	"./en-in": 270,
	"./en-in.js": 270,
	"./en-nz": 271,
	"./en-nz.js": 271,
	"./en-sg": 272,
	"./en-sg.js": 272,
	"./eo": 273,
	"./eo.js": 273,
	"./es": 274,
	"./es-do": 275,
	"./es-do.js": 275,
	"./es-mx": 276,
	"./es-mx.js": 276,
	"./es-us": 277,
	"./es-us.js": 277,
	"./es.js": 274,
	"./et": 278,
	"./et.js": 278,
	"./eu": 279,
	"./eu.js": 279,
	"./fa": 280,
	"./fa.js": 280,
	"./fi": 281,
	"./fi.js": 281,
	"./fil": 282,
	"./fil.js": 282,
	"./fo": 283,
	"./fo.js": 283,
	"./fr": 284,
	"./fr-ca": 285,
	"./fr-ca.js": 285,
	"./fr-ch": 286,
	"./fr-ch.js": 286,
	"./fr.js": 284,
	"./fy": 287,
	"./fy.js": 287,
	"./ga": 288,
	"./ga.js": 288,
	"./gd": 289,
	"./gd.js": 289,
	"./gl": 290,
	"./gl.js": 290,
	"./gom-deva": 291,
	"./gom-deva.js": 291,
	"./gom-latn": 292,
	"./gom-latn.js": 292,
	"./gu": 293,
	"./gu.js": 293,
	"./he": 294,
	"./he.js": 294,
	"./hi": 295,
	"./hi.js": 295,
	"./hr": 296,
	"./hr.js": 296,
	"./hu": 297,
	"./hu.js": 297,
	"./hy-am": 298,
	"./hy-am.js": 298,
	"./id": 299,
	"./id.js": 299,
	"./is": 300,
	"./is.js": 300,
	"./it": 301,
	"./it-ch": 302,
	"./it-ch.js": 302,
	"./it.js": 301,
	"./ja": 303,
	"./ja.js": 303,
	"./jv": 304,
	"./jv.js": 304,
	"./ka": 305,
	"./ka.js": 305,
	"./kk": 306,
	"./kk.js": 306,
	"./km": 307,
	"./km.js": 307,
	"./kn": 308,
	"./kn.js": 308,
	"./ko": 309,
	"./ko.js": 309,
	"./ku": 310,
	"./ku.js": 310,
	"./ky": 311,
	"./ky.js": 311,
	"./lb": 312,
	"./lb.js": 312,
	"./lo": 313,
	"./lo.js": 313,
	"./lt": 314,
	"./lt.js": 314,
	"./lv": 315,
	"./lv.js": 315,
	"./me": 316,
	"./me.js": 316,
	"./mi": 317,
	"./mi.js": 317,
	"./mk": 318,
	"./mk.js": 318,
	"./ml": 319,
	"./ml.js": 319,
	"./mn": 320,
	"./mn.js": 320,
	"./mr": 321,
	"./mr.js": 321,
	"./ms": 322,
	"./ms-my": 323,
	"./ms-my.js": 323,
	"./ms.js": 322,
	"./mt": 324,
	"./mt.js": 324,
	"./my": 325,
	"./my.js": 325,
	"./nb": 326,
	"./nb.js": 326,
	"./ne": 327,
	"./ne.js": 327,
	"./nl": 328,
	"./nl-be": 329,
	"./nl-be.js": 329,
	"./nl.js": 328,
	"./nn": 330,
	"./nn.js": 330,
	"./oc-lnc": 331,
	"./oc-lnc.js": 331,
	"./pa-in": 332,
	"./pa-in.js": 332,
	"./pl": 333,
	"./pl.js": 333,
	"./pt": 334,
	"./pt-br": 335,
	"./pt-br.js": 335,
	"./pt.js": 334,
	"./ro": 336,
	"./ro.js": 336,
	"./ru": 337,
	"./ru.js": 337,
	"./sd": 338,
	"./sd.js": 338,
	"./se": 339,
	"./se.js": 339,
	"./si": 340,
	"./si.js": 340,
	"./sk": 341,
	"./sk.js": 341,
	"./sl": 342,
	"./sl.js": 342,
	"./sq": 343,
	"./sq.js": 343,
	"./sr": 344,
	"./sr-cyrl": 345,
	"./sr-cyrl.js": 345,
	"./sr.js": 344,
	"./ss": 346,
	"./ss.js": 346,
	"./sv": 347,
	"./sv.js": 347,
	"./sw": 348,
	"./sw.js": 348,
	"./ta": 349,
	"./ta.js": 349,
	"./te": 350,
	"./te.js": 350,
	"./tet": 351,
	"./tet.js": 351,
	"./tg": 352,
	"./tg.js": 352,
	"./th": 353,
	"./th.js": 353,
	"./tk": 354,
	"./tk.js": 354,
	"./tl-ph": 355,
	"./tl-ph.js": 355,
	"./tlh": 356,
	"./tlh.js": 356,
	"./tr": 357,
	"./tr.js": 357,
	"./tzl": 358,
	"./tzl.js": 358,
	"./tzm": 359,
	"./tzm-latn": 360,
	"./tzm-latn.js": 360,
	"./tzm.js": 359,
	"./ug-cn": 361,
	"./ug-cn.js": 361,
	"./uk": 362,
	"./uk.js": 362,
	"./ur": 363,
	"./ur.js": 363,
	"./uz": 364,
	"./uz-latn": 365,
	"./uz-latn.js": 365,
	"./uz.js": 364,
	"./vi": 366,
	"./vi.js": 366,
	"./x-pseudo": 367,
	"./x-pseudo.js": 367,
	"./yo": 368,
	"./yo.js": 368,
	"./zh-cn": 369,
	"./zh-cn.js": 369,
	"./zh-hk": 370,
	"./zh-hk.js": 370,
	"./zh-mo": 371,
	"./zh-mo.js": 371,
	"./zh-tw": 372,
	"./zh-tw.js": 372
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 487;

/***/ }),

/***/ 498:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CartItem; });
var CartItem = /** @class */ (function () {
    function CartItem() {
    }
    return CartItem;
}());

//# sourceMappingURL=cart-item.models.js.map

/***/ }),

/***/ 499:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyLocation; });
var MyLocation = /** @class */ (function () {
    function MyLocation() {
    }
    return MyLocation;
}());

//# sourceMappingURL=my-location.models.js.map

/***/ }),

/***/ 500:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Address; });
var Address = /** @class */ (function () {
    function Address() {
    }
    return Address;
}());

//# sourceMappingURL=address.models.js.map

/***/ }),

/***/ 501:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrderRequest; });
var OrderRequest = /** @class */ (function () {
    function OrderRequest() {
    }
    return OrderRequest;
}());

//# sourceMappingURL=order-request.models.js.map

/***/ }),

/***/ 502:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return KeyValue; });
var KeyValue = /** @class */ (function () {
    function KeyValue(key, value) {
        this.key = key;
        this.value = value;
    }
    return KeyValue;
}());

//# sourceMappingURL=key-value.models.js.map

/***/ }),

/***/ 503:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CardInfo; });
var CardInfo = /** @class */ (function () {
    function CardInfo() {
    }
    CardInfo.prototype.areFieldsFilled = function () {
        return ((this.name && this.name.length)
            &&
                (this.number && this.number.length > 10)
            &&
                (this.expMonth && this.expMonth <= 12 && this.expMonth >= 1)
            &&
                (this.expYear && this.expYear <= 99)
            &&
                (this.cvc && this.cvc.length == 3));
    };
    return CardInfo;
}());

//# sourceMappingURL=card-info.models.js.map

/***/ }),

/***/ 504:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StripeRequest; });
var StripeRequest = /** @class */ (function () {
    function StripeRequest(payment_method, order_id, payment_token) {
        this.payment_method = payment_method;
        this.order_id = order_id;
        this.payment_token = payment_token;
    }
    return StripeRequest;
}());

//# sourceMappingURL=stripe-request.models.js.map

/***/ }),

/***/ 505:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ShippingLine; });
var ShippingLine = /** @class */ (function () {
    function ShippingLine(method_id, method_title, total) {
        this.method_id = method_id;
        this.method_title = method_title;
        this.total = total;
    }
    return ShippingLine;
}());

//# sourceMappingURL=shipping-line.models.js.map

/***/ }),

/***/ 506:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LineItem; });
var LineItem = /** @class */ (function () {
    function LineItem() {
    }
    return LineItem;
}());

//# sourceMappingURL=line-item.models.js.map

/***/ }),

/***/ 509:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Message; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helper_models__ = __webpack_require__(42);

var Message = /** @class */ (function () {
    function Message() {
    }
    Message.prototype.fromRow = function (arg0) {
        this.senderName = arg0.senderName;
        this.senderImage = arg0.senderImage;
        this.senderStatus = arg0.senderStatus;
        this.recipientName = arg0.recipientName;
        this.recipientImage = arg0.recipientImage;
        this.recipientStatus = arg0.recipientStatus;
        this.recipientId = arg0.recipientId;
        this.senderId = arg0.senderId;
        this.chatId = arg0.chatId;
        this.id = arg0.id;
        this.body = arg0.body;
        this.dateTimeStamp = arg0.dateTimeStamp;
        this.timeDiff = __WEBPACK_IMPORTED_MODULE_0__helper_models__["a" /* Helper */].formatMillisDateTime(Number(this.dateTimeStamp), __WEBPACK_IMPORTED_MODULE_0__helper_models__["a" /* Helper */].getLocale());
        this.delivered = arg0.delivered == 1;
        this.sent = arg0.sent == 1;
    };
    return Message;
}());

//# sourceMappingURL=message.models.js.map

/***/ }),

/***/ 510:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Chat; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helper_models__ = __webpack_require__(42);

var Chat = /** @class */ (function () {
    function Chat() {
    }
    Chat.fromMessage = function (msg, isMeSender) {
        var chat = new Chat();
        chat.chatId = isMeSender ? msg.recipientId : msg.senderId;
        chat.myId = isMeSender ? msg.senderId : msg.recipientId;
        chat.chatName = isMeSender ? msg.recipientName : msg.senderName;
        chat.chatImage = isMeSender ? msg.recipientImage : msg.senderImage;
        chat.chatStatus = isMeSender ? msg.recipientStatus : msg.senderStatus;
        chat.dateTimeStamp = msg.dateTimeStamp;
        chat.timeDiff = __WEBPACK_IMPORTED_MODULE_0__helper_models__["a" /* Helper */].formatMillisDateTime(Number(chat.dateTimeStamp), __WEBPACK_IMPORTED_MODULE_0__helper_models__["a" /* Helper */].getLocale());
        chat.lastMessage = msg.body;
        return chat;
    };
    return Chat;
}());

//# sourceMappingURL=chat.models.js.map

/***/ }),

/***/ 511:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NotificationPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__login_login__ = __webpack_require__(53);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var NotificationPage = /** @class */ (function () {
    function NotificationPage(navCtrl) {
        this.navCtrl = navCtrl;
        this.items = [
            {
                image: "assets/imgs/confirmed.png",
                title: "Order Confirmed",
                detail: "Your order No. 123456345 is confirmed now. pick up guy will reach on selected date & time.",
                time: "12:00 pm",
            },
            {
                image: "assets/imgs/dispatched.png",
                title: "Order Ready to Deliver",
                detail: "Your order No. 123456345 is confirmed now. pick up guy will reach on selected date & time.",
                time: "12:00 pm",
            },
            {
                image: "assets/imgs/inporcess.png",
                title: "Order is under process",
                detail: "Your order No. 123456345 is confirmed now. pick up guy will reach on selected date & time.",
                time: "12:00 pm",
            },
            {
                image: "assets/imgs/delivered.png",
                title: "Order Delivered",
                detail: "Your order No. 123456345 is confirmed now. pick up guy will reach on selected date & time.",
                time: "12:00 pm",
            },
            {
                image: "assets/imgs/dispatched.png",
                title: "Order Ready to Deliver",
                detail: "Your order No. 123456345 is confirmed now. pick up guy will reach on selected date & time.",
                time: "12:00 pm",
            },
            {
                image: "assets/imgs/inporcess.png",
                title: "Order is under process",
                detail: "Your order No. 123456345 is confirmed now. pick up guy will reach on selected date & time.",
                time: "12:00 pm",
            },
            {
                image: "assets/imgs/delivered.png",
                title: "Order Delivered",
                detail: "Your order No. 123456345 is confirmed now. pick up guy will reach on selected date & time.",
                time: "12:00 pm",
            }
        ];
        this.user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].USER_KEY));
    }
    NotificationPage.prototype.login = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__login_login__["a" /* LoginPage */]);
    };
    NotificationPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-notification',template:/*ion-inline-start:"D:\PTH\Laundry Shop\Salavai-User\src\pages\notification\notification.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{"notification" | translate}}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="bg-light">\n    <div class="empty-view">\n        <div style="text-align:center">\n            <img src="assets/imgs/notification.png" alt="no notification" />\n            <p style="color:#9E9E9E; font-weight:bold;">No notifications to show\n                <br /><span *ngIf="!user"> You\'re not sign in yet</span>\n            </p>\n            <button ion-button *ngIf="!user" (click)="login()">Sign in now</button>\n        </div>\n    </div>\n    <!-- <ion-list no-lines>\n    <ion-item *ngFor="let item of items">\n      <ion-avatar item-start>\n        <img [src]="item.image">\n      </ion-avatar>\n      <ion-label>\n        <h2 [innerHTML]="item.title"></h2>\n        <p [innerHTML]="item.detail"></p>\n      </ion-label>\n      <ion-note item-end [innerHTML]="item.time"></ion-note>\n    </ion-item>\n  </ion-list> -->\n</ion-content>\n'/*ion-inline-end:"D:\PTH\Laundry Shop\Salavai-User\src\pages\notification\notification.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */]])
    ], NotificationPage);
    return NotificationPage;
}());

//# sourceMappingURL=notification.js.map

/***/ }),

/***/ 512:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RatePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tabs_tabs__ = __webpack_require__(34);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var RatePage = /** @class */ (function () {
    function RatePage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    RatePage.prototype.tabs = function () {
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_2__tabs_tabs__["a" /* TabsPage */]);
    };
    RatePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-rate',template:/*ion-inline-start:"D:\PTH\Laundry Shop\Salavai-User\src\pages\rate\rate.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{"rate_order" | translate}}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content>\n    <div class="status" padding text-center>\n        <img src="assets/imgs/delivered.png">\n        <p>{{"hey" | translate}} Sam,<br>{{"order_delivered" | translate}}</p>\n    </div>\n    <div class="rate" padding text-center>\n        <p>{{"rate_last_experience" | translate}}</p>\n        <div class="stars">\n            <ion-icon name="md-star"></ion-icon>\n            <ion-icon name="md-star"></ion-icon>\n            <ion-icon name="md-star"></ion-icon>\n            <ion-icon name="md-star-half"></ion-icon>\n            <ion-icon name="md-star-outline"></ion-icon>\n        </div>\n        <ion-input type="text" placeholder="Share your experiece in words"></ion-input>\n        <button ion-button full style="height: 50px" (click)="tabs()">{{"submit_review" | translate}}</button>\n    </div>\n</ion-content>'/*ion-inline-end:"D:\PTH\Laundry Shop\Salavai-User\src\pages\rate\rate.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */]])
    ], RatePage);
    return RatePage;
}());

//# sourceMappingURL=rate.js.map

/***/ }),

/***/ 52:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Global; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models_cart_item_models__ = __webpack_require__(498);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_constants_models__ = __webpack_require__(9);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var Global = /** @class */ (function () {
    function Global() {
        var cartItems = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].CART_ITEMS));
        if (cartItems != null) {
            this.cartItems = cartItems;
        }
        else {
            this.cartItems = new Array();
        }
        var history = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].SEARCH_HISTORY));
        if (history != null) {
            this.searchHistory = history;
        }
        else {
            this.searchHistory = new Array();
        }
        var favProducts = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].FAVORITE_PRODUCTS));
        if (favProducts != null) {
            this.favorites = favProducts;
        }
        else {
            this.favorites = new Array();
        }
    }
    Global.prototype.updateCartItem = function (pro) {
        var myMap = new Map();
        if (pro.variationsSelected && pro.variationsSelected.length) {
            for (var _i = 0, _a = pro.variationsSelected; _i < _a.length; _i++) {
                var vari = _a[_i];
                for (var i = 0; i < this.cartItems.length; i++) {
                    if (pro.id == this.cartItems[i].pro.id
                        &&
                            vari.id == this.cartItems[i].vari.id) {
                        myMap.set((String(pro.id) + String(vari.id)), String(this.cartItems[i].quantity));
                        break;
                    }
                }
            }
        }
        if (pro.variationsAvailable && pro.variationsAvailable.length) {
            for (var _b = 0, _c = pro.variationsAvailable; _b < _c.length; _b++) {
                var vari = _c[_b];
                this.removeCartVariation(vari);
            }
        }
        if (pro.variationsSelected && pro.variationsSelected.length) {
            for (var _d = 0, _e = pro.variationsSelected; _d < _e.length; _d++) {
                var vari = _e[_d];
                this.addCartVariation(pro, vari, myMap.get(String(pro.id) + String(vari.id)));
            }
        }
    };
    Global.prototype.addCartVariation = function (pro, vari, quantity) {
        var cartItem = new __WEBPACK_IMPORTED_MODULE_1__models_cart_item_models__["a" /* CartItem */]();
        cartItem.vari = vari;
        cartItem.quantity = Number(quantity) ? Number(quantity) : 1;
        cartItem.pro = pro;
        this.cartItems.push(cartItem);
        window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].CART_ITEMS, JSON.stringify(this.cartItems));
    };
    Global.prototype.removeCartVariation = function (pro) {
        var pos = -1;
        for (var i = 0; i < this.cartItems.length; i++) {
            if (pro.id == this.cartItems[i].vari.id) {
                pos = i;
                break;
            }
        }
        if (pos != -1) {
            this.cartItems.splice(pos, 1);
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].CART_ITEMS, JSON.stringify(this.cartItems));
        }
    };
    Global.prototype.decrementCartItem = function (cartItem) {
        var pos = -1;
        for (var i = 0; i < this.cartItems.length; i++) {
            if (cartItem.pro.id == this.cartItems[i].pro.id
                &&
                    cartItem.vari.id == this.cartItems[i].vari.id) {
                pos = i;
                break;
            }
        }
        if (pos != -1) {
            if (this.cartItems[pos].quantity > 1) {
                this.cartItems[pos].quantity = this.cartItems[pos].quantity - 1;
            }
            else {
                this.cartItems.splice(pos, 1);
            }
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].CART_ITEMS, JSON.stringify(this.cartItems));
        }
    };
    Global.prototype.incrementCartItem = function (cartItem) {
        var pos = -1;
        for (var i = 0; i < this.cartItems.length; i++) {
            if (cartItem.pro.id == this.cartItems[i].pro.id
                &&
                    cartItem.vari.id == this.cartItems[i].vari.id) {
                pos = i;
                break;
            }
        }
        if (pos != -1) {
            this.cartItems[pos].quantity = this.cartItems[pos].quantity + 1;
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].CART_ITEMS, JSON.stringify(this.cartItems));
        }
    };
    Global.prototype.setCartItem = function (cartItem) {
        var pos = -1;
        for (var i = 0; i < this.cartItems.length; i++) {
            if (cartItem.pro.id == this.cartItems[i].pro.id
                &&
                    cartItem.vari.id == this.cartItems[i].vari.id) {
                pos = i;
                break;
            }
        }
        if (pos != -1) {
            this.cartItems[pos].quantity = cartItem.quantity;
            if (this.cartItems[pos].quantity <= 0) {
                this.cartItems.splice(pos, 1);
            }
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].CART_ITEMS, JSON.stringify(this.cartItems));
        }
    };
    Global.prototype.clearFavorites = function () {
        this.favorites = new Array();
        window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].FAVORITE_PRODUCTS, JSON.stringify(this.favorites));
    };
    Global.prototype.clearCart = function () {
        this.cartItems = new Array();
        window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].CART_ITEMS, JSON.stringify(this.cartItems));
    };
    Global.prototype.clearSearchHistory = function () {
        this.searchHistory = new Array();
        window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].SEARCH_HISTORY, JSON.stringify(this.searchHistory));
    };
    Global.prototype.getSearchHistory = function () {
        return this.searchHistory;
    };
    Global.prototype.getFavorites = function () {
        return this.favorites;
    };
    Global.prototype.getCartItems = function () {
        return this.cartItems;
    };
    Global.prototype.getCartItemsCount = function () {
        return this.cartItems.length;
    };
    Global = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [])
    ], Global);
    return Global;
}());

//# sourceMappingURL=global.js.map

/***/ }),

/***/ 53:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__phone_phone__ = __webpack_require__(381);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_wordpress_client_service__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__home_home__ = __webpack_require__(134);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__tabs_tabs__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__createaccount_createaccount__ = __webpack_require__(383);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__models_auth_credential_models__ = __webpack_require__(125);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__models_register_request_models__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__app_app_config__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ionic_native_google_plus__ = __webpack_require__(384);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__node_modules_ngx_translate_core__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__password_password__ = __webpack_require__(385);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__ionic_native_facebook__ = __webpack_require__(386);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_firebase__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15_firebase__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__otp_otp__ = __webpack_require__(70);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};

















var LoginPage = /** @class */ (function () {
    function LoginPage(config, translate, facebook, events, modalCtrl, toastCtrl, navCtrl, service, loadingCtrl, alertCtrl, google, platform, app) {
        this.config = config;
        this.translate = translate;
        this.facebook = facebook;
        this.events = events;
        this.modalCtrl = modalCtrl;
        this.toastCtrl = toastCtrl;
        this.navCtrl = navCtrl;
        this.service = service;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.google = google;
        this.platform = platform;
        this.app = app;
        this.loadingShown = false;
        this.registerRequest = new __WEBPACK_IMPORTED_MODULE_9__models_register_request_models__["a" /* RegisterRequest */]('', '', '', '', '');
        this.subscriptions = [];
        this.credentials = new __WEBPACK_IMPORTED_MODULE_7__models_auth_credential_models__["a" /* AuthCredential */]('', '');
        this.registerRequestPasswordConfirm = '';
        this.getCountries();
        this.changeHint();
    }
    LoginPage.prototype.getCountries = function () {
        var _this = this;
        this.service.getCountries().subscribe(function (data) { return _this.countries = data; }, function (err) { return console.log(err); });
    };
    LoginPage.prototype.changeHint = function () {
        var _this = this;
        this.credentials.username = "";
        if (this.countryCode && this.countryCode.length) {
            this.translate.get('phone_excluding').subscribe(function (value) { return _this.phone_hint = (value + " (+" + _this.countryCode + ")"); });
        }
        else {
            this.translate.get('phone').subscribe(function (value) { return _this.phone_hint = value; });
        }
    };
    LoginPage.prototype.signIn = function () {
        var _this = this;
        //this.authError = "";
        this.translate.get(["field_empty_countrycode", "field_empty_both", "loading_sign_in"]).subscribe(function (values) {
            if (!_this.countryCode || !_this.countryCode.length) {
                _this.showToast(values["field_empty_countrycode"]);
            }
            else if (_this.credentials.username.length == 0 || _this.credentials.password.length == 0) {
                _this.showToast(values["field_empty_both"]);
            }
            else {
                _this.presentLoading(values["loading_sign_in"]);
                var credentials = { username: _this.countryCode + _this.credentials.username, password: _this.credentials.password };
                _this.subscriptions.push(_this.service.getAuthToken(credentials).subscribe(function (data) {
                    _this.dismissLoading();
                    var authResponse = data;
                    window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].USER_API_KEY, authResponse.token);
                    _this.getUser(_this.getUserIdFromToken(authResponse.token));
                }, function (err) {
                    console.log("getAuthToken", err);
                    _this.dismissLoading();
                    var keyToGet = "login_error";
                    if (err.error && err.error.code)
                        if (String(err.error.code).includes("username"))
                            keyToGet = "invalid_username";
                        else if (String(err.error.code).includes("password"))
                            keyToGet = "invalid_password";
                    _this.translate.get(keyToGet).subscribe(function (value) { return _this.presentErrorAlert(value); });
                }));
            }
        });
    };
    LoginPage.prototype.loginFB = function () {
        var _this = this;
        this.translate.get('loging_fb').subscribe(function (value) {
            _this.presentLoading(value);
            if (_this.platform.is('cordova')) {
                _this.fbOnPhone();
            }
            else {
                _this.fbOnBrowser();
            }
        });
    };
    LoginPage.prototype.loginGoogle = function () {
        var _this = this;
        this.translate.get('loging_google').subscribe(function (value) {
            _this.presentLoading(value);
            if (_this.platform.is('cordova')) {
                _this.googleOnPhone();
            }
            else {
                _this.googleOnBrowser();
            }
        });
    };
    LoginPage.prototype.googleOnPhone = function () {
        var _this = this;
        var provider = {
            'webClientId': this.config.firebaseConfig.webApplicationId,
            'offline': false,
            'scopes': 'profile email'
        };
        this.google.login(provider).then(function (res) {
            _this.socialDP = String(res.imageUrl).replace("s96-c", "s500-c");
            var googleCredential = __WEBPACK_IMPORTED_MODULE_15_firebase___default.a.auth.GoogleAuthProvider.credential(res.idToken);
            __WEBPACK_IMPORTED_MODULE_15_firebase___default.a.auth().signInAndRetrieveDataWithCredential(googleCredential).then(function (response) {
                _this.registerRequest.first_name = response.user.displayName;
                // this.registerRequest.first_name = this.getNames(response.user.displayName).first_name;
                // this.registerRequest.last_name = this.getNames(response.user.displayName).last_name;
                _this.registerRequest.meta_data = [{ key: "avatar_url", value: _this.socialDP ? _this.socialDP : response.user.photoURL }];
                var profile = JSON.parse(JSON.stringify(response.additionalUserInfo.profile));
                _this.registerRequest.email = profile.email;
                _this.dismissLoading();
                _this.translate.get('google_success_auth2').subscribe(function (value) {
                    _this.presentLoading(value);
                });
                console.log('response after firebase in the google:---' + JSON.stringify(profile));
                // this.presentLoading('Firebase authenticated google signup, creating user..');
                console.log('Firebase authenticated google signup, creating user..');
                _this.checkUser();
            }, function (err) {
                console.log("Error in firebase auth after google login:-- ", JSON.stringify(err));
                _this.dismissLoading();
                _this.presentErrorAlert('google login err: ' + err);
            });
        }, function (err) {
            console.log("Error: in google access:-- ", JSON.stringify(err));
            _this.dismissLoading();
            _this.presentErrorAlert('google login err: ' + err);
        });
    };
    // getNames(displayName) {
    //   let obj = { first_name: '', last_name: '' };
    //   if (!displayName.length || displayName == "") {
    //     return obj;
    //   }
    //   var names = displayName.split(" ");
    //   obj.first_name = names[0];
    //   for (let i = 0; i < names.length; i++) {
    //     if (names[i] != obj.first_name && names[i] != "" && names[i].length > 0) {
    //       obj.last_name = names[i];
    //       break;
    //     }
    //   }
    //   return obj;
    // }
    LoginPage.prototype.googleOnBrowser = function () {
        var _this = this;
        try {
            console.log("In not cordova");
            var provider = new __WEBPACK_IMPORTED_MODULE_15_firebase___default.a.auth.GoogleAuthProvider();
            provider.addScope('email');
            __WEBPACK_IMPORTED_MODULE_15_firebase___default.a.auth().signInWithPopup(provider).then(function (result) {
                _this.registerRequest.email = result.user.email;
                _this.registerRequest.first_name = result.user.displayName;
                // this.registerRequest.first_name = this.getNames(result.user.displayName).first_name;
                // this.registerRequest.last_name = this.getNames(result.user.displayName).last_name;
                _this.registerRequest.meta_data = [{ key: "avatar_url", value: result.user.photoURL }];
                console.log(_this.registerRequest);
                _this.dismissLoading();
                _this.translate.get('google_success_auth2').subscribe(function (value) {
                    _this.presentLoading(value);
                });
                // this.presentLoading('Firebase authenticated google signup, creating user..');
                _this.checkUser();
                console.log(result);
            }).catch(function (error) {
                console.log(error);
                _this.dismissLoading();
            });
        }
        catch (err) {
            this.dismissLoading();
            console.log(err);
        }
    };
    LoginPage.prototype.fbOnPhone = function () {
        var _this = this;
        this.facebook.login(["public_profile", 'email']).then(function (response) {
            _this.socialDP = "https://graph.facebook.com/" + response.authResponse.userID + "/picture?height=500";
            var facebookCredential = __WEBPACK_IMPORTED_MODULE_15_firebase___default.a.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
            __WEBPACK_IMPORTED_MODULE_15_firebase___default.a.auth().signInAndRetrieveDataWithCredential(facebookCredential).then(function (success) {
                _this.registerRequest.email = success.user.email;
                _this.registerRequest.first_name = success.user.displayName;
                // this.registerRequest.first_name = this.getNames(success.user.displayName).first_name;
                // this.registerRequest.last_name = this.getNames(success.user.displayName).last_name;
                _this.registerRequest.meta_data = [{ key: "avatar_url", value: _this.socialDP ? _this.socialDP : success.user.photoURL }];
                var profile = JSON.parse(JSON.stringify(success.additionalUserInfo.profile));
                _this.registerRequest.email = profile.email;
                _this.dismissLoading();
                _this.translate.get('fb_success_auth2').subscribe(function (value) {
                    _this.presentLoading(value);
                    _this.checkUser();
                });
            }).catch(function (error) {
                console.log("Error in firebase auth after fb login", JSON.stringify(error));
                _this.showToast("Error in Facebook login");
                _this.dismissLoading();
            });
        }).catch(function (error) {
            console.log("Error in fb login", JSON.stringify(error));
            _this.showToast("Error in Facebook login");
            _this.dismissLoading();
        });
    };
    LoginPage.prototype.fbOnBrowser = function () {
        var _this = this;
        console.log("In not cordova");
        var provider = new __WEBPACK_IMPORTED_MODULE_15_firebase___default.a.auth.FacebookAuthProvider();
        provider.addScope('user_birthday');
        provider.addScope('user_friends');
        provider.addScope('email');
        provider.addScope('public_profile');
        __WEBPACK_IMPORTED_MODULE_15_firebase___default.a.auth().signInWithPopup(provider).then(function (result) {
            _this.registerRequest.email = result.user.email;
            _this.registerRequest.first_name = result.user.displayName;
            // this.registerRequest.first_name = this.getNames(result.user.displayName).first_name;
            // this.registerRequest.last_name = this.getNames(result.user.displayName).last_name;
            _this.registerRequest.meta_data = [{ key: "avatar_url", value: _this.socialDP ? _this.socialDP : result.user.photoURL }];
            _this.dismissLoading();
            _this.presentLoading('Firebase authenticated Facebook login, creating user..');
            _this.checkUser();
        }).catch(function (error) {
            console.log(error);
            _this.dismissLoading();
            _this.showToast("Facebook login unsuccessfull");
        });
    };
    LoginPage.prototype.checkUser = function () {
        this.dismissLoading();
        var component = this;
        component.translate.get('check_user').subscribe(function (value) {
            component.presentLoading(value);
        });
        __WEBPACK_IMPORTED_MODULE_15_firebase___default.a.auth().currentUser.getIdToken(false).then(function (idToken) {
            component.service.checkToken(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), idToken).subscribe(function (data) {
                var authResponse = data;
                window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].USER_API_KEY, authResponse.token);
                component.dismissLoading();
                component.getUser(component.getUserIdFromToken(authResponse.token));
            }, function (err) {
                // if error code is 404, user not exists
                console.log("User not exist", err);
                component.dismissLoading();
                component.verifyPhone();
            });
        }).catch(function (error) {
            component.dismissLoading();
            console.log("error");
        });
    };
    LoginPage.prototype.verifyPhone = function () {
        this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_0__phone_phone__["a" /* PhonePage */], { registerRequest: this.registerRequest });
    };
    LoginPage.prototype.getUser = function (userId) {
        var _this = this;
        if (this.socialDP && this.socialDP.length) {
            this.service.updateUser(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), String(userId), { meta_data: [{ key: "avatar_url", value: this.socialDP }] }).subscribe(function (data) {
                console.log("dpUpdated", data);
            }, function (err) {
                console.log(err);
            });
        }
        this.translate.get('fetch_user').subscribe(function (value) {
            _this.presentLoading(value);
            _this.subscriptions.push(_this.service.getUser(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), userId).subscribe(function (data) {
                _this.dismissLoading();
                var userResponse = data;
                if (_this.userOtpVerified(userResponse)) {
                    if (_this.socialDP && _this.socialDP.length) {
                        userResponse.avatar_url = _this.socialDP;
                    }
                    window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].USER_KEY, JSON.stringify(userResponse));
                    if (userResponse.billing && userResponse.billing.address_1 && userResponse.billing.address_1.length && userResponse.billing.address_2 && userResponse.billing.address_2.length) {
                        userResponse.billing.id = 1;
                        window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].SELECTED_ADDRESS, JSON.stringify(userResponse.billing));
                        var addressList = new Array();
                        addressList.push(userResponse.billing);
                        window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_8__models_constants_models__["a" /* Constants */].SELECTED_ADDRESS_LIST, JSON.stringify(addressList));
                    }
                    _this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_5__tabs_tabs__["a" /* TabsPage */]);
                    _this.events.publish('user:login', userResponse);
                }
                else {
                    _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_16__otp_otp__["a" /* OtpPage */], { username: userResponse.username, userid: String(userResponse.id) });
                }
            }, function (err) {
                console.log(err);
                _this.dismissLoading();
                _this.translate.get('login_error').subscribe(function (value) {
                    _this.presentLoading(value);
                });
            }));
        });
    };
    LoginPage.prototype.userOtpVerified = function (user) {
        var toReturn = false;
        if (user && user.meta_data) {
            for (var _i = 0, _a = user.meta_data; _i < _a.length; _i++) {
                var meta = _a[_i];
                if (meta.key == "otp_verified" && meta.value && meta.value == "verified") {
                    toReturn = true;
                    break;
                }
            }
        }
        return toReturn;
    };
    LoginPage.prototype.getUserIdFromToken = function (token) {
        var decodedString = window.atob(token.split(".")[1]);
        return JSON.parse(decodedString).data.user.id;
    };
    LoginPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    LoginPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    LoginPage.prototype.presentErrorAlert = function (msg) {
        var _this = this;
        this.translate.get(['error', 'dismiss']).subscribe(function (text) {
            var alert = _this.alertCtrl.create({
                title: text['error'],
                subTitle: msg,
                buttons: [text['dismiss']]
            });
            alert.present();
        });
    };
    LoginPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 2000,
            position: 'top'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    LoginPage.prototype.signupPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__createaccount_createaccount__["a" /* CreateaccountPage */]);
    };
    LoginPage.prototype.homePage = function () {
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_4__home_home__["a" /* HomePage */]);
    };
    LoginPage.prototype.passwordPage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_13__password_password__["a" /* PasswordPage */]);
    };
    LoginPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["m" /* Component */])({
            selector: 'page-login',template:/*ion-inline-start:"D:\PTH\Laundry Shop\Salavai-User\src\pages\login\login.html"*/'<ion-header>\n	<ion-navbar>\n		<ion-title>{{"signin_now" | translate}}</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content padding>\n	<!--    <img src="assets/imgs/logo.png" class="logo">-->\n	<ion-list no-lines class="form">\n\n		<ion-item class="animate__animated animate__fadeInUp">\n			<ion-icon name="md-globe" item-start></ion-icon>\n			<ion-label floating>{{"select_country" | translate}}</ion-label>\n			<ion-select [(ngModel)]="countryCode" multiple="false" class="text-thime"\n				cancelText="{{\'cancel\' | translate}}" okText="{{\'okay\' | translate}}" (ionChange)="changeHint()">\n				<ion-option [value]="country.callingCodes[0]" *ngFor="let country of countries">{{country.name}}\n				</ion-option>\n			</ion-select>\n		</ion-item>\n		<ion-item class="animate__animated animate__fadeInUp">\n			<ion-icon name="md-phone-portrait" item-start></ion-icon>\n			<ion-label floating>{{phone_hint}}</ion-label>\n			<ion-input type="tel" [(ngModel)]="credentials.username">\n			</ion-input>\n		</ion-item>\n		<ion-item class="animate__animated animate__fadeInUp">\n			<ion-icon name="md-lock" item-start></ion-icon>\n			<ion-label floating>{{"password" | translate}}</ion-label>\n			<ion-input type="password" [(ngModel)]="credentials.password"></ion-input>\n			<h5 item-end (click)="passwordPage()">{{"forgot" | translate}}</h5>\n		</ion-item>\n	</ion-list>\n	<button ion-button block class="animate__animated animate__fadeInUp"  style="--animate-duration: .3s !important;"  (click)="signIn()">{{"login" | translate}}</button>\n	<p text-center class="animate__animated animate__fadeInUp"  style="--animate-duration: .35s !important;">{{"or_continue_with" | translate}}</p>\n	<ion-grid class="animate__animated animate__fadeInUp"  style="--animate-duration: .4s !important;">\n		<ion-row style="margin: 0 -5px;">\n			<ion-col col-6>\n				<button ion-button icon-left full class="btn-social btn-facebook" (click)="loginFB()">\n					<ion-icon class="icon">\n						<img src="assets/imgs/fb.png">\n					</ion-icon>\n					<span>{{"Facebook" | translate}}</span>\n				</button>\n			</ion-col>\n			<ion-col col-6>\n				<button ion-button full icon-left class="btn-social btn-google" (click)="loginGoogle()">\n					<ion-icon class="icon">\n						<img src="assets/imgs/google.png">\n					</ion-icon> \n					<span>{{"Google" | translate}}</span>\n				</button>\n			</ion-col>\n		</ion-row>\n	</ion-grid>\n</ion-content>\n\n<ion-footer no-border padding-left padding-right>\n	<div class="not_registered">\n		<p text-center class="animate__animated animate__fadeInUp"  style="--animate-duration: .4s !important;">{{"not_registered" | translate}}</p>\n		<button class="animate__animated animate__fadeInUp" ion-button outline block (click)="signupPage()"  style="--animate-duration: .45s !important;">{{"register" | translate}}</button>\n	</div>\n</ion-footer>'/*ion-inline-end:"D:\PTH\Laundry Shop\Salavai-User\src\pages\login\login.html"*/
        }),
        __param(0, Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["z" /* Inject */])(__WEBPACK_IMPORTED_MODULE_10__app_app_config__["a" /* APP_CONFIG */])),
        __metadata("design:paramtypes", [Object, __WEBPACK_IMPORTED_MODULE_12__node_modules_ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_14__ionic_native_facebook__["a" /* Facebook */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* Events */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["i" /* ModalController */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["o" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* NavController */], __WEBPACK_IMPORTED_MODULE_3__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["g" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_11__ionic_native_google_plus__["a" /* GooglePlus */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["m" /* Platform */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* App */]])
    ], LoginPage);
    return LoginPage;
}());

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 66:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RegisterRequest; });
var RegisterRequest = /** @class */ (function () {
    function RegisterRequest(email, username, password, firstname, lastname) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.roles = 'customer';
        this.first_name = firstname;
        this.last_name = lastname;
    }
    return RegisterRequest;
}());

//# sourceMappingURL=register-request.models.js.map

/***/ }),

/***/ 69:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OrderconfirmedPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_global__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__code_code__ = __webpack_require__(380);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__login_login__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__myaddress_myaddress__ = __webpack_require__(135);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__models_helper_models__ = __webpack_require__(42);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var OrderconfirmedPage = /** @class */ (function () {
    function OrderconfirmedPage(navParam, navCtrl, global, modalCtrl, translate, toastCtrl) {
        this.navCtrl = navCtrl;
        this.global = global;
        this.modalCtrl = modalCtrl;
        this.translate = translate;
        this.toastCtrl = toastCtrl;
        this.servicefee = 0;
        this.cartTotal = 0;
        var currency = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].CURRENCY));
        if (currency) {
            this.currencyText = currency.value;
            var iconText = currency.options[currency.value];
            this.currencyIcon = iconText.substring(iconText.lastIndexOf('(') + 1, iconText.length - 1);
        }
        window.localStorage.removeItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].SELECTED_COUPON);
        var settings = __WEBPACK_IMPORTED_MODULE_8__models_helper_models__["a" /* Helper */].getSetting("laundry_appconfig_servicefee");
        if (settings && settings.length) {
            this.servicefee = Number(Number(settings).toFixed(2));
            if (this.currencyIcon) {
                this.serviceHtml = this.currencyIcon + " " + this.servicefee;
            }
            else if (this.currencyText) {
                this.serviceHtml = this.currencyText + " " + this.servicefee;
            }
        }
    }
    OrderconfirmedPage.prototype.ionViewDidEnter = function () {
        this.cartItems = this.global.getCartItems();
        this.calculateTotal();
    };
    OrderconfirmedPage.prototype.calculateTotal = function () {
        this.sum = 0;
        this.cartTotal = 0;
        for (var _i = 0, _a = this.cartItems; _i < _a.length; _i++) {
            var item = _a[_i];
            item.vari.total_price = Number(item.vari.sale_price) * item.quantity;
            if (this.currencyIcon) {
                item.vari.total_price_html = this.currencyIcon + " " + item.vari.total_price.toFixed(2);
            }
            else if (this.currencyText) {
                item.vari.total_price_html = this.currencyText + " " + item.vari.total_price.toFixed(2);
            }
            this.sum = this.sum + item.vari.total_price;
        }
        this.cartTotal = this.cartTotal + this.sum;
        this.sum = this.sum - (this.coupon ? this.coupon.discount_type == 'percent' ? (this.sum * Number(this.coupon.amount) / 100) : Number(this.coupon.amount) : 0);
        this.sum = Number(Number(this.sum + this.servicefee).toFixed(2));
        if (this.currencyIcon) {
            this.total_html = this.currencyIcon + " " + this.sum.toFixed(2);
        }
        else if (this.currencyText) {
            this.total_html = this.currencyText + " " + this.sum.toFixed(2);
        }
    };
    OrderconfirmedPage.prototype.decrementProduct = function (ci) {
        this.global.decrementCartItem(ci);
        this.cartItems = this.global.getCartItems();
        this.calculateTotal();
    };
    OrderconfirmedPage.prototype.incrementProduct = function (ci) {
        this.global.incrementCartItem(ci);
        this.cartItems = this.global.getCartItems();
        this.calculateTotal();
    };
    OrderconfirmedPage.prototype.setCartItem = function (ci) {
        if (!ci.quantity || String(ci.quantity) == "")
            return;
        this.global.setCartItem(ci);
        this.cartItems = this.global.getCartItems();
        this.calculateTotal();
    };
    OrderconfirmedPage.prototype.codePage = function () {
        var _this = this;
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_4__code_code__["a" /* CodePage */]);
        modal.onDidDismiss(function () {
            var coupon = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].SELECTED_COUPON));
            if (coupon) {
                var allowed = true;
                if (coupon.discount_type == 'fixed_product') {
                    allowed = false;
                    for (var _i = 0, _a = coupon.product_ids; _i < _a.length; _i++) {
                        var itemCA = _a[_i];
                        for (var _b = 0, _c = _this.cartItems; _b < _c.length; _b++) {
                            var item = _c[_b];
                            if (itemCA == item.pro.id) {
                                allowed = true;
                                break;
                            }
                        }
                        if (allowed) {
                            break;
                        }
                    }
                }
                if (!allowed) {
                    _this.translate.get('field_error_invalid_couponcodecart').subscribe(function (value) { return _this.showToast(value); });
                }
                else {
                    if (_this.cartTotal < Number(coupon.minimum_amount)) {
                        _this.translate.get('field_error_minimum_amount_coupon').subscribe(function (value) { return _this.showToast(value + " " + coupon.minimum_amount); });
                        return;
                    }
                    if (Number(coupon.maximum_amount) > Number(coupon.minimum_amount) && _this.cartTotal > Number(coupon.maximum_amount)) {
                        _this.translate.get('field_error_maximum_amount_coupon').subscribe(function (value) { return _this.showToast(value + " " + coupon.maximum_amount); });
                        return;
                    }
                    _this.coupon = coupon;
                    _this.coupon_amount_html = _this.coupon.amount;
                    if (_this.coupon.discount_type == 'percent') {
                        _this.coupon_amount_html = _this.coupon_amount_html + "%";
                    }
                    else {
                        _this.coupon_amount_html = _this.currencyIcon + " " + _this.coupon_amount_html;
                    }
                    _this.calculateTotal();
                }
            }
        });
        modal.present();
    };
    OrderconfirmedPage.prototype.removeCoupon = function () {
        this.coupon = null;
        this.calculateTotal();
        window.localStorage.removeItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].SELECTED_COUPON);
    };
    OrderconfirmedPage.prototype.selectaddress = function () {
        var _this = this;
        var settings = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].SETTINGS));
        if (settings && settings.laundry_appconfig_minimumorder) {
            var minOrder_1 = Number(settings.laundry_appconfig_minimumorder);
            if (this.sum < minOrder_1) {
                this.translate.get("min_order_value").subscribe(function (value) { return _this.showToast(value + " " + minOrder_1); });
                return;
            }
        }
        var user = JSON.parse(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].USER_KEY));
        if (user != null) {
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__myaddress_myaddress__["a" /* MyaddressPage */], { action: 'select' });
        }
        else {
            window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].TEMP_OPEN, __WEBPACK_IMPORTED_MODULE_2__models_constants_models__["a" /* Constants */].TEMP_OPEN_CART);
            this.translate.get('auth_required').subscribe(function (value) { return _this.showToast(value); });
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__login_login__["a" /* LoginPage */]);
        }
    };
    OrderconfirmedPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 2000,
            position: 'top'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    OrderconfirmedPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-orderconfirmed',template:/*ion-inline-start:"D:\PTH\Laundry Shop\Salavai-User\src\pages\orderconfirmed\orderconfirmed.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title>{{"cart_page" | translate}}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content class="bg-light">\n    <div *ngIf="cartItems && cartItems.length" class="all-orders">\n        <p class="order-header animate__animated animate__fadeInUp">{{"ur_cloth" | translate}}</p>\n        <ion-label class="animate__animated animate__fadeInUp" *ngFor="let cartItem of cartItems">\n            <div class="item_details">\n                <ion-row>\n                    <ion-col col-5>\n                        <h2>{{cartItem.pro.name}}</h2>\n                        <h5 class="service">{{cartItem.vari.name}}</h5>\n                    </ion-col>\n                    <ion-col col-4>\n                        <h3>\n                            <ion-icon name="md-remove-circle" (click)="decrementProduct(cartItem)"></ion-icon>\n                            <!--							 <span class="quantity"> {{cartItem.quantity}}</span> -->\n                            <ion-input type="number" [(ngModel)]="cartItem.quantity" (ngModelChange)="setCartItem(cartItem)"></ion-input>\n                            <ion-icon name="md-add-circle" (click)="incrementProduct(cartItem)"></ion-icon>\n                        </h3>\n                    </ion-col>\n\n                    <ion-col col-3>\n                        <h2 style="text-align:right" [innerHTML]="cartItem.vari.sale_price_html"></h2>\n                        <h5 style="text-align:right" class="service" [innerHTML]="cartItem.vari.total_price_html"></h5>\n                    </ion-col>\n                </ion-row>\n            </div>\n\n        </ion-label>\n    </div>\n\n    <div class="empty-view animate__animated animate__zoomIn" style="--animate-duration: .2s;" *ngIf="!cartItems || !cartItems.length">\n        <ion-icon class="material-icons">shopping_cart</ion-icon>\n        <p [innerHTML]="\'cart_empty\' | translate"></p>\n    </div>\n</ion-content>\n\n<ion-footer no-border>\n    <div class="fixed-bottom">\n        <p *ngIf="!coupon && (cartItems && cartItems.length)" class="promo-code animate__animated animate__fadeInUp" (click)="codePage()">\n            <ion-icon name="md-pricetag"></ion-icon>{{"have_promo" | translate}}\n        </p>\n        <p *ngIf="coupon && (cartItems && cartItems.length)" class="promo-code animate__animated animate__fadeInUp">\n            {{coupon.code}} {{\'applied\' | translate}}\n            <span text-right [innerHTML]="coupon_amount_html"></span>\n            <ion-icon name="md-close" class="cross-coupon" (click)="removeCoupon()"></ion-icon>\n        </p>\n        <div *ngIf="cartItems && cartItems.length" class="price-section animate__animated animate__fadeInUp">\n            <h3 class="d-flex" *ngIf="serviceHtml">{{"service_fee" | translate}} <span [innerHTML]="serviceHtml" class="end"></span></h3>\n            <ion-label class="total-amount">{{"amt_pybl" | translate}}<span [innerHTML]="total_html"></span></ion-label>\n        </div>\n        <p *ngIf="cartItems && cartItems.length" (click)="selectaddress()" text-center class="btn animate__animated animate__fadeInUp">\n            {{"confirm_order" | translate}}\n            <ion-icon name="ios-arrow-forward-outline"></ion-icon>\n        </p>\n    </div>\n</ion-footer>'/*ion-inline-end:"D:\PTH\Laundry Shop\Salavai-User\src\pages\orderconfirmed\orderconfirmed.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavController */], __WEBPACK_IMPORTED_MODULE_3__providers_global__["a" /* Global */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* ModalController */], __WEBPACK_IMPORTED_MODULE_5__ngx_translate_core__["c" /* TranslateService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["o" /* ToastController */]])
    ], OrderconfirmedPage);
    return OrderconfirmedPage;
}());

//# sourceMappingURL=orderconfirmed.js.map

/***/ }),

/***/ 70:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return OtpPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__providers_wordpress_client_service__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__tabs_tabs__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_constants_models__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_auth_credential_models__ = __webpack_require__(125);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ngx_translate_core__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_firebase_app__ = __webpack_require__(382);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_firebase_app___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_firebase_app__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var OtpPage = /** @class */ (function () {
    function OtpPage(params, alertCtrl, loadingCtrl, toastCtrl, navCtrl, platform, translate, service, events, app) {
        this.params = params;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.navCtrl = navCtrl;
        this.platform = platform;
        this.translate = translate;
        this.service = service;
        this.events = events;
        this.app = app;
        this.loadingShown = false;
        this.captchanotvarified = true;
        this.buttonDisabled = true;
        this.otp = '';
        this.captchaVerified = false;
        this.minutes = 0;
        this.seconds = 0;
        this.totalSeconds = 0;
        this.intervalCalled = false;
        this.subscriptions = [];
        this.resendCode = false;
        this.otpNotSent = true;
        this.username = this.params.get('username');
        this.password = this.params.get('password');
        this.userid = this.params.get('userid');
    }
    OtpPage.prototype.ionViewDidLoad = function () {
        if (!(this.platform.is('cordova'))) {
            this.makeCaptcha();
        }
        this.sendOTP();
    };
    OtpPage.prototype.sendOTP = function () {
        this.resendCode = false;
        this.otpNotSent = true;
        var phone = "+" + this.username;
        if (this.platform.is('cordova')) {
            this.sendOtpPhone(phone);
        }
        else {
            this.sendOtpBrowser(phone);
        }
        if (this.intervalCalled) {
            clearInterval(this.timer);
        }
    };
    OtpPage.prototype.createTimer = function () {
        this.intervalCalled = true;
        this.totalSeconds--;
        if (this.totalSeconds == 0) {
            this.otpNotSent = true;
            this.resendCode = true;
            clearInterval(this.timer);
        }
        else {
            this.seconds = (this.totalSeconds % 60);
            if (this.totalSeconds >= this.seconds) {
                this.minutes = (this.totalSeconds - this.seconds) / 60;
            }
            else {
                this.minutes = 0;
            }
        }
    };
    OtpPage.prototype.createInterval = function () {
        var _this = this;
        this.totalSeconds = 120;
        this.createTimer();
        this.timer = setInterval(function () {
            _this.createTimer();
        }, 1000);
    };
    OtpPage.prototype.sendOtpPhone = function (phone) {
        var _this = this;
        this.translate.get(["sending_otp", "otp_verified_auto", "otp_sent", "otp_fail"]).subscribe(function (values) {
            _this.presentLoading(values["sending_otp"]);
            var component = _this;
            window.FirebasePlugin.verifyPhoneNumber(phone, 60, function (credential) {
                console.log("verifyPhoneNumber", JSON.stringify(credential));
                component.verfificationId = credential.verificationId ? credential.verificationId : credential;
                // if instant verification is true use the code that we received from the firebase endpoint, otherwise ask user to input verificationCode:
                //var code = credential.instantVerification ? credential.code : inputField.value.toString();
                if (component.verfificationId) {
                    if (credential.instantVerification && credential.code) {
                        component.otp = credential.code;
                        component.showToast(values["otp_verified_auto"]);
                        component.verifyOtpPhone();
                    }
                    else {
                        component.showToast(values["otp_sent"]);
                        component.otpNotSent = false;
                        component.createInterval();
                    }
                }
                component.dismissLoading();
            }, function (error) {
                console.log("otp_send_fail", error);
                component.otpNotSent = true;
                component.resendCode = true;
                component.dismissLoading();
                component.showToast(values["otp_fail"]);
            });
        });
    };
    OtpPage.prototype.sendOtpBrowser = function (phone) {
        this.dismissLoading();
        var component = this;
        component.presentLoading("Sending OTP by SMS");
        console.log("In not cordova");
        __WEBPACK_IMPORTED_MODULE_7_firebase_app__["auth"]().signInWithPhoneNumber(phone, this.recaptchaVerifier).then(function (confirmationResult) {
            component.otpNotSent = false;
            component.result = confirmationResult;
            component.dismissLoading();
            component.showToast("OTP sent on your mobile");
            if (component.intervalCalled) {
                clearInterval(component.timer);
            }
            component.createInterval();
        }).catch(function (error) {
            component.resendCode = true;
            component.dismissLoading();
            if (error.message) {
                component.showToast(error.message);
            }
            else {
                component.showToast("SMS not sent");
            }
            console.log("SMS not sent " + JSON.stringify(error));
        });
    };
    OtpPage.prototype.verify = function () {
        if (this.otp && this.otp.length) {
            if (this.platform.is('cordova')) {
                this.verifyOtpPhone();
            }
            else {
                this.verifyOtpBrowser();
            }
        }
    };
    OtpPage.prototype.verifyOtpPhone = function () {
        var _this = this;
        this.translate.get(["verifying_otp", "otp_success", "otp_err1"]).subscribe(function (values) {
            var credential = __WEBPACK_IMPORTED_MODULE_7_firebase_app__["auth"].PhoneAuthProvider.credential(_this.verfificationId, _this.otp);
            _this.presentLoading(values["verifying_otp"]);
            __WEBPACK_IMPORTED_MODULE_7_firebase_app__["auth"]().signInAndRetrieveDataWithCredential(credential).then(function (info) {
                console.log(JSON.stringify(info));
                _this.dismissLoading();
                _this.showToast(values["otp_success"]);
                _this.signIn();
            }, function (error) {
                _this.showToast(values["otp_err1"]);
                // if (error.message) {
                //   this.showToast(error.message);
                // } else {
                //   this.showToast(values["otp_err1"]);
                // }
                _this.dismissLoading();
                console.log(JSON.stringify(error));
            });
        });
    };
    OtpPage.prototype.verifyOtpBrowser = function () {
        var component = this;
        component.presentLoading("Verifying OTP by SMS");
        component.result.confirm(this.otp).then(function (response) {
            component.dismissLoading();
            component.showToast("OTP verified");
            component.signIn();
        }).catch(function (error) {
            if (error.message) {
                component.showToast(error.message);
            }
            else {
                component.showToast("Unable to verify given otp");
            }
            component.dismissLoading();
        });
    };
    OtpPage.prototype.makeCaptcha = function () {
        var component = this;
        this.recaptchaVerifier = new __WEBPACK_IMPORTED_MODULE_7_firebase_app__["auth"].RecaptchaVerifier('recaptcha-container', {
            // 'size': 'normal',
            'size': 'invisible',
            'callback': function (response) {
                component.captchanotvarified = true;
                console.log("captchanotvarified:--" + component.captchanotvarified);
                // reCAPTCHA solved, allow signInWithPhoneNumber.
            }
        });
        this.recaptchaVerifier.render();
    };
    OtpPage.prototype.getUserIdFromToken = function (token) {
        var decodedString = window.atob(token.split(".")[1]);
        return JSON.parse(decodedString).data.user.id;
    };
    OtpPage.prototype.signIn = function () {
        var _this = this;
        this.translate.get(["just_a_moment", "something_wrong"]).subscribe(function (values) {
            _this.presentLoading(values["just_a_moment"]);
            if (_this.userid && _this.userid.length) {
                _this.getUser(_this.userid);
            }
            else {
                _this.subscriptions.push(_this.service.getAuthToken(new __WEBPACK_IMPORTED_MODULE_5__models_auth_credential_models__["a" /* AuthCredential */](_this.username, _this.password)).subscribe(function (data) {
                    var authResponse = data;
                    window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].USER_API_KEY, authResponse.token);
                    _this.getUser(_this.getUserIdFromToken(authResponse.token));
                }, function (err) {
                    console.log(err);
                    _this.dismissLoading();
                    _this.presentErrorAlert(values["something_wrong"]);
                }));
            }
        });
    };
    OtpPage.prototype.getUser = function (userId) {
        var _this = this;
        this.translate.get("something_wrong").subscribe(function (value) {
            _this.service.updateUser(window.localStorage.getItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].ADMIN_API_KEY), userId, { meta_data: [{ key: "otp_verified", value: "verified" }] }).subscribe(function (data) {
                console.log("updateUser", data);
                _this.dismissLoading();
                var userResponse = data;
                window.localStorage.setItem(__WEBPACK_IMPORTED_MODULE_4__models_constants_models__["a" /* Constants */].USER_KEY, JSON.stringify(userResponse));
                _this.app.getRootNav().setRoot(__WEBPACK_IMPORTED_MODULE_3__tabs_tabs__["a" /* TabsPage */]);
                _this.events.publish('user:login', userResponse);
            }, function (err) {
                console.log("updateUser", err);
                _this.dismissLoading();
                _this.presentErrorAlert(value);
            });
        });
    };
    OtpPage.prototype.presentLoading = function (message) {
        this.loading = this.loadingCtrl.create({
            content: message
        });
        this.loading.onDidDismiss(function () { });
        this.loading.present();
        this.loadingShown = true;
    };
    OtpPage.prototype.dismissLoading = function () {
        if (this.loadingShown) {
            this.loadingShown = false;
            this.loading.dismiss();
        }
    };
    OtpPage.prototype.showToast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom'
        });
        toast.onDidDismiss(function () {
            console.log('Dismissed toast');
        });
        toast.present();
    };
    OtpPage.prototype.presentErrorAlert = function (msg) {
        var alert = this.alertCtrl.create({
            title: "Error",
            subTitle: msg,
            buttons: ["Dismiss"]
        });
        alert.present();
    };
    OtpPage.prototype.makeExitAlert = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'App termination',
            message: 'Do you want to close the app?',
            buttons: [{
                    text: 'Cancel',
                    role: 'cancel',
                    handler: function () {
                        console.log('Application exit prevented!');
                    }
                }, {
                    text: 'Close App',
                    handler: function () {
                        _this.platform.exitApp(); // Close this application
                    }
                }]
        });
        alert.present();
    };
    OtpPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["m" /* Component */])({
            selector: 'page-otp ',template:/*ion-inline-start:"D:\PTH\Laundry Shop\Salavai-User\src\pages\otp\otp.html"*/'<ion-header>\n    <ion-navbar>\n        <ion-title text-center>{{\'verification\' | translate}}</ion-title>\n    </ion-navbar>\n</ion-header>\n\n<ion-content padding-top padding-left padding-right>\n\n    <div class="logo_box animate__animated animate__zoomIn" style="--animate-duration: .3s;">\n        <img src="assets/imgs/logo.png">\n    </div>\n\n    <div class="form">\n        <div id="recaptcha-container"></div>\n        <p *ngIf="username" text-center class="animate__animated animate__fadeInUp" style="--animate-duration: .35s;">\n            {{\'otp_text\' | translate}} <br>{{\'sent\' | translate }}\n            <br>+{{username}}\n        </p>\n        <ion-list no-lines class="animate__animated animate__fadeInUp" style="--animate-duration: .4s;">\n            <ion-item>\n                <!--				<ion-label>{{\'otp\' | translate}}</ion-label>-->\n                <ion-input type="number" text-center placeholder="{{\'enter_otp\' | translate}}" [(ngModel)]="otp"></ion-input>\n            </ion-item>\n\n            <button ion-button block class="bg-thime btn-round btn-text" (click)="verify()">\n                {{\'verify\' | translate}}\n            </button>\n        </ion-list>\n        <div class="redend_box d-flex animate__animated animate__fadeInUp" style="--animate-duration: .45s;">\n            <button ion-button clear item-start [disabled]="!resendCode" (click)="sendOTP()"> {{\'resend\' | translate}}</button>\n            <h2 class="end">\n                <ng-container *ngIf="minutes==0; else minuteTemplate">\n                    00\n                </ng-container>\n                <ng-template #minuteTemplate>\n                    {{minutes}}\n                </ng-template>:\n                <ng-container *ngIf="seconds==0; else secondTemplate">\n                    00\n                </ng-container>\n                <ng-template #secondTemplate>\n                    {{seconds}}\n                </ng-template> {{\'min_left\' | translate}}\n            </h2>\n        </div>\n    </div>\n</ion-content>'/*ion-inline-end:"D:\PTH\Laundry Shop\Salavai-User\src\pages\otp\otp.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["l" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["o" /* ToastController */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* NavController */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["m" /* Platform */], __WEBPACK_IMPORTED_MODULE_6__ngx_translate_core__["c" /* TranslateService */],
            __WEBPACK_IMPORTED_MODULE_0__providers_wordpress_client_service__["a" /* WordpressClient */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* Events */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* App */]])
    ], OtpPage);
    return OtpPage;
}());

//# sourceMappingURL=otp.js.map

/***/ }),

/***/ 9:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Constants; });
var Constants = /** @class */ (function () {
    function Constants() {
    }
    Constants.ADMIN_API_KEY = 'laund_c_admin_api';
    Constants.USER_ADMIN_KEY = 'laund_c_admin_user_api';
    Constants.USER_API_KEY = 'laund_c_user_api';
    Constants.USER_KEY = 'laund_c_user';
    Constants.PRODUCT_CATEGORIES = 'laund_c_categories_sub';
    Constants.PRODUCT_CATEGORIES_PARENT = 'laund_c_categories_parent';
    Constants.PAYMENT_GATEWAYS = 'laund_c_payment_gateways';
    Constants.SHIPPING_LINES = 'laund_c_shipping_lines';
    Constants.SELECTED_ADDRESS = 'laund_c_address_selected';
    Constants.SELECTED_ADDRESS_LIST = 'laund_c_address_selected_list';
    Constants.SELECTED_ADDRESS_SHIPPING = 'laund_c_address_selected_shipping';
    Constants.SHIPPING_ZONE_LOCATIONS = 'laund_c_shipping_zone_locations';
    Constants.SELECTED_SHIPPING_METHOD = 'laund_c_selected_shipping';
    Constants.SELECTED_COUPON = 'laund_c_coupon_selected';
    Constants.TEMP_OPEN = 'laund_c_temp_open';
    Constants.TEMP_OPEN_CART = 'laund_c_temp_open_cart';
    Constants.CURRENCY = 'laund_c_currency';
    Constants.TIME_SLOTS = 'laund_c_time_slots';
    Constants.CARD_INFO = 'laund_c_card_info';
    Constants.SETTINGS = 'laund_c_settings';
    Constants.CART_ITEMS = 'laund_c_cart_items';
    Constants.SEARCH_HISTORY = 'laund_c_search_history';
    Constants.FAVORITE_PRODUCTS = 'laund_c_favorite_products';
    Constants.KEY_LOCATION = 'laund_c_s_location';
    Constants.KEY_DEFAULT_LANGUAGE = 'laund_c_d_lng';
    Constants.KEY_LOCALE = 'laund_c_locale';
    Constants.REF_USERS = "wamw/users";
    Constants.REF_CHAT = "wamw/chats";
    Constants.REF_INBOX = "wamw/inbox";
    Constants.REF_USERS_FCM_IDS = "wamw/user_fcm_ids";
    Constants.REF_ADMIN_USER = "wamw/adminuser";
    return Constants;
}());

//# sourceMappingURL=constants.models.js.map

/***/ })

},[404]);
//# sourceMappingURL=main.js.map