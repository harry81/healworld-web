import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { CookieService } from 'angular2-cookie/core';

@Component({
    selector: 'page-search',
    templateUrl: 'search.html'
})
export class SearchPage {
    public search: string;
    public dist: string;

    constructor(public viewCtrl: ViewController
                ,params: NavParams
                ,private _cookieService: CookieService) {

        this.search = 'hi';
        this.dist = '10';

    }

    ionViewDidLoad() {
        let data: any;
        data = this._cookieService.getObject('search_data');

        this.search = data.search;
        this.dist = data.dist;
    }

    dismiss(search) {
        let data ={};

        if (search != false) {
            data = { 'search': this.search,
                     'dist': this.dist};
            this._cookieService.putObject('search_data', data);
        }

        this.viewCtrl.dismiss(data);
    }
}
