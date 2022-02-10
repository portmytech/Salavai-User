import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { PaymentPage } from '../payment/payment';
import { TranslateService } from '@ngx-translate/core';
import { TimeSlot } from '../../models/time-slot.models';
import { Constants } from '../../models/constants.models';
import moment from 'moment';

@Component({
  selector: 'page-selectdate',
  templateUrl: 'selectdate.html'
})
export class SelectdatePage {
  dnt: string = "pick";
  private dates: Array<Date> = [];
  private times: Array<TimeSlot>;
  private availabilityTimes: Array<Array<TimeSlot>>;
  private datePickupSelectedIndex = -1;
  private timePickupSelectedIndex = -1;
  private dateDeliverySelectedIndex = -1;
  private timeDeliverySelectedIndex = -1;
  private weekDaysTrans: Array<String>;
  private monthsTrans: Array<String>;
  private selectionDateHeading: string;
  private selectionTimeHeading: string;
  private pickupDateTime: Date;
  private deliveryDateTime: Date;
  private pickupSlot: string;
  private deliverySlot: string;

  constructor(public navCtrl: NavController, private toastCtrl: ToastController, private translate: TranslateService) {
    this.translate.get(['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']).subscribe(res => {
      this.weekDaysTrans = new Array<String>();
      this.weekDaysTrans.push(res.sun);
      this.weekDaysTrans.push(res.mon);
      this.weekDaysTrans.push(res.tue);
      this.weekDaysTrans.push(res.wed);
      this.weekDaysTrans.push(res.thu);
      this.weekDaysTrans.push(res.fri);
      this.weekDaysTrans.push(res.sat);
    });
    this.translate.get(['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']).subscribe(res => {
      this.monthsTrans = new Array<String>();
      this.monthsTrans.push(res.jan);
      this.monthsTrans.push(res.feb);
      this.monthsTrans.push(res.mar);
      this.monthsTrans.push(res.apr);
      this.monthsTrans.push(res.may);
      this.monthsTrans.push(res.jun);
      this.monthsTrans.push(res.jul);
      this.monthsTrans.push(res.aug);
      this.monthsTrans.push(res.sep);
      this.monthsTrans.push(res.oct);
      this.monthsTrans.push(res.nov);
      this.monthsTrans.push(res.dec);
    });
    this.translate.get((this.dnt == "pick") ? "select_pickdate" : "select_deliverydate").subscribe(value => this.selectionDateHeading = value);
    this.translate.get((this.dnt == "pick") ? "select_picktime" : "select_deliverytime").subscribe(value => this.selectionTimeHeading = value);
    for (let i = 0; i < 14; i++) {
      let d = new Date();
      d.setDate(d.getDate() + i);
      this.dates.push(d);
    }
    this.setupAvailability();
    this.selectpickDate(0);
  }

  onSegmentChange() {
    this.translate.get((this.dnt == "pick") ? "select_pickdate" : "select_deliverydate").subscribe(value => this.selectionDateHeading = value);
    this.translate.get((this.dnt == "pick") ? "select_picktime" : "select_deliverytime").subscribe(value => this.selectionTimeHeading = value);
    let indexToShow = this.dnt == "pick" ? this.datePickupSelectedIndex : this.dateDeliverySelectedIndex;
    this.selectDate((indexToShow && indexToShow > -1) ? indexToShow : 0);

    if (this.dnt != "pick") {
      setTimeout(() => this.selectDate(this.dates[this.datePickupSelectedIndex + 1] ? this.datePickupSelectedIndex + 1 : this.dates.length - 1), 100);
    }
  }

  selectDate(index) {
    console.log(index);
    if (this.dnt == "pick") {
      if (this.datePickupSelectedIndex != index) {
        this.timePickupSelectedIndex = -1;
        this.pickupDateTime = null;
      }
      this.selectpickDate(index);
    } else {
      if (this.dateDeliverySelectedIndex != index) {
        this.timeDeliverySelectedIndex = -1;
        this.deliveryDateTime = null;
      }
      this.selectDeliverytDate(index);
    }
  }

  selectTime(index) {
    if (this.dnt == "pick") {
      this.selectpickTime(index);
      this.markPickupDateTime();
    } else {
      this.selectDeliveryTime(index);
      this.markDeliveryDateTime();
    }
  }

  isTimeSelected(index): boolean {
    if (this.dnt == "pick") {
      return this.timePickupSelectedIndex == index;
    } else {
      return this.timeDeliverySelectedIndex == index;
    }
  }

  isDateSelected(index): boolean {
    if (this.dnt == "pick") {
      return this.datePickupSelectedIndex == index;
    } else {
      return this.dateDeliverySelectedIndex == index;
    }
  }

  setupAvailability() {
    this.availabilityTimes = new Array<Array<TimeSlot>>();
    for (let i = 0; i < 14; i++) {
      this.availabilityTimes.push(new Array<TimeSlot>());
    }
    let timeSlots: Array<TimeSlot> = JSON.parse(window.localStorage.getItem(Constants.TIME_SLOTS));
    for (let ts of timeSlots) {
      ts.time_text = ts.start_time.substr(0, ts.start_time.lastIndexOf(":")) + " - " + ts.end_time.substr(0, ts.end_time.lastIndexOf(":"));
      let dayCaps = String(ts.day).toUpperCase();
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
  }

  selectpickDate(index) {
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
  }

  selectpickTime(index) {
    this.timePickupSelectedIndex = index;
  }

  selectDeliverytDate(index) {
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

  }

  selectDeliveryTime(index) {
    this.timeDeliverySelectedIndex = index;
  }

  markPickupDateTime() {
    if (this.dates[this.datePickupSelectedIndex] && this.times[this.timePickupSelectedIndex]) {
      this.pickupDateTime = moment(moment(this.dates[this.datePickupSelectedIndex]).format("YYYY-MM-DD") + ' ' + this.times[this.timePickupSelectedIndex].start_time).toDate();
      this.pickupSlot = this.times[this.timePickupSelectedIndex].time_text;
    }
  }

  markDeliveryDateTime() {
    if (this.dates[this.dateDeliverySelectedIndex] && this.times[this.timeDeliverySelectedIndex]) {
      this.deliveryDateTime = moment(moment(this.dates[this.dateDeliverySelectedIndex]).format("YYYY-MM-DD") + ' ' + this.times[this.timeDeliverySelectedIndex].start_time).toDate();
      this.deliverySlot = this.times[this.timeDeliverySelectedIndex].time_text;
    }
  }

  payment() {
    if (!this.pickupDateTime) {
      this.translate.get('select_pickup_time').subscribe(value => this.showToast(value));
    } else if (!this.deliveryDateTime) {
      this.dnt = "delivery";
      this.translate.get('select_delivery_time').subscribe(value => this.showToast(value));
    } else {
      let nowTime = new Date();

      if (this.pickupDateTime < nowTime) {
        this.translate.get('pickup_time_passed').subscribe(value => this.showToast(value));
      } else if (this.deliveryDateTime < nowTime) {
        this.translate.get('delivery_time_passed').subscribe(value => this.showToast(value));
      } else if (this.deliveryDateTime <= this.pickupDateTime) {
        this.translate.get('pickup_time_greater').subscribe(value => this.showToast(value));
      } else {
        this.navCtrl.push(PaymentPage, { pickupTime: this.pickupDateTime.getTime(), pickupSlot: this.pickupSlot, deliveryTime: this.deliveryDateTime.getTime(), deliverySlot: this.deliverySlot });
      }
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
