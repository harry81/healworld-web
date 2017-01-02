import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { ListPage } from '../pages/list/list';
import { ProfilePage } from '../pages/profile/profile';
import { DesktopPage } from '../pages/desktop/desktop';
import { MyitemPage } from '../pages/myitem/myitem';
import { AuthService } from '../providers/auth-service';


@Component({
    templateUrl: 'app.html',
    providers: [AuthService]

})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = ListPage;

    pages: Array<{title: string, component: any}>;

    public user: {profile_picture_url: string,
                  username: string};


    constructor(public platform: Platform
                ,public authService: AuthService
               ) {
        this.initializeApp();

        // used for an example of ngFor and navigation
        this.pages = [
            { title: '목록', component: ListPage },
            { title: '계정', component: ProfilePage },
            { title: '나의 아이템', component: MyitemPage }
        ];
        this.user = {profile_picture_url: '/assets/imgs/person.png',
                     username: '방문자'};

        if (this.platform.is('core')) {
            this.rootPage = DesktopPage;
        };

        if (localStorage.hasOwnProperty('user'))
            this.user = JSON.parse(localStorage.getItem('user'));
    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            Splashscreen.hide();
        });
    }

    openPage(page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    }
}
