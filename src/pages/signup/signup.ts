import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html'
})
export class SignupPage {
    public signupform: any;

    constructor(public navCtrl: NavController
                ,public navParams: NavParams
                ,private formBuilder: FormBuilder) {

        this.signupform = this.formBuilder.group({
            'phone': [
                '', Validators.compose([Validators.required])
            ],
            'verified_number': [
                '', Validators.compose([Validators.required])
            ],
            'password1': [
                '', Validators.compose([Validators.required])
            ],
            'password2': [
                '', Validators.compose([Validators.required])
            ],
            'nick': [],
        });

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SignupPage');
    }

}
