import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Constants } from "../../models/constants.models";
import { UserResponse } from "../../models/user-response.models";
import {LoginPage} from "../login/login";

@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html'
})
export class NotificationPage {
  
  items = [
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
    }
    ,
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
  private user: UserResponse;
  constructor(public navCtrl: NavController) {
    this.user = JSON.parse(window.localStorage.getItem(Constants.USER_KEY));
  }

  login(){
    this.navCtrl.push(LoginPage);
  }
}
