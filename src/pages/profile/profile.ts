import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';

/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html',
    providers: [AuthService]
})
export class ProfilePage {

    constructor(public navCtrl: NavController
                ,public auth: AuthService
               ) {
    }

    ionViewDidLoad() {
        this.auth.authenticated();
    }

}
