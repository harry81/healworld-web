import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

declare var fooga:Function;

@Component({
    selector: 'page-desktop',
    templateUrl: 'desktop.html'
})
export class DesktopPage {

    constructor(public navCtrl: NavController) {
        fooga('send', 'event', 'DesktopPage', 'open', navigator.userAgent);
    }

    ionViewDidLoad() {
    }

}
