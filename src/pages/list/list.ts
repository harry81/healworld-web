import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ItemService } from '../../providers/item-service';

/*
  Generated class for the List page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
    selector: 'page-list',
    templateUrl: 'list.html',
    providers: [ItemService]
})

export class ListPage {
    public items: any;
    public lat: number;
    public lng: number;

    constructor(public navCtrl: NavController,
                public itemService: ItemService) {}

    ionViewDidLoad() {
        console.log('Hello ListPage Page');
        this.loadItem();
        this.setLocation(this);
    }

    loadItem(){
        this.itemService.load()
            .then(data => {
                this.items = data.results;
            });
    }

    setLocation(self){
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                console.log('pos', pos);
                self.lat = pos.lat;
                self.lng = pos.lng;
            });
        }
    }
}
