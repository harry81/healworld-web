import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
    public lat: number;
    public lng: number;
    public zoom: number;

    constructor(public navCtrl: NavController,
                public params:NavParams) {

        this.lat = params.get('lat');
        this.lng = params.get('lng');
        this.zoom = params.get('zoom');
    }

    ionViewDidLoad() {
        console.log('Hello MapPage Page');
    }

}
