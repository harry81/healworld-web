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

    public coord: {lat:string, lan:string};

    constructor(public navCtrl: NavController,
                public params:NavParams) {

        this.lat = params.get('lat');
        this.lng = params.get('lng');
        this.zoom = params.get('zoom');

        let position = sessionStorage.getItem('position');
        let parse_position = JSON.parse(position);
        this.coord = parse_position;
    }

    ionViewDidLoad() {
        console.log('Hello MapPage Page');
    }

}
