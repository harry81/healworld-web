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
    public search: string;
    public brightness: number;

    constructor(public viewCtrl: ViewController
                ,params: NavParams) {
        this.search = 'hi';
        this.brightness = 10;

    }

    ionViewDidLoad() {
    }

    dismiss(search) {
        let data ={};

        if (search)
            data = { 'search': this.search };

        this.viewCtrl.dismiss(data);
    }
}
