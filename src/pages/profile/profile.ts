import { Component } from '@angular/core';
import { NavController, Platform, Loading, LoadingController, ToastController, AlertController, Events } from 'ionic-angular';
import { Constants } from "../../models/constants.models";
import { UserResponse } from "../../models/user-response.models";
import { File, FileEntry, Entry } from '@ionic-native/file';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';
import { FirebaseClient } from '../../providers/firebase';
import { WordpressClient } from '../../providers/wordpress-client.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  providers: [FirebaseClient]
})
export class ProfilePage {
  account: string = "profile";
  private user: UserResponse;
  private progress = false;
  private loading: Loading;
  private loadingShown: Boolean = false;
  usernameToShow: string;

  constructor(private navCtrl: NavController, private events: Events, private imagePicker: ImagePicker, private toastCtrl: ToastController,
    private file: File, private _firebase: FirebaseClient, private cropService: Crop, private platform: Platform, private loadingCtrl: LoadingController,
    private translate: TranslateService, private alertCtrl: AlertController, private service: WordpressClient) {
    this.user = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
    this.usernameToShow = "+" + this.user.username;
    this.setupAvtar();
  }

  setupAvtar() {
    if (this.user && this.user.avatar_url && (this.user.avatar_url.includes("gravatar.com") || this.user.avatar_url.includes("avatar"))) this.user.avatar_url = null;
    if (this.user && this.user.meta_data) {
      for (let meta of this.user.meta_data) {
        if (meta.key == "avatar_url" && meta.value && meta.value.length) {
          this.user.avatar_url = meta.value;
          break;
        }
      }
    }
  }

  openAction() {
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
      this.translate.get(["uploading_image", "image_uploaded"]).subscribe(value => {
        this.presentLoading(value["uploading_image"]);
        this.progress = true;
        this._firebase.uploadBlob(new Blob([buffer], { type: mime })).then(url => {
          this.progress = false;
          this.user.avatar_url = String(url);
          window.localStorage.setItem(Constants.USER_KEY, JSON.stringify(this.user));
          this.service.updateUser(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(this.user.id), { meta_data: [{ key: "avatar_url", value: String(url) }] }).subscribe(data => {
            console.log("dpUpdated", data);
            this.dismissLoading();
            this.showToast(value["image_uploaded"]);
            this.events.publish("user:login", data);
            this.navCtrl.pop();
          }, err => {
            console.log(err);
            this.dismissLoading();
            this.navCtrl.pop();
          });
          console.log("Url is", url);
        }).catch(err => {
          this.progress = false;
          this.dismissLoading();
          this.showToast(JSON.stringify(err));
          console.log(err);
        })
      });
    }).catch(err => {
      this.dismissLoading();
      this.showToast(JSON.stringify(err));
      console.log(err);
    })
  }

  updateInfo() {
    if (!this.user.first_name || this.user.first_name.length < 3) {
      this.translate.get('field_error_name_full').subscribe(value => this.showToast(value));
    } else {
      this.translate.get(["just_a_moment", "updated"]).subscribe(values => {
        this.presentLoading(values["just_a_moment"]);

        this.service.updateUser(window.localStorage.getItem(Constants.ADMIN_API_KEY), String(this.user.id), { first_name: this.user.first_name, email: this.user.email }).subscribe(data => {
          console.log("updateUser", data);
          this.dismissLoading();
          this.showToast(values["updated"]);
          window.localStorage.setItem(Constants.USER_KEY, JSON.stringify(data));
          this.events.publish("user:login", data);
          this.navCtrl.pop();
        }, err => {
          console.log(err);
          this.dismissLoading();
          this.navCtrl.pop();
        });

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

  isReadonly() {
    return true;
  }

}
