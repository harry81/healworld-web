import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ItemService } from '../../providers/item-service';

@Component({
    selector: 'page-detail',
    templateUrl: 'detail.html',
    providers: [ItemService]
})

export class DetailPage {
    public lat: number;
    public lng: number;
    public item: any;

    constructor(public navCtrl: NavController,
                public params:NavParams,
                public itemService: ItemService) {

        this.item = params.get("item");
    }

    ionViewDidLoad() {
        this.loadItem(this.item);
    }

    loadItem(item){
        this.itemService.loadItem(item.properties.pk)
            .then(data => {
                this.lat = data['geometry']['coordinates'][1];
                this.lng = data['geometry']['coordinates'][0];
            });
    }
}
