import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ItemService } from '../../providers/item-service';
import { DetailPage } from '../detail/detail';
import { PostPage } from '../post/post';

@Component({
    selector: 'page-list',
    templateUrl: 'list.html',
    providers: [ItemService]
})

export class ListPage {
    public items: any;

    constructor(public navCtrl: NavController,
                public itemService: ItemService) {}

    ionViewDidLoad() {
        this.loadItem();
    }

    updateItem(data){
        this.items = data.results.features;
    }

    loadItem(){
        console.log('loadItem in list');
        this.itemService.loadItem()
            .then(data => {
                this.updateItem(data);
            });
    }

    itemTapped(item, event) {
        this.navCtrl.push(DetailPage, {
            item: item
        });
    }

    addItem() {
        this.navCtrl.push(PostPage);
    }

    doRefresh(refresher) {
        this.itemService.loadItem()
            .then(data => {
                this.updateItem(data);
                refresher.complete();
            });
    }
}
