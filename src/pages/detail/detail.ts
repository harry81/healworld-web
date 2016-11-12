import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html'
})
export class DetailPage {
    public lat: number;
    public lng: number;
    public item: any;

    constructor(public navCtrl: NavController, public params:NavParams) {
        this.item = params.get("item");
        console.log('item', this.item);
    }

    ionViewDidLoad() {
        console.log('Hello DetailPage Page');
        this.setLocation(this);
    }

    setLocation(self){
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                self.lat = pos.lat;
                self.lng = pos.lng;
            });
        }
    }
}
