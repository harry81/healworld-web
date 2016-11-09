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
    lat: number = 51.678418;
    lng: number = 7.809007;

    constructor(public navCtrl: NavController,
                public itemService: ItemService) {}

    ionViewDidLoad() {
        console.log('Hello ListPage Page');
        this.loadItem();
    }

    loadItem(){
        this.itemService.load()
            .then(data => {
                this.items = data.results;
            });
        console.log('items', this.items);
    }
}
