import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the Myitem page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-myitem',
  templateUrl: 'myitem.html'
})
export class MyitemPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello MyitemPage Page');
  }

}
