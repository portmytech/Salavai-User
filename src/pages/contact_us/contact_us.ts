import { Component, Inject } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { ConversationPage } from '../conversation/conversation';
import { Constants } from '../../models/constants.models';
import { UserResponse } from '../../models/user-response.models';
import { Chat } from '../../models/chat.models';
import { APP_CONFIG, AppConfig } from '../../app/app.config';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-contact_us',
  templateUrl: 'contact_us.html'
})
export class Contact_usPage {
  private user: UserResponse;
  private userAdmin: UserResponse;

  constructor(@Inject(APP_CONFIG) private config: AppConfig, private translate: TranslateService,
    private navCtrl: NavController, private toastCtrl: ToastController) {
    this.user = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
    this.userAdmin = JSON.parse(window.localStorage.getItem(Constants.USER_ADMIN_KEY));
  }


  conversation() {
    this.navCtrl.pop();
    if (!this.user) {
      this.translate.get("auth_required").subscribe(value => this.showToast(value));
    }
    if (this.user && this.userAdmin) {
      let chat = new Chat();
      chat.chatId = this.userAdmin.id + "admin";
      chat.chatImage = (this.userAdmin.avatar_url && this.userAdmin.avatar_url.length) ? this.userAdmin.avatar_url : "assets/imgs/empty_dp.png";
      chat.chatName = this.config.appName;
      chat.chatStatus = this.config.appName;
      chat.myId = this.user.id + "customer";
      this.navCtrl.push(ConversationPage, { chat: chat });
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
