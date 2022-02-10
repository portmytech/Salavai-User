import { Component, Inject } from '@angular/core';
import { NavController, ModalController, AlertController, Loading, LoadingController, ToastController, Events, App, Platform } from 'ionic-angular';
import { WordpressClient } from '../../providers/wordpress-client.service';
import { Subscription } from "rxjs/Subscription";
import { RegisterRequest } from "../../models/register-request.models";
import { RegisterResponse } from "../../models/register-response.models";
import { Constants } from "../../models/constants.models";
import { OtpPage } from "../../pages/otp/otp";
import { AppConfig, APP_CONFIG } from '../../app/app.config';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';
import { File, FileEntry, Entry } from '@ionic-native/file';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';
import { FirebaseClient } from '../../providers/firebase';

@Component({
	selector: 'page-createaccount',
	templateUrl: 'createaccount.html',
	providers: [FirebaseClient]
})
export class CreateaccountPage {
	private loading: Loading;
	private loadingShown: Boolean = false;
	private subscriptions: Array<Subscription> = [];
	private registerRequest: RegisterRequest = new RegisterRequest('', '', '', '', '');
	private registerRequestPasswordConfirm: string = '';
	private registerResponse: RegisterResponse;
	private countries: any;
	private countryCode: string;
	private progress = false;
	private imageUrl: string;
	phone_hint: string;

	constructor(@Inject(APP_CONFIG) private config: AppConfig, private events: Events, private toastCtrl: ToastController,
		private navCtrl: NavController, private service: WordpressClient, private app: App, private imagePicker: ImagePicker,
		private loadingCtrl: LoadingController, private alertCtrl: AlertController, private cropService: Crop, private platform: Platform,
		private modalCtrl: ModalController, private translate: TranslateService, private file: File, private _firebase: FirebaseClient) {
		this.getCountries();
		this.changeHint();
	}

	getCountries() {
		this.service.getCountries().subscribe(data => this.countries = data, err => console.log(err))
	}

	changeHint() {
		this.registerRequest.username = "";
		if (this.countryCode && this.countryCode.length) {
			this.translate.get('phone_excluding').subscribe(value => this.phone_hint = (value + " (+" + this.countryCode + ")"));
		} else {
			this.translate.get('phone').subscribe(value => this.phone_hint = value);
		}
	}

	openAction1() {
		this.platform.ready().then(() => {
			if (this.platform.is("cordova")) {
				this.imagePicker.getPictures({
					maximumImagesCount: 1,
				}).then((results) => {
					if (results && results[0]) {
						this.reduceImages(results).then(() => {
							console.log('cropped_images');
						});
					}
				}, (err) => {
					console.log("getPictures", JSON.stringify(err));
				});
			}
		});
	}

	reduceImages(selected_pictures: any): any {
		return selected_pictures.reduce((promise: any, item: any) => {
			return promise.then((result) => {
				return this.cropService.crop(item, { quality: 100 }).then(cropped_image => {
					this.resolveUri(cropped_image);
				});
			});
		}, Promise.resolve());
	}

	resolveUri(uri: string) {
		console.log('uri: ' + uri);
		if (this.platform.is("android") && uri.startsWith('content://') && uri.indexOf('/storage/') != -1) {
			uri = "file://" + uri.substring(uri.indexOf("/storage/"), uri.length);
			console.log('file: ' + uri);
		}
		this.file.resolveLocalFilesystemUrl(uri).then((entry: Entry) => {
			console.log(entry);
			var fileEntry = entry as FileEntry;
			fileEntry.file(success => {
				var mimeType = success.type;
				console.log(mimeType);
				let dirPath = entry.nativeURL;
				this.upload(dirPath, entry.name, mimeType);
			}, error => {
				console.log(error);
			});
		})
	}

	upload(path, name, mime) {
		console.log('original: ' + path);
		let dirPathSegments = path.split('/');
		dirPathSegments.pop();
		path = dirPathSegments.join('/');
		console.log('dir: ' + path);
		this.file.readAsArrayBuffer(path, name).then(buffer => {
			this.presentLoading("Uploading image");
			this.progress = true;
			this._firebase.uploadBlob(new Blob([buffer], { type: mime })).then(url => {
				this.progress = false;
				this.dismissLoading();
				this.showToast("Image uploaded");
				console.log("Url is", url);
				this.imageUrl = String(url);
			}).catch(err => {
				this.progress = false;
				this.dismissLoading();
				this.showToast(JSON.stringify(err));
				console.log(err);
			})
		}).catch(err => {
			this.dismissLoading();
			this.showToast(JSON.stringify(err));
			console.log(err);
		})
	}

	register() {
		var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		// if (!this.imageUrl || !this.imageUrl.length) {
		// 	this.translate.get('field_error_image').subscribe(value => this.showToast(value));
		// } else
		if (this.registerRequest.first_name == "" || !this.registerRequest.first_name.length) {
			this.translate.get('field_error_name_full').subscribe(value => this.showToast(value));
		}
		// else if (this.registerRequest.last_name == "" || !this.registerRequest.last_name.length) {
		// 	this.translate.get('field_error_name_last').subscribe(value => {
		// 		this.showToast(value);
		// 	});
		// }
		else if (!this.countryCode || !this.countryCode.length) {
			this.translate.get('field_error_country').subscribe(value => this.showToast(value));
		} else if (!this.registerRequest.username.length) {
			this.translate.get('field_error_phone_valid').subscribe(value => this.showToast(value));
		} else if (this.registerRequest.email.length <= 5 || !reg.test(this.registerRequest.email)) {
			this.translate.get('field_error_email').subscribe(value => this.showToast(value));
		} else if (this.registerRequest.password.length < 6) {
			this.translate.get('field_error_password').subscribe(value => this.showToast(value));
		} else {
			this.translate.get(["loading_sign_up", "invalid_credentials_register", "signup_success"]).subscribe(values => {
				this.presentLoading(values["loading_sign_up"]);
				this.subscriptions.push(this.service.createUser(window.localStorage.getItem(Constants.ADMIN_API_KEY), this.countryCode, this.registerRequest).subscribe(data => {
					this.dismissLoading();
					this.registerResponse = data;
					this.showToast(values["signup_success"]);
					if (this.imageUrl && this.imageUrl.length) {
						this.service.updateUser(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(this.registerResponse.id), { meta_data: [{ key: "avatar_url", value: this.imageUrl }] }).subscribe(data => console.log("dpUpdated", data), err => console.log(err));
					}
					this.app.getRootNav().push(OtpPage, { username: this.countryCode + this.registerRequest.username, password: this.registerRequest.password });
					// Now we are veryfying the mobile no. first.
					// let registerResponse: RegisterResponse = data;
					// this.signIn(String(registerResponse.id), this.registerRequest.username, this.registerRequest.password);
				}, err => {
					console.log("createUser", err);
					this.dismissLoading();
					this.presentErrorAlert(values["invalid_credentials_register"]);
				}));
			});
		}
	}

	signinPage() {
		this.navCtrl.pop();
	}

	private presentLoading(message: string) {
		this.loading = this.loadingCtrl.create({ content: message });
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
