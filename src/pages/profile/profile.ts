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

    constructor(public navCtrl: NavController
                ,public authService: AuthService
               ) {
        this.setUserInfo();
    }

    ionViewWillEnter() {
    }

    setUserInfo() {
        this.authService.getUserInfo()
            .subscribe(data => {
                localStorage.setItem('user', JSON.stringify(data));

                let user = localStorage.getItem('user');
                this.user = JSON.parse(user);
                this.username = this.user.username;

                if (this.username != ""){
                    this.social_auth = this.user.social_auth[0];
                    this.provider = this.social_auth.provider;
                    this.facebook_id = this.social_auth.extra_data.id;
                }
            });
    }
}
