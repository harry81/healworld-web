import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar, Splashscreen, Deeplinks } from 'ionic-native';

import { TabsPage } from '../pages/tabs/tabs';
import { DetailPage } from '../pages/detail/detail';

@Component({
    template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
    rootPage = TabsPage;
    @ViewChild(NavController) navChild:NavController;

    constructor(public platform: Platform) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            Splashscreen.hide();
        });
    }
    ngAfterViewInit() {
        this.platform.ready().then(() => {
            // Convenience to route with a given nav
            Deeplinks.routeWithNavController(this.navChild, {
                '/detail/:id': DetailPage
            }).subscribe((match) => {
                console.log('Successfully routed', match);
            }, (nomatch) => {
                console.warn('Unmatched Route', nomatch);
            });
        })
    }
}
