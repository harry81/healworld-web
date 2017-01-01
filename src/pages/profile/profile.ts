import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { URLSearchParams } from '@angular/http';
import { ItemService } from '../../providers/item-service';
import { GeoService } from '../../providers/geo-service';
import { AuthService } from '../../providers/auth-service';

/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html',
    providers: [ItemService, AuthService, GeoService]
})

export class ProfilePage {
    public user: any;
    public social_auth: any;
    public username: string;
    public provider: string;
    public facebook_id: string;
    public notification_push: any;
    public response: any;
    public items: Array<any> = [];

    public params: URLSearchParams = new URLSearchParams();

    constructor(public navCtrl: NavController
                ,public itemService: ItemService
                ,public authService: AuthService
                ,public geoService: GeoService
               ) {
        this.setUserProfile();
    }

    ionViewWillEnter() {
        this.params.set('state', `created`);

        if (this.user) {
            this.params.set('user', this.user.pk);
        }

        this.loadItems();
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

    loadItems(overwrite=false){
        let user = localStorage.getItem('user');

        if (user == undefined ) {
            this.items = null;
            return;
        }

        this.geoService.getPosition()
            .then(position =>{
                this.params.set('point',
                                `${this.geoService.position.coords.longitude},${this.geoService.position.coords.latitude}`);

                this.itemService.loadItems(this.params)
                    .subscribe(data => {
                        this.items = data.results.features;
                        this.response = data;
                        console.log('data loaditem', data);
                        // this.updateItem(data, overwrite);
                    });
            },
                  error => {
                      switch(error.code) {
                      case error.PERMISSION_DENIED:
                          break;
                      default:
                          alert(error);
                      }
                  });
    }

    logout() {
        this.authService.loggedOut();
        this.items = null;
    }

}
