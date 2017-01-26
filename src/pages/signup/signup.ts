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
    submitAttempt: boolean = false;

    public error = {
        phone:  [],
        verified_code:  [],
        password1:  [],
        password2:  []
    };

    constructor(public navCtrl: NavController
                ,public navParams: NavParams
                ,public authService: AuthService
                ,private formBuilder: FormBuilder) {

        this.signupform = this.formBuilder.group({
            'username': [
                '', Validators.compose([Validators.minLength(11), Validators.required])
            ],
            'verified_code': [
                '', Validators.compose([Validators.minLength(4), Validators.required])
            ],
            'password1': [
                '', Validators.compose([Validators.minLength(8), Validators.required])
            ],
            'password2': [
                '', Validators.compose([Validators.minLength(8), Validators.required])
            ],
            'nick': [],
        });

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SignupPage');
    }

    doSignup() {
        this.submitAttempt = true;

        console.log('signup', this.signupform.value);
        this.authService.signup(this.signupform.value)
            .subscribe(data=> {
                console.log('ok');
            }, error => {
                let parsed_error = error['_body'];
                this.error = JSON.parse(parsed_error);
                console.log('error', this.error);
            });
    }
}
