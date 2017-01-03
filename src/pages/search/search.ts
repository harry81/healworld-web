import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { CookieService } from 'angular2-cookie/core';

@Component({
    selector: 'page-search',
    templateUrl: 'search.html'
})
export class SearchPage {
    public searchForm: any;

    constructor(public viewCtrl: ViewController
                ,params: NavParams
                ,private _cookieService: CookieService,
                private formBuilder: FormBuilder) {

        this.searchForm = this.formBuilder.group({
            'search': [
                '', Validators.compose([Validators.required])
            ],
            'dist': ['', Validators.compose([Validators.required])]
        });
    }

    ionViewDidLoad() {
        let data: any;
        data = this._cookieService.getObject('search_data');

        if (data)
            this.searchForm.patchValue(data);
    }

    dismiss(search) {
        let data ={};

        if (search != false) {
            data = this.searchForm.value;
            this._cookieService.putObject('search_data', data);
        }

        this.viewCtrl.dismiss(data);
    }
}
