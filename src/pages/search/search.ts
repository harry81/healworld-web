import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { CookieService } from 'angular2-cookie/core';
import { GeoService } from '../../providers/geo-service';

declare var fooga:Function;

@Component({
    selector: 'page-search',
    templateUrl: 'search.html',
    providers: [GeoService]
})
export class SearchPage {
    public searchForm: any;

    constructor(public viewCtrl: ViewController
                ,params: NavParams
                ,private _cookieService: CookieService
                ,public geoService: GeoService
                ,private formBuilder: FormBuilder) {

        fooga('send', 'pageview', 'SearchPage');

        this.searchForm = this.formBuilder.group({
            'search': [''],
            'dist': ['', Validators.compose([Validators.required])]
        });
    }

    ionViewDidLoad() {
        let data: any;
        data = this._cookieService.getObject('search_data');

        if (!data)
            data = {search:'', dist:'10000'};

        this.searchForm.patchValue(data);
    }

    locateHere () {
        console.log('locate here');
        this.geoService.getPosition()
            .then(data => {
                console.log('data', data);
            }, error => {
                console.log('error', error);
            });
    }

    dismiss(search) {
        let data ={};

        if (search != false) {
            data = this.searchForm.value;
            this._cookieService.putObject('search_data', data);
            fooga('send', 'event', 'SearchPage', 'data', JSON.stringify(data));
        }

        this.viewCtrl.dismiss(data);
    }
}
