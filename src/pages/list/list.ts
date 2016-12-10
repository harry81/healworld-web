import { Component } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { NavController, LoadingController } from 'ionic-angular';
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
    public loader: any;

    public params: URLSearchParams = new URLSearchParams();

    constructor(public navCtrl: NavController
                ,public itemService: ItemService
                ,public loadingCtrl: LoadingController) {

        // params.set('dist', `3`);
        // params.set('point', `118.507629,36.1459654`);
        this.params.set('search', ``);
    }

    ionViewWillEnter() {
        if (this.items == null)
        this.loadItems(true);
    }

    ionViewDidLoad() {
    }

    updateItem(data, overwrite=false){
        if (overwrite == true) {
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
                    if (data.previous != null)
                        this.items.push(obj);
                    else {
                        this.items.unshift(obj);
                    }
                }
            }
        }
        this.next_url = data.next;
    }

    loadItems(overwrite=false){
        this.loader = this.loadingCtrl.create({
            content: "Please wait...",
            duration: 3000
        });

        this.loader.present();

        this.itemService.loadItems(this.params)
            .subscribe(data => {
                this.updateItem(data, overwrite);
                this.loader.dismiss();

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
        this.itemService.loadItems(this.params)
            .subscribe(data => {
                this.updateItem(data);
                refresher.complete();
            });
    }

    doInfinite(infiniteScroll) {
        setTimeout(() => {
            if (this.next_url != null)
                this.itemService.loadItemsbyUrl(this.next_url)
                .subscribe(data => {
                    this.updateItem(data);
                })
            infiniteScroll.complete();
        }, 500);
    }

    onSearchInput(ev){
        let val = ev.target.value;
        this.params.set('search', val);
        this.loadItems(true);
    }

    locatePosition() {
        console.log('locate ');
    }
}
