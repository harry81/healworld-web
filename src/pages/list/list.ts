import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ItemService } from '../../providers/item-service';
import { DetailPage } from '../detail/detail';

@Component({
    selector: 'page-list',
    templateUrl: 'list.html',
    providers: [ItemService]
})

export class ListPage {
    public items: any;

    detailPage = DetailPage;

    constructor(public navCtrl: NavController,
                public itemService: ItemService) {}

    ionViewDidLoad() {
        this.loadItem();
    }

    loadItem(){
        this.itemService.load()
            .then(data => {
                this.items = data.results.features;
            });
    }

    itemTapped(item, event) {
        this.navCtrl.push(DetailPage, {
            item: item
        });
    }
}
