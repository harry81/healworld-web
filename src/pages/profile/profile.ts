import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';

declare var fooga:Function;

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
        fooga('send', 'pageview', 'PorfilePage');
        this.setUserProfile();
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
        fooga('send', 'event', 'Profilepage', 'subscribe', this.notification_push);

        if (this.notification_push == true) {
            window['subscribe'].call();
        }

        else if (this.notification_push == false) {
            window['unsubscribeToPush'].call();
        }
    }

    logout() {
        fooga('send', 'event', 'Profilepage', 'logout');
        this.authService.loggedOut();
    }

}
