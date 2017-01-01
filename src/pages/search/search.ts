import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the Search page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-search',
    templateUrl: 'search.html'
})
export class SearchPage {

    constructor(public viewCtrl: ViewController
                ,params: NavParams) {}

    ionViewDidLoad() {
        console.log('Hello SearchPage Page');
    }

    dismiss(search) {
        let data ={};

        if (search)
            data = { 'search': '자전거' };

        this.viewCtrl.dismiss(data);
    }
}
