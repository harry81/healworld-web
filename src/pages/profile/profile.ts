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
    public user: any;
    public social_auth: any;
    public username: string;
    public provider: string;
    public facebook_id: string;
    public notification_push: any;

    constructor(public navCtrl: NavController
                ,public authService: AuthService
               ) {
        this.setUserProfile();
    }

    ionViewWillEnter() {
    }

    setUserProfile() {
        let user = localStorage.getItem('user');

        if (user == undefined )
            return;

        this.user = JSON.parse(user);
        this.username = this.user.username;
        if (this.username != ""){
            this.social_auth = this.user.social_auth[0];
            this.provider = this.social_auth.provider;
            this.facebook_id = this.social_auth.extra_data.id;

            if (this.user.notification_push)
                this.notification_push = true;
        }
    }

    subscribeToPush() {
        if (this.notification_push == true) {
            window['subscribe'].call();
        }

        else if (this.notification_push == false) {
            window['unsubscribeToPush'].call();
        }
    }
}
