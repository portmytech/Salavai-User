import { Component } from '@angular/core';
import { ViewController, Loading, LoadingController, ToastController } from 'ionic-angular';
import { Subscription } from '../../../node_modules/rxjs/Subscription';
import { WordpressClient } from '../../providers/wordpress-client.service';
import { Constants } from '../../models/constants.models';
import { Coupon } from '../../models/coupon.models';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';

@Component({
	selector: 'page-code ',
	templateUrl: 'code.html'
})
export class CodePage {
	private cCode = "";
	private loading: Loading;
	private loadingShown: Boolean = false;
	private subscriptions: Array<Subscription> = [];

	constructor(private translate: TranslateService, private service: WordpressClient, private loadingCtrl: LoadingController,
		private toastCtrl: ToastController, private viewCtrl: ViewController) {
	}

	ionViewWillLeave() {
		this.subscriptions.forEach((subscription: Subscription) => {
			subscription.unsubscribe();
		});
		this.dismissLoading();
	}

	checkCode() {
		if (!this.cCode.length) {
			this.translate.get('field_error_couponcode').subscribe(value => {
				this.showToast(value);
			});
		} else {
			this.translate.get('just_a_moment').subscribe(value => {
				this.presentLoading(value);
				this.subscriptions.push(this.service.getCouponByCode(window.localStorage.getItem(Constants.ADMIN_API_KEY), this.cCode).subscribe(data => {
					this.dismissLoading();
					let coupons: Array<Coupon> = data;
					if (!coupons.length) {
						this.translate.get('field_error_invalid_couponcode').subscribe(value => {
							this.showToast(value);
						});
					} else if (moment().valueOf() > moment(coupons[0].date_expires).valueOf()) {
						this.translate.get('cpn_expire').subscribe(value => {
							this.showToast(value);
						});
					} else {
						window.localStorage.setItem(Constants.SELECTED_COUPON, JSON.stringify(coupons[0]));
						this.dismiss();
					}
				}, err => {
					console.log("getCouponByCode", err);
					this.dismissLoading();
					this.translate.get('field_error_invalid_couponcode').subscribe(value => {
						this.showToast(value);
					});
				}));
			});
		}
	}

	dismiss() {
		this.viewCtrl.dismiss();
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
			duration: 2000,
			position: 'top'
		});
		toast.onDidDismiss(() => {
			console.log('Dismissed toast');
		});
		toast.present();
	}
}
