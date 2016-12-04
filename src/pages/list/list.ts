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
    public items: any[];
    public next_url: string;
    public search_input: string="Heal World";

    constructor(public navCtrl: NavController,
                public itemService: ItemService) {}

    ionViewDidLoad() {
        this.loadItem();
    }

    updateItem(data){

        if (this.items == null){
            this.items = data.results.features;
        }

        else {
            for (let idx_data in data.results.features) {
                let obj = data.results.features[idx_data];
                let exist = false;

                for (let idx_item in this.items) {
                    if (this.items[idx_item].properties.pk == obj.properties.pk){
                        exist = true;
                        break;
                    }
                }

                if (exist == false){
                    this.items.push(obj);
                }
            }
        }
        this.next_url = data.next;
    }

    loadItem(){
        this.itemService.loadItem("", this.next_url)
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

    doInfinite(infiniteScroll) {
        setTimeout(() => {
            if (this.next_url != null)
                this.loadItem();
            infiniteScroll.complete();
        }, 500);
    }

    onSearchInput(searchbar){

    }
}
