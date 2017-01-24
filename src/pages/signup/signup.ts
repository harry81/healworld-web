import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../providers/auth-service';

@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html',
    providers: [AuthService]
})
export class SignupPage {
    public signupform: any;

    constructor(public navCtrl: NavController
                ,public navParams: NavParams
                ,public authService: AuthService
                ,private formBuilder: FormBuilder) {

        this.signupform = this.formBuilder.group({
            'phone': [
                '', Validators.compose([Validators.required])
            ],
            'verified_code': [
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

    doSignup() {
        console.log('signup', this.signupform.value);
        this.authService.signup(this.signupform.value)
            .subscribe(data=> {
                console.log('ok');
            });
    }
}
