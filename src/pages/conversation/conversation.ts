import { Component, ViewChild, Inject } from '@angular/core';
import { Chat } from '../../models/chat.models';
import { UserResponse } from '../../models/user-response.models';
import { Message } from '../../models/message.models';
import { NavParams, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { OneSignal } from '@ionic-native/onesignal';
import { Constants } from '../../models/constants.models';
import { Helper } from '../../models/helper.models';
import { APP_CONFIG, AppConfig } from '../../app/app.config';
import * as firebase from 'firebase/app';

@Component({
  selector: 'page-conversation',
  templateUrl: 'conversation.html'
})
export class ConversationPage {
  @ViewChild('content') content: any;
  private chat: Chat;
  private userMe: UserResponse;
  private chatChild: string;
  private userPlayerId: string;
  private newMessageText: string;
  private chatRef: firebase.database.Reference;
  private inboxRef: firebase.database.Reference;
  private messages = new Array<Message>();

  constructor(@Inject(APP_CONFIG) private config: AppConfig, navParam: NavParams, private toastCtrl: ToastController,
    private oneSignal: OneSignal, private translate: TranslateService) {
    this.chat = navParam.get('chat');
    this.userMe = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
    this.chatChild = Helper.getChatChild(this.chat.myId, this.chat.chatId);

    const component = this;
    this.inboxRef = firebase.database().ref(Constants.REF_INBOX);
    this.chatRef = firebase.database().ref(Constants.REF_CHAT);
    this.chatRef.child(this.chatChild).limitToLast(20).on("child_added", function (snapshot, prevChildKey) {
      var newMessage = snapshot.val() as Message;
      if (newMessage) {
        newMessage.timeDiff = Helper.formatMillisDateTime(Number(newMessage.dateTimeStamp), Helper.getLocale());
        component.addMessage(newMessage);
        component.markDelivered();
        component.scrollList();
      }
    }, function (error) {
      console.error("child_added", error);
    });

    firebase.database().ref(Constants.REF_USERS_FCM_IDS).child(this.chat.chatId).once("value", function (snap) {
      component.userPlayerId = snap.val();
    });
    this.translate.get("just_a_moment").subscribe(value => {
      this.showToast(value);
    });
  }

  ionViewDidEnter() {
    this.scrollList();
  }

  scrollList() {
    this.content.scrollToBottom(300);//300ms animation speed
  }

  notifyMessage(msg: Message) {
    this.translate.get(['new_msg', 'new_msg_from']).subscribe(value => {
      this.oneSignal.postNotification({
        include_player_ids: [this.userPlayerId],
        headings: { en: value['new_msg'] },
        contents: { en: (value['new_msg_from'] + " " + this.config.appName) },
        data: { msg: msg }
      }).then(res => console.log(res)).catch(err => console.log(err));
    });
  }

  markDelivered() {
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
  }

  addMessage(msg: Message) {
    this.messages = this.messages.concat(msg);
    //this.storage.set(Constants.KEY_MESSAGES + this.chatChild, this.messages);
    if (this.chat && msg) {
      let isMeSender = msg.senderId == this.chat.myId;
      this.chat.chatImage = isMeSender ? msg.recipientImage : msg.senderImage;
      this.chat.chatName = isMeSender ? msg.recipientName : msg.senderName;
      this.chat.chatStatus = isMeSender ? msg.recipientStatus : msg.senderStatus;
    }
  }

  send() {
    if (this.newMessageText && this.newMessageText.trim().length) {
      let toSend = new Message();
      toSend.chatId = this.chatChild;
      toSend.body = this.newMessageText;
      toSend.dateTimeStamp = String(new Date().getTime());
      toSend.delivered = false;
      toSend.sent = true;
      toSend.recipientId = this.chat.chatId;
      toSend.recipientImage = this.chat.chatImage;
      toSend.recipientName = this.chat.chatName;
      toSend.recipientStatus = this.chat.chatStatus;
      toSend.senderId = this.chat.myId;
      toSend.senderName = this.userMe.first_name;
      toSend.senderImage = (this.userMe.avatar_url && this.userMe.avatar_url.length) ? this.userMe.avatar_url : "assets/imgs/empty_dp.png";
      toSend.senderStatus = this.config.appName;
      toSend.id = this.chatRef.child(this.chatChild).push().key;

      this.chatRef.child(this.chatChild).child(toSend.id).set(toSend).then(res => {
        this.inboxRef.child(toSend.recipientId).child(toSend.senderId).set(toSend);
        this.inboxRef.child(toSend.senderId).child(toSend.recipientId).set(toSend);
        this.newMessageText = '';
        this.notifyMessage(toSend);
      });
    } else {
      this.translate.get("type_message").subscribe(value => this.showToast(value));
    }
  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

}